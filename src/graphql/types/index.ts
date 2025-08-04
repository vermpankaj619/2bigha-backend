import { mergeTypeDefs } from '@graphql-tools/merge';
import { authTypeDefs } from './auth.types';
import { propertyTypeDefs } from './property.types';
import { rbacTypeDefs } from './rbac.types';
import { propertyApprovalEnhancedTypeDefs } from './property-approval.types';
import { mapPropertiesTypeDefs } from './map-properties.types';
import { adminDashboardTypeDefs } from './admin-dashboard.types';
import { blogTypeDefs } from './blog.types';

export const typeDefs = mergeTypeDefs([authTypeDefs, propertyTypeDefs, rbacTypeDefs, propertyApprovalEnhancedTypeDefs, adminDashboardTypeDefs, mapPropertiesTypeDefs, blogTypeDefs]);