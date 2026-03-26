import browser from 'webextension-polyfill';
import {
  BackgroundMessage, BackgroundResponse,
  StatusResponse, ScheduleSettings,
  DEFAULT_SCHEDULE, DEFAULT_PORT,
} from './types.js';
import { loadFilterConfig, filterBookmarkTree, getExcludedFolderIds } from './filters.js';
import type { BookmarkNode } from './types.js';

const i18n = (key: string, ...subs: string[]): string =>
  browser.i18n.getMessage(key, subs) || key;
const $ = (id: string) => document.getElementById(id)!;

// ---- Elementy DOM ----
const portInput          = $('port')            as HTMLInputElement;
const saveSettingsBtn    = $('save-settings')   as HTMLButtonElement;
const saveNowBtn         = $('save-now')        as HTMLButtonElement;
const importMergeBtn     = $('import-merge')    as HTMLButtonElement;
const importReplaceBtn   = $('import-replace')  as HTMLButtonElement;
const statusEl           = $('status')          as HTMLDivElement;
const hostIndicator      = $('host-indicator')  as HTMLSpanElement;
const lastSaveEl         = $('last-save')       as HTMLSpanElement;
const countEl            = $('bookmarks-count') as HTMLSpanElement;
const nextSaveEl         = $('next-save')       as HTMLSpanElement;
const modeManualRadio    = $('mode-manual')     as HTMLInputElement;
const modeScheduledRadio = $('mode-scheduled')  as HTMLInputElement;
const schedulePanel      = $('schedule-panel')  as HTMLDivElement;
const intervalRange      = $('interval-range')  as HTMLInputElement;
const intervalVal        = $('interval-val')    as HTMLSpanElement;
const startupCheckbox    = $('sync-startup')    as HTMLInputElement;
const autoFullRadio      = $('auto-full')       as HTMLInputElement;
const importSyncBtn      = $('import-sync')     as HTMLButtonElement;
const syncDot            = $('sync-dot')        as HTMLDivElement;
const syncStatusText     = $('sync-status-text')as HTMLSpanElement;

// ---- Nawigacja zakładek ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = (btn as HTMLElement).dataset.tab!;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $(`tab-${tab}`).classList.add('active');
    if (tab === 'history') loadHistory();
  });
});

// ---- Status ----
function showStatus(msg: string, type: 'idle'|'saving'|'success'|'error'|'info'): void {
  statusEl.textContent = msg;
  statusEl.className   = `status status--${type}`;
  if (type === 'success' || type === 'error')
    setTimeout(() => { statusEl.className = 'status status--idle'; statusEl.textContent = ''; }, 5000);
}

function setSyncStatus(state: 'green'|'yellow'|'red'|'gray', text: string): void {
  syncDot.className      = `sync-status-dot ${state}`;
  syncStatusText.textContent = text;
  const colors = { green: 'var(--ok)', yellow: 'var(--warn)', red: 'var(--err)', gray: 'var(--muted)' };
  syncStatusText.style.color = colors[state];
}

function setAllButtons(disabled: boolean): void {
  [saveNowBtn, importMergeBtn, importReplaceBtn, importSyncBtn, saveSettingsBtn].forEach(b => b.disabled = disabled);
}

function toggleSchedulePanel(show: boolean): void {
  schedulePanel.style.display = show ? 'block' : 'none';
}

function formatNextAlarm(ts?: number): string {
  if (!ts) return '';
  const diff = ts - Date.now();
  if (diff <= 0) return 'za chwilę';
  const mins = Math.floor(diff / 60000);
  const h = Math.floor(mins / 60), m = mins % 60;
  return `za ${h > 0 ? `${h}h ${m}min` : `${mins} min`}`;
}

// ---- Slider ----
intervalRange.addEventListener('input', () => {
  intervalVal.textContent = `${intervalRange.value} min`;
});

// ---- Odświeżanie statusu ----
async function refresh(): Promise<void> {
  const s: StatusResponse = await browser.runtime.sendMessage({ type: 'GET_STATUS' } as BackgroundMessage);

  // Wskaźnik hosta
  if (s.hostReachable) {
    hostIndicator.textContent = '🟢';
    hostIndicator.title       = 'Host działa';
  } else {
    hostIndicator.textContent = '🔴';
    hostIndicator.title       = 'Host nie działa';
  }

  // Stan synchronizacji
  if (!s.hostReachable) {
    setSyncStatus('red', 'Brak połączenia z hostem');
  } else if (s.schedule?.mode === 'scheduled') {
    setSyncStatus('green', `Automatyczna sync aktywna · następna ${formatNextAlarm(s.nextAlarmTime)}`);
  } else {
    setSyncStatus('gray', 'Synchronizacja ręczna');
  }

  // Metadane
  lastSaveEl.textContent = s.lastSaveTime
    ? `Ostatni zapis: ${new Date(s.lastSaveTime).toLocaleString()}`
    : 'Jeszcze nie zapisywano';

  if (s.lastSaveCount !== undefined)
    countEl.textContent = `Zakładek: ${s.lastSaveCount}`;

  if (s.schedule?.mode === 'scheduled' && s.nextAlarmTime) {
    nextSaveEl.textContent   = `Następna sync: ${formatNextAlarm(s.nextAlarmTime)}`;
    nextSaveEl.style.display = 'block';
  } else {
    nextSaveEl.style.display = 'none';
  }

  // Ustawienia harmonogramu
  const sc = s.schedule ?? DEFAULT_SCHEDULE;
  (sc.mode === 'scheduled' ? modeScheduledRadio : modeManualRadio).checked = true;
  toggleSchedulePanel(sc.mode === 'scheduled');
  intervalRange.value     = String(sc.intervalMinutes);
  intervalVal.textContent = `${sc.intervalMinutes} min`;
  startupCheckbox.checked = sc.syncOnStartup;
  if ((sc as any).autoSyncMode === 'add_missing') {
    ($('auto-add') as HTMLInputElement).checked = true;
  } else {
    autoFullRadio.checked = true;
  }
}

async function loadPort(): Promise<void> {
  const data = await browser.storage.local.get('hostPort');
  portInput.value = String((data.hostPort as number) ?? DEFAULT_PORT);
}

// ---- Eventy: Sync ----
modeManualRadio.addEventListener('change',    () => toggleSchedulePanel(false));
modeScheduledRadio.addEventListener('change', () => toggleSchedulePanel(true));

saveSettingsBtn.addEventListener('click', async () => {
  const port     = parseInt(portInput.value, 10) || DEFAULT_PORT;
  const mode     = modeScheduledRadio.checked ? 'scheduled' : 'manual';
  const schedule: ScheduleSettings = {
    mode,
    intervalMinutes: parseInt(intervalRange.value, 10),
    syncOnStartup:   startupCheckbox.checked,
    autoSyncMode:    autoFullRadio.checked ? 'full_sync' : 'add_missing',
  };
  const r = await browser.runtime.sendMessage({
    type: 'UPDATE_SETTINGS', settings: { hostPort: port, schedule }
  } as BackgroundMessage);
  if (r?.success) { showStatus('✓ Ustawienia zapisane', 'success'); await refresh(); }
  else showStatus(`✗ Błąd: ${r?.error}`, 'error');
});

saveNowBtn.addEventListener('click', async () => {
  setAllButtons(true); showStatus('Wysyłam...', 'saving');
  try {
    const r: BackgroundResponse = await browser.runtime.sendMessage({ type: 'SAVE_BOOKMARKS' } as BackgroundMessage);
    if (r.success) {
      showStatus('✓ Wysłano pomyślnie', 'success');
      countEl.textContent    = `Zakładek: ${r.count ?? 0}`;
      lastSaveEl.textContent = `Ostatni zapis: ${new Date().toLocaleString()}`;
      setSyncStatus('green', 'Zsynchronizowano');
    } else {
      showStatus(r.error === 'NO_HOST' ? '✗ Host nie działa' : `✗ Błąd: ${r.error ?? 'nieznany'}`, 'error');
    }
  } catch (e) { showStatus(`✗ Błąd: ${String(e)}`, 'error'); }
  finally { setAllButtons(false); }
});

importMergeBtn.addEventListener('click', async () => {
  setAllButtons(true); showStatus('Dodaję brakujące...', 'info');
  try {
    const r: BackgroundResponse = await browser.runtime.sendMessage({ type: 'IMPORT_BOOKMARKS', mode: 'merge' } as BackgroundMessage);
    if (!r) { showStatus('✗ Brak odpowiedzi', 'error'); return; }
    showStatus(r.success ? '✓ Dodano brakujące zakładki' : (r.error === 'NO_HOST' ? '✗ Host nie działa' : `✗ Błąd: ${r.error ?? 'nieznany'}`), r.success ? 'success' : 'error');
  } catch (e) { showStatus(`✗ Błąd: ${String(e)}`, 'error'); }
  finally { setAllButtons(false); }
});

importReplaceBtn.addEventListener('click', async () => {
  if (!confirm('Zastąpić WSZYSTKIE lokalne zakładki zakładkami z chmury?\nTej operacji nie można cofnąć!')) return;
  setAllButtons(true); showStatus('Importuję...', 'info');
  try {
    const r: BackgroundResponse = await browser.runtime.sendMessage({ type: 'IMPORT_BOOKMARKS', mode: 'replace' } as BackgroundMessage);
    if (!r) { showStatus('✗ Brak odpowiedzi', 'error'); return; }
    showStatus(r.success ? '✓ Zaimportowano pomyślnie' : (r.error === 'NO_HOST' ? '✗ Host nie działa' : `✗ Błąd: ${r.error ?? 'nieznany'}`), r.success ? 'success' : 'error');
  } catch (e) { showStatus(`✗ Błąd: ${String(e)}`, 'error'); }
  finally { setAllButtons(false); }
});

// ================================================================
// Historia
// ================================================================

interface HistoryEntry {
  filename: string;
  timestamp: string;
  browser: string;
  count: number;
  sizeKb: number;
}

let historyData: HistoryEntry[] = [];
let selectedEntry: HistoryEntry | null = null;

async function getPort(): Promise<number> {
  const data = await browser.storage.local.get('hostPort');
  return (data.hostPort as number) ?? DEFAULT_PORT;
}

async function getInstanceId(): Promise<string> {
  const data = await browser.storage.local.get('instanceId');
  return (data.instanceId as string) ?? '';
}

async function loadHistory(): Promise<void> {
  const list = $('history-list');
  list.innerHTML = '<div style="color:var(--muted);padding:12px;font-size:12px">Ładowanie...</div>';
  hideHistoryActions();

  try {
    const port       = await getPort();
    const instanceId = await getInstanceId();
    const resp       = await fetch(`http://localhost:${port}/history/list`, {
      headers: { 'X-Instance-Id': instanceId, 'X-Browser': 'popup' },
      signal: AbortSignal.timeout(3000),
    });
    const raw = await resp.json() as { success: boolean; path?: string; error?: string };

    if (!raw.success) {
      list.innerHTML = `<div style="color:var(--err);padding:12px">Błąd: ${raw.error ?? 'brak danych'}</div>`;
      return;
    }

    let entries: HistoryEntry[] = [];
    if (raw.path) {
      try {
        const parsed = JSON.parse(raw.path);
        entries = Array.isArray(parsed) ? parsed : (parsed.entries ?? []);
      } catch { entries = []; }
    }

    if (entries.length === 0) {
      list.innerHTML = '<div style="color:var(--muted);padding:12px;font-size:12px">Brak plików historii</div>';
      return;
    }

    historyData = entries;
    renderHistoryList();

  } catch {
    list.innerHTML = '<div style="color:var(--err);padding:12px;font-size:12px">Brak połączenia z hostem</div>';
  }
}

function renderHistoryList(): void {
  const list = $('history-list');
  list.innerHTML = '';

  for (const entry of historyData) {
    const date = new Date(entry.timestamp);
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-date">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
      <div class="history-meta">${entry.browser} · ${entry.count} zakł. · ${entry.sizeKb} KB</div>`;

    item.addEventListener('click', () => {
      document.querySelectorAll('.history-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      selectedEntry = entry;
      showHistoryActions(entry);
    });
    list.appendChild(item);
  }
}

function showHistoryActions(entry: HistoryEntry): void {
  $('history-actions').style.display = 'block';
  const date = new Date(entry.timestamp);
  $('history-selected-info').textContent =
    `${date.toLocaleDateString()} ${date.toLocaleTimeString()} · ${entry.browser} · ${entry.count} zakładek`;
}

function hideHistoryActions(): void {
  $('history-actions').style.display = 'none';
  selectedEntry = null;
}

$('btn-history-import').addEventListener('click', async () => {
  if (!selectedEntry) return;
  if (!confirm(`Zastąpić zakładki w przeglądarce kopią z ${new Date(selectedEntry.timestamp).toLocaleString()}?`)) return;

  const r: BackgroundResponse = await browser.runtime.sendMessage({
    type: 'IMPORT_BOOKMARKS', mode: 'replace', historyFile: selectedEntry.filename
  } as BackgroundMessage);
  const histStatus = $('status-history') as HTMLDivElement;
  histStatus.textContent = r.success ? '✓ Zaimportowano' : `✗ Błąd: ${r.error}`;
  histStatus.className   = `status status--${r.success ? 'success' : 'error'}`;
});

$('btn-history-restore').addEventListener('click', async () => {
  if (!selectedEntry) return;
  if (!confirm('Przywrócić tę kopię jako aktualną i zastąpić bookmarks.json?\n\nAktualna wersja zostanie zapisana w historii.')) return;

  try {
    const port       = await getPort();
    const instanceId = await getInstanceId();
    const resp = await fetch(`http://localhost:${port}/history/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Instance-Id': instanceId },
      body: JSON.stringify({ filename: selectedEntry.filename }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await resp.json() as { success: boolean; error?: string };
    const histStatus = $('status-history') as HTMLDivElement;
    if (data.success) {
      histStatus.textContent = '✓ Przywrócono. Możesz teraz zaimportować do przeglądarki.';
      histStatus.className   = 'status status--success';
      await loadHistory();
    } else {
      histStatus.textContent = `✗ Błąd: ${data.error}`;
      histStatus.className   = 'status status--error';
    }
  } catch {
    const histStatus = $('status-history') as HTMLDivElement;
    histStatus.textContent = '✗ Brak połączenia z hostem';
    histStatus.className   = 'status status--error';
  }
});

$('btn-history-refresh').addEventListener('click', loadHistory);

// ---- Synchronizuj z chmurą ----
importSyncBtn.addEventListener('click', async () => {
  if (!confirm('Synchronizować z chmurą? Dodane zakładki zostaną dodane, usunięte - usunięte.')) return;
  setAllButtons(true); showStatus('Synchronizuję...', 'info');
  try {
    const r: BackgroundResponse = await browser.runtime.sendMessage({
      type: 'IMPORT_BOOKMARKS', mode: 'full_sync'
    } as any);
    if (!r) { showStatus('✗ Brak odpowiedzi', 'error'); return; }
    showStatus(r.success ? '✓ Zsynchronizowano' : (r.error === 'NO_HOST' ? '✗ Host nie działa' : `✗ Błąd: ${r.error ?? 'nieznany'}`), r.success ? 'success' : 'error');
  } catch (e) { showStatus(`✗ Błąd: ${String(e)}`, 'error'); }
  finally { setAllButtons(false); }
});

// ================================================================
// HTML Export / Import
// ================================================================

// ---- Pomocnik filtrowania URL dla eksportu HTML ----
async function getFilteredUrls(): Promise<{ tree: browser.bookmarks.BookmarkTreeNode[]; filteredUrls: Set<string> }> {
  const tree           = await browser.bookmarks.getTree();
  const filterConfig   = await loadFilterConfig();
  const excludedIds    = getExcludedFolderIds(filterConfig);

  function toNode(n: browser.bookmarks.BookmarkTreeNode): BookmarkNode {
    return { id: n.id, title: n.title ?? '', url: n.url, dateAdded: n.dateAdded, children: n.children?.map(toNode) };
  }
  const root     = toNode(tree[0]);
  const filtered = filterBookmarkTree(root, filterConfig, excludedIds);
  const urls     = new Set<string>();
  function collect(n: BookmarkNode) { if (n.url) urls.add(n.url); n.children?.forEach(collect); }
  if (filtered) collect(filtered);
  return { tree, filteredUrls: urls };
}

// ---- Eksport Chrome (HTML) ----
$('btn-export-chrome').addEventListener('click', async () => {
  try {
    const { tree, filteredUrls } = await getFilteredUrls();
    const html = buildBookmarkHtml(tree[0], filteredUrls, 'chrome');
    downloadFile(html, `bookmarks_chrome_${today()}.html`, 'text/html;charset=utf-8');
    showStatus('✓ Wyeksportowano dla Chrome/Opera/Edge', 'success');
  } catch(e) { showStatus('✗ Błąd: ' + String(e), 'error'); }
});

// ---- Eksport Firefox (JSON — natywny format kopii zapasowej) ----
$('btn-export-firefox').addEventListener('click', async () => {
  try {
    const { tree, filteredUrls } = await getFilteredUrls();
    const json = buildFirefoxJson(tree[0], filteredUrls);
    downloadFile(JSON.stringify(json, null, 2), `bookmarks_firefox_${today()}.json`, 'application/json;charset=utf-8');
    showStatus('✓ Wyeksportowano dla Firefox (JSON)', 'success');
  } catch(e) { showStatus('✗ Błąd: ' + String(e), 'error'); }
});

function today(): string { return new Date().toISOString().slice(0, 10); }

function downloadFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ---- Firefox JSON — format kopii zapasowej ----
function buildFirefoxJson(
  root: browser.bookmarks.BookmarkTreeNode,
  filteredUrls: Set<string>
): object {
  // Firefox rozpoznaje foldery specjalne po tych dokładnych GUID-ach
  const GUID_MAP: Record<string, string> = {
    '0':           'root________',
    'root________':'root________',
    '1':           'toolbar_____',
    'toolbar_____':'toolbar_____',
    '2':           'menu________',
    'menu________':'menu________',
    '3':           'unfiled_____',
    'unfiled_____':'unfiled_____',
    'mobile______':'mobile______',
  };

  const ROOT_MAP: Record<string, string> = {
    'root________': 'placesRoot',
    'toolbar_____': 'toolbarFolder',
    'menu________': 'bookmarksMenuFolder',
    'unfiled_____': 'unfiledBookmarksFolder',
    'mobile______': 'mobileFolder',
  };

  const now = Date.now() * 1000;

  function walkNode(n: browser.bookmarks.BookmarkTreeNode, idx: number): object | null {
    const guid  = GUID_MAP[n.id] ?? crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const tsAdd = (n.dateAdded ?? 0) * 1000;

    if (n.url) {
      if (!filteredUrls.has(n.url)) return null;
      return {
        guid,
        title:        n.title ?? '',
        index:        idx,
        dateAdded:    tsAdd || now,
        lastModified: now,
        id:           0,
        typeCode:     1,
        type:         'text/x-moz-place',
        uri:          n.url,
      };
    }

    // Folder
    const rawChildren = (n.children ?? []);
    const children: object[] = [];
    let childIdx = 0;
    for (const child of rawChildren) {
      const c = walkNode(child, childIdx);
      if (c !== null) { children.push(c); childIdx++; }
    }

    // Puste foldery po filtrowaniu pomijamy (oprócz specjalnych)
    const isSpecial = guid in ROOT_MAP;
    if (!isSpecial && children.length === 0) return null;

    const base: Record<string, unknown> = {
      guid,
      title:        n.title ?? '',
      index:        idx,
      dateAdded:    tsAdd || now,
      lastModified: now,
      id:           0,
      typeCode:     2,
      type:         'text/x-moz-place-container',
      children,
    };

    if (guid in ROOT_MAP) base.root = ROOT_MAP[guid];
    return base;
  }

  // Buduj root ręcznie żeby zagwarantować właściwą kolejność:
  // menu, toolbar, unfiled, mobile (tak jak oryginał Firefox)
  const SPECIAL_ORDER = ['menu________', 'toolbar_____', 'unfiled_____', 'mobile______'];
  const specialMap = new Map<string, browser.bookmarks.BookmarkTreeNode>();

  function findSpecials(n: browser.bookmarks.BookmarkTreeNode) {
    const guid = GUID_MAP[n.id];
    if (guid && guid !== 'root________') specialMap.set(guid, n);
    for (const c of n.children ?? []) findSpecials(c);
  }
  findSpecials(root);

  const rootChildren: object[] = [];
  for (const guid of SPECIAL_ORDER) {
    const node = specialMap.get(guid);
    if (node) {
      const built = walkNode(node, rootChildren.length);
      if (built) rootChildren.push(built);
    } else {
      // Dodaj pusty folder specjalny jeśli nie ma w drzewie
      rootChildren.push({
        guid, title: guid.replace(/_/g, ''), index: rootChildren.length,
        dateAdded: now, lastModified: now, id: 0, typeCode: 2,
        type: 'text/x-moz-place-container',
        root: ROOT_MAP[guid], children: [],
      });
    }
  }

  return {
    guid:         'root________',
    title:        '',
    index:        0,
    dateAdded:    now,
    lastModified: now,
    id:           1,
    typeCode:     2,
    type:         'text/x-moz-place-container',
    root:         'placesRoot',
    children:     rootChildren,
  };
}

$('btn-import-html').addEventListener('click', () => {
  ($('file-import-html') as HTMLInputElement).click();
});

($('file-import-html') as HTMLInputElement).addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  setAllButtons(true);
  try {
    const text = await file.text();

    // Wykryj format — JSON (Firefox) lub HTML (Chrome)
    if (file.name.endsWith('.json') || text.trimStart().startsWith('{')) {
      await importFirefoxJson(text);
    } else {
      await importFromHtml(text);
    }
  } catch(e) { showStatus('✗ Błąd importu: ' + String(e), 'error'); }
  finally {
    setAllButtons(false);
    (e.target as HTMLInputElement).value = '';
  }
});

// ---- Import Firefox JSON ----
async function importFirefoxJson(text: string): Promise<void> {
  const data = JSON.parse(text);
  const TOOLBAR_ROOTS = new Set(['toolbarFolder']);
  const MENU_ROOTS    = new Set(['bookmarksMenuFolder']);
  const SKIP_ROOTS    = new Set(['unfiledBookmarksFolder', 'mobileFolder', 'placesRoot']);

  const localTree = await browser.bookmarks.getTree();

  function findFolder(type: 'toolbar' | 'menu'): string | undefined {
    const ids = type === 'toolbar' ? ['1', 'toolbar_____'] : ['2', 'menu________'];
    for (const root of localTree) {
      for (const child of root.children ?? []) {
        if (ids.includes(child.id)) return child.id;
      }
    }
    return localTree[0]?.children?.[0]?.id;
  }

  async function walkImport(node: any, parentId: string): Promise<number> {
    let count = 0;
    if (node.type === 'text/x-moz-place' && node.uri) {
      try {
        await browser.bookmarks.create({ parentId, title: node.title ?? '', url: node.uri });
        count++;
      } catch { }
    } else if (node.type === 'text/x-moz-place-container') {
      if (SKIP_ROOTS.has(node.root ?? '')) return 0;

      let folderId = parentId;
      if (TOOLBAR_ROOTS.has(node.root ?? '')) {
        folderId = findFolder('toolbar') ?? parentId;
      } else if (MENU_ROOTS.has(node.root ?? '')) {
        folderId = findFolder('menu') ?? parentId;
      } else if (node.root !== 'placesRoot') {
        const f = await browser.bookmarks.create({ parentId, title: node.title ?? '' });
        folderId = f.id;
      }

      for (const child of (node.children ?? [])) {
        count += await walkImport(child, folderId);
      }
    }
    return count;
  }

  const rootParent = localTree[0]?.children?.[0]?.id ?? '';
  const count = await walkImport(data, rootParent);
  showStatus(`✓ Zaimportowano ${count} zakładek z JSON Firefox`, 'success');
}

// ---- Import HTML (Chrome/Opera) ----
async function importFromHtml(text: string): Promise<void> {
  const nodes = parseBookmarkHtml(text);
  if (nodes.length === 0) { showStatus('✗ Brak zakładek w pliku', 'error'); return; }

  showStatus(`Importuję ${nodes.length} zakładek...`, 'info');
  const localTree = await browser.bookmarks.getTree();
  let parentId = localTree[0]?.children?.find(c =>
    c.id === '2' || c.id === 'unfiled_____' ||
    c.title.toLowerCase().includes('inne') ||
    c.title.toLowerCase().includes('other')
  )?.id ?? localTree[0]?.children?.[0]?.id;

  if (!parentId) { showStatus('✗ Nie znaleziono folderu docelowego', 'error'); return; }

  const folder = await browser.bookmarks.create({ parentId, title: `Import ${new Date().toLocaleDateString()}` });
  await importHtmlNodes(nodes, folder.id);
  showStatus(`✓ Zaimportowano ${nodes.length} zakładek`, 'success');
}

// Generuj HTML w formacie Netscape Bookmark
function buildBookmarkHtml(
  root: browser.bookmarks.BookmarkTreeNode,
  filteredUrls: Set<string> | null = null,
  browserType: 'chrome' | 'firefox' = 'chrome'
): string {
  const lines: string[] = [
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
    '<!-- This is an automatically generated file. -->',
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    '<TITLE>Bookmarks</TITLE>',
    '<H1>Bookmarks</H1>',
    '<DL><p>',
  ];

  // ID folderów które pomijamy (tylko sam korzeń drzewa)
  const SKIP_IDS    = new Set(['0', 'root________']);
  // ID paska zakładek (Chrome: 1, Firefox: toolbar_____)
  const TOOLBAR_IDS = new Set(['1', 'toolbar_____']);
  // ID menu zakładek (Chrome: 2, Firefox: menu________)
  const MENU_IDS    = new Set(['2', 'menu________']);
  // ID "Inne zakładki" i mobilnych — pomijamy
  const SKIP_CHILD  = new Set(['3', 'unfiled_____', 'mobile______', '5']);

  // Nazwy folderów specjalnych dla eksportu
  const toolbarName = browserType === 'firefox' ? 'Pasek zakładek' : 'Bookmarks bar';
  const menuName    = browserType === 'firefox' ? 'Menu zakładek'  : 'Other bookmarks';

  function walk(node: browser.bookmarks.BookmarkTreeNode, indent: number) {
    const pad = '    '.repeat(indent);

    if (node.url) {
      // Pomiń jeśli URL był odfiltrowany
      if (filteredUrls !== null && !filteredUrls.has(node.url)) return;
      const ts = node.dateAdded ? Math.floor(node.dateAdded / 1000) : 0;
      lines.push(`${pad}<DT><A HREF="${escAttr(node.url)}" ADD_DATE="${ts}">${escHtml(node.title)}</A>`);
      return;
    }

    if (!node.children) return;

    if (SKIP_IDS.has(node.id)) {
      // Korzeń — tylko dzieci
      for (const child of node.children) walk(child, indent);
      return;
    }

    if (SKIP_CHILD.has(node.id)) {
      // Inne zakładki / mobilne — pomijamy
      return;
    }

    const ts = node.dateAdded ? Math.floor(node.dateAdded / 1000) : 0;

    if (TOOLBAR_IDS.has(node.id)) {
      // Pasek zakładek — dodaj PERSONAL_TOOLBAR_FOLDER="true"
      lines.push(`${pad}<DT><H3 ADD_DATE="${ts}" PERSONAL_TOOLBAR_FOLDER="true">${escHtml(toolbarName)}</H3>`);
    } else if (MENU_IDS.has(node.id)) {
      // Menu zakładek — dodaj PERSONAL_MENU_FOLDER="true"
      lines.push(`${pad}<DT><H3 ADD_DATE="${ts}" PERSONAL_MENU_FOLDER="true">${escHtml(menuName)}</H3>`);
    } else {
      // Normalny folder
      lines.push(`${pad}<DT><H3 ADD_DATE="${ts}">${escHtml(node.title)}</H3>`);
    }

    lines.push(`${pad}<DL><p>`);
    for (const child of node.children) walk(child, indent + 1);
    lines.push(`${pad}</DL><p>`);
  }

  walk(root, 1);
  lines.push('</DL><p>');
  return lines.join('\n');
}

interface HtmlBookmark { title: string; url?: string; children?: HtmlBookmark[] }

function parseBookmarkHtml(html: string): HtmlBookmark[] {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(html, 'text/html');
  const result: HtmlBookmark[] = [];

  function walkDl(dl: Element, out: HtmlBookmark[]) {
    for (const dt of dl.querySelectorAll(':scope > dt')) {
      const a  = dt.querySelector(':scope > a');
      const h3 = dt.querySelector(':scope > h3');
      if (a) {
        out.push({ title: a.textContent?.trim() ?? '', url: a.getAttribute('href') ?? '' });
      } else if (h3) {
        const subDl    = dt.querySelector(':scope > dl');
        const children: HtmlBookmark[] = [];
        if (subDl) walkDl(subDl, children);
        out.push({ title: h3.textContent?.trim() ?? '', children });
      }
    }
  }

  const topDl = doc.querySelector('dl');
  if (topDl) walkDl(topDl, result);
  return result;
}

async function importHtmlNodes(nodes: HtmlBookmark[], parentId: string): Promise<void> {
  for (const node of nodes) {
    if (node.url) {
      try { await browser.bookmarks.create({ parentId, title: node.title, url: node.url }); } catch { }
    } else if (node.children) {
      const folder = await browser.bookmarks.create({ parentId, title: node.title });
      await importHtmlNodes(node.children, folder.id);
    }
  }
}

function escAttr(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function escHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ================================================================
// Favicon refresh
// ================================================================

let faviconPolling: ReturnType<typeof setInterval> | null = null;

($('btn-refresh-fav') as HTMLButtonElement).addEventListener('click', async () => {
  const concurrency = parseInt(($('fav-concurrency') as HTMLInputElement).value) || 5;
  const timeoutSec  = parseInt(($('fav-timeout') as HTMLInputElement).value) || 10;

  $('btn-refresh-fav').setAttribute('disabled', '');
  $('btn-cancel-fav').style.display = 'inline-block';
  $('fav-progress').style.display   = 'block';
  ($('fav-progress') as HTMLDivElement).textContent = 'Uruchamianie...';

  // Polling statusu co sekundę
  faviconPolling = setInterval(async () => {
    const status = await browser.runtime.sendMessage({ type: 'GET_FAVICON_STATUS' }) as any;
    if (status?.running) {
      ($('fav-progress') as HTMLDivElement).textContent =
        `${status.done} / ${status.total} — ${status.current.slice(0, 50)}`;
    }
  }, 1000);

  try {
    const r = await browser.runtime.sendMessage({
      type: 'REFRESH_FAVICONS', concurrency, timeoutMs: timeoutSec * 1000
    }) as any;
    showStatus(`✓ Odświeżono ${r.done} / ${r.total} favicon`, 'success');
  } catch(e) {
    showStatus('✗ Błąd: ' + String(e), 'error');
  } finally {
    if (faviconPolling) clearInterval(faviconPolling);
    $('btn-refresh-fav').removeAttribute('disabled');
    $('btn-cancel-fav').style.display = 'none';
    $('fav-progress').style.display   = 'none';
  }
});

$('btn-cancel-fav').addEventListener('click', async () => {
  await browser.runtime.sendMessage({ type: 'CANCEL_FAVICON_REFRESH' });
  if (faviconPolling) clearInterval(faviconPolling);
  $('btn-cancel-fav').style.display = 'none';
  $('btn-refresh-fav').removeAttribute('disabled');
  $('fav-progress').style.display   = 'none';
  showStatus('Odświeżanie przerwane', 'info');
});

// ---- Opcje ----
$('open-options').addEventListener('click', async () => {
  try { await browser.runtime.openOptionsPage(); }
  catch { const url = browser.runtime.getURL('options.html'); await browser.tabs.create({ url }); }
});

// ---- Init ----
document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (k) el.textContent = i18n(k);
  });
  await loadPort();
  await refresh();
});
