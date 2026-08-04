import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { openApiSchemas } from "./openapi-schemas.js";

const router = express.Router();

const sharedSchemas = {
  SuccessEnvelope: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: { type: "boolean", example: true },
      data: {},
    },
  },
  ErrorEnvelope: {
    type: "object",
    required: ["success", "error"],
    properties: {
      success: { type: "boolean", example: false },
      error: {
        type: "object",
        required: ["code", "message"],
        properties: {
          code: {
            type: "string",
            enum: [
              "VALIDATION_ERROR",
              "UNAUTHORIZED",
              "FORBIDDEN",
              "NOT_FOUND",
              "CONFLICT",
              "RATE_LIMITED",
              "OTP_EXPIRED",
              "OTP_INVALID",
              "INTERNAL",
            ],
          },
          message: { type: "string" },
          details: { type: "array", items: {} },
        },
      },
    },
  },
  PaginatedEnvelope: {
    type: "object",
    required: ["success", "data", "meta"],
    properties: {
      success: { type: "boolean", example: true },
      data: { type: "array", items: {} },
      meta: {
        type: "object",
        required: ["page", "perPage", "total"],
        properties: {
          page: { type: "integer" },
          perPage: { type: "integer" },
          total: { type: "integer" },
        },
      },
    },
  },
  User: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      email: { type: "string", format: "email" },
      name: { type: "string", nullable: true },
      role: { type: "string" },
      lastLoginAt: { type: "string", format: "date-time", nullable: true },
      createdAt: { type: "string", format: "date-time", nullable: true },
    },
  },
  TokenPair: {
    type: "object",
    required: ["accessToken", "refreshToken"],
    properties: {
      accessToken: { type: "string" },
      refreshToken: { type: "string" },
    },
  },
  Page: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      slug: { type: "string" },
      title: { type: "string" },
      status: { type: "string", enum: ["draft", "published"] },
      publishedVersionId: { type: "string", format: "uuid", nullable: true },
      publishedAt: { type: "string", format: "date-time", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  Section: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      pageId: { type: "string", format: "uuid" },
      template: { type: "string" },
      layout: { type: "string" },
      label: { type: "string", nullable: true },
      content: { type: "object" },
      displayOrder: { type: "integer" },
      status: { type: "string", enum: ["draft", "published"] },
      publishedVersionId: { type: "string", format: "uuid", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  PageWithSections: {
    type: "object",
    required: ["page", "sections"],
    properties: {
      page: { $ref: "#/components/schemas/Page" },
      sections: {
        type: "array",
        items: { $ref: "#/components/schemas/Section" },
      },
    },
  },
  Version: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      pageId: { type: "string", format: "uuid" },
      number: { type: "integer" },
      snapshot: { type: "object" },
      createdBy: { type: "string", format: "uuid", nullable: true },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  SectionTemplate: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      slug: { type: "string" },
      name: { type: "string" },
      description: { type: "string", nullable: true },
      schema: { type: "object" },
      componentName: { type: "string" },
      isActive: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  Setting: {
    type: "object",
    properties: {
      key: { type: "string" },
      value: { type: "object" },
      group: { type: "string", nullable: true },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  NavItem: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      label: { type: "string" },
      url: { type: "string", nullable: true },
      pageId: { type: "string", format: "uuid", nullable: true },
      target: { type: "string", enum: ["_self", "_blank"] },
      parentId: { type: "string", format: "uuid", nullable: true },
      displayOrder: { type: "integer" },
      isActive: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      children: {
        type: "array",
        items: { $ref: "#/components/schemas/NavItem" },
      },
    },
  },
  Seo: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      scope: { type: "string", enum: ["global", "page"] },
      pageId: { type: "string", format: "uuid", nullable: true },
      metaTitle: { type: "string", nullable: true },
      metaDescription: { type: "string", nullable: true },
      ogImageMediaId: { type: "string", format: "uuid", nullable: true },
      canonicalUrl: { type: "string", nullable: true },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  ActivityEntry: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      userId: { type: "string", format: "uuid", nullable: true },
      action: { type: "string" },
      entityType: { type: "string", nullable: true },
      entityId: { type: "string", format: "uuid", nullable: true },
      details: { type: "object" },
      ip: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  Media: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      publicId: { type: "string" },
      secureUrl: { type: "string", format: "url" },
      width: { type: "integer", nullable: true },
      height: { type: "integer", nullable: true },
      format: { type: "string", nullable: true },
      resourceType: { type: "string", enum: ["image", "video"] },
      sizeBytes: { type: "integer", nullable: true },
      folder: { type: "string", nullable: true },
      altText: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  Event: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      title: { type: "string" },
      slug: { type: "string", nullable: true },
      description: { type: "string", nullable: true },
      startAt: { type: "string", format: "date-time" },
      endAt: { type: "string", format: "date-time", nullable: true },
      location: { type: "string", nullable: true },
      imageMediaId: { type: "string", format: "uuid", nullable: true },
      status: { type: "string", enum: ["draft", "published"] },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  GalleryItem: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      mediaId: { type: "string", format: "uuid" },
      caption: { type: "string", nullable: true },
      altText: { type: "string", nullable: true },
      displayOrder: { type: "integer" },
      isFeatured: { type: "boolean" },
      status: { type: "string", enum: ["draft", "published"] },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  Sermon: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      title: { type: "string" },
      speaker: { type: "string", nullable: true },
      description: { type: "string", nullable: true },
      mediaUrl: { type: "string", nullable: true },
      imageMediaId: { type: "string", format: "uuid", nullable: true },
      datePreached: { type: "string", format: "date", nullable: true },
      status: { type: "string", enum: ["draft", "published"] },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  Announcement: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      title: { type: "string" },
      body: { type: "string", nullable: true },
      linkUrl: { type: "string", nullable: true },
      linkLabel: { type: "string", nullable: true },
      activeFrom: { type: "string", format: "date-time", nullable: true },
      activeUntil: { type: "string", format: "date-time", nullable: true },
      status: { type: "string", enum: ["draft", "published"] },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TECIM API",
      version: "1.0.0",
      description:
        "Backend API for the TECIM public website and admin CMS. " +
        "Public endpoints read published content; `/api/v1/admin/*` endpoints require a bearer JWT " +
        "obtained from `POST /api/v1/auth/login`.",
    },
    components: {
      schemas: {
        ...sharedSchemas,
        ...openApiSchemas,
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
  customJs: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
  customSiteTitle: "TECIM API Docs",
}));

export default router;
