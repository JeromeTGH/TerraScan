
export class BankAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : /cosmos/bank/v1beta1/supply?pagination.limit=9999
    async getTotalSupplies(params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getTotalSupplies, params);
    }

}