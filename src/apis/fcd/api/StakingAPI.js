
export class StakingAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : https://terra-classic-fcd.publicnode.com/v1/staking/validators/terravaloper120ppepaj2lh5vreadx42wnjjznh55vvktp78wk
    async getValidatorInfos(valoperAdr, params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getValidatorInfos + valoperAdr, params);
    }

    // Exemple d'appel : https://terra-classic-fcd.publicnode.com/v1/staking/validators
    async getValidatorsListv1(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getValidatorsListv1, params);
    }

    // Exemple d'appel : https://terra-classic-fcd.publicnode.com/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=9999
    async getValidatorsListv1beta1(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getValidatorsListv1beta1, params);
    }
    

}