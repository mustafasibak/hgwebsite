import { de } from '@payloadcms/translations/languages/de'

/**
 * Natural German for the restaurant owner — Payload’s default de pack is often
 * too literal (e.g. boolean values as „Wahr“ / „Falsch“ instead of „Ja“ / „Nein“).
 */
export const payloadDeOverrides: typeof de.translations = {
  ...de.translations,
  general: {
    ...de.translations.general,
    true: 'Ja',
    false: 'Nein',
    dashboard: 'Übersicht',
    createNew: 'Neu anlegen',
    createNewLabel: 'Neues {{label}} anlegen',
    document: 'Eintrag',
    documents: 'Einträge',
    noResults:
      'Keine {{label}} gefunden. Noch nichts angelegt oder Filter schließen alles aus.',
    noResultsDescription:
      'Es gibt noch keine Einträge — oder der aktuelle Filter passt zu nichts.',
    save: 'Speichern',
    saveChanges: 'Änderungen speichern',
    searchBy: '{{label}} suchen',
    selectAll: 'Alle {{count}} {{label}} auswählen',
    showAllLabel: 'Alle {{label}} anzeigen',
  },
  fields: {
    ...de.translations.fields,
    addNew: 'Neu hinzufügen',
    addNewLabel: 'Neues {{label}}',
    saveChanges: 'Änderungen speichern',
  },
  validation: {
    ...de.translations.validation,
    trueOrFalse: 'Bitte Ja oder Nein wählen.',
    required: 'Pflichtfeld — bitte ausfüllen.',
  },
}
