import React,{Component} from 'react';
import * as myConst from '../../Labels.js';
import AuthenticationService from '../common/AuthenticationService.js';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import DataSourceTypeService from '../../api/DataSourceTypeService.js'

export default class AddDataSourceTypeComponent extends Component{

    constructor(props){
        super(props);
        this.state={
            label_en:''
         }

         this.updateFieldData=this.updateFieldData.bind(this);
         this.submitForm=this.submitForm.bind(this);
         this.Capitalize=this.Capitalize.bind(this);

    }

    componentDidMount(){
        AuthenticationService.setupAxiosInterceptors();
        $("#dataSourceTypeForm").validate({
            ignore: [],
            rules: {
                'label_en': {
                    required: true,
                    lettersonlywhitespace: true,
                    maxlength: 255
                },
                // 'freLabel': {
                   
                //     lettersonly: true,
                //     maxlength: 255
                // },
                // 'spaLabel': {
                    
                //     lettersonly: true,
                //     maxlength: 255
                // },
                // 'porLabel': {
                    
                //     lettersonly: true,
                //     maxlength: 255
                // }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        });


    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    updateFieldData(event){
       //console.log(event.target.name); 
        this.setState(
           {
                [event.target.name]: event.target.value      
            }
        )

    }

    submitForm(){
        if (navigator.onLine) {
            if ($("#dataSourceTypeForm").valid()) {
                console.log(this.state);
                DataSourceTypeService.addDataSourceType(this.state).then(response => {
                    this.props.history.push(`/dataSourceTypeList/${response.data.message}`)
                    console.log("success");
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

render(){
        return(
         <>
        <h3>{myConst.ADD_DATASOURCE_TYPE}</h3>
                <form name="dataSourceTypeForm" id="dataSourceTypeForm">
                    <div>
                        <label>{myConst.DATASOURCE_TYPE_NAME_EN}:-</label>
                        <input type="text" name="label_en" value={this.Capitalize(this.state.label_en)} onChange={this.updateFieldData} />
                    </div>
                    <br/><br/>
                    {/* <div>
                        <label>{myConst.DATASOURCE_TYPE_NAME_FR}:-</label>
                        <input type="text" name="freLabel"  onChange={this.updateFieldData} />
                    </div>
                    <br/><br/>
                    <div>
                        <label>{myConst.DATASOURCE_TYPE_NAME_SP}:-</label>
                        <input type="text" name="spaLabel"  onChange={this.updateFieldData} />
                    </div>
                    <br/><br/>
                    <div>
                        <label>{myConst.DATASOURCE_TYPE_NAME_PO}:-</label>
                        <input type="text" name="porLabel"  onChange={this.updateFieldData} />
                    </div>
                    <br/><br/> */}
                    <div>
                        <button type="button" onClick={this.submitForm}>{myConst.SUBMIT_BUTTON}</button>
                    </div>
                </form>
        </>);
    }
}