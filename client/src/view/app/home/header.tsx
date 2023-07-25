import * as React from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../components/InputField";
import { useAppSelector } from "../../../store/hooks";
import ProfileDropDown from "./profileDropDown";

export interface IHeaderProps {}

export default function Header(props: IHeaderProps) {
  const [OpenDropDown, setOpenDropDown] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const history = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  React.useEffect(() => {
    const { current } = ref;
    function handleClickOutside(event: any) {
      let dropdown = document.getElementById("profile_dropdown");

      if (dropdown && dropdown.contains(event.target)) {
        return;
      }
      if (current && !current.contains(event.target)) {
        setOpenDropDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <>
        <div className=" h-32 md:h-20 bg-slate-200 mx-auto px-4 sm:px-6" id="header">
          <div className="md:flex items-center justify-between border-gray-100 pt-3">
            <div className="md:flex justify-start hidden">
              <a href="/">
                <span className="sr-only">Memories</span>
                <span
                  style={{
                    fontSize: "36px",
                  }}
                  className="text-4xl	 material-icons-outlined"
                >
                  memory
                </span>{" "}
              </a>
            </div>
            <div className="pb-3 md:pb-0">
              <h1
                role={"button"}
                onClick={() => history("/")}
                className="text-4xl font-bold text-center tracking-widest	font-mono	"
              >
                Memories
              </h1>
            </div>
            <div className="items-center justify-between flex">
              <div
                role={"button"}
                onClick={() => history("/find-memorist")}
                className="md:inline-flex items-center justify-center py-2"
              >
                <span
                  style={{
                    fontSize: "36px",
                  }}
                  className="material-icons-outlined"
                >
                  person_search
                </span>
              </div>
              <div
                role={"button"}
                onClick={() => history("/new-memory")}
                className="md:inline-flex items-center justify-center py-2 md:px-3"
              >
                <span
                  style={{
                    fontSize: "36px",
                  }}
                  className="material-icons-outlined"
                >
                  add_a_photo
                </span>
              </div>
              <div
                id="menu-button"
                role={"button"}
                //data-dropdown-toggle="dropdownInformation"
                onClick={() => setOpenDropDown(!OpenDropDown)}
                //href="#"
                className="inline-flex items-center justify-center"
                ref={ref}
              >
                {auth.profileImg ? (
                  <img
                    className="w-9 h-9 rounded-full border"
                    src={auth.profileImg}
                    alt="profile"
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "36px",
                    }}
                    className="material-icons-outlined"
                  >
                    account_circle
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      {OpenDropDown ? (
        <ProfileDropDown minimizeDropDown={() => setOpenDropDown(false)} />
      ) : (
        ""
      )}
    </>
  );
}
