import axios from "axios";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import { checkError } from "../../../components/errorLogout";
import InputField from "../../../components/InputField";
import { ADD, EDIT, wentWrongMessage } from "../../../constants/custom_strings";
import { errorHandle } from "../../../services/errorHandle";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/auth";
import { LoadingFalse, LoadingTrue } from "../../../store/slices/loading";

type img = File | Blob //| string;

interface IResizeImageOptions {
  maxSize: number;
  file: img;
}

const resizeImage = (settings: IResizeImageOptions) => {
  const file = settings.file;
  const maxSize = settings.maxSize;
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement("canvas");
  const dataURItoBlob = (dataURI: string) => {
    const bytes =
      dataURI.split(",")[0].indexOf("base64") >= 0
        ? atob(dataURI.split(",")[1])
        : decodeURI(dataURI.split(",")[1]);
    const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
  };
  const resize = () => {
    let width = image.width;
    let height = image.height;

    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(image, 0, 0, width, height);
    let dataUrl = canvas.toDataURL("image/jpeg");
    return dataURItoBlob(dataUrl);
  };

  return new Promise<Blob>((ok, no) => {
    if (!file.type.match(/image.*/)) {
      no(new Error("Not an image"));
      return;
    }

    reader.onload = (readerEvent: any) => {
      image.onload = () => ok(resize());
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export interface INewMemoryProps {
  reloadList?: () => void;
  mode: "ADD" | "EDIT";
}

type imgUrl = string;
interface imageProp extends INewMemoryProps {
  image: (x: img) => void;
  oldFile: img;
}
export const ImageUploadFeild = ({ image, oldFile, mode }: imageProp) => {
  const [file, setFile] = React.useState("");
  const [imgUrl, setimgUrl] = React.useState<string>("");
  // React.useEffect(() => {
  //   //setFile("")
  // }, []);

  React.useEffect(() => {
    if (typeof oldFile === "string") {
      setFile(oldFile);
      setimgUrl(oldFile);
    }
  }, [oldFile]);

  function handleChange(e: any) {
    if (e.target.files[0]) {
      let url = URL.createObjectURL(e.target.files[0]);
      setFile(url);
      setimgUrl(url);
      image(e.target.files[0]);
    }
  }

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full 
        h-64 md:h-48 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 
        dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 
        dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        {mode === ADD ? (
          <>
            {!imgUrl && (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {/* SVG, PNG, JPG or GIF (MAX. 800x400px) */}
                </p>
              </div>
            )}
            <input
              id="dropzone-file"
              accept="image/png, image/gif, image/jpeg"
              type="file"
              className="hidden"
              onChange={handleChange}
            />
            {imgUrl && (
              <img
                src={imgUrl}
                //absolute h-64 w-2/5
                className="max-w-full max-h-full p-1 rounded-lg"
              />
            )}
          </>
        ) : (
          file && (
            <img
              src={file}
              //absolute h-64 w-2/5
              className="  max-w-full max-h-full       p-1 rounded-lg"
            />
          )
        )}
      </label>
    </div>
  );
};

export default function NewMemory({ reloadList, mode }: INewMemoryProps) {
  const [description, setDescription] = React.useState<{
    desc: string;
    image: img;
    title: string;
  }>({ image: new Blob, desc: "", title: "" });
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const Loading = useAppSelector((state) => state.Loading);
  const { memory_id } = useParams();

  React.useEffect(() => {
    if (mode === EDIT) {
      memory_id && getMemoryDetails(memory_id);
    } else {
      setDescription({
        desc: "",
        image: new Blob,
        title: "",
      });
    }
  }, [mode]);

  const getMemoryDetails = async (params: string) => {
    try {
      dispatch(LoadingTrue(true));
      const body = JSON.stringify({
        _id: params,
      });
      let res = await axios.post("/app/memories/get-memory-by-id", body);
      if (res.status === 200) {
        dispatch(LoadingFalse(true));
        let data = res.data;
        setDescription({
          desc: data.description,
          image: data.img_url,
          title: data.title,
        });
      } else {
        dispatch(LoadingFalse(false));
        toast.warn(res.statusText || wentWrongMessage);
      }
    } catch (err) {
      dispatch(LoadingFalse(false));
            checkError(dispatch,err,logout,history);
    }
  };

  const getNewImage = (params: img) => {
    setDescription({ ...description, image: params });
  };

  const createNewPost = async () => {
    try {
      if (mode === EDIT) {
        // /update-memories
        dispatch(LoadingTrue(true));
        const body = JSON.stringify({
          id: memory_id,
          description: description.desc,
          title: description.title,
        });

        let res = await axios.post("/app/memories/update-memories", body);
        if (res.status === 200) {
          dispatch(LoadingFalse(true));
          reloadList && reloadList();
        } else {
          dispatch(LoadingFalse(false));
          toast.warn(wentWrongMessage);
        }
      } else {
        const config = {
          file: description.image,
          maxSize: 1024,
        };
        let newIm = await resizeImage(config);
        dispatch(LoadingTrue(true));
        const data = new FormData();
        data.append("path", newIm);
        data.append("description", description.desc);
        data.append("title", description.title);

        let res = await axios.post("/app/memories/save-memories", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status === 201) {
          dispatch(LoadingFalse(true));
          reloadList && reloadList();
        } else {
          dispatch(LoadingFalse(false));
          toast.warn(wentWrongMessage);
        }
      }
    } catch (err) {
      dispatch(LoadingFalse(false));
            checkError(dispatch,err,logout,history);
    }
  };

  const changeDescription = (params: React.ChangeEvent) => {
    const val = (params.target as HTMLInputElement).value;
    setDescription({ ...description, desc: val });
  };

  const changeTitle = (params: React.ChangeEvent) => {
    const val = (params.target as HTMLInputElement).value;
    setDescription({ ...description, title: val });
  };

  return (
    <div className="p-5 md:h-[calc(100vh-6rem)]">
      <div className="flex justify-between items-center">
        <h3
          className="text-3xl 
       text-slate-900 m-0 font-bold"
        >
          {mode === ADD ? "Create new memory" : "Edit Memory"}
        </h3>
        <div role="button" onClick={() => history("/")}>
          <span className="material-icons-outlined">clear</span>
        </div>
      </div>
      {/* <img role={"button"} src="/image/image_bg_cover.png" /> */}

      <div className="mt-5">
        <InputField
          children={null}
          type="text"
          value={description.title}
          placeholder="Title for your memory..."
          onChange={changeTitle}
          label={true}
          labelText="Title"
          inputClass="border-0"
        />
      </div>
      <div className="py-5">
        <ImageUploadFeild
          mode={mode}
          oldFile={description.image}
          image={getNewImage}
        />
      </div>
      <div>
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your message
          </label>
          <textarea
            value={description.desc}
            onChange={changeDescription}
            id="message"
            rows={6}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Button
          className="w-2/4"
          text="Post"
          type="button"
          onClick={createNewPost}
          Icon={
            Loading.loading ? (
              <span
                style={{ fontSize: "16px", textAlign: "center" }}
                className=" align-middle mx-3	animate-spin material-icons-outlined"
              >
                hourglass_empty
              </span>
            ) : null
          }
        />
      </div>
      {/* <h2 className="text-slate-900 text-2xl my-10">
        Follow new people to see their memories...
      </h2> */}
    </div>
  );
}
