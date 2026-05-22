import { z } from "zod";
import { LeadStatus, LeadSource } from "../constants/enums";

export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Lead primary name is required." })
      .trim()
      .min(2, "Name must be at least 2 characters long."),
    email: z
      .string({ error: "Lead communication email is required." })
      .trim()
      .email("Invalid email coordinate structure."),
    status: z
      .nativeEnum(LeadStatus)
      .optional()
      .catch(() => undefined),
    source: z.nativeEnum(LeadSource, {
      error: "Invalid lead processing source passed.",
    }),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid parameter: target must be a valid Mongoose ObjectId.",
      ),
  }),
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters.")
        .optional(),
      email: z
        .string()
        .trim()
        .email("Invalid email address formatting.")
        .optional(),
      status: z.nativeEnum(LeadStatus).optional(),
      source: z.nativeEnum(LeadSource).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message:
        "To complete an update, at least one structural property must be altered.",
    }),
});

export const leadIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Target query key must match a standard MongoDB Hex ObjectId.",
      ),
  }),
});
