import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const recipes = sqliteTable('recipes', { id: text('id').primaryKey(), data: text('data').notNull(), updated: text('updated').notNull() });
export const settings = sqliteTable('settings', { id: text('id').primaryKey(), data: text('data').notNull() });
