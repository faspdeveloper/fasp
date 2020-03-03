import React, { Component } from 'react';
import DataSourceTypeService from '../../api/DataSourceTypeService'
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';

export default class DataSourceListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSourceList: []

        }

        this.editDataSourceType = this.editDataSourceType.bind(this);
        this.addNewDataSourceType = this.addNewDataSourceType.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        DataSourceTypeService.getDataSourceTypeList().then(response => {
            //console.log(response.data)
            this.setState({
                dataSourceList: response.data
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

    editDataSourceType(dataSourceType) {
        this.props.history.push({
            pathname: "/editDataSourceType",
            state: { dataSourceType: dataSourceType }
        });

    }

    addNewDataSourceType() {

        if (navigator.onLine) {
            this.props.history.push(`/addDataSourceType`)
        } else {
            alert("You must be Online.")
        }


    }
    render() {
        return (
            <>

                <p>{this.props.match.params.message}</p>
                <div>
                    <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewDataSourceType}>{myConst.ADD_NEW_DATA_SOURCE_TYPE}</button><br /><br />
                </div>

                <div className="dataSourceTypeList">

                    <h1>{myConst.DATA_SOURCE_TYPE_LIST}</h1>
                    <table border="1" align="center">
                        <thead>
                            <tr>
                                <th>{myConst.DATASOURCE_TYPE_NAME_EN}</th>
                                <th>{myConst.DATASOURCE_TYPE_NAME_FR}</th>
                                <th>{myConst.DATASOURCE_TYPE_NAME_SP}</th>
                                <th>{myConst.DATASOURCE_TYPE_NAME_PO}</th>
                                <th>{myConst.DATA_SOURCE_TYPE_ACTIVE}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.dataSourceList.map(dataSourceType =>

                                    <tr key={dataSourceType.dataSourceTypeId} onClick={() => this.editDataSourceType(dataSourceType)}>
                                        <td>{dataSourceType.label.label_en}</td>
                                        <td>{dataSourceType.label.label_fr}</td>
                                        <td>{dataSourceType.label.label_sp}</td>
                                        <td>{dataSourceType.label.label_pr}</td>
                                        <td>{dataSourceType.active.toString() == "true" ? "Active" : "Disabled"}</td>
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