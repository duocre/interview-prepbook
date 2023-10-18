'use client';

import { useState, useEffect, use } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { trpc } from '../_trpc/client';
import Label from '@/components/ui/Label';
import Question from '@/components/Question';

export default function Home() {
  const getQuestions = trpc.getQuestions.useQuery();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNextQuestion = () => {
    if (getQuestions.data?.length) {
      if (currentIndex < getQuestions.data?.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  return (
    <main className="">
      {!!getQuestions.data && getQuestions.data.length > 0 && (
        <Question
          question={getQuestions.data?.[currentIndex]!}
          handleNext={handleNextQuestion}
        />
      )}
    </main>
  );
}
