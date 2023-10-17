'use client';

import { trpc } from '@/app/_trpc/client';
import { AppRouter } from '@/server';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { inferRouterOutputs } from '@trpc/server';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';
import FormInput from './ui/FormInput';
import Label from './ui/Label';
import Button from './ui/Button';
import {
  CloudArrowUpIcon,
  MinusIcon,
  PlusCircleIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

type questionOut = inferRouterOutputs<AppRouter>['getQuestion'];

interface QuestionFormProps {
  isEdit: boolean;
  question?: questionOut;
}

const EditorComp = dynamic(
  () => import('@/components/editor/EditorComponent'),
  { ssr: false },
);

export default function QuestionForm({ isEdit, question }: QuestionFormProps) {
  const [showOptionEditor, setShowOptionEditor] = useState<boolean>(false);
  const [options, setOptions] = useState<{ [key: string]: string }>(
    JSON.parse(question?.options ?? '{}'),
  );
  const [currentOptionKey, setCurrentOptionKey] = useState<string>('');
  const [currentOptionValue, setCurrentOptionValue] = useState<string>('');
  const [title, setTitle] = useState<string>(question?.title ?? '');
  const [answer, setAnswer] = useState<string>(question?.answer ?? '');
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const refAnswer = useRef<MDXEditorMethods>(null);
  const refQuestion = useRef<MDXEditorMethods>(null);

  const router = useRouter();

  const getQuestions = trpc.getQuestions.useQuery();
  const addQuestion = trpc.addQuestion.useMutation({
    onSettled: () => {
      getQuestions.refetch();
    },
    onSuccess: () => {
      router.push('/admin/questions');
    },
    onError: (error) => {
      if (error.data?.zodError?.fieldErrors) {
        const errors = error.data?.zodError?.fieldErrors;
        Object.keys(errors).forEach((key) => {
          const err = errors[key] as string[];
          setErrors((prev) => ({ ...prev, [key]: err }));
        });
      }
    },
  });

  const updateQuestion = trpc.updateQuestion.useMutation({
    onSettled: () => {
      getQuestions.refetch();
    },
    onSuccess: () => {
      router.push('/admin/questions');
    },
    onError: (error) => {
      if (error.data?.zodError?.fieldErrors) {
        const errors = error.data?.zodError?.fieldErrors;
        Object.keys(errors).forEach((key) => {
          const err = errors[key] as string[];
          setErrors((prev) => ({ ...prev, [key]: err }));
        });
      }
    },
  });

  const currentOperation = isEdit ? updateQuestion : addQuestion;

  const addOption = () => {
    setOptions((prev) => ({ ...prev, [currentOptionKey]: currentOptionValue }));
    setCurrentOptionKey('');
    setCurrentOptionValue('');
    setShowOptionEditor(false);
  };

  const deleteOption = (key: string) => {
    const remainingOptions = { ...options };
    delete remainingOptions[key];
    setOptions(remainingOptions);
  };

  const handleSetAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const explanation = refQuestion.current?.getMarkdown();
    if (!explanation) throw new Error('Explanation is empty');

    isEdit ? handleEdit() : handleAdd();
  };

  const handleEdit = () => {
    const questionExplanation =
      refQuestion.current?.getMarkdown() ?? question?.explanation;
    const answerExplanation =
      refAnswer.current?.getMarkdown() ?? question?.answer_explanation;
    const data = {
      id: question?.id as number,
      title,
      explanation: questionExplanation as string,
      options: JSON.stringify(options),
      answer: answer,
      answer_explanation: answerExplanation as string,
    };
    updateQuestion.mutate(data);
  };

  const handleAdd = () => {
    const questionExplanation =
      refQuestion.current?.getMarkdown() ?? question?.explanation;
    const answerExplanation =
      refAnswer.current?.getMarkdown() ?? question?.answer_explanation;
    const data = {
      title,
      explanation: questionExplanation as string,
      options: JSON.stringify(options),
      answer: answer,
      answer_explanation: answerExplanation as string,
    };
    addQuestion.mutate(data);
  };

  return (
    <main className="max-w-2xl mx-auto flex flex-col gap-y-4">
      <h2 className="text-xl font-semibold leading-7 text-gray-900">
        {isEdit ? 'Edit Question' : 'Add Question'}
      </h2>
      <form
        className="w-full mx-auto max-w-2xl border-0 flex flex-col gap-y-2"
        onSubmit={handleSubmit}
      >
        <label htmlFor="title">Question title</label>
        <FormInput
          label="Title*"
          value={title}
          type="text"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div>
          <Label>Question Explanation*</Label>
          <div className="border border-gray-300 w-full">
            <EditorComp
              markdown={question?.explanation ?? ''}
              editorRef={refQuestion}
            />
          </div>
        </div>
        <button disabled={currentOperation.isLoading}>Save</button>
        {showOptionEditor && (
          <div className="flex gap-x-2 items-center">
            <FormInput
              label="Option Key"
              value={currentOptionKey}
              onChange={(e) => setCurrentOptionKey(e.target.value)}
            />
            <FormInput
              label="Option Value"
              value={currentOptionValue}
              onChange={(e) => setCurrentOptionValue(e.target.value)}
            />
            <Button
              type="button"
              className="rounded-full self-end p-2"
              onClick={addOption}
            >
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        )}
        <Label>Options*</Label>
        {options &&
          Object.keys(options).map((key) => (
            <div key={key} className="flex items-center gap-x-2">
              <Button onClick={() => deleteOption(key)}>
                <MinusIcon className="h-5 w-5 bg-red-600" aria-hidden="true" />
              </Button>
              <span>{key}:</span>
              <span>{options[key]}</span>
            </div>
          ))}
        <Button
          type="button"
          className="inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold w-fit"
          onClick={() => setShowOptionEditor(!showOptionEditor)}
        >
          Add options
          <PlusCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
        </Button>
        {options && Object.entries(options).length > 0 && (
          <fieldset className="mt-4">
            <Label>Select an answer from the options*</Label>
            <div className="space-y-4">
              {Object.keys(options).map((key) => (
                <div key={key} className="flex items-center">
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

        <div>
          <Label>Answer explanation*</Label>
          <div className="border border-gray-300 w-full">
            <EditorComp
              markdown={question?.answer_explanation ?? ''}
              editorRef={refAnswer}
            />
          </div>
        </div>

        {errors &&
          Object.keys(errors).length > 0 &&
          Object.keys(errors).map((key) => (
            <div key={key} className="text-red-500">
              {errors[key].map((err) => (
                <div key={err}>{err}</div>
              ))}
            </div>
          ))}

        <Button
          className="inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold w-fit"
          type="submit"
          disabled={currentOperation.isLoading}
        >
          Save
          <CloudArrowUpIcon
            className={cn(
              '-mr-0.5 h-5 w-5 ',
              currentOperation.isLoading && 'animate-bounce',
            )}
            aria-hidden="true"
          />
        </Button>
      </form>
    </main>
  );
}
