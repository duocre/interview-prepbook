'use client';

import { trpc } from '@/app/_trpc/client';

import { Suspense } from 'react';
import QuestionEditForm from '@/components/QuestionEditForm';

export default function AdminEditQuestionsPage({
  params,
}: {
  params: { id: string };
}) {
  const questionById = trpc.getQuestion.useQuery({ id: params.id });

  return (
    <Suspense fallback={<h1>Loading</h1>}>
      {questionById.data && <QuestionEditForm question={questionById.data} />}
    </Suspense>
  );
}
