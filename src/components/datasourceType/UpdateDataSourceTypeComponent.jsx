import React, { Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';
import DataSourceTypeService from '../../api/DataSourceTypeService.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class UpdateDataSourceTypeComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            dataSourceType:
            {
                active: '',
                
                label: {
                    label_en: '',
                    // spaLabel: '',
                    // freLabel: '',
                    // porLabel: '',
                    labelId: '',
                }
            }
        }

        this.updateFieldData = this.updateFieldData.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
        this.cancelClicked=this.cancelClicked.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        console.log(this.props.location.state.dataSourceType);
        this.setState({
            dataSourceType: this.props.location.state.dataSourceType
        });


        $("#updatyeDataSourceTypeForm").validate({
            ignore: [],
            rules: {
                'dataSourceType.label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                }
                // 'dataSourceType.label.freLabel': {

                //     lettersonly: true,
                //     maxlength: 255
                // },
                // 'dataSourceType.label.spaLabel': {

                //     lettersonly: true,
                //     maxlength: 255
                // },
                // 'dataSourceType.label.porLabel': {

                //     lettersonly: true,
                //     maxlength: 255
                // }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });
    }

    updateFieldData(event) {
        let { dataSourceType } = this.state

        if (event.target.name === "dataSourceType.label.label_en") {
            console.log("inside if")
            dataSourceType.label.label_en = event.target.value
        } 
        // if (event.target.name === "dataSourceType.label.freLabel") {
        //     console.log("inside if")
        //     dataSourceType.label.freLabel = event.target.value
        // } if (event.target.name === "dataSourceType.label.spaLabel") {
        //     console.log("inside if")
        //     dataSourceType.label.spaLabel = event.target.value
        // } if (event.target.name === "dataSourceType.label.porLabel") {
        //     console.log("inside if")
        //     dataSourceType.label.porLabel = event.target.value
        // }
         else if (event.target.name === "dataSourceType.active") {
            dataSourceType.active = event.target.id === "dataSourceType.active2" ? false : true
        }


        this.setState(
            {
                dataSourceType
            }
        )
    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    cancelClicked() {
        this.props.history.push(`/dataSourceTypeList/` + "Action Canceled") 
    }

    updateForm() {

        if (navigator.onLine) {

            if ($("#updatyeDataSourceTypeForm").valid()) {

                DataSourceTypeService.editDataSourceType(this.state.dataSourceType).then(response => {
                    //this.props.history.push(`/languageList/${response.data.message}`)
                    this.props.history.push(`/dataSourceTypeList/${response.data.message}`)
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
        }else{

            alert("To perform this action you must be online.");
        }

    }

    render() {

        return (
            <>

                <h3>{myConst.UPDATE_DATA_SOURCE_TYPE}</h3>
                <form name="updatyeDataSourceTypeForm" id="updatyeDataSourceTypeForm">
                    <div>
                        <label>{myConst.DATASOURCE_TYPE_NAME_EN}:-</label>
                        <input type="text" name="dataSourceType.label.label_en" value={this.Capitalize(this.state.dataSourceType.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    {/* <div>
                        <label>{myConst.DATASOURCE_TYPE_NAME_FR}:-</label>
                        <input type="text" name="dataSourceType.label.freLabel" value={this.state.dataSourceType.label.freLabel} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.DATASOURCE_TYPE_NAME_SP}:-</label>
                        <input type="text" name="dataSourceType.label.spaLabel" value={this.state.dataSourceType.label.spaLabel} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.DATASOURCE_TYPE_NAME_PO}:-</label>
                        <input type="text" name="dataSourceType.label.porLabel" value={this.state.dataSourceType.label.porLabel} onChange={this.updateFieldData} />
                    </div>
                    <br /><br /> */}
                    <div>
                        {myConst.ACTIVE}:
                    <input type="radio" id="dataSourceType.active1" name="dataSourceType.active" value={true} checked={this.state.dataSourceType.active === true} onChange={this.updateFieldData} /> Active
                    <input type="radio" id="dataSourceType.active2" name="dataSourceType.active" value={false} checked={this.state.dataSourceType.active === false} onChange={this.updateFieldData} /> Disabled
                     </div>
                    {/* <input type="hidden" name="dataSourceType.labelId" value={this.state.dataSourceType.labelId} /> */}
                    <div>
                        <button type="button" onClick={this.updateForm}>{myConst.UPDATE_BUTTON}</button>
                        <button type="button" onClick={this.cancelClicked}>{myConst.BTN_CANCEL}</button><br></br><br></br>
                    </div>
                </form>



            </>
        );
    }


}

