import bcrypt from "bcryptjs";
import { env } from "./config/env.js";
import { homePageSeed } from "./config/seedContent.js";
import { sectionTemplates } from "./config/templates.js";
import * as pageRepo from "./repositories/page.repo.js";
import * as sectionRepo from "./repositories/section.repo.js";
import * as templateRepo from "./repositories/template.repo.js";
import * as userRepo from "./repositories/user.repo.js";
import * as versionRepo from "./repositories/version.repo.js";
import { logger } from "./utils/logger.js";

async function seedAdmin(): Promise<userRepo.UserRow> {
  const existing = await userRepo.findByEmail(env.adminEmail);
  if (existing) {
    logger.info(`Admin user already exists: ${env.adminEmail}`);
    return existing;
  }
  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  const admin = await userRepo.createUser({
    email: env.adminEmail,
    passwordHash,
    name: env.adminName,
  });
  logger.info(`Seeded admin user: ${admin.email}`);
  return admin;
}

async function seedTemplates(): Promise<void> {
  for (const template of sectionTemplates) {
    await templateRepo.upsert({
      slug: template.slug,
      name: template.name,
      description: template.description,
      schema: template.schema,
      componentName: template.componentName,
    });
  }
  logger.info(`Seeded ${sectionTemplates.length} section templates`);
}

async function seedHomePage(admin: userRepo.UserRow): Promise<void> {
  const existing = await pageRepo.findBySlug(homePageSeed.slug);
  if (existing) {
    logger.info(`Home page already exists (${existing.slug}); skipping`);
    return;
  }

  const page = await pageRepo.create({
    slug: homePageSeed.slug,
    title: homePageSeed.title,
  });

  for (let index = 0; index < homePageSeed.sections.length; index += 1) {
    const seedSection = homePageSeed.sections[index];
    await sectionRepo.create(page.id, {
      template: seedSection.template,
      layout: seedSection.layout,
      label: seedSection.label,
      content: seedSection.content,
      displayOrder: index,
    });
  }

  const sections = await sectionRepo.findByPage(page.id);
  const snapshot = {
    page: { slug: page.slug, title: page.title },
    sections: sections.map((section) => ({
      template: section.template,
      layout: section.layout,
      label: section.label,
      content: section.content,
      display_order: section.display_order,
    })),
  };
  const version = await versionRepo.create({
    pageId: page.id,
    snapshot,
    createdBy: admin.id,
  });
  await pageRepo.setPublished(page.id, version.id);
  await sectionRepo.setPublishedByPage(page.id, version.id);

  logger.info(
    `Seeded home page with ${sections.length} sections (published, version ${version.number})`
  );
}

async function run(): Promise<void> {
  const admin = await seedAdmin();
  await seedTemplates();
  await seedHomePage(admin);
  logger.info("Seed complete");
}

void run()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    logger.error("Seed failed", err);
    process.exit(1);
  });
