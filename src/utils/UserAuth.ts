import axios from "axios";
import { connectionString } from "../constants/connectionUris";
let Heroku = connectionString;
export async function SignUp(email: string, password: string) {
  const Uri = Heroku + "/api/auth/signup";
  const res = await axios({
    method: "POST",
    url: Uri,
    data: {
      email: email,
      password: password,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
  });
  return res;
}

export async function ValidateToken(token: string) {
  //Validate the token
  const Uri = Heroku + "/api/auth/checkSessionToken/" + token;
  const res = await axios({
    method: "GET",
    url: Uri,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
  });
  return res;
}

export async function SignIn(email: string, password: string) {
  const Uri = Heroku + "/api/auth/signin";
  const res = await axios({
    method: "POST",
    url: Uri,
    data: {
      email: email,
      password: password,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
  });
  return res;
}

export function SignOut() {
  window.localStorage.removeItem("stylecard-token");
}
