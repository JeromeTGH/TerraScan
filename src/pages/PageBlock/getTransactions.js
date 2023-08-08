import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient, hashToHex } from '@terra-money/terra.js';


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
                0,                      // Nb messages
                '',                     // Type de message : MsgSend, MsgVote, MsgDelegate, ...
                '',                     // "From" (dans les cas où çà s'applique, dirons nous !)
                ''                      // "To" (dans les cas où çà s'applique, dirons nous !)
            ])
        })
    } else
        return { "erreur": "Failed to fetch [block infos] ..." }
    

    // Récupération des infos sur une transaction donnée ****** TEST
    // const rawTxInfo = await lcd.tx.txInfo("3355B57C0CDA8F97690D1A40D9A6D28361FF4129B55281ADDA21E43654EC992B").catch(handleError);    
    // if(rawTxInfo) {
    //     console.log("rawTxInfo", rawTxInfo.tx.body.constructor.name);
    // } else
    //     return { "erreur": "Failed to fetch [transaction infos] ..." }


    for(let i=0 ; i<transactionsInfos.length ; i++) {
        const rawTxInfo = await lcd.tx.txInfo(transactionsInfos[i][0]).catch(handleError);
        if(rawTxInfo) {
            const nbMessages = rawTxInfo.tx.body.messages.length;
            transactionsInfos[i][1] = nbMessages;
            if(nbMessages === 0)
                transactionsInfos[i][2] = 'Error';
            else if(nbMessages === 1)
                transactionsInfos[i][2] = rawTxInfo.tx.body.messages[0].constructor.name;
            else
                transactionsInfos[i][2] = 'Multiple (' + nbMessages + ' messages)';
        } else
            return { "erreur": "Failed to fetch [transaction infos] ..." } 
    }



    // Envoi des infos en retour
    return transactionsInfos;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}