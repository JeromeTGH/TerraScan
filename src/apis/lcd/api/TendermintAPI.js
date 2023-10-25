
export class TendermintAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : /cosmos/base/tendermint/v1beta1/node_info
    async getNodeInfos(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getNodeInfos, params);
    }

    // Exemple d'appel : /cosmos/base/tendermint/v1beta1/blocks/latest    ou    /cosmos/base/tendermint/v1beta1/blocks/14133283 (pour avoir les infos du block 14133283, par ex)
    async getBlockInfos(blockNum = 'latest', params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getBlockInfos.replace('***', blockNum), params);
    }

}