import React, { Component } from 'react';
import UnitTypeService from '../../api/UnitTypeService';
import UnitService from '../../api/UnitService';
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class UpdateUnitComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {

            unit: {
                message:'',
                active: '',
                unitId: '',
                unitCode:'',
                label: {
                    label_en: '',
                    labelId: '',
                },
                unitType: {
                    unitTypeId: ''
                }
            },
            unitTypeList: []
        }
        this.updateFieldData = this.updateFieldData.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
        this.cancelClicked=this.cancelClicked.bind(this);
    }


    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
       
        this.setState({
            unit: this.props.location.state.unit
        });

        UnitTypeService.getUnitTypeListAll().then(response => {
            
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

        $("#updateUnitForm").validate({
            ignore: [],
            rules: {
                'unit.label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
                'unit.unitCode': {
                    required: true,
                    lettersonly: true,
                    maxlength:3
                },               
                'unit.unitType.unitTypeId': {
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

        if (event.target.name === "unit.label.label_en") {
            unit.label.label_en = event.target.value
        } 
        if (event.target.name === "unit.unitCode") {
            unit.unitCode = event.target.value.toUpperCase()
        } 
        if (event.target.name === "unit.unitType.unitTypeId") {
            unit.unitType.unitTypeId = event.target.value
        } else if (event.target.name === "unit.active") {
            unit.active = event.target.id === "unit.active2" ? false : true
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
    cancelClicked() {
        this.props.history.push(`/unitList/` + "Action Canceled") 
    }
    updateForm() {

        if (navigator.onLine) {
            if ($("#updateUnitForm").valid()) {
                UnitService.updateUnit(this.state.unit).then(response => {
                    this.props.history.push(`/unitList/${response.data.message}`)
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
                <h3>{myConst.UPDATE_UNIT}</h3>
                <form name="updateUnitForm" id="updateUnitForm">
                    <div>
                        <label>{myConst.UNIT_NAME_EN}:-</label>
                        <input type="text" name="unit.label.label_en" value={this.Capitalize(this.state.unit.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.UNIT_CODE} :-</label>
                        <input type="text" name="unit.unitCode" value={this.Capitalize(this.state.unit.unitCode)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
              
                    <div>
                        {myConst.ACTIVE}:
                    <input type="radio" id="unit.active1" name="unit.active" value={true} checked={this.state.unit.active === true} onChange={this.updateFieldData} /> Active
                    <input type="radio" id="unit.active2" name="unit.active" value={false} checked={this.state.unit.active === false} onChange={this.updateFieldData} /> Disabled
                     </div>
                    <br /><br />
                    <div>
                    {myConst.SELECT_UNIT_TYPE} : <select id="unitTypeId" name="unit.unitType.unitTypeId" value={this.state.unit.unitType ? this.state.unit.unitType.unitTypeId : ''} onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {unitTypes}
                        </select>
                    </div>
                    <br /><br />
                    {/* <input type="hidden" name="unit.uniId" value={this.state.dataSource.dataSourceId} /> */}
                    {/* <input type="hidden" name="dataSource.label.labelId" value={this.state.dataSource.label.labelId} /> */}
                    <div>
                        <button type="button" onClick={this.updateForm}>{myConst.UPDATE_BUTTON}</button>
                        <button type="button" onClick={this.cancelClicked}>{myConst.BTN_CANCEL}</button><br></br><br></br>
                    </div>
                </form>
            </>

        );


    }




}