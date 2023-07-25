import axios from "axios";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackArrowButton from "../../../../components/BackArrowButton";
import Loader from "../../../../components/Loader";
import { errorHandle } from "../../../../services/errorHandle";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { LoadingFalse, LoadingTrue } from "../../../../store/slices/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useFetchPaginate } from "../../../../Hooks/useFetchPaginate";
import InfiniteScroll from "react-infinite-scroll-component";
import { logout } from "../../../../store/slices/auth";
import { checkError } from "../../../../components/errorLogout";

dayjs.extend(relativeTime);

export interface ICommentListProps {}

interface commentFunc {
  focusInputField: (oldCommentorName: string, oldCommentor: string) => void;
}

interface comment extends commentFunc {
  description: string;
  username: string;
  _id: string;
  img: string;
  commentor: string;
  createdAt: string;
  commentsId: string;
  replyCount: number;
}

export const CommentEl = ({
  replyCount,
  commentsId,
  createdAt,
  commentor,
  description,
  username,
  img,
  _id,
  focusInputField,
}: comment) => {
  const history = useNavigate();
  const [ReplyList, setReplyList] = React.useState<comment[]>([]);
  const [ViewReply, setViewReply] = React.useState<boolean>(false);
  const [PageNumber, setPageNumber] = React.useState<number>(1);
  const [loadingReplies, setloadingReplies] = React.useState<boolean>(false);
  interface parentProps {
    children?: React.ReactNode;
    className?: string;
  }
  const dispatch = useAppDispatch();

  const RedirectElement = ({ children, className }: parentProps) => (
    <div
      className={className ? className : ""}
      role={"button"}
      onClick={() => {
        history(`/profile/${commentor}`);
      }}
    >
      {children}
    </div>
  );

  const getReplies = async (page: number) => {
    try {
      setViewReply(true);
      setloadingReplies(true);
      const body = JSON.stringify({
        page,
        memoriesCommentsId: _id,
      });
      let res = await axios.post("/app/comments/get-replies", body);
      if (res.status === 200) {
        setloadingReplies(false);
        if (res.data.length > 0) {
          let data = ReplyList;
          let arr = [...data, ...res.data];
          setReplyList(arr);
          setPageNumber(PageNumber + 1);
        }
      } else {
        setloadingReplies(false);
        toast.error("Couldn't find entry...");
      }
    } catch (err) {
      setloadingReplies(false);
            checkError(dispatch,err,logout,history);
    }
  };
  return (
    <>
      <div className="flex mt-3">
        <RedirectElement
          className="min-w-[2rem]"
          children={
            img ? (
              <img
                className="w-8 h-8 rounded-full border"
                src={img}
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
            )
          }
        />
        <div className="pl-5">
          <div className="flex items-center">
            <RedirectElement
              children={
                <>
                  <span className="font-medium font-sans text-slate-800">
                    {username || "username"}
                  </span>
                </>
              }
            />
            <span className="pl-3 text-xs">{dayjs().to(dayjs(createdAt))}</span>
            <div
              className="font-medium cursor-pointer pl-5"
              onClick={() => {
                focusInputField(username, commentor);
              }}
            >
              reply
            </div>
          </div>
          <p className="text-sm">{description}</p>
          {replyCount > 0 ? (
            ViewReply === true ? (
              <>
                {ReplyList.map((item, i) => (
                  <CommentEl
                    key={i}
                    _id={item._id}
                    focusInputField={focusInputField}
                    img={item.img}
                    username={item.username}
                    commentor={item.commentor}
                    commentsId={item.commentsId}
                    description={item.description}
                    replyCount={0}
                    createdAt={item.createdAt}
                  />
                ))}
                {loadingReplies ? (
                  <div className="text-center my-5">Loading...</div>
                ) : (
                  <div
                    role={"button"}
                    className="cursor-pointer text-center my-5"
                    onClick={() => getReplies(PageNumber)}
                  >
                    _____Load more...{" "}
                  </div>
                )}
              </>
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => {
                  getReplies(PageNumber);
                }}
              >
                _________view replies
              </div>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default function CommentList() {
  const { memory_id } = useParams();

  const [Comments, setComments] = React.useState<comment[]>([]);
  const [Comment, setComment] = React.useState<string>("");
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const [loadFetch, setloadFetch] = React.useState<number>(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [CommentReply, setCommentReply] = React.useState<{
    reply: boolean;
    commentId: string;
    oldCommentor: string;
    oldCommentorName: string;
  }>({ reply: false, commentId: "", oldCommentor: "", oldCommentorName: "" });
  const [PageNumber, setPageNumber] = React.useState<number>(1);
  const { loading, error, list, hasMore } = useFetchPaginate<comment>(
    "/app/comments/get-comments-by-memoriesid",
    PageNumber,
    { limit: 10, memoriesId: memory_id }, loadFetch
  );

  React.useEffect(() => {
    setComments([...list]);
  }, [list]);

  const createComment = async () => {
    try {
      dispatch(LoadingTrue(true));
      const body = JSON.stringify({
        memoriesId: memory_id,
        reply: CommentReply.reply,
        description: Comment,
        commentId: CommentReply.commentId,
        oldCommentor: CommentReply.oldCommentor,
        oldCommentorName: CommentReply.oldCommentorName,
      });
      let res = await axios.post("/app/comments/save-comments", body);
      if (res.status === 200) {
        setComment("");
        setCommentReply({
          reply: false,
          commentId: "",
          oldCommentor: "",
          oldCommentorName: "",
        });
        dispatch(LoadingFalse(true));
        //debugger
        setPageNumber(1);
        setloadFetch(loadFetch + 1);
        //getComments(1);
      } else {
        dispatch(LoadingFalse(true));
        toast.error("Couldn't find entry...");
      }
    } catch (err) {
      dispatch(LoadingFalse(true));
            checkError(dispatch,err,logout,history);
    }
  };

  const onKeyDown = (params: React.KeyboardEvent) => {
    if (params.key === "Enter" && Comment && Comment.length > 0) {
      createComment();
    }
  };

  const onChange = (params: React.ChangeEvent) => {
    let value = (params.target as HTMLInputElement).value;
    setComment(value);
  };

  return (
    <div className="p-5">
      <div className="flex items-center">
        <BackArrowButton className="cursor-pointer pr-5 " url={-1} />
        <h4 className="text-xl">Comments</h4>
      </div>
      <div className="">
        {Comments.length === 0 && loading === true ? (
          <div className="h-[calc(100vh-12rem)]">
            <Loader size="large" className="text-slate-900 py-44" />
          </div>
        ) : Comments && Comments.length > 0 ? (
          <div
            id="comment_body"
            className="h-[calc(100vh-16.5rem)] md:h-[calc(100vh-13rem)] mt-5 overflow-y-auto  scrollbar  px-5"
          >
            <InfiniteScroll
              scrollableTarget={"comment_body"}
              dataLength={Comments.length} //This is important field to render the next data
              next={() => {
                setPageNumber(PageNumber + 1);
                //getComments(PageNumber + 1);
              }}
              hasMore={hasMore}
              loader={
                <div className="text-center my-5" key={0}>
                  Loading ...
                </div>
              }
            >
              {Comments.map((x, i) => (
                <div key={i} className={Comments.length === i+1 ? "mb-5" : ""}>
                  <CommentEl
                    replyCount={x.replyCount}
                    commentsId={x.commentsId}
                    createdAt={x.createdAt}
                    commentor={x.commentor}
                    _id={x._id}
                    key={x._id}
                    description={x.description}
                    username={x.username}
                    img={x.img}
                    focusInputField={(oldCommentorName, oldCommentor) => {
                      setCommentReply({
                        reply: true,
                        commentId: x.commentsId,
                        oldCommentor,
                        oldCommentorName,
                      });
                      setComment(`@${oldCommentorName} `);
                      inputRef.current?.focus();
                    }}
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        ) : (
          <div className="h-[calc(100vh-11.5rem)]">
            <div className="flex justify-center items-center pt-32">
              <span className="material-icons-outlined">search</span>no comments
            </div>
          </div>
        )}
      </div>
      <div className="">
        <div className="flex justify-between items-center">
          <input
            type="text"
            id="small-input"
            className="block w-full p-2 text-gray-900 border border-gray-900 rounded-lg  sm:text-xs "
            onKeyDown={onKeyDown}
            value={Comment}
            onChange={onChange}
            autoFocus
            ref={inputRef}
          />
          <span
            style={{
              fontSize: "36px",
            }}
            onClick={() => createComment()}
            className="cursor-pointer pl-3 material-icons-outlined"
          >
            send
          </span>
        </div>
      </div>
    </div>
  );
}
