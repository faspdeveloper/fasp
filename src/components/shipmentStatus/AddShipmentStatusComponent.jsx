import React, { Component } from 'react';
import * as myConst from '../../Labels.js';
import AuthenticationService from '../common/AuthenticationService.js';
import ShipmentStatusService from '../../api/ShipmentStatusService.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class AddShipmentStatusComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shipmentStatus: {
                label: {
                    label_en: '' 
                    // freLabel: '',
                    // spaLabel: '',
                    // porLabel: ''
                },
                nextShipmentStatusAllowed: []
            },
            shipmentStatusList: []
        }

        this.updateFieldData = this.updateFieldData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
    }


    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        ShipmentStatusService.getShipmentStatusListActive().then(response => {
            //console.log(response.data)
            this.setState({
                shipmentStatusList: response.data
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
        $("#shipmentStatusForm").validate({
            ignore: [],
            rules: {
                'shipmentStatus.label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                }
                // 'shipmentStatus.label.freLabel': {

                //     lettersonly: true,
                //     maxlength: 255
                // },
                // 'shipmentStatus.label.spaLabel': {

                //     lettersonly: true,
                //     maxlength: 255
                // },
                // 'shipmentStatus.label.porLabel': {

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
        if (event.target.name === "shipmentStatus.label.label_en") {
            //console.log("inside if")
            this.state.shipmentStatus.label.label_en = event.target.value
        }
        // if (event.target.name === "shipmentStatus.label.freLabel") {
        //     //console.log("inside if")
        //     this.state.shipmentStatus.label.freLabel = event.target.value
        // } if (event.target.name === "shipmentStatus.label.spaLabel") {
        //     //console.log("inside if")
        //     this.state.shipmentStatus.label.spaLabel = event.target.value
        // }if (event.target.name === "shipmentStatus.label.porLabel") {
        //     //console.log("inside if")
        //     this.state.shipmentStatus.label.porLabel = event.target.value
        // }
        else if (event.target.name === "shipmentStatus.nextShipmentStatusAllowed") {
            this.state.shipmentStatus.nextShipmentStatusAllowed = Array.from(event.target.selectedOptions, (item) => item.value)
        }


        let { shipmentStatus } = this.state
        this.setState(
            {
                shipmentStatus
            }
        )
    }

    submitForm() {
        if (navigator.onLine) {
            if ($("#shipmentStatusForm").valid()) {
                console.log(this.state);
                ShipmentStatusService.addShipmentStatus(this.state.shipmentStatus).then(response => {
                    this.props.history.push(`/shipmentStatusListAll/${response.data.message}`)
                    //console.log("success");
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
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    render() {

        const { shipmentStatusList } = this.state;
        let shipmentStatusItems = shipmentStatusList.length > 0
            && shipmentStatusList.map((item, i) => {
                return (
                    <option key={i} value={item.shipmentStatusId}>{item.label.label_en}</option>
                )
            }, this);
        return (
            <>
                <h3>{myConst.ADD_SHIPMENT_STATUS}</h3>
                <form name="shipmentStatusForm" id="shipmentStatusForm">
                    <div>
                        <label>{myConst.SHIPMENTSTATUS_NAME_EN}:-</label>
                        <input type="text" name="shipmentStatus.label.label_en" value={this.Capitalize(this.state.shipmentStatus.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    {/* <div>
                        <label>{myConst.SHIPMENTSTATUS_NAME_FR}:-</label>
                        <input type="text" name="shipmentStatus.label.freLabel" onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.SHIPMENTSTATUS_NAME_SP}:-</label>
                        <input type="text" name="shipmentStatus.label.spaLabel" onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.SHIPMENTSTATUS_NAME_PO}:-</label>
                        <input type="text" name="shipmentStatus.label.porLabel" onChange={this.updateFieldData} />
                    </div>
                    <br /><br /> */}
                 
                    <div>
                       
                        <label>  {myConst.SELECT_NEXT_SHIPMENT_STATUS} :- </label><select id="shipmentStatusId" name="shipmentStatus.nextShipmentStatusAllowed" multiple="true" onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {shipmentStatusItems}
                        </select>
                        
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