import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/auth";

export interface IProfileDropDownProps {
  minimizeDropDown: () => void;
}

export default function ProfileDropDown({
  minimizeDropDown,
}: IProfileDropDownProps) {
  const auth = useAppSelector((state) => state.auth);
  const history = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div
      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
      id="profile_dropdown"
    >
      <div className="py-1" role="none">
        {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
        <div
          className="text-gray-700 block px-4 py-1 text-base cursor-pointer	"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-0"
          onClick={() => {
            minimizeDropDown();
            history("/profile");
          }}
        >
          {auth.fullname}
        </div>
        <div
          className="text-gray-500 block px-4 text-sm"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-1"
          onClick={() => {
            minimizeDropDown();
          }}
        >
          @{auth.username}
        </div>
        <button
          onClick={(e) => {
            //e.preventDefault();
            toast.warn("Logging out!!!", {
              pauseOnHover: false,
              draggable: false,
              closeOnClick: false,
              //isLoading : true
            });
            minimizeDropDown();
            dispatch(logout(true));
            setTimeout(() => {
              history("/auth/signin");
            }, 3000);
          }}
          className="text-gray-700 block w-full px-4 py-2 text-left text-base"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-3"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
