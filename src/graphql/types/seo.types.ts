

export const seoTypeDefs = `#graphql
  type GlobalSeoSettings {
    id: ID!
    siteTitle: String!
    metaDescription: String
    keywords: String
    ogTitle: String
    ogDescription: String
    ogImage: String
    createdAt: String!
    updatedAt: String!
  }

  type SeoPage {
    id: ID!
    page: String!
    url: String!
    title: String!
    description: String
    keywords: String
    image: String
    status: String!
    schemaType: String
    schemaDescription: String
    createdAt: String!
    updatedAt: String!
  }

  type SchemaSettings {
    id: ID!
    type: String!
    data: JSON!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type SeoImage {
    id: ID!
    filename: String!
    originalName: String!
    mimeType: String!
    size: String!
    url: String!
    altText: String
    createdAt: String!
  }

  input GlobalSeoSettingsInput {
    siteTitle: String!
    metaDescription: String
    keywords: String
    ogTitle: String
    ogDescription: String
    ogImage: String
  }

  input SeoPageInput {
    page: String!
    url: String!
    title: String!
    description: String
    keywords: String
    image: String
    status: String
    schemaType: String
    schemaDescription: String
  }

  input UpdateSeoPageInput {
    id: ID!
    page: String
    url: String
    title: String
    description: String
    keywords: String
    image: String
    status: String
    schemaType: String
    schemaDescription: String
  }

  input SchemaSettingsInput {
    type: String!
    data: JSON!
    isActive: Boolean
  }

  input UpdateSchemaSettingsInput {
    id: ID!
    type: String
    data: JSON
    isActive: Boolean
  }

  input SeoImageInput {
    filename: String!
    originalName: String!
    mimeType: String!
    size: String!
    url: String!
    altText: String
  }

  type SeoPageResponse {
    success: Boolean!
    message: String!
    seoPage: SeoPage
  }

  type GlobalSeoResponse {
    success: Boolean!
    message: String!
    settings: GlobalSeoSettings
  }

  type SchemaSettingsResponse {
    success: Boolean!
    message: String!
    schema: SchemaSettings
  }

  type SeoImageResponse {
    success: Boolean!
    message: String!
    image: SeoImage
  }

  extend type Query {
    # Global SEO Settings
    getGlobalSeoSettings: GlobalSeoSettings
    
    # SEO Pages
    getSeoPages(status: String): [SeoPage!]!
    getSeoPageByUrl(url: String!): SeoPage
    getSeoPageById(id: ID!): SeoPage
    getHomePageSeo: SeoPage
    
    # Schema Settings
    getSchemaSettings(type: String): [SchemaSettings!]!
    getActiveSchemaSettings: [SchemaSettings!]!
    getSchemaSettingById(id: ID!): SchemaSettings
    
    # SEO Images
    getSeoImages: [SeoImage!]!
    getSeoImageById(id: ID!): SeoImage
  }

  extend type Mutation {
    # Global SEO Settings
    updateGlobalSeoSettings(input: GlobalSeoSettingsInput!): GlobalSeoResponse!
    
    # SEO Pages
    createSeoPage(input: SeoPageInput!): SeoPageResponse!
    updateSeoPage(input: UpdateSeoPageInput!): SeoPageResponse!
    deleteSeoPage(id: ID!): SeoPageResponse!
    publishSeoPage(id: ID!): SeoPageResponse!
    unpublishSeoPage(id: ID!): SeoPageResponse!
    enableSeoPage(id: ID!): SeoPageResponse!
    disableSeoPage(id: ID!): SeoPageResponse!
    setHomePageSeo(input: SeoPageInput!): SeoPageResponse!
    updateHomePageSeo(input: UpdateSeoPageInput!): SeoPageResponse!
    
    # Schema Settings
    createSchemaSettings(input: SchemaSettingsInput!): SchemaSettingsResponse!
    updateSchemaSettings(input: UpdateSchemaSettingsInput!): SchemaSettingsResponse!
    deleteSchemaSettings(id: ID!): SchemaSettingsResponse!
    toggleSchemaSettings(id: ID!): SchemaSettingsResponse!
    enableSchemaSettings(id: ID!): SchemaSettingsResponse!
    disableSchemaSettings(id: ID!): SchemaSettingsResponse!
    
    # SEO Images
    uploadSeoImage(input: SeoImageInput!): SeoImageResponse!
    updateSeoImageAlt(id: ID!, altText: String!): SeoImageResponse!
    deleteSeoImage(id: ID!): SeoImageResponse!
  }
`
