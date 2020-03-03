import React, { Component } from 'react';
import { BTN_EXPORT, EXPORT_TITLE, PROGRAM, DATA_EXPORT_SUCCESS } from '../../Labels.js';
import { SECRET_KEY } from '../../Constants.js';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import CryptoJS from 'crypto-js';
import $ from 'jquery';
import 'jquery-validation';

export default class ExportProgramDataComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            programList: [],
            message: ""
        }
        this.exportClicked = this.exportClicked.bind(this);
    }

    componentDidMount() {
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
            db1 = e.target.result;
            var transaction = db1.transaction(['programData'], 'readwrite');
            var program = transaction.objectStore('programData');
            var getRequest = program.getAll();
            var proList = []
            getRequest.onerror = function (event) {
                // Handle errors!
            };
            getRequest.onsuccess = function (event) {
                var myResult = [];
                myResult = getRequest.result;
                var userBytes = CryptoJS.AES.decrypt(localStorage.getItem('curUser'), SECRET_KEY);
                var userId = userBytes.toString(CryptoJS.enc.Utf8);
                for (var i = 0; i < myResult.length; i++) {
                    if (myResult[i].userId == userId) {
                        var bytes = CryptoJS.AES.decrypt(myResult[i].programName, SECRET_KEY);
                        var programName = bytes.toString(CryptoJS.enc.Utf8);
                        var programJson = {
                            name: programName.toString() + "~v" + myResult[i].version,
                            id: myResult[i].id
                        }
                        proList[i] = programJson
                    }
                }
                this.setState({
                    programList: proList
                })
            }.bind(this);
        }.bind(this)
        $("#exportForm").validate({
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
                <h4>{EXPORT_TITLE}</h4><br></br>
                <form name="exportForm" id="exportForm">
                    {PROGRAM} : <select id="programId" name="programId" multiple={true}>
                        {programItems}
                    </select><br></br><br></br>
                    <button type="button" onClick={this.exportClicked}>{BTN_EXPORT}</button>
                </form>
            </div>
        )
    }

    exportClicked() {
        if ($("#exportForm").valid()) {
            var zip = new JSZip();
            var selectedPrgArr = $("#programId").val();
            var selectedPrgArrText = $('#programId option:selected').toArray().map(item => item.text);
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
                db1 = e.target.result;
                var transaction = db1.transaction(['programData'], 'readwrite');
                var program = transaction.objectStore('programData');
                var getRequest = program.getAll();
                getRequest.onerror = function (event) {
                    // Handle errors!
                };
                getRequest.onsuccess = function (event) {
                    var myResult = [];
                    myResult = getRequest.result;
                    for (var i = 0; i < myResult.length; i++) {
                        for (var j = 0; j < selectedPrgArr.length; j++) {
                            if (myResult[i].id == selectedPrgArr[j]) {
                                var txt = JSON.stringify(myResult[i]);
                                zip.file(selectedPrgArrText[i] + "_" + parseInt(i + 1) + ".txt", txt);

                            }
                        }
                        if (i == myResult.length - 1) {
                            zip.generateAsync({
                                type: "blob"
                            }).then(function (content) {
                                FileSaver.saveAs(content, "download.zip");
                            });
                            this.setState({
                                message: `${DATA_EXPORT_SUCCESS}`
                            })
                        }
                    }


                }.bind(this);
            }.bind(this)
        }
    }
}

