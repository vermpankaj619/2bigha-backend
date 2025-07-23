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
            { input }: { input: { page: number; limit: number } }
        ) => {
            const results = await PropertyService.getProperties(
                input.page,
                input.limit
            );

            return results;
        },

        getPendingApprovalProperties: async (
            _: any,
            { input }: { input: { page: number; limit: number } }
        ) => {
            const results = await PropertyService.getPendingApprovalProperties(
                input.page,
                input.limit
            );

            console.log(results)

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
    },
};
