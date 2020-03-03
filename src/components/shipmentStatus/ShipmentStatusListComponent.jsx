
import React, { Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import ShipmentStatusService from '../../api/ShipmentStatusService.js';
import * as myConst from '../../Labels.js';
export default class ShipmentStatusListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shipmentStatusList: []
        }
        this.editShipmentStatus=this.editShipmentStatus.bind(this);
        this.addNewShipmentStatus=this.addNewShipmentStatus.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        ShipmentStatusService.getShipmentStatusListAll().then(response => {
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

    }

    addNewShipmentStatus(){
        if (navigator.onLine) {
            this.props.history.push(`/addShipmentStatus`)
        } else {
            alert("You must be Online.")
        }

    }

    editShipmentStatus(shipmentStatus){
        this.props.history.push({
            pathname: "/editShipmentStatus",
            state: { shipmentStatus: shipmentStatus }
        });

    }

    render() {
        return (
            <>
                 <p>{this.props.match.params.message}</p>
                <div>
                    <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewShipmentStatus}>{myConst.ADD_NEW_SHIPMENT_STATUS}</button><br /><br />
                </div>

                <div className="shipmentStatusList">

                    <h1>{myConst.SHIPMENT_STATUS_LIST}</h1>
                    <table border="1" align="center">
                        <thead>
                            <tr>
                                <th>{myConst.SHIPMENTSTATUS_NAME_EN}</th>
                                <th>{myConst.SHIPMENTSTATUS_NAME_FR}</th>
                                <th>{myConst.SHIPMENTSTATUS_NAME_SP}</th>
                                <th>{myConst.SHIPMENTSTATUS_NAME_PO}</th>
                                <th>{myConst.DATA_SOURCE_TYPE_ACTIVE}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.shipmentStatusList.map(shipmentStatus =>

                                    <tr key={shipmentStatus.shipmentStatusId} onClick={() => this.editShipmentStatus(shipmentStatus)}>
                                        <td>{shipmentStatus.label.label_en}</td>
                                        <td>{shipmentStatus.label.label_fr}</td>
                                        <td>{shipmentStatus.label.label_sp}</td>
                                        <td>{shipmentStatus.label.label_pr}</td>
                                        <td>{shipmentStatus.active.toString() == "true" ? "Active" : "Disabled"}</td>
                                    </tr>
                                )

                            }
                        </tbody>
                    </table>
                </div>


            </>

        );


    }

}