import axios from "axios";
import {
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikValues,
  FormikProps,
} from "formik";
import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { checkError } from "../../../components/errorLogout";
import InputField from "../../../components/InputField";
import { useAppDispatch } from "../../../store/hooks";
import { logout, signup } from "../../../store/slices/auth";
import Popup from "./popupModal";

export interface ISignUpProps {}

interface FormValues {
  email: string;
  password: string;
  username: string;
  fullname: string;
}

const InputEmail = ({ field, form, ...props }) => (
  <InputField
    className="mt-3"
    label
    labelText="Email"
    placeholder="Email..."
    type="text"
    name="email"
    {...field}
    {...props}
  />
);

const InputFullname = ({ field, form, ...props }) => (
  <InputField
    className="mt-3"
    label
    labelText="Fullname"
    placeholder="Enter your full name"
    name="fullname"
    type="text"
    {...field}
    {...props}
  />
);
export const InputUserName = ({ field, form, ...props }) => (
  <InputField
    className="mt-3"
    label
    labelText="Username"
    placeholder="Enter your unique username"
    type="text"
    name="username"
    {...field}
    {...props}
  />
);
export const InputPassword = ({ field, form, ...props }) => (
  <InputField
    className="mt-3"
    label
    labelText="Password"
    placeholder="Password"
    type="password"
    name="password"
    {...field}
    {...props}
    children={props.children}
  />
);

function isValidEmail(input: string) {
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (input.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

function isValidPassword(input: string) {
  let validRegex = `^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})`;

  if (input.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

export default function SignUp(props: ISignUpProps) {
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false);

  const validate = (values: FormikValues) => {
    let errors: FormikErrors<FormikValues> = {};
    if (!values.username) {
      errors.username = "Required";
    }
    if (!values.password) {
      errors.password = "Required";
    } else if (!isValidPassword(values.password)) {
      errors.password = "Invalid password format";
    }
    if (!values.fullname) {
      errors.fullname = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (!isValidEmail(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  return (
    <div className="" id="signup">
      {showPopup ? <Popup /> : ""}
      <h3 className="text-2xl py-5 md:px-10 font-bold">Hey,</h3>
      <h4 className="text-xl py-5 md:px-10 font-bold">
        Sign Up for{" "}
        <span className="text-neutral-50 font-semibold font-mono">
          {" "}
          Memories...
        </span>
      </h4>
      <div className="flex items-center justify-center md:px-10">
        {/* <MyForm message="Sign up" /> */}
        <Formik
          validate={validate}
          initialValues={{
            fullname: "",
            username: "",
            email: "",
            password: "",
          }}
          onSubmit={async (
            values: FormValues,
            { setSubmitting }: FormikHelpers<FormValues>
          ) => {
            try {
              const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
              let res = await axios.post("/app/login/register", values, config);
              if (res) {
                if (res.data.token) {
                  setShowPopup(true);
                  dispatch(
                    signup({
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
                    setShowPopup(false);
                    history("/");
                  }, 3000);
                }
              }
              setSubmitting(false);
            } catch (err) {
              checkError(dispatch, err, logout, history);
              setSubmitting(false);
            }
          }}
        >
          {(props: FormikProps<FormValues>) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              isSubmitting,
            } = props;

            return (
              <Form>
                <Field
                  component={InputFullname}
                  id="fullname"
                  name="fullname"
                  placeholder="Enter fullname..."
                  type="text"
                />
                {touched.fullname && errors.fullname && (
                  <div className="text-right text-red-600 font-normal text-base ">
                    {errors.fullname}
                  </div>
                )}
                <Field
                  component={InputEmail}
                  id="email"
                  name="email"
                  placeholder="Enter email..."
                />
                {touched.email && errors.email && (
                  <div className="text-right text-red-600 font-normal text-base ">
                    {errors.email}
                  </div>
                )}
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
                  type="password"
                  placeholder="Enter password..."
                  // children={
                  //   <span className="material-icons-outlined">visibility</span>
                  // }
                />
                {touched.password && errors.password && (
                  <div className="text-right text-red-600 font-normal text-base ">
                    {errors.password}
                  </div>
                )}
                {
                  <p className="">
                    Min length 8 letters, should contain uppercase, lowercase,
                    numerics and special characters.
                  </p>
                }
                <Button
                  className={"mt-5 w-full"}
                  buttonType="primary"
                  text="Sign Up"
                  type="submit"
                  Icon={
                    isSubmitting ? (
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
                  <p>Already a member ?</p>
                  <NavLink className={"text-neutral-50 "} to={"/auth/signin"}>
                    &nbsp;Sign In
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
