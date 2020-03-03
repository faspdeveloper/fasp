import React, { Component } from "react";
import RegistrationService from '../../api/RegistrationService.js';

class UserApprovalComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUserApproval: []
        }
        this.updateUserApproval = this.updateUserApproval.bind(this);
    }


    componentDidMount() {
        RegistrationService.getUserApprovalList()
            .then(response => {
                console.log(response.data)
                this.setState({
                    listUserApproval: response.data
                })
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

    render() {
        return (
            <>
                <h1>List User Approval</h1>
                <p>{this.props.match.params.message}</p>
                <div className="container">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email Id</th>
                                <th>Created date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.listUserApproval.map(
                                    listUserApproval =>
                                        <tr key={listUserApproval.registrationId} onClick={() => this.updateUserApproval(listUserApproval.registrationId, listUserApproval.emailId)}>
                                            <td>{listUserApproval.firstName}</td>
                                            <td>{listUserApproval.lastName}</td>
                                            <td>{listUserApproval.emailId}</td>
                                            <td>{listUserApproval.createdDate}</td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>

            </>
        );
    }

    updateUserApproval(id, emailId) {
        console.log(id);
        console.log(emailId);
        this.props.history.push(`/editUserApproval/${id}/${emailId}`)
    }
}

export default UserApprovalComponent