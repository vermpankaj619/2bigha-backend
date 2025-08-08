export const blogTypeDefs = `#graphql
  # Blog Types
  scalar Date

  enum BlogStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  type Blog {
    id: ID!
    uuid: String!
    authorId: ID!
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
  }

  # Blog Input Types
  input CreateBlogInput {
    title: String!
    slug: String!
    excerpt: String
    content: String!
    featuredImage: String
    status: BlogStatus
    tags: [String!]
    seoTitle: String
    seoDescription: String
    publishedAt: Date
    categoryIds: [ID!]
  }

  input UpdateBlogInput {
    title: String
    slug: String
    excerpt: String
    content: String
    featuredImage: String
    status: BlogStatus
    tags: [String!]
    seoTitle: String
    seoDescription: String
    publishedAt: Date
  }

  extend type Query {
    getBlog(id: ID!): Blog
    getAllBlogs: [Blog!]!
  }

  extend type Mutation {
    createBlog(input: CreateBlogInput!): Blog!
    updateBlog(id: ID!, input: UpdateBlogInput!): Blog!
    deleteBlog(id: ID!): Boolean!
  }
` 