'use client';

import { trpc } from '@/app/_trpc/client';
import BulkUploadModal from '@/components/BulkUploadModal';
import FullScreenLoader from '@/components/FullScreenLoader';
import { FolderPlusIcon, PencilIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminQuestionsPage() {
  const [showBulkUpload, setShowBulkUpload] = useState<boolean>(false);
  const questions = trpc.getQuestions.useQuery();

  if (questions.isLoading) {
    return (
      <div className="w-full mx-auto grid place-content-center">
        <FullScreenLoader />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-y-3">
      <div className="flex gap-x-4">
        <Link
          href="/admin/questions/add"
          className="flex group px-2 py-1 border border-gray-400 w-fit items-center gap-x-2 rounded-md hover:scale-110 transition-all transform duration-200 ease-out"
        >
          <FolderPlusIcon className="w-5 h-5" />
          Add question
        </Link>
        <button
          onClick={() => setShowBulkUpload(true)}
          className="flex group px-2 py-1 border border-gray-400 w-fit items-center gap-x-2 rounded-md hover:scale-110 transition-all transform duration-200 ease-out"
        >
          <FolderPlusIcon className="w-5 h-5" />
          Add bulk question with JSON
        </button>
      </div>
      {questions.data?.map((question) => (
        <div
          key={question.id}
          className="border-2 border-gray-200 rounded-md p-4 flex"
        >
          <h3 className="text-lg font-bold">{question.title}</h3>
          <Link
            href={`/admin/questions/edit/${question.id}`}
            className="text-sm flex group px-2 py-1 border border-gray-400 w-fit items-center gap-x-2 rounded-md ml-auto hover:scale-110 transition-all transform duration-200 ease-out"
          >
            <PencilIcon className="w-5 h-5" /> Edit
          </Link>
        </div>
      ))}
      {showBulkUpload && (
        <BulkUploadModal
          open={showBulkUpload}
          closeModal={() => setShowBulkUpload(false)}
        />
      )}
    </div>
  );
}
