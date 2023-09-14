
export class GovAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }


    // Exemple d'appel : /cosmos/gov/v1beta1/proposals/******id*******
    async getProposalInfos(proposalId, params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getProposalInfos.replace('***', proposalId), params);
    }


    // Exemple d'appel : /cosmos/gov/v1beta1/params/deposit
    async getDepositParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getDepositParameters, params);
    }


    // Exemple d'appel : /cosmos/gov/v1beta1/params/tallying
    async getTallyParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getTallyParameters, params);
    }

        
    // Exemple d'appel : /cosmos/gov/v1beta1/params/voting
    async getVotingParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getVotingParameters, params);
    }

}