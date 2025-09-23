"use client";

import Image from "next/image";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);

  useEffect(() => {
    if (user) checkUser();
  }, [user]);

  const checkUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });
    console.log(result);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start 
      bg-gradient-to-tr from-pink-200 via-purple-200 via-blue-200 to-green-200 p-6">
      
      {/* Navbar */}
      <div className="w-full flex justify-between items-center py-4 px-6 bg-white bg-opacity-60 backdrop-blur-md shadow-md rounded-md">
        {/* Logo on left */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold">Notewise</span>
        </div>

        {/* User Avatar on right */}
        <div className="flex items-center">
          <UserButton />
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-20 space-y-4 px-4">
        <h1 className="text-5xl font-extrabold text-gray-900">NOTEWISE</h1>
        <p className="text-gray-700 text-lg max-w-xl">
          Elevate your note-taking experience with our AI-powered app. Seamlessly extract key insights, summaries, and annotations from any 
          PDF with just a few clicks.
        </p>
        <Link href="/dashboard">
          <Button className="mt-4 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
