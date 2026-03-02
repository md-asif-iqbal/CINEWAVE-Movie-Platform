import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Please enter password'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  name: z.string().min(1, 'Please enter a name').max(30, 'Name cannot exceed 30 characters'),
  isKidsProfile: z.boolean().optional().default(false),
  language: z.string().optional().default('en'),
});

export const contentSchema = z.object({
  title: z.string().min(1, 'Please enter a title'),
  type: z.enum(['movie', 'series', 'documentary', 'short']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  genre: z.array(z.string()).min(1, 'Select at least one genre'),
  language: z.array(z.string()).min(1, 'Select a language'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  duration: z.number().min(1).optional(),
  maturityRating: z.string().optional(),
  director: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Please give a rating').max(10),
  comment: z.string().max(1000, 'Comment cannot exceed 1000 characters').optional(),
  spoiler: z.boolean().optional().default(false),
});

export const episodeSchema = z.object({
  season: z.number().min(1),
  episode: z.number().min(1),
  title: z.string().min(1, 'Please enter a title'),
  description: z.string().optional(),
  duration: z.number().min(1).optional(),
});
