import * as actions from '../store/actions'
import {store} from '../store/configureStore'
import {API_URL} from "../config";

function request(url = '', method = "GET", data = {}, headers = {}) {
    let config = {
        method: method, // *GET, POST, PUT, DELETE, etc.
        headers: headers,
    };

    config.headers.Accept = 'application/json';
    if (store.getState().token !== null) {
        config.headers.Authorization = "Bearer " + JSON.parse(store.getState().token).access_token;
    }

    if (method === "POST") {
        config.headers["Content-Type"] = 'application/json';
        config.body = JSON.stringify(data)
    }
    return  fetch(API_URL+url, config).then(response => {
        return response.json();
    }).catch(error => console.error('There was an error!', error));
}

export const login = (data, history) => {
    return request("/api/login", 'POST', data).then(response => {
        if (!response.errors) {
            store.dispatch(actions.isLogin(response.auth, response.user));
            history.push('/dashboard');
            return;
        }
        return response;
    }).catch(error => console.error('There was an error!', error));
}

export const logout = (history) => {
     return request('/api/logout').then(() => {
         store.dispatch(actions.signOut());
         history.push('/');
         return false
     }).catch(error => console.log(error));
}

export const register = (data) => {
    return request("/api/user", 'POST', data).then(response => {
        if (!response.errors) {
            store.dispatch(actions.register(response));
            return;
        }
        return response;
    }).catch(error => {
        console.error('There was an error!', error)
        return error;
    });
}

export const posts = (data = {}) => {
    /*let pages = data ? data.page : 10;
    let p = data ? data.p : 1;*/
    return request("/api/post").then(response => {
        if (!response.errors) {
            store.dispatch(actions.getPosts(response.data));
            return response.data;
        }
        return response;
    }).catch(error => {
        console.error('There was an error!', error)
        return error;
    });
}

export const showPost = (id) => {
    return request("/api/post/"+id).then(response => {
        if (!response.errors) {
            return response.data;
        }
        return response;
    }).catch(error => {
        console.error('There was an error!', error)
        return error;
    });
}