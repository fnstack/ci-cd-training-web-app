import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
})

export const CreateUserRequestSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  email: z.string().email("Must be a valid email address"),
})

export type User = z.infer<typeof UserSchema>
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>