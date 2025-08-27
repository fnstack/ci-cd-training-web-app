import { User, UserSchema, CreateUserRequest, CreateUserRequestSchema } from "@/types/user"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export const usersApi = {
  async getAll(): Promise<User[]> {
    const data = await fetchApi("/api/Users")
    return UserSchema.array().parse(data)
  },

  async getById(id: number): Promise<User> {
    const data = await fetchApi(`/api/Users/${id}`)
    return UserSchema.parse(data)
  },

  async create(user: CreateUserRequest): Promise<User> {
    const validatedUser = CreateUserRequestSchema.parse(user)
    const data = await fetchApi("/api/Users", {
      method: "POST",
      body: JSON.stringify(validatedUser),
    })
    return UserSchema.parse(data)
  },

  async update(id: number, user: CreateUserRequest): Promise<User> {
    const validatedUser = CreateUserRequestSchema.parse(user)
    const data = await fetchApi(`/api/Users/${id}`, {
      method: "PUT",
      body: JSON.stringify(validatedUser),
    })
    return UserSchema.parse(data)
  },

  async delete(id: number): Promise<void> {
    await fetchApi(`/api/Users/${id}`, {
      method: "DELETE",
    })
  },
}