import Axios from "axios";

export class APIrequester {

    constructor (baseURL) {
        this.axios = Axios.create({
            baseURL,
            headers: {Accept: 'application/json'},
            timeout: 50000      // valeur en ms (soit 5 secondes, ici)
        })
    }
    
    get (endpoint, params) {
        return this.axios.get(endpoint, {params});
    }


}