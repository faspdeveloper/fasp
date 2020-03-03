import React, { Component } from "react";
import AuthenticationService from "./AuthenticationService.js";
import { Route, Redirect } from "react-router-dom";

class AuthenticatedRoute extends Component {

    render() {
        if (AuthenticationService.isUserLoggedIn()) {
            console.log("in user logged in");
            //console.log(AuthenticationService.isUserLoggedIn);

            return <Route {...this.props} />
        } else {
            console.log("in else")
            return <Redirect to="/login"/>
        }
    }

}

export default AuthenticatedRoute