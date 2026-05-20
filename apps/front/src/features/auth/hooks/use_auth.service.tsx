import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "../api/auth.api";
import type { AuthResponse, MeResponse, SigninData, SignupData } from "../types/types";
import { useAuthStore } from "../store/auth.store";

export function useSignin() {
	const { setUser, setAccessToken } = useAuthStore();
	const queryClient = useQueryClient();

	return useMutation<AuthResponse, Error, SigninData>({
		mutationFn: (payload) => AuthApi.signin(payload),
		onSuccess: (res) => {
			setUser({
				id: res.data.user.id,
				role: res.data.user.role,
			});

			setAccessToken(res.data.accessToken);
			queryClient.invalidateQueries({ queryKey: ["session"] });
		},
	});
}

export function useSignup() {
	return useMutation<MeResponse, Error, SignupData>({
		mutationFn: (payload) => AuthApi.signup(payload),
	});
}

export function useSignout() {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => AuthApi.signout(),
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: ["session"] });
    },
  });
}

export function useRefreshToken() {
	const { setUser, setAccessToken, accessToken } = useAuthStore();

	return useQuery({
		queryKey: ["refresh_token"],
		queryFn: async () => {
			const res = await AuthApi.refresh();
			setUser(res.data.user);
			setAccessToken(res.data.accessToken);
			return res;
		},
    retry: false,
		enabled: !accessToken,
	});
}
