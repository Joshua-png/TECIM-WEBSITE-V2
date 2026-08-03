import * as activityRepo from "../repositories/activity.repo.js";
import * as navigationRepo from "../repositories/navigation.repo.js";

export interface NavTreeNode extends navigationRepo.NavItemRow {
  children: NavTreeNode[];
}

export async function getTree(): Promise<NavTreeNode[]> {
  const items = await navigationRepo.listActive();
  const roots: NavTreeNode[] = [];
  const byId = new Map<string, NavTreeNode>();
  for (const item of items) {
    const node: NavTreeNode = { ...item, children: [] };
    byId.set(item.id, node);
    if (item.parent_id && byId.has(item.parent_id)) {
      byId.get(item.parent_id)?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export async function replaceNavigation(
  items: navigationRepo.NavItemInput[],
  actor: { id: string; ip?: string | null }
): Promise<void> {
  await navigationRepo.replaceAll(items);
  await activityRepo.create({
    userId: actor.id,
    action: "update",
    entityType: "navigation",
    details: { itemCount: items.length },
    ip: actor.ip ?? null,
  });
}
