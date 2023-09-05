
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

}