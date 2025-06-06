'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface WordViewHeaderProps {
  userRole?: string;
}

export default function WordViewHeader({ userRole }: WordViewHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        {userRole === 'admin' ? 'All Word Submissions' : 'My Word Submissions'}
      </h1>
      <Button asChild>
        <Link href="/word/submit">Submit New Word</Link>
      </Button>
    </div>
  );
}
