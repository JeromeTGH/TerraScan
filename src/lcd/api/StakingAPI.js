
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

    // Exemple d'appel : /cosmos/staking/v1beta1/delegations/terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd
    async getDelegations(accountAdr, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getDelegations + accountAdr, params);
    }

}