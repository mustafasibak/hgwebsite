import * as migration_20260707_111946_initial from './20260707_111946_initial';
import * as migration_20251101_120000_menu_items_search_keywords from './20251101_120000_menu_items_search_keywords';

export const migrations = [
  {
    up: migration_20260707_111946_initial.up,
    down: migration_20260707_111946_initial.down,
    name: '20260707_111946_initial'
  },
  {
    up: migration_20251101_120000_menu_items_search_keywords.up,
    down: migration_20251101_120000_menu_items_search_keywords.down,
    name: '20251101_120000_menu_items_search_keywords'
  },
];
