import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Post from "./components/Posts";
import MenuBar from "./components/MenuBar";
import {useSelector} from "react-redux";
import ViewPost from "./components/ViewPost";

function IsLogin() {
    const {isLogin} = useSelector(state => ({
        isLogin: state.isLogin,
    }))

    if (!isLogin) {
        return (
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route exact path="/" component={Post} />
                <Route exact={true} path='/post/:id' component={ViewPost} />
            </Switch>
        );
    }
    return (
        <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route exact={true} path='/post:id' component={ViewPost} />
            <Route exact path='/' component={Post} />
        </Switch>
    );
}


export default function RouterApp() {
    return (
        <Router>
            <div>
                <MenuBar/>
                <IsLogin/>
            </div>
        </Router>
    );
}