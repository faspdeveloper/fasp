import React, { Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';
import UnitTypeService from '../../api/UnitTypeService.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';


export default class UpdateUnitTypeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            unitType: {
                unitTypeId: '',
                label: {
                    labelId: '',
                    label_en: ''
                }
            }
        }
        this.Capitalize = this.Capitalize.bind(this);
        this.updateFieldData = this.updateFieldData.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        console.log(this.props.location.state.unitType);
        this.setState({
            unitType: this.props.location.state.unitType
        });
        $("#updateUnitTypeForm").validate({
            ignore: [],
            rules: {
                'unitType.label.label_en': {
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
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    updateFieldData(event) {
        let { unitType } = this.state
        if (event.target.name === "unitType.label.label_en") {
            //console.log("inside if")
            unitType.label.label_en = event.target.value
        }
        this.setState(
            {
                unitType
            }
        )

    }

    updateForm() {
        if ($("#updateUnitTypeForm").valid()) {
            // delete (this.state.unitType["createdDate"]);
            // delete (this.state.unitType["lastModifiedDate"]);
            console.log(this.state);
            UnitTypeService.updateUnitType(this.state.unitType).then(response => {
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
                                    message: error.message
                                })
                                break
                        }
                    }
                )
        }
    }

    cancelClicked() {
        this.props.history.push(`/unitTypeList/` + "Action Canceled")
    }

    render() {

        return (
            <>
                <h3>{myConst.UPDATE_UNIT_TYPE}</h3>
                <form name="updateUnitTypeForm" id="updateUnitTypeForm">
                    <div>
                        <label>{myConst.UNIT_TYPE_NAME_EN}:-</label>
                        <input type="text" name="unitType.label.label_en" value={this.Capitalize(this.state.unitType.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    {/*                   
                    <div>
                        {myConst.ACTIVE}:
                    <input type="radio" id="dataSourceType.active1" name="dataSourceType.active" value={true} checked={this.state.dataSourceType.active === true} onChange={this.updateFieldData} /> Active
                    <input type="radio" id="dataSourceType.active2" name="dataSourceType.active" value={false} checked={this.state.dataSourceType.active === false} onChange={this.updateFieldData} /> Disabled
                     </div> */}

                    <div>
                        <button type="button" onClick={this.updateForm}>{myConst.UPDATE_BUTTON}</button>
                        <button type="button" onClick={this.cancelClicked}>{myConst.BTN_CANCEL}</button><br></br><br></br>
                    </div>
                </form>


            </>

        );
    }
}