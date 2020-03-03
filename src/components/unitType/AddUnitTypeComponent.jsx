import React, { Component } from 'react';
import * as myConst from '../../Labels.js';
import UnitTypeService from '../../api/UnitTypeService.js';
import AuthenticationService from '../common/AuthenticationService.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class AddUnitTypeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            unitType: {
                label: {
                    label_en: ''
                }
            }
        }
        this.updateFieldData = this.updateFieldData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.Capitalize = this.Capitalize.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        $("#unitTypeForm").validate({
            ignore: [],
            rules: {
                'label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });
    }
    updateFieldData(event) {
        let { unitType } = this.state
        if (event.target.name === "label.label_en") {
            //console.log("inside if")
            unitType.label.label_en = event.target.value
        }
        this.setState(
            {
                unitType
            }
        )
    }

    submitForm() {
        if ($("#unitTypeForm").valid()) {
            UnitTypeService.addUniType(this.state.unitType).then(response => {
                this.props.history.push(`/unitTypeList/${response.data.message}`)
                console.log("success");
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
    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render() {
        return (
            <>
                <h3>Add Unit Type</h3>
                <form name="unitTypeForm" id="unitTypeForm">
                    <div>
                        <label>Unit Type:-</label>
                        <input type="text" name="label.label_en" value={this.Capitalize(this.state.unitType.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <button type="button" onClick={this.submitForm}>{myConst.SUBMIT_BUTTON}</button>
                    </div>
                </form>
            </>
        );
    }
} 