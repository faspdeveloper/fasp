import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import CountryService from "../../api/CountryService";
import OrganisationService from "../../api/OrganisationService";
import UserService from "../../api/UserService";
import * as labels from '../../Labels.js'
import AuthenticationService from '../common/AuthenticationService.js';


export default class AddOrganisationComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            realms: [],
            organisation: {
                label: {

                },
                realm: {
                    realmId: ""
                },
                realmCountryArray: {

                }
            },
            selCountries: [],
            message: ''
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
        this.dataChange = this.dataChange.bind(this);
        this.getCountryListByRealmId = this.getCountryListByRealmId.bind(this);
        this.Capitalize = this.Capitalize.bind(this);
    }
    Capitalize(str, check) {
        if (check == 1) {
            return str.charAt(0).toUpperCase();
        } else {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

    }
    dataChange(event) {
        let { organisation } = this.state
        console.log(event.target.name);
        console.log(event.target.value);
        if (event.target.name === "organisation.label.label_en") {
            organisation.label.label_en = event.target.value
        } else if (event.target.name === "organisation.organisationCode") {
            organisation.organisationCode = event.target.value
        } else if (event.target.name === "organisation.realmCountryArray") {
            organisation.realmCountryArray = Array.from(event.target.selectedOptions, (item) => item.value)
        } else if (event.target.name === "organisation.realm.realmId") {
            this.getCountryListByRealmId(event);
            console.log(event.target.value);
            organisation.realm.realmId = event.target.value
        }
        this.setState({
            organisation
        }, (
        ) => {
            console.log("state after update---", this.state.organisation)
        })
    }


    componentDidMount() {
        console.log("check---" + AuthenticationService.checkTypeOfSession());
        if (!AuthenticationService.checkTypeOfSession()) {
            alert("You can't change your session from online to offline or vice versa.");
            this.props.history.push(`/`)
        }
        AuthenticationService.setupAxiosInterceptors();
        CountryService.getRealmCountryList()
            .then(response => {
                console.log("country list---", response.data);
                this.setState({
                    countries: response.data
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
                                message: error.response.data.message
                            })
                            break
                    }
                }
            );
        UserService.getRealmList()
            .then(response => {
                console.log("realm list---", response.data);
                this.setState({
                    realms: response.data
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
                                message: error.response.data.message
                            })
                            break
                    }
                }
            );

        $("#organisationForm").validate({
            ignore: [],
            rules: {
                'organisation.label.label_en': {
                    required: true
                },
                'organisation.organisationCode': {
                    required: true
                },
                'organisation.realmCountryArray': {
                    required: true
                },
                'organisation.realm.realmId': {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                if (element.hasClass('select')) {
                    error.insertAfter(element.next(".bootstrap-select"));
                    element.next("div").addClass("error");
                } else {
                    error.insertAfter(element);
                }
            }
        });

    }

    render() {
        const { selCountries } = this.state;
        const { realms } = this.state;

        let realmList = realms.length > 0
            && realms.map((item, i) => {
                return (
                    <option key={i} value={item.realmId}>
                        {(() => {
                            switch (this.state.languageId) {
                                case 2: return (item.label.label_pr !== null && item.label.label_pr !== "" ? item.label.label_pr : item.label.label_en);
                                case 3: return (item.label.label_fr !== null && item.label.label_fr !== "" ? item.label.label_fr : item.label.label_en);
                                case 4: return (item.label.label_sp !== null && item.label.label_sp !== "" ? item.label.label_sp : item.label.label_en);
                                default: return item.label.label_en;
                            }
                        })()}
                    </option>
                )
            }, this);

        let countryList = selCountries.length > 0
            && selCountries.map((item, i) => {
                return (
                    <option key={i} value={item.realmCountryId}>
                        {item.country.label.label_en}
                    </option>
                )
            }, this);
        return (
            <div class="page-container page-navigation-toggled page-container-wide">
                <div class="page-content">
                    <ul class="breadcrumb">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Admin</a></li>
                        <li><a href="#">Organisation</a></li>
                        <li><a href="#">Add Organisation</a></li>
                    </ul>
                    <div class="page-content-wrap">
                        <div><h5>{this.state.message}</h5></div>
                        <div class="row">
                            <div class="col-md-12">

                                <form name="organisationForm" id="organisationForm" class="form-horizontal">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h3 class="panel-title">{labels.TITLE_ADD_ORGANISATION}</h3>
                                        </div>
                                        <div class="panel-body">
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.REALM}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="organisation.realm.realmId" class="form-control" data-live-search="true" name="organisation.realm.realmId" onChange={this.dataChange}>
                                                        <option value="">-Nothing Selected-</option>
                                                        {realmList}
                                                    </select>

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.COUNTRY}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="organisation.realmCountryArray" class="form-control" data-live-search="true" name="organisation.realmCountryArray" onChange={this.dataChange} multiple={true}>
                                                        <option value="" disabled={true}>-Nothing Selected-</option>
                                                        {countryList}
                                                    </select>

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ORGANISATION_CODE}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="organisation.organisationCode" class="form-control" name="organisation.organisationCode" onChange={this.dataChange} maxLength="4"  />
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ORGANISATION_NAME_ENG}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="organisation.label.label_en" class="form-control" name="organisation.label.label_en" onChange={this.dataChange} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="panel-footer">
                                            <div class="pull-right">
                                                <button type="button" className="btn btn-success" onClick={this.submitClicked}>{labels.BTN_SUBMIT}</button>
                                                <button type="button" className="btn btn-danger" onClick={this.cancelClicked}>{labels.BTN_CANCEL}</button><br></br><br></br>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    getCountryListByRealmId(event) {
        let realmId = event.target.value;
        const selCountries = this.state.countries.filter(c => c.realm.realmId == realmId)
        this.setState({
            selCountries: selCountries
        });
    }
    submitClicked() {
        if (navigator.onLine) {
            if (AuthenticationService.checkTypeOfSession()) {
                if ($("#organisationForm").valid()) {
                    OrganisationService.addOrganisation(this.state.organisation)
                        .then(response => {
                            if (response.data.message != "Failed") {
                                this.props.history.push(`/organisationList/${response.data.message}`)
                            } else {
                                this.setState({
                                    message: response.data.message
                                })
                            }
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
                                            message: error.response.data.message
                                        })
                                        break
                                }
                            }
                        );
                }
            } else {
                alert("You can't change your session from online to offline or vice versa.");
            }
        } else {
            alert("You must be Online.")
        }
    }
    cancelClicked() {
        this.props.history.push(`/organisationList/` + "Action Canceled")
    }

}

