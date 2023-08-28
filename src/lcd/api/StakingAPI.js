
export class StakingAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : /cosmos/staking/v1beta1/pool
    async getStakingPool(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getStakingPool, params);
    }

    // Exemple d'appel : /cosmos/staking/v1beta1/params
    async getStakingParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getStakingParameters, params);
    }

}