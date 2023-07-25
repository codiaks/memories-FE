import * as React from "react";

export interface IInputFieldProps {
  name?: string;
  value?: string;
  type: "text" | "password" | "email" | "number";
  required?: boolean;
  id?: string;
  label?: boolean;
  labelText?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler;
  className?: string;
  children: React.ReactNode;
  childPosition?: "pre" | "post";
  inputClass?: string;
}

export default function InputField({
  className,
  name,
  value,
  type,
  required,
  id,
  label,
  labelText,
  placeholder,
  children,
  childPosition,
  onChange,
  inputClass,
}: IInputFieldProps) {
  const inputClassName = inputClass ? inputClass : "";
  return (
    <div className={children ? className + " relative" : className}>
      {label ? (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {labelText}
        </label>
      ) : (
        ""
      )}
      {/* {children ? children : ""} */}
      {children ? (
        childPosition === "pre" ? (
          <>
            {children}
            <input
              type={type}
              id={id}
              className={` bg-gray-50 border border-gray-300 text-gray-900 text-sm 
              rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ` + inputClassName}
              placeholder={placeholder}
              required={required}
              value={value}
              onChange={onChange}
              name={name}
              prefix={"asd"}
            />
          </>
        ) : (
          <>
            <input
              type={type}
              id={id}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm 
              rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ` + inputClassName}
              placeholder={placeholder}
              required={required}
              value={value}
              onChange={onChange}
              name={name}
              prefix={"asd"}
            />
            {children}
          </>
        )
      ) : (
        <input
          type={type}
          id={id}
          className={`bg-gray-50 border border-gray-300 text-gray-900 
          text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
          block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
          dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
          dark:focus:border-blue-500 ` + inputClassName}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          name={name}
          prefix={"asd"}
        />
      )}
    </div>
  );
}
