
export class DistributionAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }


    // Exemple d'appel : /cosmos/distribution/v1beta1/params
    async getDistributionParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getDistributionParameters, params);
    }

    // Exemple d'appel : /cosmos/distribution/v1beta1/community_pool
    async getDistributionCommunityPool(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getDistributionCommunityPool, params);
    }


}