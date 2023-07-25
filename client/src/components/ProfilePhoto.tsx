import * as React from "react";

export interface IProfilePhotoProps {
  img: string;
  className: string;
  fontSize: string;
  alt:string
}

export default function ProfilePhoto({ img ,fontSize, className, alt}: IProfilePhotoProps) {
  return (
    <>
      {img ? (
        <img className={className?className:"w-9 h-9 rounded-full border"} src={img} alt={alt||"profile"} />
      ) : (
        <span
          style={{
            fontSize: fontSize,
          }}
          className="material-icons-outlined"
        >
          account_circle
        </span>
      )}
    </>
  );
}
