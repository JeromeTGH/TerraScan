
export class GovAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }


    // Exemple d'appel : https://terra-classic-lcd.publicnode.com/cosmos/gov/v1beta1/params/deposit
    async getDepositParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getDepositParameters, params);
    }

    // Exemple d'appel : https://terra-classic-lcd.publicnode.com/cosmos/gov/v1beta1/proposals/******id*******/deposits
    async getDeposits(proposalId, params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getDeposits.replace('***', proposalId), params);
    }

    // Exemple d'appel : https://terra-classic-lcd.publicnode.com/cosmos/gov/**version**/proposals/**prop_id**
    async getProposal(proposalId, params = new URLSearchParams()) {
        const version = parseInt(proposalId) > 12113 ? "v1" : "v1beta1";
        let path = this.paths.getProposal;

        path = path.replace('___version___', version)
        path = path.replace('___prop_id___', proposalId);

        return this.apiRequester.get(path, params);
    }

    // Exemple d'appel : https://terra-classic-lcd.publicnode.com/cosmos/gov/v1/proposals
    async getProposals(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getProposals, params);
    }
    

    // Exemple d'appel : https://terra-classic-lcd.publicnode.com/cosmos/gov/v1beta1/proposals/******id*******/tally
    async getTally(proposalId, params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getTally.replace('***', proposalId), params);
    }
    

    // Exemple d'appel : https://terra-classic-lcd.publicnode.com/cosmos/gov/v1beta1/params/tallying
    async getTallyParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getTallyParameters, params);
    }

        
    // Exemple d'appel : https://terra-classic-lcd.publicnode.com/cosmos/gov/v1beta1/params/voting
    async getVotingParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getVotingParameters, params);
    }

}