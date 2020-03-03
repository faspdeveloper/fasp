import React, { Component } from 'react';
import { BTN_DOWNLOAD, DOWNLOAD_TITLE, DATA_DOWNLOAD_SUCCESS, PROGRAM, OFFLINE_MSG,ACTION_CANCEL,SAME_PROGRAM_OVERWRITE_MESSAGE } from '../../Labels.js';
import ProgramService from '../../api/ProgramService.js';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../../Constants.js'
import AuthenticationService from '../common/AuthenticationService.js';
import $ from 'jquery';
import 'jquery-validation';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default class DownloadProgramDataComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            programList: [],
            message: ""
        }
        this.downloadClicked = this.downloadClicked.bind(this);
    }

    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        ProgramService.getProgramList().then(response => {
            console.log(response.data)
            this.setState({
                programList: response.data
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

        $("#downloadForm").validate({
            ignore: [],
            rules: {
                'programId': {
                    required: true
                },
            }
        })
    }

    render() {
        const { programList } = this.state;
        let programItems = programList.length > 0
            && programList.map((item, i) => {
                return (
                    <option key={i} value={item.programId}>{item.label.label_en}</option>
                )
            }, this);
        return (
            <div>
                <h4>{this.state.message}</h4>
                <h4>{DOWNLOAD_TITLE}</h4><br></br>
                <form name="downloadForm" id="downloadForm">
                    {PROGRAM} : <select id="programId" name="programId" multiple={true}>
                        {programItems}
                    </select><br></br><br></br>
                    <button type="button" onClick={this.downloadClicked}>{BTN_DOWNLOAD}</button>
                </form>
            </div>
        )
    }

    downloadClicked() {
        if (navigator.onLine) {
            if ($("#downloadForm").valid()) {
                confirmAlert({
                    title: 'Confirm to submit',
                    message: `${SAME_PROGRAM_OVERWRITE_MESSAGE}`,
                    buttons: [
                        {
                            label: 'Yes',
                            onClick: () => {
                                var programArr = $("#programId").val();
                                for (var j = 0; j < programArr.length; j++) {
                                    AuthenticationService.setupAxiosInterceptors();
                                    ProgramService.getProgramData(programArr[j])
                                        .then(response => {
                                            var json = response.data;
                                            console.log(json);
                                            var db1;
                                            var storeOS;
                                            var openRequest = indexedDB.open('fasp', 1);
                                            openRequest.onupgradeneeded = function (e) {
                                                var db1 = e.target.result;
                                                if (!db1.objectStoreNames.contains('programData')) {
                                                    storeOS = db1.createObjectStore('programData', { keyPath: 'id', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('lastSyncDate')) {
                                                    storeOS = db1.createObjectStore('lastSyncDate', { keyPath: 'id', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('language')) {
                                                    storeOS = db1.createObjectStore('language', { keyPath: 'languageId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('country')) {
                                                    storeOS = db1.createObjectStore('country', { keyPath: 'countryId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('currency')) {
                                                    storeOS = db1.createObjectStore('currency', { keyPath: 'currencyId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('unit')) {
                                                    storeOS = db1.createObjectStore('unit', { keyPath: 'unitId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('unitType')) {
                                                    storeOS = db1.createObjectStore('unitType', { keyPath: 'unitTypeId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('organisation')) {
                                                    storeOS = db1.createObjectStore('organisation', { keyPath: 'organisationId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('healthArea')) {
                                                    storeOS = db1.createObjectStore('healthArea', { keyPath: 'healthAreaId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('region')) {
                                                    storeOS = db1.createObjectStore('region', { keyPath: 'regionId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('fundingSource')) {
                                                    storeOS = db1.createObjectStore('fundingSource', { keyPath: 'fundingSourceId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('subFundingSource')) {
                                                    storeOS = db1.createObjectStore('subFundingSource', { keyPath: 'subFundingSourceId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('product')) {
                                                    storeOS = db1.createObjectStore('product', { keyPath: 'productId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('productCategory')) {
                                                    storeOS = db1.createObjectStore('productCategory', { keyPath: 'productCategoryId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('dataSource')) {
                                                    storeOS = db1.createObjectStore('dataSource', { keyPath: 'dataSourceId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('dataSourceType')) {
                                                    storeOS = db1.createObjectStore('dataSourceType', { keyPath: 'dataSourceTypeId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('shipmentStatus')) {
                                                    storeOS = db1.createObjectStore('shipmentStatus', { keyPath: 'shipmentStatusId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('shipmentStatusAllowed')) {
                                                    storeOS = db1.createObjectStore('shipmentStatusAllowed', { keyPath: 'shipmentStatusAllowedId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('manufacturer')) {
                                                    storeOS = db1.createObjectStore('manufacturer', { keyPath: 'manufacturerId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('logisticsUnit')) {
                                                    storeOS = db1.createObjectStore('logisticsUnit', { keyPath: 'logisticsUnitId', autoIncrement: true });
                                                }
                                                if (!db1.objectStoreNames.contains('planningUnit')) {
                                                    storeOS = db1.createObjectStore('planningUnit', { keyPath: 'planningUnitId', autoIncrement: true });
                                                }
                                            };
                                            openRequest.onsuccess = function (e) {
                                                console.log('in success')
                                                db1 = e.target.result;
                                                console.log("Json",json)
                                                var transaction = db1.transaction(['programData'], 'readwrite');
                                                var program = transaction.objectStore('programData');
                                                var encryptedText = CryptoJS.AES.encrypt(JSON.stringify(json), SECRET_KEY);
                                                var userBytes = CryptoJS.AES.decrypt(localStorage.getItem('curUser'), SECRET_KEY);
                                                var userId = userBytes.toString(CryptoJS.enc.Utf8);
                                                var item = {
                                                    id: json.programId + "_v" + json.programVersion + "_uId_" + userId,
                                                    programId: json.programId,
                                                    version: json.programVersion,
                                                    programName: (CryptoJS.AES.encrypt((json.label.labelEn), SECRET_KEY)).toString(),
                                                    programData: encryptedText.toString(),
                                                    userId: userId
                                                };
                                                console.log(item)
                                                var putRequest = program.put(item);

                                                putRequest.onerror = function (event) {
                                                    // Handle errors!
                                                };
                                                putRequest.onsuccess = function (event) {
                                                    this.setState({
                                                        message: `${DATA_DOWNLOAD_SUCCESS}`
                                                    })
                                                }.bind(this);
                                            }.bind(this)
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
                                                            message: error.response.data.message
                                                        })
                                                        break
                                                }
                                            }
                                        );
                                }
                            }
                        },
                        {
                            label: 'No',
                            onClick: () => {
                                this.setState({
                                    message: `${ACTION_CANCEL}`
                                })
                            }
                        }
                    ]
                });
            }
        } else {
            alert(`${OFFLINE_MSG}`);
        }
    }

}

