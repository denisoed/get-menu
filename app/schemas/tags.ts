import { z } from 'zod'

export const TagRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  created_at: z.string(),
  updated_at: z.string()
})

export const TagRowListSchema = z.array(TagRowSchema)

const TagNameSchema = z
  .string()
  .trim()
  .min(1, 'Название тега обязательно')
  .max(24, 'Название тега должно быть короче 24 символов')
  .regex(/^[\p{L}0-9 ]+$/u, 'Допустимы только буквы, цифры и пробелы')

export const CreateTagInputSchema = z.object({
  name: TagNameSchema
})

export const UpdateTagInputSchema = z.object({
  name: TagNameSchema,
  updatedAt: z.string().min(1, 'Отсутствует версия записи')
})

export const TagModelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const TagModelListSchema = z.array(TagModelSchema)

export type TagRow = z.infer<typeof TagRowSchema>
export type TagModel = z.infer<typeof TagModelSchema>
export type CreateTagInput = z.infer<typeof CreateTagInputSchema>
export type UpdateTagInput = z.infer<typeof UpdateTagInputSchema>
