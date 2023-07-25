import React from "react";
import { toast } from "react-toastify";
import { wentWrongMessage } from "../constants/custom_strings";
export function errorHandle(error: any) {
  console.log(error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    //console.log(error.response.data);
    //console.log(error.response.status);
    //console.log(error.response.headers);
    let err = error.response.data || error.response.status;
    toast.error(err, {});
    if(error.response.status === 401) {
      return {logout : true};
    }
    //if()
  }
  // else if(error.message) {
  //   toast.error(error.message, {});
  // }
  else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    let err = error.request.data || error.request || "Request error";
    toast.error(err, {});
  } else {
    // Something happened in setting up the request that triggered an Error
    //console.log("Error", error.message);
    toast.error(wentWrongMessage, {});
  }
}
