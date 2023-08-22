import { tblCorrespondanceMessages, tblCorrespondanceValeurs } from '../../application/AppParams';
import { AccAddress, Coins } from '@terra-money/terra.js';
import { FCDclient } from "../../fcd/FCDclient";
import { tblValidators } from '../../application/AppData';
import { loadValidatorsList } from '../../sharedFunctions/getValidatorsV2';
import { Tx } from '../../fcd/classes/Tx';
import { CoinsList } from '../../fcd/classes/CoinsList';

export const getTxDatasV2 = async (txHash) => {

    // Charge la liste des validateurs, si ce n'est pas encore fait
    await loadValidatorsList();
    
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
    
    // Instanciation FCD
    const fcd = FCDclient.getSingleton();

    // Récupération des infos concernant cette transaction
    const rawFullTxInfo = await fcd.tx.getTxInfos(txHash).catch(handleError);

    const rawTxInfo = new Tx(rawFullTxInfo.data);
    if(rawTxInfo) {

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
        const fees = new CoinsList(rawTxInfo.tx.value.fee.amount);
        if(fees.tbl.length > 0) {
            for(let i=0 ; i < fees.tbl.length ; i++) {
                const feesAmount = (fees.tbl[i].amount/1000000).toFixed(6);
                const feesCoin = tblCorrespondanceValeurs[fees.tbl[i].denom] ? tblCorrespondanceValeurs[fees.tbl[i].denom] : fees.tbl[i].denom;
                txInfos["feesAmountAndCoin"].push(feesAmount + "\u00a0" + feesCoin);
            }
        } else {
            txInfos["feesAmountAndCoin"].push("---");
        }

        // ====== Taxes
        const logsTbl = rawTxInfo.logs;
        let totalOfTaxes = '---';
        for(const lgLog of logsTbl) {
            if(lgLog.log && lgLog.log.tax) {
                const denom = lgLog.log.tax.replace(/[0-9]/g, '');
                const value = lgLog.log.tax.replace(denom, '');
                
                let logTaxe = '';
                if(tblCorrespondanceValeurs[denom])
                    logTaxe = (parseInt(value)/1000000).toFixed(6) + '\u00a0' + tblCorrespondanceValeurs[denom];
                else
                    logTaxe = value + '\u00a0' + denom;
                if(totalOfTaxes === '---')
                    totalOfTaxes = logTaxe;
                else
                    totalOfTaxes = ', ' + logTaxe;
            }
        }
        txInfos["taxes"] = totalOfTaxes;

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
                msgStructRet['VoterAddress'] = message.value.voter;

                const isValidatorAccount = Object.entries(tblValidators).find(lg => lg[1].terra1_account_address === message.value.voter);
                if(isValidatorAccount) {
                    msgStructRet['ValidatorAddress'] = isValidatorAccount[0];
                    msgStructRet['ValidatorMoniker'] = isValidatorAccount[1].description_moniker;
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
                msgStructRet['ToAddress'] = AccAddress.fromValAddress(message.value.validator_address);

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
                msgStructRet['ContentTitle'] = message.value.content.title;
                msgStructRet['ContentDescription'] = message.value.content.description;

                if(rawTxInfo.logs[i] !== undefined) {
                    msgStructRet['ProposalID'] = findInTblLogEvents(rawTxInfo.logs[i].events, "proposal_deposit", "proposal_id")[0];
                } else
                    msgStructRet['ProposalID'] = '(undefined)';
            }

            if(msgStructRet['MsgType'] === 'MsgDeposit') {
                msgStructRet['Depositor'] = message.value.depositor;
                msgStructRet['ProposalID'] = message.value.proposal_id;
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
    console.log("ERREUR", err);
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
    const dataCoinsList = (new Coins(coinsList)).toData();
    let retour = "";
    
    if(dataCoinsList.length > 0) {
        for(let i=0 ; i < dataCoinsList.length ; i++) {
            const msgAmount = dataCoinsList[i].amount;
            const msgCoin = tblCorrespondanceValeurs[dataCoinsList[i].denom] ? tblCorrespondanceValeurs[dataCoinsList[i].denom] : dataCoinsList[i].denom;
            if(retour !== "")
                retour += ", ";
            retour += (msgAmount + "\u00a0" + msgCoin);
        }
    } else {
        retour = "---";
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