import React,{Compoent, Component} from 'react';
// import UnitService from '../../api/UnitService';
import AuthenticationService from '../common/AuthenticationService.js';
import * as myConst from '../../Labels.js';
import UnitService from '../../api/UnitService';


export default class UnitListComponent extends Component{

constructor(props){
super(props);
this.state={
unitList:[]

}
this.editUnit=this.editUnit.bind(this);
this.addNewUnit=this.addNewUnit.bind(this);
}

componentDidMount() {
    AuthenticationService.setupAxiosInterceptors();
    UnitService.getUnitListAll().then(response => {   
        console.log(response.data);     
        this.setState({
            unitList: response.data.data
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

editUnit(unit) {
    this.props.history.push({
        pathname: "/editUnit",
        state: { unit: unit }
    });

}

addNewUnit(){

    if (navigator.onLine) {
        this.props.history.push(`/addUnit`)
    } else {
        alert("You must be Online.")
    }

}

render() {
    return (
        <>

            <p>{this.props.match.params.message}</p>
            <div>
                <button type="button" style={{ marginLeft: '-999px' }} onClick={this.addNewUnit}>{myConst.ADD_NEW_UNIT}</button><br /><br />
            </div>

            <div className="unitList">

                <h1>{myConst.UNIT_LIST}</h1>
                <table border="1" align="center">
                    <thead>
                        <tr>
                            <th>{myConst.UNIT_NAME_EN}</th>
                            <th>{myConst.UNIT_NAME_FR}</th>
                            <th>{myConst.UNIT_NAME_SP}</th>
                            <th>{myConst.UNIT_NAME_PO}</th>
                            <th>{myConst.UNIT_TYPE_NAME_EN}</th>
                            <th>{myConst.UNIT_CODE}</th>
                            <th>{myConst.DATASOURCE_ACTIVE}</th>
                            

                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.unitList.map(unit =>

                                <tr key={unit.unitId} onClick={() => this.editUnit(unit)}>
                                    <td>{unit.label.label_en}</td>
                                    <td>{unit.label.label_fr}</td>
                                    <td>{unit.label.label_sp}</td>
                                    <td>{unit.label.label_pr}</td>
                                    <td>{unit.unitType.label.label_en}</td>
                                    <td>{unit.unitCode}</td>
                                    <td>{unit.active.toString() == "true" ? "Active" : "Disabled"}</td>
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