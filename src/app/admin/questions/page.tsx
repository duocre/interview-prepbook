'use client';

import { trpc } from '@/app/_trpc/client';
import Link from 'next/link';

export default function AdminQuestionsPage() {
  const questions = trpc.getQuestions.useQuery();

  return (
    <div>
      <Link href="/admin/questions/add">Add question</Link>
      {questions.data?.map((question) => (
        <div
          key={question.id}
          className="border-2 border-gray-200 rounded-md p-4"
        >
          <h3 className="text-lg font-bold">{question.title}</h3>
          <Link href="/admin/questions/add">Edit question</Link>
        </div>
      ))}
    </div>
  );
}
