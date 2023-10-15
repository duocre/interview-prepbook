import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { z } from 'zod';

import { publicProcedure, router } from './trpc';
import { questions } from '@/db/schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: 'drizzle' });

const QuestionSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  options: z.string(),
  answer: z.string(),
  answer_explanation: z.string(),
});

export const QuestionsTableSchema = z.array(QuestionSchema);

export const appRouter = router({
  getQuestions: publicProcedure.query(async () => {
    return db.select().from(questions).all();
  }),

  addQuestion: publicProcedure.input(QuestionSchema).mutation(async (opts) => {
    // console.log({ ...opts.input });
    db.insert(questions)
      .values({ ...opts.input })
      .run();
    return true;
  }),
});

export type AppRouter = typeof appRouter;
