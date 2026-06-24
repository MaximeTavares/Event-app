export const AUTH_SUBJECTS = {
	SIGNIN: "auth.signin",
	SIGNUP: "auth.signup",
	SIGNOUT: "auth.singout",
	AUTH_GOOGLE: "auth.google",
	REFRESH_TOKEN: "refresh_token",
} as const;

export const USER_SUBJECTS = {
    GET_USER: "user.get",
    GET_PROFILE: "user.get.profile",
    GET_PROFILES: "users.get.profiles",
} as const;

export const SETTINGS_SUBJECTS = {
    GET_SETTINGS: "user.settings.get",
    UPDATE_PROFILE: "user.update.profile",
    GET_PREFERENCES: "user.get.preferences",
    UPDATE_PREFERENCES: "user.update.preferences",
    GET_NOTIFICATIONS: "user.get.notifications",
    UPDATE_NOTIFICATIONS: "user.update.notifications",
    GET_SECURITY: "user.get.security",
    UPDATE_SECURITY: "user.update.security",
    GET_AVAILABILITY: "user.get.availability",
	UPDATE_AVAILABILITY: "user.update.availability",
	CHANGE_PASSWORD: "user.change.password",
} as const;
