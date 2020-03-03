import React, { Component } from 'react';
import UserService from "../../api/UserService.js";
import OrganisationService from "../../api/OrganisationService.js";
import AuthenticationService from '../common/AuthenticationService.js';
import * as labels from '../../Labels.js'


export default class OrganisationListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organisations: [],
            message: ""
        }
        this.editOrganisation = this.editOrganisation.bind(this);
        this.addOrganisation = this.addOrganisation.bind(this);
    }

    componentDidMount() {
        if (!AuthenticationService.checkTypeOfSession()) {
            alert("You can't change your session from online to offline or vice versa.");
            this.props.history.push(`/`)
        }
        AuthenticationService.setupAxiosInterceptors();
        OrganisationService.getOrganisationList()
            .then(response => {
                console.log("response---", response);
                if (response.data.status != "Failed") {
                    this.setState({
                        organisations: response.data.data
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
            <div className="organisationList">
                <p>{this.props.match.params.message}</p>
                <h3>{this.state.message}</h3>
                <div>{labels.TITLE_ORGANISATION_LIST}</div>
                <button className="btn btn-add" type="button" style={{ marginLeft: '-736px' }} onClick={this.addOrganisation}>{labels.TITLE_ADD_ORGANISATION}</button><br /><br />
                <table border="1" align="center">
                    <thead>
                        <tr>
                            <th>Organisation Code</th>
                            <th>Organisation Name</th>
                            <th>Realm</th>
                            {/* <th>Country</th> */}
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.organisations.map(organisation =>
                                <tr key={organisation.organisationId} onClick={() => this.editOrganisation(organisation)}>
                                    <td>{organisation.organisationCode}</td>
                                    <td>{organisation.label.label_en}</td>
                                    <td>{organisation.realm.label.label_en}</td>
                                    {/* <td>
                                        {
                                            organisation.realmCountryList.map(realmCountry => realmCountry.country.label.label_en)
                                        }
                                    </td> */}
                                    <td>{organisation.active.toString() === "true" ? "Active" : "Disabled"}</td>
                                </tr>)
                        }
                    </tbody>
                </table>
                <br />
            </div>
        );
    }
    editOrganisation(organisation) {
        this.props.history.push({
            pathname: "/editOrganisation",
            state: { organisation: organisation }
        });
    }
    addOrganisation() {
        if (navigator.onLine) {
            this.props.history.push(`/addOrganisation`);
        } else {
            alert("You must be Online.")
        }
    }

}