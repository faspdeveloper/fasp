import React, { Component } from 'react';
import RealmService from '../../api/RealmService'
import FundingSourceService from '../../api/FundingSourceService.js'
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class UpdateFundingSourceComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {

            fundingSource: {
                fundingSourceId:'',
                label: {
                    labelId:'',
                    label_en: ''
                },
                realm: {
                    realmId: ''
                }
            },
            realmList: [],
           
        }
        this.updateFieldData = this.updateFieldData.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
        this.cancelClicked=this.cancelClicked.bind(this);
    }


    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        this.setState({
            fundingSource: this.props.location.state.fundingSource
        });

        RealmService.getRealmListAll().then(response => {
            //console.log(response.data)
            this.setState({
                realmList: response.data.data
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

        $("#updateFundingSourceForm").validate({
            ignore: [],
            rules: {
                'fundingSource.label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
                'fundingSource.realm.realmId': {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });
    }

    updateFieldData(event) {

        let { fundingSource } = this.state

        if (event.target.name === "fundingSource.label.label_en") {
            // console.log("inside if")
            fundingSource.label.label_en = event.target.value
        } 
        if (event.target.name === "fundingSource.realm.realmId") {
            this.state.fundingSource.realm.realmId = event.target.value
        } else if (event.target.name === "fundingSource.active") {
            //console.log("hi----");
            fundingSource.active = event.target.id === "fundingSource.active2" ? false : true
        }


        this.setState(
            {
                fundingSource
            }
        )


    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    cancelClicked() {
        this.props.history.push(`/fundingSourceList/` + "Action Canceled") 
    }
    updateForm() {

        if (navigator.onLine) {
            if ($("#updateFundingSourceForm").valid()) {
                //console.log(this.state);
                FundingSourceService.updateFundingSource(this.state.fundingSource).then(response => {
                    console.log(response);
                    this.props.history.push(`/fundingSourceList/${response.data.message}`)
                    
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
        const { realmList } = this.state;
        let realmTypes = realmList.length > 0
            && realmList.map((item, i) => {
                return (
                    <option key={i} value={item.realmId}>{item.label.label_en}</option>
                )
            }, this);
        return (

            <>
                <div><h5>{this.state.message}</h5></div>
                <h3>{myConst.UPDATE_FUNDING_SOURCE}</h3>
                <form name="updateFundingSourceForm" id="updateFundingSourceForm">
                    <div>
                        <label>{myConst.FUNDING_SOURCE_NAME_EN}:-</label>
                        <input type="text" name="fundingSource.label.label_en" value={this.Capitalize(this.state.fundingSource.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                  
                    <div>
                        {myConst.ACTIVE}:
                    <input type="radio" id="fundingSource.active1" name="fundingSource.active" value={true} checked={this.state.fundingSource.active === true} onChange={this.updateFieldData} /> Active
                    <input type="radio" id="fundingSource.active2" name="fundingSource.active" value={false} checked={this.state.fundingSource.active === false} onChange={this.updateFieldData} /> Disabled
                     </div>
                    <br /><br />
                    <div>
                        {myConst.SELECT_REALM} : <select id="realmId" name="fundingSource.realm.realmId" value={this.state.fundingSource.realm ? this.state.fundingSource.realm.realmId : ''} onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {/* <option value="1">Realm One</option>
                            <option value="2">Realm Two</option> */}
                            {realmTypes}
                        </select>
                    </div>
                    <br /><br />
                  
                  
                    <div>
                        <button type="button" onClick={this.updateForm}>{myConst.UPDATE_BUTTON}</button>
                        <button type="button" onClick={this.cancelClicked}>{myConst.BTN_CANCEL}</button><br></br><br></br>
                    </div>
                </form>
            </>

        );


    }

}