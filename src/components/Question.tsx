import { AppRouter } from '@/server';
import { inferRouterOutputs } from '@trpc/server';
import React from 'react';
import Label from './ui/Label';

import { useState, useEffect, use } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

type QuestionType = inferRouterOutputs<AppRouter>['getQuestion'];

type Props = {
  question: QuestionType;
  handleNext: () => void;
};

export default function Question({ question, handleNext }: Props) {
  const [answer, setAnswer] = useState<string>('');

  const options = JSON.parse(question.options ?? '{}');

  const handleSetAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.id);
  };

  const handleNextQuestion = () => {
    setAnswer('');
    handleNext();
  };

  return (
    <div className="flex flex-col gap-y-3 rounded-md border border-slate-400 p-4 mt-2">
      <div className="">
        <span className="font-semibold">Question:</span> {question.title}
      </div>

      <div>
        <Markdown
          children={question.explanation}
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
      {options && Object.entries(options).length > 0 && (
        <fieldset className="mt-4">
          <Label>Select your answer</Label>
          <div className="space-y-4">
            {Object.keys(options).map((key) => (
              <div key={question.id + ' ' + key} className="flex items-center">
                <input
                  id={key}
                  name="option-select"
                  type="radio"
                  onChange={(e) => handleSetAnswer(e)}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor={key}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {options[key]}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      )}
      {!!answer ? answer === question.answer ? <>Right</> : <>Wrong</> : <></>}
      {!!answer && (
        <div>
          <Markdown
            children={question.answer_explanation}
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
      )}
      <button
        className="cssbuttons-io-button w-fit self-end"
        onClick={() => handleNextQuestion()}
      >
        Next
        <div className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            ></path>
          </svg>
        </div>
      </button>
    </div>
  );
}
