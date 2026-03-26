// ============================================================
// System filtrowania zakładek przy eksporcie
// Łatwy do rozbudowy — dodaj nowe reguły do BUILTIN_RULES
// ============================================================

import browser from 'webextension-polyfill';
import { BookmarkNode } from './types.js';

// ---- Typy ----

export interface BuiltinRule {
  id: string;
  label: string;
  source: string;       // skąd pochodzi (Opera, Firefox, Chrome...)
  type: 'folderName' | 'urlPrefix';
  pattern: string;      // nazwa folderu lub prefix URL (lowercase)
  enabledByDefault: boolean;
}

export interface ManualExclusion {
  id: string;
  type: 'folder' | 'url' | 'urlPattern';
  value: string;        // bookmarkId dla folder, URL dla url, wzorzec dla urlPattern
  label: string;        // czytelna nazwa dla UI
}

export interface FilterConfig {
  builtinEnabled: Record<string, boolean>;  // id reguły → czy włączona
  manualExclusions: ManualExclusion[];
}

// ---- Wbudowane reguły ----
// Żeby dodać nową przeglądarkę: dopisz obiekty do tej tablicy

export const BUILTIN_RULES: BuiltinRule[] = [
  // Opera
  { id: 'opera-pinboard',       label: 'Pinboard',              source: 'Opera',   type: 'folderName', pattern: 'pinboard',               enabledByDefault: true },
  { id: 'opera-speeddials',     label: 'Speed Dials',           source: 'Opera',   type: 'folderName', pattern: 'speed dials',             enabledByDefault: true },
  { id: 'opera-trash',          label: 'Kosz',                  source: 'Opera',   type: 'folderName', pattern: 'kosz',                    enabledByDefault: true },
  { id: 'opera-trash-en',       label: 'Trash',                 source: 'Opera',   type: 'folderName', pattern: 'trash',                   enabledByDefault: true },
  { id: 'opera-unsorted',       label: 'Nieuporządkowane',      source: 'Opera',   type: 'folderName', pattern: 'nieuporządkowane',         enabledByDefault: true },
  { id: 'opera-unsorted2',      label: 'Unsynchronized Pinboard', source: 'Opera', type: 'folderName', pattern: 'unsynchronized pinboard',  enabledByDefault: true },
  { id: 'opera-urls',           label: 'opera:// adresy',       source: 'Opera',   type: 'urlPrefix',  pattern: 'opera:',                  enabledByDefault: true },
  // Firefox
  { id: 'firefox-mobile',       label: 'Zakładki na komórce',   source: 'Firefox', type: 'folderName', pattern: 'zakładki na komórce',     enabledByDefault: true },
  { id: 'firefox-mobile2',      label: 'Zakładki z telefonu',   source: 'Firefox', type: 'folderName', pattern: 'zakładki z telefonu',     enabledByDefault: true },
  { id: 'firefox-mobile-en',    label: 'Mobile Bookmarks',      source: 'Firefox', type: 'folderName', pattern: 'mobile bookmarks',        enabledByDefault: true },
  { id: 'firefox-about',        label: 'about:// adresy',       source: 'Firefox', type: 'urlPrefix',  pattern: 'about:',                  enabledByDefault: true },
  { id: 'firefox-moz',          label: 'moz-extension:// adresy', source: 'Firefox', type: 'urlPrefix', pattern: 'moz-extension:',        enabledByDefault: true },
  // Chrome / Edge / Brave
  { id: 'chrome-urls',          label: 'chrome:// adresy',      source: 'Chrome',  type: 'urlPrefix',  pattern: 'chrome:',                 enabledByDefault: true },
  { id: 'edge-urls',            label: 'edge:// adresy',        source: 'Edge',    type: 'urlPrefix',  pattern: 'edge:',                   enabledByDefault: true },
  { id: 'brave-urls',           label: 'brave:// adresy',       source: 'Brave',   type: 'urlPrefix',  pattern: 'brave:',                  enabledByDefault: true },
  { id: 'chrome-other',         label: 'Inne zakładki',         source: 'Chrome',  type: 'folderName', pattern: 'inne zakładki',           enabledByDefault: true },
  { id: 'chrome-other-en',      label: 'Other bookmarks',       source: 'Chrome',  type: 'folderName', pattern: 'other bookmarks',         enabledByDefault: true },
  { id: 'edge-other',           label: 'Inne ulubione',         source: 'Edge',    type: 'folderName', pattern: 'inne ulubione',           enabledByDefault: true },
  { id: 'edge-other-en',        label: 'Other favorites',       source: 'Edge',    type: 'folderName', pattern: 'other favorites',         enabledByDefault: true },
  // Vivaldi
  { id: 'vivaldi-urls',         label: 'vivaldi:// adresy',     source: 'Vivaldi', type: 'urlPrefix',  pattern: 'vivaldi:',                enabledByDefault: true },
];

// ---- Domyślna konfiguracja ----

export function defaultFilterConfig(): FilterConfig {
  const builtinEnabled: Record<string, boolean> = {};
  for (const rule of BUILTIN_RULES) {
    builtinEnabled[rule.id] = rule.enabledByDefault;
  }
  return { builtinEnabled, manualExclusions: [] };
}

// ---- Załaduj / zapisz konfigurację ----

export async function loadFilterConfig(): Promise<FilterConfig> {
  const data = await browser.storage.local.get('filterConfig');
  if (data.filterConfig) return data.filterConfig as FilterConfig;
  return defaultFilterConfig();
}

export async function saveFilterConfig(config: FilterConfig): Promise<void> {
  await browser.storage.local.set({ filterConfig: config });
}

// ---- Główna funkcja filtrowania ----

export function filterBookmarkTree(
  node: BookmarkNode,
  config: FilterConfig,
  excludedFolderIds: Set<string>
): BookmarkNode | null {

  // Sprawdź czy ten węzeł jest ręcznie wykluczony po ID
  if (excludedFolderIds.has(node.id)) return null;

  // Sprawdź URL
  if (node.url) {
    if (isUrlExcluded(node.url, config)) return null;
    // Sprawdź ręczne wykluczenia URL
    if (isManuallyExcluded(node.url, node.id, config)) return null;
    return node;
  }

  // To jest folder — sprawdź nazwę
  if (isFolderExcluded(node.title, config)) return null;

  // Rekurencyjnie filtruj dzieci
  if (node.children) {
    const filteredChildren = node.children
      .map(child => filterBookmarkTree(child, config, excludedFolderIds))
      .filter((child): child is BookmarkNode => child !== null);

    return { ...node, children: filteredChildren };
  }

  return node;
}

// ---- Pomocniki ----

function isFolderExcluded(title: string, config: FilterConfig): boolean {
  const lower = title.toLowerCase().trim();

  // Sprawdź wbudowane reguły folderów
  for (const rule of BUILTIN_RULES) {
    if (rule.type === 'folderName' &&
        config.builtinEnabled[rule.id] !== false &&
        lower === rule.pattern) {
      return true;
    }
  }
  return false;
}

function isUrlExcluded(url: string, config: FilterConfig): boolean {
  const lower = url.toLowerCase();

  // Sprawdź wbudowane reguły URL
  for (const rule of BUILTIN_RULES) {
    if (rule.type === 'urlPrefix' &&
        config.builtinEnabled[rule.id] !== false &&
        lower.startsWith(rule.pattern)) {
      return true;
    }
  }
  return false;
}

function isManuallyExcluded(url: string, id: string, config: FilterConfig): boolean {
  for (const excl of config.manualExclusions) {
    if (excl.type === 'url' && excl.value === url) return true;
    if (excl.type === 'folder' && excl.value === id) return true;
    if (excl.type === 'urlPattern' && matchesPattern(url, excl.value)) return true;
  }
  return false;
}

function matchesPattern(url: string, pattern: string): boolean {
  // Prosty wildcard — * zastępuje dowolny ciąg
  const regex = new RegExp(
    '^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$',
    'i'
  );
  return regex.test(url);
}

// ---- Zbierz ID wykluczonych folderów z konfiguracji ----

export function getExcludedFolderIds(config: FilterConfig): Set<string> {
  const ids = new Set<string>();
  for (const excl of config.manualExclusions) {
    if (excl.type === 'folder') ids.add(excl.value);
  }
  return ids;
}
