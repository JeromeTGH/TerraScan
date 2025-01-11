
export class TendermintAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : https://terra-classic-fcd.publicnode.com/node_info
    async getNodeInfos(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getNodeInfos, params);
    }

    // Exemple d'appel : https://terra-classic-fcd.publicnode.com/v1/blocks/latest    ou    https://terra-classic-fcd.publicnode.com/v1/blocks/14133283 (pour avoir les infos du block 14133283, par ex)
    async getBlockInfos(blockNum = 'latest', params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getBlockInfos + blockNum, params);
    }

}