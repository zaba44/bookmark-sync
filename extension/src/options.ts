import browser from 'webextension-polyfill';
import {
  BUILTIN_RULES, ManualExclusion, FilterConfig,
  loadFilterConfig, saveFilterConfig, defaultFilterConfig
} from './filters.js';
import { DEFAULT_PORT } from './types.js';

// ---- Stan ----
let filterConfig: FilterConfig = defaultFilterConfig();

// ---- Nawigacja ----
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = (btn as HTMLElement).dataset.page!;
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`page-${page}`)!.classList.add('active');
  });
});

// ---- Status bar ----
function showStatus(msg: string, type: 'success' | 'error'): void {
  const bar = document.getElementById('status-bar')!;
  bar.textContent = msg;
  bar.className = `status-bar status-bar--${type} show`;
  setTimeout(() => bar.classList.remove('show'), 3000);
}

// ================================================================
// STRONA: Filtry / Wykluczenia
// ================================================================

// ---- Wbudowane reguły ----

function renderBuiltinRules(): void {
  const container = document.getElementById('builtin-rules-list')!;
  container.innerHTML = '';

  // Grupuj po source
  const groups = new Map<string, typeof BUILTIN_RULES>();
  for (const rule of BUILTIN_RULES) {
    if (!groups.has(rule.source)) groups.set(rule.source, []);
    groups.get(rule.source)!.push(rule);
  }

  for (const [source, rules] of groups) {
    const groupEl = document.createElement('div');
    groupEl.style.cssText = 'margin-bottom:4px';

    const header = document.createElement('div');
    header.style.cssText = 'font-size:11px;color:var(--muted);margin:10px 0 4px;font-weight:600;text-transform:uppercase;letter-spacing:.06em';
    header.textContent = source;
    groupEl.appendChild(header);

    for (const rule of rules) {
      const isEnabled = filterConfig.builtinEnabled[rule.id] !== false;
      const row = document.createElement('div');
      row.className = 'toggle-row';
      row.innerHTML = `
        <div class="toggle-info">
          <div class="toggle-label">${rule.label}</div>
          <div class="toggle-sub">${rule.type === 'folderName' ? '📁 Folder' : '🔗 Prefix URL'}: <code>${rule.pattern}</code></div>
        </div>
        <label class="toggle">
          <input type="checkbox" data-rule-id="${rule.id}" ${isEnabled ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>`;
      groupEl.appendChild(row);
    }
    container.appendChild(groupEl);
  }

  // Nasłuchuj zmian
  container.querySelectorAll('input[data-rule-id]').forEach(input => {
    input.addEventListener('change', (e) => {
      const id      = (e.target as HTMLInputElement).dataset.ruleId!;
      const checked = (e.target as HTMLInputElement).checked;
      filterConfig.builtinEnabled[id] = checked;
    });
  });
}

// ---- Ręczne wykluczenia ----

function renderManualExclusions(): void {
  const list = document.getElementById('manual-excl-list')!;
  list.innerHTML = '';

  if (filterConfig.manualExclusions.length === 0) {
    list.innerHTML = '<div class="empty">Brak ręcznych wykluczeń</div>';
    return;
  }

  for (const excl of filterConfig.manualExclusions) {
    const icon = excl.type === 'folder' ? '📁' : excl.type === 'urlPattern' ? '🔤' : '🔗';
    const typeLabel = excl.type === 'folder' ? 'Folder' : excl.type === 'urlPattern' ? 'Wzorzec URL' : 'URL';

    const item = document.createElement('div');
    item.className = 'excl-item';
    item.innerHTML = `
      <span class="excl-icon">${icon}</span>
      <div class="excl-info">
        <div class="excl-label">${escapeHtml(excl.label)}</div>
        <div class="excl-type">${typeLabel}</div>
      </div>
      <button class="excl-remove" data-excl-id="${excl.id}" title="Usuń">🗑</button>`;
    list.appendChild(item);
  }

  list.querySelectorAll('.excl-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.exclId!;
      filterConfig.manualExclusions = filterConfig.manualExclusions.filter(ex => ex.id !== id);
      renderManualExclusions();
    });
  });
}

// ---- Dodaj URL / wzorzec ----

document.getElementById('btn-add-url')!.addEventListener('click', () => {
  const input = document.getElementById('excl-url-input') as HTMLInputElement;
  const value = input.value.trim();
  if (!value) return;

  addManualExclusion({ id: crypto.randomUUID(), type: 'url', value, label: value });
  input.value = '';
});

document.getElementById('btn-add-pattern')!.addEventListener('click', () => {
  const input = document.getElementById('excl-url-input') as HTMLInputElement;
  const value = input.value.trim();
  if (!value) return;

  addManualExclusion({ id: crypto.randomUUID(), type: 'urlPattern', value, label: value });
  input.value = '';
});

function addManualExclusion(excl: ManualExclusion): void {
  // Sprawdź duplikaty
  if (filterConfig.manualExclusions.some(e => e.value === excl.value && e.type === excl.type)) return;
  filterConfig.manualExclusions.push(excl);
  renderManualExclusions();
}

// ---- Modal: drzewo zakładek ----

document.getElementById('btn-open-tree')!.addEventListener('click', async () => {
  const modal = document.getElementById('tree-modal')!;
  modal.style.display = 'flex';
  const container = document.getElementById('tree-container')!;
  container.innerHTML = '<div style="color:var(--muted);padding:20px">Ładowanie...</div>';

  const resp = await browser.runtime.sendMessage({ type: 'GET_BOOKMARKS_TREE' }) as { success: boolean; tree: any };
  if (!resp.success) { container.innerHTML = '<div style="color:var(--err)">Błąd wczytywania zakładek</div>'; return; }

  container.innerHTML = '';
  for (const root of resp.tree) {
    renderTreeNode(root, container, 0);
  }
});

document.getElementById('btn-close-tree')!.addEventListener('click', () => {
  document.getElementById('tree-modal')!.style.display = 'none';
});

function renderTreeNode(node: any, parent: HTMLElement, depth: number): void {
  const isFolder  = !node.url;
  const hasChildren = node.children && node.children.length > 0;

  const nodeEl = document.createElement('div');
  nodeEl.className = 'tree-node';

  const row = document.createElement('div');
  row.className = 'tree-row';

  const toggleEl = document.createElement('span');
  toggleEl.className = 'tree-toggle';
  toggleEl.textContent = hasChildren ? '▶' : '';

  const iconEl = document.createElement('span');
  iconEl.className = 'tree-icon';
  iconEl.textContent = isFolder ? '📁' : '🔖';

  const labelEl = document.createElement('span');
  labelEl.className = 'tree-label';
  labelEl.textContent = node.title || '(bez nazwy)';

  if (!isFolder && node.url) {
    const urlEl = document.createElement('span');
    urlEl.className = 'tree-url';
    urlEl.textContent = node.url;
    row.appendChild(toggleEl);
    row.appendChild(iconEl);
    row.appendChild(labelEl);
    row.appendChild(urlEl);
  } else {
    row.appendChild(toggleEl);
    row.appendChild(iconEl);
    row.appendChild(labelEl);
  }

  // Przycisk dodania wykluczenia
  const addBtn = document.createElement('button');
  addBtn.className = 'tree-add-btn';
  addBtn.textContent = '+ Wyklucz';
  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addManualExclusion({
      id:    crypto.randomUUID(),
      type:  'folder',
      value: node.id,
      label: node.title || node.url || '(bez nazwy)',
    });
    addBtn.textContent = '✓ Dodano';
    addBtn.style.color = 'var(--ok)';
    setTimeout(() => { addBtn.textContent = '+ Wyklucz'; addBtn.style.color = ''; }, 2000);
  });
  row.appendChild(addBtn);

  nodeEl.appendChild(row);

  // Dzieci
  if (hasChildren) {
    const childrenEl = document.createElement('div');
    childrenEl.className = 'tree-children collapsed';

    toggleEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const collapsed = childrenEl.classList.toggle('collapsed');
      toggleEl.textContent = collapsed ? '▶' : '▼';
    });

    row.addEventListener('click', () => {
      const collapsed = childrenEl.classList.toggle('collapsed');
      toggleEl.textContent = collapsed ? '▶' : '▼';
    });

    for (const child of node.children) {
      renderTreeNode(child, childrenEl, depth + 1);
    }
    nodeEl.appendChild(childrenEl);
  }

  parent.appendChild(nodeEl);
}

// ---- Zapisz filtry ----

document.getElementById('btn-save-filters')!.addEventListener('click', async () => {
  await saveFilterConfig(filterConfig);
  showStatus('✓ Filtry zapisane', 'success');
});

// ================================================================
// STRONA: Połączenie
// ================================================================

document.getElementById('btn-test-conn')!.addEventListener('click', async () => {
  const port   = parseInt((document.getElementById('conn-port') as HTMLInputElement).value);
  const status = document.getElementById('conn-status')!;
  status.textContent = 'Testuję...';
  try {
    const resp = await fetch(`http://localhost:${port}/status`, { signal: AbortSignal.timeout(2000) });
    const data = await resp.json() as { success: boolean };
    status.textContent = data.success ? '🟢 Połączono z hostem' : '🔴 Host odpowiedział błędem';
    status.style.color = data.success ? 'var(--ok)' : 'var(--err)';
  } catch {
    status.textContent = '🔴 Brak połączenia z hostem';
    status.style.color = 'var(--err)';
  }
});

document.getElementById('btn-save-conn')!.addEventListener('click', async () => {
  const port = parseInt((document.getElementById('conn-port') as HTMLInputElement).value);
  await browser.storage.local.set({ hostPort: port });
  showStatus('✓ Zapisano', 'success');
});

// ================================================================
// STRONA: Historia (konfiguracja)
// ================================================================

document.getElementById('btn-save-hist-cfg')!.addEventListener('click', async () => {
  const maxFiles = parseInt((document.getElementById('hist-max-files') as HTMLInputElement).value);
  await browser.storage.local.set({ histMaxFiles: maxFiles });
  showStatus('✓ Zapisano', 'success');
});

// ================================================================
// Init
// ================================================================

async function init(): Promise<void> {
  filterConfig = await loadFilterConfig();
  renderBuiltinRules();
  renderManualExclusions();

  // Załaduj port
  const data = await browser.storage.local.get(['hostPort', 'histMaxFiles']);
  (document.getElementById('conn-port') as HTMLInputElement).value =
    String((data.hostPort as number) ?? DEFAULT_PORT);
  (document.getElementById('hist-max-files') as HTMLInputElement).value =
    String((data.histMaxFiles as number) ?? 50);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.addEventListener('DOMContentLoaded', init);
