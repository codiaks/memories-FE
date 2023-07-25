import axios from "axios";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackArrowButton from "../../../components/BackArrowButton";
import { checkError } from "../../../components/errorLogout";
import { errorHandle } from "../../../services/errorHandle";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/auth";
import { LoadingTrue } from "../../../store/slices/loading";

export interface IMemoristProps {}
interface IMemorist {
  username: string;
  _id: string;
}
export default function Memorist(props: IMemoristProps) {
  const history = useNavigate();
  const [searchParam, setSearchParam] = React.useState<string>("");
  const dispatch = useAppDispatch();
  const Loading = useAppSelector((state) => state.Loading);
  const [List, setList] = React.useState<IMemorist[]>([]);
  React.useEffect(() => {}, []);

  const onInputChange = (params: React.ChangeEvent) => {
    const val = (params.target as HTMLInputElement).value;
    setSearchParam(val);
  };

  const onKeyDown = async (params: React.KeyboardEvent) => {
    if (params.key === "Enter" && searchParam && searchParam.length > 0) {
      try {
        let url = `/app/user/search-by-username/${searchParam}`;
        let res = await axios.get(url);
        if (res.status === 200) {
          setList(res.data);
        } else {
          toast.info("Couldn't find entry...");
        }
      } catch (err) {
              checkError(dispatch,err,logout,history);
      }
    }
  };

  return (
    <div className="bg-white p-5 ">
      <div className="flex items-center w-full">
        <BackArrowButton className="cursor-pointer " url={-1} />
        {/* <h2 className="pl-5 text-2xl">Memorists...</h2> */}
        <div className=" pl-5 text-lg bg-transparent text-gray-800 flex-grow">
          <div className=" items-center border-b-2 border-slate-800">
            <input
              className="bg-transparent placeholder:text-slate-800 border-none mr-3 px-2 leading-tight focus:outline-none w-full"
              type="text"
              placeholder="find memorists..."
              onChange={onInputChange}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
      </div>
      <div className="md:h-[calc(100vh-11rem)] h-[calc(100vh-14rem)] mt-5 overflow-y-auto  scrollbar  px-5">
        {List && List.length > 0 ? (
          List.map((item, i) => (
            <div
              className="p-3 my-1 text-base cursor-pointer rounded-lg bg-slate-100 hover:bg-slate-200 hover:shadow-lg"
              key={item._id}
              onClick={() => history(`/profile/${item._id}`)}
            >
              {item.username}
            </div>
          ))
        ) : (
          <div className="text-center mt-5 text-3xl">No User</div>
        )}
      </div>
    </div>
  );
}
