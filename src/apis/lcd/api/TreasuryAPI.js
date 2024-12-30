
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

    // Exemple d'appel : /terra/treasury/v1beta1/burn_tax_exemption_list
    async getBurnTaxExemptionList(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getBurnTaxExemptionList, params);
    }

}