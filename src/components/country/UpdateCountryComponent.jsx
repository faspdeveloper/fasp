import React, { Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import CountryService from '../../api/CountryService.js';
import LanguageService from '../../api/LanguageService.js';
import CurrencyService from '../../api/CurrencyService.js';
import * as myConst from '../../Labels.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';

export default class UpdateCountryComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            country: {
                countryId:'',
                countryCode:'',
                label: {
                    label_en: '',
                    // spaLabel: '',
                    // freLabel: '',
                    // porLabel: '', 
                    labelId:''
                },
                currency: {
                    curencyId: ''
                },
                language: {
                    languageId: ''
                },
                active: ''

            },
            languageList:[],
            currencyList:[]
        }

        this.updateFieldData=this.updateFieldData.bind(this);
        this.updateForm=this.updateForm.bind(this);
        this.Capitalize=this.Capitalize.bind(this);
        this.cancelClicked=this.cancelClicked.bind(this);

    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        this.setState({
            country: this.props.location.state.country
        });

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

                $("#updateCountryForm").validate({
                    ignore: [],
                    rules: {
                        'country.label.label_en': {
                            required: true,
                            lettersonlywhitespace: true,
                            maxlength: 255
                        },
                        'country.countryCode': {
                            required:true,
                            lettersonly: true,
                            maxlength:3
                        },
                        // 'country.label.spaLabel': {
        
                        //     lettersonly: true,
                        //     maxlength: 255
                        // },
                        // 'country.label.porLabel': {
        
                        //     lettersonly: true,
                        //     maxlength: 255
                        // },
                        'country.currency.currencyId': {
                            required: true
                        }, 
                        'country.language.languageId': {
                            required: true
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
    updateFieldData(event){
        let { country } = this.state
        if (event.target.name === "country.label.label_en") {
           this.state.country.label.label_en = event.target.value
        }
        if (event.target.name === "country.countryCode") {
            this.state.country.countryCode = event.target.value.toUpperCase()
        } 
        //if (event.target.name === "country.label.spaLabel") {
        //     this.state.country.label.spaLabel = event.target.value
        // } if (event.target.name === "country.label.porLabel") {
        //     this.state.country.label.porLabel = event.target.value
        // }
        if (event.target.name === "country.currency.currencyId") {
            this.state.country.currency.currencyId = event.target.value
        }if (event.target.name === "country.language.languageId") {
            this.state.country.language.languageId = event.target.value
        }else if(event.target.name === "country.active") { 
             console.log("hi----");
            this.state.country.active = event.target.id === "country.active2" ? false : true
        }
        
        this.setState(
            {
                country
            }
        )


    }
    cancelClicked() {
        this.props.history.push(`/countryList/` + "Action Canceled") 
    }

    updateForm(){
        if(navigator.onLine){

            if($("#updateCountryForm").valid()){
        CountryService.editCountry(this.state.country).then(response => {
            this.props.history.push(`/countryList/${response.data.message}`)
            //console.log("success");
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
        }else{

            alert("To perform this action you must be online.");
        }
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

                <h3>{myConst.UPDATE_COUNTRY}</h3>
                <form name="updateCountryForm" id="updateCountryForm">
                    <div>
                        <label>{myConst.COUNTRY_NAME_EN}:-</label>
                        <input type="text" name="country.label.engLabel" value={this.Capitalize(this.state.country.label.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.COUNTRY_CODE}:-</label>
                        <input type="text" name="country.countryCode" value={this.state.country.countryCode} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    {/* <div>
                        <label>{myConst.COUNTRY_NAME_FR}:-</label>
                        <input type="text" name="country.label.freLabel" value={this.state.country.label.freLabel} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.COUNTRY_NAME_SP}:-</label>
                        <input type="text" name="country.label.spaLabel" value={this.state.country.label.spaLabel} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        <label>{myConst.COUNTRY_NAME_PO}:-</label>
                        <input type="text" name="country.label.porLabel" value={this.state.country.label.porLabel} onChange={this.updateFieldData} />
                    </div>
                    <br /><br /> */}
                    <div>
                        {myConst.ACTIVE}:
        <input type="radio" id="country.active1" name="country.active" value={true} checked={this.state.country.active === true} onChange={this.updateFieldData} /> Active
        <input type="radio" id="country.active2" name="country.active" value={false} checked={this.state.country.active === false} onChange={this.updateFieldData} /> Disabled
         </div>
                    <br /><br />
                    <div>
                        {myConst.SELECT_LANGUAGE} : <select id="langaugeId" name="country.language.languageId" value={this.state.country.language ? this.state.country.language.languageId : ''} onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {languageItems}
                        </select>
                    </div>
                    <br></br>
                    <div>
                        {myConst.SELECT_CURRENCY} : <select id="currencyId" name="country.currency.currencyId" value={this.state.country.currency ? this.state.country.currency.currencyId : ''} onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {currencyItems}
                        </select>
                    </div>
                    <br /><br />
                    {/* <input type="hidden" name="dataSource.dataSourceId" value={this.state.dataSource.dataSourceId} /> */}
                    {/* <input type="hidden" name="dataSource.label.labelId" value={this.state.dataSource.label.labelId} /> */}
                    <div>

                        <button type="button" onClick={this.updateForm}>{myConst.UPDATE_BUTTON}</button>
                        <button type="button" onClick={this.cancelClicked}>{myConst.BTN_CANCEL}</button><br></br><br></br>
                    </div>
                </form>

            </>

        );



    }


}