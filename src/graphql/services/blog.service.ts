import { eq } from "drizzle-orm"
import { db } from "../../database/connection"
import { blogPosts, blogStatusEnum } from "../../database/schema/blog"

export class BlogService {
  static async createBlog(input: any) {
    const newBlog = await db
      .insert(blogPosts)
      .values({
        authorId: input.authorId,
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        featuredImage: input.featuredImage,
        status: input.status || "DRAFT",
        tags: input.tags || [],
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      })
      .returning()
    return newBlog[0]
  }

  static async updateBlog(id: string, input: any) {
    const updatedBlog = await db
      .update(blogPosts)
      .set({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        featuredImage: input.featuredImage,
        status: input.status,
        tags: input.tags,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning()
    return updatedBlog[0]
  }

  static async deleteBlog(id: string) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id))
    return true
  }

  static async getBlogById(id: string) {
    const blog = await db.select().from(blogPosts).where(eq(blogPosts.id, id))
    return blog[0]
  }

  static async getAllBlogs() {
    const blogs = await db.select().from(blogPosts)
    return blogs
  }
} 