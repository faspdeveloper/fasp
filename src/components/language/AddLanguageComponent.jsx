import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import * as myConst from '../../Labels.js';
import LanguageService from '../../api/LanguageService.js'
import AuthenticationService from '../common/AuthenticationService.js';


class AddLanguageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languageName: '',
            message: ''
        }
        this.updateFieldData = this.updateFieldData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
    }
    updateFieldData(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        $("#languageForm").validate({
            ignore: [],
            rules: {
                languageName: {
                    required: true,
                    lettersonly: true,
                    maxlength: 100
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });

    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    submitForm(event) {
        if (navigator.onLine) {
            if ($("#languageForm").valid()) {
                LanguageService.addLanguage(this.state).then(response => {
                    this.props.history.push(`/languageList/${response.data.message}`)
                }
                )
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
                    )
            }
        } else {
            alert("To perform this action you must be online.");
        }
    }

    render() {
        return (
<>
            
                {/* <h3>{myConst.ADD_LANGUAGE}</h3>
                <div><h5>{this.state.message}</h5></div>
                <form name="languageForm" id="languageForm">
                    <div>
                        <label>{myConst.LANGUAGE_NAME}:-</label>
                        <input type="text" name="languageName" value={this.Capitalize(this.state.languageName)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <button type="button" onClick={this.submitForm}>{myConst.SUBMIT_BUTTON}</button> */}

            <div className="page-content-wrap">
            <div><h5>{this.state.message}</h5></div>
                <div className="row">

                <div className="">
                    <ul class="breadcrumb">

                    </ul>
                </div>
                <div className="col-md-6 col-md-offset-3">

            <div className="login mt-2">
                <div className="panel panel-default Box-shadow">
                    <div className="panel-heading">
                        <h3 className="panel-title">Add Language</h3>

                    </div>
                     <div className="panel-body">
                    <div className="col-md-8 col-md-offset-2">
                            <div className="block">
                                  <form className="form-horizontal"name="languageForm" id="languageForm">
                                    <div className="form-group">
                                        <label className="col-md-4 control-label">{myConst.LANGUAGE_NAME}:-</label>
                                        <div className="col-md-8">
                                            <input type="text" name="languageName" value={this.Capitalize(this.state.languageName)} onChange={this.updateFieldData} className="form-control"></input>
                                        </div>
                                    </div>
                               </form>     

                 {/* <h3>{myConst.ADD_LANGUAGE}</h3> */}
              
            </div>
            </div>
            </div>
            
            <div className="panel-footer">
                     <button onClick={this.submitForm} type="button" className="btn btn-success pull-right">{myConst.SUBMIT_BUTTON}n</button></div>
                </div>
                </div>
               
                </div>
            </div>
        </div>
        </>
        );
    }
}
export default AddLanguageComponent;