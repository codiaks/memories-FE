import axios from "axios";
import { Buffer } from "buffer";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackArrowButton from "../../../components/BackArrowButton";
import { checkError } from "../../../components/errorLogout";
import Loader from "../../../components/Loader";
import {
  FOREIGN,
  SELF,
  wentWrongMessage,
} from "../../../constants/custom_strings";
import { errorHandle } from "../../../services/errorHandle";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout, updateProfile } from "../../../store/slices/auth";
import { LoadingFalse, LoadingTrue } from "../../../store/slices/loading";
import { memory } from "../home/MemoryList";

export interface IProfileProps {}

export interface IProfile {
  followers: Array<string>;
  follow_back: Array<string>;
  username: string;
  fullname: string;
  profileImage: string;
  _id: string;
}

export default function Profile(props: IProfileProps) {
  const [Memories, setMemories] = React.useState<memory[]>([]);
  const [UserProfile, setUserProfile] = React.useState<IProfile>();
  const auth = useAppSelector((state) => state.auth);
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const Loading = useAppSelector((state) => state.Loading);

  const { user_id } = useParams();
  const [ImgUrl, setImgUrl] = React.useState<string>("");
  const ProfileType = user_id
    ? user_id === auth.user_id
      ? SELF
      : FOREIGN
    : SELF;

  const [File, setFile] = React.useState();
  React.useEffect(() => {
    if (
      (user_id === null || user_id === undefined || user_id === "") &&
      ProfileType === FOREIGN
    ) {
      toast.warn("Inavlid user", {
        autoClose: 2000,
      });
      setTimeout(() => {
        history(-1);
      }, 2000);
    } else {
      getUserProfile();
      getPosts();
    }
  }, [user_id]);

  const getUserProfile = async () => {
    try {
      dispatch(LoadingTrue(true));

      let url =
        ProfileType === FOREIGN
          ? `/app/user/profile/${user_id}`
          : "/app/user/myprofile";
      let res = await axios.get(url);
      if (res.status === 200) {
        setUserProfile({ ...res.data });
        if (ProfileType === SELF) {
          dispatch(
            updateProfile({
              profileImg: res.data.profileImage,
              follow_back: res.data.follow_back,
              followers: res.data.followers,
            })
          );
        }
        dispatch(LoadingFalse(true));
      } else {
        dispatch(LoadingFalse(true));
        toast.error("Couldn't find entry...");
      }
    } catch (err) {
      dispatch(LoadingFalse(true));
            checkError(dispatch,err,logout,history);
    }
  };

  const getUserSelf = async () => {
    try {
      let res = await axios.get("/app/user/myprofile");
      if (res.status === 200) {
        dispatch(
          updateProfile({
            profileImg: res.data.profileImage,
            follow_back: res.data.follow_back,
            followers: res.data.followers,
          })
        );
      } else {
        toast.error("Couldn't find entry...");
      }
    } catch (err) {
            checkError(dispatch,err,logout,history);
    }
  };

  const getPosts = async () => {
    try {
      dispatch(LoadingTrue(true));

      let url =
        ProfileType === FOREIGN
          ? `/app/memories/get-memories-by-user/${user_id}`
          : "/app/memories/get-memories-by-user";
      let res = await axios.get(url);
      if (res.status === 200) {
        setMemories(res.data || []);
        dispatch(LoadingFalse(true));
      } else {
        dispatch(LoadingFalse(true));
        toast.error("Couldn't find entry...");
      }
    } catch (err) {
      dispatch(LoadingFalse(true));
            checkError(dispatch,err,logout,history);
    }
  };

  function handleChange(e: any) {
    if (e.target.files[0]) {
      let url = URL.createObjectURL(e.target.files[0]);
      setFile(e.target.files[0]);
      setImgUrl(url);
    }
  }

  const uploadPic = async () => {
    try {
      if (!File) {
        toast.warn("Please select a picture!");
        return;
      }
      const functionThatReturnPromise = () =>
        new Promise(async (resolve, reject) => {
          try {
            const data = new FormData();
            File && data.append("path", File);

            let res = await axios.post("/app/user/update-profle-image", data, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            if (res.status === 200) {
              resolve(true);
              getUserSelf();
              setImgUrl("");
            } else {
              reject();
            }
          } catch (err) {
                  checkError(dispatch,err,logout,history);
            reject();
          }
        });

      toast.promise(functionThatReturnPromise, {
        pending: "Image uploading...",
        success: "Upload Successfull 👌",
        error: "Upload failed 🤯",
      });
    } catch (err) {
            checkError(dispatch,err,logout,history);
    }
  };

  const checkFollowStatus = () => {
    if (UserProfile && auth.follow_back.includes(UserProfile?._id)) {
      return "Unfollow";
    } else {
      if (UserProfile?.followers.includes(auth.user_id)) {
        return "Follow Back";
      }
      return "Follow";
    }
  };

  const manageFollowRequests = async () => {
    try {
      const body = JSON.stringify({
        id: UserProfile?._id,
      });
      let res = await axios.post("/app/user/follow", body);
      if (res.status === 200) {
        getUserProfile();
        getUserSelf();
      } else {
        toast.warn(wentWrongMessage);
      }
    } catch (err) {
            checkError(dispatch,err,logout,history);
    }
  };

  const createBuffer = (params: string) => {
    // Creating the buffer object with utf8 encoding
    let bufferObj1 = Buffer.from(params, "utf8");
    // Encoding into base64
    let base64String = bufferObj1.toString("base64");
    return base64String;
  };
  return (
    <div className="bg-white  p-5 ">
      <div className="grid grid-cols-2	">
        <div className="flex items-center pb-5">
          {ProfileType === FOREIGN ? (
            <BackArrowButton className="cursor-pointer pr-5 " url={-1} />
          ) : (
            ""
          )}
          <h3 className="text-2xl">{UserProfile?.username}</h3>
        </div>
        {ProfileType === FOREIGN ? (
          <div className="w-full place-items-center px-5">
            <button
              type="button"
              className="w-full text-slate-700 border border-slate-700 hover:bg-slate-700
               hover:text-white focus:outline-none 
              font-medium rounded-lg text-base py-2 px-5 text-center"
              onClick={manageFollowRequests}
            >
              {checkFollowStatus()}
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div id="bio_memory" className="overflow-auto h-[calc(100vh-14rem)] md:h-[calc(100vh-11rem)] scrollbar">
      <div className="flex justify-around items-center mb-3 px-5 bg-slate-10" id="bio">
        <div>
          {ProfileType === FOREIGN ? (
            UserProfile?.profileImage &&
            UserProfile?.profileImage.length > 0 ? (
              <img
                src={UserProfile?.profileImage}
                alt="Profile Image"
                className="w-24 h-24 object-cover shadow rounded-full max-w-full align-middle border-none"
              />
            ) : (
              <span
                style={{ fontSize: "64px" }}
                className="material-icons-outlined"
              >
                add_photo_alternate
              </span>
            )
          ) : (
            <>
              <label
                htmlFor="dropzone-file"
                className="cursor-pointer"
                //className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {ImgUrl && ImgUrl.length > 0 ? (
                  <img
                    className="w-24 h-24 object-cover shadow rounded-full max-w-full align-middle border"
                    src={ImgUrl}
                    alt="Profile Pic"
                  />
                ) : UserProfile?.profileImage &&
                  UserProfile?.profileImage.length > 0 ? (
                  <img
                    src={UserProfile?.profileImage}
                    alt="Profile Image"
                    className="w-24 h-24 object-cover shadow rounded-full max-w-full align-middle border-none"
                  />
                ) : (
                  <span
                    style={{ fontSize: "64px" }}
                    className="material-icons-outlined"
                  >
                    add_photo_alternate
                  </span>
                )}
                <input
                  id="dropzone-file"
                  accept="image/png, image/gif, image/jpeg"
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
              {ImgUrl && ImgUrl.length > 0 ? (
                <div className="flex justify-around items-center my-3 pl-2">
                  <button
                    type="button"
                    className="text-slate-700 border border-slate-700 hover:bg-slate-700
                   hover:text-white focus:outline-none 
                    font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2 "
                    onClick={() => setImgUrl("")}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                      }}
                      className="material-icons-outlined"
                    >
                      close
                    </span>{" "}
                  </button>
                  <button
                    type="button"
                    className="text-slate-700 border border-slate-700 hover:bg-slate-700
                     hover:text-white focus:outline-none
                     font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2 "
                    onClick={() => uploadPic()}
                  >
                    {Loading.loading ? (
                      <Loader size="small" />
                    ) : (
                      <span
                        style={{
                          fontSize: "20px",
                        }}
                        className="material-icons-outlined"
                      >
                        file_upload
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                ""
              )}
            </>
          )}
          <h4 className="text-base p-2">{UserProfile?.fullname}</h4>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            let username = UserProfile && createBuffer(UserProfile?.username);
            history(
              `/follow-lists/${user_id || auth.user_id}/followers/${username}`
            );
          }}
        >
          <h4 className="text-3xl text-center">
            {UserProfile?.followers.length}
          </h4>
          followers
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            let username = UserProfile && createBuffer(UserProfile?.username);
            history(
              `/follow-lists/${user_id || auth.user_id}/following/${username}`
            );
          }}
        >
          <h4 className="text-3xl text-center">
            {UserProfile?.follow_back.length}
          </h4>
          following
        </div>
        <div>
          <h4 className="text-3xl text-center">{Memories.length}</h4>
          posts
        </div>
      </div>
      {Loading.loading ? (
        <Loader className="text-slate-900 h-3/4" size="large" />
      ) : (
        <div id="profile_memories" className="min-h-[calc(100vh_-_25rem)] px-5">
          {Memories && Memories.length > 0 ? (
            <div className="grid grid-cols-2	md:grid-cols-3">
              {Memories.map((x, i) => (
                <div key={i} className="flex justify-center items-center">
                  <img
                    onClick={() => {
                      history(`/user/single/${x._id}/${user_id}`);
                    }}
                    className="cursor-pointer max-h-32 h-full w-full object-cover"
                    src={x.img_url}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <figure>
                <img className="" src="/image/gallery.png" alt="Profile Pic" />
                <figcaption>No Memories to show here...</figcaption>
              </figure>
            </div>
          )}
        </div>
      )}
      </div>

    </div>
  );
}
