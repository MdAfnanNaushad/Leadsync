import { Router } from "express";
import * as leadController from "../controllers/lead.controller";
import {
  authenticateTokenGuard,
  authorizeRolesGuard,
} from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import {
  createLeadSchema,
  updateLeadSchema,
  leadIdParamSchema,
} from "../validators/lead.validator";
import { UserRole } from "../constants/enums";

const leadRouter = Router();

// Secure all downstream module actions behind the verification guard
leadRouter.use(authenticateTokenGuard as any);

// Read-only actions (Accessible to both Administrators and standard Sales Users)
leadRouter.get("/", leadController.handleGetLeads);
leadRouter.get("/export", leadController.handleExportLeadsCsv);
leadRouter.get(
  "/:id",
  validateRequest(leadIdParamSchema),
  leadController.handleGetLeadById,
);

// Write actions (Accessible to both roles)
leadRouter.post(
  "/",
  validateRequest(createLeadSchema),
  leadController.handleCreateLead,
);
leadRouter.patch(
  "/:id",
  validateRequest(updateLeadSchema),
  leadController.handleUpdateLead,
);

// Destructive Purge Action (Strictly isolated to Admin role clearances)
leadRouter.delete(
  "/:id",
  authorizeRolesGuard(UserRole.ADMIN) as any,
  validateRequest(leadIdParamSchema),
  leadController.handleDeleteLead,
);

export default leadRouter;
