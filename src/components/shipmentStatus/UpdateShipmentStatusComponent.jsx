import React, { Component } from 'react';
import * as myConst from '../../Labels.js';
import AuthenticationService from '../common/AuthenticationService.js';
import ShipmentStatusService from '../../api/ShipmentStatusService.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
export default class UpdateShipmentStatusComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shipmentStatus: {
                //nextShipmentStatusAllowed: [],
                shipmentStatusId: '',
                label: {
                    label_en: ''
                    // freLabel: '',
                    // spaLabel: '',
                    // porLabel: ''
                },
                active: ''
 
            },
            shipmentStatusList: []
        }
        this.updateFieldData = this.updateFieldData.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.cancelClicked=this.cancelClicked.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        //console.log(this.props.location.state.shipmentStatus);
        //AuthenticationService.setupAxiosInterceptors();
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
        this.setState({
            shipmentStatus: this.props.location.state.shipmentStatus
        });
        $("#updateShipmentStatusForm").validate({
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
    updateForm() {

        if (navigator.onLine) {

            if ($("#updateShipmentStatusForm").valid()) {
                //console.log(this.state.shipmentStatus);
                ShipmentStatusService.editShipmentStatus(this.state.shipmentStatus).then(response => {
                    //this.props.history.push(`/languageList/${response.data.message}`)
                    this.props.history.push(`/shipmentStatusListAll/${response.data.message}`)
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

    }
    cancelClicked() {
        this.props.history.push(`/shipmentStatusListAll/` + "Action Canceled") 
    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    updateFieldData(event) {
        let { shipmentStatus } = this.state
        if (event.target.name === "shipmentStatus.label.label_en") {
            //console.log("inside if")
            this.state.shipmentStatus.label.label_en = event.target.value
        }
        // if (event.target.name === "shipmentStatus.label.freLabel") {
        //     //console.log("inside if")
        //     this.state.shipmentStatus.label.freLabel = event.target.value
        // } 
        // if (event.target.name === "shipmentStatus.label.spaLabel") {
        //     //console.log("inside if")
        //     this.state.shipmentStatus.label.spaLabel = event.target.value
        // } if (event.target.name === "shipmentStatus.label.porLabel") {
        //     //console.log("inside if")
        //     this.state.shipmentStatus.label.porLabel = event.target.value
        // }
        if (event.target.name === "shipmentStatus.nextShipmentStatusAllowed") {
            this.state.shipmentStatus.nextShipmentStatusAllowed = Array.from(event.target.selectedOptions, (item) => item.value)
        } 
        else if (event.target.name === "shipmentStatus.active") {
            this.state.shipmentStatus.active = event.target.id === "shipmentStatus.active2" ? false : true
        }
        this.setState(
            {
                shipmentStatus
            }
        )
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
                <h3>{myConst.UPDATE_SHIPMENT_STATUS}</h3>
                <form name="updateShipmentStatusForm" id="updateShipmentStatusForm">
                    <div>
                        <label>{myConst.SHIPMENTSTATUS_NAME_EN}:-</label>
                        <input type="text" name="shipmentStatus.label.label_en" value={this.Capitalize(this.state.shipmentStatus.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    {/* <div>
                        <label>{myConst.SHIPMENTSTATUS_NAME_FR}:-</label>
                        <input type="text" name="shipmentStatus.label.freLabel" value={this.state.shipmentStatus.label.freLabel} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.SHIPMENTSTATUS_NAME_SP}:-</label>
                        <input type="text" name="shipmentStatus.label.spaLabel" value={this.state.shipmentStatus.label.spaLabel} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.SHIPMENTSTATUS_NAME_PO}:-</label>
                        <input type="text" name="shipmentStatus.label.porLabel" value={this.state.shipmentStatus.label.porLabel} onChange={this.updateFieldData} />
                    </div>
                    <br /><br /> */}
                    <div>
                        {myConst.ACTIVE}:
                    <input type="radio" id="shipmentStatus.active1" name="shipmentStatus.active" value={true} checked={this.state.shipmentStatus.active === true} onChange={this.updateFieldData} /> Active
                    <input type="radio" id="shipmentStatus.active2" name="shipmentStatus.active" value={false} checked={this.state.shipmentStatus.active === false} onChange={this.updateFieldData} /> Disabled
                     </div>
                    <br/><br />
                        <div>
                            <label>  {myConst.SELECT_NEXT_SHIPMENT_STATUS} :- </label><select id="shipmentStatusId" name="shipmentStatus.nextShipmentStatusAllowed" multiple="true" value={this.state.shipmentStatus.nextShipmentStatusAllowed} onChange={this.updateFieldData}>
                                <option value="">-Nothing Selected-</option>
                                {shipmentStatusItems}
                            </select>
                        </div>
                        <br/><br/>
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