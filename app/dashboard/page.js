"use client";

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; 

function Dashboard() {
  const { user } = useUser();

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div>
      <div className="text-xl font-semibold text-gray-700 mb-4">
        Welcome to your Dashboard 🚀
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {fileList?.length > 0
          ? fileList.map((file) => (
              <Link
                href={`/workspace/${file.fileId}`}
                key={file.fileId} // ✅ Move key here
              >
                <div className="flex flex-col items-center p-2 border-2 border-gray-700 rounded cursor-pointer hover:scale-105 transition-all">
                  <Image src="/pdf.png" alt="file" width={70} height={70} />
                  <p className="mt-2 text-sm text-gray-700 text-center">
                    {file.fileName}
                  </p>
                </div>
              </Link>
            ))
          : [1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div
                key={item}
                className="bg-slate-200 rounded-md h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Dashboard;
