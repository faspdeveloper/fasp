import React, { Component } from 'react';
import * as myConst from '../../Labels.js';
import AuthenticationService from '../common/AuthenticationService.js';
import CurrencyService from '../../api/CurrencyService.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
export default class AddCurrencyComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currencyCode: '',
            currencySymbol: '',
            label: {
                label_en: ''
                // freLabel: '',
                // spaLabel: '',
                // porLabel: ''
            },
            conversionRateToUsd: ''
        }
        this.updateFieldData = this.updateFieldData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        // this.UpperCase=this.UpperCase.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        $("#currencyForm").validate({
            ignore: [],
            rules: {
                'label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
                // 'label.freLabel': {
                //     lettersonly: true,
                //     maxlength: 255
                // },
                // 'label.spaLabel': {
                //     lettersonly: true,
                //     maxlength: 255
                // },
                // 'label.porLabel': {
                //     lettersonly: true,
                //     maxlength: 255
                // },
                'currencyCode': {
                    lettersonly: true,
                    required: true,
                    maxlength: 3
                },
                'currencySymbol': {
                    lettersonlyspecialchar:true,
                    required: true,
                    maxlength: 3
                },
                'conversionRateToUsd': {
                    positiveintegerdecimal:true,
                    required: true
                    //integer:true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });

    }
    // UpperCase(str) {
    //     return str.toUpperCase();
    // }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    updateFieldData(event) {
        // switch (event.target.name) {
        //     case "currencyCode": this.state.currencyCode = event.target.value;
        //     case "currencySymbol": this.state.currencySymbol = event.target.value;
        //     case "label.engLabel": this.state.label.engLabel = event.target.value;
        //     case "label.freLabel": this.state.label.freLabel = event.target.value;
        //     case "label.spaLabel": this.state.label.spaLabel = event.target.value;
        //     case "label.porLabel": this.state.label.porLabel = event.target.value;
        //     case "conversionRateToUsd": this.state.conversionRateToUsd = event.target.value;
        //     default: break;
        // }
        if(event.target.name === "currencyCode"){
            this.state.currencyCode = event.target.value.toUpperCase();
        }if(event.target.name === "currencySymbol"){
            this.state.currencySymbol = event.target.value;
        }if(event.target.name === "label.label_en"){
            this.state.label.label_en = event.target.value;
         }
        // if(event.target.name === "label.freLabel"){
        //     this.state.label.freLabel = event.target.value;
        // }if(event.target.name === "label.spaLabel"){
        //     this.state.label.spaLabel = event.target.value;
        // }if(event.target.name === "label.porLabel"){
        //     this.state.label.porLabel = event.target.value;
        // }
        else if(event.target.name === "conversionRateToUsd"){
            this.state.conversionRateToUsd = event.target.value;
        }
        let { currency } = this.state
        this.setState(
            {
                currency
            }
        )

    }

  
    submitForm() {

        if (navigator.onLine) {

            if ($("#currencyForm").valid()) {
                console.log(this.state);
                CurrencyService.addCurrency(this.state).then(response => {
                    this.props.history.push(`/currencyList/${response.data.message}`)
                    console.log("success");
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
                                        message: error.response.data.message                                    })
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
                <h3>{myConst.ADD_CURRENCY}</h3>
                <div><h5>{this.state.message}</h5></div>
                <form name="currencyForm" id="currencyForm">
                    <div>
                        <label>{myConst.CURRENCY_CODE}:-</label>
                        <input type="text" name="currencyCode" value={this.state.currencyCode} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.CURRENCY_SYMBOL}:-</label>
                        <input type="text" name="currencySymbol" onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.CURRENCY_NAME_EN}:-</label>
                        <input type="text" name="label.label_en" value={this.Capitalize(this.state.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    {/* <div>
                        <label>{myConst.CURRENCY_NAME_FR}:-</label>
                        <input type="text" name="label.freLabel" onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.CURRENCY_NAME_SP}:-</label>
                        <input type="text" name="label.spaLabel" onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.CURRENCY_NAME_PO}:-</label>
                        <input type="text" name="label.porLabel" onChange={this.updateFieldData} />
                    </div>
                    <br /><br /> */}
                    <div>
                        <label>{myConst.CONVERSIONRATE_TO_USD}:-</label>
                        <input type="text" name="conversionRateToUsd" onChange={this.updateFieldData} />
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