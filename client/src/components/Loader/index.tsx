import * as React from "react";

export interface ILoaderProps {
  size: "small" | "default" | "large";
  className?: string;
}

export default function Loader({ size, className }: ILoaderProps) {
  const fontSize =
    size === "small" ? "16px" : size === "large" ? "36px" : "24px";
  return (
    <div
      className={
        className
          ? "flex justify-center items-center text-neutral-50 " + className
          : "flex justify-center items-center text-neutral-50 "
      }
    >
      <span
        style={{
          fontSize: fontSize,
        }}
        className="material-icons-outlined animate-spin"
      >
        hourglass_empty
      </span>
    </div>
  );
}
