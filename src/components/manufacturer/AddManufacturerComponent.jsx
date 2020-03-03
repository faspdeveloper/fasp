import React,{Component} from 'react';
import * as myConst from '../../Labels.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import AuthenticationService from '../common/AuthenticationService.js';
import RealmService from '../../api/RealmService'
import ManufacturerService from '../../api/ManufacturerService'

export default class AddManufacturerComponent extends Component{

constructor(props){
super(props);
this.state={
    manufacturer:{
        label:{
        label_en:'',
        },
        realm:{
            realmId:''
        }
    },
    realmList: []  
}
this.updateFieldData=this.updateFieldData.bind(this);
this.submitForm=this.submitForm.bind(this);

}
componentDidMount() {
    AuthenticationService.setupAxiosInterceptors();
    RealmService.getRealmListAll().then(response => {
        //console.log(response.data)
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
    $("#manufacturerForm").validate({
        ignore: [],
        rules: {
            'manufacturer.label.label_en': {
                required: true,
                lettersonlywhitespace: true,
                maxlength: 255
            },
           
            'manufacturer.realm.realmId': {
                required: true
            }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        }
    });

}

updateFieldData(event) {
    if (event.target.name === "manufacturer.label.label_en") {
        //console.log("inside if")
        this.state.manufacturer.label.label_en = event.target.value
    }
    else if (event.target.name === "manufacturer.realm.realmId") {
        this.state.manufacturer.realm.realmId = event.target.value
    }

    let { manufacturer } = this.state
    this.setState(
        {
            manufacturer
        }
    )


}
Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

submitForm() {

    if (navigator.onLine) {
        if ($("#manufacturerForm").valid()) {
            console.log(this.state);
            //delete this.state["dataSourceTypeList"];
            ManufacturerService.addManufacturer(this.state.manufacturer).then(response => {
                this.props.history.push(`/manufacturerList/${response.data.message}`)
                console.log("--------",response);
                //console.log("success");
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
    } else {
        alert("To perform this action you must be online.");

    }

}


render() {
    const { realmList } = this.state;
    let realmTypes = realmList.length > 0
        && realmList.map((item, i) => {
            return (
                <option key={i} value={item.realmId}>{item.label.label_en}</option>
            )
        }, this);
    return (
        <>
            <div><h5>{this.state.message}</h5></div>
            <h3>{myConst.ADD_MANUFACTURER}</h3>
            <form name="manufacturerForm" id="manufacturerForm">
                <div>
                    <label>{myConst.MANUFACTURER_NAME_EN}:-</label>
                    <input type="text" name="manufacturer.label.label_en" value={this.Capitalize(this.state.manufacturer.label.label_en)} onChange={this.updateFieldData} />
                </div>
                <br /><br />

                <div>
                    {myConst.SELECT_REALM} : <select id="realmId" name="manufacturer.realm.realmId" onChange={this.updateFieldData}>
                        <option value="">-Nothing Selected-</option>
                        {/* <option value="1">RealmOne</option>
                        <option value="2">RealmTwo</option> */}
                        {realmTypes}
                    </select>
                </div>
                <br></br>
                <div>
                    <button type="button" onClick={this.submitForm}>{myConst.SUBMIT_BUTTON}</button>
                </div>
            </form>
        </>
    );

}





}