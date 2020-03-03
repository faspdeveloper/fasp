import React, { Component } from 'react';
import UserService from "../../api/UserService.js";
import HealthAreaService from "../../api/HealthAreaService.js";
import AuthenticationService from '../common/AuthenticationService.js';
import * as labels from '../../Labels.js'


export default class HealthAreaListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            healthAreas: [],
            message: ""
        }
        this.editHealthArea = this.editHealthArea.bind(this);
        this.addHealthArea = this.addHealthArea.bind(this);
    }

    componentDidMount() {
        if (!AuthenticationService.checkTypeOfSession()) {
            alert("You can't change your session from online to offline or vice versa.");
            this.props.history.push(`/`)
        }
        AuthenticationService.setupAxiosInterceptors();
        HealthAreaService.getHealthAreaList()
            .then(response => {
                console.log("response---", response);
                if (response.data.status != "Failed") {
                    this.setState({
                        healthAreas: response.data.data
                    })
                } else {
                    this.setState({
                        message: response.data.message
                    })
                }

            }).catch(
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

    render() {
        return (
            <div className="healthAreaList">
                <p>{this.props.match.params.message}</p>
                <h3>{this.state.message}</h3>
                <div>{labels.TITLE_HEALTH_AREA_LIST}</div>
                <button className="btn btn-add" type="button" style={{ marginLeft: '-736px' }} onClick={this.addHealthArea}>{labels.TITLE_ADD_HEALTH_AREA}</button><br /><br />
                <table border="1" align="center">
                    <thead>
                        <tr>
                            <th>Health Area</th>
                            <th>Realm</th>
                            {/* <th>Country</th> */}
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.healthAreas.map(healthArea =>
                                <tr key={healthArea.organisationId} onClick={() => this.editHealthArea(healthArea)}>
                                    <td>{healthArea.label.label_en}</td>
                                    <td>{healthArea.realm.label.label_en}</td>
                                    {/* <td>
                                        {
                                            organisation.realmCountryList.map(realmCountry => realmCountry.country.label.label_en)
                                        }
                                    </td> */}
                                    <td>{healthArea.active.toString() === "true" ? "Active" : "Disabled"}</td>
                                </tr>)
                        }
                    </tbody>
                </table>
                <br />
            </div>
        );
    }
    editHealthArea(healthArea) {
        this.props.history.push({
            pathname: "/editHealthArea",
            state: { healthArea: healthArea }
        });
    }
    addHealthArea() {
        if (navigator.onLine) {
            this.props.history.push(`/addHealthArea`);
        } else {
            alert("You must be Online.")
        }
    }

}