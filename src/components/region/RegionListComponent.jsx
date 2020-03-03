import React, { Component } from 'react';
import UserService from "../../api/UserService.js";
import RegionService from "../../api/RegionService.js";
import AuthenticationService from '../common/AuthenticationService.js';
import * as labels from '../../Labels.js'


export default class RegionListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            regions: [],
            message: ""
        }
        this.editRegion = this.editRegion.bind(this);
        this.addRegion = this.addRegion.bind(this);
    }

    componentDidMount() {
        if (!AuthenticationService.checkTypeOfSession()) {
            alert("You can't change your session from online to offline or vice versa.");
            this.props.history.push(`/`)
        }
        AuthenticationService.setupAxiosInterceptors();
        RegionService.getRegionList()
            .then(response => {
                console.log("rol list---" + response.data);
                this.setState({
                    regions: response.data
                })
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
            <div className="regionList">
                <p>{this.props.match.params.message}</p>
                <h3>{this.state.message}</h3>
                <div>{labels.TITLE_REGION_LIST}</div>
                <button className="btn btn-add" type="button" style={{ marginLeft: '-736px' }} onClick={this.addRegion}>{labels.TITLE_ADD_REGION}</button><br /><br />
                <table border="1" align="center">
                    <thead>
                        <tr>
                            <th>Region</th>
                            <th>Country</th>
                            <th>Realm</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.regions.map(region =>
                                <tr key={region.regionId} onClick={() => this.editRegion(region)}>
                                    <td>{region.label.label_en}</td>
                                    <td>{region.realmCountry.country.label.label_en}</td>
                                    <td>{region.realmCountry.realm.label.label_en}</td>
                                    <td>{region.active.toString() === "true" ? "Active" : "Disabled"}</td>
                                </tr>)
                        }
                    </tbody>
                </table>
                <br />
            </div>
        );
    }
    editRegion(region) {
        this.props.history.push({
            pathname: "/editRegion",
            state: { region: region }
        });
    }
    addRegion() {
        if (navigator.onLine) {
            this.props.history.push(`/addRegion`);
        } else {
            alert("You must be Online.")
        }
    }

}