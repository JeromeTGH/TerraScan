
export class GovAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }


    // Exemple d'appel : /cosmos/gov/v1beta1/params/deposit
    async getDepositParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getDepositParameters, params);
    }

    // Exemple d'appel : /cosmos/gov/v1beta1/proposals/******id*******/deposits
    async getDeposits(proposalId, params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getDeposits.replace('***', proposalId), params);
    }

    // Exemple d'appel : /cosmos/gov/v1beta1/proposals/******id*******
    async getProposal(proposalId, params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getProposal.replace('***', proposalId), params);
    }


    // Exemple d'appel : /cosmos/gov/v1beta1/proposals
    async getProposals(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getProposals, params);
    }
    

    // Exemple d'appel : /cosmos/gov/v1beta1/proposals/******id*******/tally
    async getTally(proposalId, params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getTally.replace('***', proposalId), params);
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