import { chainID, chainLCDurl, tblCorrespondanceValeurs } from '../../application/AppParams';
import { Coins, LCDClient, MsgSend } from '@terra-money/terra.js';


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
                'MsgType': null,            // Type de message (MsgSend, MsgDelegate, ...)
                'MsgDesc': null,            // Type de message (Send, Delegate, ...)
                'FromAddress': null,        // Provenant de cette adresse
                'ToAddress': null,          // Allant vers cette adresse
                'Amount': null,             // Montant ([qté + nom de la devise])
            }
            
            if(message instanceof MsgSend) {
                msgStructRet['MsgType'] = 'MsgSend';
                msgStructRet['MsgDesc'] = 'Send';
                msgStructRet['FromAddress'] = message.from_address;
                msgStructRet['ToAddress'] = message.to_address;
                msgStructRet["Amount"] = amountToArray(message.amount);
            }
            












            txMessages.push(msgStructRet);
        }



        // console.log("rawTxInfo", rawTxInfo);

    } else
        return { "erreur": "Failed to fetch [tx infos] ..." } 


    // Envoi des infos en retour
    return {'txInfos': txInfos, 'txMessages': txMessages};
}


const handleError = (err) => {
    console.log("ERREUR", err);
}


const amountToArray = (messageAmount) => {
    const dataMsgAmount = (new Coins(messageAmount)).toData();
    const tblAmounts = [];
    
    if(dataMsgAmount.length > 0) {
        for(let i=0 ; i < dataMsgAmount.length ; i++) {
            const msgAmount = (dataMsgAmount[i].amount/1000000).toFixed(6);
            const msgCoin = tblCorrespondanceValeurs[dataMsgAmount[i].denom] ? tblCorrespondanceValeurs[dataMsgAmount[i].denom] : dataMsgAmount[i].denom;
            tblAmounts.push(msgAmount + "\u00a0" + msgCoin);
        }
    } else {
        tblAmounts.push("---");
    }

    return tblAmounts;
}