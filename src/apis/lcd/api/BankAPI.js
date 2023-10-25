
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
    async getOraclePoolBalance(params = new URLSearchParams()) {
        const oraclePoolAddress = 'terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f';
        return await this.apiRequester.get(this.paths.getOraclePoolBalance.replace('***', oraclePoolAddress), params);
    }

    // Exemple d'appel : /cosmos/bank/v1beta1/balances/terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd
    async getAccountDetails(accountAdr, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getAccountDetails.replace('***', accountAdr), params);
    }

}