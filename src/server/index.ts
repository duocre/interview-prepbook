import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { z } from 'zod';

import { publicProcedure, router } from './trpc';
import { questions } from '@/db/schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: 'drizzle' });

export const appRouter = router({
  getQuestions: publicProcedure.query(async () => {
    return await db.select().from(questions).all();
  }),

  addQuestion: publicProcedure.input(z.string()).mutation(async (opts) => {
    await db.insert(questions).values({ question: opts.input, done: 0 }).run();
    return true;
  }),
});

export type AppRouter = typeof appRouter;
