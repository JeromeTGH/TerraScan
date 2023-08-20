import Axios from "axios";

export class APIrequester {

    constructor (baseURL) {
        this.axios = Axios.create({
            baseURL,
            headers: {Accept: 'application/json'},
            timeout: 30000      // valeur en ms (soit 30 secondes de timeout, ici)
        })
    }
    
    get (endpoint, params) {
        return this.axios.get(endpoint, {params});
    }


}