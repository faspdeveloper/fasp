import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import * as myConst from '../../Labels.js';
import RealmService from '../../api/RealmService'
import AuthenticationService from '../common/AuthenticationService.js';

export default class AddRealmComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            realm: {
                realmCode: '',
                label: {
                    label_en: ''
                },
                monthInPastForAmc: '',
                monthInFutureForAmc: '',
                orderFrequency: '',
                defaultRealm: true
            }

        }
        this.submitForm = this.submitForm.bind(this);
        this.updateFieldData = this.updateFieldData.bind(this);
        this.Capitalize = this.Capitalize.bind(this);
    }


    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        $("#realmForm").validate({
            ignore: [],
            rules: {
                'realm.label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                },

                'realm.realmCode': {
                    required: true,
                    lettersonly: true,
                    maxlength: 4
                },
                'realm.monthInPastForAmc': {
                    required: true,
                    positiveinteger: true

                },
                'realm.monthInFutureForAmc': {
                    required: true,
                    positiveinteger: true

                },
                'realm.orderFrequency': {
                    required: true,
                    positiveinteger: true

                }

            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });



    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    updateFieldData(event) {
        let { realm } = this.state
        if (event.target.name === "realm.label.label_en") {
            this.state.realm.label.label_en = event.target.value
        }
        if (event.target.name === "realm.realmCode") {
            this.state.realm.realmCode = event.target.value
        }
        if (event.target.name === "realm.monthInPastForAmc") {
            this.state.realm.monthInPastForAmc = event.target.value
        }
        if (event.target.name === "realm.monthInFutureForAmc") {
            this.state.realm.monthInFutureForAmc = event.target.value
        }
        if (event.target.name === "realm.orderFrequency") {
            this.state.realm.orderFrequency = event.target.value
        }
        else if (event.target.name === "realm.defaultRealm") {
            realm.defaultRealm = event.target.id === "realm.active2" ? false : true
        }


        this.setState(
            {
                realm
            }
        )


    }
    submitForm() {
        if (navigator.onLine) {
            if ($("#realmForm").valid()) {
                RealmService.addRealm(this.state.realm).then(response => {
                    this.props.history.push(`/realmList/${response.data.message}`)
                    console.log(response);
                }
                )
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
                    )
            }

        } else {
            alert("To perform this action you must be online.");

        }

    }
    render() {
        return (
            <>

                <div><h5>{this.state.message}</h5></div>
                <h3>{myConst.ADD_REALM} </h3>
                <form name="realmForm" id="realmForm">
                    <div>
                        <label>{myConst.REALM_CODE}:-</label>
                        <input type="text" name="realm.realmCode" value={this.Capitalize(this.state.realm.realmCode)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.REALM_NAME_EN} :-</label>
                        <input type="text" name="realm.label.label_en" value={this.Capitalize(this.state.realm.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.REALM_PAST_MONTHS_AMC} :-</label>
                        <input type="text" name="realm.monthInPastForAmc" value={this.Capitalize(this.state.realm.monthInPastForAmc)} onChange={this.updateFieldData} />
                    </div>
                    <br></br>
                    <div>
                        <label>{myConst.REALM_FUTURE_MONTHS_AMC} :-</label>
                        <input type="text" name="realm.monthInFutureForAmc" value={this.Capitalize(this.state.realm.monthInFutureForAmc)} onChange={this.updateFieldData} />
                    </div>
                    <br></br>
                    <div>
                        <label>{myConst.REALM_ORDER_FREQUENCY} :-</label>
                        <input type="text" name="realm.orderFrequency" value={this.Capitalize(this.state.realm.orderFrequency)} onChange={this.updateFieldData} />
                    </div>
                    <br></br>
                    <div>
                        {myConst.REALM_DEFAULT}:
                    <input type="radio" id="realm.active1" name="realm.defaultRealm" value={true} checked={this.state.realm.defaultRealm === true} onChange={this.updateFieldData} /> Active
                    <input type="radio" id="realm.active2" name="realm.defaultRealm" value={false} checked={this.state.realm.defaultRealm === false} onChange={this.updateFieldData} /> Disabled
                     </div>
                    <br /><br />
                    <div>
                        <button type="button" onClick={this.submitForm}>{myConst.SUBMIT_BUTTON}</button>
                    </div>
                </form>


            </>
        );

    }
}