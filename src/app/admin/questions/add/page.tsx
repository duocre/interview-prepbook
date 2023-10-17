'use client';

import { Suspense } from 'react';
import QuestionForm from '@/components/QuestionForm';

export default function AdminAddQuestionsPage() {
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <QuestionForm isEdit={false} />
    </Suspense>
  );
}
