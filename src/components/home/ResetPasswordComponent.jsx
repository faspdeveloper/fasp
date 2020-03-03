import React, { Component } from 'react';

import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import UserService from '../../api/UserService'
import CryptoJS from 'crypto-js'
import AuthenticationService from '../common/AuthenticationService.js';
import { Online } from "react-detect-offline";
import { SECRET_KEY } from '../../Constants.js'


export default class ResetPasswordComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            username: this.props.match.params.username,
            token: this.props.match.params.token
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
    }

    componentDidMount() {
        let username = this.state.username;
        console.log("username---" + this.state.username);
        console.log("token---" + this.state.token);
        // AuthenticationService.setupAxiosInterceptors();
        UserService.confirmForgotPasswordToken(this.state.username, this.state.token)
            .then(response => {
                console.log("response---", response);
                this.setState({
                    message: response.data.message
                })
            }).catch(
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
        $.validator.addMethod('checkPassword', function () {
            if ($('#newPassword').val() === $('#confirmNewPassword').val()) {
                return true;
            } else {
                return false;
            }
        }, 'The new password does not match.');
        $.validator.addMethod('strongPassword', function (value) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{6,15}$/.test(value);
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
                newPassword: {
                    required: true,
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
            <div className="page-content-wrap">
                <div className="row">
                    <div className=""><ul class="breadcrumb">
                    </ul></div>
                    <div className="col-md-8 col-md-offset-2">
                        <div className="login mt-2">
                            <div className="panel panel-default Box-shadow">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Update Password</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="col-md-8 col-md-offset-2">
                                        <div className="block">

                                            <form className="form-horizontal" name="form1" id="form1">
                                                <div className="form-group">
                                                    <label className="col-md-4 control-label">New Password :</label>
                                                    <div className="col-md-8">
                                                        <input type="password" id="newPassword" name="newPassword" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="col-md-4 control-label">Confirm Password :</label>
                                                    <div className="col-md-8">
                                                        <input type="password" id="confirmNewPassword" name="confirmNewPassword" className="form-control" />
                                                    </div>
                                                </div>


                                                <div><h5>{this.state.message}</h5></div>
                                            </form>
                                        </div>
                                    </div>



                                </div>
                                <div className="panel-footer">

                                    <Online><button type="button" onClick={this.cancelClicked} className="btn btn-primary pull-right ml-1">cancel</button></Online>
                                    <Online>  <button type="button" onClick={this.submitClicked} className="btn btn-success pull-right">Submit</button></Online>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    submitClicked() {
        if ($("#form1").valid()) {
            if (navigator.onLine) {
                UserService.updatePassword(this.state.username, this.state.token, $('#newPassword').val())
                    .then(response => {
                        if (response.data.status != "Failed") {
                            this.props.history.push(`/login/${response.data.message}`)
                        } else {
                            this.setState({
                                message: response.data.message
                            })
                        }
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

    cancelClicked() {
        this.props.history.push(`/login/Action canceled.`)
    }
}

