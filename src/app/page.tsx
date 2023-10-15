'use client';

import { useState } from 'react';
import { trpc } from './_trpc/client';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Home() {
  const [content, setContent] = useState('');

  const sampleQuestion = {
    title: 'Look at the questions',
    explanation: `## Look at the questions\n\`\`\`go\nfunc main() {\n  file, err := os.Open("sherlock.txt"):\n  if err != nil {\n    log.Fatalf("error: %s", err)\n  }\n  defer file.Close()\n  // wordFrequency(file)\n\n  w, err := mostCommon(file)\n  if err != nil {\n    log.Fatalf("error: %s", err)\n  }\n  fmt.Println(w)\n  mapDemo()\n}\n\`\`\``,
    options: '["Option 1", "Option 2", "Option 3", "Option 4"]',
    answer: '1',
    answer_explanation: 'Explanation for the correct answer.',
  };

  const getQuestions = trpc.getQuestions.useQuery();
  const addQuestion = trpc.addQuestion.useMutation({
    onSettled: () => getQuestions.refetch(),
  });
  const codeString = '(num) => num + 1';

  return (
    <main className="text-black">
      Interview Prepbook
      {/* <div>{JSON.stringify(getQuestions.data)}</div> */}
      <div>
        {/* <Markdown>{getQuestions?.data?.[1].explanation}</Markdown> */}
        {/* {getQuestions?.data?.[1].explanation} */}

        <Markdown
          children={getQuestions?.data?.[0].explanation}
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  style={base16AteliersulphurpoolLight}
                  language={match[1]}
                  showLineNumbers={true}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
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
            addQuestion.mutate(sampleQuestion);
            setContent('');
          }
        }}
      >
        Submit
      </button>
    </main>
  );
}
