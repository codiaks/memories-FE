import { useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkError } from "../components/errorLogout";
import { baseUrl } from "../configs/api";
import { errorHandle } from "../services/errorHandle";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/auth";
import { LoadingFalse, LoadingTrue } from "../store/slices/loading";

interface State<T> {
  data?: T;
  error?: Error;
}

type Cache<T> = { [url: string]: T };

// discriminated union type
type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error };

function useFetch<T = unknown>(url?: string, options?: RequestInit, reload? : number, page? : number): State<T> {
  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false);
  const dispatch = useAppDispatch();

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
  };

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...initialState };
      case "fetched":
        return { ...initialState, data: action.payload };
      case "error":
        return { ...initialState, error: action.payload };
      default:
        return state;
    }
  };

  const [state, stateDispatch] = useReducer(fetchReducer, initialState);
  const auth = useAppSelector((state) => state.auth);
  const history = useNavigate();
  useEffect(() => {
    // Do nothing if the url is not given
    if (!url) return;
    
    cancelRequest.current = false;

    const fetchData = async () => {
      stateDispatch({ type: "loading" });
      dispatch(LoadingTrue(true));

      // If a cache exists for this url, return it
      // if (cache.current[url]) {
      //   dispatch(LoadingFalse(true));
      //   stateDispatch({ type: "fetched", payload: cache.current[url] });
      //   return;
      // }

      try {
        const response = await fetch(baseUrl + url, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          ...options,
        });
        if (!response.ok) {
            toast.error(response.statusText);
        }

        const data = (await response.json()) as T;
        if (cancelRequest.current) return;
        dispatch(LoadingFalse(true));
        stateDispatch({ type: "fetched", payload: data });
      } catch (error) {
        if (cancelRequest.current) return;
        dispatch(LoadingFalse(true));
        stateDispatch({ type: "error", payload: error as Error });
        checkError(dispatch,error,logout,history)
      }
    };

    void fetchData();

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, reload, page]);

  return state;
}

export default useFetch;
