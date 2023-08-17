
export class TendermintAPI {

    // Constructeur
    constructor (apiRqt) {
        this.apiRequester = apiRqt;
    }

    // Exemple d'appel : /node_info
    async askForNodeInfo(params = new URLSearchParams()) {
        return await this.apiRequester.get('node_info', params);
    }

    // Exemple d'appel : /v1/blocks/latest    ou    /v1/blocks/14133283 (pour avoir les infos du block 14133283, par ex)
    async askForBlockInfo(blockNum = 'latest', params = new URLSearchParams()) {
        return this.apiRequester.get('/v1/blocks/' + blockNum, params);
    }

}