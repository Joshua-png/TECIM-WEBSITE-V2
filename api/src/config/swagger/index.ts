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
      last_login_at: { type: "string", format: "date-time", nullable: true },
      created_at: { type: "string", format: "date-time" },
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
      published_version_id: { type: "string", format: "uuid", nullable: true },
      created_at: { type: "string", format: "date-time" },
      updated_at: { type: "string", format: "date-time" },
    },
  },
  Section: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      page_id: { type: "string", format: "uuid" },
      template: { type: "string" },
      layout: { type: "string" },
      label: { type: "string", nullable: true },
      content: { type: "object" },
      display_order: { type: "integer" },
      status: { type: "string", enum: ["draft", "published"] },
      published_version_id: { type: "string", format: "uuid", nullable: true },
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
      page_id: { type: "string", format: "uuid" },
      number: { type: "integer" },
      snapshot: { type: "object" },
      created_by: { type: "string", format: "uuid" },
      created_at: { type: "string", format: "date-time" },
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
      component_name: { type: "string" },
      is_active: { type: "boolean" },
      created_at: { type: "string", format: "date-time" },
      updated_at: { type: "string", format: "date-time" },
    },
  },
  Setting: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      key: { type: "string" },
      value: { type: "object" },
      group: { type: "string", nullable: true },
      created_at: { type: "string", format: "date-time" },
      updated_at: { type: "string", format: "date-time" },
    },
  },
  NavItem: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      label: { type: "string" },
      url: { type: "string", nullable: true },
      page_id: { type: "string", format: "uuid", nullable: true },
      target: { type: "string", enum: ["_self", "_blank"] },
      parent_id: { type: "string", format: "uuid", nullable: true },
      display_order: { type: "integer" },
      is_active: { type: "boolean" },
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
      page_id: { type: "string", format: "uuid", nullable: true },
      meta_title: { type: "string", nullable: true },
      meta_description: { type: "string", nullable: true },
      og_image_media_id: { type: "string", format: "uuid", nullable: true },
      canonical_url: { type: "string", nullable: true },
      updated_at: { type: "string", format: "date-time" },
    },
  },
  ActivityEntry: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      user_id: { type: "string", format: "uuid" },
      action: { type: "string" },
      entity_type: { type: "string" },
      entity_id: { type: "string", format: "uuid", nullable: true },
      details: { type: "object" },
      ip: { type: "string", nullable: true },
      created_at: { type: "string", format: "date-time" },
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

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
