import React, { Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import LabelsService from '../../api/LabelService.js';
import { LabelModal } from './LabelModal.js';

export default class LabelListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            labelList: []
        }
        this.editLabel=this.editLabel.bind(this);
    }
    componentDidMount() {

        AuthenticationService.setupAxiosInterceptors();
        LabelsService.getLabelsListAll().then(response => {
            //console.log(response.data)
            this.setState({
                labelList: response.data
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

    editLabel(label) {
        this.props.history.push({
            pathname: "/editLabels",
            state: { label: label }
        });

    }
    render() {

        return (
            <>

                <div className="page-content-wrap">



                    <div className="row">
                        <div>
                            <ul class="breadcrumb text-left">
                                <li><a href="#">Home</a></li>
                                <li><a href="#">Forms Stuff</a></li>
                                <li class="active">Form Wizards</li>


                            </ul>
                        </div>

                        <div className="col-md-12">

                            <div className="mt-2">


                                <div className="panel panel-default">


                                <div className="panel-heading">
                                    <h3 className="panel-title">Label List</h3>
                                </div>
                                <div className="panel-body text-left">
                                    <div className="col-md-12">



                                        <div className="table-responsive">
                                            <table className="table ">
                                                <thead>
                                                    <tr>
                                                        <th>LABEL_EN</th>
                                                        <th>LABEL_FR</th>
                                                        <th>LABEL_PR</th>
                                                        <th>LABEL_SP</th>
                                                        {/* <th>ACTIVE</th> */}
                                                        <th>CREATED DATE</th>
                                                         <th>MODIFIED DATE</th>



                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.labelList.map(label =>

                                                            <tr key={label.labelId} onClick={() => this.editLabel(label)}>
                                                                <td>{label.label_en}</td>
                                                                <td>{label.label_fr}</td>
                                                                <td>{label.label_pr}</td>
                                                                <td>{label.label_sp}</td>
                                                                    {/* <td>{label.active.toString() == "true" ? "Active" : "Disabled"}</td> */}
                                                                    <td>{label.createdDate}</td>
                                                                    <td>{label.lastModifiedDate}</td>
                                                                </tr>
                                                            )

                                                        }
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>

                                    </div>



                                </div>


                            </div>


                        </div>


                    </div>


                </div>


            </>
        );

    }

}