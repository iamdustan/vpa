import { z } from 'zod';

// 1. Medtronic (Workday) Schema
export const MedtronicResponseSchema = z.object({
  jobPostings: z.array(z.object({
    bulletinNumber: z.string().optional(),
    externalPath: z.string(),
    title: z.string(),
    locationsText: z.string(),
    postedOn: z.string().optional(),
  })).optional(),
});

// 2. Abbott (Phenom/Widget) Schema
export const AbbottResponseSchema = z.object({
  globalSearchEventV3: z.object({
    jobTitles: z.object({
      data: z.object({
        titles: z.array(z.object({
          jobId: z.string().optional(),
          title: z.string(),
          location: z.string().optional(),
          postedDate: z.string().optional(),
        })).optional(),
      }).optional(),
    }).optional(),
    data: z.object({
      jobs: z.array(z.object({
        jobId: z.string().optional(),
        title: z.string(),
        location: z.string().optional(),
        postedDate: z.string().optional(),
      })).optional(),
    }).optional(),
  }).optional(),
});

// 3. Boston Scientific (Eightfold) Schema
export const BostonResponseSchema = z.object({
  data: z.object({
    positions: z.array(z.object({
      id: z.union([z.string(), z.number()]),
      name: z.string(),
      locations: z.array(z.string()).optional(),
      positionUrl: z.string().optional(),
      postedTs: z.number().optional(),
    })).optional(),
  }),
});

export type MedtronicRawResponse = z.infer<typeof MedtronicResponseSchema>;
export type AbbottRawResponse = z.infer<typeof AbbottResponseSchema>;
export type BostonRawResponse = z.infer<typeof BostonResponseSchema>;
