import * as React from "react";
import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import SignIn from "./signin";
import SignUp from "./signup";

export interface IAuthViewProps {}

export default function AuthView(props: IAuthViewProps) {
  return (
    <div
      className="bg-gradient-to-r from-teal-200 to-fuchsia-600
      md:bg-gradient-to-r from-rose-600 to-teal-300 overflow-auto h-screen"
      id="auth"
    >
      <div className="grid md:grid-cols-2 	p-10 h-full">
        <div className="p-10 hidden md:block">
          <h1 className="text-4xl text-neutral-50	font-black	">A space shared</h1>
          <h2 className="text-3xl my-10 text-neutral-50	font-semibold	">
            only for your <span className="text-5xl">memories...</span>
          </h2>
          <img
            className="max-w-full h-auto rounded-lg"
            src="/image/memories.gif"
            alt="memories..."
          />
        </div>
        <div className="p-10">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
