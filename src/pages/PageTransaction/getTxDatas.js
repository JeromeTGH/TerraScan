import { chainID, chainLCDurl, tblCorrespondanceValeurs } from '../../application/AppParams';
import { AccAddress, Coins, LCDClient, MsgAcknowledgement, MsgAggregateExchangeRatePrevote, MsgAggregateExchangeRateVote,
         MsgBeginRedelegate, MsgDelegate, MsgDeposit, MsgExecAuthorized, MsgExecuteContract, MsgFundCommunityPool, MsgInstantiateContract, MsgSend, MsgSubmitProposal,
         MsgUndelegate, MsgUpdateClient, MsgVote, MsgWithdrawDelegatorReward, MsgWithdrawValidatorCommission } from '@terra-money/terra.js';


export const getTxDatas = async (txHash) => {
    
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

    const txMessages = [];
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération des infos concernant cette transaction
    const rawTxInfo = await lcd.tx.txInfo(txHash).catch(handleError);
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
        const fees = (new Coins(rawTxInfo.tx.auth_info.fee.amount)).toData();
        if(fees.length > 0) {
            for(let i=0 ; i < fees.length ; i++) {
                const feesAmount = (fees[i].amount/1000000).toFixed(6);
                const feesCoin = tblCorrespondanceValeurs[fees[i].denom] ? tblCorrespondanceValeurs[fees[i].denom] : fees[i].denom;
                txInfos["feesAmountAndCoin"].push(feesAmount + "\u00a0" + feesCoin);
            }
        } else {
            txInfos["feesAmountAndCoin"].push("---");
        }

        // ====== Nb Messages
        txInfos["nbMessages"] = rawTxInfo.tx.body.messages.length;
        for(let i=0 ; i < txInfos["nbMessages"] ; i++) {

            const message = rawTxInfo.tx.body.messages[i];
            // console.log("rawTxInfo", rawTxInfo);
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
            
            if(message instanceof MsgSend) {
                msgStructRet['MsgType'] = 'MsgSend';
                msgStructRet['MsgDesc'] = 'Send';
                msgStructRet['FromAddress'] = message.from_address;
                msgStructRet['ToAddress'] = message.to_address;
                msgStructRet['Amount'] = coinsListToFormatedText(message.amount);
            }
            
            if(message instanceof MsgAggregateExchangeRateVote) {
                msgStructRet['MsgType'] = 'MsgAggregateExchangeRateVote';
                msgStructRet['MsgDesc'] = 'Aggregate Exchange Rate Vote';
                msgStructRet['Feeder'] = message.feeder;
                msgStructRet['Salt'] = message.salt;
                msgStructRet["ExchangeRates"] = exchangeRatesToFormatedText(message.exchange_rates);
                msgStructRet['ValidatorAddress'] = message.validator;
                msgStructRet['ValidatorMoniker'] = await getValidatorMoniker(lcd, message.validator);
            }

            if(message instanceof MsgAggregateExchangeRatePrevote) {
                msgStructRet['MsgType'] = 'MsgAggregateExchangeRatePrevote';
                msgStructRet['MsgDesc'] = 'Aggregate Exchange Rate Prevote';
                msgStructRet['Feeder'] = message.feeder;
                msgStructRet['Hash'] = message.hash;
                msgStructRet['ValidatorAddress'] = message.validator;
                msgStructRet['ValidatorMoniker'] = await getValidatorMoniker(lcd, message.validator);
            }

            if(message instanceof MsgVote) {
                msgStructRet['MsgType'] = 'MsgVote';
                msgStructRet['MsgDesc'] = 'Vote';
                msgStructRet['VoteChoice'] = message.option;
                msgStructRet['ProposalID'] = message.proposal_id;
                msgStructRet['VoterAddress'] = message.voter;
                const possibleValidator = await findValidatorInfosIfThisIsHisAccount(lcd, message.voter);
                if(possibleValidator) {
                    msgStructRet['ValidatorAddress'] = possibleValidator[0];
                    msgStructRet['ValidatorMoniker'] = possibleValidator[1];
                }
            }

            if(message instanceof MsgWithdrawDelegatorReward) {
                msgStructRet['MsgType'] = 'MsgWithdrawDelegatorReward';
                msgStructRet['MsgDesc'] = 'Withdraw Delegator Reward';
                msgStructRet['DelegatorAddress'] = message.delegator_address;
                msgStructRet['ValidatorAddress'] = message.validator_address;
                msgStructRet['ValidatorMoniker'] = await getValidatorMoniker(lcd, message.validator_address);

                let rewards = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_rewards", "amount");
                rewards = formatGluedAmountsAndCoins(rewards);
                msgStructRet['withdrawRewards'] = rewards;
            }

            if(message instanceof MsgWithdrawValidatorCommission) {
                msgStructRet['MsgType'] = 'MsgWithdrawValidatorCommission';
                msgStructRet['MsgDesc'] = 'Withdraw Validator Commission';
                msgStructRet['ValidatorAddress'] = message.validator_address;
                msgStructRet['ValidatorMoniker'] = await getValidatorMoniker(lcd, message.validator_address);
                msgStructRet['ToAddress'] = AccAddress.fromValAddress(message.validator_address);

                let commission = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_commission", "amount");
                commission = formatGluedAmountsAndCoins(commission);
                msgStructRet['withdrawCommissions'] = commission;
            }

            if(message instanceof MsgExecuteContract) {
                msgStructRet['MsgType'] = 'MsgExecuteContract';
                msgStructRet['MsgDesc'] = 'Execute Contract';
                msgStructRet['Contract'] = message.contract;
                msgStructRet['Sender'] = message.sender;
                msgStructRet['Coins'] = coinsListToFormatedText(message.coins);
                msgStructRet['ExecuteMsg'] = message.execute_msg;
            }

            if(message instanceof MsgDelegate) {
                msgStructRet['MsgType'] = 'MsgDelegate';
                msgStructRet['MsgDesc'] = 'Delegate';
                msgStructRet['DelegatorAddress'] = message.delegator_address;
                msgStructRet['ValidatorAddress'] = message.validator_address;
                msgStructRet['ValidatorMoniker'] = await getValidatorMoniker(lcd, message.validator_address);
                msgStructRet['Amount'] = (message.amount.amount / 1000000).toFixed(6) + "\u00a0" + (tblCorrespondanceValeurs[message.amount.denom] ? tblCorrespondanceValeurs[message.amount.denom] : message.amount.denom);

                let rewards = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_rewards", "amount");
                rewards = formatGluedAmountsAndCoins(rewards);
                msgStructRet['withdrawRewards'] = rewards;
            }

            if(message instanceof MsgUndelegate) {
                msgStructRet['MsgType'] = 'MsgUndelegate';
                msgStructRet['MsgDesc'] = 'Undelegate';
                msgStructRet['DelegatorAddress'] = message.delegator_address;
                msgStructRet['ValidatorAddress'] = message.validator_address;
                msgStructRet['ValidatorMoniker'] = await getValidatorMoniker(lcd, message.validator_address);
                msgStructRet['Amount'] = (message.amount.amount / 1000000).toFixed(6) + "\u00a0" + (tblCorrespondanceValeurs[message.amount.denom] ? tblCorrespondanceValeurs[message.amount.denom] : message.amount.denom);

                let rewards = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_rewards", "amount");
                rewards = formatGluedAmountsAndCoins(rewards);
                msgStructRet['withdrawRewards'] = rewards;
            }

            if(message instanceof MsgBeginRedelegate) {
                msgStructRet['MsgType'] = 'MsgBeginRedelegate';
                msgStructRet['MsgDesc'] = 'Begin Redelegate';
                msgStructRet['DelegatorAddress'] = message.delegator_address;
                msgStructRet['SrcValidatorAddress'] = message.validator_src_address;
                msgStructRet['SrcValidatorMoniker'] = await getValidatorMoniker(lcd, message.validator_src_address);
                msgStructRet['DstValidatorAddress'] = message.validator_dst_address;
                msgStructRet['DstValidatorMoniker'] = await getValidatorMoniker(lcd, message.validator_dst_address);
                msgStructRet['Amount'] = (message.amount.amount / 1000000).toFixed(6) + "\u00a0" + (tblCorrespondanceValeurs[message.amount.denom] ? tblCorrespondanceValeurs[message.amount.denom] : message.amount.denom);

                let rewards = findInTblLogEvents(rawTxInfo.logs[i].events, "withdraw_rewards", "amount");
                rewards = formatGluedAmountsAndCoins(rewards);
                msgStructRet['withdrawRewards'] = rewards;
            }

            if(message instanceof MsgSubmitProposal) {
                msgStructRet['MsgType'] = 'MsgSubmitProposal';
                msgStructRet['MsgDesc'] = 'Submit Proposal';
                msgStructRet['Proposer'] = message.proposer;
                msgStructRet['InitialDeposit'] = coinsListToFormatedText(message.initial_deposit);
                msgStructRet['ContentTitle'] = message.content.title;
                msgStructRet['ContentDescription'] = message.content.description;
                msgStructRet['ProposalID'] = findInTblLogEvents(rawTxInfo.logs[i].events, "proposal_deposit", "proposal_id")[0];
            }

            if(message instanceof MsgDeposit) {
                msgStructRet['MsgType'] = 'MsgDeposit';
                msgStructRet['MsgDesc'] = 'Deposit';
                msgStructRet['Depositor'] = message.depositor;
                msgStructRet['ProposalID'] = message.proposal_id;
                msgStructRet['Amount'] = coinsListToFormatedText(message.amount);
            }

            if(message instanceof MsgFundCommunityPool) {
                msgStructRet['MsgType'] = 'MsgFundCommunityPool';
                msgStructRet['MsgDesc'] = 'Fund Community Pool';
                msgStructRet['Depositor'] = message.depositor;
                msgStructRet['Amount'] = coinsListToFormatedText(message.amount);
                msgStructRet['Recipient'] = findInTblLogEvents(rawTxInfo.logs[i].events, "transfer", "recipient")[0];
            }

            if(message instanceof MsgUpdateClient) {
                msgStructRet['MsgType'] = 'MsgUpdateClient';
                msgStructRet['MsgDesc'] = 'Update Client';
                msgStructRet['Signer'] = message.signer;
                msgStructRet['ClientID'] = message.client_id;
                msgStructRet['Header'] = message.header;
            }
            
            if(message instanceof MsgAcknowledgement) {
                msgStructRet['MsgType'] = 'MsgAcknowledgement';
                msgStructRet['MsgDesc'] = 'Acknowledgement';
                msgStructRet['Signer'] = message.signer;
                msgStructRet['Acknowledgement'] = message.acknowledgement;
                msgStructRet['ProofAcked'] = message.proof_acked;
                msgStructRet['Packet'] = message.packet;
                msgStructRet['ProofHeight'] = message.proof_height;
            }

            if(message instanceof MsgExecAuthorized) {
                msgStructRet['MsgType'] = 'MsgExecAuthorized';
                msgStructRet['MsgDesc'] = 'Exec Authorized';
                msgStructRet['Grantee'] = message.grantee;
                msgStructRet['Msgs'] = message.msgs;
            }

            if(message instanceof MsgInstantiateContract) {
                msgStructRet['MsgType'] = 'MsgInstantiateContract';
                msgStructRet['MsgDesc'] = 'Instantiate Contract';
                msgStructRet['Admin'] = message.admin;
                msgStructRet['CodeID'] = message.code_id;
                msgStructRet['InitCoins'] = coinsListToFormatedText(message.init_coins);
                msgStructRet['InitMsg'] = message.init_msg;
                msgStructRet['Label'] = message.label;
                msgStructRet['Sender'] = message.sender;
            }

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
    const dataCoinsList = (new Coins(coinsList)).toData();
    let retour = "";
    
    if(dataCoinsList.length > 0) {
        for(let i=0 ; i < dataCoinsList.length ; i++) {
            const msgAmount = (dataCoinsList[i].amount/1000000).toFixed(6);
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


// ==========================================================================================
// Récupère le 'moniker' (surnom) d'un validateur, à partir de son adresse "terravaloper1..."
// ==========================================================================================
const getValidatorMoniker = async (lcd, valAddress) => {
    const rawValInfos = await lcd.staking.validator(valAddress).catch(handleError);
    if(rawValInfos)
        return rawValInfos.description.moniker;
    else
        return 'unknown';
}

// ==========================================================================================================
// Récupère le "moniker" et l'adresse "terravaloper1..." d'un validateur, à partir de son adresse "terra1..."
// ==========================================================================================================
const findValidatorInfosIfThisIsHisAccount = async (lcd, cptAddress) => {
    const rawValidators = await lcd.staking.validators({'pagination.limit': '9999'}).catch(handleError);
    if(rawValidators) {
        for(let i=0 ; i<rawValidators[0].length ; i++)
            if(AccAddress.fromValAddress(rawValidators[0][i].operator_address) === cptAddress)
                return([rawValidators[0][i].operator_address, rawValidators[0][i].description.moniker]);
    } else
        return [];
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