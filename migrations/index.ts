import * as migration_20260707_111946_initial from './20260707_111946_initial';

export const migrations = [
  {
    up: migration_20260707_111946_initial.up,
    down: migration_20260707_111946_initial.down,
    name: '20260707_111946_initial'
  },
];
