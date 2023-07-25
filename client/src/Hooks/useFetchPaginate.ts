import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkError } from "../components/errorLogout";
import { wentWrongMessage } from "../constants/custom_strings";
import { errorHandle } from "../services/errorHandle";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/slices/auth";

export function useFetchPaginate<T>(
  query: string,
  page: number,
  requestBody?: object,
  reload?: number
) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [list, setList] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [load, setLoad] = useState<number>(reload || 0);
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const sendQuery = useCallback(async () => {
    try {
      if (hasMore) {
        setLoading(true);
        setError("");
        const body = JSON.stringify({
          page: page,
          limit: 5,
          ...requestBody,
        });
        const res = await axios.post(query, body);
        if (res.status === 200) {
          let array = [...new Set([...list, ...res.data.list])];
          setList([...array]);
          let count = res.data.count;
          setHasMore(count > array.length ? true : false);
          setLoading(false);
        } else {
          toast.warn(wentWrongMessage);
          setLoading(false);
        }
      } else if (reload && reload > load) {
        setLoad(reload);
        setLoading(true);
        setError("");
        const body = JSON.stringify({
          page: 1,
          limit: 5,
          ...requestBody,
        });
        const res = await axios.post(query, body);
        if (res.status === 200) {
          let array = [...new Set([...res.data.list])];
          setList([...array]);
          let count = res.data.count;
          setHasMore(count > array.length ? true : false);
          setLoading(false);
        } else {
          toast.warn(wentWrongMessage);
          setLoading(false);
        }
      }
    } catch (err) {
      checkError(dispatch,err,logout,history)
    }
  }, [query, page, reload]);

  useEffect(() => {
    sendQuery();
  }, [query, sendQuery, page, reload]);

  return { loading, error, list, hasMore };
}
