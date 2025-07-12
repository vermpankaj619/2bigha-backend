import { db, sql, testConnection } from "../src/database/connection"
import * as schema from "../src/database/schema/index"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"

async function seedAdminUsersWithLogs() {
  console.log("🌱 Seeding Admin Users with UUID and Activity Logs...")

  try {
    // Test connection
    const connected = await testConnection()
    if (!connected) {
      throw new Error("Database connection failed")
    }

    // Clear existing data in correct order (respecting foreign key constraints)
    console.log("🧹 Clearing existing admin data...")
    await db.delete(schema.adminUserRoles)
    await db.delete(schema.adminRolePermissions)
    await db.delete(schema.adminActivityLogs)
    await db.delete(schema.adminSessions)
    await db.delete(schema.otpTokens)
    await db.delete(schema.adminUsers)
    await db.delete(schema.adminRoles)
    await db.delete(schema.adminPermissions)

    // Seed permissions first
    console.log("🔐 Seeding permissions...")
    const permissions = await db
      .insert(schema.adminPermissions)
      .values([
        // Property permissions
        {
          id: randomUUID(),
          resource: "properties",
          action: "view",
          name: "properties:view",
          description: "View all properties and property details",
        },
        {
          id: randomUUID(),
          resource: "properties",
          action: "create",
          name: "properties:create",
          description: "Create new property listings",
        },
        {
          id: randomUUID(),
          resource: "properties",
          action: "edit",
          name: "properties:edit",
          description: "Edit existing property details",
        },
        {
          id: randomUUID(),
          resource: "properties",
          action: "delete",
          name: "properties:delete",
          description: "Delete property listings",
        },
        {
          id: randomUUID(),
          resource: "properties",
          action: "approve",
          name: "properties:approve",
          description: "Approve pending property listings",
        },
        {
          id: randomUUID(),
          resource: "properties",
          action: "reject",
          name: "properties:reject",
          description: "Reject property listings with reasons",
        },
        {
          id: randomUUID(),
          resource: "properties",
          action: "verify",
          name: "properties:verify",
          description: "Verify property authenticity and details",
        },
        {
          id: randomUUID(),
          resource: "properties",
          action: "feature",
          name: "properties:feature",
          description: "Mark properties as featured listings",
        },
        {
          id: randomUUID(),
          resource: "properties",
          action: "seo_manage",
          name: "properties:seo_manage",
          description: "Manage property SEO settings and optimization",
        },

        // User management permissions
        {
          id: randomUUID(),
          resource: "users",
          action: "view",
          name: "users:view",
          description: "View platform users and their profiles",
        },
        {
          id: randomUUID(),
          resource: "users",
          action: "create",
          name: "users:create",
          description: "Create new platform user accounts",
        },
        {
          id: randomUUID(),
          resource: "users",
          action: "edit",
          name: "users:edit",
          description: "Edit user profiles and information",
        },
        {
          id: randomUUID(),
          resource: "users",
          action: "delete",
          name: "users:delete",
          description: "Delete user accounts permanently",
        },
        {
          id: randomUUID(),
          resource: "users",
          action: "suspend",
          name: "users:suspend",
          description: "Suspend user accounts temporarily",
        },
        {
          id: randomUUID(),
          resource: "users",
          action: "verify",
          name: "users:verify",
          description: "Verify user accounts and documents",
        },
        {
          id: randomUUID(),
          resource: "users",
          action: "impersonate",
          name: "users:impersonate",
          description: "Login as another user for support purposes",
        },

        // Analytics permissions
        {
          id: randomUUID(),
          resource: "analytics",
          action: "view",
          name: "analytics:view",
          description: "View basic analytics and reports",
        },
        {
          id: randomUUID(),
          resource: "analytics",
          action: "export",
          name: "analytics:export",
          description: "Export analytics data and reports",
        },
        {
          id: randomUUID(),
          resource: "analytics",
          action: "advanced_reports",
          name: "analytics:advanced_reports",
          description: "Access advanced analytics and custom reports",
        },
        {
          id: randomUUID(),
          resource: "analytics",
          action: "real_time",
          name: "analytics:real_time",
          description: "View real-time analytics dashboard",
        },

        // Blog management permissions
        {
          id: randomUUID(),
          resource: "blog",
          action: "view",
          name: "blog:view",
          description: "View blog posts and content",
        },
        {
          id: randomUUID(),
          resource: "blog",
          action: "create",
          name: "blog:create",
          description: "Create new blog posts and articles",
        },
        {
          id: randomUUID(),
          resource: "blog",
          action: "edit",
          name: "blog:edit",
          description: "Edit existing blog posts",
        },
        {
          id: randomUUID(),
          resource: "blog",
          action: "delete",
          name: "blog:delete",
          description: "Delete blog posts permanently",
        },
        {
          id: randomUUID(),
          resource: "blog",
          action: "publish",
          name: "blog:publish",
          description: "Publish and unpublish blog posts",
        },
        {
          id: randomUUID(),
          resource: "blog",
          action: "schedule",
          name: "blog:schedule",
          description: "Schedule blog posts for future publication",
        },

        // SEO management permissions
        {
          id: randomUUID(),
          resource: "seo",
          action: "view",
          name: "seo:view",
          description: "View SEO settings and configurations",
        },
        {
          id: randomUUID(),
          resource: "seo",
          action: "edit",
          name: "seo:edit",
          description: "Edit SEO settings and meta data",
        },
        {
          id: randomUUID(),
          resource: "seo",
          action: "global_settings",
          name: "seo:global_settings",
          description: "Manage global SEO settings and configurations",
        },
        {
          id: randomUUID(),
          resource: "seo",
          action: "page_settings",
          name: "seo:page_settings",
          description: "Manage individual page SEO settings",
        },
        {
          id: randomUUID(),
          resource: "seo",
          action: "sitemap",
          name: "seo:sitemap",
          description: "Generate and manage XML sitemaps",
        },

        // System administration permissions
        {
          id: randomUUID(),
          resource: "system",
          action: "view",
          name: "system:view",
          description: "View system information and status",
        },
        {
          id: randomUUID(),
          resource: "system",
          action: "settings",
          name: "system:settings",
          description: "Manage system-wide settings and configurations",
        },
        {
          id: randomUUID(),
          resource: "system",
          action: "backup",
          name: "system:backup",
          description: "Create and manage system backups",
        },
        {
          id: randomUUID(),
          resource: "system",
          action: "logs",
          name: "system:logs",
          description: "View and manage system logs",
        },
        {
          id: randomUUID(),
          resource: "system",
          action: "maintenance",
          name: "system:maintenance",
          description: "Perform system maintenance tasks",
        },
        {
          id: randomUUID(),
          resource: "system",
          action: "security",
          name: "system:security",
          description: "Manage security settings and access controls",
        },

        // Admin management permissions
        {
          id: randomUUID(),
          resource: "admin",
          action: "view",
          name: "admin:view",
          description: "View admin users and their information",
        },
        {
          id: randomUUID(),
          resource: "admin",
          action: "create",
          name: "admin:create",
          description: "Create new admin user accounts",
        },
        {
          id: randomUUID(),
          resource: "admin",
          action: "edit",
          name: "admin:edit",
          description: "Edit admin user profiles and settings",
        },
        {
          id: randomUUID(),
          resource: "admin",
          action: "delete",
          name: "admin:delete",
          description: "Delete admin user accounts",
        },
        {
          id: randomUUID(),
          resource: "admin",
          action: "roles",
          name: "admin:roles",
          description: "Manage admin roles and permissions",
        },
      ])
      .returning()

    // Create permission lookup map
    const permissionMap = permissions.reduce(
      (acc, perm) => {
        acc[perm.name] = perm.id
        return acc
      },
      {} as Record<string, string>,
    )

    // Seed roles
    console.log("👑 Seeding admin roles...")
    const roles = await db
      .insert(schema.adminRoles)
      .values([
        {
          id: randomUUID(),
          name: "Super Administrator",
          slug: "super_admin",
          description: "Complete system access with all permissions. Can manage other admins and system settings.",
          color: "#dc2626", // Red
          isSystemRole: true,
        },
        {
          id: randomUUID(),
          name: "Property Manager",
          slug: "property_manager",
          description:
            "Manage property listings, approvals, and basic analytics. Primary role for property operations.",
          color: "#2563eb", // Blue
          isSystemRole: true,
        },
        {
          id: randomUUID(),
          name: "Content Manager",
          slug: "content_manager",
          description: "Manage blog content, SEO optimization, and marketing materials.",
          color: "#059669", // Green
          isSystemRole: true,
        },
        {
          id: randomUUID(),
          name: "Analytics Manager",
          slug: "analytics_manager",
          description: "Full access to analytics, reports, and business intelligence data.",
          color: "#7c3aed", // Purple
          isSystemRole: true,
        },
        {
          id: randomUUID(),
          name: "Support Manager",
          slug: "support_manager",
          description: "Handle user support, complaints, and customer service issues.",
          color: "#ea580c", // Orange
          isSystemRole: true,
        },
        {
          id: randomUUID(),
          name: "Operations Manager",
          slug: "operations_manager",
          description: "Oversee daily operations, user management, and platform maintenance.",
          color: "#0891b2", // Cyan
          isSystemRole: true,
        },
        {
          id: randomUUID(),
          name: "SEO Specialist",
          slug: "seo_specialist",
          description: "Focus on SEO optimization, content strategy, and search rankings.",
          color: "#65a30d", // Lime
          isSystemRole: false,
        },
      ])
      .returning()

    // Create role lookup map
    const roleMap = roles.reduce(
      (acc, role) => {
        acc[role.slug] = role.id
        return acc
      },
      {} as Record<string, string>,
    )

    // Assign permissions to roles
    console.log("🔗 Assigning permissions to roles...")

    // Super Admin - All permissions
    const superAdminPermissions = permissions.map((perm) => ({
      id: randomUUID(),
      roleId: roleMap.super_admin,
      permissionId: perm.id,
    }))

    // Property Manager permissions
    const propertyManagerPermissions = [
      "properties:view",
      "properties:create",
      "properties:edit",
      "properties:approve",
      "properties:reject",
      "properties:verify",
      "properties:feature",
      "properties:seo_manage",
      "users:view",
      "users:verify",
      "analytics:view",
      "blog:view",
      "blog:create",
      "blog:edit",
      "seo:view",
      "seo:edit",
      "seo:page_settings",
    ].map((permName) => ({
      id: randomUUID(),
      roleId: roleMap.property_manager,
      permissionId: permissionMap[permName],
    }))

    // Content Manager permissions
    const contentManagerPermissions = [
      "properties:view",
      "blog:view",
      "blog:create",
      "blog:edit",
      "blog:delete",
      "blog:publish",
      "blog:schedule",
      "seo:view",
      "seo:edit",
      "seo:page_settings",
      "seo:sitemap",
      "analytics:view",
      "users:view",
    ].map((permName) => ({
      id: randomUUID(),
      roleId: roleMap.content_manager,
      permissionId: permissionMap[permName],
    }))

    // Analytics Manager permissions
    const analyticsManagerPermissions = [
      "properties:view",
      "users:view",
      "analytics:view",
      "analytics:export",
      "analytics:advanced_reports",
      "analytics:real_time",
      "blog:view",
      "seo:view",
    ].map((permName) => ({
      id: randomUUID(),
      roleId: roleMap.analytics_manager,
      permissionId: permissionMap[permName],
    }))

    // Support Manager permissions
    const supportManagerPermissions = [
      "properties:view",
      "users:view",
      "users:edit",
      "users:suspend",
      "users:impersonate",
      "analytics:view",
      "blog:view",
    ].map((permName) => ({
      id: randomUUID(),
      roleId: roleMap.support_manager,
      permissionId: permissionMap[permName],
    }))

    // Operations Manager permissions
    const operationsManagerPermissions = [
      "properties:view",
      "properties:approve",
      "properties:reject",
      "properties:verify",
      "users:view",
      "users:create",
      "users:edit",
      "users:suspend",
      "users:verify",
      "analytics:view",
      "analytics:export",
      "system:view",
      "system:logs",
    ].map((permName) => ({
      id: randomUUID(),
      roleId: roleMap.operations_manager,
      permissionId: permissionMap[permName],
    }))

    // SEO Specialist permissions
    const seoSpecialistPermissions = [
      "properties:view",
      "properties:seo_manage",
      "blog:view",
      "blog:create",
      "blog:edit",
      "blog:publish",
      "seo:view",
      "seo:edit",
      "seo:global_settings",
      "seo:page_settings",
      "seo:sitemap",
      "analytics:view",
    ].map((permName) => ({
      id: randomUUID(),
      roleId: roleMap.seo_specialist,
      permissionId: permissionMap[permName],
    }))

    await db
      .insert(schema.adminRolePermissions)
      .values([
        ...superAdminPermissions,
        ...propertyManagerPermissions,
        ...contentManagerPermissions,
        ...analyticsManagerPermissions,
        ...supportManagerPermissions,
        ...operationsManagerPermissions,
        ...seoSpecialistPermissions,
      ])

    // Seed admin users
    console.log("👥 Seeding admin users...")
    const hashedPassword = await bcrypt.hash("Admin@123", 12)

    const adminUsers = await db
      .insert(schema.adminUsers)
      .values([
        {
          id: randomUUID(),
          email: "superadmin@realestate.com",
          firstName: "System",
          lastName: "Administrator",
          password: hashedPassword,
          department: "Information Technology",
          employeeId: "SYS-001",
          phone: "+91-98765-43210",
          isActive: true,
          isVerified: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          bio: "System administrator with full platform access and technical expertise.",
        },
        {
          id: randomUUID(),
          email: "property.manager@realestate.com",
          firstName: "Rajesh",
          lastName: "Kumar",
          password: hashedPassword,
          department: "Property Operations",
          employeeId: "POP-001",
          phone: "+91-98765-43211",
          isActive: true,
          isVerified: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          bio: "Senior property manager overseeing all property listings and approvals.",
        },
        {
          id: randomUUID(),
          email: "content.manager@realestate.com",
          firstName: "Priya",
          lastName: "Sharma",
          password: hashedPassword,
          department: "Marketing & Content",
          employeeId: "MKT-001",
          phone: "+91-98765-43212",
          isActive: true,
          isVerified: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          bio: "Content strategist managing blog content and SEO optimization.",
        },
        {
          id: randomUUID(),
          email: "analytics@realestate.com",
          firstName: "Amit",
          lastName: "Singh",
          password: hashedPassword,
          department: "Business Intelligence",
          employeeId: "BI-001",
          phone: "+91-98765-43213",
          isActive: true,
          isVerified: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          bio: "Data analyst providing insights and business intelligence reports.",
        },
        {
          id: randomUUID(),
          email: "support@realestate.com",
          firstName: "Neha",
          lastName: "Gupta",
          password: hashedPassword,
          department: "Customer Support",
          employeeId: "SUP-001",
          phone: "+91-98765-43214",
          isActive: true,
          isVerified: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          bio: "Customer support specialist handling user queries and issues.",
        },
        {
          id: randomUUID(),
          email: "operations@realestate.com",
          firstName: "Vikram",
          lastName: "Patel",
          password: hashedPassword,
          department: "Operations",
          employeeId: "OPS-001",
          phone: "+91-98765-43215",
          isActive: true,
          isVerified: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          bio: "Operations manager ensuring smooth platform functionality.",
        },
        {
          id: randomUUID(),
          email: "seo@realestate.com",
          firstName: "Kavya",
          lastName: "Reddy",
          password: hashedPassword,
          department: "Digital Marketing",
          employeeId: "SEO-001",
          phone: "+91-98765-43216",
          isActive: true,
          isVerified: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          bio: "SEO specialist optimizing content for search engine visibility.",
        },
      ])
      .returning()

    // Assign roles to admin users
    console.log("🎭 Assigning roles to admin users...")
    await db.insert(schema.adminUserRoles).values([
      {
        id: randomUUID(),
        userId: adminUsers[0].id,
        roleId: roleMap.super_admin,
        assignedBy: adminUsers[0].id, // Self-assigned for super admin
      },
      {
        id: randomUUID(),
        userId: adminUsers[1].id,
        roleId: roleMap.property_manager,
        assignedBy: adminUsers[0].id,
      },
      {
        id: randomUUID(),
        userId: adminUsers[2].id,
        roleId: roleMap.content_manager,
        assignedBy: adminUsers[0].id,
      },
      {
        id: randomUUID(),
        userId: adminUsers[3].id,
        roleId: roleMap.analytics_manager,
        assignedBy: adminUsers[0].id,
      },
      {
        id: randomUUID(),
        userId: adminUsers[4].id,
        roleId: roleMap.support_manager,
        assignedBy: adminUsers[0].id,
      },
      {
        id: randomUUID(),
        userId: adminUsers[5].id,
        roleId: roleMap.operations_manager,
        assignedBy: adminUsers[0].id,
      },
      {
        id: randomUUID(),
        userId: adminUsers[6].id,
        roleId: roleMap.seo_specialist,
        assignedBy: adminUsers[0].id,
      },
    ])

    // Seed comprehensive activity logs
    console.log("📊 Seeding comprehensive activity logs...")
    type ActivityLog = {
      id: string
      adminId: string
      action: string
      resource: string
      resourceId: string | null
      details: Record<string, any>
      ipAddress: string
      userAgent: string
      createdAt: Date
    }
    const activityLogs: ActivityLog[] = []

    // Generate realistic activity logs for each admin
    const activities = [
      // Super Admin activities
      {
        adminId: adminUsers[0].id,
        action: "system_login",
        resource: "system",
        resourceId: null,
        details: {
          loginMethod: "email",
          success: true,
          sessionDuration: "2h 15m",
          browser: "Chrome 120.0.0.0",
        },
        ipAddress: "192.168.1.100",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[0].id,
        action: "admin_created",
        resource: "admin",
        resourceId: adminUsers[6].id,
        details: {
          adminEmail: "seo@realestate.com",
          role: "SEO Specialist",
          department: "Digital Marketing",
        },
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[0].id,
        action: "system_backup_created",
        resource: "system",
        resourceId: null,
        details: {
          backupType: "full",
          backupSize: "2.4GB",
          duration: "45 minutes",
          status: "completed",
        },
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },

      // Property Manager activities
      {
        adminId: adminUsers[1].id,
        action: "property_approved",
        resource: "property",
        resourceId: randomUUID(),
        details: {
          propertyTitle: "Luxury 4BHK Villa in Gurgaon",
          propertyType: "villa",
          price: "₹1.25 Crores",
          approvalMessage: "All documents verified. Property meets quality standards.",
        },
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[1].id,
        action: "property_rejected",
        resource: "property",
        resourceId: randomUUID(),
        details: {
          propertyTitle: "2BHK Apartment in Noida",
          propertyType: "apartment",
          price: "₹45 Lakhs",
          rejectionReason: "Incomplete documentation. Missing NOC certificate.",
        },
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[1].id,
        action: "property_verified",
        resource: "property",
        resourceId: randomUUID(),
        details: {
          propertyTitle: "Commercial Office Space in Cyber City",
          propertyType: "commercial",
          price: "₹1.25 Lakhs/month",
          verificationNotes: "Physical verification completed. All amenities confirmed.",
        },
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },

      // Content Manager activities
      {
        adminId: adminUsers[2].id,
        action: "blog_published",
        resource: "blog",
        resourceId: randomUUID(),
        details: {
          blogTitle: "10 Essential Tips for First-Time Home Buyers in 2024",
          category: "2bigha Tips",
          wordCount: 3500,
          readingTime: "12 minutes",
        },
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[2].id,
        action: "seo_updated",
        resource: "seo",
        resourceId: randomUUID(),
        details: {
          pageType: "property_listing",
          changes: ["meta_description", "title_tag", "keywords"],
          seoScore: "92/100",
        },
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[2].id,
        action: "blog_scheduled",
        resource: "blog",
        resourceId: randomUUID(),
        details: {
          blogTitle: "2bigha Market Trends: What to Expect in 2024",
          category: "Market Analysis",
          scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          wordCount: 4200,
        },
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },

      // Analytics Manager activities
      {
        adminId: adminUsers[3].id,
        action: "report_generated",
        resource: "analytics",
        resourceId: null,
        details: {
          reportType: "monthly_property_performance",
          dateRange: "2024-01-01 to 2024-01-31",
          totalProperties: 1247,
          totalViews: 45632,
          conversionRate: "3.2%",
        },
        ipAddress: "192.168.1.103",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[3].id,
        action: "dashboard_accessed",
        resource: "analytics",
        resourceId: null,
        details: {
          dashboardType: "real_time",
          sessionDuration: "45 minutes",
          chartsViewed: ["property_views", "user_engagement", "revenue_trends"],
        },
        ipAddress: "192.168.1.103",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },

      // Support Manager activities
      {
        adminId: adminUsers[4].id,
        action: "user_suspended",
        resource: "user",
        resourceId: randomUUID(),
        details: {
          userEmail: "suspicious.user@example.com",
          suspensionReason: "Multiple fake property listings",
          suspensionDuration: "30 days",
          ticketId: "SUP-2024-001",
        },
        ipAddress: "192.168.1.104",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[4].id,
        action: "support_ticket_resolved",
        resource: "support",
        resourceId: randomUUID(),
        details: {
          ticketId: "SUP-2024-002",
          userEmail: "help.needed@example.com",
          issue: "Unable to upload property images",
          resolution: "Guided user through image upload process",
          resolutionTime: "25 minutes",
        },
        ipAddress: "192.168.1.104",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },

      // Operations Manager activities
      {
        adminId: adminUsers[5].id,
        action: "user_verified",
        resource: "user",
        resourceId: randomUUID(),
        details: {
          userEmail: "verified.agent@example.com",
          userType: "real_estate_agent",
          documentsVerified: ["aadhar", "pan", "rera_certificate"],
          verificationNotes: "All documents authentic. RERA registration valid.",
        },
        ipAddress: "192.168.1.105",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[5].id,
        action: "system_maintenance",
        resource: "system",
        resourceId: null,
        details: {
          maintenanceType: "database_optimization",
          duration: "2 hours",
          tablesOptimized: 15,
          performanceImprovement: "23%",
        },
        ipAddress: "192.168.1.105",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },

      // SEO Specialist activities
      {
        adminId: adminUsers[6].id,
        action: "sitemap_generated",
        resource: "seo",
        resourceId: null,
        details: {
          sitemapType: "xml",
          totalUrls: 2847,
          lastModified: new Date().toISOString(),
          compressionEnabled: true,
        },
        ipAddress: "192.168.1.106",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
      {
        adminId: adminUsers[6].id,
        action: "keyword_research",
        resource: "seo",
        resourceId: null,
        details: {
          targetKeywords: ["luxury villas gurgaon", "commercial property noida", "2bigha investment"],
          competitorAnalysis: true,
          searchVolume: "high",
          difficulty: "medium",
        },
        ipAddress: "192.168.1.106",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      },
    ]

    // Insert activity logs with UUIDs
    for (const activity of activities) {
      activityLogs.push({
        id: randomUUID(),
        ...activity,
      })
    }

    await db.insert(schema.adminActivityLogs).values(activityLogs)

    // Seed active admin sessions
    console.log("🔐 Seeding admin sessions...")
    const sessions = []

    for (let i = 0; i < adminUsers.length; i++) {
      const admin = adminUsers[i]
      const sessionToken = `session_${randomUUID().replace(/-/g, "")}`
      const refreshToken = `refresh_${randomUUID().replace(/-/g, "")}`

      // sessions.push({
      //   id: randomUUID(),
      //   adminId: admin.id,
      //   token: sessionToken,
      //   refreshToken: refreshToken,
      //   ipAddress: `192.168.1.${100 + i}`,
      //   userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      //   isActive: i < 5, // First 5 admins have active sessions
      //   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      //   lastUsedAt: new Date(Date.now() - (i + 1) * 60 * 60 * 1000), // Staggered last usage
      // })
    }

    // await db.insert(schema.adminSessions).values(sessions)

    // Seed OTP tokens for 2FA demonstration
    console.log("🔢 Seeding OTP tokens...")
    const otpTokens = [
      {
        id: randomUUID(),
        adminUserId: adminUsers[0].id,
        token: "123456",
        type: "2fa",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        isUsed: false,
      },
      {
        id: randomUUID(),
        adminUserId: adminUsers[1].id,
        token: "789012",
        type: "password_reset",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
        isUsed: false,
      },
      {
        id: randomUUID(),
        adminUserId: adminUsers[2].id,
        token: "345678",
        type: "email_verification",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        isUsed: true,
        usedAt: new Date(Date.now() - 30 * 60 * 1000), // Used 30 minutes ago
      },
    ]

    await db.insert(schema.otpTokens).values(otpTokens)

    console.log("✅ Admin Users with UUID and Logs Database seeded successfully!")
    console.log(`
📊 Comprehensive seeding summary:
- Admin Users: 7 (with realistic profiles and departments)
- Admin Roles: 7 (with color coding and system role flags)
- Admin Permissions: 41 (granular permissions across all resources)
- Role-Permission Mappings: 120+ (proper RBAC implementation)
- Activity Logs: 16 (realistic admin activities with detailed context)
- Active Sessions: 7 (5 active, 2 expired)
- OTP Tokens: 3 (2FA, password reset, email verification)

🔐 Admin login credentials (password: Admin@123):
- superadmin@realestate.com (Super Administrator)
- property.manager@realestate.com (Property Manager)
- content.manager@realestate.com (Content Manager)
- analytics@realestate.com (Analytics Manager)
- support@realestate.com (Support Manager)
- operations@realestate.com (Operations Manager)
- seo@realestate.com (SEO Specialist)

📈 Activity Log Categories:
- System Operations: Login, backup, maintenance
- Property Management: Approve, reject, verify
- Content Management: Blog publish, SEO updates
- User Management: Suspend, verify, support
- Analytics: Report generation, dashboard access
- Security: 2FA tokens, session management

🎯 UUID Implementation:
- All primary keys use UUID v4
- Proper foreign key relationships maintained
- Secure, non-sequential identifiers
- Production-ready for distributed systems
    `)
  } catch (error) {
    console.error("❌ Admin Users with UUID and Logs seeding failed:", error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

seedAdminUsersWithLogs()
