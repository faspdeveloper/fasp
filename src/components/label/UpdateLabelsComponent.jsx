import React, { Component } from 'react';
import { Offline, Online } from "react-detect-offline";
import LabelsService from '../../api/LabelService.js';
import AuthenticationService from '../common/AuthenticationService.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class UpdateLabelsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            label: {
                labelId: '',
                label_sp: '',
                label_pr: '',
                label_fr: '',
                label_en: ''
            },
            // labelList: []
        }
        this.updateFieldData = this.updateFieldData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
        this.cancelClicked=this.cancelClicked.bind(this);
    }

    componentDidMount() {

        AuthenticationService.setupAxiosInterceptors();
        this.setState({
            label: this.props.location.state.label
        });
        $("#form1").validate({
            ignore: [],
            rules: {
                'label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
                'label.label_fr': {
                    
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
                'label.label_sp': {
                   
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
                'label.label_pr': {
                    
                    lettersonlywhitespace: true,
                    maxlength: 255
                }

            }
        });

    }
    updateFieldData(event) {
        let { label } = this.state
        if (event.target.name === "label.label_en") {
            label.label_en = event.target.value
        }
        if (event.target.name === "label.label_fr") {
            label.label_fr = event.target.value
        } if (event.target.name === "label.label_sp") {
            label.label_sp = event.target.value
        } else if (event.target.name === "label.label_pr") {
            label.label_pr = event.target.value
        }


        this.setState(
            {
                label
            }
        )

    }

    Capitalize(str) {
        if(str!=undefined){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    }
    cancelClicked() {
        this.props.history.push(`/labelList/` + "Action Canceled") 
    }
    submitForm() {

        if ($("#form1").valid()) {
            delete (this.state.label["createdDate"]);
            delete (this.state.label["lastModifiedDate"]);
            LabelsService.updateLabels(this.state.label).then(response => {
                this.props.history.push(`/labelList/${response.data.message}`)
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
                                    message: error.message
                                })
                                break
                        }
                    }
                )
        }


    }
    render() {


        return (
            <>
                <div className="page-content-wrap">
                    <div className="row">
                        <div>
                            <ul className="breadcrumb text-left">
                                <li><a href="#">Home</a></li>
                                <li><a href="#">Forms Stuff</a></li>
                                <li className="active">Form Wizards</li>
                            </ul>
                        </div>

                        <div className="col-md-8 col-md-offset-2">
                            <div className="login mt-2 block">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">Update Label</h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="col-md-6 col-md-offset-3">
                                            <div className="block">

                                                <form className="form-horizontal" name="form1" id="form1">


                                                    {/* <div className="form-group">
                                                        <label className="col-md-5 control-label ">Label :</label>
                                                        <div className="col-md-7">
                                                            <select name="label.labelId" className="validate[required] form-control select" id="formGender" onChange={this.updateFieldData}>
                                                                <option value="">Choose option</option>
                                                                {labelItems}
                                                            </select>
                                                            <span className="help-block"></span>
                                                        </div>
                                                    </div> */}

                                                    <input type="hidden" id="oldPassword" name="label.labelId" value={this.state.label.labelId} className="form-control" onChange={this.updateFieldData}></input>

                                                    <div className="form-group">
                                                        <label className="col-md-5 control-label">English  Label :</label>
                                                        <div className="col-md-7">
                                                            <input type="text" id="oldPassword" name="label.label_en" value={this.Capitalize(this.state.label.label_en)} className="form-control" onChange={this.updateFieldData}></input>
                                                            <span className="help-block"></span>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="col-md-5 control-label">French Label :</label>
                                                        <div className="col-md-7">
                                                            <input type="text" id="oldPassword" name="label.label_fr" value={this.Capitalize(this.state.label.label_fr)} className="form-control" onChange={this.updateFieldData}></input>
                                                            <span className="help-block"></span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-5 control-label ">Spanish Label  :</label>
                                                        <div className="col-md-7">
                                                            <input type="text" id="oldPassword" name="label.label_sp" value={this.Capitalize(this.state.label.label_sp)} className="form-control" onChange={this.updateFieldData}></input>
                                                            <span className="help-block"></span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-5 control-label ">Portuguese Label :</label>
                                                        <div className="col-md-7">
                                                            <input type="text" id="oldPassword" name="label.label_pr" value={this.Capitalize(this.state.label.label_pr)} className="form-control" onChange={this.updateFieldData}></input>
                                                            <span className="help-block"></span>
                                                        </div>
                                                    </div>


                                                </form>

                                            </div>
                                        </div>

                                    </div>
                                    <div className="panel-footer">

                                        <Online>
                                            <button type="button" onClick={this.cancelClicked} className="btn btn-primary pull-right ml-1">cancel</button>
                                        </Online>
                                        <Online>
                                            <button type="button" onClick={this.submitForm} className="btn btn-success pull-right">Update</button>
                                        </Online>
                                    </div>
                                </div>
                            </div>

                        </div></div></div>

            </>
        );

    }


}