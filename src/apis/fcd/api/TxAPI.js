
export class TxAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : /v1/txs?offset=0&limit=100&account=terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu
    async getAccountTxs(params) {
        params.append('limit', 100);
        return this.apiRequester.get(this.paths.getAccountTxs, params);
    }

    // Exemple d'appel : /v1/tx/A9304C05AEAB077F4BA977734757B2D861FF43E8D6A1E96DB2E32C8A29D14D1C
    async getTxInfos(txHash, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getTxInfos + txHash, params);
    }

}