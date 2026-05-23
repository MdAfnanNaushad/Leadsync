// Open client/src/types/shared.types.ts and update your enums to look like this:

export const UserRole = {
  ADMIN: 'Admin',
  SALES: 'Sales User'
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const LeadStatus = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  LOST: 'Lost'
} as const;
export type LeadStatus = typeof LeadStatus[keyof typeof LeadStatus];

export const LeadSource = {
  WEBSITE: 'Website',
  INSTAGRAM: 'Instagram',
  REFERRAL: 'Referral'
} as const;
export type LeadSource = typeof LeadSource[keyof typeof LeadSource];


// Keep the rest of your structural interfaces exactly the same below them:
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  totalRecords: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}