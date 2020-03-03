import React, { Component } from 'react';
import RealmService from '../../api/RealmService'
import ManufacturerService from '../../api/ManufacturerService'
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class UpdateManufacturerComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {

            manufacturer: {
                message:'',
                active: '',
                manufacturerId: '',
                label: {
                    label_en: '',
                    labelId: ''
                },
                realm: {
                    realmId: ''
                }
            },
            realmList: []
        }
        this.updateFieldData = this.updateFieldData.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
        this.cancelClicked=this.cancelClicked.bind(this);
    }


    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        this.setState({
            manufacturer: this.props.location.state.manufacturer
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

        $("#updateManufacturerForm").validate({
            ignore: [],
            rules: {
                'manufacturer.label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
                'manufacturer.realm.realmId': {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });
    }

    updateFieldData(event) {

        let { manufacturer } = this.state

        if (event.target.name === "manufacturer.label.label_en") {
            // console.log("inside if")
            manufacturer.label.label_en = event.target.value
        } 
        if (event.target.name === "manufacturer.realm.realmId") {
            this.state.manufacturer.realm.realmId = event.target.value
        } else if (event.target.name === "manufacturer.active") {
            //console.log("hi----");
            manufacturer.active = event.target.id === "manufacturer.active2" ? false : true
        }


        this.setState(
            {
                manufacturer
            }
        )


    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    cancelClicked() {
        this.props.history.push(`/manufacturerList/` + "Action Canceled") 
    }
    updateForm() {

        if (navigator.onLine) {
            if ($("#updateManufacturerForm").valid()) {
                //console.log(this.state);
                ManufacturerService.updateManufacturer(this.state.manufacturer).then(response => {
                   this.props.history.push(`/manufacturerList/${response.data.message}`)
                   // console.log("success");
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
                <h3>{myConst.UPDATE_MANUFACTURER}</h3>
                <form name="updateManufacturerForm" id="updateManufacturerForm">
                    <div>
                        <label>{myConst.MANUFACTURER_NAME_EN}:-</label>
                        <input type="text" name="manufacturer.label.label_en" value={this.Capitalize(this.state.manufacturer.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                  
                    <div>
                        {myConst.ACTIVE}:
                    <input type="radio" id="manufacturer.active1" name="manufacturer.active" value={true} checked={this.state.manufacturer.active === true} onChange={this.updateFieldData} /> Active
                    <input type="radio" id="manufacturer.active2" name="manufacturer.active" value={false} checked={this.state.manufacturer.active === false} onChange={this.updateFieldData} /> Disabled
                     </div>
                    <br /><br />
                    <div>
                        {myConst.SELECT_REALM} : <select id="realmId" name="manufacturer.realm.realmId" value={this.state.manufacturer.realm ? this.state.manufacturer.realm.realmId : ''} onChange={this.updateFieldData}>
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