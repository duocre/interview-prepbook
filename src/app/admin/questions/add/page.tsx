'use client';

import React, { useState, useRef } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { MDXEditorMethods } from '@mdxeditor/editor';

import { trpc } from '@/app/_trpc/client';

import { cn } from '@/lib/utils';
import FormInput from '@/components/ui/FormInput';
import Label from '@/components/ui/Label';
import {
  CloudArrowUpIcon,
  MinusIcon,
  PlusCircleIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import Button from '@/components/ui/Button';

const EditorComp = dynamic(
  () => import('@/components/editor/EditorComponent'),
  { ssr: false },
);

export default function AdminAddQuestionsPage() {
  const [title, setTitle] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [options, setOptions] = useState<{ [key: string]: string }>({});
  const [currentOptionKey, setCurrentOptionKey] = useState<string>('');
  const [currentOptionValue, setCurrentOptionValue] = useState<string>('');
  const [showOptionEditor, setShowOptionEditor] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const refQuestion = useRef<MDXEditorMethods>(null);
  const refAnswer = useRef<MDXEditorMethods>(null);

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

    const explanation = refQuestion.current?.getMarkdown() ?? '';
    const answer_explanation = refAnswer.current?.getMarkdown() ?? '';

    const data = {
      title,
      explanation,
      options: JSON.stringify(options),
      answer,
      answer_explanation,
    };

    addQuestion.mutate(data);
  };
  // TODO: Create a custom button component. (Follow Input, Label, FormInput)
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <main className="max-w-2xl mx-auto flex flex-col gap-y-4">
        <h2 className="text-xl font-semibold leading-7 text-gray-900">
          Add question
        </h2>

        <form
          className="w-full mx-auto max-w-2xl border-0 flex flex-col gap-y-2"
          onSubmit={handleSubmit}
        >
          <FormInput
            label="Title*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <Label>Question explanation*</Label>
            <div className="border border-gray-300 w-full">
              <EditorComp markdown={''} editorRef={refQuestion} />
            </div>
          </div>
          <Label>Options*</Label>
          {options &&
            Object.keys(options).map((key) => (
              <div key={key} className="flex items-center gap-x-2">
                <Button onClick={() => deleteOption(key)}>
                  <MinusIcon
                    className="h-5 w-5 bg-red-600"
                    aria-hidden="true"
                  />
                </Button>
                <span>{key}:</span>
                <span>{options[key]}</span>
              </div>
            ))}
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
              <EditorComp markdown={''} editorRef={refAnswer} />
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
            disabled={addQuestion.isLoading}
          >
            Save
            <CloudArrowUpIcon
              className={cn(
                '-mr-0.5 h-5 w-5 ',
                addQuestion.isLoading && 'animate-bounce',
              )}
              aria-hidden="true"
            />
          </Button>
        </form>
      </main>
    </Suspense>
  );
}
