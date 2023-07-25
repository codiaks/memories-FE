import * as React from "react";
import { useNavigate } from "react-router-dom";

export interface IBackArrowButtonProps {
  url: string | number;
  className?: string;
}

export default function BackArrowButton({
  url,
  className,
}: IBackArrowButtonProps) {
  const history = useNavigate();
  return (
    <span
      onClick={() => {
        if (typeof url === "string") {
          history(url);
        } else {
          history(url);
        }
      }}
      className={
        className
          ? className + " material-icons-outlined"
          : "material-icons-outlined"
      }
    >
      arrow_back
    </span>
  );
}
