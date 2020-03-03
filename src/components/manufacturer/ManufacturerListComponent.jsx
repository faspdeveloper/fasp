import React,{Compoent, Component} from 'react';
import ManufacturerService from '../../api/ManufacturerService';
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';


export default class ManufacturerListComponent extends Component{

constructor(props){
super(props);
this.state={
manufacturerList:[]

}
this.editManufacturer=this.editManufacturer.bind(this);
this.addNewManufacturer=this.addNewManufacturer.bind(this);
}

componentDidMount() {
    AuthenticationService.setupAxiosInterceptors();
    ManufacturerService.getManufacturerListAll().then(response => {  
        console.log(response);      
        this.setState({
            manufacturerList: response.data.data
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

editManufacturer(manufacturer) {
    this.props.history.push({
        pathname: "/editManufacturer",
        state: { manufacturer: manufacturer }
    });

}

addNewManufacturer(){

    if (navigator.onLine) {
        this.props.history.push(`/addManufacturer`)
    } else {
        alert("You must be Online.")
    }

}

render() {
    return (
        <>

            <p>{this.props.match.params.message}</p>
            <div>
                <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewManufacturer}>{myConst.ADD_MANUFACTURER}</button><br /><br />
            </div>

            <div className="manufacturerList">

                <h1>{myConst.MANUFACTURER_LIST}</h1>
                <table border="1" align="center">
                    <thead>
                        <tr>
                            <th>{myConst.MANUFACTURER_NAME_EN}</th>
                            <th>{myConst.MANUFACTURER_NAME_FR}</th>
                            <th>{myConst.MANUFACTURER_NAME_SP}</th>
                            <th>{myConst.MANUFACTURER_NAME_PO}</th>
                            <th>{myConst.REALM_NAME_EN}</th>
                            <th>{myConst.DATASOURCE_ACTIVE}</th>
                            

                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.manufacturerList.map(manufacturer =>

                                <tr key={manufacturer.manufacturerId} onClick={() => this.editManufacturer(manufacturer)}>
                                    <td>{manufacturer.label.label_en}</td>
                                    <td>{manufacturer.label.label_fr}</td>
                                    <td>{manufacturer.label.label_sp}</td>
                                    <td>{manufacturer.label.label_pr}</td>
                                    <td>{manufacturer.realm.label.label_en}</td>
                                    <td>{manufacturer.active.toString() == "true" ? "Active" : "Disabled"}</td>
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