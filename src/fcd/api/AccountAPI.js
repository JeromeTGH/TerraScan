
export class AccountAPI {

    constructor (apiRqt) {
        this.apiRequester = apiRqt;
    }

    async txs(params) {
        params.append('limit', 100);
        return this.apiRequester.get('/v1/txs', params);        //.then(res => [res]);      // Mise en forme réponse dans classe
    }


}