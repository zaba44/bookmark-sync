export interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  dateAdded?: number;
  dateModified?: number;
  children?: BookmarkNode[];
  specialFolder?: 'toolbar' | 'menu' | 'unsorted' | 'mobile' | 'root';
}

export type SyncMode = 'manual' | 'scheduled';

export type AutoSyncMode = 'add_missing' | 'full_sync';

export interface ScheduleSettings {
  mode: SyncMode;
  intervalMinutes: number;  // 1-60
  syncOnStartup: boolean;
  autoSyncMode: AutoSyncMode;  // tryb automatycznej sync
}

export const DEFAULT_SCHEDULE: ScheduleSettings = {
  mode: 'manual',
  intervalMinutes: 5,
  syncOnStartup: true,
  autoSyncMode: 'full_sync',
};

export interface ExtensionSettings {
  syncDirectory: string;
  hostPort: number;
  instanceId: string;
  lastSaveTime?: string;
  lastSaveCount?: number;
  lastSyncTime?: string;
  schedule: ScheduleSettings;
}

export type BackgroundMessage =
  | { type: 'SAVE_BOOKMARKS' }
  | { type: 'IMPORT_BOOKMARKS'; mode: 'replace' | 'merge'; historyFile?: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<ExtensionSettings> }
  | { type: 'GET_STATUS' }
  | { type: 'GET_BOOKMARKS_TREE' }
  | { type: 'REFRESH_FAVICONS'; concurrency: number; timeoutMs: number }
  | { type: 'CANCEL_FAVICON_REFRESH' }
  | { type: 'GET_FAVICON_STATUS' };

export interface BackgroundResponse {
  success: boolean;
  count?: number;
  path?: string;
  error?: string;
  tree?: any;
  nextAlarmTime?: number;
}

export interface StatusResponse {
  lastSaveTime?: string;
  lastSaveCount?: number;
  schedule: ScheduleSettings;
  nextAlarmTime?: number;
  hostReachable?: boolean;
}

export const ALARM_NAME  = 'bookmark-sync-scheduled';
export const DEFAULT_PORT = 51062;
