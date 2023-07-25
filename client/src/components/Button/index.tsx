import * as React from "react";

export interface IButtonProps {
  buttonType?:
    | "primary"
    | "default"
    | "danger"
    | "success"
    | "dark"
    | "light"
    | "yellow"
    | "purple";
  text: string;
  type: "button" | "submit" | "reset";
  className?: string;
  onClick?: React.MouseEventHandler;
  Icon?:React.ReactNode
}

export default function Button({
  buttonType,
  text,
  className,
  type,
  Icon,
  onClick,
}: IButtonProps) {
  const primary =
    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
  const defaultBtn =
    "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";
  const darkBtn =
    "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700";
  const lightBtn =
    "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700";
  const successBtn =
    "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
  const dangerBtn =
    "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";
  const yellowBtn =
    "focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900";
  const purpleBtn =
    "focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900";

  let classN = className + " ";
  switch (buttonType) {
    case "primary":
      classN += primary;
      break;
    case "default":
      classN += defaultBtn;
      break;
    case "danger":
      classN += dangerBtn;
      break;
    case "success":
      classN += successBtn;
      break;
    case "light":
      classN += lightBtn;
      break;
    case "dark":
      classN += darkBtn;
      break;
    case "yellow":
      classN += yellowBtn;
      break;
    case "purple":
      classN += purpleBtn;
      break;

    default:
      classN += defaultBtn;
      break;
  }
  return (
    <button prefix={'Icon'} type={type} className={classN} onClick={onClick}>
      {Icon?Icon:""}
      {text}
    </button>
  );
}
