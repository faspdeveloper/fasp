import React from "react";
import ReactDOM from "react-dom";
import jexcel from "jexcel";
import "jsuites";
import { SECRET_KEY } from '../../Constants.js';
import CryptoJS from 'crypto-js';
import "../../../node_modules/jexcel/dist/jexcel.css";
import { PROGRAM, CATEGORY, PRODUCT, BTN_GO, ADD_ROW, TITLE_CONSUMPTION_DETAILS, START_DATE, QUANTITY, STOP_DATE, REGION, DAYS_OF_STOCK_OUT, DATA_SOURCE, LOGISTICS_UNIT, PLANNING_UNIT, PACK_SIZE, QUANTITY_IN_TERMS_OF_FORECAST_UNIT, QUANTITY_OF_PLANNING_UNIT, NOTHING_SELECTED, QUANTITY_OF_FORECAST_UNIT_FOR_LU, QUANTITY_OF_FORECAST_UNIT_FOR_PU, BTN_SAVE, DATA_DOWNLOAD_SUCCESS, CONSUMPTION_SAVE_SUCCESS, CLICK_SAVE_TO_CONTINUE } from '../../Labels.js';
import moment from 'moment';
import $ from 'jquery';
import "jquery-mask-plugin";

export default class ConsuptionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.options = props.options;
    this.state = {
      programList: [],
      categoryList: [],
      productList: [],
      consumptionDataList: [],
      changedFlag: []
    }
    this.getProductList = this.getProductList.bind(this);
    this.getConsumptionData = this.getConsumptionData.bind(this);
    this.saveData = this.saveData.bind(this)
  }

  componentDidMount = function () {
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

      var categoryTransaction = db1.transaction(['productCategory'], 'readwrite');
      var categoryOs = categoryTransaction.objectStore('productCategory');
      var catRequest = categoryOs.getAll();
      var catList = []
      catRequest.onerror = function (event) {
        // Handle errors!
      };
      catRequest.onsuccess = function (event) {
        var myResult = [];
        myResult = catRequest.result;
        var nothingSelectedJson = {
          name: `${NOTHING_SELECTED}`,
          id: 0
        }
        catList[0] = nothingSelectedJson;
        for (var i = 0; i < myResult.length; i++) {
          var categoryJson = {
            name: myResult[i].label.labelEn,
            id: myResult[i].productCategoryId
          }
          catList[i + 1] = categoryJson
        }
        this.setState({
          categoryList: catList
        })
      }.bind(this);
    }.bind(this)



  };

  addRow = function () {
    this.el.insertRow();
  };

  checkValidation() {
    var valid = true;
    var json = this.el.getJson();
    console.log(json)
    for (var y = 0; y < json.length; y++) {
      var col = ("A").concat(parseInt(y) + 1);
      var value = this.el.getValueFromCoords(0, y);
      if (value == "Invalid date" || value=="") {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "This field is required");
        valid = false;
      } else {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setComments(col, "");
      }

      var col = ("B").concat(parseInt(y) + 1);
      var value = this.el.getValueFromCoords(1, y);
      if (value == "Invalid date" || value=="") {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "This field is required");
        valid = false;
      } else {
        if (Date.parse(this.el.getValueFromCoords(0, y)) > Date.parse(value)) {
          this.el.setStyle(col, "background-color", "transparent");
          this.el.setStyle(col, "background-color", "yellow");
          this.el.setComments(col, "Stop date must be greater than start date");
          valid = false;
        } else {
          this.el.setStyle(col, "background-color", "transparent");
          this.el.setComments(col, "");
        }
      }

      var col = ("C").concat(parseInt(y) + 1);
      var value = this.el.getValueFromCoords(2, y);
      if (value == "") {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "This field is required");
        valid = false;
      } else {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setComments(col, "");
      }

      var col = ("D").concat(parseInt(y) + 1);
      var value = this.el.getValueFromCoords(3, y);
      console.log(value);
      if (value === "") {
        console.log("in value is blank");
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "This field is required");
        valid = false;
      } else {
        if (value >= 0) {
          console.log("in value greater than 0")
          this.el.setStyle(col, "background-color", "transparent");
          this.el.setComments(col, "");
        } else {
          console.log("in else for days of stock out");
          this.el.setStyle(col, "background-color", "transparent");
          this.el.setStyle(col, "background-color", "yellow");
          this.el.setComments(col, "Please enter numeric data");
          valid = false;
        }
      }
      var col = ("E").concat(parseInt(y) + 1);
      var value = this.el.getValueFromCoords(4, y);
      if (value == "") {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "This field is required");
        valid = false;
      } else {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setComments(col, "");
      }

      var col1 = ("F").concat(parseInt(y) + 1);
      var value1 = this.el.getValueFromCoords(5, y);

      var col2 = ("G").concat(parseInt(y) + 1);
      var value2 = this.el.getValueFromCoords(6, y);
      if (value1 == "" && value2 == "") {
        this.el.setStyle(col1, "background-color", "transparent");
        this.el.setStyle(col1, "background-color", "yellow");
        this.el.setComments(col1, "Please enter either LU or PU");
        this.el.setStyle(col2, "background-color", "transparent");
        this.el.setStyle(col2, "background-color", "yellow");
        this.el.setComments(col2, "Please enter either LU or PU");
        valid = false;
      } else {
        this.el.setStyle(col1, "background-color", "transparent");
        this.el.setComments(col1, "");
        this.el.setStyle(col2, "background-color", "transparent");
        this.el.setComments(col2, "");
      }

      var col = ("H").concat(parseInt(y) + 1);
      var value = this.el.getValueFromCoords(7, y);
      if (value2 > 0) {
        if (value == "") {
          this.el.setStyle(col, "background-color", "transparent");
          this.el.setStyle(col, "background-color", "yellow");
          this.el.setComments(col, "This field is required");
          valid = false;
        } else {
          if (value > 0) {
            console.log("in value greater than 0")
            this.el.setStyle(col, "background-color", "transparent");
            this.el.setComments(col, "");
          } else {
            console.log("in else for days of stock out");
            this.el.setStyle(col, "background-color", "transparent");
            this.el.setStyle(col, "background-color", "yellow");
            this.el.setComments(col, "Please enter numeric data greater than 0");
            valid = false;
          }
        }
      }
      var col = ("L").concat(parseInt(y) + 1);
      var value = this.el.getValueFromCoords(11, y);
      console.log(value);
      if (value === "") {
        console.log("in value is blank");
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "This field is required");
        valid = false;
      } else {
        if (value > 0) {
          console.log("in value greater than 0")
          this.el.setStyle(col, "background-color", "transparent");
          this.el.setComments(col, "");
        } else {
          console.log("in else for days of stock out");
          this.el.setStyle(col, "background-color", "transparent");
          this.el.setStyle(col, "background-color", "yellow");
          this.el.setComments(col, "Please enter numeric data greater than 0");
          valid = false;
        }
      }
    }
    return valid;
  }

  saveData = function () {
    var validation = this.checkValidation();
    if (validation == true) {
      console.log("after check validation")
      var tableJson = this.el.getJson();
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
        var programTransaction = transaction.objectStore('programData');
        var programRequest = programTransaction.get(this.state.programId);
        programRequest.onsuccess = function (event) {
          var programDataBytes = CryptoJS.AES.decrypt(programRequest.result.programData, SECRET_KEY);
          var programData = programDataBytes.toString(CryptoJS.enc.Utf8);
          var programJson = JSON.parse(programData);
          var programProductList = programJson.programProductList;
          var consumptionDataList = [];
          var consumptionDataArr = [];
          for (var i = 0; i < programProductList.length; i++) {
            if (programProductList[i].product.productId == this.state.productId) {
              consumptionDataList = programProductList[i].product.consumptionData;
            }
          }
          for (var i = 0; i < consumptionDataList.length; i++) {
            var map = new Map(Object.entries(tableJson[i]))
            consumptionDataList[i].startDate = map.get("0");
            consumptionDataList[i].stopDate = map.get("1");
            consumptionDataList[i].region.regionId = map.get("2");
            consumptionDataList[i].daysOfStockOut = parseInt(map.get("3"));
            consumptionDataList[i].dataSource.dataSourceId = map.get("4");
            consumptionDataList[i].logisticsUnit.logisticsUnitId = map.get("5");
            consumptionDataList[i].planningUnit.planningUnitId = map.get("6");
            consumptionDataList[i].packSize = map.get("7");
            consumptionDataList[i].logisticsUnit.qtyOfPlanningUnits = map.get("8");
            consumptionDataList[i].logisticsUnit.planningUnit.qtyOfForecastingUnits = map.get("9");
            consumptionDataList[i].planningUnit.qtyOfForecastingUnits = map.get("10");
            consumptionDataList[i].consumptionQty = map.get("11");
          }
          for (var i = consumptionDataList.length; i < tableJson.length; i++) {
            var map = new Map(Object.entries(tableJson[i]))
            var json = {
              startDate: map.get("0"),
              stopDate: map.get("1"),
              region: {
                regionId: map.get("2")
              },
              daysOfStockOut: map.get("3"),
              dataSource: {
                dataSourceId: map.get("4")
              },
              logisticsUnit: {
                logisticsUnitId: map.get("5"),
                qtyOfPlanningUnits: map.get("8"),
                planningUnit: {
                  qtyOfForecastingUnits: map.get("9")
                }
              },
              planningUnit: {
                planningUnitId: map.get("6"),
                qtyOfForecastingUnits: map.get("10")
              },
              packSize: map.get("7"),
              consumptionQty: map.get("11")
            }
            consumptionDataList[i] = json;
          }
          var productFound = 0;
          for (var i = 0; i < programProductList.length; i++) {
            if (programProductList[i].product.productId == this.state.productId) {
              productFound = 1;
              programProductList[i].product.consumptionData = consumptionDataList;
            }
          }
          if (productFound == 0) {
            var length = programProductList.length;
            programProductList[length] = {
              product: {}
            }
            programProductList[length].product = {
              productId: this.state.productId,
              consumptionData: consumptionDataList
            }

          }
          programJson.programProductList = programProductList;
          programRequest.result.programData = (CryptoJS.AES.encrypt(JSON.stringify(programJson), SECRET_KEY)).toString();
          var putRequest = programTransaction.put(programRequest.result);

          putRequest.onerror = function (event) {
            // Handle errors!
          };
          putRequest.onsuccess = function (event) {
            $("#saveButtonDiv").hide();
            this.setState({
              message: `${CONSUMPTION_SAVE_SUCCESS}`,
              changedFlag: 0
            })
          }.bind(this)
        }.bind(this)
      }.bind(this)
    } else {
      this.setState({
        message: "Data is invalid"
      })
    }
  };

  render() {
    const { programList } = this.state;
    let programItems = programList.length > 0
      && programList.map((item, i) => {
        return (
          <option key={i} value={item.id}>{item.name}</option>
        )
      }, this);

    const { categoryList } = this.state;
    let categoryItems = categoryList.length > 0
      && categoryList.map((item, i) => {
        return (
          <option key={i} value={item.id}>{item.name}</option>
        )
      }, this);

    const { productList } = this.state;
    let productItems = productList.length > 0
      && productList.map((item, i) => {
        return (
          <option key={i} value={item.id}>{item.name}</option>
        )
      }, this);
    return (
      <div>
        <div class="row">
          <div class="col-md-12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">{TITLE_CONSUMPTION_DETAILS}</h3>
              </div>
              <div class="panel-body">
                {this.state.message}
                <div id="filter">
                  <div class="panel panel-warning">
                    <div class="panel-body">
                      <form name="form1" id="form1">
                        <div class="row">
                          <div class="col-md-2">
                            <div class="form-group">
                              {PROGRAM} : <select id="programId" name="programId">
                                {programItems}
                              </select>
                            </div>
                          </div>
                          <div class="col-md-2">
                            <div class="form-group">
                              {CATEGORY} : <select id="categoryId" name="categoryId" onChange={this.getProductList}>
                                {categoryItems}
                              </select>
                            </div>
                          </div>
                          <div class="col-md-2">
                            <div class="form-group">
                              {PRODUCT} : <select id="productId" name="productId">
                                {productItems}
                              </select>
                            </div>
                          </div>

                          <div class="col-md-2 btn-filter">
                            <button type="button" class="btn-info btn-sm" name="btnSubmit" onClick={this.getConsumptionData}>{BTN_GO}</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <div id="consumptionId">{this.options}</div>
                <div />
                <br />
                <input
                  type="button"
                  value={ADD_ROW}
                  onClick={() => this.addRow()}
                />
                <div id="saveButtonDiv" style={{ "display": "none" }}>
                  <input
                    type="button"
                    value={BTN_SAVE}
                    onClick={() => this.saveData()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getProductList(event) {
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
      var productTransaction = db1.transaction(['product'], 'readwrite');
      var productOs = productTransaction.objectStore('product');
      var productRequest = productOs.getAll();
      var proList = []
      productRequest.onerror = function (event) {
        // Handle errors!
      };
      productRequest.onsuccess = function (event) {
        var myResult = [];
        myResult = productRequest.result;
        for (var i = 0; i < myResult.length; i++) {
          if (myResult[i].productCategory.productCategoryId == $("#categoryId").val()) {
            var productJson = {
              name: myResult[i].label.labelEn,
              id: myResult[i].productId
            }
            proList[i] = productJson
          }
        }
        this.setState({
          productList: proList
        })
      }.bind(this);
    }.bind(this)
    // event.target.value    
  }

  getConsumptionData() {
    this.setState({
      productId: $("#productId").val(),
      productCategoryId: $("#categoryId").val(),
      programId: $("#programId").val()
    })
    if (this.state.changedFlag == 1) {
      alert(`${CLICK_SAVE_TO_CONTINUE}`)
    } else {
      this.el = jexcel(ReactDOM.findDOMNode(this).children[0].children[0].children[0].children[1].children[3], '');
      this.el.destroy();
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
        var programTransaction = transaction.objectStore('programData');
        var programRequest = programTransaction.get(this.state.programId);
        programRequest.onsuccess = function (event) {
          var programDataBytes = CryptoJS.AES.decrypt(programRequest.result.programData, SECRET_KEY);
          var programData = programDataBytes.toString(CryptoJS.enc.Utf8);
          var programJson = JSON.parse(programData);
          var programProductList = programJson.programProductList;
          var consumptionDataList = [];
          var consumptionDataArr = [];
          for (var i = 0; i < programProductList.length; i++) {
            if (programProductList[i].product.productId == this.state.productId) {
              consumptionDataList = programProductList[i].product.consumptionData;
            }
          }
          this.setState({
            consumptionDataList: consumptionDataList
          })
          var data = [];
          if (consumptionDataList.length == 0) {
            data = [];
            consumptionDataArr[0] = data;
          }
          for (var j = 0; j < consumptionDataList.length; j++) {
            data = [];
            data[0] = moment(consumptionDataList[j].startDate).format('YYYY-MM-DD');// A
            data[1] = moment(consumptionDataList[j].stopDate).format('YYYY-MM-DD');//B
            data[2] = consumptionDataList[j].region.regionId;//C
            data[3] = consumptionDataList[j].daysOfStockOut;//D
            data[4] = consumptionDataList[j].dataSource.dataSourceId;//E
            data[5] = consumptionDataList[j].logisticsUnit.logisticsUnitId;//F
            data[6] = consumptionDataList[j].planningUnit.planningUnitId;//G
            data[7] = consumptionDataList[j].packSize;//H
            data[8] = consumptionDataList[j].logisticsUnit.qtyOfPlanningUnits;//I
            data[9] = consumptionDataList[j].logisticsUnit.planningUnit.qtyOfForecastingUnits;//J
            data[10] = consumptionDataList[j].planningUnit.qtyOfForecastingUnits;//K
            data[11] = consumptionDataList[j].consumptionQty;//L
            data[12] = `=IF(F${j + 1}!=0,I${j + 1}*J${j + 1}*L${j + 1},H${j + 1}*K${j + 1}*L${j + 1})`
            consumptionDataArr[j] = data;
          }
          var regionTransaction = db1.transaction(['region'], 'readwrite');
          var regionOs = regionTransaction.objectStore('region');
          var regList = []
          var regionRequest = regionOs.getAll();
          regionRequest.onsuccess = function (event) {
            var regionResult = [];
            regionResult = regionRequest.result;
            for (var k = 0; k < regionResult.length; k++) {
              var regionJson = {
                name: regionResult[k].label.labelEn,
                id: regionResult[k].regionId
              }
              regList[k] = regionJson
            }


            var dataSourceTransaction = db1.transaction(['dataSource'], 'readwrite');
            var dataSourceOs = dataSourceTransaction.objectStore('dataSource');
            var dataSourceList = []
            var dataSourceRequest = dataSourceOs.getAll();
            dataSourceRequest.onsuccess = function (event) {
              var dataSourceResult = [];
              dataSourceResult = dataSourceRequest.result;
              for (var k = 0; k < dataSourceResult.length; k++) {
                var dataSourceJson = {
                  name: dataSourceResult[k].label.labelEn,
                  id: dataSourceResult[k].dataSourceId
                }
                dataSourceList[k] = dataSourceJson
              }

              var logisticsUnitTransaction = db1.transaction(['logisticsUnit'], 'readwrite');
              var logisticsUnitOs = logisticsUnitTransaction.objectStore('logisticsUnit');
              var logisticsUnitList = []
              var logisticsUnitRequest = logisticsUnitOs.getAll();
              logisticsUnitRequest.onsuccess = function (event) {
                var logisticsUnitResult = [];
                logisticsUnitResult = logisticsUnitRequest.result;
                var logisticsUnitListLength = 0;
                var planningUnitListLength = 0;
                var nothingSelectedJson = {
                  name: "",
                  id: 0
                }
                logisticsUnitList[logisticsUnitListLength] = nothingSelectedJson;
                console.log("Logistics unit", logisticsUnitResult);
                for (var k = 0; k < logisticsUnitResult.length; k++) {
                  if (logisticsUnitResult[k].planningUnit.productId == this.state.productId) {
                    logisticsUnitListLength++;
                    var logisticsUnitJson = {
                      name: logisticsUnitResult[k].label.labelEn,
                      id: logisticsUnitResult[k].logisticsUnitId
                    }
                    logisticsUnitList[logisticsUnitListLength] = logisticsUnitJson
                  }
                }
                console.log("Logistics unit list", logisticsUnitList.length);
                var planningUnitTransaction = db1.transaction(['planningUnit'], 'readwrite');
                var planningUnitOs = planningUnitTransaction.objectStore('planningUnit');
                var planningUnitList = []
                var planningUnitRequest = planningUnitOs.getAll();
                planningUnitRequest.onsuccess = function (event) {
                  var planningUnitResult = [];
                  planningUnitResult = planningUnitRequest.result;
                  var nothingSelectedJson = {
                    name: "",
                    id: 0
                  }
                  planningUnitList[planningUnitListLength] = nothingSelectedJson;
                  for (var k = 0; k < planningUnitResult.length; k++) {
                    if (planningUnitResult[k].productId == this.state.productId) {
                      planningUnitListLength++;
                      var planningUnitJson = {
                        name: planningUnitResult[k].label.labelEn,
                        id: planningUnitResult[k].planningUnitId
                      }
                      planningUnitList[planningUnitListLength] = planningUnitJson
                    }
                  }

                  var options = {
                    data: consumptionDataArr,
                    colHeaders: [
                      `${START_DATE}`,
                      `${STOP_DATE}`,
                      `${REGION}`,
                      `${DAYS_OF_STOCK_OUT}`,
                      `${DATA_SOURCE}`,
                      `${LOGISTICS_UNIT}`,
                      `${PLANNING_UNIT}`,
                      `${PACK_SIZE}`,
                      `${QUANTITY_OF_PLANNING_UNIT}`,
                      `${QUANTITY_OF_FORECAST_UNIT_FOR_LU}`,
                      `${QUANTITY_OF_FORECAST_UNIT_FOR_PU}`,
                      `${QUANTITY}`,
                      `${QUANTITY_IN_TERMS_OF_FORECAST_UNIT}`
                    ],
                    colWidths: [80, 80, 120, 100, 80, 200, 200, 80, 80, 80, 80, 80, 80],
                    columns: [
                      { type: 'calendar', options: { format: 'DD/MM/YYYY' } },
                      { type: 'calendar', options: { format: 'DD/MM/YYYY' } },
                      { type: 'dropdown', source: regList },
                      { type: 'numeric' },
                      { type: 'dropdown', source: dataSourceList },
                      { type: 'dropdown', source: logisticsUnitList },
                      { type: 'dropdown', source: planningUnitList },
                      { type: 'numeric' },
                      { type: 'hidden' },
                      { type: 'hidden' },
                      { type: 'hidden' },
                      { type: 'numeric' },
                      { type: 'numeric', readOnly: true },
                    ],
                    pagination: 10,
                    search: true,
                    columnSorting: true,
                    tableOverflow: true,
                    wordWrap: true,
                    paginationOptions: [25, 50, 75, 100],
                    allowInsertColumn: false,
                    allowManualInsertColumn: false,
                    onchange: this.changed,
                    allowDeleteRow:false
                  };
                  // this.setState({ 
                  // el: jexcel(ReactDOM.findDOMNode(this).children[0].children[0].children[0].children[1].children[3], options)
                  // })
                  this.el = jexcel(ReactDOM.findDOMNode(this).children[0].children[0].children[0].children[1].children[3], options);


                }.bind(this)
              }.bind(this)
            }.bind(this)
          }.bind(this)
        }.bind(this)
      }.bind(this);
    }
  }

  changed = function (instance, cell, x, y, value) {
    $("#saveButtonDiv").show();
    this.setState({
      changedFlag: 1
    })
    if (x == 0) {
      var col = ("A").concat(parseInt(y) + 1);
      console.log(col);
      if (value == "") {
        console.log("in if")
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "This field is required");
      } else {
        console.log("in else")
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setComments(col, "");
      }
    }

    if (x == 1) {
      var col = ("B").concat(parseInt(y) + 1);
      if (value == "") {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "This field is required");
      } else {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setComments(col, "");
      }

      if (value != "" && Date.parse(this.el.getValueFromCoords(0, y)) > Date.parse(value)) {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "Stop date must be greater than start date");
      } else {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setComments(col, "");
      }
    }

    if (x == 3) {
      var col = ("D").concat(parseInt(y) + 1);
      if (value >= 0) {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setComments(col, "");
      } else {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "Please enter numeric data");
      }
    }
    if (x == 11) {
      var col = ("L").concat(parseInt(y) + 1);
      if (value > 0 && value != "") {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setComments(col, "");
      } else {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "Please enter numeric data greater than 0");
      }
    }
    var logisticsUnitData = {}
    var planningUnitData = {}
    var elInstance = this.el;
    if (x == 11 && elInstance.getValueFromCoords(5, y) > 0) {
      var qtyInTermsOfForecastUnit = parseFloat(elInstance.getValueFromCoords(8, y) * elInstance.getValueFromCoords(9, y) * elInstance.getValueFromCoords(11, y));
      elInstance.setValueFromCoords(12, y, qtyInTermsOfForecastUnit, true)
    }
    if (x == 11 && elInstance.getValueFromCoords(6, y) > 0) {
      var qtyInTermsOfForecastUnit = parseFloat(elInstance.getValueFromCoords(7, y) * elInstance.getValueFromCoords(10, y) * elInstance.getValueFromCoords(11, y));
      elInstance.setValueFromCoords(12, y, qtyInTermsOfForecastUnit, true)
    }
    if (x == 7 && value > 0) {
      elInstance.setValueFromCoords(5, y, "", true)
      if (elInstance.getValueFromCoords(6, y) > 0 && elInstance.getValueFromCoords(11, y) > 0) {
        var qtyInTermsOfForecastUnit = parseFloat(elInstance.getValueFromCoords(7, y) * elInstance.getValueFromCoords(10, y) * elInstance.getValueFromCoords(11, y));
        elInstance.setValueFromCoords(12, y, qtyInTermsOfForecastUnit, true)
      }
    }

    if (x == 5 && value != "" && value != 0) {
      var col = ("F").concat(parseInt(y) + 1);
      this.el.setStyle(col, "background-color", "transparent");
      this.el.setComments(col, "");
      var col = ("G").concat(parseInt(y) + 1);
      this.el.setStyle(col, "background-color", "transparent");
      this.el.setComments(col, "");
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
        var luTransaction = db1.transaction(['logisticsUnit'], 'readwrite');
        var luObjectStore = luTransaction.objectStore('logisticsUnit');
        var luRequest = luObjectStore.get(parseInt(value));
        luRequest.onsuccess = function (e) {
          logisticsUnitData = luRequest.result;
          elInstance.setValueFromCoords(6, y, "", true)
          elInstance.setValueFromCoords(7, y, "", true)
          elInstance.setValueFromCoords(8, y, logisticsUnitData.qtyOfPlanningUnits, true)
          elInstance.setValueFromCoords(9, y, logisticsUnitData.planningUnit.qtyOfForecastingUnits, true)
          if (elInstance.getValueFromCoords(11, y) > 0) {
            var qtyInTermsOfForecastUnit = parseFloat(logisticsUnitData.qtyOfPlanningUnits * logisticsUnitData.planningUnit.qtyOfForecastingUnits * elInstance.getValueFromCoords(11, y));
            elInstance.setValueFromCoords(12, y, qtyInTermsOfForecastUnit, true)
          }
        }
      }

    } else if (x == 5 && elInstance.getValueFromCoords(6, y) == "") {
      var col = ("F").concat(parseInt(y) + 1);
      this.el.setStyle(col, "background-color", "transparent");
      this.el.setStyle(col, "background-color", "yellow");
      this.el.setComments(col, "Please enter either LU or PU");
    }
    if (x == 6 && value != "" && value != 0) {
      var col = ("G").concat(parseInt(y) + 1);
      this.el.setStyle(col, "background-color", "transparent");
      this.el.setComments(col, "");
      var col = ("F").concat(parseInt(y) + 1);
      this.el.setStyle(col, "background-color", "transparent");
      this.el.setComments(col, "");
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
        var puTransaction = db1.transaction(['planningUnit'], 'readwrite');
        var puObjectStore = puTransaction.objectStore('planningUnit');
        var puRequest = puObjectStore.get(parseInt(value));
        puRequest.onsuccess = function (e) {
          planningUnitData = puRequest.result;
          elInstance.setValueFromCoords(5, y, "", true)
          elInstance.setValueFromCoords(10, y, planningUnitData.qtyOfForecastingUnits, true)
          if (elInstance.getValueFromCoords(11, y) > 0) {
            var qtyInTermsOfForecastUnit = parseFloat(planningUnitData.qtyOfForecastingUnits * elInstance.getValueFromCoords(7, y) * elInstance.getValueFromCoords(11, y));
            elInstance.setValueFromCoords(12, y, qtyInTermsOfForecastUnit, true)
          }
        }
      }
    } else if (x == 6 && elInstance.getValueFromCoords(5, y) == "") {
      var col = ("G").concat(parseInt(y) + 1);
      this.el.setStyle(col, "background-color", "transparent");
      this.el.setStyle(col, "background-color", "yellow");
      this.el.setComments(col, "Please enter either LU or PU");
    }

    if (x == 7) {
      var col = ("H").concat(parseInt(y) + 1);
      if (value > 0 && value != "" && elInstance.getValueFromCoords(5, y) == "") {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setComments(col, "");
      } else if (elInstance.getValueFromCoords(5, y) == "") {
        this.el.setStyle(col, "background-color", "transparent");
        this.el.setStyle(col, "background-color", "yellow");
        this.el.setComments(col, "Please enter numeric data greater than 0");
      }
    }

  }.bind(this)

}