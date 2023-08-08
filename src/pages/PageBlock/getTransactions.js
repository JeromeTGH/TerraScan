import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient, hashToHex } from '@terra-money/terra.js';
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
            ])
        })
    } else
        return { "erreur": "Failed to fetch [block infos] ..." }
    

    // Récupération des infos sur une transaction donnée ****** TEST
    // const rawTxInfo = await lcd.tx.txInfo("43AC51F14195A8C0167AAAFE911FDBC78D27FDC4294D602B5ADF986BF0E80AFF").catch(handleError);    
    // if(rawTxInfo) {
    //     console.log("rawTxInfo", rawTxInfo);
    // } else
    //     return { "erreur": "Failed to fetch [transaction infos] ..." }


    for(let i=0 ; i<transactionsInfos.length ; i++) {
        const rawTxInfo = await lcd.tx.txInfo(transactionsInfos[i][0]).catch(handleError);
        if(rawTxInfo) {
            transactionsInfos[i][1] = rawTxInfo.code;
            const nbMessages = rawTxInfo.tx.body.messages.length;
            transactionsInfos[i][2] = nbMessages;
            if(nbMessages === 0)
                transactionsInfos[i][3] = 'Error';
            else if(nbMessages === 1) {
                const msgType = rawTxInfo.tx.body.messages[0].constructor.name;
                transactionsInfos[i][3] = msgType;
                if(msgType === 'MsgSend') {
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].from_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].to_address;
                } else if(msgType === 'MsgDelegate') {
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].delegator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].validator_address;
                } else if(msgType === 'MsgUndelegate') {
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].validator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].delegator_address;
                } else if(msgType === 'MsgBeginRedelegate') {
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].delegator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].validator_dst_address; // from "validator_src_address", en fait
                } else if(msgType === 'MsgVote') {
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].voter;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].proposal_id.toString();
                } else if(msgType === 'MsgWithdrawDelegatorReward') {
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].validator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].delegator_address;
                }
            }
            else
                transactionsInfos[i][3] = 'Multiple (' + nbMessages + ' messages)';
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