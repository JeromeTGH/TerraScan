import Axios from "axios";

export class APIrequester {

    constructor (baseURL) {
        this.axios = Axios.create({
            baseURL,
            headers: {Accept: 'application/json'},
            timeout: 90000      // valeur en ms (soit 90 secondes de timeout, ici)
        })
    }
    
    get (endpoint, params) {
        return this.axios.get(endpoint, {params});
    }


}