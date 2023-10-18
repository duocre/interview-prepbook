import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon,
} from '@heroicons/react/20/solid';
import Button from './ui/Button';
import { base64EncodeFile, cn } from '@/lib/utils';
import { trpc } from '@/app/_trpc/client';

type Props = {
  open: boolean;
  closeModal: () => void;
};

export default function BulkUploadModal({ open, closeModal }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const addBulkQuestion = trpc.addBulkQuestion.useMutation({
    onSettled: () => {},
    onSuccess: () => {},
    onError: (error) => {
      console.log(error.data);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const base64Data = await base64EncodeFile(file as File);
      addBulkQuestion.mutate(base64Data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Question JSON
                    </label>
                    <div className="my-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <DocumentTextIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        {!!file && (
                          <p className="mt-1 text-sm text-gray-500">
                            {file.name}
                          </p>
                        )}
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          Only JSON files are accepted
                        </p>
                      </div>
                    </div>
                    {!!file && (
                      <Button
                        onClick={handleFileUpload}
                        className="inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold w-fit"
                        type="submit"
                      >
                        Save
                        <CloudArrowUpIcon
                          className={cn('-mr-0.5 h-5 w-5 ')}
                          aria-hidden="true"
                        />
                      </Button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
