import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import RegistrationService from "../../api/RegistrationService.js";


export default class RegistrationComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
        this.registerClicked = this.registerClicked.bind(this);
        this.dataChange = this.dataChange.bind(this);
    }

    componentDidMount() {
        $.validator.addMethod('nofreeemail', function (value) {
            return /^([\w-.]+@(?!gmail\.com)(?!yahoo\.com)(?!hotmail\.com)([\w-]+.)+[\w-]{2,4})?$/.test(value);
        }, 'Free email addresses are not allowed.');


        $("#form1").validate({
            ignore: [],
            rules: {
                firstName: {
                    required: true
                },
                lastName: {
                    required: true
                },
                emailId: {
                    required: true,
                    email: true,
                    nofreeemail:true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });

    }

    dataChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <div className="register">
                <form name="form1" id="form1" onSubmit={this.registerClicked}>
                    <h3>Sign Up</h3>
                    First Name : <input type="text" id="firstName" name="firstName" onChange={this.dataChange} /><br></br><br></br>
                    Last Name : <input type="text" id="lastName" name="lastName" onChange={this.dataChange} /><br></br><br></br>
                    Email Id : <input type="text" id="emailId" name="emailId" onChange={this.dataChange} /><br></br><br></br>
                    <button type="submit">Sign Up</button><br></br><br></br>
                    <div><h5>{this.state.message}</h5></div>
                </form>
            </div>
        )
    }

    registerClicked(event) {
        event.preventDefault();
        if (navigator.onLine) {
            var json = this.state
            if ($("#form1").valid()) {
                RegistrationService.saveRegistration(json)
                    .then(response => {
                        this.props.history.push(`/login/${response.data.message}`)
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

