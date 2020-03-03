import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import UserService from "../../api/UserService";
import * as labels from '../../Labels.js'
import AuthenticationService from '../common/AuthenticationService.js';
import '../../css/bootstrap/bootstrap.min.css';
import '../../App.css'


export default class AddRoleComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businessFunctions: [],
            roles: [],
            message: '',
            languageId: AuthenticationService.getLanguageId(),
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
        // this.dataChange = this.dataChange.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    // dataChange(event) {
    //     let { role } = this.state
    //     // console.log("business function---", event.target.value);
    //     console.log("name---------------" + event.target.name);
    //     switch (event.target.name) {
    //         case "role.label.label_en": role.label.label_en = event.target.value;
    //         case "role.label.label_pr": role.label.label_pr = event.target.value;
    //         case "role.label.label_fr": role.label.label_fr = event.target.value;
    //         case "role.label.label_sp": role.label.label_sp = event.target.value;
    //         case "role.businessFunctions": role.businessFunctions = Array.from(event.target.selectedOptions, (item) => item.value);
    //         case "role.canCreateRole": role.canCreateRole = event.target.value;
    //         default: [event.target.name] = event.target.value;
    //     }

    //     this.setState({
    //         role
    //     }, (
    //     ) => {
    //         console.log("state after update---", this.state.role)
    //     })
    // }

    // handleChange(event) {
    //     this.setState({
    //         role: {
    //             label: {
    //                 label_en: ''
    //             },
    //             businessFunctions: Array.from(event.target.selectedOptions, (item) => item.value)
    //         }
    //     }, (
    //     ) => {
    //         console.log("state after update---", this.state.role)
    //     });
    // }

    componentDidMount() {
        if (!AuthenticationService.checkTypeOfSession()) {
            alert("You can't change your session from online to offline or vice versa.");
            this.props.history.push(`/`)
        }
        AuthenticationService.setupAxiosInterceptors();
        UserService.getBusinessFunctionList()
            .then(response => {
                console.log("business functions---", response.data);
                this.setState({
                    businessFunctions: response.data
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
                console.log("role list---", response.data);
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



        $("#roleForm").validate({
            ignore: [],
            rules: {
                'role.label.label_en': {
                    required: true,
                    // lettersonly: true,
                    maxlength: 255

                },
                'role.label.label_pr': {
                    // lettersonly: true,
                    maxlength: 255
                },
                'role.label.label_fr': {
                    // lettersonly: true,
                    maxlength: 255
                },
                'role.label.label_sp': {
                    // lettersonly: true,
                    maxlength: 255
                },
                'role.businessFunctions': {
                    required: true
                },
                'role.canCreateRole': {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });

    }

    render() {
        const { businessFunctions } = this.state;
        const { roles } = this.state;

        let businessFunctionsList = businessFunctions.length > 0
            && businessFunctions.map((item, i) => {
                return (
                    <>
                        <option key={i} value={item.businessFunctionId}>
                            {(() => {
                                switch (this.state.languageId) {
                                    case 2: return (item.label.label_pr != null && item.label.label_pr != "" ? item.label.label_pr : item.label.label_en);
                                    case 3: return (item.label.label_fr != null && item.label.label_fr != "" ? item.label.label_fr : item.label.label_en);
                                    case 4: return (item.label.label_sp != null && item.label.label_sp != "" ? item.label.label_sp : item.label.label_en);
                                    default: return item.label.label_en;
                                }
                            })()}
                        </option>
                    </>
                )
            }, this);
        let roleList = roles.length > 0
            && roles.map((item, i) => {
                return (
                    <option key={i} value={item.roleId}>
                        {(() => {
                            switch (this.state.languageId) {
                                case 2: return (item.label.label_pr != null && item.label.label_pr != "" ? item.label.label_pr : item.label.label_en);
                                case 3: return (item.label.label_fr != null && item.label.label_fr != "" ? item.label.label_fr : item.label.label_en);
                                case 4: return (item.label.label_sp != null && item.label.label_sp != "" ? item.label.label_sp : item.label.label_en);
                                default: return item.label.label_en;
                            }
                        })()}
                    </option>
                )
            }, this);
        return (
            <div class="page-container page-navigation-toggled page-container-wide">
                <div class="page-content">
                    <ul class="breadcrumb">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Admin</a></li>
                        <li><a href="#">Role</a></li>
                        <li><a href="#">Add Role</a></li>
                    </ul>
                    <div class="page-content-wrap">
                        <div><h5>{this.state.message}</h5></div>
                        <div class="row">
                            <div class="col-md-12">

                                <form name="roleForm" id="roleForm" class="form-horizontal">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h3 class="panel-title">{labels.TITLE_ADD_ROLE}</h3>
                                        </div>
                                        <div class="panel-body">
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ROLE_NAME_ENG}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="role.label.label_en" class="form-control" name="role.label.label_en" />

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ROLE_NAME_POR}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="role.label.label_pr" name="role.label.label_pr" class="form-control" />

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ROLE_NAME_FRE}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="role.label.label_fr" name="role.label.label_fr" class="form-control" />

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ROLE_NAME_SPA}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="role.label.label_sp" name="role.label.label_sp" class="form-control" />

                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.BUSINESS_FUNCTION}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="role.businessFunctions" class="form-control" data-live-search="true" data-actions-box="true" name="role.businessFunctions" multiple={true}>
                                                        <option value="">-Nothing Selected-</option>
                                                        {businessFunctionsList}
                                                    </select>

                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.CAN_CREATE_ROLE}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="role.canCreateRole" className="form-control" data-live-search="true" data-actions-box="true" name="role.canCreateRole" multiple={true} onChange={this.dataChange}>
                                                        <option value="">-Nothing Selected-</option>
                                                        {roleList}
                                                    </select>

                                                </div>
                                            </div>
                                            <button type="button" className="btn btn-success" onClick={this.submitClicked}>{labels.BTN_SUBMIT}</button>
                                            <button type="button" className="btn btn-danger" onClick={this.cancelClicked}>{labels.BTN_CANCEL}</button><br></br><br></br>

                                        </div>
                                        <div class="panel-footer">
                                            <div class="pull-right">

                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    submitClicked() {
        console.log($("#role\\.businessFunctions").val())
        if (navigator.onLine) {
            if (AuthenticationService.checkTypeOfSession()) {
                if ($("#roleForm").valid()) {
                    var json = {
                        label: {
                            label_en: $("#role\\.label\\.label_en").val(),
                            label_pr: $("#role\\.label\\.label_pr").val(),
                            label_fr: $("#role\\.label\\.label_fr").val(),
                            label_sp: $("#role\\.label\\.label_sp").val()
                        },
                        businessFunctions: $("#role\\.businessFunctions").val(),
                        canCreateRole: $("#role\\.canCreateRole").val()
                    }
                    UserService.addNewRole(json)
                        .then(response => {
                            this.props.history.push(`/roleList/${response.data.message}`)
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
        this.props.history.push(`/roleList/` + "Action Canceled")
    }

}

