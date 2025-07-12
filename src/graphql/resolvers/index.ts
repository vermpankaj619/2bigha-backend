import { mergeResolvers } from '@graphql-tools/merge';
import { adminAuthResolvers } from './auth.resolvers';
import { propertyResolvers } from './property.resolvers';
import { rbacResolvers } from './rbac.resolvers';
import { propertyApprovalResolvers } from './property-approval-enhanced.resolvers';

export const resolvers: any = mergeResolvers([adminAuthResolvers, propertyResolvers, rbacResolvers, propertyApprovalResolvers]);