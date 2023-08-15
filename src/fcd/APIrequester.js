import Axios from "axios";

export class APIrequester {

    constructor (baseURL) {
        this.axios = Axios.create({
            baseURL,
            headers: {Accept: 'application/json'},
            timeout: 50000      // valeur en ms (soit 5 secondes, ici)
        })
    }
    
    async get (endpoint, params) {
        return await this.axios.get(endpoint, {params}).then(res => res.data);
    }

}