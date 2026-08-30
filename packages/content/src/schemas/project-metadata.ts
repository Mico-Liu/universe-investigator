import { z } from 'zod'

export const ProjectMetadataSchema = z
  .object({
    id: z.string().min(1),
    version: z.string().min(1),
  })
  .strict()

export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>
