
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

    // Exemple d'appel : /cosmos/bank/v1beta1/balances/terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f (adresse le l'Oracle Pool)
    async getOraclePoolBalance(accountAddress, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getOraclePoolBalance + accountAddress, params);
    }

}