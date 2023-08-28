
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





    // // Exemple d'appel : /v1/staking/validators/terravaloper120ppepaj2lh5vreadx42wnjjznh55vvktp78wk
    // async getValidatorInfos(valoperAdr, params = new URLSearchParams()) {
    //     return this.apiRequester.get(this.paths.getValidatorInfos + valoperAdr, params);
    // }

    // // Exemple d'appel : /v1/staking/validators
    // async getValidatorsList(params = new URLSearchParams()) {
    //     return this.apiRequester.get(this.paths.getValidatorsList, params);
    // }


}