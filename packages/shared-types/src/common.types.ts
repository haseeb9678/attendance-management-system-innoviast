export const ENTITY_STATUSES = [
    "active",
    "inactive",
] as const;

export type EntityStatus = (typeof ENTITY_STATUSES)[number];