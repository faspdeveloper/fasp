import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import CountryService from "../../api/CountryService";
import RegionService from "../../api/RegionService";
import UserService from "../../api/UserService";
import * as labels from '../../Labels.js'
import AuthenticationService from '../common/AuthenticationService.js';


export default class EditRegionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            realms: [],
            region: this.props.location.state.region,
            message: ''
        }
        this.updateClicked = this.updateClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
        this.dataChange = this.dataChange.bind(this);
        this.getCountryListByRealmId = this.getCountryListByRealmId.bind(this);
        this.realmOnChangeEvent = this.realmOnChangeEvent.bind(this);
    }

    realmOnChangeEvent(event) {
        this.dataChange(event);
        this.getCountryListByRealmId(event.target.value);
    }
    dataChange(event) {
        let { region } = this.state
        if (event.target.name === "region.label.label_en") {
            region.label.label_en = event.target.value
        } else if (event.target.name === "region.realmCountry.realmCountryId") {
            region.realmCountry.realmCountryId = event.target.value
        }
        else if (event.target.name === "region.realmCountry.realm.realmId") {
            region.realmCountry.realm.realmId = event.target.value
        }
        else if (event.target.name === "region.active") {
            region.active = event.target.id === "region.active2" ? false : true
        }
        this.setState({
            region
        }, (
        ) => {
            console.log("state after update---", this.state.region)
        })
    }


    componentDidMount() {
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
                'region.realmCountry.realm.realmId': {
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
        const { countries } = this.state;
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

        let countryList = countries.length > 0
            && countries.map((item, i) => {
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
                        <li><a href="#">Update Region</a></li>
                    </ul>
                    <div class="page-content-wrap">
                        <div><h5>{this.state.message}</h5></div>
                        <div class="row">
                            <div class="col-md-12">

                                <form name="regionForm" id="regionForm" class="form-horizontal">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h3 class="panel-title">{labels.TITLE_EDIT_REGION}</h3>
                                        </div>
                                        <div class="panel-body">
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.REALM}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="region.realmCountry.realm.realmId" class="form-control select" data-live-search="true" name="region.realmCountry.realm.realmId" onChange={this.realmOnChangeEvent} value={this.state.region.realmCountry.realm.realmId}>
                                                        <option value="">-Nothing Selected-</option>
                                                        {realmList}
                                                    </select>

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.COUNTRY}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="region.realmCountry.realmCountryId" class="form-control select" data-live-search="true" name="region.realmCountry.realmCountryId" onChange={this.dataChange} value={this.state.region.realmCountry.realmCountryId}>
                                                        <option value="">-Nothing Selected-</option>
                                                        {countryList}
                                                    </select>

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.REGION_NAME_ENG}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="region.label.label_en" class="form-control" name="region.label.label_en" onChange={this.dataChange} value={this.state.region.label.label_en} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ACTIVE}</label>
                                                <div class="col-md-1 col-xs-12">
                                                    <input type="radio" id="region.active1" name="region.active" value={true} checked={this.state.region.active === true} onChange={this.dataChange} /> Active
                                                    <input type="radio" id="region.active2" name="region.active" value={false} checked={this.state.region.active === false} onChange={this.dataChange} /> Disabled
                                            </div>
                                            </div>
                                        </div>
                                        <div class="panel-footer">
                                            <div class="pull-right">
                                                <button type="button" className="btn btn-success" onClick={this.updateClicked}>{labels.BTN_UPDATE}</button>
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
    getCountryListByRealmId(realmId) {
        CountryService.getRealmCountryListByRealmId(realmId !== "" ? realmId : 0)
            .then(response => {
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

    }
    updateClicked() {
        console.log($("#countryIds").val())
        if (navigator.onLine) {
            console.log("check---" + AuthenticationService.checkTypeOfSession());
            if (AuthenticationService.checkTypeOfSession()) {
                console.log("state---" + this.state.region);
                if ($("#regionForm").valid()) {
                    console.log(this.state.region);
                    RegionService.editRegion(this.state.region)
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

