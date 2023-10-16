import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { z } from 'zod';

import { publicProcedure, router } from './trpc';
import { questions } from '@/db/schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: 'drizzle' });

export const appRouter = router({
  getQuestions: publicProcedure.query(async () => {
    return db.select().from(questions).all();
  }),

  getQuestion: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const model = await db
        .select()
        .from(questions)
        .where(eq(questions.id, parseInt(id)));

      return model[0];
    }),

  updateQuestion: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z
          .string()
          .min(3, { message: 'Title must be at least 3 characters long' }),
        explanation: z.string().min(10, {
          message: 'Explanation must be at least 10 characters long',
        }),
        options: z.string().optional(),
        answer: z
          .string()
          .min(1, { message: 'Answer must be at least 10 characters long' }),
        answer_explanation: z.string().min(1, {
          message: 'Answer explanation must be at least 10 characters long',
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return db
        .update(questions)
        .set(input)
        .where(eq(questions.id, input.id))
        .returning({ updatedId: questions.id });
    }),

  addQuestion: publicProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(3, { message: 'Title must be at least 3 characters long' }),
        explanation: z.string().min(10, {
          message: 'Explanation must be at least 10 characters long',
        }),
        options: z.string().optional(),
        answer: z
          .string()
          .min(10, { message: 'Answer must be at least 10 characters long' }),
        answer_explanation: z.string().min(10, {
          message: 'Answer explanation must be at least 10 characters long',
        }),
      }),
    )
    .mutation(async (opts) => {
      db.insert(questions)
        .values({ ...opts.input })
        .run();
      return true;
    }),
});

export type AppRouter = typeof appRouter;
