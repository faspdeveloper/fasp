import React, { Compoent, Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import CurrencyService from '../../api/CurrencyService.js';
import * as myConst from '../../Labels.js';


export default class CurrencyListComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            currencyList: []
        }
        this.editCurrency = this.editCurrency.bind(this);
        this.addNewCurrency=this.addNewCurrency.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        CurrencyService.getCurrencyList().then(response => {
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
                }
            );


    }

    editCurrency(currency) {
        this.props.history.push({
            pathname: "/editCurrency",
            state: { currency: currency }
        });

    }

    addNewCurrency(){

        if (navigator.onLine) {
            this.props.history.push(`/addCurrency`)
        } else {
            alert("You must be Online.")
        }

    }
    render() {

        return (
            <>
                 <p>{this.props.match.params.message}</p>
                <div>
                    <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewCurrency}>{myConst.ADD_NEW_CURRENCY}</button><br /><br />
                </div>

                <div className="currencyList">

                    <h1>{myConst.CURRENCY_LIST}</h1>
                    <table border="1" align="center">
                        <thead>
                            <tr>
                                <th>{myConst.CURRENCY_CODE}</th>
                                <th>{myConst.CURRENCY_SYMBOL}</th>
                                <th>{myConst.CURRENCY_NAME_EN}</th>
                                <th>{myConst.CURRENCY_NAME_FR}</th>
                                <th>{myConst.CURRENCY_NAME_SP}</th>
                                <th>{myConst.CURRENCY_NAME_PO}</th>
                                <th>{myConst.CONVERSIONRATE_TO_USD}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.currencyList.map(currency =>
                                    <tr key={currency.currencyId} onClick={() => this.editCurrency(currency)}>
                                        <td>{currency.currencyCode}</td>
                                        <td>{currency.currencySymbol}</td>
                                        <td>{currency.label.label_en}</td>
                                        <td>{currency.label.label_fr}</td>
                                        <td>{currency.label.label_sp}</td>
                                        <td>{currency.label.label_pr}</td>
                                        <td>{currency.conversionRateToUsd}</td>

                                    </tr>
                                )

                            }
                        </tbody>
                    </table>
                </div>

            </>
        );
    }


}