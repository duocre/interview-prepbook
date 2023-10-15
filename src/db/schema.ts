import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const questions = sqliteTable('questions', {
  id: integer('id').primaryKey(),
  question: text('question'),
  done: integer('done'),
});
