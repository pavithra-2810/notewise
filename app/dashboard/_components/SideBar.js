"use client";

import Link from "next/link"; 
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Layout, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import UploadPdfDialog from "./UploadPdfDialog";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";


function SideBar() {
  const { user } = useUser();
  const path = usePathname();

  const GetUserInfo=useQuery(api.user.GetUserInfo,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  })

  console.log(GetUserInfo)

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div className="bg-white shadow-lg h-screen p-7 relative flex flex-col justify-between border-r border-gray-200">
      {/* Logo */}
      <div>
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
       

        {/* Upload + Navigation */}
        <div className="mt-10">
          {/* Upload Button with extra margin */}
          <div className="mb-6">
            <UploadPdfDialog isMaxFile={fileList?.length >= 5 && !GetUserInfo?.upgrade}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                + Upload PDF
              </Button>
            </UploadPdfDialog>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            {/* Workspace */}
            <Link href={"/dashboard"}>
              <div
                className={`flex gap-2 items-center p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition ${
                  path === "/dashboard" && "bg-slate-200"
                }`}
              >
                <Layout className="text-blue-600" />
                <h2 className="text-gray-700 font-medium">Workspace</h2>
              </div>
            </Link>

            {/* Upgrade with extra margin */}
            <Link href={"/dashboard/upgrade"}>
              <div
                className={`flex gap-2 items-center p-2 hover:bg-yellow-50 rounded-lg cursor-pointer transition mt-6 ${
                  path === "/dashboard/upgrade" && "bg-slate-200"
                }`}
              >
                <Shield className="text-yellow-500" />
                <h2 className="text-gray-700 font-medium">Upgrade</h2>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      {!GetUserInfo?.upgrade && <div className="w-[90%]">
        <Progress value={(fileList?.length / 5) * 100} />
        <p className="text-sm mt-2 text-gray-600">
          {fileList?.length} out of 5 PDFs uploaded
        </p>
        <p className="text-xs text-gray-400 mt-2 italic">
          Upgrade to upload more PDFs
        </p>
      </div>}
    </div>
  );
}

export default SideBar;
