import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import UserService from '../../api/UserService'
import CryptoJS from 'crypto-js'
import AuthenticationService from '../common/AuthenticationService.js';
import { Online } from "react-detect-offline";
import { SECRET_KEY } from '../../Constants.js'
import jwt_decode from 'jwt-decode'


export default class UpdateExpiredPasswordComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            username: this.props.location.state.username
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.logoutClicked = this.logoutClicked.bind(this);
    }


    componentDidMount() {
        let username = this.state.username;
        $.validator.addMethod('checkPassword', function () {
            if ($('#newPassword').val() === $('#confirmNewPassword').val()) {
                return true;
            } else {
                return false;
            }
        }, 'The New passwords do not match.');

        $.validator.addMethod('checkOldPassword', function () {
            if ($('#newPassword').val() == $('#oldPassword').val()) {
                console.log("same");
                return false;
            } else {
                console.log("different");
                return true;
            }
        }, "The new password can't be same as old password.");

        $.validator.addMethod('strongPassword', function (value) {
            if (username != value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{6,15}$/.test(value);
            } else {
                return false;
            }
        }, 'Password does not match with password policy.');

        $.validator.addMethod('startsWithLetter', function (value) {
            return /^[a-zA-Z]/i.test(value);
        }, 'Password must start with alphabet.');
        $.validator.addMethod('containsUppercaseLetter', function (value) {
            return /^(?=.*[A-Z]).*$/.test(value);
        }, 'Password must contain atleast 1 uppercase alphabet.');
        $.validator.addMethod('containsDigit', function (value) {
            return /^(?=.*\d).*$/.test(value);
        }, 'Password must contain atleast 1 number.');
        $.validator.addMethod('containsSpecialCharacters', function (value) {
            return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value);
        }, 'Password must contain atleast 1 special character.');
        $.validator.addMethod('notContainPasswordString', function (value) {
            return /^(?!.*password).*$/.test(value);
        }, 'Password should not contain password string.');
        $.validator.addMethod('notSameAsUsername', function (value) {
            if (username != value) {
                return true;
            }else{
                return false;
            }
        }, 'Password should not be same as username.');

        $("#form1").validate({
            ignore: [],
            rules: {
                oldPassword: {
                    required: true
                },
                newPassword: {
                    required: true,
                    checkOldPassword: true,
                    notSameAsUsername:true,
                    startsWithLetter: true,
                    containsUppercaseLetter: true,
                    containsDigit: true,
                    containsSpecialCharacters: true,
                    notContainPasswordString: true,
                    minlength: 6,
                    maxlength: 15
                },
                confirmNewPassword: {
                    required: true,
                    checkPassword: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });

    }

    render() {
        return (
            <div className="login">
                <form name="form1" id="form1">
                    <h3>Update Password</h3>
                    Old password : <input type="password" id="oldPassword" name="oldPassword" /><br></br><br></br>
                    New password : <input type="password" id="newPassword" name="newPassword" /><br></br><br></br>
                    Confirm new password : <input type="password" id="confirmNewPassword" name="confirmNewPassword" /><br></br><br></br>
                    <Online><button type="button" onClick={this.submitClicked}>Submit</button></Online>
                    <Online><button type="button" onClick={this.logoutClicked}>Logout</button><br></br><br></br></Online>
                    <div><h5>{this.state.message}</h5></div>
                </form>
            </div>
        )
    }

    submitClicked() {
        if ($("#form1").valid()) {
            if (navigator.onLine) {
                UserService.updateExpiredPassword(this.state.username, $('#oldPassword').val(), $('#newPassword').val())
                    .then(response => {
                        var decoded = jwt_decode(response.data.token);
                        localStorage.setItem('token-' + decoded.userId, CryptoJS.AES.encrypt((response.data.token).toString(), `${SECRET_KEY}`));
                        localStorage.setItem('username-' + decoded.userId, CryptoJS.AES.encrypt((decoded.user.username).toString(), `${SECRET_KEY}`));
                        localStorage.setItem('password-' + decoded.userId, CryptoJS.AES.encrypt((decoded.user.password).toString(), `${SECRET_KEY}`));
                        localStorage.setItem('typeOfSession', "Online");
                        localStorage.setItem('curUser', CryptoJS.AES.encrypt((decoded.userId).toString(), `${SECRET_KEY}`));
                        this.props.history.push(`/welcome/Password updated successfully.`)
                    })
                    .catch(
                        error => {
                            switch (error.message) {
                                case "Network Error":
                                    this.setState({
                                        message: error.message
                                    })
                                    break
                                default:
                                    this.setState({
                                        message: error.response.data.message
                                    })
                                    break
                            }
                        }
                    );
            } else {
                alert("You must be online to update the password.")
            }
        }
    }

    logoutClicked() {
        this.props.history.push(`/login/You are logged out.`)
    }
}

