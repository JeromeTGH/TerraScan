import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient, MsgBeginRedelegate, MsgDelegate, MsgSend, MsgUndelegate, MsgVote, MsgWithdrawDelegatorReward, hashToHex } from '@terra-money/terra.js';
import { isValidTerraAddressFormat } from '../../application/AppUtils';


export const getTransactions = async (blockNumber) => {
    
    const transactionsInfos = [];
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération des infos concernant ce block
    const rawBlockInfos = await lcd.tendermint.blockInfo(blockNumber).catch(handleError);
    if(rawBlockInfos) {
        rawBlockInfos.block.data.txs.forEach(element => {
            transactionsInfos.push([
                hashToHex(element),
                -1,                     // Code erreur (0 si "ok")
                0,                      // Nb messages
                '',                     // Type de message : MsgSend, MsgVote, MsgDelegate, ...
                '--',                   // "From" (dans les cas où çà s'applique, dirons nous !)
                '--',                   // "To" (dans les cas où çà s'applique, dirons nous !)
                '',                     // Validator's moniker (if there is one, in Msg)
                ''                      // Date/Time de cette transaction
            ])
        })
    } else
        return { "erreur": "Failed to fetch [block infos] ..." }
    

    // Récupération des infos de chaque transaction de ce block
    for(let i=0 ; i<transactionsInfos.length ; i++) {
        const rawTxInfo = await lcd.tx.txInfo(transactionsInfos[i][0]).catch(handleError);
        if(rawTxInfo) {
            transactionsInfos[i][1] = rawTxInfo.code;
            const nbMessages = rawTxInfo.tx.body.messages.length;
            transactionsInfos[i][2] = nbMessages;
            if(nbMessages === 0)
                transactionsInfos[i][3] = 'Error';
            else if(nbMessages === 1) {
                if(rawTxInfo.tx.body.messages[0] instanceof MsgSend) {
                    transactionsInfos[i][3] = 'MsgSend';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].from_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].to_address;
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgDelegate) {
                    transactionsInfos[i][3] = 'MsgDelegate';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].delegator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].validator_address;
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgUndelegate) {
                    transactionsInfos[i][3] = 'MsgUndelegate';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].validator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].delegator_address;
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgBeginRedelegate) {
                    transactionsInfos[i][3] = 'MsgBeginRedelegate';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].delegator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].validator_dst_address; // from "validator_src_address", en fait
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgVote) {
                    transactionsInfos[i][3] = 'MsgVote';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].voter;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].proposal_id.toString();
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgWithdrawDelegatorReward) {
                    transactionsInfos[i][3] = 'MsgWithdrawDelegatorReward';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].validator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].delegator_address;
                } else {
                    transactionsInfos[i][3] = 'MsgNotCoded';
                }
            }
            else
                transactionsInfos[i][3] = 'Multiple (' + nbMessages + ' messages)';

            transactionsInfos[i][7] = rawTxInfo.timestamp;
        } else
            return { "erreur": "Failed to fetch [transaction infos] ..." } 
    }

    
    // Parcours de tous les "from", à la recherche des adresses de type "terravaloper1..." (car il s'agit de validateur, et donc, il faut récupérer leur "moniker" aussi)
    for(let i=0 ; i<transactionsInfos.length ; i++) {
        if(isValidTerraAddressFormat(transactionsInfos[i][4], 'terravaloper1')) {
            const rawValidators = await lcd.staking.validator(transactionsInfos[i][4]).catch(handleError);
            if(rawValidators)
                transactionsInfos[i][6] = rawValidators.description.moniker;
            else
                return { "erreur": "Failed to fetch [validators] ..." } 
        }
        if(isValidTerraAddressFormat(transactionsInfos[i][5], 'terravaloper1')) {
            const rawValidators = await lcd.staking.validator(transactionsInfos[i][5]).catch(handleError);
            if(rawValidators)
                transactionsInfos[i][6] = rawValidators.description.moniker;
            else
                return { "erreur": "Failed to fetch [validators] ..." } 
        }

    }


    // Envoi des infos en retour
    return transactionsInfos;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}