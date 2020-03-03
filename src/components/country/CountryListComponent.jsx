import React, { Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import CountryService from '../../api/CountryService.js';
import * as myConst from '../../Labels.js';

export default class CountryListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countryList: []
        }
        this.addNewCountry = this.addNewCountry.bind(this);
        this.editCountry = this.editCountry.bind(this);
    }
    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        CountryService.getCountryListAll().then(response => {
            this.setState({
                countryList: response.data
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

    addNewCountry() {
        if (navigator.onLine) {
            this.props.history.push(`/addCountry`)
        } else {
            alert("You must be Online.")
        }

    }
    editCountry(country) {
        console.log(country);
        this.props.history.push({
            pathname: "/editCountry",
            state: { country: country }
        });

    }

    render() {

        return (

            <>
                <p>{this.props.match.params.message}</p>

                <div>
                    <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewCountry}>{myConst.ADD_NEW_COUNTRY}</button><br /><br />
                </div>

                <div className="countryList">

                    <h1>{myConst.COUNTRY_LIST}</h1>
                    <table border="1" align="center">
                        <thead>
                            <tr>
                                <th>{myConst.COUNTRY_NAME_EN}</th>
                                <th>{myConst.COUNTRY_NAME_FR}</th>
                                <th>{myConst.COUNTRY_NAME_SP}</th>
                                <th>{myConst.COUNTRY_NAME_PO}</th>
                                <th>{myConst.COUNTRY_CODE}</th>
                                <th>{myConst.COUNTRY_ACTIVE}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.countryList.map(country =>

                                    <tr key={country.countryId} onClick={() => this.editCountry(country)}>
                                        <td>{country.label.label_en}</td>
                                        <td>{country.label.label_fr}</td>
                                        <td>{country.label.label_sp}</td>
                                        <td>{country.label.label_pr}</td>
                                        <td>{country.countryCode}</td>
                                        <td>
                                        {country.active.toString() == "true" ? "Active" : "Disabled"}
                                        </td>
                                    </tr>
                                )

                            }
                        </tbody>
                    </table>
                </div>




            </>);
    }

}