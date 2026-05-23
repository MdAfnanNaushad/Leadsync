import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel, IUserDocument } from "../models/User";
import { AppError } from "../utils/AppError";
import { UserRole } from "../constants/enums";

interface RegisterInput {
  name: string;
  email: string;
  passwordRaw: string;
  role?: UserRole;
}

export class AuthService {
  private static generateToken(userId: string, role: UserRole): string {
    const secretKey = process.env.JWT_SECRET_KEY;
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    if (!secretKey) {
      throw new AppError(
        "Authenticate system Fault: JWT token configuration secret is completely undefined",
        500,
      );
    }
    return jwt.sign({ userId, role }, secretKey, {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    });
  }
  public static async registerUser(input: RegisterInput) {
    const existingUser = await UserModel.findOne({
      email: input.email.toLocaleLowerCase(),
    }).lean();
    if (existingUser) {
      throw new AppError(
        "A user profile is registerd under that email coordinate already exists ",
        400,
      );
    }
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(input.passwordRaw, saltRounds);

    const userProfile = await UserModel.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role || UserRole.SALES,
    });
    const token = this.generateToken(userProfile.id, userProfile.role);

    return {
      token,
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
      },
    };
  }

  public static async loginUser(email: string, passwordRaw: string) {
    const userProfile = await UserModel.findOne({
      email: email.toLowerCase(),
    }).exec();
    if (!userProfile) {
      throw new AppError(
        "Invalid email coordinate or account erification credentials passed",
        400,
      );
    }
    const matchesValidation = await bcrypt.compare(
      passwordRaw,
      userProfile.passwordHash,
    );
    if (!matchesValidation) {
      throw new AppError(
        "Invalid email or account verification ceentils passed",
        401,
      );
    }
    const token = this.generateToken(userProfile.id, userProfile.role);
    return {
      token,
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
      },
    };
  }
}
