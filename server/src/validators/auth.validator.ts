import { z } from 'zod';
import { UserRole } from '../constants/enums';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ error: 'Full name is mandatory.' })
      .trim()
      .min(2, 'Name must be at least 2 characters long.')
      .max(50, 'Name cannot exceed 50 characters.'),
    email: z
      .string({ error: 'Email address is mandatory.' })
      .trim()
      .email('Please provide a valid email structure.'),
    password: z
      .string({ error: 'Password is mandatory.' })
      .min(6, 'Password must be a minimum of 6 characters long.')
      .max(30, 'Password cannot exceed 30 characters.'),
    role: z
      .nativeEnum(UserRole)
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ error: 'Email coordinate is required.' })
      .trim()
      .email('Please enter a valid structural email.'),
    password: z
      .string({ error: 'Verification password is required.' })
      .min(1, 'Password field cannot be sent blank.'),
  }),
});