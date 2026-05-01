export const WINDOW_IDS = ['about', 'work', 'skills', 'contact', 'resume', 'terminal'] as const
export type WindowId = (typeof WINDOW_IDS)[number]
