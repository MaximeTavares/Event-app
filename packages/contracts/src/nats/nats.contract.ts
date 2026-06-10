export const AUTH_SUBJECTS = {
    //AUTH
    SIGNIN: 'auth.signin',
    SIGNUP: 'auth.signup',
    SIGNOUT: 'auth.singout',
    AUTH_GOOGLE: 'auth.google',
    REFRESH_TOKEN: 'refresh_token',

    // USER
    GET_USER: 'users.get',

    // SETTINGS
    GET_SETTINGS: 'user.settings.get',
    UPDATE_PROFILE: 'user.update.profile',
    CHANGE_PASSWORD: 'user.change.password',

} as const;