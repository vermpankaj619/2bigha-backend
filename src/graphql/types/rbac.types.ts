

export const rbacTypeDefs = `#graphql
  # Permission Types
  enum SortDirection {
    ASC
    DESC
  }
  type Permission {
    id: ID!
    name: String!
    resource: String!
    action: String!
    description: String
    createdAt: Date!
  }

  type PermissionGroup {
    resource: String!
    permissions: [Permission!]!
  }

  # Role Types
  type Role {
    id: ID!
    name: String!
    slug: String!
    description: String
    color: String
    isSystemRole: Boolean!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
    permissions: [Permission!]!
    userCount: Int!
  }

  # Admin User with RBAC
  type AdminUserWithRBAC {
    id: ID!
   
    email: String!
    firstName: String
    lastName: String
    department: String
    employeeId: String
    phone: String
    avatar: String
    bio: String
    isActive: Boolean!
    isVerified: Boolean!
    lastLoginAt: Date
    createdAt: Date!
    updatedAt: Date!
    roles: [Role!]!
    permissions: [Permission!]!
    directPermissions: [Permission!]!
  }

  # Input Types
  input CreateRoleInput {
    name: String!
    slug: String!
    description: String
    color: String
    permissionIds: [ID!]!
  }

  input UpdateRoleInput {
    name: String
    description: String
    color: String
    permissionIds: [ID!]
    isActive: Boolean
  }

  input CreateAdminInput {
    email: String!
    firstName: String!
    lastName: String!
    password: String!
    department: String
    employeeId: String
    phone: String
    roleIds: [ID!]!
  }

  input UpdateAdminInput {
    firstName: String
    lastName: String
    department: String
    employeeId: String
    phone: String
    avatar: String
    bio: String
    isActive: Boolean
    roleIds: [ID!]
  }

  input AssignRoleInput {
    adminId: ID!
    roleIds: [ID!]!
  }

  input RevokeRoleInput {
    adminId: ID!
    roleIds: [ID!]!
  }

  # Filter and Sort Types
  input AdminFilterInput {
    isActive: Boolean
    department: String
    roleSlug: String
    search: String
  }

  input RoleFilterInput {
    isActive: Boolean
    isSystemRole: Boolean
    search: String
  }

  enum AdminSortField {
    CREATED_AT
    LAST_LOGIN
    EMAIL
    FIRST_NAME
    LAST_NAME
  }

  enum RoleSortField {
    CREATED_AT
    NAME
    USER_COUNT
  }

  input SortInput {
    field: String!
    direction: SortDirection!
  }

  # Response Types
  type AdminListResponse {
    admins: [AdminUserWithRBAC!]!
    total: Int!
    hasMore: Boolean!
  }

  type RoleListResponse {
    roles: [Role!]!
    total: Int!
    hasMore: Boolean!
  }

  type RBACStatsResponse {
    totalAdmins: Int!
    activeAdmins: Int!
    totalRoles: Int!
    totalPermissions: Int!
    adminsByRole: [RoleStats!]!
  }

  type RoleStats {
    roleId: ID!
    roleName: String!
    userCount: Int!
  }

  # RBAC Queries
  extend type Query {
    # Permissions
    getAllPermissions: [Permission!]!
    getPermissionsByResource: [PermissionGroup!]!
    getPermission(id: ID!): Permission

    # Roles
    getAllRoles(
      filter: RoleFilterInput
      sort: SortInput
      limit: Int = 20
      offset: Int = 0
    ): RoleListResponse!
    getRole(id: ID!): Role
    getRoleBySlug(slug: String!): Role

    # Admins
    getAllAdmins(
      filter: AdminFilterInput
      sort: SortInput
      limit: Int = 20
      offset: Int = 0
    ): AdminListResponse!
    getAdminWithRBAC(id: ID!): AdminUserWithRBAC
    getAdminPermissions(adminId: ID!): [Permission!]!

    # Stats
    getRBACStats: RBACStatsResponse!
  }

  # RBAC Mutations
  extend type Mutation {
    # Role Management
    createRole(input: CreateRoleInput!): Role!
    updateRole(id: ID!, input: UpdateRoleInput!): Role!
    deleteRole(id: ID!): Boolean!
    duplicateRole(id: ID!, newName: String!): Role!

    # Admin Management
    createAdmin(input: CreateAdminInput!): AdminUserWithRBAC!
    updateAdmin(id: ID!, input: UpdateAdminInput!): AdminUserWithRBAC!
    disableAdmin(id: ID!): AdminUserWithRBAC!
    enableAdmin(id: ID!): AdminUserWithRBAC!
    deleteAdmin(id: ID!): Boolean!

    # Role Assignment
    assignRolesToAdmin(input: AssignRoleInput!): AdminUserWithRBAC!
    revokeRolesFromAdmin(input: RevokeRoleInput!): AdminUserWithRBAC!
    replaceAdminRoles(adminId: ID!, roleIds: [ID!]!): AdminUserWithRBAC!

    # Bulk Operations
    bulkAssignRole(roleId: ID!, adminIds: [ID!]!): [AdminUserWithRBAC!]!
    bulkRevokeRole(roleId: ID!, adminIds: [ID!]!): [AdminUserWithRBAC!]!
    bulkDisableAdmins(adminIds: [ID!]!): [AdminUserWithRBAC!]!
    bulkEnableAdmins(adminIds: [ID!]!): [AdminUserWithRBAC!]!
  }
`
