import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import LoginService from '../../api/LoginService'
import CryptoJS from 'crypto-js'
import AuthenticationService from '../common/AuthenticationService.js';
import { Online } from "react-detect-offline";
import bcrypt from 'bcryptjs';
import jwt_decode from 'jwt-decode'
import { SECRET_KEY } from '../../Constants.js'
import '../../Customui.css';


export default class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
        this.loginClicked = this.loginClicked.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
    }

    componentDidMount() {
        $("#form1").validate({
            ignore: [],
            rules: {
                emailId: {
                    required: true
                },
                password: {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });

    }

    render() {
        return (



            <div className="login-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="login-main">

                            <div className="row">
                                <div className="col-md-6 col-md-offset-2">
                                    <div className="inp-Section">

                                        <form name="form1" id="form1">


                                            <div className="form-group">

                                                <div className="col-md-8 text-center">

                                                    <p>{this.props.match.params.message}</p>

                                                </div>
                                            </div>
                                            <div className="form-group">

                                                <div className="col-md-8">

                                                    <div className="input-group">
                                                        <span className="input-group-addon Inp-icon"><span className="fa fa-envelope"></span></span>
                                                        <input type="text" id="emailId" name="emailId" className="form-control Inp-login"></input>
                                                    </div>
                                                    <span className="help-block"></span>

                                                </div>
                                            </div>

                                            <div className="form-group">

                                                <div className="col-md-8">

                                                    <div className="input-group Inp-pass">
                                                        <span className="input-group-addon Inp-icon"><span className="fa fa-lock"></span></span>
                                                        <input type="password" id="password" name="password" className="form-control Inp-login"></input>
                                                    </div>
                                                    <span className="help-block"></span>
                                                </div>
                                            </div>

                                            {/* <div className="form-group">

                                                <div className="col-md-8">
                                                    <div className="Login-remember text-left">
                                                        <label className="check">
                                                            <input type="checkbox" className="icheckbox" checked="checked" />Remember Me</label>
                                                        <span className="help-block"></span></div>
                                                </div>
                                            </div> */}

                                            <div className="form-group">

                                                <div className="col-md-8">
                                                    <div className="Login-forgot text-left">
                                                        <Online><a href="" onClick={this.forgotPassword}>Forgot Password?</a></Online>
                                                        <div><h5>{this.state.message}</h5></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">

                                                <div className="col-md-8">
                                                    <div className="text-center Login-btnDiv">
                                                        <button type="button" className=" Login-btn" onClick={this.loginClicked}><span>Login</span></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        )
    }

    loginClicked() {
        var username = $("#emailId").val();
        var password = $("#password").val();
        if ($("#form1").valid()) {
            if (navigator.onLine) {
                LoginService.authenticate(username, password)
                    .then(response => {
                        var decoded = jwt_decode(response.data.token);
                        console.log("user id---" + decoded.userId);
                        localStorage.removeItem("token-" + decoded.userId);
                        localStorage.removeItem('username-' + decoded.userId);
                        localStorage.removeItem('password-' + decoded.userId);
                        localStorage.removeItem('curUser');

                        localStorage.setItem('token-' + decoded.userId, CryptoJS.AES.encrypt((response.data.token).toString(), `${SECRET_KEY}`));
                        localStorage.setItem('username-' + decoded.userId, CryptoJS.AES.encrypt((decoded.user.username).toString(), `${SECRET_KEY}`));
                        localStorage.setItem('password-' + decoded.userId, CryptoJS.AES.encrypt((decoded.user.password).toString(), `${SECRET_KEY}`));
                        localStorage.setItem('typeOfSession', "Online");
                        localStorage.setItem('curUser', CryptoJS.AES.encrypt((decoded.userId).toString(), `${SECRET_KEY}`));
                        console.log("local storage length---" + localStorage.length);
                        console.log("user cur ---" + localStorage.getItem("curUser"));
                        AuthenticationService.setupAxiosInterceptors();
                        this.props.history.push(`/welcome`)
                    })
                    .catch(
                        error => {
                            if (error.response != null && error.response.status === 401) {
                                switch (error.response.data) {
                                    case "Password expired":
                                        this.setState({
                                            message: error.response.data
                                        })
                                        this.props.history.push({
                                            pathname: "/updateExpiredPassword",
                                            state: {
                                                username: username
                                            }
                                        });
                                        break
                                    default:
                                        this.setState({
                                            message: error.response.data
                                        })
                                        break
                                }
                            } else {
                                switch (error.message) {
                                    case "Network Error":
                                        this.setState({
                                            message: error.message
                                        })
                                        break
                                    default:
                                        this.setState({
                                            message: error.message
                                        })
                                        break
                                }
                            }
                        }
                    );
            }
            else {
                var decryptedPassword = AuthenticationService.isUserLoggedIn(username, password);
                if (decryptedPassword != "") {
                    bcrypt.compare(password, decryptedPassword, function (err, res) {
                        if (err) {
                            this.setState({ message: 'Error occured' });
                        }
                        if (res) {
                            localStorage.setItem('typeOfSession', "Offline");
                            localStorage.setItem('curUser', CryptoJS.AES.encrypt(localStorage.getItem("tempUser").toString(), `${SECRET_KEY}`));
                            localStorage.removeItem("tempUser");
                            this.props.history.push(`/welcome`)
                        } else {
                            this.setState({ message: 'Bad credentials.' });
                        }
                    }.bind(this));
                }
                else {
                    this.setState({ message: 'User not found.' });
                }
            }
        }
    }

    forgotPassword() {
        this.props.history.push(`/forgotPassword`)
    }
}

