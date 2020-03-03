import React, { Component } from 'react';
import UserService from "../../api/UserService.js";
import AuthenticationService from '../common/AuthenticationService.js';
import * as labels from '../../Labels.js'


export default class RoleListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            message: ""
        }
        this.editRole = this.editRole.bind(this);
        this.addNewRole = this.addNewRole.bind(this);
    }

    componentDidMount() {
        if (!AuthenticationService.checkTypeOfSession()) {
            alert("You can't change your session from online to offline or vice versa.");
            this.props.history.push(`/`)
        }
        AuthenticationService.setupAxiosInterceptors();
        UserService.getRoleList()
            .then(response => {
                console.log("rol list---" + response.data);
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
                                message: error.message
                            })
                            break
                    }
                }
            );
    }

    render() {
        return (
            <div className="roleList">
                <p>{this.props.match.params.message}</p>
                <h3>{this.state.message}</h3>
                <div>{labels.TITLE_ROLE_LIST}</div>
                <button className="btn btn-add" type="button" style={{ marginLeft: '-736px' }} onClick={this.addNewRole}>{labels.TITLE_ADD_ROLE}</button><br /><br />
                <table border="1" align="center">
                    <thead>
                        <tr>
                            <th>{labels.ROLE_ID}</th>
                            <th>{labels.ROLE_NAME_ENG}</th>
                            <th>{labels.ROLE_NAME_POR}</th>
                            <th>{labels.ROLE_NAME_FRE}</th>
                            <th>{labels.ROLE_NAME_SPA}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.roles.map(role =>
                                <tr key={role.roleId} onClick={() => this.editRole(role)}>
                                    <td>{role.roleId}</td>
                                    <td>{role.label.engLabel}</td>
                                    <td>{role.label.porLabel}</td>
                                    <td>{role.label.freLabel}</td>
                                    <td>{role.label.spaLabel}</td>
                                </tr>)
                        }
                    </tbody>
                </table>
                <br />
            </div>
        );
    }
    editRole(role) {
        this.props.history.push({
            pathname: "/editRole",
            state: { role: role }
        });
    }
    addNewRole() {
        if (navigator.onLine) {
            this.props.history.push(`/addRole`);
        } else {
            alert("You must be Online.")
        }
    }

}