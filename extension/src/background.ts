import browser from 'webextension-polyfill';
import {
  BookmarkNode, BackgroundMessage, BackgroundResponse,
  StatusResponse, ScheduleSettings, ExtensionSettings,
  DEFAULT_SCHEDULE, DEFAULT_PORT, ALARM_NAME,
} from './types.js';
import type { AutoSyncMode } from './types.js';
import {
  loadFilterConfig, filterBookmarkTree, getExcludedFolderIds
} from './filters.js';

// ================================================================
// Stałe
// ================================================================

const POLL_ALARM   = 'bookmark-sync-poll';    // sprawdzanie chmury
const DEBOUNCE_MS  = 5000;                    // 5 sekund debounce
let   debounceTimer: ReturnType<typeof setTimeout> | null = null;
let   isImporting  = false;                   // blokada podczas importu

// ================================================================
// Instance ID
// ================================================================

async function getInstanceId(): Promise<string> {
  const data = await browser.storage.local.get('instanceId');
  if (data.instanceId) return data.instanceId as string;
  const id = crypto.randomUUID();
  await browser.storage.local.set({ instanceId: id });
  return id;
}

// ================================================================
// Ustawienia
// ================================================================

async function getSettings(): Promise<ExtensionSettings> {
  const data = await browser.storage.local.get([
    'syncDirectory', 'hostPort', 'instanceId',
    'lastSaveTime', 'lastSaveCount', 'schedule', 'lastSyncTime',
  ]);
  return {
    syncDirectory: (data.syncDirectory as string) ?? '',
    hostPort:      (data.hostPort as number)      ?? DEFAULT_PORT,
    instanceId:    (data.instanceId as string)    ?? await getInstanceId(),
    lastSaveTime:  data.lastSaveTime  as string | undefined,
    lastSaveCount: data.lastSaveCount as number | undefined,
    lastSyncTime:  data.lastSyncTime  as string | undefined,
    schedule:      (data.schedule as ScheduleSettings) ?? DEFAULT_SCHEDULE,
  };
}

// ================================================================
// Nazwa przeglądarki
// ================================================================

function getBrowserName(): string {
  // Rozpoznajemy per silnik przeglądarki:
  // - rozszerzenie Firefox (scripts) = Gecko = Firefox i wszystkie forki (Waterfox, LibreWolf...)
  // - rozszerzenie Chrome (service_worker) = Chromium = Chrome, Opera, Edge, Brave, Vivaldi...
  return navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Chrome';
}

// ================================================================
// Ping
// ================================================================

async function pingHost(port: number, instanceId: string): Promise<string> {
  try {
    const resp = await fetch(`http://localhost:${port}/ping`, {
      method: 'GET',
      headers: { 'X-Instance-Id': instanceId, 'X-Browser': getBrowserName() },
      signal: AbortSignal.timeout(3000),
    });
    const data = await resp.json() as { success: boolean; error?: string };
    if (data.success) return 'ok';
    if (data.error === 'PENDING_APPROVAL') return 'pending';
    if (data.error === 'NO_PROFILES')      return 'no_profiles';
    return 'not_allowed';
  } catch {
    return 'no_host';
  }
}

// ================================================================
// Status chmury — sprawdź lastModified
// ================================================================

async function getCloudLastModified(port: number, instanceId: string): Promise<string | null> {
  try {
    const resp = await fetch(`http://localhost:${port}/status`, {
      headers: { 'X-Instance-Id': instanceId },
      signal: AbortSignal.timeout(3000),
    });
    const raw = await resp.json() as { success: boolean; path?: string; lastModified?: string };
    if (!raw.success) return null;
    // Host zwraca dane w path jako JSON string
    if (raw.path) {
      try {
        const parsed = JSON.parse(raw.path) as { lastModified?: string };
        return parsed.lastModified ?? null;
      } catch { }
    }
    return raw.lastModified ?? null;
  } catch {
    return null;
  }
}

// ================================================================
// Dynamiczna ikona
// ================================================================

type IconState = 'green' | 'yellow' | 'red' | 'gray';

function drawIcon(state: IconState): ImageData {
  const size   = 128;
  const canvas = new OffscreenCanvas(size, size);
  const ctx    = canvas.getContext('2d')!;

  // Tło — fioletowe
  ctx.fillStyle = '#7c6af7';
  ctx.beginPath();
  ctx.roundRect(4, 4, size - 8, size - 8, 20);
  ctx.fill();

  // Kolor literki B
  const colors: Record<IconState, string> = {
    green:  '#50fa7b',
    yellow: '#f1fa8c',
    red:    '#ff5555',
    gray:   '#aaaaaa',
  };

  ctx.fillStyle = colors[state];
  ctx.font      = `bold ${size * 0.65}px Arial`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B', size / 2, size / 2 + 4);

  return ctx.getImageData(0, 0, size, size);
}

async function setIconState(state: IconState): Promise<void> {
  try {
    const imageData = drawIcon(state);
    await browser.action.setIcon({ imageData });
  } catch {
    // Niektóre wersje FF nie obsługują OffscreenCanvas w SW — ignoruj
  }
}

// ================================================================
// Konwersja drzewa zakładek
// ================================================================

function convertTree(nodes: browser.bookmarks.BookmarkTreeNode[]): BookmarkNode[] {
  const specialMap: Record<string, BookmarkNode['specialFolder']> = {
    'root________': 'root',   'toolbar_____': 'toolbar',
    'menu________': 'menu',   'unfiled_____': 'unsorted',
    'mobile______': 'mobile',
    '0': 'root', '1': 'toolbar', '2': 'unsorted', '3': 'mobile',
  };
  return nodes.map(node => {
    const result: BookmarkNode = {
      id:           node.id,
      title:        node.title ?? '',
      dateAdded:    node.dateAdded,
      dateModified: (node as any).dateGroupModified ?? (node as any).dateModified,
    };
    if (specialMap[node.id]) result.specialFolder = specialMap[node.id];
    if (node.url) result.url = node.url;
    if (node.children?.length) result.children = convertTree(node.children);
    return result;
  });
}

function countBookmarks(nodes: BookmarkNode[]): number {
  return nodes.reduce((acc, n) => {
    if (n.url) acc++;
    if (n.children) acc += countBookmarks(n.children);
    return acc;
  }, 0);
}

// ================================================================
// Eksport z filtrowaniem
// ================================================================

async function saveBookmarks(): Promise<BackgroundResponse> {
  const settings   = await getSettings();
  const instanceId = settings.instanceId || await getInstanceId();
  const port       = settings.hostPort || DEFAULT_PORT;

  const pingResult = await pingHost(port, instanceId);
  if (pingResult === 'no_host')     { await setIconState('red');    return { success: false, error: 'NO_HOST' }; }
  if (pingResult === 'no_profiles') { await setIconState('yellow'); return { success: false, error: 'NO_PROFILES' }; }
  if (pingResult === 'pending')     return { success: false, error: 'PENDING_APPROVAL' };
  if (pingResult === 'not_allowed') return { success: false, error: 'NOT_ALLOWED' };

  try {
    const tree      = await browser.bookmarks.getTree();
    const converted = convertTree(tree);
    const root      = converted[0];

    const filterConfig      = await loadFilterConfig();
    const excludedFolderIds = getExcludedFolderIds(filterConfig);
    const filtered          = filterBookmarkTree(root, filterConfig, excludedFolderIds);
    if (!filtered) return { success: false, error: 'ALL_FILTERED' };

    const count = countBookmarks(filtered.children ?? []);

    const resp = await fetch(`http://localhost:${port}/save`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'X-Instance-Id': instanceId,
        'X-Browser':     getBrowserName(),
      },
      body: JSON.stringify({
        bookmarks:  filtered,
        timestamp:  new Date().toISOString(),
        browser:    getBrowserName(),
        instanceId,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await resp.json() as { success: boolean; path?: string; error?: string };

    if (data.success) {
      const now = new Date().toISOString();
      await browser.storage.local.set({
        lastSaveTime:  now,
        lastSyncTime:  now,
        lastSaveCount: count,
      });
      await setIconState('green');
      return { success: true, count, path: data.path };
    }
    return { success: false, error: data.error ?? 'Unknown' };

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      await setIconState('red');
      return { success: false, error: 'NO_HOST' };
    }
    return { success: false, error: msg };
  }
}

// ================================================================
// Import
// ================================================================

async function importBookmarks(mode: 'replace' | 'merge', historyFile?: string): Promise<BackgroundResponse> {
  const settings   = await getSettings();
  const instanceId = settings.instanceId || await getInstanceId();
  const port       = settings.hostPort || DEFAULT_PORT;

  const pingResult = await pingHost(port, instanceId);
  if (pingResult === 'no_host')     return { success: false, error: 'NO_HOST' };
  if (pingResult === 'pending')     return { success: false, error: 'PENDING_APPROVAL' };
  if (pingResult === 'not_allowed') return { success: false, error: 'NOT_ALLOWED' };

  try {
    const url = historyFile
      ? `http://localhost:${port}/history/get?file=${encodeURIComponent(historyFile)}`
      : `http://localhost:${port}/import`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: { 'X-Instance-Id': instanceId, 'X-Browser': getBrowserName() },
      signal: AbortSignal.timeout(15000),
    });

    const data = await resp.json() as { success: boolean; path?: string; error?: string };
    if (!data.success) return { success: false, error: data.error ?? 'Błąd serwera' };
    if (!data.path)    return { success: false, error: 'Brak danych z serwera' };

    let bookmarksFile: { bookmarks: BookmarkNode; index?: Record<string, { url: string; title: string; folder: string }> };
    try {
      bookmarksFile = JSON.parse(data.path) as { bookmarks: BookmarkNode; index?: Record<string, any> };
    } catch(e) {
      return { success: false, error: 'Błąd parsowania danych' };
    }

    isImporting = true;
    try {
      if (mode === 'replace') {
        await importReplace(bookmarksFile.bookmarks);
      } else {
        await importMerge(bookmarksFile.bookmarks, settings.lastSyncTime, bookmarksFile.index);
      }
    } finally {
      isImporting = false;
    }

    const now = new Date().toISOString();
    await browser.storage.local.set({ lastSyncTime: now });
    await setIconState('green');
    return { success: true };

  } catch (err: unknown) {
    isImporting = false;
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ================================================================
// Import REPLACE
// ================================================================

async function importReplace(cloudRoot: BookmarkNode): Promise<void> {
  const localTree = await browser.bookmarks.getTree();
  for (const rootNode of localTree) {
    for (const child of rootNode.children ?? []) {
      for (const item of child.children ?? []) {
        await removeBookmarkTree(item.id);
      }
    }
  }
  await importNode(cloudRoot, undefined);
}

// ================================================================
// Import MERGE — dodaj brakujące z właściwą lokalizacją
// ================================================================

async function importMerge(
  cloudRoot: BookmarkNode,
  lastSyncTime?: string,
  cloudIndex?: Record<string, { url: string; title: string; folder: string }>
): Promise<void> {
  const localTree = await browser.bookmarks.getTree();
  const localFlat = flattenLocalTree(localTree);
  const cloudFlat = new Map<string, BookmarkNode>();
  flattenCloudTree(cloudRoot, cloudFlat);

  // Dodaj brakujące
  for (const [url, node] of cloudFlat) {
    if (!localFlat.has(url)) {
      const folderPath = cloudIndex
        ? Object.values(cloudIndex).find(e => e.url === url)?.folder ?? ''
        : '';
      await addBookmarkToFolder(node, folderPath, localTree);
    }
  }
}

// ================================================================
// Import FULL SYNC — dodaj brakujące + usuń nadmiarowe
// ================================================================

async function importFullSync(
  cloudRoot: BookmarkNode,
  cloudIndex?: Record<string, { url: string; title: string; folder: string }>
): Promise<void> {
  const localTree = await browser.bookmarks.getTree();
  const localFlat = flattenLocalTree(localTree);
  const cloudFlat = new Map<string, BookmarkNode>();
  flattenCloudTree(cloudRoot, cloudFlat);

  // Dodaj brakujące
  for (const [url, node] of cloudFlat) {
    if (!localFlat.has(url)) {
      const folderPath = cloudIndex
        ? Object.values(cloudIndex).find(e => e.url === url)?.folder ?? ''
        : '';
      await addBookmarkToFolder(node, folderPath, localTree);
    }
  }

  // Usuń nadmiarowe (są lokalnie ale nie ma ich w chmurze)
  for (const [url, localNode] of localFlat) {
    if (!cloudFlat.has(url)) {
      try { await browser.bookmarks.remove(localNode.id); } catch { }
    }
  }
}

// ================================================================
// Automatyczna synchronizacja z chmury (harmonogram)
// Tylko dodaje brakujące — nie usuwa
// ================================================================

async function autoSyncFromCloud(): Promise<void> {
  if (isImporting) return;

  const settings   = await getSettings();
  const instanceId = settings.instanceId || await getInstanceId();
  const port       = settings.hostPort || DEFAULT_PORT;

  // Sprawdź czy host działa
  const pingResult = await pingHost(port, instanceId);
  if (pingResult !== 'ok') {
    if (pingResult === 'no_host') await setIconState('red');
    return;
  }

  // Sprawdź czy chmura jest nowsza
  const cloudLastModified = await getCloudLastModified(port, instanceId);
  if (!cloudLastModified) return;

  const lastSync = settings.lastSyncTime
    ? new Date(settings.lastSyncTime).getTime()
    : 0;
  const cloudTime = new Date(cloudLastModified).getTime();

  if (cloudTime <= lastSync) {
    // Chmura nie jest nowsza — wszystko zsync
    await setIconState('green');
    return;
  }

  // Chmura jest nowsza — pokaż żółtą ikonę i synchronizuj
  await setIconState('yellow');

  try {
    const resp = await fetch(`http://localhost:${port}/import`, {
      headers: { 'X-Instance-Id': instanceId, 'X-Browser': getBrowserName() },
      signal: AbortSignal.timeout(15000),
    });
    const data = await resp.json() as { success: boolean; path?: string };
    if (!data.success || !data.path) return;

    const bookmarksFile = JSON.parse(data.path) as {
      bookmarks: BookmarkNode;
      index?: Record<string, { url: string; title: string; folder: string }>;
    };

    isImporting = true;
    try {
      const autoMode = settings.schedule.autoSyncMode ?? 'full_sync';
      if (autoMode === 'full_sync') {
        await importFullSync(bookmarksFile.bookmarks, bookmarksFile.index);
      } else {
        await importMerge(bookmarksFile.bookmarks, settings.lastSyncTime, bookmarksFile.index);
      }
    } finally {
      isImporting = false;
    }

    await browser.storage.local.set({ lastSyncTime: new Date().toISOString() });
    await setIconState('green');

  } catch {
    isImporting = false;
  }
}

// ================================================================
// Nasłuchiwanie zmian zakładek (debounce)
// ================================================================

function scheduleBookmarkSave(): void {
  if (isImporting) return; // Ignoruj zmiany podczas importu

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    debounceTimer = null;
    await saveBookmarks();
  }, DEBOUNCE_MS);
}

browser.bookmarks.onCreated.addListener(() => scheduleBookmarkSave());
browser.bookmarks.onRemoved.addListener(() => scheduleBookmarkSave());
browser.bookmarks.onChanged.addListener(() => scheduleBookmarkSave());
browser.bookmarks.onMoved.addListener(()   => scheduleBookmarkSave());

// ================================================================
// Polling ikony — co 30 sekund odśwież stan ikony
// ================================================================
const ICON_ALARM = 'bookmark-sync-icon';

browser.alarms.create(ICON_ALARM, { periodInMinutes: 0.5 }); // co 30 sekund

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ICON_ALARM) {
    const settings   = await getSettings();
    const instanceId = settings.instanceId || await getInstanceId();
    const port       = settings.hostPort || DEFAULT_PORT;
    const ping       = await pingHost(port, instanceId);
    if (ping === 'no_host') await setIconState('red');
    else if (ping === 'ok') {
      const cloudModified = await getCloudLastModified(port, instanceId);
      const lastSync = settings.lastSyncTime ? new Date(settings.lastSyncTime).getTime() : 0;
      const cloudTime = cloudModified ? new Date(cloudModified).getTime() : 0;
      if (cloudTime > lastSync) await setIconState('yellow');
      else await setIconState('green');
    }
  }
});

// ================================================================
// Harmonogram alarmów
// ================================================================

async function applySchedule(schedule: ScheduleSettings): Promise<void> {
  // Stary alarm eksportu (ręczny harmonogram) — czyść
  await browser.alarms.clear(ALARM_NAME);

  // Alarm pollingu chmury
  await browser.alarms.clear(POLL_ALARM);

  if (schedule.mode === 'scheduled' && schedule.intervalMinutes > 0) {
    browser.alarms.create(POLL_ALARM, {
      delayInMinutes:  schedule.intervalMinutes,
      periodInMinutes: schedule.intervalMinutes,
    });
  }
}

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === POLL_ALARM) {
    await autoSyncFromCloud();
  }
});

// ================================================================
// Startup i instalacja
// ================================================================

browser.runtime.onStartup.addListener(async () => {
  const settings   = await getSettings();
  const instanceId = settings.instanceId || await getInstanceId();
  const port       = settings.hostPort || DEFAULT_PORT;

  await applySchedule(settings.schedule);

  // Sprawdź stan hosta i ustaw ikonę
  const pingResult = await pingHost(port, instanceId);
  if (pingResult === 'no_host') {
    await setIconState('red');
  } else {
    // Od razu sprawdź czy chmura jest nowsza
    await autoSyncFromCloud();
  }
});

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    await browser.storage.local.set({
      schedule:   DEFAULT_SCHEDULE,
      hostPort:   DEFAULT_PORT,
      instanceId: crypto.randomUUID(),
    });
  }
  const settings = await getSettings();
  await applySchedule(settings.schedule);
  await setIconState('gray');
});

// ================================================================
// Pomocniki importu
// ================================================================

async function importNode(node: BookmarkNode, parentId: string | undefined): Promise<void> {
  if (node.specialFolder === 'root') {
    for (const child of node.children ?? []) await importNode(child, undefined);
    return;
  }
  if (node.url) {
    const localTree = await browser.bookmarks.getTree();
    const target    = findSpecialFolder(localTree, 'toolbar') ?? localTree[0]?.children?.[0];
    if (target) {
      try { await browser.bookmarks.create({ parentId: parentId ?? target.id, title: node.title, url: node.url }); } catch { }
    }
  } else if (node.specialFolder === 'toolbar' || node.specialFolder === 'menu' || node.specialFolder === 'unsorted') {
    const localTree = await browser.bookmarks.getTree();
    const target    = findSpecialFolder(localTree, node.specialFolder);
    if (target) {
      for (const child of node.children ?? []) await importSubtree(child, target.id);
    }
  } else {
    if (isBrowserSpecificFolder(node.title)) return;
    const localTree = await browser.bookmarks.getTree();
    const toolbar   = findSpecialFolder(localTree, 'toolbar');
    if (toolbar) {
      const folder = await browser.bookmarks.create({ parentId: parentId ?? toolbar.id, title: node.title });
      for (const child of node.children ?? []) await importSubtree(child, folder.id);
    }
  }
}

async function importSubtree(node: BookmarkNode, parentId: string): Promise<void> {
  if (isBrowserSpecificFolder(node.title)) return;
  if (node.url) {
    try { await browser.bookmarks.create({ parentId, title: node.title, url: node.url }); } catch { }
  } else {
    try {
      const folder = await browser.bookmarks.create({ parentId, title: node.title });
      for (const child of node.children ?? []) await importSubtree(child, folder.id);
    } catch { }
  }
}

async function addBookmarkToFolder(
  node: BookmarkNode,
  folderPath: string,
  localTree: browser.bookmarks.BookmarkTreeNode[]
): Promise<void> {
  if (!node.url) return;
  try {
    const parts = folderPath ? folderPath.split(' > ') : [];
    let parentId: string | undefined;

    if (parts.length > 0) {
      const rootName = parts[0].toLowerCase();
      if (rootName.includes('pasek') || rootName.includes('toolbar')) {
        parentId = findSpecialFolder(localTree, 'toolbar')?.id;
      } else if (rootName.includes('menu')) {
        parentId = findSpecialFolder(localTree, 'menu')?.id;
      } else if (rootName.includes('pozosta') || rootName.includes('other') || rootName.includes('unfiled')) {
        parentId = findSpecialFolder(localTree, 'unsorted')?.id;
      }
    }

    if (!parentId) {
      parentId = findSpecialFolder(localTree, 'toolbar')?.id
        ?? findSpecialFolder(localTree, 'unsorted')?.id;
    }
    if (!parentId) return;

    for (let i = 1; i < parts.length; i++) {
      parentId = await findOrCreateFolder(parentId, parts[i]);
    }

    await browser.bookmarks.create({ parentId, title: node.title, url: node.url });
  } catch {
    await addBookmarkToUnsorted(node);
  }
}

async function findOrCreateFolder(parentId: string, name: string): Promise<string> {
  const children = await browser.bookmarks.getChildren(parentId);
  const existing = children.find(c => !c.url && c.title === name);
  if (existing) return existing.id;
  const newFolder = await browser.bookmarks.create({ parentId, title: name });
  return newFolder.id;
}

async function addBookmarkToUnsorted(node: BookmarkNode): Promise<void> {
  const localTree = await browser.bookmarks.getTree();
  const unsorted  = findSpecialFolder(localTree, 'unsorted');
  if (unsorted && node.url) {
    try { await browser.bookmarks.create({ parentId: unsorted.id, title: node.title, url: node.url }); } catch { }
  }
}

async function removeBookmarkTree(id: string): Promise<void> {
  try { await browser.bookmarks.removeTree(id); }
  catch { try { await browser.bookmarks.remove(id); } catch { } }
}

function findSpecialFolder(
  tree: browser.bookmarks.BookmarkTreeNode[],
  type: 'toolbar' | 'menu' | 'unsorted'
): browser.bookmarks.BookmarkTreeNode | undefined {
  const ids: Record<string, string[]> = {
    toolbar:  ['1', 'toolbar_____'],
    menu:     ['2', 'menu________'],
    unsorted: ['3', 'unfiled_____', '2'],
  };
  const targetIds = ids[type] ?? [];
  for (const root of tree) {
    for (const child of root.children ?? []) {
      if (targetIds.includes(child.id)) return child;
    }
  }
  for (const root of tree) {
    for (const child of root.children ?? []) {
      if (type === 'toolbar' && child.title.toLowerCase().includes('pasek')) return child;
      if (type === 'unsorted' && (child.title.toLowerCase().includes('pozosta') || child.title.toLowerCase().includes('other'))) return child;
    }
  }
  return undefined;
}

function isBrowserSpecificFolder(title: string): boolean {
  const SKIP = new Set([
    'pinboard', 'speed dials', 'kosz', 'trash', 'nieuporządkowane',
    'unsynchronized pinboard', 'mobile bookmarks', 'zakładki na komórce',
    'zakładki z telefonu',
  ]);
  return SKIP.has(title.toLowerCase().trim());
}

function flattenLocalTree(tree: browser.bookmarks.BookmarkTreeNode[]): Map<string, browser.bookmarks.BookmarkTreeNode> {
  const map = new Map<string, browser.bookmarks.BookmarkTreeNode>();
  function walk(node: browser.bookmarks.BookmarkTreeNode) {
    if (node.url) map.set(node.url, node);
    for (const child of node.children ?? []) walk(child);
  }
  for (const root of tree) walk(root);
  return map;
}

function flattenCloudTree(node: BookmarkNode, map: Map<string, BookmarkNode>): void {
  if (node.url) map.set(node.url, node);
  for (const child of node.children ?? []) flattenCloudTree(child, map);
}

// ================================================================
// Wiadomości z Popup / Options
// ================================================================

browser.runtime.onMessage.addListener((rawMsg: unknown, _sender, sendResponse) => {
  const message = rawMsg as BackgroundMessage;

  if (message.type === 'SAVE_BOOKMARKS') {
    saveBookmarks().then(sendResponse).catch(err => sendResponse({ success: false, error: String(err) }));
    return true;
  }

  if (message.type === 'IMPORT_BOOKMARKS') {
    const mode = (message as any).mode as string;
    if (mode === 'full_sync') {
      // Pełna synchronizacja — dodaj + usuń
      (async () => {
        const settings   = await getSettings();
        const instanceId = settings.instanceId || await getInstanceId();
        const port       = settings.hostPort || DEFAULT_PORT;
        const pingResult = await pingHost(port, instanceId);
        if (pingResult !== 'ok') { sendResponse({ success: false, error: 'NO_HOST' }); return; }
        try {
          const resp = await fetch(`http://localhost:${port}/import`, {
            headers: { 'X-Instance-Id': instanceId, 'X-Browser': getBrowserName() },
            signal: AbortSignal.timeout(15000),
          });
          const data = await resp.json() as { success: boolean; path?: string };
          if (!data.success || !data.path) { sendResponse({ success: false, error: 'NO_DATA' }); return; }
          const bookmarksFile = JSON.parse(data.path) as { bookmarks: BookmarkNode; index?: any };
          isImporting = true;
          try {
            await importFullSync(bookmarksFile.bookmarks, bookmarksFile.index);
          } finally { isImporting = false; }
          await browser.storage.local.set({ lastSyncTime: new Date().toISOString() });
          await setIconState('green');
          sendResponse({ success: true });
        } catch(e) { isImporting = false; sendResponse({ success: false, error: String(e) }); }
      })();
    } else {
      importBookmarks(message.mode, message.historyFile).then(sendResponse)
        .catch(err => sendResponse({ success: false, error: String(err) }));
    }
    return true;
  }

  if (message.type === 'UPDATE_SETTINGS') {
    browser.storage.local.set(message.settings)
      .then(async () => {
        if (message.settings.schedule) await applySchedule(message.settings.schedule);
        const alarm = await browser.alarms.get(POLL_ALARM);
        sendResponse({ success: true, nextAlarmTime: alarm?.scheduledTime });
      })
      .catch(err => sendResponse({ success: false, error: String(err) }));
    return true;
  }

  if (message.type === 'GET_STATUS') {
    Promise.all([
      browser.storage.local.get(['lastSaveTime', 'lastSaveCount', 'schedule', 'hostPort', 'instanceId']),
      browser.alarms.get(POLL_ALARM),
    ]).then(async ([data, alarm]) => {
      const port       = (data.hostPort as number) ?? DEFAULT_PORT;
      const instanceId = (data.instanceId as string) ?? await getInstanceId();
      const ping       = await pingHost(port, instanceId);

      if (ping === 'no_host') await setIconState('red');
      else if (ping === 'ok') await setIconState('green');

      const response: StatusResponse = {
        lastSaveTime:  data.lastSaveTime  as string | undefined,
        lastSaveCount: data.lastSaveCount as number | undefined,
        schedule:      (data.schedule as ScheduleSettings) ?? DEFAULT_SCHEDULE,
        nextAlarmTime: alarm?.scheduledTime,
        hostReachable: ping === 'ok' || ping === 'pending',
      };
      sendResponse(response);
    }).catch(err => sendResponse({ error: String(err) }));
    return true;
  }

  if (message.type === 'GET_BOOKMARKS_TREE') {
    browser.bookmarks.getTree().then(tree => {
      sendResponse({ success: true, tree });
    }).catch(err => sendResponse({ success: false, error: String(err) }));
    return true;
  }

  if (message.type === 'REFRESH_FAVICONS') {
    const opts = message as any;
    refreshFavicons(opts.concurrency ?? 5, opts.timeoutMs ?? 10000)
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ success: false, error: String(err) }));
    return true;
  }

  if (message.type === 'CANCEL_FAVICON_REFRESH') {
    faviconRefreshCancelled = true;
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'GET_FAVICON_STATUS') {
    sendResponse(faviconStatus);
    return true;
  }
});

// ================================================================
// Odświeżanie favicon
// ================================================================

let faviconRefreshCancelled = false;
let faviconStatus = { running: false, done: 0, total: 0, current: '' };

async function refreshFavicons(concurrency: number, timeoutMs: number): Promise<{ success: boolean; done: number; total: number }> {
  faviconRefreshCancelled = false;
  faviconStatus = { running: true, done: 0, total: 0, current: '' };

  // Zbierz wszystkie URL zakładek
  const tree  = await browser.bookmarks.getTree();
  const urls: string[] = [];
  function collect(nodes: browser.bookmarks.BookmarkTreeNode[]) {
    for (const n of nodes) {
      if (n.url && (n.url.startsWith('http://') || n.url.startsWith('https://'))) {
        urls.push(n.url);
      }
      if (n.children) collect(n.children);
    }
  }
  collect(tree);

  faviconStatus.total = urls.length;

  // Przetwarzaj po `concurrency` kart jednocześnie
  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += concurrency) {
    chunks.push(urls.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    if (faviconRefreshCancelled) break;

    await Promise.all(chunk.map(url => loadTabAndClose(url, timeoutMs)));
    faviconStatus.done += chunk.length;
  }

  faviconStatus.running = false;
  return { success: true, done: faviconStatus.done, total: faviconStatus.total };
}

async function loadTabAndClose(url: string, timeoutMs: number): Promise<void> {
  let tabId: number | undefined;
  try {
    faviconStatus.current = url;

    const tab = await browser.tabs.create({ url, active: false });
    tabId = tab.id;

    // Czekaj na załadowanie lub timeout
    await Promise.race([
      waitForTabLoad(tabId!),
      new Promise(resolve => setTimeout(resolve, timeoutMs)),
    ]);
  } catch {
    // Ignoruj błędy pojedynczej karty
  } finally {
    if (tabId !== undefined) {
      try { await browser.tabs.remove(tabId); } catch { }
    }
  }
}

function waitForTabLoad(tabId: number): Promise<void> {
  return new Promise(resolve => {
    function listener(id: number, info: browser.tabs.TabChangeInfo) {
      if (id === tabId && info.status === 'complete') {
        browser.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }
    browser.tabs.onUpdated.addListener(listener);
  });
}
