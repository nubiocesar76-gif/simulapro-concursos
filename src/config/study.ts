/** Limite máximo configurável de questões por sessão de estudo. */
export const MAX_QUESTIONS_PER_SESSION = 300;

/** Presets exibidos na criação de sessão (sem opção "Todas"). */
export const SESSION_QUANTITY_PRESETS = [10, 20, 30, 50, 100, 200] as const;

export type SessionQuantityPreset = (typeof SESSION_QUANTITY_PRESETS)[number];

/** Layout padrão das páginas do Portal do Aluno. */
export const STUDENT_PAGE_SHELL = "mx-auto space-y-8 2xl:max-w-[1600px]";
export const STUDENT_PAGE_SHELL_NARROW = "mx-auto space-y-8 max-w-2xl";
