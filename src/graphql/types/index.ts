import { mergeTypeDefs } from '@graphql-tools/merge';
import { authTypeDefs } from './auth.types';
import { propertyTypeDefs } from './property.types';
import { rbacTypeDefs } from './rbac.types';

export const typeDefs = mergeTypeDefs([authTypeDefs, propertyTypeDefs, rbacTypeDefs]);