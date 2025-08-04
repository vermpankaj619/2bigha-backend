import { seoService } from "../services/seo.service"


export const seoResolvers = {
    Query: {
        // Global SEO Settings
        getGlobalSeoSettings: async () => {
            return await seoService.getGlobalSeoSettings()
        },

        // SEO Pages
        getSeoPages: async (_: any, { status }: { status?: string }) => {
            return await seoService.getSeoPages(status)
        },

        getSeoPageByUrl: async (_: any, { url }: { url: string }) => {
            return await seoService.getSeoPageByUrl(url)
        },

        getSeoPageById: async (_: any, { id }: { id: string }) => {
            return await seoService.getSeoPageById(Number.parseInt(id))
        },

        getHomePageSeo: async () => {

            return seoService.getHomePageSeo()
        },

        // Schema Settings
        getSchemaSettings: async (_: any, { type }: { type?: string }) => {
            return await seoService.getSchemaSettings(type)
        },

        getActiveSchemaSettings: async () => {
            return await seoService.getActiveSchemaSettings()
        },

        getSchemaSettingById: async (_: any, { id }: { id: string }) => {
            return await seoService.getSchemaSettingById(Number.parseInt(id))
        },

        // SEO Images
        getSeoImages: async () => {
            return await seoService.getSeoImages()
        },

        getSeoImageById: async (_: any, { id }: { id: string }) => {
            return await seoService.getSeoImageById(Number.parseInt(id))
        },
    },

    Mutation: {
        // Global SEO Settings
        updateGlobalSeoSettings: async (_: any, { input }: any, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const settings = await seoService.updateGlobalSeoSettings(input)
                return {
                    success: true,
                    message: "Global SEO settings updated successfully",
                    settings,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to update global SEO settings",
                    settings: null,
                }
            }
        },

        // SEO Pages
        createSeoPage: async (_: any, { input }: any, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const seoPage = await seoService.createSeoPage(input)
                return {
                    success: true,
                    message: "SEO page created successfully",
                    seoPage,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to create SEO page",
                    seoPage: null,
                }
            }
        },

        updateSeoPage: async (_: any, { input }: any, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const { id, ...updateData } = input
                const seoPage = await seoService.updateSeoPage(Number.parseInt(id), updateData)
                return {
                    success: true,
                    message: "SEO page updated successfully",
                    seoPage,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to update SEO page",
                    seoPage: null,
                }
            }
        },

        deleteSeoPage: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const deleted = await seoService.deleteSeoPage(Number.parseInt(id))
                return {
                    success: deleted,
                    message: deleted ? "SEO page deleted successfully" : "SEO page not found",
                    seoPage: null,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to delete SEO page",
                    seoPage: null,
                }
            }
        },

        publishSeoPage: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const seoPage = await seoService.publishSeoPage(Number.parseInt(id))
                return {
                    success: true,
                    message: "SEO page published successfully",
                    seoPage,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to publish SEO page",
                    seoPage: null,
                }
            }
        },

        unpublishSeoPage: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const seoPage = await seoService.unpublishSeoPage(Number.parseInt(id))
                return {
                    success: true,
                    message: "SEO page unpublished successfully",
                    seoPage,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to unpublish SEO page",
                    seoPage: null,
                }
            }
        },

        enableSeoPage: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const seoPage = await seoService.enableSeoPage(Number.parseInt(id))
                return {
                    success: true,
                    message: "SEO page enabled successfully",
                    seoPage,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to enable SEO page",
                    seoPage: null,
                }
            }
        },

        disableSeoPage: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const seoPage = await seoService.disableSeoPage(Number.parseInt(id))
                return {
                    success: true,
                    message: "SEO page disabled successfully",
                    seoPage,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to disable SEO page",
                    seoPage: null,
                }
            }
        },

        setHomePageSeo: async (_: any, { input }: any, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const seoPage = await seoService.setHomePageSeo(input)
                return {
                    success: true,
                    message: "Home page SEO set successfully",
                    seoPage,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to set home page SEO",
                    seoPage: null,
                }
            }
        },

        updateHomePageSeo: async (_: any, { input }: any, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const seoPage = await seoService.updateHomePageSeo(input)
                return {
                    success: true,
                    message: "Home page SEO updated successfully",
                    seoPage,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to update home page SEO",
                    seoPage: null,
                }
            }
        },

        // Schema Settings
        createSchemaSettings: async (_: any, { input }: any, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const schema = await seoService.createSchemaSettings(input)
                return {
                    success: true,
                    message: "Schema settings created successfully",
                    schema,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to create schema settings",
                    schema: null,
                }
            }
        },

        updateSchemaSettings: async (_: any, { input }: any, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const { id, ...updateData } = input
                const schema = await seoService.updateSchemaSettings(Number.parseInt(id), updateData)
                return {
                    success: true,
                    message: "Schema settings updated successfully",
                    schema,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to update schema settings",
                    schema: null,
                }
            }
        },

        deleteSchemaSettings: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const deleted = await seoService.deleteSchemaSettings(Number.parseInt(id))
                return {
                    success: deleted,
                    message: deleted ? "Schema settings deleted successfully" : "Schema settings not found",
                    schema: null,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to delete schema settings",
                    schema: null,
                }
            }
        },

        toggleSchemaSettings: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const schema = await seoService.toggleSchemaSettings(Number.parseInt(id))
                return {
                    success: true,
                    message: `Schema settings ${schema.isActive ? "enabled" : "disabled"} successfully`,
                    schema,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to toggle schema settings",
                    schema: null,
                }
            }
        },

        enableSchemaSettings: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const schema = await seoService.enableSchemaSettings(Number.parseInt(id))
                return {
                    success: true,
                    message: "Schema settings enabled successfully",
                    schema,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to enable schema settings",
                    schema: null,
                }
            }
        },

        disableSchemaSettings: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const schema = await seoService.disableSchemaSettings(Number.parseInt(id))
                return {
                    success: true,
                    message: "Schema settings disabled successfully",
                    schema,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to disable schema settings",
                    schema: null,
                }
            }
        },

        // SEO Images
        uploadSeoImage: async (_: any, { input }: any, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const image = await seoService.uploadSeoImage(input)
                return {
                    success: true,
                    message: "SEO image uploaded successfully",
                    image,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to upload SEO image",
                    image: null,
                }
            }
        },

        updateSeoImageAlt: async (_: any, { id, altText }: { id: string; altText: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const image = await seoService.updateSeoImageAlt(Number.parseInt(id), altText)
                return {
                    success: true,
                    message: "SEO image alt text updated successfully",
                    image,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to update SEO image alt text",
                    image: null,
                }
            }
        },

        deleteSeoImage: async (_: any, { id }: { id: string }, context: any) => {
            //   await requireAdminAuth(context)

            try {
                const deleted = await seoService.deleteSeoImage(Number.parseInt(id))
                return {
                    success: deleted,
                    message: deleted ? "SEO image deleted successfully" : "SEO image not found",
                    image: null,
                }
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to delete SEO image",
                    image: null,
                }
            }
        },
    },
}
