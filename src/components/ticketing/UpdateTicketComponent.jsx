import React, { Component } from 'react'
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import TicketStatusService from '../../api/TicketStatusService'
import TicketTypeService from '../../api/TicketTypeService'
import TicketService from '../../api/TicketService'
export default class UpdateTicketComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            ticket: {
                ticketId: '',
                note: '',
                refferenceId: '',
                ticketStatus: {
                    ticketStatusId: '',
                    label: {
                        label_en: '',
                        labelId:''
                    }
                },
                ticketType: {
                    ticketTypeId: '',
                    label: {
                        label_en: '',
                        labelId:''

                    }
                }

            },
            ticketStatusList: [],
            ticketTypeList: []

        }
        this.Capitalize=this.Capitalize.bind(this);
        this.cancelClicked=this.cancelClicked.bind(this);
        this.updateFieldData=this.updateFieldData.bind(this);
        this.updateForm=this.updateForm.bind(this);
    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    cancelClicked() {
        this.props.history.push(`/ticketList/` + "Action Canceled") 
    }
    componentDidMount() {
        AuthenticationService.setupAxiosInterceptors();
        this.setState({
            ticket: this.props.location.state.ticket
        });
     

        TicketStatusService.getTicketStatusListAll().then(response => {
            //console.log(response);
            this.setState({
                ticketStatusList: response.data.data
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
          
        TicketTypeService.getTicketTypeListAll().then(response => {
            console.log(response);
            this.setState({
                ticketTypeList: response.data.data
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

            $("#updateTicketForm").validate({
                ignore: [],
                rules: {
                    'ticket.note': {
                        required: true
                        //lettersonlywhitespace: true,
                        //maxlength: 255
                    },
                    'ticket.ticketStatus.ticketStatusId':{
                        required:true
                    }
                
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element);
                }
            });
            
    }


    updateForm(){
        if (navigator.onLine) {

            if ($("#updateTicketForm").valid()) {

                TicketService.updateticket(this.state.ticket).then(response => {
                    console.log(response.data);
                    this.props.history.push(`/ticketList/${response.data.message}`)
                }
                )
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
                    )

            }
        }else{

            alert("To perform this action you must be online.");
        }


    }
    updateFieldData(event) {
        let { ticket } = this.state

        if (event.target.name === "ticket.note") {
           // console.log("inside if")
           this.state.ticket.note = event.target.value
        } 
         else if (event.target.name === "ticket.ticketStatus.ticketStatusId") {
            this.state.ticket.ticketStatus.ticketStatusId = event.target.value
        }


        this.setState(
            {
                ticket
            }
        )
    }
    render() {
        const { ticketStatusList } = this.state;
        let ticketStatusTypes = ticketStatusList.length > 0
            && ticketStatusList.map((item, i) => {
                return (
                    <option key={i} value={item.ticketStatusId}>{item.label.label_en}</option>
                )
            }, this);

        const { ticketTypeList } = this.state;
        let ticketTypeTypes = ticketTypeList.length > 0
            && ticketTypeList.map((item, i) => {
                return (
                    <option key={i} value={item.ticketTypeId}>{item.label.label_en}</option>
                )
            }, this);
        return (
            <>
                <div><h5>{this.state.message}</h5></div>
                <h3>{myConst.UPDATE_TICKET}</h3>
                <form name="updateTicketForm" id="updateTicketForm">
                    <div>
                        <label>{myConst.TICKET_NOTE}:-</label>
                        <textarea name="ticket.note" value={this.state.ticket.note} onChange={this.updateFieldData} />
                    </div>
                    <br /><br />
                    <div>
                        {myConst.SELECT_TICKET_STATUS} : <select id="ticketStatusId" name="ticket.ticketStatus.ticketStatusId" value={this.state.ticket.ticketStatus ? this.state.ticket.ticketStatus.ticketStatusId : ''} onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {ticketStatusTypes}
                        </select>
                    </div>
                    <br /><br />
                    {/* <div>
                        {myConst.SELECT_DATA_SOURCE_TYPE} : <select id="ticketTypeId" name="ticket.ticketType.ticketTypeId" value={this.state.ticket.ticketType ? this.state.ticket.ticketType.ticketTypeId : ''} onChange={this.updateFieldData}>
                            <option value="">-Nothing Selected-</option>
                            {ticketTypeTypes}
                        </select>
                    </div> */}
                    {/* <br /><br /> */}

                    <div>
                        <button type="button" onClick={this.updateForm}>{myConst.UPDATE_BUTTON}</button>
                        <button type="button" onClick={this.cancelClicked}>{myConst.BTN_CANCEL}</button><br></br><br></br>
                    </div>
                </form>
            </>


        );
    }


}