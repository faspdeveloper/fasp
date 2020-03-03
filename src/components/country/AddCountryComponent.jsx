import React, { Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import LanguageService from '../../api/LanguageService.js';
import CurrencyService from '../../api/CurrencyService.js';
import CountryService from '../../api/CountryService.js'
import * as myConst from '../../Labels.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class AddCountryComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countryCode:'',
            label: {
                label_en:''
            },
            currency: {
                currencyId: ''
            },
            language: {
                languageId: ''
            },
            languageList: [],
            currencyList: [],

        }

        this.submitForm = this.submitForm.bind(this);
        this.updateFieldData = this.updateFieldData.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        LanguageService.getLanguageListActive().then(response => {
            this.setState({
                languageList: response.data
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
                });

        CurrencyService.getCurrencyListActive().then(response => {
            this.setState({
                currencyList: response.data
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
                });


        $("#countryForm").validate({
            ignore: [],
            rules: {
                'label.label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255,
                    
                },
                'countryCode': {
                    required:true,
                    lettersonly: true,
                    maxlength: 3
                },
                // 'label.spaLabel': {

                //     lettersonly: true,
                //     maxlength: 255
                // },
                // 'label.porLabel': {

                //     lettersonly: true,
                //     maxlength: 255
                // },
                'currency.currencyId': {
                    required: true
                },
                'language.languageId': {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });

    }
    updateFieldData(event) {
        if (event.target.name === "label.label_en") {
            this.state.label.label_en = event.target.value
        }
        if (event.target.name === "countryCode") {
            this.state.countryCode = event.target.value.toUpperCase()
        } 
        //if (event.target.name === "label.spaLabel") {
        //     this.state.label.spaLabel = event.target.value
        // } if (event.target.name === "label.porLabel") {
        //     this.state.label.porLabel = event.target.value
        // }
        if (event.target.name === "currency.currencyId") {
            this.state.currency.currencyId = event.target.value
        } else if (event.target.name === "language.languageId") {
            this.state.language.languageId = event.target.value
        }
        let { country } = this.state
        this.setState(
            {
                country
            }
        )
    }
    submitForm() {
        console.log("----------",this.state)
        if (navigator.onLine) {

            if ($("#countryForm").valid()) {
                CountryService.addCountry(this.state).then(response => {
                    this.props.history.push(`/countryList/${response.data.message}`)
                    console.log("success--->",response);
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
   
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render() {
        const { languageList } = this.state;
        let languageItems = languageList.length > 0
            && languageList.map((item, i) => {
                return (
                    <option key={i} value={item.languageId}>{item.languageName}</option>
                )
            }, this);

        const { currencyList } = this.state;
        let currencyItems = currencyList.length > 0
            && currencyList.map((itemOne, i) => {
                return (
                    <option key={i} value={itemOne.currencyId}>{itemOne.label.label_en}</option>
                )
            }, this);
        return (

            <>
                <h3>{myConst.ADD_COUNTRY}</h3>
                <form name="countryForm" id="countryForm">
                    <div>
                        <label>{myConst.COUNTRY_NAME_EN}:-</label>
                        <input type="text" name="label.label_en" value={this.Capitalize(this.state.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.COUNTRY_CODE}:-</label>
                        <input type="text" name="countryCode" value={this.state.countryCode} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    {/* <div>
                        <label>{myConst.COUNTRY_NAME_FR}:-</label>
                        <input type="text" name="label.freLabel" onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.COUNTRY_NAME_SP}:-</label>
                        <input type="text" name="label.spaLabel" onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.COUNTRY_NAME_PO}:-</label>
                        <input type="text" name="label.porLabel" onChange={this.updateFieldData} />
                    </div>
                    <br /><br /> */}

                    <div>
                        {myConst.SELECT_LANGUAGE} : <select id="langaugeId" name="language.languageId" onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {languageItems}
                        </select>
                    </div>
                    <br></br>
                    <div>
                        {myConst.SELECT_CURRENCY} : <select id="currencyId" name="currency.currencyId" onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {currencyItems}
                        </select>
                    </div>
                    <br></br>
                    <div>
                        <button type="button" onClick={this.submitForm}>{myConst.SUBMIT_BUTTON}</button>
                    </div>
                </form>

            </>
        );
    }

}