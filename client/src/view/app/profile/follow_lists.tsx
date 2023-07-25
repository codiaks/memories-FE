import axios from "axios";
import { Buffer } from "buffer";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackArrowButton from "../../../components/BackArrowButton";
import { checkError } from "../../../components/errorLogout";
import Loader from "../../../components/Loader";
import ProfilePhoto from "../../../components/ProfilePhoto";
import { wentWrongMessage } from "../../../constants/custom_strings";
import { errorHandle } from "../../../services/errorHandle";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/auth";
import { LoadingFalse, LoadingTrue } from "../../../store/slices/loading";

export interface IFollowListsProps {}

interface followList {
  follow_back: string[];
  followers: string[];
  profile_img: string;
  userId: string;
  username: string;
}

type follow = "following" | "followers";

export default function FollowLists(props: IFollowListsProps) {
  const params = useParams();
  const [Active, setActive] = React.useState<follow>(
    params?.default || "following"
  );
  const [User, setUser] = React.useState<string>();
  const [UserList, setUserList] = React.useState<followList[]>([]);
  const { loading } = useAppSelector((state) => state.Loading);
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const auth = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    let bufferObj3 = params.username && Buffer.from(params.username, "base64");
    let string1 = bufferObj3 && bufferObj3.toString("utf8");
    setUser(string1);
    getUserList(Active);
  }, []);

  const getUserList = async (active: string) => {
    try {
      let url = `/app/user/listing?userId=${params.user_id}&term=${
        active || Active
      }`;
      dispatch(LoadingTrue(true));
      let res = await axios.get(url);
      if (res.status === 200) {
        let data = res.data;
        data.sort((a: followList, b: followList) => {
          return b.followers.includes(auth.user_id)
            ? -1
            : -a.followers.includes(auth.user_id);
        });
        let uu = data.findIndex((x: followList) => x.userId === auth.user_id);
        if (uu !== -1) {
          let el = data[uu];
          data.splice(uu, 1);
          data.unshift(el);
        }
        data && typeof data !== "string" ? setUserList(data) : setUserList([]);
        dispatch(LoadingFalse(true));
      } else {
        dispatch(LoadingFalse(true));
        toast.error("Couldn't find entry...");
      }
    } catch (err) {
            checkError(dispatch,err,logout,history);
      dispatch(LoadingFalse(true));
    }
  };

  const manageFollowRequests = async (follow: number, user: string) => {
    try {
      //debugger
      const body = JSON.stringify({
        id: user,
      });
      let url = follow === 3 ? "/app/user/remove" : "/app/user/follow";
      let res = await axios.post(url, body);
      if (res.status === 200) {
        let array = UserList;
        let ind = array.findIndex((x) => x.userId === user);
        let el = array[ind];
        let followers = el.followers;
        let follow_back = el.follow_back;
        switch (follow) {
          case 1: {
            //unfollow
            /**
             * when the user unfollows another person the id of user should be removed from the followers
             * list of the person
             */
            let index = followers.findIndex((x) => x === auth.user_id);
            followers.splice(index, 1);
            break;
          }
          case 2: {
            //follow
            followers.push(auth.user_id);
            break;
          }
          case 3: {
            //remove from followers
            array.splice(ind, 1);
            break;
          }
          default:
            break;
        }
        if (array[ind]) {
          array[ind].follow_back = follow_back;
          array[ind].followers = followers;
        }
        setUserList([...array]);
      } else {
        toast.warn(wentWrongMessage);
      }
    } catch (err) {
            checkError(dispatch,err,logout,history);
    }
  };

  return (
    <>
      <div className="p-5">
        <div className="flex items-center">
          <BackArrowButton className="cursor-pointer pr-5 " url={-1} />
          <h4 className="text-xl">{User}</h4>
        </div>
        <div className="mb-4 border-b border-gray-200 ">
          <ul
            className="grid grid-cols-2 -mb-px text-sm font-medium text-center"
            id="myTab"
            data-tabs-toggle="#myTabContent"
            role="tablist"
          >
            {["following", "followers"].map((item, i) => (
              <li
                onClick={() => {
                  setActive(item);
                  getUserList(item);
                }}
                className="mr-2"
                role="presentation"
                key={i}
              >
                <button
                  className={
                    Active === item
                      ? "inline-block p-4 rounded-t-lg hover:font-semibold	 border-blue-600 border-b-2"
                      : "inline-block p-4 rounded-t-lg text-gray-800 hover:text-gray-600 hover:border-blue-300 hover:border-b-2"
                  }
                  id={`${item}-tab`}
                  data-tabs-target={`#${item}`}
                  type="button"
                  role="tab"
                  aria-controls={`${item}`}
                  aria-selected="false"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div id="myTabContent" className="h-[calc(100vh-17rem)] md:h-[calc(100vh-14rem)] scrollbar">
          <div
            className="p-4 rounded-lg bg-gray-50"
            id="followe"
            role="tabpanel"
            aria-labelledby="follow-tab"
          >
            {loading ? (
              <Loader size="small" className="text-slate-700" />
            ) : UserList.length > 0 ? (
              UserList.map((item) => (
                <div
                  className="p-2 grid grid-cols-2 hover:shadow-lg"
                  key={item.userId}
                >
                  <div
                    className="flex justify-start items-center cursor-pointer"
                    onClick={() => history(`/profile/${item.userId}`)}
                  >
                    <ProfilePhoto
                      fontSize="32px"
                      alt={"Profile Phot"}
                      img={item.profile_img}
                      className="w-8 h-8 rounded-full border"
                    />
                    <span className="pl-3">{item.username}</span>
                  </div>
                  {item.userId === auth.user_id ? (
                    ""
                  ) : (
                    <div className="w-full place-items-center px-5">
                      {Active === "followers" ? (
                        params.user_id === auth.user_id ? (
                          <button
                            type="button"
                            className="w-full text-slate-700 border border-slate-700 hover:bg-slate-400
                         hover:text-white focus:outline-none 
                          font-medium rounded-lg text-base py-1 px-5 text-center"
                            onClick={() => manageFollowRequests(3, item.userId)}
                          >
                            Remove
                          </button>
                        ) : item.followers.includes(auth.user_id) ? (
                          <button
                            type="button"
                            className="w-full text-slate-700 border border-slate-700 
                            hover:bg-slate-700
                            hover:text-white focus:outline-none 
                            font-medium rounded-lg text-base py-1 px-5 text-center bg-slate-300"
                            onClick={() => manageFollowRequests(1, item.userId)}
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="w-full text-slate-700 border border-slate-700 hover:bg-blue-700
                           hover:text-white focus:outline-none 
                            font-medium rounded-lg text-base py-1 px-5 text-center"
                            onClick={() => manageFollowRequests(2, item.userId)}
                          >
                            Follow
                          </button>
                        )
                      ) : item.followers.includes(auth.user_id) ? (
                        <button
                          type="button"
                          className="w-full text-slate-700 border border-slate-700 
                            hover:bg-slate-700
                            hover:text-white focus:outline-none 
                            font-medium rounded-lg text-base py-1 px-5 text-center bg-slate-300"
                          onClick={() => manageFollowRequests(1, item.userId)}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-slate-700 border border-slate-700 hover:bg-blue-700
                           hover:text-white focus:outline-none 
                            font-medium rounded-lg text-base py-1 px-5 text-center"
                          onClick={() => manageFollowRequests(2, item.userId)}
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              "No Data"
            )}
          </div>
        </div>
      </div>
    </>
  );
}
