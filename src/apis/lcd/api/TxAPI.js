
export class TxAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : /cosmos/tx/v1beta1/txs?events=message.action%3D%27%2Fcosmos.gov.v1beta1.MsgSubmitProposal%27&events=submit_proposal.proposal_id%3D11695
    async searchTxsByEvent(params) {
        return this.apiRequester.get(this.paths.searchTxsByEvent, params);
    }


}