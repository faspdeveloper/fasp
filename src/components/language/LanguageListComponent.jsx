import React, { Component } from 'react';
import LanguageService from '../../api/LanguageService.js'
import * as myConst from '../../Labels.js';
import AuthenticationService from '../common/AuthenticationService.js';



export default class LanguageListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            langaugeList: []
        }
        this.editLanguage = this.editLanguage.bind(this);
        this.addNewLanguage = this.addNewLanguage.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        LanguageService.getLanguageList()
            .then(response => {
                console.log(response.data)
                this.setState({
                    langaugeList: response.data
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

    editLanguage(language) {
        this.props.history.push({
            pathname: "/editLanguage",
            state: { language: language }
        });
    }

    addNewLanguage(){
        if (navigator.onLine) {
            this.props.history.push(`/addLanguage`)
        } else {
            alert("You must be Online.")
        }

    }

    render() {
        return (
            <>
            <p>{this.props.match.params.message}</p>
            <div>
             <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewLanguage}>{myConst.ADD_NEW_LANGUAGE_TITLE}</button><br /><br />
            </div>  
              <div className="langaugeList">

                    <table border="1" align="center">
                        <thead>
                            <tr>
                                <th>{myConst.LANGUAGE_NAME}</th>
                                <th>{myConst.IS_ACTIVE}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.langaugeList.map(language =>

                                    <tr key={language.languageId} onClick={() => this.editLanguage(language)}>
                                        <td>{language.languageName}</td>
                                        <td>{language.active.toString() == "true" ? "Active" : "Disabled"}</td>
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