import React, { Component } from 'react';
import RegistrationService from '../../api/RegistrationService.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';


export default class EditUserApprovalComponent extends Component {

    constructor(props) {
        super(props);
        this.dataChange = this.dataChange.bind(this);
        this.submitUserApproval = this.submitUserApproval.bind(this);
        this.state = {
            registrationId: this.props.match.params.registrationId,
            status:true
        }
    }

    componentDidMount() {
    }

    dataChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <div className="editUserApproval">
                <form name="form1" id="form1" onSubmit={this.submitUserApproval}>
                    <h3>User Approval</h3>
                    <input type="hidden" id="registrationId" name="registrationId" value={this.props.match.params.registrationId}></input>
                    Email Id : <input type="text" id="emailId" name="emailId" readOnly value={this.props.match.params.emailId} /><br></br><br></br>
                    Status:
                    <input type="radio" id="status" name="status" value="TRUE" onChange={this.dataChange} checked/> Approve
                    <input type="radio" id="status" name="status" onChange={this.dataChange} value="FALSE" /> Reject
                    <br></br><br></br>
                    Notes : <textarea id="notes" name="notes" onChange={this.dataChange}></textarea><br></br><br></br>
                    <button type="submit">Submit</button><br></br><br></br>
                </form>
            </div>
        )
    }

    submitUserApproval(event) {
        event.preventDefault();
        if (navigator.onLine) {
            if($("#form1").valid()){
            var json = this.state
            console.log(json);
            RegistrationService.saveApproval(json)
                .then(response => {
                    this.props.history.push(`/listUserApproval/Approval updated successfully`)
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
            alert("You must be Online.")
        }
    }

}

