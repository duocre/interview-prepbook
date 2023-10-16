'use client';

import { trpc } from '@/app/_trpc/client';
import { AppRouter } from '@/server';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { inferRouterOutputs } from '@trpc/server';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type questionOut = inferRouterOutputs<AppRouter>['getQuestion'];

const EditorComp = dynamic(
  () => import('@/components/editor/EditorComponent'),
  { ssr: false },
);

export default function QuestionEditForm({
  question,
}: {
  question: questionOut;
}) {
  const router = useRouter();
  const getQuestions = trpc.getQuestions.useQuery();
  const [title, setTitle] = useState<string>(question.title ?? '');

  const updateQuestion = trpc.updateQuestion.useMutation({
    onSettled: () => {
      getQuestions.refetch();
      router.push('/admin/questions');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const explanation = ref.current?.getMarkdown();
    if (!explanation) throw new Error('Explanation is empty');
    const options = {
      a: 'Option 1',
      b: 'Option 2',
      c: 'Option 3',
      d: 'Option 4',
    };

    const answer_explanation = 'Explanation for the correct answer.';
    const data = {
      id: question.id,
      title,
      explanation,
      options: JSON.stringify(options),
      answer: 'a',
      answer_explanation,
    };

    updateQuestion.mutate(data);
  };

  const ref = React.useRef<MDXEditorMethods>(null);

  return (
    <form
      className="w-full mx-auto max-w-2xl border-0 flex flex-col gap-y-2"
      onSubmit={handleSubmit}
    >
      <label htmlFor="title">Question title</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <EditorComp markdown={question.explanation ?? ''} editorRef={ref} />
      <button disabled={updateQuestion.isLoading}>Save</button>
    </form>
  );
}
