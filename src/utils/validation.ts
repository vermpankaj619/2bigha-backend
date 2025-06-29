import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address")
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters")
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, "Invalid phone number")
export const urlSchema = z.string().url("Invalid URL")

// Property validation schemas
export const propertyTypeSchema = z.enum([
  "agricultural",
  "commercial",
  "residential",
  "industrial",
  "villa",
  "apartment",
  "plot",
  "farmhouse",
  "warehouse",
  "office",
  "other",
])

export const listingTypeSchema = z.enum(["sale", "rent", "lease"])

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

// User validation schemas
export const createUserSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: passwordSchema,
  role: z.enum(["owner", "agent", "user"]).optional(),
})

export const updateUserSchema = createUserSchema.partial()

// Property validation schemas
export const createPropertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  propertyType: propertyTypeSchema,
  listingType: listingTypeSchema,
  price: z.number().positive("Price must be positive"),
  area: z.number().positive("Area must be positive"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  coordinates: coordinatesSchema.optional(),
})

export const updatePropertySchema = createPropertySchema.partial()

// Blog validation schemas
export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const updateBlogPostSchema = createBlogPostSchema.partial()

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error
  }
}

export function validatePartialInput<T>(schema: z.ZodSchema<T>, data: unknown): Partial<T> {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error
  }
}
