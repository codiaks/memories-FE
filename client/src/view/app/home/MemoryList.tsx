import axios from "axios";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkError } from "../../../components/errorLogout";
import { errorHandle } from "../../../services/errorHandle";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/auth";

interface comment {
  description: string;
  createdAt: string;
  commentor: string;
  _id: string;
  commentorName: string;
}
export interface memory {
  username: string;
  title?: string;
  description?: string;
  img_url?: string;
  datetime?: string;
  likes?: string[];
  _id: string;
  commentCount: number;
  comments: comment[];
  profileImage: string;
  userid: string;
}
export interface IMemoryListProps {
  Memories: memory[];
  className: string;
}

interface SingleMemId {
  data: memory;
  dataStatus: "available" | "fetch";
}

export const SingleMemory = ({ data, dataStatus }: SingleMemId) => {
  const auth = useAppSelector((state) => state.auth);
  const history = useNavigate();
  const [ViewMore, setViewMore] = React.useState(false);
  const dispatch = useAppDispatch();
  const [SingleMem, setSingleMem] = React.useState<memory>();
  React.useEffect(() => {
    if (dataStatus === "available") {
      setSingleMem({ ...data });
    } else {
      getMemory();
    }
  }, []);

  const getMemory = async () => {
    try {
      const body = JSON.stringify({
        _id: data?._id,
      });
      let res = await axios.post("/app/memories/get-memory-by-id", body);
      if (res.status === 200) {
        setSingleMem(res.data);
      } else {
        toast.error("Couldn't find entry...");
      }
    } catch (err) {
            checkError(dispatch,err,logout,history);
    }
  };

  const likeMemory = async () => {
    try {
      const body = JSON.stringify({
        memoriesId: SingleMem?._id,
      });
      let res = await axios.post("/app/memories/like", body);
      if (res.status === 200) {
        getMemory();
      } else {
        toast.error("Couldn't find entry...");
      }
    } catch (err) {
            checkError(dispatch,err,logout,history);
    }
  };

  return (
    <>
      <div className="text-base text-slate-500 flex justify-between items-center ">
        <div
          className="flex justify-start items-center mb-2"
          role={"button"}
          onClick={() => {
            history(`/profile/${SingleMem?.userid}`);
          }}
        >
          {SingleMem?.profileImage ? (
            <img
              className="w-8 h-8 rounded-full border"
              src={SingleMem?.profileImage}
              alt="profile"
            />
          ) : (
            <span
              style={{
                fontSize: "34px",
              }}
              className="material-icons-outlined"
            >
              account_circle
            </span>
          )}
          <span className="pl-3 font-medium font-sans text-slate-800">
            {SingleMem?.username || "username"}
          </span>
        </div>
        {SingleMem?.userid === auth.user_id ? (
          <span
            onClick={() => history(`/edit-memory/${SingleMem?._id}`)}
            className="cursor-pointer material-icons-outlined"
          >
            edit
          </span>
        ) : null}
      </div>
      <h4 className="text-xl font-semibold">{SingleMem?.title || ""}</h4>

      <img
        src={SingleMem?.img_url}
        className="max-h-80 mx-auto my-3 rounded-lg cursor-pointer"
        onDoubleClick={() => {
          likeMemory();
        }}
      />
      <p className="text-slate-700">
        {" "}
        {SingleMem?.description && SingleMem?.description.length > 210 ? (
          ViewMore ? (
            SingleMem?.description
          ) : (
            <>
              {SingleMem?.description?.slice(0, 210)}
              <span
                onClick={() => setViewMore(true)}
                className="text-blue-600 cursor-pointer"
              >
                ...view more
              </span>
            </>
          )
        ) : (
          SingleMem?.description
        )}
      </p>
      <div className="flex justify-start items-center mt-5  ">
        <div>
          <span
            style={{
              fontSize: "32px",
            }}
            className={
              SingleMem?.likes?.includes(auth.user_id)
                ? "material-icons-outlined cursor-pointer text-fuchsia-500"
                : "material-icons-outlined cursor-pointer"
            }
            onClick={likeMemory}
          >
            emoji_emotions
          </span>
        </div>
        <div className="mb-1 px-3 truncate">
          {SingleMem?.likes && SingleMem?.likes.length > 0
            ? SingleMem?.likes?.length === 1
              ? `${SingleMem?.likes?.length} like`
              : `${SingleMem?.likes?.length} likes`
            : ""}
        </div>
        <div>
          <span
            style={{
              fontSize: "32px",
            }}
            className="material-icons-outlined cursor-pointer"
            onClick={() => history(`/comment/${SingleMem?._id}`)}
          >
            chat_bubble_outline
          </span>
        </div>
        {SingleMem && SingleMem.commentCount > 0 ? (
          <div
            className="mb-2 px-3 truncate cursor-pointer"
            onClick={() => history(`/comment/${SingleMem?._id}`)}
          >
            view all {SingleMem?.commentCount} comments
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        {SingleMem &&
          SingleMem.comments &&
          SingleMem.comments.map((item, index) => (
            <div className="truncate text-sm p-1 px-3" key={index}>
              <span className="text-black font-semibold	pr-3">
                {item.commentorName}
              </span>
              <span className="text-slate-900 ">{item.description}</span>
            </div>
          ))}
      </div>
    </>
  );
};

export default function MemoryList({ Memories, className }: IMemoryListProps) {
  return (
    <div className={className + " "}>
      {Memories.map((x, i) => (
        <div className="py-3" id={x._id} key={i}>
          <SingleMemory data={x} dataStatus="fetch" />
        </div>
      ))}
      <div>No more Memories to show~~~</div>
    </div>
  );
}
