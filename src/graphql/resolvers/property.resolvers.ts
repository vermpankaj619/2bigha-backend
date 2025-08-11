import { GraphQLError } from "graphql";
import { PropertyService } from "../services/property.services";
import { AdminContext } from "./auth.resolvers";

export interface Context {
    user?: {
        userId: number;
        email: string;
        role: string;
    };
    req: any;
}

export const propertyResolvers = {
    Query: {
        properties: async (
            _: any,
            { input }: { input: { page: number; limit: number, searchTerm?: string } }
        ) => {
            const results = await PropertyService.getProperties(
                input.page,
                input.limit,
                input.searchTerm
            );

            return results;
        },
        getPendingApprovalProperties: async (
            _: any,
            { input }: { input: { page: number; limit: number; searchTerm?: string } }
        ) => {
            const results = await PropertyService.getPendingApprovalProperties(
                input.page,
                input.limit,
                input.searchTerm // pass searchTerm here
            );

            console.log(results);

            return results;
        },

        getRejectedProperties: async (
            _: any,
            { input }: { input: { page: number; limit: number; searchTerm?: string } }
        ) => {
            const results = await PropertyService.getRejectedProperties(
                input.page,
                input.limit,
                input.searchTerm
            );

            console.log(results);

            return results;
        },

        getApprovedProperties: async (
            _: any,
            { input }: { input: { page: number; limit: number; searchTerm?: string } }
        ) => {
            const results = await PropertyService.getApprovedProperties(
                input.page,
                input.limit,
                input.searchTerm
            );

            console.log(results);

            return results;
        },

        getPropertiesPostedByAdmin: async (
            _: any,
            { input }: { input: { page: number; limit: number, searchTerm?: string } }, context: AdminContext
        ) => {

            if (!context.admin) {
                throw new GraphQLError("Not authenticated", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }
            const results = await PropertyService.getPropertiesPostedByAdmin(
                context?.admin?.adminId,
                input.page,
                input.limit,
                input?.searchTerm

            );

            return results;
        },



    },

    Mutation: {
        createProperty: async (
            _: any,
            { input }: { input: any },
            context: AdminContext
        ) => {
            if (!context.admin) {
                throw new GraphQLError("Not authenticated", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }

            try {
                const property = await PropertyService.createProperty(
                    input,
                    context.admin.adminId,
                    "published"
                );

                console.log(property);

                return property;
            } catch (error) {
                console.error("Create property error:", error);
                throw new GraphQLError("Failed to create property", {
                    extensions: { code: "INTERNAL_ERROR" },
                });
            }
        },
        updatePropertySeo: async (
            _: any,
            { input }: { input: any },
            context: AdminContext
        ) => {
            if (!context.admin) {
                throw new GraphQLError("Not authenticated", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }

            try {
                const updatedSeo = await PropertyService.updateSeoProperty(input);
                return updatedSeo;
            } catch (error: any) {
                console.error("❌ Failed to update SEO:", error);
                throw new GraphQLError(error.message || "SEO update failed", {
                    extensions: { code: "INTERNAL_SERVER_ERROR" },
                });
            }
        },
    },
};
