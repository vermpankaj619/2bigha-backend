import { GraphQLError } from "graphql"
import { RBACService } from "../services/rbac.service"


interface AdminContext {
  admin?: {
    adminId: string
    email: string
    roles: string[]
  }
}

export const rbacResolvers = {
  Query: {
    // ==================== PERMISSIONS ====================
    getAllPermissions: async (_: any, __: any, context: AdminContext) => {
      // if (!context.admin) {
      //   throw new GraphQLError("Authentication required", {
      //     extensions: { code: "UNAUTHENTICATED" },
      //   })
      // }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "system:view")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      return await RBACService.getAllPermissions()
    },

    getPermissionsByResource: async (_: any, __: any, context: AdminContext) => {
      // if (!context.admin) {
      //   throw new GraphQLError("Authentication required", {
      //     extensions: { code: "UNAUTHENTICATED" },
      //   })
      // }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "system:view")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      return await RBACService.getPermissionsByResource()
    },

    getPermission: async (_: any, { id }: { id: string }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "system:view")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      return await RBACService.getPermission(id)
    },

    // ==================== ROLES ====================
    getAllRoles: async (_: any, { filter, sort, limit, offset }: any, context: AdminContext) => {
      // if (!context.admin) {
      //   throw new GraphQLError("Authentication required", {
      //     extensions: { code: "UNAUTHENTICATED" },
      //   })
      // }

      // // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "roles:view")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      return await RBACService.getAllRoles(filter, sort, limit, offset)
    },

    getRole: async (_: any, { id }: { id: string }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "roles:view")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      return await RBACService.getRole(id)
    },

    getRoleBySlug: async (_: any, { slug }: { slug: string }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "roles:view")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      return await RBACService.getRoleBySlug(slug)
    },

    // ==================== ADMINS ====================
    getAllAdmins: async (_: any, { filter, sort, limit, offset }: any, context: AdminContext) => {
      // if (!context.admin) {
      //   throw new GraphQLError("Authentication required", {
      //     extensions: { code: "UNAUTHENTICATED" },
      //   })
      // }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:view")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      return await RBACService.getAllAdmins(filter, sort, limit, offset)
    },

    getAdminWithRBAC: async (_: any, { id }: { id: string }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:view")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      return await RBACService.getAdminWithRBAC(id)
    },

    getAdminPermissions: async (_: any, { adminId }: { adminId: string }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // Allow admins to view their own permissions or require admin permission
      // if (context.admin.adminId !== adminId) {
      //   const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:view")
      //   if (!hasPermission) {
      //     throw new GraphQLError("Insufficient permissions", {
      //       extensions: { code: "FORBIDDEN" },
      //     })
      //   }
      // }

      return await RBACService.getAdminPermissions(adminId)
    },

    // ==================== STATS ====================
    getRBACStats: async (_: any, __: any, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "system:view")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      return await RBACService.getRBACStats()
    },
  },

  Mutation: {
    // ==================== ROLE MANAGEMENT ====================
    createRole: async (_: any, { input }: { input: any }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "roles:create")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      try {
        return await RBACService.createRole(input, context.admin.adminId)
      } catch (error) {
        console.log(error)
        throw new GraphQLError(`Failed to create role: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },

    updateRole: async (_: any, { id, input }: { id: string; input: any }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "roles:edit")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      try {
        return await RBACService.updateRole(id, input, context.admin.adminId)
      } catch (error) {
        throw new GraphQLError(`Failed to update role: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },

    deleteRole: async (_: any, { id }: { id: string }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "roles:delete")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      try {
        return await RBACService.deleteRole(id, context.admin.adminId)
      } catch (error) {
        throw new GraphQLError(`Failed to delete role: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },

    // ==================== ADMIN MANAGEMENT ====================
    createAdmin: async (_: any, { input }: { input: any }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:create")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      try {
        return await RBACService.createAdmin(input, context.admin.adminId)
      } catch (error) {
        throw new GraphQLError(`Failed to create admin: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },

    updateAdmin: async (_: any, { id, input }: { id: string; input: any }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:edit")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      try {
        return await RBACService.updateAdmin(id, input, context.admin.adminId)
      } catch (error) {
        throw new GraphQLError(`Failed to update admin: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },

    disableAdmin: async (_: any, { id }: { id: string }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:disable")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      // Prevent self-disable
      if (context.admin.adminId === id) {
        throw new GraphQLError("Cannot disable your own account", {
          extensions: { code: "FORBIDDEN" },
        })
      }

      try {
        return await RBACService.disableAdmin(id, context.admin.adminId)
      } catch (error) {
        throw new GraphQLError(`Failed to disable admin: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },

    enableAdmin: async (_: any, { id }: { id: string }, context: AdminContext) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:enable")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      try {
        return await RBACService.enableAdmin(id, context.admin.adminId)
      } catch (error) {
        throw new GraphQLError(`Failed to enable admin: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },

    // ==================== ROLE ASSIGNMENTS ====================
    assignRolesToAdmin: async (
      _: any,
      { input }: { input: { adminId: string; roleIds: string[] } },
      context: AdminContext,
    ) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:assign_roles")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      try {
        return await RBACService.assignRolesToAdmin(input.adminId, input.roleIds, context.admin.adminId)
      } catch (error) {
        throw new GraphQLError(`Failed to assign roles: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },

    revokeRolesFromAdmin: async (
      _: any,
      { input }: { input: { adminId: string; roleIds: string[] } },
      context: AdminContext,
    ) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:revoke_roles")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      try {
        return await RBACService.revokeRolesFromAdmin(input.adminId, input.roleIds, context.admin.adminId)
      } catch (error) {
        throw new GraphQLError(`Failed to revoke roles: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },

    replaceAdminRoles: async (
      _: any,
      { adminId, roleIds }: { adminId: string; roleIds: string[] },
      context: AdminContext,
    ) => {
      if (!context.admin) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // const hasPermission = await PermissionChecker.hasPermission(context.admin.adminId, "admins:assign_roles")
      // if (!hasPermission) {
      //   throw new GraphQLError("Insufficient permissions", {
      //     extensions: { code: "FORBIDDEN" },
      //   })
      // }

      try {
        return await RBACService.replaceAdminRoles(adminId, roleIds, context.admin.adminId)
      } catch (error) {
        throw new GraphQLError(`Failed to replace roles: ${error}`, {
          extensions: { code: "INTERNAL_ERROR" },
        })
      }
    },
  },
}
