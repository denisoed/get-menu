import { z } from 'zod'

export const CategoryRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  position: z.number().int().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string()
})

export const CategoryRowListSchema = z.array(CategoryRowSchema)

export const CreateCategoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required').max(120, 'Category name is too long'),
  description: z.string().trim().max(512).optional(),
  position: z.number().int().min(0).optional()
})

export const UpdateCategoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required').max(120, 'Category name is too long'),
  updatedAt: z.string().min(1, 'Unknown record version'),
  description: z.string().trim().max(512).optional(),
  position: z.number().int().min(0).optional()
})

export const CategoryModelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  position: z.number().int().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const CategoryModelListSchema = z.array(CategoryModelSchema)

export type CategoryRow = z.infer<typeof CategoryRowSchema>
export type CategoryModel = z.infer<typeof CategoryModelSchema>
export type CreateCategoryInput = z.infer<typeof CreateCategoryInputSchema>
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryInputSchema>
