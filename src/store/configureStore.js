import {applyMiddleware, createStore} from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from "redux-thunk";
import logger from "redux-logger";

const initialState = {
    isLogin: false,
    token: null,
    user: '',
    posts: '',
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'IS_LOGIN':
            return {
                ...state,
                isLogin: true,
                token: action.token,
                user: action.user,
            };
        case 'LOGOUT':
            return {
                ...state,
                isLogin: false,
                token: null,
                user: null,
            };
        case 'REGISTER':
            return {
                ...state,
                user: action.user
            };
        case 'POSTS':
            return {
                ...state,
                posts: action.posts
            };
        default:
            return state;
    }
}

const persistConfig = { // configuration object for redux-persist
    key: 'root',
    storage, // define which storage to use
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middleware = applyMiddleware(thunk, logger);

const store = createStore(
    persistedReducer,
    middleware
)

const  persistor = persistStore(store);
export {store, persistor}