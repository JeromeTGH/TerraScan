
export class StakingAPI {

    // Constructeur
    constructor (apiRqt) {
        this.apiRequester = apiRqt;
    }

    // Exemple d'appel : /staking/validators/terravaloper120ppepaj2lh5vreadx42wnjjznh55vvktp78wk
    async askForValidatorInfo(valoperAdr, params = new URLSearchParams()) {
        return this.apiRequester.get('/staking/validators/' + valoperAdr, params);
    }

    // Exemple d'appel : /staking/validators/
    async askForValidatorsList(params = new URLSearchParams()) {
        return this.apiRequester.get('/staking/validators', params);
    }


}