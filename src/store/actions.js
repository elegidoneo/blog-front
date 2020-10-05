export const IS_LOGIN = 'IS_LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const POSTS = 'POSTS';

export const isLogin = (token, user) => ({
    type: IS_LOGIN,
    token,
    user
})

export const signOut = () => ({
    type: LOGOUT
})

export const register = (user) => ({
    type: REGISTER,
    user
})

export const getPosts = (posts) => ({
    type: POSTS,
    posts
})