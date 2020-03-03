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
            role: this.props.location.state.role
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
        this.dataChange = this.dataChange.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (!AuthenticationService.checkTypeOfSession()) {
            alert("You can't change your session from online to offline or vice versa.");
            this.props.history.push(`/`)
        }
        AuthenticationService.setupAxiosInterceptors();
        // this.setState({
        //     role: this.props.location.state.role
        // });
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
                'role.label.engLabel': {
                    required: true,
                    // lettersonly: true,
                    maxlength: 255

                },
                'role.label.porLabel': {
                    // lettersonly: true,
                    maxlength: 255
                },
                'role.label.freLabel': {
                    // lettersonly: true,
                    maxlength: 255
                },
                'role.label.spaLabel': {
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
    dataChange(event) {
        let { role } = this.state
        console.log("name---------------" + event.target.name);
        if (event.target.name === "role.label.engLabel") {
            role.label.engLabel = event.target.value
        } else if (event.target.name === "role.label.porLabel") {
            role.label.porLabel = event.target.value
        }
        else if (event.target.name === "role.label.freLabel") {
            role.label.freLabel = event.target.value
        }
        else if (event.target.name === "role.label.spaLabel") {
            role.label.spaLabel = event.target.value
        }
        else if (event.target.name === "role.businessFunctions") {
            role.businessFunctions = Array.from(event.target.selectedOptions, (item) => item.value)
        }

        else if (event.target.name === "role.canCreateRole") {
            role.canCreateRole = Array.from(event.target.selectedOptions, (item) => item.value)
        }
        // switch (event.target.name) {
        //     case "role.label.engLabel": role.label.engLabel = event.target.value;
        //     case "role.label.porLabel": role.label.porLabel = event.target.value;
        //     case "role.label.freLabel": role.label.freLabel = event.target.value;
        //     case "role.label.spaLabel": role.label.spaLabel = event.target.value;
        //     // case "role.businessFunctions": role.businessFunctions = Array.from(event.target.selectedOptions, (item) => item.value);
        //     // case "role.canCreateRole": role.canCreateRole = event.target.value;
        //     // default: [event.target.name] = event.target.value;
        // }

        this.setState({
            role
        }, (
        ) => {
            console.log("state after update---", this.state.role)
        })
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
                                    case 2: return (item.label.porLabel != null && item.label.porLabel != "" ? item.label.porLabel : item.label.engLabel);
                                    case 3: return (item.label.freLabel != null && item.label.freLabel != "" ? item.label.freLabel : item.label.engLabel);
                                    case 4: return (item.label.spaLabel != null && item.label.spaLabel != "" ? item.label.spaLabel : item.label.engLabel);
                                    default: return item.label.engLabel;
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
                                case 2: return (item.label.porLabel != null && item.label.porLabel != "" ? item.label.porLabel : item.label.engLabel);
                                case 3: return (item.label.freLabel != null && item.label.freLabel != "" ? item.label.freLabel : item.label.engLabel);
                                case 4: return (item.label.spaLabel != null && item.label.spaLabel != "" ? item.label.spaLabel : item.label.engLabel);
                                default: return item.label.engLabel;
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
                        <li><a href="#">Edit Role</a></li>
                    </ul>
                    <div class="page-content-wrap">
                        <div><h5>{this.state.message}</h5></div>
                        <div class="row">
                            <div class="col-md-12">

                                <form name="roleForm" id="roleForm" class="form-horizontal">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h3 class="panel-title">{labels.TITLE_EDIT_ROLE}</h3>
                                        </div>
                                        <div class="panel-body">
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ROLE_NAME_ENG}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="role.label.engLabel" class="form-control" name="role.label.engLabel" value={this.state.role.label.engLabel} onChange={this.dataChange} readOnly={true} />
                                                    
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ROLE_NAME_POR}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="role.label.porLabel" name="role.label.porLabel" class="form-control" value={this.state.role.label.porLabel} onChange={this.dataChange} readOnly={true} />
                                                    
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ROLE_NAME_FRE}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="role.label.freLabel" name="role.label.freLabel" class="form-control" value={this.state.role.label.freLabel} onChange={this.dataChange} readOnly={true} />
                                                    
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ROLE_NAME_SPA}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="role.label.spaLabel" name="role.label.spaLabel" class="form-control" value={this.state.role.label.spaLabel} onChange={this.dataChange} readOnly={true} />
                                                    
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.BUSINESS_FUNCTION}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="role.businessFunctions" class="form-control" data-live-search="true" data-actions-box="true" name="role.businessFunctions" multiple={true} value={this.state.role.businessFunctions} onChange={this.dataChange} placeholder="Please select business function">
                                                        <option value="">-Nothing Selected-</option>
                                                        {businessFunctionsList}
                                                    </select>
                                                    
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.CAN_CREATE_ROLE}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="role.canCreateRole" className="form-control" data-live-search="true" data-actions-box="true" name="role.canCreateRole" multiple={true} value={this.state.role.canCreateRole} onChange={this.dataChange}>
                                                        <option value="">-Nothing Selected-</option>
                                                        {roleList}
                                                    </select>
                                                    
                                                </div>
                                            </div>
                                            <button type="button" className="btn btn-success" onClick={this.submitClicked}>{labels.BTN_UPDATE}</button>
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

                    UserService.editRole(this.state.role)
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

