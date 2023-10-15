'use client';

import { useState } from 'react';
import { trpc } from './_trpc/client';

export default function Home() {
  const [content, setContent] = useState('');

  const getQuestions = trpc.getQuestions.useQuery();
  const addQuestion = trpc.addQuestion.useMutation({
    onSettled: () => getQuestions.refetch(),
  });
  return (
    <main>
      Interview Prepbook
      <div>{JSON.stringify(getQuestions.data)}</div>
      <input
        id="content"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          if (content.length) {
            addQuestion.mutate(content);
            setContent('');
          }
        }}
      >
        Submit
      </button>
    </main>
  );
}
