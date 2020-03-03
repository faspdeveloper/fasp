import React, { Component } from "react";
import CryptoJS from 'crypto-js'
import { SECRET_KEY } from '../../Constants.js'
import bcrypt from 'bcryptjs';

class WelcomeComponent extends Component {

    constructor(props) {
        super(props);
       {/* this.listUserApproval=this.listUserApproval.bind(this);*/}
    }
    componentDidMount(){
        console.log("user cur ---"+localStorage.getItem("curUser"));
        console.log("cur user decrypted---",CryptoJS.AES.decrypt(localStorage.getItem('curUser').toString(), `${SECRET_KEY}`).toString(CryptoJS.enc.Utf8));
    }

    render() {
        return (
           /* <div className="page-content-wrap">
                <div className="col-md-12">
                <h1>Welcome!!</h1>
                <p>{this.props.match.params.message}</p>
                </div>
               
            </div>*/
            <div className="page-content-wrap">
                <ul className="breadcrumb">
                   
                </ul>
            <div className="row">
                <div className="col-md-12">
                    <div className="panel panel-default Box-shadow">
                        <div className="panel-heading">
                            <h3 className="panel-title">Welcome</h3>
                        </div>
                        <div className="panel-body">
                            <p>{this.props.match.params.message}</p>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
        );
    }

   /*{ listUserApproval() {
        this.props.history.push(`/listUserApproval`)
    }*/
}

export default WelcomeComponent