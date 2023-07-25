import { errorHandle } from "../services/errorHandle";

export const checkError = (dispatch:any,err:any,logout:any,history:any) => {
    let val = errorHandle(err);
    if(val?.logout === true) {
      dispatch(logout({}));
      history('/auth/signin')
    }
}