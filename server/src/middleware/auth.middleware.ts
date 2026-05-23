import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { UserRole } from "../constants/enums";

// Define the payload structure inside our cryptographically signed tokens
export interface TokenPayload {
  userId: string;
  role: UserRole;
}

// Extend Express Request typing context to bind identity safely without using 'any'
export interface SecurityContextRequest extends Request {
  identityContext?: TokenPayload;
}

/**
 * Gatekeeper Middleware: Re-verifies access tokens passed via headers
 */
export const authenticateTokenGuard = (
  req: SecurityContextRequest,
  res: Response,
  next: NextFunction,
): void => {
  const contextHeader = req.headers.authorization;

  if (!contextHeader?.startsWith("Bearer ")) {
    return next(
      new AppError(
        "Access Denied: Authentication session token coordinates missing.",
        401,
      ),
    );
  }

  const bearerToken = contextHeader.split(" ")[1];

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new AppError(
        "Security Subsystem Fault: JWT signature secret is missing on host configuration environment.",
        500,
      );
    }

    // Verify token validity against signature keys
    const verifiedToken = jwt.verify(bearerToken, secretKey) as TokenPayload;

    // Bind token data safely straight into the active request execution stream
    req.identityContext = verifiedToken;
    next();
  } catch (error) {
    return next(
      new AppError(
        "Forbidden: Access session key validation expired or corrupted.",
        403,
      ),
    );
  }
};

/**
 * RBAC Filter Middleware: Verifies user role clearance levels
 */
export const authorizeRolesGuard = (...permittedRoles: UserRole[]) => {
  return (
    req: SecurityContextRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.identityContext) {
      return next(
        new AppError(
          "Security Validation Aborted: User session is unverified.",
          401,
        ),
      );
    }

    if (!permittedRoles.includes(req.identityContext.role)) {
      return next(
        new AppError(
          "Access Denied: Your account role tier possesses insufficient permissions.",
          403,
        ),
      );
    }

    next();
  };
};
