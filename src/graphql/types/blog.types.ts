export const blogTypeDefs = `#graphql
  # Blog Types
  scalar Date
  scalar Upload

  enum BlogStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  type Blog {
    id: ID!
    uuid: String!
    authorId: ID!
    authorName: String
    title: String!
    slug: String!
    excerpt: String
    content: String!
    featuredImage: String
    status: BlogStatus!
    tags: [String!]
    seoTitle: String
    seoDescription: String
    publishedAt: Date
    createdAt: Date!
    updatedAt: Date!
    category : String
  }

  # Blog Input Types
  input CreateBlogInput {
    title: String!
    slug: String!
    excerpt: String
    content: String!
    featuredImage: Upload
    status: BlogStatus
    tags: [String!]
    seoTitle: String
    seoDescription: String
    publishedAt: Date
    categoryIds: [ID!]
    category : String
  }

  input UpdateBlogInput {
    title: String
    slug: String
    excerpt: String
    content: String
    featuredImage: Upload
    image : String
    status: BlogStatus
    tags: [String!]
    seoTitle: String
    seoDescription: String
    publishedAt: Date
  }

  extend type Query {
    getBlog(id: ID!): Blog
    getBlogBySlug(slug: String!): Blog
    getAllBlogs(status: String): [Blog!]!
  }

  extend type Mutation {
    createBlog(input: CreateBlogInput!): Blog!
    updateBlog(id: ID!, input: UpdateBlogInput!): Blog!
    deleteBlog(id: ID!): Boolean!
  }
` 