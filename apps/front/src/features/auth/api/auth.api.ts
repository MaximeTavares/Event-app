import axios from "axios";
import type { AuthResponse, SigninData, SignupData } from "../types/types";
import { api } from "../../../shared/utils/axios-client";
import type { Role } from "../../user/types/user.type";

export type MeResponse = {
  user: {
    id: number;
    email: string;
    name: string;
    role: Role;
  };
};

export class AuthApi {
  static async signin(body: SigninData): Promise<AuthResponse> {
    const { data } = await api.post("auth/signin", body);
    return data;
  }

  static async signup(body: SignupData): Promise<MeResponse> {
    const { data } = await api.post("auth/signup", body);
    return data;
  }

  static async refresh(): Promise<AuthResponse> {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/refresh_token`,
      {
        withCredentials: true,
      },
    );
    return data;
  }

  static async signout(): Promise<void> {
    await api.post("auth/signout", {}, { withCredentials: true });
  }
}
