import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import UserService from '../../api/UserService'
import { Online } from "react-detect-offline";

export default class ForgotPasswordComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
    }

    componentDidMount() {
        $("#form1").validate({
            ignore: [],
            rules: {
                username: {
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

            <div className="page-content-wrap">

    <div className="row">
        <div className="">
            <ul class="breadcrumb">

            </ul>
        </div>

        <div className="col-md-6 col-md-offset-3">
            <div className="login mt-2">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Forgot Password</h3>
                    </div>
                    <div className="panel-body">
                        <div className="col-md-8 col-md-offset-2">
                            <div className="block login">

                                <form className="form-horizontal"name="form1" id="form1">
                                    <div className="form-group">
                                        <label className="col-md-4 control-label">  Username :</label>
                                        <div className="col-md-8">
                                            <input type="text" id="username" name="username" className="form-control"></input>
                                        </div>
                                    </div>

                                    <div>
                                        <h5>{this.state.message}</h5></div>
                                </form>
                            </div>
                        </div>

                    </div>
                    <div className="panel-footer">

                        <Online>
                            <button onClick={this.cancelClicked} type="button" className="btn btn-primary pull-right ml-1">cancel</button>
                        </Online>
                        <Online>
                            <button onClick={this.submitClicked} type="button" className="btn btn-success pull-right">Submit</button>
                        </Online>

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
                UserService.forgotPassword($('#username').val())
                    .then(response => {
                        // console.log(response.statusText)
                        this.props.history.push(`/login/${response.data.message}`)
                    })
                    .catch(
                        error => {
                            console.log(error.message);
                            console.log(error.text);
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
                alert("You must be Online to update the password.")
            }
        }
    }

    cancelClicked() {
        this.props.history.push(`/login/Action Canceled.`)
    }
}

