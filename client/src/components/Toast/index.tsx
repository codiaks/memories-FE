import * as React from "react";

export interface IToastProps {
    content : React.ReactNode | string
}

export default function Toast({content}: IToastProps) {
  return (
    <div
      id="toast-top-left"
      className="flex absolute top-5 right-5 items-center p-4 
      space-x-4 w-full max-w-xs text-gray-500 bg-white 
      rounded-lg divide-x divide-gray-200 shadow dark:text-gray-400 
      dark:divide-gray-700 space-x dark:bg-gray-800"
      role="alert"
    >
      <div className="text-sm font-normal">{content}</div>
    </div>
  );
}
