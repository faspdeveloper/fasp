import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import CountryService from "../../api/CountryService";
import HealthAreaService from "../../api/HealthAreaService";
import UserService from "../../api/UserService";
import * as labels from '../../Labels.js'
import AuthenticationService from '../common/AuthenticationService.js';


export default class EditHealthAreaComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            realms: [],
            healthArea: this.props.location.state.healthArea,
            message: ''
        }
        this.updateClicked = this.updateClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
        this.dataChange = this.dataChange.bind(this);
        this.getCountryListByRealmId = this.getCountryListByRealmId.bind(this);
    }
    dataChange(event) {
        let { healthArea } = this.state
        console.log(event.target.name);
        console.log(event.target.value);
        if (event.target.name === "healthArea.label.label_en") {
            healthArea.label.label_en = event.target.value
        } else if (event.target.name === "healthArea.realmCountryArray") {
            healthArea.realmCountryArray = Array.from(event.target.selectedOptions, (item) => item.value)
        } else if (event.target.name === "healthArea.realm.realmId") {
            this.getCountryListByRealmId(event.target.value);
            healthArea.realm.realmId = event.target.value
        } else if (event.target.name === "healthArea.active") {
            healthArea.active = event.target.id === "healthArea.active2" ? false : true
        }
        this.setState({
            healthArea
        }, (
        ) => {
            console.log("state after update---", this.state.healthArea)
        })
    }


    componentDidMount() {
        console.log("check---", this.state.healthArea);
        if (!AuthenticationService.checkTypeOfSession()) {
            alert("You can't change your session from online to offline or vice versa.");
            this.props.history.push(`/`)
        }
        AuthenticationService.setupAxiosInterceptors();
        var realmId = parseInt(this.state.healthArea.realm.realmId);
        this.getCountryListByRealmId(realmId);
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

        $("#healthAreaForm").validate({
            ignore: [],
            rules: {
                'healthArea.label.label_en': {
                    required: true
                },
                'healthArea.realmCountryArray': {
                    required: true
                },
                'healthArea.realm.realmId': {
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
                        <li><a href="#">Health Area</a></li>
                        <li><a href="#">Update Health Area</a></li>
                    </ul>
                    <div class="page-content-wrap">
                        <div><h5>{this.state.message}</h5></div>
                        <div class="row">
                            <div class="col-md-12">

                                <form name="healthAreaForm" id="healthAreaForm" class="form-horizontal">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h3 class="panel-title">{labels.TITLE_EDIT_HEALTH_AREA}</h3>
                                        </div>
                                        <div class="panel-body">
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.REALM}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="healthArea.realm.realmId" class="form-control" data-live-search="true" name="healthArea.realm.realmId" onChange={this.dataChange} value={this.state.healthArea.realm.realmId} disabled={true}>
                                                        <option value="">-Nothing Selected-</option>
                                                        {realmList}
                                                    </select>

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.COUNTRY}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <select id="healthArea.realmCountryArray" class="form-control" data-live-search="true" name="healthArea.realmCountryArray" onChange={this.dataChange} multiple={true} value={this.state.healthArea.realmCountryArray}>
                                                        <option value="" disabled={true}>-Nothing Selected-</option>
                                                        {countryList}
                                                    </select>

                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.HEALTH_AREA_NAME_ENG}</label>
                                                <div class="col-md-6 col-xs-12">
                                                    <input type="text" id="healthArea.label.label_en" class="form-control" name="healthArea.label.label_en" onChange={this.dataChange} value={this.state.healthArea.label.label_en} readOnly={true} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label class="req col-md-2 col-xs-12 control-label">{labels.ACTIVE}</label>
                                                <div class="col-md-1 col-xs-12">
                                                    <input type="radio" id="healthArea.active1" name="healthArea.active" value={true} checked={this.state.healthArea.active === true} onChange={this.dataChange} /> Active
                                                    <input type="radio" id="healthArea.active2" name="healthArea.active" value={false} checked={this.state.healthArea.active === false} onChange={this.dataChange} /> Disabled
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
        console.log("realmId---" + realmId);
        CountryService.getRealmCountryListByRealmId(realmId !== "" ? realmId : 0)
            .then(response => {
                console.log("response---", response.data);
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
        if (navigator.onLine) {
            if (AuthenticationService.checkTypeOfSession()) {
                if ($("#healthAreaForm").valid()) {
                    HealthAreaService.editHealthArea(this.state.healthArea)
                        .then(response => {
                            console.log("response edit---", response);
                            if (response.data.message != "Failed") {
                                this.props.history.push(`/healthAreaList/${response.data.message}`)
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
        this.props.history.push(`/healthAreaList/` + "Action Canceled")
    }

}

