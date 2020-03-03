import React, { Component } from 'react';
import AuthenticationService from '../common/AuthenticationService.js';
import moment from 'moment';
import MasterSyncService from '../../api/MasterSyncService.js';
import { TITLE_MASTER_DATA_SYNC, MASTERS, OF, SYNCED, BTN_RETRY,MASTER_SYNC_SUCCESS,SYNC_FAILED,OFFLINE_MSG } from '../../Labels.js';
import $ from 'jquery';

export default class SyncMasterDataComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalMasters: 19,
            syncedMasters: 0,
            syncedPercentage: 0
        }
        this.syncMasters = this.syncMasters.bind(this);
        this.retryClicked = this.retryClicked.bind(this);
    }

    componentDidMount() {
        this.syncMasters();
    }

    render() {
        return (
            <>
                {this.state.message}
                <div class="panel panel-default">
                    <div class="panel-heading ui-draggable-handle">
                        <h3 class="panel-title">{TITLE_MASTER_DATA_SYNC}</h3>
                    </div>
                    <div class="panel-body">
                        <div class="progress">
                            <div class="progress">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow={this.state.syncedPercentage} aria-valuemin="0" aria-valuemax="100" style={{ 'width': `${this.state.syncedPercentage}%` }}>
                                    {this.state.syncedPercentage}% ({SYNCED} {this.state.syncedMasters} {OF} {this.state.totalMasters} {MASTERS})
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="retryButtonDiv" style={{ 'display': 'none' }}>
                    <button ype="button" onClick={this.retryClicked} className="btn btn-danger pull-right">{BTN_RETRY}</button>
                </div>
            </>
        );
    }

    syncMasters() {
        if (navigator.onLine) {
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
                var transaction = db1.transaction(['lastSyncDate'], 'readwrite');
                var lastSyncDateTransaction = transaction.objectStore('lastSyncDate');
                var updatedSyncDate = ((moment(Date.now()).utcOffset('-0500').format('YYYY-MM-DD HH:mm')));
                var lastSyncDateRequest = lastSyncDateTransaction.get(1);
                lastSyncDateRequest.onsuccess = function (event) {
                    var lastSyncDate = lastSyncDateRequest.result;
                    if (lastSyncDate == undefined) {
                        lastSyncDate = null;
                    }
                    AuthenticationService.setupAxiosInterceptors();

                    //Code to Sync Country list
                    MasterSyncService.getCountryListForSync(lastSyncDate)
                        .then(response => {
                            var json = response.data;
                            var countryTransaction = db1.transaction(['country'], 'readwrite');
                            var countryObjectStore = countryTransaction.objectStore('country');
                            for (var i = 0; i < json.length; i++) {
                                countryObjectStore.put(json[i]);
                            }
                            this.setState({
                                syncedMasters: this.state.syncedMasters + 1,
                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                            })
                            // Code to Sync Currency list
                            MasterSyncService.getCurrencyListForSync(lastSyncDate)
                                .then(response => {
                                    var json = response.data;
                                    var currencyTransaction = db1.transaction(['currency'], 'readwrite');
                                    var currencyObjectStore = currencyTransaction.objectStore('currency');
                                    for (var i = 0; i < json.length; i++) {
                                        currencyObjectStore.put(json[i]);
                                    }
                                    this.setState({
                                        syncedMasters: this.state.syncedMasters + 1,
                                        syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                    })
                                    // Code to sync unit list
                                    MasterSyncService.getUnitListForSync(lastSyncDate)
                                        .then(response => {
                                            var json = response.data;
                                            var unitTransaction = db1.transaction(['unit'], 'readwrite');
                                            var unitObjectStore = unitTransaction.objectStore('unit');
                                            for (var i = 0; i < json.length; i++) {
                                                unitObjectStore.put(json[i]);
                                            }
                                            this.setState({
                                                syncedMasters: this.state.syncedMasters + 1,
                                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                            })
                                            //Code to Sync UnitType list
                                            MasterSyncService.getUnitTypeList()
                                                .then(response => {
                                                    var json = response.data;
                                                    var unitTypeTransaction = db1.transaction(['unitType'], 'readwrite');
                                                    var unitTypeObjectStore = unitTypeTransaction.objectStore('unitType');
                                                    for (var i = 0; i < json.length; i++) {
                                                        unitTypeObjectStore.put(json[i]);
                                                    }
                                                    this.setState({
                                                        syncedMasters: this.state.syncedMasters + 1,
                                                        syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                    })
                                                    //Code to Sync Organisation list
                                                    MasterSyncService.getOrganisationListForSync(lastSyncDate)
                                                        .then(response => {
                                                            var json = response.data;
                                                            var organisationTransaction = db1.transaction(['organisation'], 'readwrite');
                                                            var organisationObjectStore = organisationTransaction.objectStore('organisation');
                                                            for (var i = 0; i < json.length; i++) {
                                                                organisationObjectStore.put(json[i]);
                                                            }
                                                            this.setState({
                                                                syncedMasters: this.state.syncedMasters + 1,
                                                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                            })
                                                            //Code to Sync HealthArea list
                                                            MasterSyncService.getHealthAreaListForSync(lastSyncDate)
                                                                .then(response => {
                                                                    var json = response.data;
                                                                    var healthAreaTransaction = db1.transaction(['healthArea'], 'readwrite');
                                                                    var healthAreaObjectStore = healthAreaTransaction.objectStore('healthArea');
                                                                    for (var i = 0; i < json.length; i++) {
                                                                        healthAreaObjectStore.put(json[i]);
                                                                    }
                                                                    this.setState({
                                                                        syncedMasters: this.state.syncedMasters + 1,
                                                                        syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                    })
                                                                    //Code to Sync Region list
                                                                    MasterSyncService.getRegionListForSync(lastSyncDate)
                                                                        .then(response => {
                                                                            var json = response.data;
                                                                            var regionTransaction = db1.transaction(['region'], 'readwrite');
                                                                            var regionObjectStore = regionTransaction.objectStore('region');
                                                                            for (var i = 0; i < json.length; i++) {
                                                                                regionObjectStore.put(json[i]);
                                                                            }
                                                                            this.setState({
                                                                                syncedMasters: this.state.syncedMasters + 1,
                                                                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                            })
                                                                            //Code to Sync FundingSource list
                                                                            MasterSyncService.getFundingSourceListForSync(lastSyncDate)
                                                                                .then(response => {
                                                                                    var json = response.data;
                                                                                    var fundingSourceTransaction = db1.transaction(['fundingSource'], 'readwrite');
                                                                                    var fundingSourceObjectStore = fundingSourceTransaction.objectStore('fundingSource');
                                                                                    for (var i = 0; i < json.length; i++) {
                                                                                        fundingSourceObjectStore.put(json[i]);
                                                                                    }
                                                                                    this.setState({
                                                                                        syncedMasters: this.state.syncedMasters + 1,
                                                                                        syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                    })
                                                                                    //Code to Sync SubFundingSource list
                                                                                    MasterSyncService.getSubFundingSourceListForSync(lastSyncDate)
                                                                                        .then(response => {
                                                                                            var json = response.data;
                                                                                            var subFundingSourceTransaction = db1.transaction(['subFundingSource'], 'readwrite');
                                                                                            var subFundingSourceObjectStore = subFundingSourceTransaction.objectStore('subFundingSource');
                                                                                            for (var i = 0; i < json.length; i++) {
                                                                                                subFundingSourceObjectStore.put(json[i]);
                                                                                            }
                                                                                            this.setState({
                                                                                                syncedMasters: this.state.syncedMasters + 1,
                                                                                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                            })
                                                                                            //Code to Sync Product list
                                                                                            MasterSyncService.getProductListForSync(lastSyncDate)
                                                                                                .then(response => {
                                                                                                    var json = response.data;
                                                                                                    var productTransaction = db1.transaction(['product'], 'readwrite');
                                                                                                    var productObjectStore = productTransaction.objectStore('product');
                                                                                                    for (var i = 0; i < json.length; i++) {
                                                                                                        productObjectStore.put(json[i]);
                                                                                                    }
                                                                                                    this.setState({
                                                                                                        syncedMasters: this.state.syncedMasters + 1,
                                                                                                        syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                    })
                                                                                                    //Code to Sync ProductCategory list
                                                                                                    MasterSyncService.getProductCategoryListForSync(lastSyncDate)
                                                                                                        .then(response => {
                                                                                                            var json = response.data;
                                                                                                            var productCategoryTransaction = db1.transaction(['productCategory'], 'readwrite');
                                                                                                            var productCategoryObjectStore = productCategoryTransaction.objectStore('productCategory');
                                                                                                            for (var i = 0; i < json.length; i++) {
                                                                                                                productCategoryObjectStore.put(json[i]);
                                                                                                            }
                                                                                                            this.setState({
                                                                                                                syncedMasters: this.state.syncedMasters + 1,
                                                                                                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                            })
                                                                                                            
                                                                                                            //Code to Sync DataSource list
                                                                                                            MasterSyncService.getDataSourceListForSync(lastSyncDate)
                                                                                                                .then(response => {
                                                                                                                    var json = response.data;
                                                                                                                    var dataSourceTransaction = db1.transaction(['dataSource'], 'readwrite');
                                                                                                                    var dataSourceObjectStore = dataSourceTransaction.objectStore('dataSource');
                                                                                                                    for (var i = 0; i < json.length; i++) {
                                                                                                                        dataSourceObjectStore.put(json[i]);
                                                                                                                    }
                                                                                                                    this.setState({
                                                                                                                        syncedMasters: this.state.syncedMasters + 1,
                                                                                                                        syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                                    })
                                                                                                                    
                                                                                                                    //Code to Sync DataSourceType list
                                                                                                                    MasterSyncService.getDataSourceTypeListForSync(lastSyncDate)
                                                                                                                        .then(response => {
                                                                                                                            var json = response.data;
                                                                                                                            var dataSourceTypeTransaction = db1.transaction(['dataSourceType'], 'readwrite');
                                                                                                                            var dataSourceTypeObjectStore = dataSourceTypeTransaction.objectStore('dataSourceType');
                                                                                                                            for (var i = 0; i < json.length; i++) {
                                                                                                                                dataSourceTypeObjectStore.put(json[i]);
                                                                                                                            }
                                                                                                                            this.setState({
                                                                                                                                syncedMasters: this.state.syncedMasters + 1,
                                                                                                                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                                            })
                                                                                                                            
                                                                                                                            //Code to Sync ShipmentStatus list
                                                                                                                            MasterSyncService.getShipmentStatusListForSync(lastSyncDate)
                                                                                                                                .then(response => {
                                                                                                                                    var json = response.data;
                                                                                                                                    var shipmentStatusTransaction = db1.transaction(['shipmentStatus'], 'readwrite');
                                                                                                                                    var shipmentStatusObjectStore = shipmentStatusTransaction.objectStore('shipmentStatus');
                                                                                                                                    for (var i = 0; i < json.length; i++) {
                                                                                                                                        shipmentStatusObjectStore.put(json[i]);
                                                                                                                                    }
                                                                                                                                    this.setState({
                                                                                                                                        syncedMasters: this.state.syncedMasters + 1,
                                                                                                                                        syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                                                    })
                                                                                                                                    
                                                                                                                                    //Code to Sync ShipmentStatusAllowed list
                                                                                                                                    MasterSyncService.getShipmentStatusAllowedListForSync(lastSyncDate)
                                                                                                                                        .then(response => {
                                                                                                                                            var json = response.data;
                                                                                                                                            var shipmentStatusAllowedTransaction = db1.transaction(['shipmentStatusAllowed'], 'readwrite');
                                                                                                                                            var shipmentStatusAllowedObjectStore = shipmentStatusAllowedTransaction.objectStore('shipmentStatusAllowed');
                                                                                                                                            for (var i = 0; i < json.length; i++) {
                                                                                                                                                shipmentStatusAllowedObjectStore.put(json[i]);
                                                                                                                                            }
                                                                                                                                            this.setState({
                                                                                                                                                syncedMasters: this.state.syncedMasters + 1,
                                                                                                                                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                                                            })
                                                                                                                                            
                                                                                                                                            //Code to Sync LogisticsUnit list
                                                                                                                                            MasterSyncService.getLogisticsUnitListForSync(lastSyncDate)
                                                                                                                                                .then(response => {
                                                                                                                                                    var json = response.data;
                                                                                                                                                    var logisticsUnitTransaction = db1.transaction(['logisticsUnit'], 'readwrite');
                                                                                                                                                    var logisticsUnitObjectStore = logisticsUnitTransaction.objectStore('logisticsUnit');
                                                                                                                                                    for (var i = 0; i < json.length; i++) {
                                                                                                                                                        logisticsUnitObjectStore.put(json[i]);
                                                                                                                                                    }
                                                                                                                                                    this.setState({
                                                                                                                                                        syncedMasters: this.state.syncedMasters + 1,
                                                                                                                                                        syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                                                                    })
                                                                                                                                                    
                                                                                                                                                    //Code to Sync PlanningUnit list
                                                                                                                                                    MasterSyncService.getPlanningUnitListForSync(lastSyncDate)
                                                                                                                                                        .then(response => {
                                                                                                                                                            var json = response.data;
                                                                                                                                                            var planningUnitTransaction = db1.transaction(['planningUnit'], 'readwrite');
                                                                                                                                                            var planningUnitObjectStore = planningUnitTransaction.objectStore('planningUnit');
                                                                                                                                                            for (var i = 0; i < json.length; i++) {
                                                                                                                                                                planningUnitObjectStore.put(json[i]);
                                                                                                                                                            }
                                                                                                                                                            this.setState({
                                                                                                                                                                syncedMasters: this.state.syncedMasters + 1,
                                                                                                                                                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                                                                            })
                                                                                                                                                            
                                                                                                                                                            //Code to Sync Manufacturer list
                                                                                                                                                            MasterSyncService.getManufacturerListForSync(lastSyncDate)
                                                                                                                                                                .then(response => {
                                                                                                                                                                    var json = response.data;
                                                                                                                                                                    var manufacturerTransaction = db1.transaction(['manufacturer'], 'readwrite');
                                                                                                                                                                    var manufacturerObjectStore = manufacturerTransaction.objectStore('manufacturer');
                                                                                                                                                                    for (var i = 0; i < json.length; i++) {
                                                                                                                                                                        manufacturerObjectStore.put(json[i]);
                                                                                                                                                                    }
                                                                                                                                                                    this.setState({
                                                                                                                                                                        syncedMasters: this.state.syncedMasters + 1,
                                                                                                                                                                        syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                                                                                    })
                                                                                                                                                                    
                                                                                                                                                                    MasterSyncService.getLanguageListForSync(lastSyncDate)
                                                                                                                                                                        .then(response => {
                                                                                                                                                                            var json = response.data;
                                                                                                                                                                            var languageTransaction = db1.transaction(['language'], 'readwrite');
                                                                                                                                                                            var languageObjectStore = languageTransaction.objectStore('language');
                                                                                                                                                                            for (var i = 0; i < json.length; i++) {
                                                                                                                                                                                languageObjectStore.put(json[i]);
                                                                                                                                                                            }


                                                                                                                                                                            this.setState({
                                                                                                                                                                                syncedMasters: this.state.syncedMasters + 1,
                                                                                                                                                                                syncedPercentage: Math.floor(((this.state.syncedMasters + 1) / this.state.totalMasters) * 100)
                                                                                                                                                                            })
                                                                                                                                                                            
                                                                                                                                                                            if (this.state.syncedMasters === this.state.totalMasters) {
                                                                                                                                                                                var transaction = db1.transaction(['lastSyncDate'], 'readwrite');
                                                                                                                                                                                var lastSyncDateTransaction = transaction.objectStore('lastSyncDate');
                                                                                                                                                                                var updatedLastSyncDateJson = {
                                                                                                                                                                                    lastSyncDate: updatedSyncDate,
                                                                                                                                                                                    id: 1
                                                                                                                                                                                }
                                                                                                                                                                                var updateLastSyncDate = lastSyncDateTransaction.put(updatedLastSyncDateJson)
                                                                                                                                                                                updateLastSyncDate.onsuccess = function (event) {
                                                                                                                                                                                    $("#retryButtonDiv").hide();
                                                                                                                                                                                    this.setState({
                                                                                                                                                                                        message: `${MASTER_SYNC_SUCCESS}`
                                                                                                                                                                                    })
                                                                                                                                                                                }.bind(this)
                                                                                                                                                                            } else {
                                                                                                                                                                                this.setState({
                                                                                                                                                                                    message: `${SYNC_FAILED}`
                                                                                                                                                                                })
                                                                                                                                                                            }
                                                                                                                                                                        })
                                                                                                                                                                        .catch(
                                                                                                                                                                            error => {
                                                                                                                                                                                $("#retryButtonDiv").show();
                                                                                                                                                                                this.setState({
                                                                                                                                                                                    message: `${SYNC_FAILED}`
                                                                                                                                                                                })
                                                                                                                                                                            }
                                                                                                                                                                        );
                                                                                                                                                                })
                                                                                                                                                                .catch(
                                                                                                                                                                    error => {
                                                                                                                                                                        $("#retryButtonDiv").show();
                                                                                                                                                                        this.setState({
                                                                                                                                                                            message: `${SYNC_FAILED}`
                                                                                                                                                                        })
                                                                                                                                                                    });
                                                                                                                                                        })
                                                                                                                                                        .catch(
                                                                                                                                                            error => {
                                                                                                                                                                $("#retryButtonDiv").show();
                                                                                                                                                                this.setState({
                                                                                                                                                                    message: `${SYNC_FAILED}`
                                                                                                                                                                })
                                                                                                                                                            });
                                                                                                                                                })
                                                                                                                                                .catch(
                                                                                                                                                    error => {
                                                                                                                                                        $("#retryButtonDiv").show();
                                                                                                                                                        this.setState({
                                                                                                                                                            message: `${SYNC_FAILED}`
                                                                                                                                                        })
                                                                                                                                                    });
                                                                                                                                        })
                                                                                                                                        .catch(
                                                                                                                                            error => {
                                                                                                                                                $("#retryButtonDiv").show();
                                                                                                                                                this.setState({
                                                                                                                                                    message: `${SYNC_FAILED}`
                                                                                                                                                })
                                                                                                                                            });
                                                                                                                                })
                                                                                                                                .catch(
                                                                                                                                    error => {
                                                                                                                                        $("#retryButtonDiv").show();
                                                                                                                                        this.setState({
                                                                                                                                            message: `${SYNC_FAILED}`
                                                                                                                                        })
                                                                                                                                    });
                                                                                                                        })
                                                                                                                        .catch(
                                                                                                                            error => {
                                                                                                                                $("#retryButtonDiv").show();
                                                                                                                                this.setState({
                                                                                                                                    message: `${SYNC_FAILED}`
                                                                                                                                })
                                                                                                                            });
                                                                                                                })
                                                                                                                .catch(
                                                                                                                    error => {
                                                                                                                        $("#retryButtonDiv").show();
                                                                                                                        this.setState({
                                                                                                                            message: `${SYNC_FAILED}`
                                                                                                                        })
                                                                                                                    });
                                                                                                        })
                                                                                                        .catch(
                                                                                                            error => {
                                                                                                                $("#retryButtonDiv").show();
                                                                                                                this.setState({
                                                                                                                    message: `${SYNC_FAILED}`
                                                                                                                })
                                                                                                            });
                                                                                                })
                                                                                                .catch(
                                                                                                    error => {
                                                                                                        $("#retryButtonDiv").show();
                                                                                                        this.setState({
                                                                                                            message: `${SYNC_FAILED}`
                                                                                                        })
                                                                                                    });
                                                                                        })
                                                                                        .catch(
                                                                                            error => {
                                                                                                $("#retryButtonDiv").show();
                                                                                                this.setState({
                                                                                                    message: `${SYNC_FAILED}`
                                                                                                })
                                                                                            });
                                                                                })
                                                                                .catch(
                                                                                    error => {
                                                                                        $("#retryButtonDiv").show();
                                                                                        this.setState({
                                                                                            message: `${SYNC_FAILED}`
                                                                                        })
                                                                                    });
                                                                        })
                                                                        .catch(
                                                                            error => {
                                                                                $("#retryButtonDiv").show();
                                                                                this.setState({
                                                                                    message: `${SYNC_FAILED}`
                                                                                })
                                                                            });
                                                                })
                                                                .catch(
                                                                    error => {
                                                                        $("#retryButtonDiv").show();
                                                                        this.setState({
                                                                            message: `${SYNC_FAILED}`
                                                                        })
                                                                    });
                                                        })
                                                        .catch(
                                                            error => {
                                                                $("#retryButtonDiv").show();
                                                                this.setState({
                                                                    message: `${SYNC_FAILED}`
                                                                })
                                                            });
                                                })
                                                .catch(
                                                    error => {
                                                        $("#retryButtonDiv").show();
                                                        this.setState({
                                                            message: `${SYNC_FAILED}`
                                                        })
                                                    });
                                        })
                                        .catch(
                                            error => {
                                                $("#retryButtonDiv").show();
                                                this.setState({
                                                    message: `${SYNC_FAILED}`
                                                })
                                            });
                                })
                                .catch(
                                    error => {
                                        $("#retryButtonDiv").show();
                                        this.setState({
                                            message: `${SYNC_FAILED}`
                                        })
                                    });
                        })
                        .catch(
                            error => {
                                $("#retryButtonDiv").show();
                                this.setState({
                                    message: `${SYNC_FAILED}`
                                })
                            });
                }.bind(this)
            }.bind(this)
        } else {
            alert(`${OFFLINE_MSG}`);
        }
    }

    retryClicked() {
        this.syncMasters();
    }
}