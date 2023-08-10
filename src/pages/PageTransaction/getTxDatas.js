import { chainID, chainLCDurl, tblCorrespondanceValeurs } from '../../application/AppParams';
import { AccAddress, Coins, LCDClient, MsgAggregateExchangeRatePrevote, MsgAggregateExchangeRateVote, MsgSend, MsgVote } from '@terra-money/terra.js';


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
            console.log("message", message);

            const msgStructRet = {
                'MsgType': null,                // Type de message (MsgSend, MsgDelegate, ...)
                'MsgDesc': '(not coded yet)',   // Sera remplacé par "Send", "Delegate", ..., selon le type de message
                'FromAddress': null,            // Provenant de cette adresse
                'ToAddress': null,              // Allant vers cette adresse
                'Amount': null,                 // Montant ([qté + nom de la devise])
                'Feeder': null,                 // Feeder
                'ValidatorAddress': null,       // Adresse "terravaloper1..." du validateur en question
                'ValidatorMoniker': null,       // Nom du validateur
                'ExchangeRates': null,          // Exchange rates
                'Hash': null,                   // Hash value
                'VoteChoice': null,             // Choix de vote (YES, ABSTAIN, NO, NO WITH VETO)
                'ProposalID': null,             // Numéro de proposition à voter
                'VoterAddress': null,           // Adresse "terra1" du votant
            }
            
            if(message instanceof MsgSend) {
                msgStructRet['MsgType'] = 'MsgSend';
                msgStructRet['MsgDesc'] = 'Send';
                msgStructRet['FromAddress'] = message.from_address;
                msgStructRet['ToAddress'] = message.to_address;
                msgStructRet["Amount"] = coinsListToFormatedText(message.amount);
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







            txMessages.push(msgStructRet);
        }

    } else
        return { "erreur": "Failed to fetch [tx infos] ..." } 


    // Envoi des infos en retour
    return {'txInfos': txInfos, 'txMessages': txMessages};
}


const handleError = (err) => {
    console.log("ERREUR", err);
}


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

const getValidatorMoniker = async (lcd, valAddress) => {
    // Récupération des infos de ce validateur
    const rawValInfos = await lcd.staking.validator(valAddress).catch(handleError);
    if(rawValInfos)
        return rawValInfos.description.moniker;
    else
        return 'unknown';
}

const findValidatorInfosIfThisIsHisAccount = async (lcd, cptAddress) => {
    // Récupération de la liste de tous les validateurs, et recherche de correspondance à l'intérieur
    const rawValidators = await lcd.staking.validators({'pagination.limit': '9999'}).catch(handleError);
    if(rawValidators) {
        for(let i=0 ; i<rawValidators[0].length ; i++)
            if(AccAddress.fromValAddress(rawValidators[0][i].operator_address) === cptAddress)
                return([rawValidators[0][i].operator_address, rawValidators[0][i].description.moniker]);
    } else
        return [];
}