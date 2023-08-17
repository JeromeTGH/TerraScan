import { Tx } from "./Tx";

export class BlockInfo {

    constructor (objetAvecVariables) {

        this.chainId = objetAvecVariables.chainId;
        this.height = objetAvecVariables.height;
        this.timestamp = objetAvecVariables.timestamp;
        this.proposer = {
            moniker: objetAvecVariables.proposer.moniker,
            identity: objetAvecVariables.proposer.identity,
            operatorAddress: objetAvecVariables.proposer.operatorAddress
        }
        this.txs = [];
        for (const tx of objetAvecVariables.txs) {
            this.txs.push(Tx.extractFromTxs(tx));
        } 
    }


    static extractFromTendermintBlockInfo (rawApiData) {
        return new BlockInfo(rawApiData.data);
    }

}