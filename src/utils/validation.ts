import { z } from 'zod';
import { ACADEMIC_YEARS, INTERESTS } from '../constants';
import type { AcademicYear, Interest } from '../types';

const academicYearEnum = ACADEMIC_YEARS as [AcademicYear, ...AcademicYear[]];
const interestEnum = INTERESTS as [Interest, ...Interest[]];

export const joinSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s\-().]{7,20}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  major: z
    .string()
    .trim()
    .min(2, 'Please enter your field of study')
    .max(100, 'Field of study is too long'),
  academic_year: z.enum(academicYearEnum, {
    errorMap: () => ({ message: 'Please select your academic year' }),
  }),
  interests: z
    .array(z.enum(interestEnum))
    .min(1, 'Please select at least one interest'),
  message: z
    .string()
    .trim()
    .min(20, 'Message must be at least 20 characters')
    .max(600, 'Message must not exceed 600 characters'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

export const eventSchema = z.object({
  title:             z.string().trim().min(2, 'Title is required').max(200),
  short_description: z.string().trim().max(300, 'Short description is too long').optional().default(''),
  description:       z.string().trim().max(5000, 'Description is too long').optional().default(''),
  event_date:        z.string().min(1, 'Date is required'),
  start_time:        z.string().optional().default(''),
  end_time:          z.string().optional().default(''),
  location:          z.string().trim().max(200).optional().default(''),
  status:            z.enum(['upcoming', 'archived']).default('upcoming'),
  cover_image_url:   z.string().url('Invalid image URL').optional().or(z.literal('')),
  gallery_urls:      z.array(z.string().url()).optional().default([]),
});

export type JoinSchema = z.infer<typeof joinSchema>;
export type EventSchema = z.infer<typeof eventSchema>;
