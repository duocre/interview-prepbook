import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const questions = sqliteTable('questions', {
  id: integer('id').primaryKey(),
  title: text('question'),
  explanation: text('explanation'),
  options: text('options'),
  answer: text('answer'),
  answer_explanation: text('answer_explanation'),
});
