import { eq } from "drizzle-orm";
import { db } from "../../database/connection";
import { blogPosts, blogStatusEnum, blogPostCategories } from "../../database/schema/blog";
import { AzureStorageService } from "../../utils/azure-storage";

export class BlogService {
  static async createBlog(input: any, authorId:string) {
    const azureStorage = new AzureStorageService()
    const uploadedFile = await azureStorage.uploadFile(input.featuredImage.file, "blogs")
    const newBlog = await db
      .insert(blogPosts)
      .values({
        authorId,
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        featuredImage: uploadedFile[2].url,
        status: input.status || "DRAFT",
        tags: input.tags || [],
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      })
      .returning();

    const created = newBlog[0];

    // If categories provided, attach them via junction table
    if (created && Array.isArray(input.categoryIds) && input.categoryIds.length > 0) {
      const categoryIds: string[] = Array.from(new Set<string>(input.categoryIds as string[])).filter(Boolean);
      if (categoryIds.length > 0) {
        await db.insert(blogPostCategories).values(
          categoryIds.map((categoryId) => ({ postId: created.id, categoryId }))
        );
      }
    }

    return created;
  }

  static async updateBlog(id: string, input: any, authorId:string) {
    let imageUrl = input.image
    if(input.featuredImage){
      const azureStorage = new AzureStorageService()
      const uploadedImage = await azureStorage.uploadFile(input.featuredImage.file, "blogs")
      imageUrl = uploadedImage[2].url
    }
      
    const updatedBlog = await db
      .update(blogPosts)
      .set({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        featuredImage: imageUrl,
        status: input.status,
        tags: input.tags,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();
    const updated = updatedBlog[0];

    // If categories provided, reset and add new junctions
    if (updated && Array.isArray(input.categoryIds)) {
      // Delete existing mappings
      await db.delete(blogPostCategories).where(eq(blogPostCategories.postId, id));
      const categoryIds: string[] = Array.from(new Set<string>(input.categoryIds as string[])).filter(Boolean);
      if (categoryIds.length > 0) {
        await db.insert(blogPostCategories).values(
          categoryIds.map((categoryId) => ({ postId: id, categoryId }))
        );
      }
    }

    return updated;
  }

  static async deleteBlog(id: string) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }

  static async getBlogById(id: string) {
    const blog = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return blog[0];
  }

  static async getAllBlogs() {
    const blogs = await db.select().from(blogPosts);
    return blogs;
  }
}
