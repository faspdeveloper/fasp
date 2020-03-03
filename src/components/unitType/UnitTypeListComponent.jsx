import React, { Component } from 'react';
import UnitTypeService from '../../api/UnitTypeService.js';
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';


export default class UnitTypeListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            unitTypeList: []
        }
        this.addNewUnitType = this.addNewUnitType.bind(this);
        this.editUnitType = this.editUnitType.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        UnitTypeService.getUnitTypeListAll().then(response => {
            console.log(response.data)
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
    }

    editUnitType(unitType) {
        this.props.history.push({
            pathname: "/editUnitType",
            state: { unitType: unitType }
        });
    }

    addNewUnitType() {
        if (navigator.onLine) {
            this.props.history.push(`/addUnitType`)
        } else {
            alert("You must be Online.")
        }

    }
    render() {

        return (
            <>
                <p>{this.props.match.params.message}</p>
                <div>
                    <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewUnitType}>{myConst.ADD_NEW_UNIT_TYPE}</button><br /><br />
                </div>

                <div className="unitTypeList">

                    <h1>{myConst.UNIT_TYPE_LIST}</h1>
                    <table border="1" align="center">
                        <thead>
                            <tr>
                                <th>{myConst.UNIT_TYPE_NAME_EN}</th>
                                <th>{myConst.UNIT_TYPE_NAME_FR}</th>
                                <th>{myConst.UNIT_TYPE_NAME_SP}</th>
                                <th>{myConst.UNIT_TYPE_NAME_PO}</th>
                                {/* <th>{myConst.CREATED_DATE}</th> */}
                                {/* <th>{myConst.LAST_MODIFIED_DATE}</th> */}

                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.unitTypeList.map(unityType =>

                                    <tr key={unityType.unitTypeId} onClick={() => this.editUnitType(unityType)}>
                                        <td>{unityType.label.label_en}</td>
                                        <td>{unityType.label.label_fr}</td>
                                        <td>{unityType.label.label_sp}</td>
                                        <td>{unityType.label.label_pr}</td>
                                        {/* <td>{unityType.createdDate}</td> */}
                                        {/* <td>{unityType.lastModifiedDate}</td> */}
                                        {/* <td>{dataSourceType.active.toString() == "true" ? "Active" : "Disabled"}</td> */}
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