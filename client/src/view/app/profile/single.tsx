import axios from "axios";
import * as React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackArrowButton from "../../../components/BackArrowButton";
import { checkError } from "../../../components/errorLogout";
import Loader from "../../../components/Loader";
import { FOREIGN } from "../../../constants/custom_strings";
import { errorHandle } from "../../../services/errorHandle";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/auth";
import { LoadingFalse, LoadingTrue } from "../../../store/slices/loading";
import MemoryList, { memory, SingleMemory } from "../home/MemoryList";

export interface IUserSingleMemoryProps {}

export default function UserSingleMemory(props: IUserSingleMemoryProps) {
  const { memory_id, user_id } = useParams();
  const [Memories, setMemories] = React.useState<memory[]>([]);
  const dispatch = useAppDispatch();
  const Loading = useAppSelector((state) => state.Loading);

  React.useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    try {
      dispatch(LoadingTrue(true));
      let url =
        user_id !== undefined && user_id !== "" && user_id !== null && user_id !== "undefined"
          ? `/app/memories/get-memories-by-user/${user_id}`
          : "/app/memories/get-memories-by-user";
      let res = await axios.get(url);
      if (res.status === 200) {
        setMemories(res.data);

        const scroll = () => {
          const section = document.getElementById(`${memory_id}`);
          section?.scrollIntoView({ behavior: "smooth", block: "start" });
        };
        setTimeout(() => {
          scroll();
        }, 500);
        dispatch(LoadingFalse(true));
      } else {
        toast.error("Couldn't find entry...");
        dispatch(LoadingFalse(true));
      }
    } catch (err) {
            checkError(dispatch,err,logout,history);
      dispatch(LoadingFalse(true));
    }
  };
  
  return (
    <>
      {Loading.loading ? (
        <Loader size="large" />
      ) : (
        <>
          <div className="flex items-center  bg-white  p-5 ">
            {/* fixed border-4 md:w-7/12 lg:w-[45%] w-full*/}
            <BackArrowButton className="cursor-pointer pr-5 " url={-1} />
            <h4 className="text-xl">Memories</h4>
          </div>
          <div className="overflow-auto h-[calc(100vh-12.5rem)] md:h-[calc(100vh-9.5rem)] scrollbar px-10">
            <MemoryList className="" Memories={Memories} />
          </div>
        </>
      )}
    </>
  );
}
