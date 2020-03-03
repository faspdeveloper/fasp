import React,{Component} from 'react'
import TicketServcie from '../../api/TicketService.js'
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';

export default class TicketListComponent extends Component{

    constructor(props){
    super(props);
    this.state={
        ticketList:[]
    }
    this.editTicket=this.editTicket.bind(this);
}

componentDidMount(){
    AuthenticationService.setupAxiosInterceptors();
    TicketServcie.getTicketListAll().then(response => {   
        //console.log(response.data.data);     
        this.setState({
            ticketList: response.data.data
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
editTicket(ticket) {

    console.log(ticket);
    this.props.history.push({
        pathname: "/editTicket",
        state: { ticket: ticket }
    });

}

render(){
return(
<>
<p>{this.props.match.params.message}</p>
            <div>
                {/* <button type="button" style={{ marginLeft: '-999px' }} ></button><br /><br /> */}
            </div>

            <div className="ticketList">

                <h1>{myConst.TICKET_LIST}</h1>
                <table border="1" align="center">
                    <thead>
                        <tr>
                            <th>{myConst.TICKET_TYPE_NAME_EN}</th>
                            <th>{myConst.TICKET_NOTE}</th>
                            <th>{myConst.TICKET_STATUS_EN}</th>
                            {/* <th>{myConst.CREATED_DATE}</th>
                            <th>{myConst.LAST_MODIFIED_DATE}</th> */}
                           
                            

                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.ticketList.map(ticket =>

                                <tr key={ticket.ticketId} onClick={() => this.editTicket(ticket)}>
                                    <td>{ticket.ticketType.label.label_en}</td>
                                    <td>{ticket.note}</td>
                                    <td>{ticket.ticketStatus.label.label_en}</td>
                                    {/* <td>{ticket.createdDate}</td>
                                    <td>{ticket.lastModifiedDate}</td>
                                   */}
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