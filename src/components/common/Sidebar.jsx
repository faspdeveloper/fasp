import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../../Js/plugins/jquery/jquery.min.js'
import '../../Js/plugins.js';
import '../../Js/plugins/bootstrap/bootstrap-select';
import '../../Js/actions';

import im from '../../img/noimage.jpg';
//import '../../Js/plugins/jquery/jquery.jexcel.min.js';


import ErrorComponent from "../common/ErrorComponent";
import LoginComponent from "../home/LoginComponent.jsx";
import Layout from './Layout.js';

import { Online } from "react-detect-offline";





import UpdateExpiredPasswordComponent from "../home/UpdateExpiredPasswordComponent.jsx";
import ForgotPasswordComponent from "../home/ForgotPasswordComponent.jsx";
import ResetPasswordComponent from "../home/ResetPasswordComponent.jsx";

class Sidebar extends Component {


    render() {
        return (
            <div className="Sidebar">


                {/* MESSAGE BOX*/}
                <div className="message-box animated fadeIn" data-sound="alert" id="mb-signout">
                    <div className="mb-container">
                        <div className="mb-middle">
                            <div className="mb-title"><span className="fa fa-sign-out"></span> Log <strong>Out</strong> ?</div>
                            <div className="mb-content">
                                <p>Are you sure you want to log out?</p>
                                <p>Press No if youwant to continue work. Press Yes to logout current user.</p>
                            </div>
                            <div className="mb-footer">
                                <div className="pull-right">
                                    <a href="/" className="btn btn-success btn-lg">Yes</a>
                                    <button className="btn btn-default btn-lg mb-control-close">No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Router> */}

                <Router basename="/fasp">


                    <>
                        <Switch>
                            <Route path="/updateExpiredPassword" exact component={UpdateExpiredPasswordComponent} />
                            <Route path="/forgotPassword" exact component={ForgotPasswordComponent} />
                            <Route path="/" exact component={LoginComponent} />
                            <Route path="/login/:message" component={LoginComponent} />
                            <Route path="/resetPassword/:username/:token" exact component={ResetPasswordComponent} />
                            {/* START PAGE CONTAINER */}
                            <div className="page-container page-navigation-toggled page-container-wide">

                                {/* START PAGE SIDEBAR */}
                                <div className="page-sidebar">
                                    {/* START X-NAVIGATION */}
                                    <ul className="x-navigation x-navigation-minimized">
                                        <li className="xn-logo">
                                            <a href="index.html">FASP</a>
                                            <a href="#" className="x-navigation-control"></a>

                                        </li>


                                        <li><a href="#"><span className=""></span> </a></li>


                                        <li className="active">
                                            {<a href="welcome"><span className="fa fa-list-alt"></span> <span className="xn-text">Home</span></a>}
                                            {/* <ul>

                 <li className="">
                     <a href="consumption.html"><span className=""></span> Consumption</a>

                 </li>

                 <li><a href="pages-messages.html"><span className=""></span> Shipments</a></li>
                 <li><a href="pages-calendar.html"><span className=""></span> Stocks</a></li>

             </ul> */}
                                        </li>

                                        {/*  <li className="xn-openable">
             <a href="#"><span className="fa fa-table"></span> <span className="xn-text">Commodities Data</span></a>
             <ul>

                 <li className="">
                     <a href="#"><span className=""></span> Consumption</a>

                 </li>

                 <li><a href="#"><span className=""></span> Shipments</a></li>
                 <li><a href="#"><span className=""></span> Stocks</a></li>

             </ul>
            </li>*/}

                                        <li className="xn-openable">
                                            <a href=""><span className="fa fa-table"></span> <span className="xn-text">Program data</span></a>
                                            <ul>

                                                <li className="">
                                                    <a href="../downloadProgramData"><span className=""></span> Download</a>

                                                </li>

                                                <li><a href="../exportProgramData"><span className=""></span> Export</a></li>
                                                <li><a href="../importProgramData"><span className=""></span> Import</a></li>
                                                <li><a href="../syncMasterData"><span className=""></span> Sync Master data</a></li>
                                                <li><a href="../consumptionDetails"><span className=""></span>Consumption details</a></li>

                                            </ul>
                                        </li>


                                        {/* <li className="xn-openable">
                                            <a href="#"><span className="fa fa-file"></span> <span className="xn-text">Admin</span></a>
                                            <ul className="sidebarUl">

                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> User</a>
                                                    <ul>
                                                        <li><a href="../addUser"><span className=""></span> Add User</a></li>
                                                        <li><a href="../listUser"><span className=""></span>User List</a></li>
                                                    </ul>
                                                </li>

                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Role</a>
                                                    <ul>
                                                        <li><a href="../addRole"><span className=""></span> Add Role</a></li>
                                                        <li><a href="../listRole"><span className=""></span>Role List</a></li>
                                                    </ul>
                                                </li>

                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Language</a>
                                                    <ul>
                                                        <li><a href="../addLanguage"><span className=""></span> Add Language</a></li>
                                                        <li><a href="../languageList/success"><span className=""></span>Language List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Country</a>
                                                    <ul>
                                                        <li><a href="../addCountry"><span className=""></span> Add Country</a></li>
                                                        <li><a href="../countryList/success"><span className=""></span>Country List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Currency</a>
                                                    <ul>
                                                        <li><a href="../addCurrency"><span className=""></span> Add Currency</a></li>
                                                        <li><a href="../currencyList/success"><span className=""></span>Currency List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> DataSource</a>
                                                    <ul>
                                                        <li><a href="../addDataSource"><span className=""></span> Add DataSource</a></li>
                                                        <li><a href="../dataSourceList/success"><span className=""></span>DataSource List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> DataSource Type</a>
                                                    <ul>
                                                        <li><a href="../addDataSourceType"><span className=""></span> Add DataSource Type</a></li>
                                                        <li><a href="../dataSourceTypeList/success"><span className=""></span>DataSource Type List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Shipment Status</a>
                                                    <ul>
                                                        <li><a href="../addShipmentStatus"><span className=""></span> Add Shipment Status</a></li>
                                                        <li><a href="../shipmentStatusListAll/success"><span className=""></span>Shipment Status List</a></li>
                                                    </ul>
                                                </li>

                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Region</a>
                                                    <ul>
                                                        <li><a href="../addRegion"><span className=""></span> Add Region</a></li>
                                                        <li><a href="../regionList/:message"><span className=""></span>Region List</a></li>
                                                    </ul>
                                                </li>

                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Labels</a>
                                                    <ul>
                                                    <li><a href="../labelList/success"><span className=""></span>Labels List</a></li>
                                                        {/* <li><a href="../addLabels"><span className=""></span> Add Labels</a></li> */}
                                        {/* </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Unit Type</a>
                                                    <ul>
                                                    
                                                        <li><a href="../addUnitType"><span className=""></span> Add Unit Type</a></li> 
                                                        <li><a href="../unitTypeList/success"><span className=""></span>Unit type List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Unit </a>
                                                    <ul>
                                                    
                                                        <li><a href="../addUnit"><span className=""></span> Add Unit </a></li> 
                                                        <li><a href="../unitList/success"><span className=""></span>Unit List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Realm </a>
                                                    <ul>
                                                    
                                                        <li><a href="../addRealm"><span className=""></span> Add Realm </a></li> 
                                                        <li><a href="../realmList/success"><span className=""></span>Realm List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Manufacturer </a>
                                                    <ul>
                                                    
                                                        <li><a href="../addManufacturer"><span className=""></span> Add Manufacturer  </a></li> 
                                                        <li><a href="../manufacturerList/success"><span className=""></span>Manufacturer List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Ticketing </a>
                                                    <ul>
                                                    
                                                        {/* <li><a href="../addManufacturer"><span className=""></span> Add Manufacturer  </a></li>  */}
                                        {/* <li><a href="../ticketList/success"><span className=""></span>Ticket List</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>   */}

                                        <Online>
                                            <li className="xn-openable">
                                                <a href="#"><span className="fa fa-file"></span> <span className="xn-text">Admin</span></a>
                                                <ul className="sidebarUl">

                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> User</a>
                                                        <ul>
                                                            <li><a href="../addUser"><span className=""></span> Add User</a></li>
                                                            <li><a href="../userList"><span className=""></span>User List</a></li>
                                                        </ul>
                                                    </li>

                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Role</a>
                                                        <ul>
                                                            <li><a href="../addRole"><span className=""></span> Add Role</a></li>
                                                            <li><a href="../roleList"><span className=""></span>Role List</a></li>
                                                        </ul>
                                                    </li>

                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Language</a>
                                                        <ul>
                                                            <li><a href="../addLanguage"><span className=""></span> Add Language</a></li>
                                                            <li><a href="../languageList/success"><span className=""></span>Language List</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Country</a>
                                                        <ul>
                                                            <li><a href="../addCountry"><span className=""></span> Add Country</a></li>
                                                            <li><a href="../countryList/success"><span className=""></span>Country List</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Currency</a>
                                                        <ul>
                                                            <li><a href="../addCurrency"><span className=""></span> Add Currency</a></li>
                                                            <li><a href="../currencyList/success"><span className=""></span>Currency List</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> DataSource</a>
                                                        <ul>
                                                            <li><a href="../addDataSource"><span className=""></span> Add DataSource</a></li>
                                                            <li><a href="../dataSourceList/success"><span className=""></span>DataSource List</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> DataSource Type</a>
                                                        <ul>
                                                            <li><a href="../addDataSourceType"><span className=""></span> Add DataSource Type</a></li>
                                                            <li><a href="../dataSourceTypeList/success"><span className=""></span>DataSource Type List</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Shipment Status</a>
                                                        <ul>
                                                            <li><a href="../addShipmentStatus"><span className=""></span> Add Shipment Status</a></li>
                                                            <li><a href="../shipmentStatusListAll/success"><span className=""></span>Shipment Status List</a></li>
                                                        </ul>
                                                    </li>

                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Region</a>
                                                        <ul>
                                                            <li><a href="../addRegion"><span className=""></span> Add Region</a></li>
                                                            <li><a href="../regionList/"><span className=""></span>Region List</a></li>
                                                        </ul>
                                                    </li>

                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Health Area</a>
                                                        <ul>
                                                            <li><a href="../addHealthArea"><span className=""></span> Add Health Area</a></li>
                                                            <li><a href="../healthAreaList/"><span className=""></span>Health Area List</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Organisation</a>
                                                        <ul>
                                                            <li><a href="../addOrganisation"><span className=""></span> Add Organisation</a></li>
                                                            <li><a href="../organisationList/"><span className=""></span>Organisation List</a></li>
                                                        </ul>
                                                    </li>

                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Labels</a>
                                                        <ul>
                                                            <li><a href="../labelList/success"><span className=""></span>Labels List</a></li>
                                                            {/* <li><a href="../addLabels"><span className=""></span> Add Labels</a></li> */}
                                                        </ul>
                                                    </li>
                                                    <li className="xn-openable">
                                                        <a href="#"><span className="fa fa-clock-o"></span> Unit Type</a>
                                                        <ul>

                                                            <li><a href="../addUnitType"><span className=""></span> Add Unit Type</a></li>
                                                            <li><a href="../unitTypeList/success"><span className=""></span>Unit type List</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Unit </a>
                                                    <ul>
                                                    
                                                        <li><a href="../addUnit"><span className=""></span> Add Unit </a></li> 
                                                        <li><a href="../unitList/success"><span className=""></span>Unit List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Realm </a>
                                                    <ul>
                                                    
                                                        <li><a href="../addRealm"><span className=""></span> Add Realm </a></li> 
                                                        <li><a href="../realmList/success"><span className=""></span>Realm List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Manufacturer </a>
                                                    <ul>
                                                    
                                                        <li><a href="../addManufacturer"><span className=""></span> Add Manufacturer  </a></li> 
                                                        <li><a href="../manufacturerList/success"><span className=""></span>Manufacturer List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Ticketing </a>
                                                    <ul>
                                                    
                                                        {/* <li><a href="../addManufacturer"><span className=""></span> Add Manufacturer  </a></li>  */}
                                                        <li><a href="../ticketList/success"><span className=""></span>Ticket List</a></li>
                                                    </ul>
                                                </li>
                                                <li className="xn-openable">
                                                    <a href="#"><span className="fa fa-clock-o"></span> Funding Source </a>
                                                    <ul>
                                                    
                                                        <li><a href="../addFundingSource"><span className=""></span> Add FundingSource  </a></li> 
                                                        <li><a href="../fundingSourceList/success"><span className=""></span>Funding Source List</a></li>
                                                    </ul>
                                                </li>
                                        
                                                </ul>
                                            </li>
                                        </Online>


                                        {/*   <li className="xn-openable">
             <a href="#"><span className="fa fa-file"></span> <span className="xn-text">Background Data</span></a>
             <ul>

                 <li className="xn-openable">
                     <a href="#"><span className="fa fa-clock-o"></span> Products</a>
                     <ul>
                         <li><a href=""><span className=""></span> Case Sizes</a></li>
                         <li><a href=""><span className=""></span>Costs</a></li>
                     </ul>
                 </li>
                 <li className="xn-openable">
                     <a href="#"><span className="fa fa-clock-o"></span> Categories</a>
                     <ul>
                         <li><a href=""><span className=""></span> View Categories</a></li>

                     </ul>
                 </li>

                 <li><a href=""><span className=""></span> Suppliers</a></li>
                 <li><a href=""><span className=""></span> Data Sources</a></li>
                 <li><a href=""><span className=""></span> Funding Sources</a></li>
             </ul>
         </li>

         <li className="xn-openable">
             <a href="#"><span className="fa fa-bar-chart-o"></span> <span className="xn-text">Graphs    </span></a>
             <ul>

                 <li className="">
                     <a href="#"><span className=""></span> Stock Status</a>

                 </li>

                 <li><a href="#"><span className=""></span> Consumption</a></li>
                 <li><a href="#"><span className=""></span> Trend Analysis</a></li>

                 <li><a href="#"><span className=""></span> Couple Year Protection(CYP)</a></li>
             </ul>
         </li>

         <li className="xn-openable">
             <a href="#"><span className="fa fa-files-o"></span> <span className="xn-text">Reports    </span></a>
             <ul>

                 <li className="">
                     <a href="#"><span className=""></span> Stock Status</a>

                 </li>

                 <li><a href="#"><span className=""></span> Stock Status Matrix</a></li>
                 <li><a href="#"><span className=""></span> Shipment Summary</a></li>

                 <li><a href="#"><span className=""></span> Supply Plans</a></li>

                 <li><a href="#"><span className=""></span> Shipment Orders</a></li>

                 <li><a href="#"><span className=""></span> Annual Shipment Costs</a></li>
                 <li><a href="#"><span className=""></span> Pipeline Action</a></li>
                 <li><a href="#"><span className=""></span> Pipeline Problem</a></li>
                 <li><a href="#"><span className=""></span> Procurement</a></li>
             </ul>
         </li>*/}
                                    </ul>
                                    {/* END X-NAVIGATION */}
                                </div>
                                {/* END PAGE SIDEBAR */}

                                {/* PAGE CONTENT */}

                                <div className="page-content">
                                    {/* START X-NAVIGATION VERTICAL */}
                                    <ul className="x-navigation x-navigation-horizontal x-navigation-panel">
                                        {/* TOGGLE NAVIGATION */}
                                        <li className="xn-icon-button">
                                            <a href="#" className="x-navigation-minimize"><span className="fa fa-dedent"></span></a>
                                        </li>
                                        {/* END TOGGLE NAVIGATION */}
                                        {/* SEARCH */}
                                        {/* <li className="xn-search">
                 <form role="form">
                     <input type="text" name="search" placeholder="Search..."/>
                 </form>
             </li> */}
                                        {/* END SEARCH */}
                                        {/* SIGN OUT */}
                                        <li className="xn-icon-button pull-right">
                                            <a href="" className="mb-control" data-box="#mb-signout"><span className="fa fa-sign-out"></span></a>
                                        </li>
                                        {/* END SIGN OUT */}
                                        {/* MESSAGES */}
                                        <li className="xn-icon-button pull-right">
                                            <a href="#"><span className="fa fa-user"></span>

                                            </a>

                                            <div className="panel panel-primary animated zoomIn xn-drop-left xn-panel-dragging user-panel" >
                                                <div className="panel-heading">
                                                    <div className="profile">
                                                        <div className="profile-image">
                                                            <img className="profile-img" src={im} alt="John Doe" >
                                                            </img></div>
                                                        <div className="profile-data">
                                                            <div className="profile-data-name">XYZ</div>
                                                            <div className="profile-data-title">Admin User</div>
                                                            <div className="profile-data-title"><span>Online</span></div>
                                                            <div className="profile-data-title"><span>  <span className="online"></span></span>
                                                            </div>




                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </li>
                                        <Online>
                                            <li class="xn-icon-button pull-right">
                                                <a href="../changePassword" title="Change Password"><span class="fa fa-key"></span> <span class="xn-text"></span></a>
                                            </li>
                                        </Online>
                                        <li className="xn-icon-button pull-right Langli">
                                            <a href="#" className="lang-align" ><span className=""> Languages</span> <span className="fa fa-caret-down lang-caret"
                                            ></span></a>
                                            {/*    <div className="informer informer-warning">3</div> */}
                                            <div className="panel panel-primary animated zoomIn xn-drop-left xn-panel-dragging lang-width">
                                                {/*  <div className="panel-heading">
                         <h3 className="panel-title"><span className="fa fa-tasks"></span> Program Name</h3>                                
                         <div className="pull-right">
                             <span className="label label-warning">3 active</span>
                         </div>
                     </div> */}
                                                <div className="panel-body list-group scroll lang-box">
                                                    <a className="list-group-item" href="#">
                                                        <strong>Français | FRA</strong>
                                                        {/*     <div className="progress progress-small progress-striped active">
                                 <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">50%</div>
                             </div>
                             <small className="text-muted">John Doe, 25 Sep 2014 / 50%</small> */}
                                                    </a>
                                                    <a className="list-group-item" href="#">
                                                        <strong>Português | PRT</strong>
                                                        {/*      <div className="progress progress-small progress-striped active">
                                 <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%;">80%</div>
                             </div>
                             <small className="text-muted">Dmitry Ivaniuk, 24 Sep 2014 / 80%</small> */}
                                                    </a>
                                                    <a className="list-group-item" href="#">
                                                        <strong>Español | ESP</strong>

                                                    </a>
                                                    <a className="list-group-item" href="#">
                                                        <strong>STiếng Việt | VIE</strong>

                                                    </a>
                                                </div>

                                            </div>
                                        </li>


                                        {/* END TASKS */}
                                    </ul>
                                    {/* END X-NAVIGATION VERTICAL */}

                                    {/* START BREADCRUMB */}

                                    {/* END BREADCRUMB */}

                                    {/* PAGE CONTENT WRAPPER */}


                                    <Route path='/' render={(props) => <Layout {...props} />} />
                                    {/* <Route path="/login/:message" component={LoginComponent} /> */}
                                    {/* <Route path="/addUser" component={AddUserComponent} /> */}
                                    {/* <Route path="/userList" exact component={UserListComponent} /> */}
                                    {/* <Route path="/userList/:message" component={UserListComponent} /> */}
                                    {/* <Route path="/editUser" component={EditUserComponent} /> */}
                                    {/* <Route path="/addRole" component={AddRoleComponent} /> */}
                                    {/* <Route path="/roleList" component={RoleListComponent} /> */}
                                    {/* <Route path="/roleList/:message" component={RoleListComponent} /> */}
                                    {/* <Route path="/editRole" component={RoleListComponent} /> */}
                                    {/* <AuthenticatedRoute path="/updateExpiredPassword" component={UpdateExpiredPasswordComponent} /> */}
                                    {/* <AuthenticatedRoute path="/welcome" component={WelcomeComponent} /> */}
                                    {/* <AuthenticatedRoute path="/registration" component={RegistrationComponent} /> */}
                                    {/* <AuthenticatedRoute path="/listUserApproval/:message" component={UserApprovalComponent} /> */}
                                    {/* <AuthenticatedRoute path="/listUserApproval" component={UserApprovalComponent} /> */}
                                    {/* <AuthenticatedRoute path="/editUserApproval/:registrationId/:emailId" component={EditUserApprovalComponent} /> */}
                                    {/* <Route component={ErrorComponent} /> */}


                                    {/* END PAGE CONTENT WRAPPER */}
                                </div>
                                {/* END PAGE CONTENT */}
                            </div>
                            {/* END PAGE CONTAINER */}

                        </Switch>
                    </>
                </Router>
            </div>
        );
    }

}

export default Sidebar;