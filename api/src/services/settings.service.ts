import * as activityRepo from "../repositories/activity.repo.js";
import * as settingsRepo from "../repositories/settings.repo.js";

const PUBLIC_GROUPS = [
  "site",
  "contact",
  "social",
  "service-times",
  "announcements",
];

const GROUP_BY_KEY_PREFIX: Array<[string, string]> = [
  ["social_", "social"],
  ["contact_", "contact"],
  ["service_times", "service-times"],
  ["announcement", "announcements"],
  ["site_", "site"],
];

export async function listAll(): Promise<settingsRepo.SettingRow[]> {
  return settingsRepo.findAll();
}

export async function listPublic(): Promise<settingsRepo.SettingRow[]> {
  return settingsRepo.findByGroups(PUBLIC_GROUPS);
}

export async function updateSetting(
  key: string,
  value: Record<string, unknown>,
  actor: { id: string; ip?: string | null }
): Promise<settingsRepo.SettingRow> {
  const group =
    GROUP_BY_KEY_PREFIX.find(([prefix]) => key.startsWith(prefix))?.[1] ?? null;
  const setting = await settingsRepo.upsert(key, value, group);
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "settings",
    details: { key, group },
    ip: actor.ip ?? null,
  });
  return setting;
}
