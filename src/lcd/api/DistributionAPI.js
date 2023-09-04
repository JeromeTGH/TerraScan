
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

    // Exemple d'appel : /cosmos/distribution/v1beta1/delegators/terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd/rewards
    async getDistributionRewards(accountAdr, params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getDistributionRewards.replace('***', accountAdr), params);
    }


}