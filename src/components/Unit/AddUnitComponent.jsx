import React, { Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import UnitService from '../../api/UnitService';
import UnitTypeService from '../../api/UnitTypeService';
import * as myConst from '../../Labels.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class AddUnitComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message:'',
            unitCode:'',
            label: {
                label_en: ''
            },
            unitType: {
                unitTypeId: ''
            },
            unitTypeList: []
        }
        this.updateFieldData = this.updateFieldData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        UnitTypeService.getUnitTypeListAll().then(response => {
            //console.log(response.data)
            this.setState({
                unitTypeList: response.data
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
                                message: error.message
                            })
                            break
                    }
                }
            );
        $("#unitForm").validate({
            ignore: [],
            rules: {
                'label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
                'unitCode': {
                    required: true,
                    lettersonly: true,
                     maxlength:3
                },               
                'unitType.unitTypeId': {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });

    }

    updateFieldData(event) {
        let { unit } = this.state
        if (event.target.name === "label.label_en") {
            this.state.label.label_en = event.target.value
        }
        if (event.target.name === "unitCode") {
            this.state.unitCode = event.target.value.toUpperCase()
        }
        else if (event.target.name === "unitType.unitTypeId") {
            this.state.unitType.unitTypeId = event.target.value
        }

      
        this.setState(
            {
                unit
            }
        )


    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    submitForm() {

        if (navigator.onLine) {
            if ($("#unitForm").valid()) {
                console.log(this.state);
                //delete this.state["dataSourceTypeList"];
                UnitService.addUnit(this.state).then(response => {
                    this.props.history.push(`/unitList/${response.data.message}`)
                    // console.log("success");
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
        } else {
            alert("To perform this action you must be online.");

        }

    }


    render() {
        const { unitTypeList } = this.state;
        let unitTypes = unitTypeList.length > 0
            && unitTypeList.map((item, i) => {
                return (
                    <option key={i} value={item.unitTypeId}>{item.label.label_en}</option>
                )
            }, this);
        return (
            <>
                <div><h5>{this.state.message}</h5></div>
                <h3>{myConst.ADD_UNIT} </h3>
                <form name="unitForm" id="unitForm">
                    <div>
                        <label>{myConst.UNIT_NAME_EN}:-</label>
                        <input type="text" name="label.label_en" value={this.Capitalize(this.state.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.UNIT_CODE} :-</label>
                        <input type="text" name="unitCode" value={this.Capitalize(this.state.unitCode)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        {myConst.SELECT_UNIT_TYPE} : <select id="unitTypeId" name="unitType.unitTypeId" onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {unitTypes}
                        </select>
                    </div>
                    <br></br>
                    <div>
                        <button type="button" onClick={this.submitForm}>{myConst.SUBMIT_BUTTON}</button>
                    </div>
                </form>
            </>
        );

    }

}