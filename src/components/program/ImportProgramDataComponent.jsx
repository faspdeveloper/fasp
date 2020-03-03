import React, { Component } from 'react';
import { IMPORT_TITLE, BTN_IMPORT, DATA_IMPORT_SUCCESS, IMPORT_PROGRAM, BTN_SUBMIT, SELECT_FILE, SELECT_ZIP_FILE,ACTION_CANCEL,SAME_PROGRAM_OVERWRITE_MESSAGE  } from '../../Labels.js';
import { SECRET_KEY } from '../../Constants.js';
import JSZip from 'jszip';
import CryptoJS from 'crypto-js';
import $ from 'jquery';
import 'jquery-validation';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default class ImportProgramDataComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            programList: []
        }
        this.importClicked = this.importClicked.bind(this);
        this.programSubmitClicked = this.programSubmitClicked.bind(this);
    }

    componentDidMount() {
        $("#programDiv").hide();
        $("#importDiv").show();
        $("#importForm").validate({
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
                    <option key={i} value={item.id}>{item.name}</option>
                )
            }, this);
        return (
            <div>
                <h4>{this.state.message}</h4>
                <h4>{IMPORT_TITLE}</h4><br></br>
                <form id="importForm" name="importForm">
                    <div id="importDiv">
                        <input type="file" /><br></br><br></br>
                        <button type="button" onClick={this.importClicked}>{BTN_IMPORT}</button>
                    </div>
                    <div id="programDiv">
                        {IMPORT_PROGRAM} : <select id="programId" name="programId" multiple={true}>
                            {programItems}
                        </select><br></br><br></br>
                        <button type="button" onClick={this.programSubmitClicked}>{BTN_SUBMIT}</button>
                    </div>
                </form>
            </div>
        )
    }

    importClicked() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            if (document.querySelector('input[type=file]').files[0] == undefined) {
                alert(`${SELECT_FILE}`);
            } else {
                var file = document.querySelector('input[type=file]').files[0];
                var fileName = file.name;
                var fileExtenstion = fileName.split(".");
                if (fileExtenstion[1] == "zip") {
                    JSZip.loadAsync(file).then(function (zip) {
                        var i = 0;
                        var fileName = []
                        var size = 0;
                        Object.keys(zip.files).forEach(function (filename) {
                            size++;
                        })
                        Object.keys(zip.files).forEach(function (filename) {
                            zip.files[filename].async('string').then(function (fileData) {
                                i++;
                                var programDataJson = JSON.parse(fileData);
                                var bytes = CryptoJS.AES.decrypt(programDataJson.programData, SECRET_KEY);
                                var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                                var programDataJsonDecrypted = JSON.parse(plaintext);
                                fileName[i] = {
                                    id: filename,
                                    name: programDataJsonDecrypted.label.labelEn + "~v" + programDataJsonDecrypted.programVersion
                                }
                                if (i === size) {
                                    this.setState({
                                        programList: fileName
                                    })

                                    $("#programDiv").show();
                                    $("#importDiv").hide();
                                }
                            }.bind(this))

                        }.bind(this))

                    }.bind(this))
                } else {
                    alert(`${SELECT_ZIP_FILE}`)
                }
            }

        }

    }

    programSubmitClicked() {
        if ($("#importForm").valid()) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                if (document.querySelector('input[type=file]').files[0] == undefined) {
                    alert(`${SELECT_FILE}`);
                } else {
                    confirmAlert({
                        title: 'Confirm to submit',
                        message: `${SAME_PROGRAM_OVERWRITE_MESSAGE}`,
                        buttons: [
                            {
                                label: 'Yes',
                                onClick: () => {
                         
                                var file = document.querySelector('input[type=file]').files[0];
                                var db1;
                                var storeOS;
                                var openRequest = indexedDB.open('fasp', 1);
                                var selectedPrgArr = $("#programId").val();
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
                                    db1 = e.target.result;
                                    var transaction = db1.transaction(['programData'], 'readwrite');
                                    var program = transaction.objectStore('programData');
                                    JSZip.loadAsync(file).then(function (zip) {
                                        Object.keys(zip.files).forEach(function (filename) {
            
                                            zip.files[filename].async('string').then(function (fileData) {
                                                for (var j = 0; j < selectedPrgArr.length; j++) {
                                                    if (selectedPrgArr[j] == filename) {
                                                        db1 = e.target.result;
                                                        var transaction2 = db1.transaction(['programData'], 'readwrite');
                                                        var program2 = transaction2.objectStore('programData');
                                                        var json = JSON.parse(fileData);
                                                        var userBytes = CryptoJS.AES.decrypt(localStorage.getItem('curUser'), SECRET_KEY);
                                                        var userId = userBytes.toString(CryptoJS.enc.Utf8);
                                                        json.userId = userId;
                                                        json.id = json.programId + "_v" + json.version + "_uId_" + userId
                                                        var addProgramDataRequest = program2.put(json);
                                                        addProgramDataRequest.onerror = function (event) {
                                                        };
                                                        addProgramDataRequest.onsuccess = function (event) {
                                                        };
                                                    }
            
                                                }
                                            })
                                        })
                                    })
                                    this.setState({
                                        message: `${DATA_IMPORT_SUCCESS}`
                                    })
                                    $("#programDiv").hide();
                                    $("#importDiv").show();
                                }.bind(this)
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
            }
        }
    }
}
