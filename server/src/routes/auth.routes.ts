import { Router } from 'express';
import { handleRegistration, handleLogin } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const authRouter = Router();

// Make sure these paths are relative: just '/register', NOT '/api/v1/auth/register'
authRouter.post('/register', validateRequest(registerSchema), handleRegistration);
authRouter.post('/login', validateRequest(loginSchema), handleLogin);

export default authRouter;