import * as React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ADD, EDIT } from "../../constants/custom_strings";
import { useAppSelector } from "../../store/hooks";
import Home from "./home";
import NewMemory from "./home/AddNewMemory";
import CommentList from "./home/comments";
import Header from "./home/header";
import Memorist from "./memorist";
import Profile from "./profile";
import FollowLists from "./profile/follow_lists";
import UserSingleMemory from "./profile/single";

export interface IAppProps {}

export default function App(props: IAppProps) {
  const auth = useAppSelector((state) => state.auth);
  const history = useNavigate();
  React.useEffect(() => {
    if (!(auth && auth.token && auth.isAuthenticated)) {
      history("/auth/signin");
    }
  }, []);

  return (
    <>
      <Header />
      <div className="h-[calc(100vh_-_8rem)] md:h-[calc(100vh_-_5rem)] bg-slate-100 md:px-10 overflow-auto scrollbar">
        <div className="md:w-4/6 lg:w-2/5 mx-auto bg-white rounded-lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:user_id" element={<Profile />} />
            <Route path="/user/single/:memory_id/:user_id" element={<UserSingleMemory />} />
            <Route path="/comment/:memory_id" element={<CommentList />} />
            <Route
              path="/new-memory"
              element={
                <NewMemory mode={ADD} reloadList={() => history("/")} />
              }
            />
            <Route
              path="/edit-memory/:memory_id"
              element={
                <NewMemory mode={EDIT} reloadList={() => history("/")} />
              }
            />
            <Route
              path="/find-memorist"
              element={
                <Memorist  />
              }
            />            
            <Route
            path="/follow-lists/:user_id/:default/:username"
            element={
              <FollowLists  />
            }
          />
          </Routes>
        </div>
      </div>
    </>
  );
}
