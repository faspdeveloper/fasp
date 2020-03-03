
import React,{Component} from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import * as myConst from '../../Labels.js';
import RealmService from '../../api/RealmService'
import AuthenticationService from '../common/AuthenticationService.js';

export default class ReactListComponent extends Component{


constructor(props){
super (props);
this.state={
    realmList:[]
}
this.addNewRealm=this.addNewRealm.bind(this);
this.editRealm=this.editRealm.bind(this);
}
componentDidMount(){
    AuthenticationService.setupAxiosInterceptors();
    RealmService.getRealmListAll().then(response => {        
        this.setState({
            realmList: response.data.data
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
editRealm(realm) {
    this.props.history.push({
        pathname: "/editRealm",
        state: { realm: realm }
    });

}

addNewRealm(){
    if (navigator.onLine) {
        this.props.history.push(`/addRealm`)
    } else {
        alert("You must be Online.")
    }

}
render(){
return(
<>
<p>{this.props.match.params.message}</p>
            <div>
                <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewRealm}>{myConst.ADD_NEW_REALM}</button><br /><br />
            </div>

            <div className="realmList">

                <h1>{myConst.REAL_LIST}</h1>
                <table border="1" align="center">
                    <thead>
                        <tr>
                            <th>{myConst.REALM_CODE}</th>
                            <th>{myConst.REALM_NAME_EN}</th>
                            <th>{myConst.REALM_NAME_FR}</th>
                            <th>{myConst.REALM_NAME_SP}</th>
                            <th>{myConst.REALM_NAME_PO}</th>
                            <th>{myConst.REALM_PAST_MONTHS_AMC}</th>
                            <th>{myConst.REALM_FUTURE_MONTHS_AMC}</th>
                            <th>{myConst.REALM_ORDER_FREQUENCY}</th>
                            <th>{myConst.REALM_DEFAULT}</th>
                            

                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.realmList.map(realm =>

                                <tr key={realm.realmId} onClick={() => this.editRealm(realm)}>
                                    <td>{realm.realmCode}</td>
                                    <td>{realm.label.label_en}</td>
                                    <td>{realm.label.label_fr}</td>
                                    <td>{realm.label.label_sp}</td>
                                    <td>{realm.label.label_pr}</td>
                                    <td>{realm.monthInPastForAmc}</td>
                                    <td>{realm.monthInFutureForAmc}</td>
                                    <td>{realm.orderFrequency}</td>
                                    <td>{realm.defaultRealm.toString() == "true" ? "Active" : "Disabled"}</td>
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

