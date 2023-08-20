
export class BankAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : /v1/bank/terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd
    async getAccountDetails(accountAdr, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getAccountDetails + accountAdr, params);
    }

    // Exemple d'appel : /v1/txs?offset=0&limit=100&account=terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu
    async getAccountTxs(params) {
        params.append('limit', 100);
        return this.apiRequester.get(this.paths.getAccountTxs, params);
    }

}