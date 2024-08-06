import React from "react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <nav className="fixed z-10 w-full top-0 left-0 mb-7 bg-gray-200 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap justify-evenly items-center  mx-auto p-4">
        <a
          href="/"
          className="flex items-center self-center space-x-3 rtl:space-x-reverse"
        >
          <span className=" self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Feedback CV
          </span>
        </a>
        <div className="self-end">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
