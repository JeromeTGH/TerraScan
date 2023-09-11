import { tblBlocks } from "../../application/AppData";
import { tblCorrespondanceValeurs } from "../../application/AppParams";
import { FCDclient } from "../../fcd/FCDclient";


export const getBlockInfos = async (blockNum) => {


    // Interroge le FCD, seulement si ce bloc n'a pas déjà été téléchargé en mémoire, précédemment
    if(!tblBlocks[blockNum.toString()] || !tblBlocks[blockNum.toString()].txs) {

        // Récupération du singleton de la classe FCDclient
        const fcd = FCDclient.getSingleton();

        // Récupération des infos concernant le block recherché
        const rawBlockInfos = await fcd.tendermint.getBlockInfos(blockNum).catch(handleError);
        if(rawBlockInfos?.data) {
            // console.log("rawBlockInfo.data", rawBlockInfos.data);

            // Récupération des transactions de ce block
            const tblTxs = [];
            for(const transaction of rawBlockInfos.data.txs) {
                const txHash = transaction.txhash;
                const txCode = transaction.code ? transaction.code : 0;     // = 0 si tout s'est bien passé
                const txDatetime = transaction.timestamp;
                const messages = transaction.tx.value.msg;      // Liste de tous les messages que contient cette transaction
                
                let msgType = '';
                let msgAmount = '';
                let msgUnit = '';
                if(messages.length === 0)
                    msgType = 'Nothing';
                else if(messages.length === 1) {
                    msgType = messages[0].type.split('/')[1];
                    if(messages[0].value?.amount) {
                        if(Array.isArray(messages[0].value.amount)) {
                            if(messages[0].value.amount.length === 1) {
                                msgAmount = (messages[0].value.amount[0].amount/1000000).toFixed(6);
                                msgUnit = tblCorrespondanceValeurs[messages[0].value.amount[0].denom] ? tblCorrespondanceValeurs[messages[0].value.amount[0].denom] : messages[0].value.amount[0].denom;
                            }
                        } else {
                            if(messages[0].value.amount?.amount && messages[0].value.amount?.denom) {
                                msgAmount = (messages[0].value.amount.amount/1000000).toFixed(6);
                                msgUnit = tblCorrespondanceValeurs[messages[0].value.amount.denom] ? tblCorrespondanceValeurs[messages[0].value.amount.denom] : messages[0].value.amount.denom;
                            }
                        }
                    }
                } else 
                    msgType = 'Multiple (' + messages.length + '\u00a0messages)';

                // Création d'un objet représentant la synthèse de cette transaction
                const objTx = {
                    datetime: txDatetime,
                    msgType: msgType,
                    errorCode: txCode,
                    amount: msgAmount,
                    unit: msgUnit,
                    txHash: txHash
                }
                tblTxs.push(objTx);
            }


            // Création d'un objet représentant la synthèse de cette transaction
            tblBlocks[rawBlockInfos.data.height.toString()] = {
                'nb_tx': rawBlockInfos.data.txs.length,
                'validator_moniker': rawBlockInfos.data.proposer.moniker,
                'validator_address': rawBlockInfos.data.proposer.operatorAddress,
                'datetime': rawBlockInfos.data.timestamp,
                'txs': tblTxs
            }
            
        } else
            return { "erreur": "Failed to fetch block number #" + blockNum + " ..." }
    }

    
    // Renvoi du "block height" recherché, pour signifier qu'il n'y a pas eu d'erreur
    return blockNum;

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}