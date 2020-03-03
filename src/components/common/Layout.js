import React from 'react'
import { Switch, Route } from 'react-router-dom'
import IdleTimer from 'react-idle-timer';
import WelcomeComponent from "../home/WelcomeComponent";
// import { IdleTimeOutModal } from './IdleModal.js';
import PropTypes from 'prop-types';
import '../../css/bootstrap/bootstrap.min.css';
import '../../css/theme-default.css';
import '../../css/custom.css';
import '../../Js/plugins/datatables/jquery.dataTables.min.js';


import '../../css/mcustomscrollbar/jquery.mCustomScrollbar.css';
//import  action from '../../Js/actions.js'
import '../../App.css'
import AddUserComponent from "../user/AddUserComponent.jsx";
import UserListComponent from "../user/UserListComponent.jsx";
import EditUserComponent from "../user/EditUserComponent.jsx";
import ChangePasswordComponent from "../home/ChangePasswordComponent.jsx";
import LoginComponent from "../home/LoginComponent.jsx";
import RoleListComponent from "../user/RoleListComponent.jsx";
import AddRoleComponent from "../user/AddRoleComponent.jsx";
import EditRoleComponent from "../user/EditRoleComponent.jsx";
import AuthenticationService from '../common/AuthenticationService.js';
import AddLanguageComponent from '../language/AddLanguageComponent'
import LanguageListComponent from "../language/LanguageListComponent.jsx"
import EditLanguageComponent from "../language/EditLanguageComponent.jsx"
import AddDataSourceTypeComponent from "../datasourceType/AddDataSourceTypeComponent.jsx"
import DataSourceTypeListComponent from "../datasourceType/DataSourceTypeListComponent.jsx"
import UpdateDataSourceTypeComponent from "../datasourceType/UpdateDataSourceTypeComponent.jsx"
import AddDataSource from "../dataSource/AddDataSource.jsx"
import DataSourceListComponent from "../dataSource/DataSourceListComponent.jsx"
import UpdateDataSourceComponent from "../dataSource/UpdateDataSourceComponent.jsx"
import AddCurrencyComponent from "../currency/AddCurrencyComponent.jsx"
import CurrencyListComponent from "../currency/CurrencyListComponent.jsx"
import UpdateCurrencyComponent from "../currency/UpdateCurrencyComponent.jsx"
import AddCountryComponent from "../country/AddCountryComponent.jsx"
import CountryListComponent from "../country/CountryListComponent.jsx"
import UpdateCountryComponent from "../country/UpdateCountryComponent.jsx"
import AddShipmentStatusComponent from "../shipmentStatus/AddShipmentStatusComponent.jsx"
import ShipmentStatusListComponent from "../shipmentStatus/ShipmentStatusListComponent.jsx"
import UpdateShipmentStatusComponent from "../shipmentStatus/UpdateShipmentStatusComponent.jsx"
import DownloadProgramDataComponent from '../program/DownloadProgramDataComponent';
import ImportProgramDataComponent from '../program/ImportProgramDataComponent';
import ExportProgramDataComponent from '../program/ExportProgramDataComponent';
import SyncMasterDataComponent from '../masterSync/SyncMasterDataComponent';
import AddRegionComponent from '../region/AddRegionComponent';
import EditRegionComponent from '../region/EditRegionComponent';
import RegionListComponent from '../region/RegionListComponent';
import UpdateLabelsComponent from '../label/UpdateLabelsComponent.jsx';
import LabelListComponent from '../label/LabelListComponent.jsx';
import AddUnitTypeComponent from '../unitType/AddUnitTypeComponent.jsx';
import UnitTypeListComponent from '../unitType/UnitTypeListComponent.jsx';
import UpdateUnitTypeComponent from '../unitType/UpdateUnityTypeComponent.jsx';
import ConsumptionDetailsComponent from '../consumption/ConsumptionDetailsComponent';

import AddUnitComponent from '../Unit/AddUnitComponent.jsx';
import UnitListComponent from '../Unit/UnitListComponent.jsx';
import UpdateUnitComponent from '../Unit/UpdateUnitComponent.jsx'
import AddRealmComponent from '../realm/AddRealmComponent.jsx';
import RealmListComponent from '../realm/RealmListComponent.jsx'
import UpdateRealmComponent from '../realm/UpdateRealmComponent.jsx'
import AddManufacturerComponent from '../manufacturer/AddManufacturerComponent';
import ManufacturerListComponent from '../manufacturer/ManufacturerListComponent';
import UpdateManufacturerComponent from '../manufacturer/UpdateManufacturerComponent';
import TicketListComponent from '../ticketing/TicketListComponent';
import UpdateTicketComponent from '../ticketing/UpdateTicketComponent';

import AddHealthAreaComponent from '../healthArea/AddHealthAreaComponent.jsx';
import HealthAreaListComponent from '../healthArea/HealthAreaListComponent.jsx';
import EditHealthAreaComponent from '../healthArea/EditHealthAreaComponent.jsx';
import AddOrganisationComponent from '../organisation/AddOrganisationComponent.jsx';
import OrganisationListComponent from '../organisation/OrganisationListComponent.jsx';
import EditOrganisationComponent from '../organisation/EditOrganisationComponent.jsx';
import AddFundingSourceComponent from '../fundingSource/AddFundingSourceComponent.jsx';
import FundingSourceListComponent from '../fundingSource/FundingSourceListComponent.jsx';
import UpdateFundingSourceComponent from '../fundingSource/UpdateFundingSourceComponent.jsx';



class Layout extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            timeout: AuthenticationService.checkSessionTimeOut(),
            showModal: false,
            userLoggedIn: false,
            isTimedOut: false
        }

        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    _onAction(e) {
      console.log('user did something', e)
      this.setState({isTimedOut: false})
    }
   
    _onActive(e) {
      console.log('user is active', e)
      this.setState({isTimedOut: false})
    }
   
    _onIdle(e) {
      console.log('user is idle', e)
      const isTimedOut = this.state.isTimedOut
      if (isTimedOut) {
          this.props.history.push('/')
      } else {
        this.setState({showModal: true})
        this.idleTimer.reset();
        this.setState({isTimedOut: true})
      }
      
    }

    handleClose() {
      this.setState({showModal: false})
    }

    handleLogout() {
      this.setState({showModal: false})
      this.props.history.push('/')
    }

    render(){
      const { match } = this.props
      return(
        <>
          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout} />

            <div className="">
               
            {/* {AuthenticationService.setupAxiosInterceptors()} */}
                <Switch>

                {/* <Route path="/" exact component={LoginComponent} /> */}
                <Route path="/login/:message" exact component={LoginComponent} />
                    <Route 
                        exact path={`${match.path}welcome`}
                        render={(props) => <WelcomeComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}welcome/:message`}
                        render={(props) => <WelcomeComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addUser`}
                        render={(props) => <AddUserComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}userList`}
                        render={(props) => <UserListComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}userList/:message`}
                        render={(props) => <UserListComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}editUser`}
                        render={(props) => <EditUserComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}changePassword`}
                        render={(props) => <ChangePasswordComponent {...props} /> }/>
                    />
                    
                    <Route 
                        exact path={`${match.path}addRole`}
                        render={(props) => <AddRoleComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}roleList`}
                        render={(props) => <RoleListComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}roleList/:message`}
                        render={(props) => <RoleListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editRole`}
                        render={(props) => <EditRoleComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addLanguage`}
                        render={(props) => <AddLanguageComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editLanguage`}
                        render={(props) => <EditLanguageComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}languageList/:message`}
                        render={(props) => <LanguageListComponent {...props} /> }/>
                    />
                    
                    <Route 
                        exact path={`${match.path}addDataSourceType`}
                        render={(props) => <AddDataSourceTypeComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editDataSourceType`}
                        render={(props) => <UpdateDataSourceTypeComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}dataSourceTypeList/:message`}
                        render={(props) => <DataSourceTypeListComponent {...props} /> }/>
                    />


                    <Route 
                        exact path={`${match.path}addDataSource`}
                        render={(props) => <AddDataSource {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editDataSource`}
                        render={(props) => <UpdateDataSourceComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}dataSourceList/:message`}
                        render={(props) => <DataSourceListComponent {...props} /> }/>
                    />


                    <Route 
                        exact path={`${match.path}addCurrency`}
                        render={(props) => <AddCurrencyComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editCurrency`}
                        render={(props) => <UpdateCurrencyComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}currencyList/:message`}
                        render={(props) => <CurrencyListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}downloadProgramData/`}
                        render={(props) => <DownloadProgramDataComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}importProgramData/`}
                        render={(props) => <ImportProgramDataComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}exportProgramData/`}
                        render={(props) => <ExportProgramDataComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}syncMasterData/`}
                        render={(props) => <SyncMasterDataComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}consumptionDetails/`}
                        render={(props) => <ConsumptionDetailsComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}addCountry`}
                        render={(props) => <AddCountryComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}countryList/:message`}
                        render={(props) => <CountryListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editCountry`}
                        render={(props) => <UpdateCountryComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addShipmentStatus`}
                        render={(props) => <AddShipmentStatusComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}shipmentStatusListAll/:message`}
                        render={(props) => <ShipmentStatusListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editShipmentStatus`}
                        render={(props) => <UpdateShipmentStatusComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addRegion`}
                        render={(props) => <AddRegionComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}regionList`}
                        render={(props) => <RegionListComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}regionList/:message`}
                        render={(props) => <RegionListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editRegion`}
                        render={(props) => <EditRegionComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addHealthArea`}
                        render={(props) => <AddHealthAreaComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}healthAreaList`}
                        render={(props) => <HealthAreaListComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}healthAreaList/:message`}
                        render={(props) => <HealthAreaListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editHealthArea`}
                        render={(props) => <EditHealthAreaComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}addOrganisation`}
                        render={(props) => <AddOrganisationComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}organisationList`}
                        render={(props) => <OrganisationListComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}organisationList/:message`}
                        render={(props) => <OrganisationListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editOrganisation`}
                        render={(props) => <EditOrganisationComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}editLabels`}
                        render={(props) => <UpdateLabelsComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}labelList/:message`}
                        render={(props) => <LabelListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addUnitType`}
                        render={(props) => <AddUnitTypeComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}unitTypeList/:message`}
                        render={(props) => <UnitTypeListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editUnitType`}
                        render={(props) => <UpdateUnitTypeComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addUnit`}
                        render={(props) => <AddUnitComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}unitList/:message`}
                        render={(props) => <UnitListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editUnit`}
                        render={(props) => <UpdateUnitComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addRealm`}
                        render={(props) => <AddRealmComponent {...props} /> }/>
                    />

                    <Route 
                        exact path={`${match.path}realmList/:message`}
                        render={(props) => <RealmListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editRealm`}
                        render={(props) => <UpdateRealmComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addManuFacturer`}
                        render={(props) => <AddManufacturerComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}manufacturerList/:message`}
                        render={(props) => <ManufacturerListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editManufacturer`}
                        render={(props) => <UpdateManufacturerComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}ticketList/:message`}
                        render={(props) => <TicketListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editTicket`}
                        render={(props) => <UpdateTicketComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}addFundingSource`}
                        render={(props) => <AddFundingSourceComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}fundingSourceList/:message`}
                        render={(props) => <FundingSourceListComponent {...props} /> }/>
                    />
                    <Route 
                        exact path={`${match.path}editFundingSource`}
                        render={(props) => <UpdateFundingSourceComponent {...props} /> }/>
                    />
                    
                </Switch>
                
              {/*  <IdleTimeOutModal 
                    showModal={this.state.showModal} 
                    handleClose={this.handleClose}
                    handleLogout={this.handleLogout}
                />*/}
            </div>
        </>
      )
   }

 }

 Layout.propTypes = {
     match: PropTypes.any.isRequired,
     history: PropTypes.func.isRequired
 }

export default Layout