import { LeadModel, ILeadDocument } from "../models/Lead";
import { LeadStatus, LeadSource } from "../constants/enums";

export interface LeadsFilterCriteria {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sortBy?: "Latest" | "Oldest";
  page: number;
  limit: number;
}

export interface PaginatedLeadsResult {
  leads: ILeadDocument[];
  meta: {
    totalRecords: number;
    currentPage: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class LeadRepository {
  /**
   * Orchestrates dynamic multi-filtering, search indexing, and database pagination.
   */
  public static async findPaginated(
    criteria: LeadsFilterCriteria,
  ): Promise<PaginatedLeadsResult> {
    const { status, source, search, sortBy, page, limit } = criteria;
    const matchConditions: any = {};

    // 1. Compose Status and Source filters dynamically
    if (status) matchConditions.status = status;
    if (source) matchConditions.source = source;

    // 2. Compose Multi-Property Partial Text Search (Matches Name OR Email)
    if (search) {
      matchConditions.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 3. Define Sorting Sequence Direction
    const sortDirection = sortBy === "Oldest" ? 1 : -1; // Default to Latest (-1)
    const recordsToSkip = (page - 1) * limit;

    // 4. Run database search and total document count concurrently to minimize latency
    const [leadsList, totalCount] = await Promise.all([
      LeadModel.find(matchConditions)
        .sort({ createdAt: sortDirection })
        .skip(recordsToSkip)
        .limit(limit)
        .lean() // Returns lightweight plain objects for optimized execution speed
        .exec() as unknown as ILeadDocument[],
      LeadModel.countDocuments(matchConditions).exec(),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
      leads: leadsList,
      meta: {
        totalRecords: totalCount,
        currentPage: page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Persists a fresh Lead profile document directly to the database collection.
   */
  public static async create(
    data: Partial<ILeadDocument>,
  ): Promise<ILeadDocument> {
    return await LeadModel.create(data);
  }

  /**
   * Fetches a single explicit Lead document profile using its target primary key ID identifier.
   */
  public static async findById(id: string): Promise<ILeadDocument | null> {
    return await LeadModel.findById(id).exec();
  }

  /**
   * Modifies an existing Lead document entity with matching operational patch attributes.
   */
  public static async update(
    id: string,
    updateData: Partial<ILeadDocument>,
  ): Promise<ILeadDocument | null> {
    return await LeadModel.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the freshly modified document variant profile
      runValidators: true, // Enforces Mongoose strict structural rules validation checks
    }).exec();
  }

  /**
   * Eliminates a target Lead entity tracking entry from the active cluster storage.
   */
  public static async delete(id: string): Promise<ILeadDocument | null> {
    return await LeadModel.findByIdAndDelete(id).exec();
  }
}
