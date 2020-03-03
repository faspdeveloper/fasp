import axios from "axios";
import { API_URL } from '../Constants.js';

class HealthAreaService {

    addHealthArea(json) {
        console.log(json);
        return axios.post(`${API_URL}/api/healthArea/`, json, {}
        );
    }

    getHealthAreaList() {
        return axios.get(`${API_URL}/api/healthArea/`, {
        });
    }
    editHealthArea(json) {
        return axios.put(`${API_URL}/api/healthArea/`, json, {}
        );
    }

}
export default new HealthAreaService();