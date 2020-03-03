import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import UserService from "../../api/UserService";
import * as labels from '../../Labels.js'
import AuthenticationService from '../common/AuthenticationService.js';


export default class AddUserComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            languageId: AuthenticationService.getLanguageId(),
            realms: [],
            languages: [],
            roles: []
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
    }

    componentDidMount() {
        if (!AuthenticationService.checkTypeOfSession()) {
            alert("You can't change your session from online to offline or vice versa.");
            this.props.history.push(`/`)
        }
        AuthenticationService.setupAxiosInterceptors();
        UserService.getRealmList()
            .then(response => {
                this.setState({
                    realms: response.data
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
        UserService.getLanguageList()
            .then(response => {
                this.setState({
                    languages: response.data
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
        UserService.getRoleList()
            .then(response => {
                this.setState({
                    roles: response.data
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

        $.validator.addMethod('strongUsername', function (value) {
            return /^(?=.*[a-zA-Z])[a-zA-Z.-_@]{6,30}$/.test(value);
        }, 'Username does not match with username policy.');
        $("#userForm").validate({
            ignore: [],
            rules: {
                emailId: {
                    required: true,
                    email: true
                },
                phoneNumber: {
                    required: true,
                    number: true
                },
                languageId: {
                    required: true
                },
                roles: {
                    required: true
                },
                username: {
                    required: true,
                    strongUsername: true
                }
            },
            errorPlacement: function (error, element) {
                if (element.hasClass('select')) {
                    error.insertAfter(element.next(".bootstrap-select"));
                    element.next("div").addClass("error");
                } else {
                    error.insertAfter(element);
                }
            }
        });

    }

    render() {
        const { realms } = this.state;
        const { languages } = this.state;
        const { roles } = this.state;

        let realmList = realms.length > 0
            && realms.map((item, i) => {
                return (
                    <option key={i} value={item.realmId}>
                        {(() => {
                            switch (this.state.languageId) {
                                case 2: return (item.label.label_pr !== null && item.label.label_pr !== "" ? item.label.label_pr : item.label.label_en);
                                case 3: return (item.label.label_fr !== null && item.label.label_fr !== "" ? item.label.label_fr : item.label.label_en);
                                case 4: return (item.label.label_sp !== null && item.label.label_sp !== "" ? item.label.label_sp : item.label.label_en);
                                default: return item.label.label_en;
                            }
                        })()}
                    </option>
                )
            }, this);
        let languagesList = languages.length > 0
            && languages.map((item, i) => {
                return (
                    <option key={i} value={item.languageId}>
                        {item.languageName}
                    </option>
                )
            }, this);
        let roleList = roles.length > 0
            && roles.map((item, i) => {
                return (
                    <option key={i} value={item.roleId}>
                        {(() => {
                            switch (this.state.languageId) {
                                case 2: return (item.label.label_pr !== null && item.label.label_pr !== "" ? item.label.label_pr : item.label.label_en);
                                case 3: return (item.label.label_fr !== null && item.label.label_fr !== "" ? item.label.label_fr : item.label.label_en);
                                case 4: return (item.label.label_sp !== null && item.label.label_sp !== "" ? item.label.label_sp : item.label.label_en);
                                default: return item.label.label_en;
                            }
                        })()}
                    </option>
                )
            }, this);
        return (
            <div className="addUser">
                <div className="page-content-wrap">
                    <div className="row">
                        <div className="">
                            <ul className="breadcrumb text-left" ><li><a href="#">Home</a></li><li><a href="#">Admin</a></li><li><a href="#">User</a></li><li><a href="#">Add User</a></li></ul>
                        </div>
                        <div><h5>{this.state.message}</h5></div>
                        <div className="col-md-8 col-md-offset-2">
                            <div className="login mt-2 block">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">Create new user</h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="col-md-8 col-md-offset-2">
                                            <div className="block">

                                                <form className="form-horizontal" name="userForm" id="userForm">

                                                    <div className="form-group">
                                                        <label className="req col-md-4  control-label"> {labels.REALM}</label>
                                                        <div className="col-md-8">
                                                            <select className="form-control" id="realmId" name="realmId">
                                                                <option value="">-Nothing Selected-</option>
                                                                {realmList}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="req col-md-4 control-label">{labels.USERNAME}</label>
                                                        <div className="col-md-8">
                                                            <input type="text" id="username" name="username" className="form-control"></input>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-4 control-label">{labels.EMAIL_ID} </label>
                                                        <div className="col-md-8">
                                                            <input type="text" id="emailId" name="emailId" className="form-control"></input>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-4 control-label">{labels.PHONE_NO}</label>
                                                        <div className="col-md-8">
                                                            <input type="text" id="phoneNumber" name="phoneNumber" maxLength="15" minLength="4" className="form-control"></input>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="col-md-4 control-label"> {labels.ROLE}</label>
                                                        <div className="col-md-8">
                                                            <select className="form-control" id="roles" name="roles" multiple={true}>
                                                                <option value="" disabled={true}>-Nothing Selected-</option>
                                                                {roleList}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="col-md-4 control-label">{labels.PREFERRED_LANGUAGE}</label>
                                                        <div className="col-md-8">
                                                            <select className="form-control" id="languageId" name="languageId">
                                                                <option value="">-Nothing Selected-</option>
                                                                {languagesList}
                                                            </select>
                                                        </div>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="panel-footer">

                                        <button className="btn btn-primary pull-right ml-1" type="button" onClick={this.cancelClicked}>{labels.BTN_CANCEL}</button>
                                        <button className="btn btn-success pull-right" type="button" onClick={this.submitClicked}>{labels.BTN_SUBMIT}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div></div>
        )
    }
    submitClicked() {
        if (navigator.onLine) {
            if (AuthenticationService.checkTypeOfSession()) {
                if ($("#userForm").valid()) {
                    var json = {
                        username: $("#username").val(),
                        emailId: $("#emailId").val(),
                        phoneNumber: $("#phoneNumber").val(),
                        realm: {
                            realmId: $("#realmId").val()
                        },
                        roleList: $("#roles").val(),
                        language: {
                            languageId: $("#languageId").val()
                        },
                        countryIds: $("#countryIds").val()
                    }
                    UserService.addNewUser(json)
                        .then(response => {
                            this.props.history.push(`/userList/${response.data.message}`)
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
                }
            } else {
                alert("You can't change your session from online to offline or vice versa.");
            }
        } else {
            alert("You must be Online.")
        }
    }
    cancelClicked() {
        this.props.history.push(`/userList/Action Canceled`)
    }

}

