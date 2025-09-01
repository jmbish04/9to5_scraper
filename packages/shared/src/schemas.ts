import { z } from 'zod';

export const JobSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  siteId: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  department: z.string().optional(),
  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),
  salaryCurrency: z.string().optional(),
  salaryRaw: z.string().optional(),
  compensationRaw: z.any().optional(),
  descriptionMd: z.string().optional(),
  requirementsMd: z.string().optional(),
  postedAt: z.string().optional(),
});

export type Job = z.infer<typeof JobSchema>;
