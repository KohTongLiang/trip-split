import type { Group } from '../types';

const GROUPS_KEY = 'tripsplit.groups.v1';
const SELECTED_GROUP_KEY = 'tripsplit.selectedGroupId.v1';

export const loadGroups = (): Group[] | null => {
  try {
    const raw = localStorage.getItem(GROUPS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as any[];

    // Lightweight migration: support legacy shape with memberIds
    const migrated: Group[] = parsed.map((g: any) => {
      // If legacy, convert memberIds -> members (use ids as names directly)
      const members: string[] = Array.isArray(g.members)
        ? g.members
        : Array.isArray(g.memberIds)
          ? g.memberIds
          : [];
      const expenses = Array.isArray(g.expenses) ? g.expenses : [];
      return {
        id: g.id,
        name: g.name,
        members,
        expenses,
      } as Group;
    });

    return migrated;
  } catch {
    return null;
  }
};

export const saveGroups = (groups: Group[]) => {
  try {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  } catch {
    // ignore
  }
};

export const loadSelectedGroupId = (): string | null => {
  try {
    return localStorage.getItem(SELECTED_GROUP_KEY);
  } catch {
    return null;
  }
};

export const saveSelectedGroupId = (id: string) => {
  try {
    localStorage.setItem(SELECTED_GROUP_KEY, id);
  } catch {
    // ignore
  }
};
