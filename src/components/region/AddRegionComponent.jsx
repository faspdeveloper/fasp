import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import CountryService from "../../api/CountryService";
import RegionService from "../../api/RegionService";
import UserService from "../../api/UserService";
import * as labels from '../../Labels.js'
import AuthenticationService from '../common/AuthenticationService.js';


export default class AddRegionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            realms: [],
            region: {
                label: {

                },
                realmCountry: {

                }
            },
            selCountries: [],
            message: ''
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
        this.dataChange = this.dataChange.bind(this);
        this.getCountryListByRealmId = this.getCountryListByRealmId.bind(this);
    }
    dataChange(event) {
        let { region } = this.state
        if (event.target.name === "region.label.label_en") {
            region.label.label_en = event.target.value
        } else if (event.target.name === "region.realmCountry.realmCountryId") {
            region.realmCountry.realmCountryId = event.target.value
        }
        this.setState({
            region
        }, (
        ) => {
            console.log("state after update---", this.state.region)
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

        $("#regionForm").validate({
            ignore: [],
            rules: {
                'region.label.label_en': {
                    required: true
                },
                'region.realmCountry.realmCountryId': {
                    required: true
                },
                'region.realm.realmId': {
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
                        <li><a href="#">Region</a></li>
                        <li><a href="#">Add Region</a></li>
                    </ul>
                    <div class="page-content-wrap">
                        <div><h5>{this.state.message}</h5></div>
                        <div class="row">
                            <div class="col-md-12">

                                <form name="regionForm" id="regionForm" class="form-horizontal">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h3 class="panel-title">{labels.TITLE_ADD_REGION}</h3>
                                        </div>
                                        <div class="panel-body">
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.REALM}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="region.realm.realmId" class="form-control" data-live-search="true" name="region.realm.realmId" onChange={this.dataChange, this.getCountryListByRealmId}>
                                                        <option value="">-Nothing Selected-</option>
                                                        {realmList}
                                                    </select>

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.COUNTRY}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="region.realmCountry.realmCountryId" class="form-control" data-live-search="true" name="region.realmCountry.realmCountryId" onChange={this.dataChange}>
                                                        <option value="">-Nothing Selected-</option>
                                                        {countryList}
                                                    </select>

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.REGION_NAME_ENG}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="region.label.label_en" class="form-control" name="region.label.label_en" onChange={this.dataChange} />
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
        console.log("realm id---" + event.target.value);
        console.log(this.state.countries);
        let realmId = event.target.value;
        const selCountries = this.state.countries.filter(c => c.realm.realmId == realmId)
        console.log("selCountries---", selCountries);

        this.setState({
            selCountries: selCountries
        });
    }
    submitClicked() {
        console.log($("#countryIds").val())
        if (navigator.onLine) {
            console.log("check---" + AuthenticationService.checkTypeOfSession());
            if (AuthenticationService.checkTypeOfSession()) {
                console.log("state---" + this.state.region);
                if ($("#regionForm").valid()) {
                    // var json = {
                    //     label: {
                    //         label_en: $("#region\\.label\\.label_en").val()
                    //     },
                    //     country: $("#roles").val(),
                    //     language: {
                    //         languageId: $("#languageId").val()
                    //     },
                    //     countryIds: $("#countryIds").val()
                    // }
                    console.log(this.state.region);
                    RegionService.addRegion(this.state.region)
                        .then(response => {
                            this.props.history.push(`/regionList/${response.data.message}`)
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
        this.props.history.push(`/regionList/` + "Action Canceled")
    }

}

