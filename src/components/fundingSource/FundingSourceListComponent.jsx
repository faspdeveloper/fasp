import React, { Component } from 'react';
import FundingSourceService from '../../api/FundingSourceService'
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';

export default class FundingSourceListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fundingSourceList: []

        }

        this.editFundingSource = this.editFundingSource.bind(this);
        this.addNewFundingSource = this.addNewFundingSource.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        FundingSourceService.getFundingSourceListAll().then(response => {
            //console.log(response.data)
            this.setState({
                fundingSourceList: response.data.data
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

    editFundingSource(fundingSource) {
        this.props.history.push({
            pathname: "/editFundingSource",
            state: { fundingSource: fundingSource }
        });

    }

    addNewFundingSource() {

        if (navigator.onLine) {
            this.props.history.push(`/addFundingSource`)
        } else {
            alert("You must be Online.")
        }


    }
    render() {
        return (
            <>

                <p>{this.props.match.params.message}</p>
                <div>
                    <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewFundingSource}>{myConst.ADD_NEW_FUNDING_SOURCE}</button><br /><br />
                </div>

                <div className="fundingSourceList">

                    <h1>{myConst.FUNDING_SOURCE_LIST}</h1>
                    <table border="1" align="center">
                        <thead>
                            <tr>
                                <th>{myConst.FUNDING_SOURCE_NAME_EN}</th>
                                <th>{myConst.FUNDING_SOURCE_NAME_FR}</th>
                                <th>{myConst.FUNDING_SOURCE_NAME_SP}</th>
                                <th>{myConst.FUNDING_SOURCE_NAME_PO}</th>
                                <th>{myConst.REALM_NAME_EN}</th>
                                <th>{myConst.DATASOURCE_ACTIVE}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.fundingSourceList.map(fundingSource =>

                                    <tr key={fundingSource.fundingSourceId} onClick={() => this.editFundingSource(fundingSource)}>
                                        <td>{fundingSource.label.label_en}</td>
                                        <td>{fundingSource.label.label_fr}</td>
                                        <td>{fundingSource.label.label_sp}</td>
                                        <td>{fundingSource.label.label_pr}</td>
                                        <td>{fundingSource.realm.label.label_en}</td>
                                        <td>{fundingSource.active.toString() == "true" ? "Active" : "Disabled"}</td>
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