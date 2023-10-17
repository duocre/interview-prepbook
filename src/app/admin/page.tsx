'use client';
import React from 'react';
import { trpc } from '../_trpc/client';
import FullScreenLoader from '@/components/FullScreenLoader';

export default function Dashboard() {
  const totalQuestion = trpc.totalQuestion.useQuery();

  if (totalQuestion.isLoading) {
    return (
      <div className="w-full mx-auto grid place-content-center">
        <FullScreenLoader />
      </div>
    );
  }
  return (
    <div>
      <div className="w-fit p-4 rounded-md border border-gray-600">
        Total questions: {totalQuestion.data}
      </div>
    </div>
  );
}
