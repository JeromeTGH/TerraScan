import { tblCorrespondanceMessages, tblCorrespondanceValeurs } from '../../application/AppParams';
import { FCDclient } from "../../apis/fcd/FCDclient";
import { tblValidators, tblValidatorsAccounts } from '../../application/AppData';
import { Tx } from '../../apis/fcd/classes/Tx';
import { CoinsList } from '../../apis/fcd/classes/CoinsList';
import { LCDclient } from '../../apis/lcd/LCDclient';

export const getTxDatas = async (txHash) => {
    
    // Les 2 variables de retour
    const txMessages = [];
    const txInfos = {
        'errCode': null,                // 0 si cette transaction a été un succès
        'errMessage': null,             // Message d'erreur (si y'a eu une erreur)
        'blockHeight': null,            // Numéro de bloc, dans lequel est insérée cette transaction
        'gas_used': null,               // Gas utilisés
        'gas_wanted': null,             // Gas demandés
        'datetime': null,               // Date et heure de la transaction
        'feesAmountAndCoin': [],        // Montant des fees et précision devise (LUNC, USTC, ...)
        'nbMessages': null              // Nombre de messages, à l'intérieur de cette transaction
    }
    
    // Instanciation FCD et LCD
    const fcd = FCDclient.getSingleton();
    const lcd = LCDclient.getSingleton();

    // Récupération des infos concernant cette transaction
    const rawFullTxInfo = await fcd.tx.getTxInfos(txHash).catch(handleError);

    const rawTxInfo = new Tx(rawFullTxInfo.data);
    if(rawTxInfo) {

// console.log("rawTxInfo", rawTxInfo);

        // ====== Code
        txInfos["errCode"] = rawTxInfo.code.toString();          // 0 = success
        if(txInfos["errCode"] === '0')
            txInfos["errMessage"] = 'successful';
        else
            txInfos["errMessage"] = rawTxInfo.raw_log;

        // ====== Block
        txInfos["blockHeight"] = rawTxInfo.height;

        // ====== Frais de gas
        txInfos["gas_used"] = rawTxInfo.gas_used;
        txInfos["gas_wanted"] = rawTxInfo.gas_wanted;

        // ====== Datetime
        txInfos["datetime"] = rawTxInfo.timestamp;

        // ====== Fees
        const tblFees = [];
        for (const fee of rawTxInfo.tx.value.fee.amount) {
            const feesAmount = (fee.amount/1000000).toFixed(6);
            const feesDenom = tblCorrespondanceValeurs[fee.denom] ? tblCorrespondanceValeurs[fee.denom] : fee.denom;
            tblFees.push({
                amount: feesAmount,
                denom: feesDenom
            })
        }
        txInfos["feesAmountAndCoin"] = tblFees;

        // ====== Memo
        txInfos["memo"] = rawTxInfo.tx.value.memo ? rawTxInfo.tx.value.memo : "(none)";


        // ====== Taxes
        const logsTbl = rawTxInfo.logs;
        txInfos["logs"] = rawTxInfo.logs;
// console.log("logs", txInfos["logs"]);

        const tblTaxes = [];
        const tblTransferts = [];
        for(const lgLog of logsTbl) {
            // console.log("log #", lgLog);

            if(lgLog.events) {
                for(const eventNum in lgLog.events) {
                    const evenement = lgLog.events[eventNum]
                    const eventDetails = {
                        sender: "",
                        recipient: "",
                        amount: "",
                        multiple_coins: ""
                    }
                    if(evenement.type && evenement.attributes)
                    {
                        if(evenement.type === "transfer") {
                            // console.log("evenement", evenement);
                            for(const attributeNum in evenement.attributes) {
                                switch(evenement.attributes[attributeNum].key) {
                                    case "recipient":
                                        eventDetails.recipient = evenement.attributes[attributeNum].value;
                                        break;
                                    case "sender":
                                        eventDetails.sender = evenement.attributes[attributeNum].value;
                                        break;
                                    case "amount":
                                        const amountAndTicker = evenement.attributes[attributeNum].value;
                                        const idxComma = amountAndTicker.indexOf(",");
                                        if (idxComma === -1) {
                                            const regexAmount = /^[0-9.]+/g;
                                            const matchAmout = amountAndTicker.match(regexAmount);
                                            if(matchAmout.length > 0) {
                                                const rawDevise = amountAndTicker.replace(matchAmout[0], "");
                                                const devise = tblCorrespondanceValeurs[rawDevise] ? tblCorrespondanceValeurs[rawDevise] : rawDevise;
                                                eventDetails.amount = (parseFloat(matchAmout[0]) / 1000000).toFixed(6) + "\u00a0" + devise;
                                            }
                                        } else {
                                            eventDetails.amount = "multiple coins";
                                            eventDetails.multiple_coins = amountAndTicker;
                                        }
       
                                        break;
                                    default:
                                        break;
                                }
                            }
                            tblTransferts.push(eventDetails)
                        }
                    }
                }
            }

            if(lgLog.log && lgLog.log.tax) {
                const coins = lgLog.log.tax.split(',');
                for (const coin of coins) {
                    const taxeDenom = coin.replace(/[0-9]/g, '');
                    const taxeValue = coin.replace(taxeDenom, '');
                    tblTaxes.push({
                        amount: (parseInt(taxeValue)/1000000).toFixed(6),
                        denom: tblCorrespondanceValeurs[taxeDenom] ? tblCorrespondanceValeurs[taxeDenom] : taxeDenom
                    })
                }
            }
        }
        txInfos["taxes"] = tblTaxes;
        txInfos["transferts"] = tblTransferts;


        // ====== Nb Messages
        txInfos["nbMessages"] = rawTxInfo.tx.value.msg.length;
        for(let i=0 ; i < txInfos["nbMessages"] ; i++) {

            // console.log("rawTxInfo", rawTxInfo);
            const message = rawTxInfo.tx.value.msg[i];
// console.log("message", message);
            // const logs = rawTxInfo.logs[i]; console.log("logs", logs);

            const msgStructRet = {
                'MsgType': null,                        // Type de message (MsgSend, MsgDelegate, ...)
                'MsgDesc': '(not implemented yet)',     // Sera remplacé par "Send", "Delegate", ..., selon le type de message
                'FromAddress': null,                    // Provenant de cette adresse
                'ToAddress': null,                      // Allant vers cette adresse
                'Amount': null,                         // Montant ([qté + nom de la devise])
                'Feeder': null,                         // Feeder
                'ValidatorAddress': null,               // Adresse "terravaloper1..." du validateur en question
                'ValidatorMoniker': null,               // Nom du validateur
                'ExchangeRates': null,                  // Exchange rates
                'Hash': null,                           // Hash value
                'VoteChoice': null,                     // Choix de vote (YES, ABSTAIN, NO, NO WITH VETO)
                'ProposalID': null,                     // Numéro de proposition à voter
                'VoterAddress': null,                   // Adresse "terra1" du votant
                'withdrawRewards': null,                // Récompenses retirées (staker)
                'withdrawCommissions': null,            // Commissions retirées (validateur)
                // Etc... (remplissage non nécessaire ici, en fait)
            }
            
            msgStructRet['MsgType'] = message.type.split('/')[1];

            if(msgStructRet['MsgType'] === 'MsgSend') {
                msgStructRet['FromAddress'] = message.value.from_address;
                msgStructRet['ToAddress'] = message.value.to_address;
                msgStructRet['Amount'] = coinsListToFormatedText(message.value.amount);
            }
            
            if(msgStructRet['MsgType'] === 'MsgAggregateExchangeRateVote') {
                msgStructRet['Feeder'] = message.value.feeder;
                msgStructRet['Salt'] = message.value.salt;
                msgStructRet["ExchangeRates"] = exchangeRatesToFormatedText(message.value.exchange_rates);
                msgStructRet['ValidatorAddress'] = message.value.validator;
                msgStructRet['ValidatorMoniker'] = tblValidators[message.value.validator].description_moniker ? tblValidators[message.value.validator].description_moniker : 'unknown';
            }

            if(msgStructRet['MsgType'] === 'MsgAggregateExchangeRatePrevote') {
                msgStructRet['Feeder'] = message.value.feeder;
                msgStructRet['Hash'] = message.value.hash;
                msgStructRet['ValidatorAddress'] = message.value.validator;
                msgStructRet['ValidatorMoniker'] = tblValidators[message.value.validator].description_moniker ? tblValidators[message.value.validator].description_moniker : 'unknown';
            }

            if(msgStructRet['MsgType'] === 'MsgVote') {
                msgStructRet['VoteChoice'] = message.value.option;
                msgStructRet['ProposalID'] = message.value.proposal_id;

                const rawProposalInfos = await lcd.gov.getProposal(message.value.proposal_id).catch(handleError);
                if(rawProposalInfos?.data?.proposal?.content?.title) {
                    msgStructRet['ProposalTitle'] = rawProposalInfos.data.proposal.content.title;
                } else if(rawProposalInfos?.data?.proposal?.title) {
                    msgStructRet['ProposalTitle'] = rawProposalInfos.data.proposal.title;
                } else {
                    msgStructRet['ProposalTitle'] = '(unknown)';
                }

                msgStructRet['VoterAddress'] = message.value.voter;
                if(tblValidatorsAccounts[message.value.voter]) {
                    msgStructRet['ValidatorAddress'] = tblValidatorsAccounts[message.value.voter];
                    msgStructRet['ValidatorMoniker'] = tblValidators[tblValidatorsAccounts[message.value.voter]].description_moniker;
                }
            }

            if(msgStructRet['MsgType'] === 'MsgWithdrawDelegatorReward' || msgStructRet['MsgType'] === 'MsgWithdrawDelegationReward') {
                // variante 'MsgWithdrawDelegationReward' trouvée dans bloc #9106141, par exemple
                msgStructRet['DelegatorAddress'] = message.value.delegator_address;
                msgStructRet['ValidatorAddress'] = message.value.validator_address;
                msgStructRet['ValidatorMoniker'] = tblValidators[message.value.validator_address].description_moniker ? tblValidators[message.value.validator_address].description_moniker : 'unknown';

                if(rawTxInfo.logs[i] !== undefined) {
                    let rewards = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_rewards", "amount");
                    rewards = formatGluedAmountsAndCoins(rewards);
                    msgStructRet['withdrawRewards'] = rewards;
                } else
                    msgStructRet['withdrawRewards'] = ['(nothing)'];
            }

            if(msgStructRet['MsgType'] === 'MsgWithdrawValidatorCommission') {
                msgStructRet['ValidatorAddress'] = message.value.validator_address;
                msgStructRet['ValidatorMoniker'] = tblValidators[message.value.validator_address].description_moniker ? tblValidators[message.value.validator_address].description_moniker : 'unknown';
                msgStructRet['ToAddress'] = tblValidators[message.value.validator_address].terra1_account_address;

                if(rawTxInfo.logs[i] !== undefined) {
                    let commission = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_commission", "amount");
                    commission = formatGluedAmountsAndCoins(commission);
                    msgStructRet['withdrawCommissions'] = commission;
                } else
                    msgStructRet['withdrawCommissions'] = ['(nothing)'];
            }

            if(msgStructRet['MsgType'] === 'MsgExecuteContract') {
                msgStructRet['Contract'] = message.value.contract;
                msgStructRet['Sender'] = message.value.sender;
                msgStructRet['Coins'] = coinsListToFormatedText(message.value.coins);
                msgStructRet['Funds'] = coinsListToFormatedText(message.value.funds);
                msgStructRet['Msg'] = message.value.msg;
                msgStructRet['ExecuteMsg'] = message.value.execute_msg;
            }

            if(msgStructRet['MsgType'] === 'MsgDelegate') {
                msgStructRet['DelegatorAddress'] = message.value.delegator_address;
                msgStructRet['ValidatorAddress'] = message.value.validator_address;
                msgStructRet['ValidatorMoniker'] = tblValidators[message.value.validator_address].description_moniker ? tblValidators[message.value.validator_address].description_moniker : 'unknown';
                msgStructRet['Amount'] = (message.value.amount.amount / 1000000).toFixed(6) + "\u00a0" + (tblCorrespondanceValeurs[message.value.amount.denom] ? tblCorrespondanceValeurs[message.value.amount.denom] : message.value.amount.denom);

                if(rawTxInfo.logs[i] !== undefined) {
                    let rewards = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_rewards", "amount");
                    rewards = formatGluedAmountsAndCoins(rewards);
                    msgStructRet['withdrawRewards'] = rewards;
                } else
                    msgStructRet['withdrawRewards'] = ['(nothing)'];
            }

            if(msgStructRet['MsgType'] === 'MsgUndelegate') {
                msgStructRet['DelegatorAddress'] = message.value.delegator_address;
                msgStructRet['ValidatorAddress'] = message.value.validator_address;
                msgStructRet['ValidatorMoniker'] = tblValidators[message.value.validator_address].description_moniker ? tblValidators[message.value.validator_address].description_moniker : 'unknown';
                msgStructRet['Amount'] = (message.value.amount.amount / 1000000).toFixed(6) + "\u00a0" + (tblCorrespondanceValeurs[message.value.amount.denom] ? tblCorrespondanceValeurs[message.value.amount.denom] : message.value.amount.denom);

                if(rawTxInfo.logs[i] !== undefined) {
                    let rewards = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_rewards", "amount");
                    rewards = formatGluedAmountsAndCoins(rewards);
                    msgStructRet['withdrawRewards'] = rewards;
                } else
                    msgStructRet['withdrawRewards'] = ['(nothing)'];
            }

            if(msgStructRet['MsgType'] === 'MsgBeginRedelegate') {
                msgStructRet['DelegatorAddress'] = message.value.delegator_address;
                msgStructRet['SrcValidatorAddress'] = message.value.validator_src_address;
                msgStructRet['SrcValidatorMoniker'] = tblValidators[message.value.validator_src_address].description_moniker ? tblValidators[message.value.validator_src_address].description_moniker : 'unknown';
                msgStructRet['DstValidatorAddress'] = message.value.validator_dst_address;
                msgStructRet['DstValidatorMoniker'] = tblValidators[message.value.validator_dst_address].description_moniker ? tblValidators[message.value.validator_dst_address].description_moniker : 'unknown';
                msgStructRet['Amount'] = (message.value.amount.amount / 1000000).toFixed(6) + "\u00a0" + (tblCorrespondanceValeurs[message.value.amount.denom] ? tblCorrespondanceValeurs[message.value.amount.denom] : message.value.amount.denom);

                if(rawTxInfo.logs[i] !== undefined) {
                    let rewards = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_rewards", "amount");
                    rewards = formatGluedAmountsAndCoins(rewards);
                    msgStructRet['withdrawRewards'] = rewards;
                } else
                    msgStructRet['withdrawRewards'] = ['(nothing)'];
            }

            if(msgStructRet['MsgType'] === 'MsgSubmitProposal') {
                msgStructRet['Proposer'] = message.value.proposer;
                msgStructRet['InitialDeposit'] = coinsListToFormatedText(message.value.initial_deposit);

                if(message?.value?.content?.title) {
                    msgStructRet['ContentTitle'] = message.value.content.title;
                } else if(message?.value?.title) {
                    msgStructRet['ContentTitle'] = message.value.title;
                } else {
                    msgStructRet['ContentTitle'] = '(unknown)';
                    if(Array.isArray(message?.value?.messages)) {
                        for(let idxMsg=0; idxMsg < message.value.messages.length; idxMsg++) {
                            if(message.value.messages[idxMsg].content?.title) {
                                msgStructRet['ContentTitle'] = message.value.messages[idxMsg].content.title;
                            }
                        }
                    }
                }

                if(message?.value?.content?.description) {
                    msgStructRet['ContentDescription'] = message.value.content.description;
                } else if (message?.value?.summary) {
                    msgStructRet['ContentDescription'] = message.value.summary;
                    msgStructRet['ContentMetadata'] = message.value.metadata;
                } else {
                    msgStructRet['ContentDescription'] = '(unknown)';
                    if(Array.isArray(message?.value?.messages)) {
                        for(let idxMsg=0; idxMsg < message.value.messages.length; idxMsg++) {
                            if(message.value.messages[idxMsg].content?.description) {
                                msgStructRet['ContentDescription'] = message.value.messages[idxMsg].content.description;
                            }
                        }
                    }
                }

                if(rawTxInfo.logs[i] !== undefined) {
                    msgStructRet['ProposalID'] = findInTblLogEvents(rawTxInfo.logs[i].events, "proposal_deposit", "proposal_id")[0];
                } else
                    msgStructRet['ProposalID'] = '(undefined)';
            }

            if(msgStructRet['MsgType'] === 'MsgDeposit') {
                msgStructRet['Depositor'] = message.value.depositor;
                msgStructRet['ProposalID'] = message.value.proposal_id;

                const rawProposalInfos = await lcd.gov.getProposal(message.value.proposal_id).catch(handleError);
                if(rawProposalInfos?.data?.proposal?.content?.title) {
                    msgStructRet['ProposalTitle'] = rawProposalInfos?.data.proposal.content.title;
                } else if(rawProposalInfos?.data?.proposal?.title) {
                    msgStructRet['ProposalTitle'] = rawProposalInfos.data.proposal.title;
                } else {
                    msgStructRet['ProposalTitle'] = '(unknown)';
                }

                msgStructRet['Amount'] = coinsListToFormatedText(message.value.amount);
            }

            if(msgStructRet['MsgType'] === 'MsgFundCommunityPool') {
                msgStructRet['Depositor'] = message.value.depositor;
                msgStructRet['Amount'] = coinsListToFormatedText(message.value.amount);
                if(rawTxInfo.logs[i] !== undefined) {
                    msgStructRet['Recipient'] = findInTblLogEvents(rawTxInfo.logs[i].events, "transfer", "recipient")[0];
                } else
                    msgStructRet['Recipient'] = '(undefined)';
            }

            if(msgStructRet['MsgType'] === 'MsgUpdateClient') {
                msgStructRet['Signer'] = message.value.signer;
                msgStructRet['ClientID'] = message.value.client_id;
                msgStructRet['Header'] = message.value.header;
            }
            
            if(msgStructRet['MsgType'] === 'MsgAcknowledgement') {
                msgStructRet['Signer'] = message.value.signer;
                msgStructRet['Acknowledgement'] = message.value.acknowledgement;
                msgStructRet['ProofAcked'] = message.value.proof_acked;
                msgStructRet['Packet'] = message.value.packet;
                msgStructRet['ProofHeight'] = message.value.proof_height;
            }

            if(msgStructRet['MsgType'] === 'MsgExec' || msgStructRet['MsgType'] === 'MsgExecAuthorized') {
                msgStructRet['Grantee'] = message.value.grantee;
                msgStructRet['Msgs'] = message.value.msgs;
            }

            if(msgStructRet['MsgType'] === 'MsgInstantiateContract') {
                msgStructRet['Admin'] = message.value.admin;
                msgStructRet['CodeID'] = message.value.code_id;
                msgStructRet['InitCoins'] = coinsListToFormatedText(message.value.init_coins);
                msgStructRet['Funds'] = coinsListToFormatedText(message.value.funds);
                msgStructRet['InitMsg'] = message.value.init_msg;
                msgStructRet['Label'] = message.value.label;
                msgStructRet['Sender'] = message.value.sender;
            }

            if(msgStructRet['MsgType'] === 'MsgUnjail') {
                msgStructRet['Address'] = message.value.address === undefined ? "(undefined)" : message.value.address;
            }

            if(msgStructRet['MsgType'] === 'MsgTransfer') {
                msgStructRet['FromAddress'] = message.value.sender;
                msgStructRet['ToAddress'] = message.value.receiver;
                msgStructRet['SourceChannel'] = message.value.source_channel;
            }

            if(msgStructRet['MsgType'] === 'MsgCreateValidator') {
                msgStructRet['commission'] = message.value.commission;
                msgStructRet['delegator_address'] = message.value.delegator_address;
                msgStructRet['description'] = message.value.description;
                msgStructRet['min_self_delegation'] = (parseInt(message.value.min_self_delegation) / 1000000).toFixed(6);
                msgStructRet['val_pubkey'] = message.value.pubkey.key;
                msgStructRet['validator_address'] = message.value.validator_address;
                msgStructRet['value'] = (message.value.value.amount / 1000000).toFixed(6) + "\u00a0" + (tblCorrespondanceValeurs[message.value.value.denom] ? tblCorrespondanceValeurs[message.value.value.denom] : message.value.value.denom);
            }

            if(msgStructRet['MsgType'] === 'MsgGrantAuthorization' || msgStructRet['MsgType'] === 'MsgGrant') {
                msgStructRet['grantee'] = message.value.grantee;
                msgStructRet['granter'] = message.value.granter;
                msgStructRet['grant'] = message.value.grant;
            }
            
            if(msgStructRet['MsgType'] === 'MsgGrantAllowance') {
                msgStructRet['grantee'] = message.value.grantee;
                msgStructRet['granter'] = message.value.granter;
                msgStructRet['allowance'] = message.value.allowance;
            }

            if(msgStructRet['MsgType'] === 'MsgStoreCode') {
                msgStructRet['instantiate_permission'] = message.value.instantiate_permission ? message.value.instantiate_permission : "null";
                msgStructRet['sender'] = message.value.sender;
                msgStructRet['wasm_byte_code'] = message.value.wasm_byte_code;
            }

            if(msgStructRet['MsgType'] === 'MsgMigrateContract') {
                msgStructRet['code_id'] = message.value.code_id;
                msgStructRet['contract'] = message.value.contract;
                msgStructRet['msg'] = message.value.msg;
                msgStructRet['sender'] = message.value.sender;
            }

            if(msgStructRet['MsgType'] === 'MsgSetWithdrawAddress') {
                msgStructRet['delegator_address'] = message.value.delegator_address;
                msgStructRet['withdraw_address'] = message.value.withdraw_address;
            }

            if(msgStructRet['MsgType'] === 'MsgClearAdmin') {
                msgStructRet['contract'] = message.value.contract;
                msgStructRet['sender'] = message.value.sender;
            }

            if(msgStructRet['MsgType'] === 'MsgModifyWithdrawAddress') {
                msgStructRet['delegator_address'] = message.value.delegator_address;
                msgStructRet['withdraw_address'] = message.value.withdraw_address;
            }

            if(msgStructRet['MsgType'] === 'MsgSwap') {
                msgStructRet['ask_denom'] = message.value.ask_denom;
                msgStructRet['offer_coin'] = message.value.offer_coin;
                msgStructRet['trader'] = message.value.trader;
            }

            if(msgStructRet['MsgType'] === 'MsgUpdateAdmin') {
                msgStructRet['contract'] = message.value.contract;
                msgStructRet['sender'] = message.value.sender;
                msgStructRet['new_admin'] = message.value.new_admin;
            }

            if(msgStructRet['MsgType'] === 'MsgSwapSend') {
                msgStructRet['ask_denom'] = message.value.ask_denom;
                msgStructRet['offer_coin'] = message.value.offer_coin;
                msgStructRet['from_address'] = message.value.from_address;
                msgStructRet['to_address'] = message.value.to_address;
            }

            if(msgStructRet['MsgType'] === 'MsgRevokeAuthorization' || msgStructRet['MsgType'] === 'MsgRevoke') {
                msgStructRet['grantee'] = message.value.grantee;
                msgStructRet['granter'] = message.value.granter;
                msgStructRet['msg_type_url'] = message.value.msg_type_url;
            }

            if(msgStructRet['MsgType'] === 'MsgMultiSend') {
                msgStructRet['inputs'] = message.value.inputs;
                msgStructRet['outputs'] = message.value.outputs;
            }

            if(msgStructRet['MsgType'] === 'MsgVoteWeighted') {
                msgStructRet['VoteChoices'] = message.value.options;
                msgStructRet['ProposalID'] = message.value.proposal_id;

                const rawProposalInfos = await lcd.gov.getProposal(message.value.proposal_id).catch(handleError);
                if(rawProposalInfos?.data?.proposal?.content?.title) {
                    msgStructRet['ProposalTitle'] = rawProposalInfos?.data.proposal.content.title;
                } else if(rawProposalInfos?.data?.proposal?.title) {
                    msgStructRet['ProposalTitle'] = rawProposalInfos.data.proposal.title;
                } else {
                    msgStructRet['ProposalTitle'] = '(unknown)';
                }
                
                msgStructRet['VoterAddress'] = message.value.voter;
                if(tblValidatorsAccounts[message.value.voter]) {
                    msgStructRet['ValidatorAddress'] = tblValidatorsAccounts[message.value.voter];
                    msgStructRet['ValidatorMoniker'] = tblValidators[tblValidatorsAccounts[message.value.voter]].description_moniker;
                }
            }

            if(msgStructRet['MsgType'] === 'MsgEditValidator') {
                msgStructRet['ValidatorAddress'] = message.value.validator_address;
                msgStructRet['ValidatorMoniker'] = tblValidators[message.value.validator_address].description_moniker;
                msgStructRet['descriptionDetails'] = message.value.description.details ? message.value.description.details : "";
                msgStructRet['descriptionIdentity'] = message.value.description.identity ? message.value.description.identity : "";
                msgStructRet['descriptionMoniker'] = message.value.description.moniker ? message.value.description.moniker : "";
                msgStructRet['descriptionSecurityContact'] = message.value.description.security_contact ? message.value.description.security_contact : "";
                msgStructRet['descriptionWebsite'] = message.value.description.website ? message.value.description.website : "";
            }


            msgStructRet['MsgDesc'] = tblCorrespondanceMessages[msgStructRet['MsgType']] ? tblCorrespondanceMessages[msgStructRet['MsgType']] : msgStructRet['MsgType'];
            txMessages.push(msgStructRet);
        }

    } else
        return { "erreur": "Failed to fetch [tx infos] ..." } 


    // Envoi des infos en retour
    return {'txInfos': txInfos, 'txMessages': txMessages};
}


// ===========================
// Log les éventuelles erreurs
// ===========================
const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}


// ======================================================================
// Créé un STRING avec montant+devise, séparé de virgules si multidevises
// ======================================================================
const coinsListToFormatedText = (coinsList) => {

    if(coinsList===undefined)
        return "---";

    //const dataCoinsList = (new Coins(coinsList)).toData();
    const dataCoinsList = new CoinsList(coinsList);
    let retour = "";
    
    if(dataCoinsList.tbl.length > 0) {
        for(let i=0 ; i < dataCoinsList.tbl.length ; i++) {
            const msgAmount = (dataCoinsList.tbl[i].amount/1000000).toFixed(6);
            const msgCoin = tblCorrespondanceValeurs[dataCoinsList.tbl[i].denom] ? tblCorrespondanceValeurs[dataCoinsList.tbl[i].denom] : dataCoinsList.tbl[i].denom;
            if(retour !== "")
                retour += ", ";
            retour += (msgAmount + "\u00a0" + msgCoin);
        }
    } else {
        retour = "---";
    }

    return retour;
}


// ==============================
// Extrait les infos ExchangeRate
// ==============================
const exchangeRatesToFormatedText = (coinsList) => {
    let retour = "";
    for(const coin of coinsList.split(',')) {
        let denom = coin.replace(/[0-9.]/g, '');
        let amount = coin.replace(denom, '');

        if(retour !== '')
            retour += ', ';
        retour += amount + '\u00a0' + (tblCorrespondanceValeurs[denom] ? tblCorrespondanceValeurs[denom] : denom);
    }
    return retour;
}


// ==================================================================================
// Extrait des infos particulières dans l'event communiqué, à 2 niveaux de profondeur
// ==================================================================================
const findInTblLogEvents = (tblLogEvents, firstWordToSearch, secondWordToSearch) => {
    let retour = '';

    for(let i=0 ; i < tblLogEvents.length ; i++)
        if(tblLogEvents[i].type === firstWordToSearch)
            for(let j=0 ; j < tblLogEvents[i].attributes.length ; j++)
                if(tblLogEvents[i].attributes[j].key === secondWordToSearch)
                    retour = tblLogEvents[i].attributes[j].value;

    if(retour === '')
        return []
    else
        return retour.replace('"', '').split(',');
}


// ============================================================================================================
// Remet en forme un tableau du style ["2uusd", "1415156uluna", ...] en ["0.000002 USTC", "1.415156 LUNC", ...]
// ============================================================================================================
const formatGluedAmountsAndCoins = (tblGluedAmountsAndCoins) => {
    let retour = [];

    for(let i=0 ; i < tblGluedAmountsAndCoins.length ; i++) {
        const alphaPos = tblGluedAmountsAndCoins[i].search(/[a-z]/g);
        const valeur = (parseInt(tblGluedAmountsAndCoins[i].substring(0, alphaPos)) / 1000000).toFixed(6);
        const devise = tblCorrespondanceValeurs[tblGluedAmountsAndCoins[i].substring(alphaPos)] ? tblCorrespondanceValeurs[tblGluedAmountsAndCoins[i].substring(alphaPos)] : tblGluedAmountsAndCoins[i].substring(alphaPos);
        retour.push(valeur + " " + devise);
    }

    return retour;
}