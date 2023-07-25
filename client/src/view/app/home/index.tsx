import axios from "axios";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { ADD, SELF, wentWrongMessage } from "../../../constants/custom_strings";
import useFetch from "../../../Hooks/useFetch";
import { useFetchPaginate } from "../../../Hooks/useFetchPaginate";
import { errorHandle } from "../../../services/errorHandle";
import { useAppSelector } from "../../../store/hooks";
import NewMemory from "./AddNewMemory";
import MemoryList, { memory, SingleMemory } from "./MemoryList";

export interface IHomeProps {}

export default function Home(props: IHomeProps) {
  const [Memories, setMemories] = React.useState<memory[]>([]);
  const Loading = useAppSelector((state) => state.Loading);
  const [loadFetch, setloadFetch] = React.useState<number>(0);
  const [PageNumber, setPageNumber] = React.useState<number>(1);
  const observer = React.useRef<HTMLDivElement | null>(null);

  const { loading, error, list, hasMore } = useFetchPaginate<memory>(
    "/app/memories/get-memories",
    PageNumber
  );

  useEffect(() => {
    setMemories([...list]);
  }, [list]);
  const lastMemoryRef = React.useCallback(
    // (*)
    (node) => {
      if (loading) return;
      let { current } = observer;
      if (current) current.disconnect();
      current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) current?.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      {Memories.length === 0 && loading ? (
        <Loader className="text-slate-900 h-[calc(100vh-6rem)]" size="large" />
      ) : Memories.length > 0 ? (
        <div className={"py-7 px-10 "}>
          {Memories.map((x, i) => {
            const isLast = Memories.length === i + 1;
            return isLast && hasMore === true ? (
              <div className="py-3" id={x._id} key={i}>
                <SingleMemory data={x} dataStatus="available" />
                <div className="text-center my-5" ref={lastMemoryRef}>
                  Loading...
                </div>
              </div>
            ) : (
              <div className="py-3" id={x._id} key={i}>
                <SingleMemory data={x} dataStatus="available" />
              </div>
            );
          })}
          {/* <div>No more Memories to show~~~</div> */}
        </div>
      ) : (
        <NewMemory mode={ADD} reloadList={() => setloadFetch(loadFetch + 1)} />
      )}
    </>
  );
}
