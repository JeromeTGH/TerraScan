
export class AccountAPI {

    // Constructeur
    constructor (apiRqt) {
        this.apiRequester = apiRqt;
    }

    // Exemple d'appel : /bank/balances/terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd
    async askForBalance(accountAdr, params = new URLSearchParams()) {
        return await this.apiRequester.get('/bank/balances/' + accountAdr, params);
    }

    // Exemple d'appel : /v1/txs?offset=0&limit=100&account=terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu
    async txs(params) {
        params.append('limit', 100);
        return this.apiRequester.get('/v1/txs', params);
    }

}