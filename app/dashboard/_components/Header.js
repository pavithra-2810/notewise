import React from 'react';
import { UserButton } from '@clerk/nextjs';

function Header() {
  return (
    <>
      <div className="flex justify-end p-5 shadow-md bg-white sticky top-0 z-10">
        <UserButton />
      </div>
      <hr className="border-t border-gray-200" />
    </>
  );
}

export default Header;
