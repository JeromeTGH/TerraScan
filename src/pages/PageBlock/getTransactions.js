import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient, AccAddress, hashToHex,
    MsgBeginRedelegate, MsgDelegate, MsgDeposit, MsgExecuteContract, MsgFundCommunityPool,
    MsgMultiSend, MsgSend, MsgTransfer, MsgUndelegate, MsgVote, MsgWithdrawDelegatorReward, MsgExecAuthorized,
    MsgWithdrawValidatorCommission, MsgAggregateExchangeRatePrevote, MsgAggregateExchangeRateVote, MsgSwap, MsgUnjail} from '@terra-money/terra.js';
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
                ''                      // Info source vote, si validateur (son numéro de compte "terra1...")
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
                    transactionsInfos[i][3] = 'Send';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].from_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].to_address;
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgDelegate) {
                    transactionsInfos[i][3] = 'Delegate';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].delegator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].validator_address;
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgUndelegate) {
                    transactionsInfos[i][3] = 'Undelegate';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].validator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].delegator_address;
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgBeginRedelegate) {
                    transactionsInfos[i][3] = 'Begin Redelegate';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].delegator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].validator_dst_address; // from "validator_src_address", en fait
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgVote) {
                    transactionsInfos[i][3] = 'Vote';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].voter;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].proposal_id.toString();

                    const rawValidators = await lcd.staking.validators({'pagination.limit': '9999'}).catch(handleError);
                    if(rawValidators) {
                        for(let j=0 ; j < rawValidators[0].length ; j++) {
                            if(AccAddress.fromValAddress(rawValidators[0][j].operator_address) === rawTxInfo.tx.body.messages[0].voter) {
                                transactionsInfos[i][4] = rawValidators[0][j].operator_address;
                                transactionsInfos[i][6] = rawValidators[0][j].description.moniker;
                                transactionsInfos[i][7] = rawTxInfo.tx.body.messages[0].voter;
                            }
                        }
                    } else
                        return { "erreur": "Failed to fetch [validators] ..." }

                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgWithdrawDelegatorReward) {
                    transactionsInfos[i][3] = 'Withdraw Delegator Reward';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].validator_address;
                    transactionsInfos[i][5] = rawTxInfo.tx.body.messages[0].delegator_address;
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgWithdrawValidatorCommission) {
                    transactionsInfos[i][3] = 'Withdraw Validator Commission';
                    transactionsInfos[i][4] = rawTxInfo.tx.body.messages[0].validator_address;
                    transactionsInfos[i][5] = AccAddress.fromValAddress(rawTxInfo.tx.body.messages[0].validator_address);
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgDeposit) {
                    transactionsInfos[i][3] = 'Deposit';
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgExecAuthorized) {
                    transactionsInfos[i][3] = 'Exec Authorized';
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgExecuteContract) {
                    transactionsInfos[i][3] = 'Execute Contract';
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgFundCommunityPool) {
                    transactionsInfos[i][3] = 'Fund Community Pool';
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgMultiSend) {
                    transactionsInfos[i][3] = 'MultiSend';
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgTransfer) {
                    transactionsInfos[i][3] = 'Transfer';
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgAggregateExchangeRatePrevote) {
                    transactionsInfos[i][3] = 'Aggregate Exchange Rate Prevote';
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgAggregateExchangeRateVote) {
                    transactionsInfos[i][3] = 'Aggregate Exchange Rate Vote';
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgSwap) {
                    transactionsInfos[i][3] = 'Swap';
                } else if(rawTxInfo.tx.body.messages[0] instanceof MsgUnjail) {
                    transactionsInfos[i][3] = 'Unjail';
                } else {
                    transactionsInfos[i][3] = 'MsgNotCoded';
                    // console.log(rawTxInfo.tx.body.messages[0]);
                }
            }
            else
                transactionsInfos[i][3] = 'Multiple (' + nbMessages + ' messages)';

        } else
            return { "erreur": "Failed to fetch [transaction infos] ..." } 
    }

    
    // Parcours de tous les "from", à la recherche des adresses de type "terravaloper1..." (car il s'agit de validateur, et donc, il faut récupérer leur "moniker" aussi)
    for(let i=0 ; i<transactionsInfos.length ; i++) {
        if(transactionsInfos[i][6] === '') {
            if(isValidTerraAddressFormat(transactionsInfos[i][4], 'terravaloper1')) {
                const rawValidator = await lcd.staking.validator(transactionsInfos[i][4]).catch(handleError);
                if(rawValidator)
                    transactionsInfos[i][6] = rawValidator.description.moniker;
                else
                    return { "erreur": "Failed to fetch [validator] ..." } 
            }
            if(isValidTerraAddressFormat(transactionsInfos[i][5], 'terravaloper1')) {
                const rawValidator = await lcd.staking.validator(transactionsInfos[i][5]).catch(handleError);
                if(rawValidator)
                    transactionsInfos[i][6] = rawValidator.description.moniker;
                else
                    return { "erreur": "Failed to fetch [validator] ..." } 
            }
    
        }
    }


    // Envoi des infos en retour
    return transactionsInfos;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}