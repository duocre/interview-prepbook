'use client';

import React, { useState } from 'react';
import { trpc } from '@/app/_trpc/client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { useRouter } from 'next/navigation';

const EditorComp = dynamic(
  () => import('@/components/editor/EditorComponent'),
  { ssr: false },
);

// const markdown = `## Look at the questions\n\`\`\`js\nfunc main() {\n  file, err := os.Open("sherlock.txt"):\n  if err != nil {\n    log.Fatalf("error: %s", err)\n  }\n  defer file.Close()\n  // wordFrequency(file)\n\n  w, err := mostCommon(file)\n  if err != nil {\n    log.Fatalf("error: %s", err)\n  }\n  fmt.Println(w)\n  mapDemo()\n}\n\`\`\``;

export default function AdminAddQuestionsPage() {
  const router = useRouter();
  const getQuestions = trpc.getQuestions.useQuery();
  const [title, setTitle] = useState<string>('');
  // const [explanation, setExplanation] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [answerExplanation, setAnswerExplanation] = useState<string>('');
  const [options, setOptions] = useState<string>('');
  const addQuestion = trpc.addQuestion.useMutation({
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
      title,
      explanation,
      options: JSON.stringify(options),
      answer: 'a',
      answer_explanation,
    };

    addQuestion.mutate(data);
  };

  const ref = React.useRef<MDXEditorMethods>(null);

  return (
    <Suspense fallback={<h1>Loading</h1>}>
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
        <EditorComp markdown={''} editorRef={ref} />
        <button disabled={addQuestion.isLoading}>Save</button>
      </form>
    </Suspense>
  );
}
