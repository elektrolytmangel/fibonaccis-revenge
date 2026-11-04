export type Plural = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

const en = {
  "landing.lead": "Estimate together, calmly.",
  "landing.leadInvited": "You’ve been invited to estimate together.",
  "landing.name": "Your name",
  "landing.create": "Create room",
  "landing.join": "Join room",
  "room.copyLink": "Copy invite link",
  "room.linkCopied": "Link copied",
  "room.deck": "Choose your card",
  "room.unsure": "Unsure",
  "room.reveal": "Reveal votes",
  "room.reset": "Reset",
  "room.hintStart": "Pick a card to get started.",
  "room.waiting": {
    one: "Waiting for {count} more vote…",
    other: "Waiting for {count} more votes…",
  } satisfies Plural,
  "room.allVoted": "Everyone has voted.",
  "room.estimate": "Estimate",
  "room.participants": "Participants",
  "room.you": "(you)",
  "room.voted": "✓ Voted",
  "room.thinking": "Thinking…",
  "room.addDemo": "Add test teammate (dev only)",
  "settings.theme": "Theme",
  "settings.theme.system": "System",
  "settings.theme.light": "Light",
  "settings.theme.dark": "Dark",
  "settings.language": "Language",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string | Plural>;

const de: Messages = {
  "landing.lead": "Gemeinsam schätzen, entspannt.",
  "landing.leadInvited": "Du wurdest eingeladen, gemeinsam zu schätzen.",
  "landing.name": "Dein Name",
  "landing.create": "Raum erstellen",
  "landing.join": "Raum beitreten",
  "room.copyLink": "Einladungslink kopieren",
  "room.linkCopied": "Link kopiert",
  "room.deck": "Wähle deine Karte",
  "room.unsure": "Unsicher",
  "room.reveal": "Aufdecken",
  "room.reset": "Zurücksetzen",
  "room.hintStart": "Wähle eine Karte, um zu starten.",
  "room.waiting": {
    one: "Warte auf noch {count} Stimme…",
    other: "Warte auf noch {count} Stimmen…",
  },
  "room.allVoted": "Alle haben abgestimmt.",
  "room.estimate": "Schätzung",
  "room.participants": "Teilnehmende",
  "room.you": "(du)",
  "room.voted": "✓ Abgestimmt",
  "room.thinking": "Überlegt…",
  "room.addDemo": "Test-Teammitglied hinzufügen (nur Entwicklung)",
  "settings.theme": "Design",
  "settings.theme.system": "System",
  "settings.theme.light": "Hell",
  "settings.theme.dark": "Dunkel",
  "settings.language": "Sprache",
};

const pl: Messages = {
  "landing.lead": "Szacujcie razem, na spokojnie.",
  "landing.leadInvited": "Zaproszono Cię do wspólnego szacowania.",
  "landing.name": "Twoje imię",
  "landing.create": "Utwórz pokój",
  "landing.join": "Dołącz do pokoju",
  "room.copyLink": "Kopiuj link zaproszenia",
  "room.linkCopied": "Link skopiowany",
  "room.deck": "Wybierz swoją kartę",
  "room.unsure": "Nie wiem",
  "room.reveal": "Pokaż głosy",
  "room.reset": "Resetuj",
  "room.hintStart": "Wybierz kartę, aby zacząć.",
  "room.waiting": {
    one: "Czekamy jeszcze na {count} głos…",
    few: "Czekamy jeszcze na {count} głosy…",
    many: "Czekamy jeszcze na {count} głosów…",
    other: "Czekamy jeszcze na {count} głosu…",
  },
  "room.allVoted": "Wszyscy zagłosowali.",
  "room.estimate": "Szacunek",
  "room.participants": "Uczestnicy",
  "room.you": "(Ty)",
  "room.voted": "✓ Głos oddany",
  "room.thinking": "Myśli…",
  "room.addDemo": "Dodaj testowego kolegę (tylko dev)",
  "settings.theme": "Motyw",
  "settings.theme.system": "Systemowy",
  "settings.theme.light": "Jasny",
  "settings.theme.dark": "Ciemny",
  "settings.language": "Język",
};

export const LANGUAGES = {
  en: { name: "English", messages: en as Messages },
  de: { name: "Deutsch", messages: de },
  pl: { name: "Polski", messages: pl },
} as const;

export type Language = keyof typeof LANGUAGES;
export const LANGUAGE_CODES = Object.keys(LANGUAGES) as Language[];
