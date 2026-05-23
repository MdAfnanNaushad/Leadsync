import { Request, Response } from "express";
import { LeadRepository } from "../repositories/lead.repository";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { LeadStatus, LeadSource } from "../constants/enums";

const getSingleParam = (
  param: string | string[] | undefined,
): string | undefined => (Array.isArray(param) ? param[0] : param);

/**
 * Handle Multi-Filter Paginated Lead Retrieval
 */
export const handleGetLeads = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // Parse, scrub, and fallback query parameters safely
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);

    const status = req.query.status
      ? (req.query.status as LeadStatus)
      : undefined;
    const source = req.query.source
      ? (req.query.source as LeadSource)
      : undefined;
    const search = req.query.search
      ? (req.query.search as string).trim()
      : undefined;
    const sortBy = req.query.sortBy === "Oldest" ? "Oldest" : "Latest";

    const paginatedResult = await LeadRepository.findPaginated({
      page,
      limit,
      status,
      source,
      search,
      sortBy,
    });

    res.status(200).json({
      status: "success",
      ...paginatedResult,
    });
  },
);

/**
 * Handle Single Lead Retrieval by ID
 */
export const handleGetLeadById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const leadId = getSingleParam(req.params.id);
    if (!leadId) {
      throw new AppError("Invalid lead identifier.", 400);
    }

    const lead = await LeadRepository.findById(leadId);
    if (!lead) {
      throw new AppError(
        "No lead record located under the provided identifier.",
        404,
      );
    }

    res.status(200).json({
      status: "success",
      data: lead,
    });
  },
);

/**
 * Handle Creating a New Lead
 */
export const handleCreateLead = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const freshLead = await LeadRepository.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Lead tracking profile persisted successfully.",
      data: freshLead,
    });
  },
);

/**
 * Handle Modifying an Existing Lead
 */
export const handleUpdateLead = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const leadId = getSingleParam(req.params.id);
    if (!leadId) {
      throw new AppError("Invalid lead identifier.", 400);
    }

    const modifiedLead = await LeadRepository.update(leadId, req.body);
    if (!modifiedLead) {
      throw new AppError(
        "No lead record located under the provided identifier.",
        404,
      );
    }

    res.status(200).json({
      status: "success",
      message: "Lead tracking parameters updated successfully.",
      data: modifiedLead,
    });
  },
);

/**
 * Handle Eliminating a Lead Record (Admin Restricted)
 */
export const handleDeleteLead = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const leadId = getSingleParam(req.params.id);
    if (!leadId) {
      throw new AppError("Invalid lead identifier.", 400);
    }

    const erasedLead = await LeadRepository.delete(leadId);
    if (!erasedLead) {
      throw new AppError(
        "No lead record located under the provided identifier.",
        404,
      );
    }

    res.status(200).json({
      status: "success",
      message:
        "Lead record permanently purged from storage cluster structures.",
    });
  },
);

/**
 * Handle Backend Full Data Dump CSV Export Stream
 */
export const handleExportLeadsCsv = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // Fetch all records across filters ignoring pagination slicing bounds
    const status = req.query.status
      ? (req.query.status as LeadStatus)
      : undefined;
    const source = req.query.source
      ? (req.query.source as LeadSource)
      : undefined;
    const search = req.query.search
      ? (req.query.search as string).trim()
      : undefined;

    const { leads } = await LeadRepository.findPaginated({
      page: 1,
      limit: 100000, // Safe large memory limit to capture full context lists
      status,
      source,
      search,
      sortBy: "Latest",
    });

    // Construct CSV String with string escaping rules
    const headers = "ID,Name,Email,Status,Source,CreatedAt\n";
    const csvRows = leads
      .map((lead: any) => {
        const escapedName = `"${lead.name.replace(/"/g, '""')}"`;
        const escapedEmail = `"${lead.email.replace(/"/g, '""')}"`;
        return `${lead._id},${escapedName},${escapedEmail},${lead.status},${lead.source},${lead.createdAt.toISOString()}`;
      })
      .join("\n");

    const fullCsvDataString = headers + csvRows;

    // Set binary dynamic downpour header context metadata pointers
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=leads_export_${Date.now()}.csv`,
    );

    res.status(200).send(fullCsvDataString);
  },
);
