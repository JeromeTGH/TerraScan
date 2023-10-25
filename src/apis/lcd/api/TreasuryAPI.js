
export class TreasuryAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }


    // Exemple d'appel : /terra/treasury/v1beta1/params
    async getTreasuryParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getTreasuryParameters, params);
    }

}