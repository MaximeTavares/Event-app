import type { User } from "../../user/types/user.type";

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  data:{
    user: User;
    accessToken: string;
  }
  timeStamp: string;
  url: string;
}

export interface MeResponse {
  user: User;
}
