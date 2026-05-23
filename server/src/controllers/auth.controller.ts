import { Response, Request } from "express";
import { AuthService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";

export const handleRegistration = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;

    const sessionPayload = await AuthService.registerUser({
      name,
      email,
      passwordRaw: password,
      role,
    });

    res.status(201).json({
      status: "success",
      message: "User profile registered successfully within the ecosystem.",
      data: sessionPayload,
    });
  },
);

export const handleLogin = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const sessionPayload = await AuthService.loginUser(email, password);
    res.status(200).json({
      status: "success",
      message: "Authenticate validated successfully User session expiored",
      data: sessionPayload,
    });
  },
);
