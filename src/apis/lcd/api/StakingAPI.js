
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
        return await this.apiRequester.get(this.paths.getDelegations.replace('***', accountAdr), params);
    }

    // Exemple d'appel : /cosmos/staking/v1beta1/validators/terravaloper120ppepaj2lh5vreadx42wnjjznh55vvktp78wk/delegations
    async getValidatorDelegators(valoperAdr, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getValidatorDelegators.replace('***', valoperAdr), params);
    }

    // Exemple d'appel : /cosmos/staking/v1beta1/delegators/terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd/unbonding_delegations
    async getUndelegations(accountAdr, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getUndelegations.replace('***', accountAdr), params);
    }

    // Exemple d'appel : /cosmos/staking/v1beta1/delegators/terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd/redelegations
    async getRedelegations(accountAdr, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getRedelegations.replace('***', accountAdr), params);
    }

    // Exemple d'appel : /cosmos/staking/v1beta1/validators/terravaloper120ppepaj2lh5vreadx42wnjjznh55vvktp78wk
    async getValidatorInfos(valoperAdr, params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getValidatorInfos + valoperAdr, params);
    }

    // Exemple d'appel : /cosmos/staking/v1beta1/validators?pagination.limit=9999
    async getValidatorsList(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getValidatorsList + "?pagination.limit=9999", params);
    }
    
}