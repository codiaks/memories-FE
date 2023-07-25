import axios from "axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { checkError } from "../../../components/errorLogout";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout, signin } from "../../../store/slices/auth";
import { LoadingFalse, LoadingTrue } from "../../../store/slices/loading";
import { InputUserName, InputPassword } from "../signup";
export interface ISignInProps {}

interface FormValues {
  username: string;
  password: string;
}

export default function SignIn(props: ISignInProps) {
  localStorage.setItem("hafis", "this is string");
  sessionStorage.setItem("ksd", Math.random());
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const Loading = useAppSelector((state) => state.Loading);
  const [ShowPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    dispatch(LoadingFalse(false));
  }, []);

  return (
    <div className="" id="signin">
      <h3 className="text-2xl py-5 md:px-10 font-bold">Hi,</h3>
      <h4 className="text-xl py-5 md:px-10 font-bold">
        Sign In to{" "}
        <span className="text-neutral-50 font-semibold font-mono">
          {" "}
          Memories...
        </span>
      </h4>
      <div className="flex items-center justify-center md:px-10">
        {/* <MyForm message="Sign up" /> */}
        <Formik
          //validate={validate}
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={async (
            values: FormValues,
            { setSubmitting }: FormikHelpers<FormValues>
          ) => {
            try {
              dispatch(LoadingTrue(true));

              const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
              let res = await axios.post("/app/login/login", values, config);
              if (res) {
                if (res.data.token) {
                  dispatch(
                    signin({
                      token: res.data.token,
                      isAuthenticated: true,
                      fullname: res.data.fullname,
                      username: res.data.username,
                      user_id: res.data._id,
                      profileImg: res.data.profileImage,
                      follow_back: res.data.follow_back,
                      followers: res.data.followers,
                    })
                  );
                  setTimeout(() => {
                    dispatch(LoadingFalse(false));
                    history("/");
                  }, 3000);
                }
              }
              setSubmitting(false);
            } catch (err) {
              checkError(dispatch, err, logout, history);
              dispatch(LoadingFalse(false));
            }
          }}
        >
          {(props: FormikProps<FormValues>) => {
            const { touched, errors } = props;

            return (
              <Form>
                <Field
                  component={InputUserName}
                  id="username"
                  name="username"
                  placeholder="Enter username..."
                />
                {touched.username && errors.username && (
                  <div className="text-right text-red-600 font-normal text-base ">
                    {errors.username}
                  </div>
                )}
                <Field
                  component={InputPassword}
                  id="password"
                  name="password"
                  type={ShowPassword ? "text" : "password"}
                  placeholder="Enter password..."
                  children={
                    ShowPassword ? (
                      <svg
                        onClick={() => setShowPassword(false)}
                        className="mt-3 absolute top-1/2 transform -translate-y-1/2 right-3"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
                      </svg>
                    ) : (
                      <span
                        onClick={() => setShowPassword(true)}
                        className="mt-3 absolute top-1/2 transform -translate-y-1/2 right-3 material-icons-outlined"
                      >
                        visibility_off
                      </span>
                    )
                  }
                />
                {touched.password && errors.password && (
                  <div className="text-right text-red-600 font-normal text-base ">
                    {errors.password}
                  </div>
                )}
                {Loading.message ? (
                  <p className="mt-4 text-neutral-50">{Loading.message}!!!</p>
                ) : (
                  ""
                )}
                <Button
                  className={"mt-5 w-full"}
                  buttonType="primary"
                  text="Sign In"
                  type="submit"
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
                <div className="flex md:block lg:flex flex-row mt-5">
                  <p>Don't have an account ?</p>
                  <NavLink className={"text-neutral-50 "} to={"/auth/signup"}>
                    &nbsp;Sign Up
                  </NavLink>
                </div>
                <div className="flex flex-row my-5">
                  <span className="text-neutral-50 font-mono"></span>
                </div>{" "}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
