
import { tblCorrespondanceValeurs } from '../../application/AppParams';
import { FCDclient } from '../../apis/fcd/FCDclient';


export const getTransactions = async (accountAddress) => {

    // Préparation du tableau réponse en retour
    const tblRetour = [];

    // Instanciation FCD
    const fcd = FCDclient.getSingleton();

    // Préparation de la requête
    const params = new URLSearchParams();
    params.append('offset', 0);
    params.append('account', accountAddress);

    // Récupération des undelegations de ce compte
    const rawTransactions = await fcd.tx.getAccountTxs(params).catch(handleError);
    if(rawTransactions?.data) {
        if(rawTransactions.data.txs) {
            // console.log(rawTransactions.data.txs);

            for(const transaction of rawTransactions.data.txs) {
                const txHash = transaction.txhash;
                const txCode = transaction.code ? transaction.code : 0;     // = 0 si tout s'est bien passé
                const txDatetime = transaction.timestamp;
                const messages = transaction.tx.value.msg;      // Liste de tous les messages que contient cette transaction
                
                let msgType = '';
                let txtAdd = '';
                let msgAmount = '';
                let msgUnit = '';
                let msgSign = '';
                if(messages.length === 0)
                    msgType = 'Nothing';
                else if(messages.length === 1) {
                    msgType = messages[0].type.split('/')[1];
// console.log("messages[0]", messages[0]); 
                    if(msgType === 'MsgSend' && messages[0].value?.to_address) {
                        if(messages[0].value.to_address === "terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu") {   // Burn wallet
                            txtAdd = "(to burn wallet)";
                        }
                    }
                    if(messages[0].value?.amount) {
                        if(Array.isArray(messages[0].value.amount)) {
                            if(messages[0].value.amount.length === 1) {
                                msgAmount = (messages[0].value.amount[0].amount/1000000).toFixed(6);
                                msgUnit = tblCorrespondanceValeurs[messages[0].value.amount[0].denom] ? tblCorrespondanceValeurs[messages[0].value.amount[0].denom] : messages[0].value.amount[0].denom;
                                msgSign = messages[0].value.from_address === accountAddress ? '-' : '';
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

                    tblRetour.push({
                        datetime: txDatetime,
                        msgType: msgType,
                        txtAdd: txtAdd,
                        errorCode: txCode,
                        amount: msgAmount,
                        unit: msgUnit,
                        sign: msgSign,
                        txHash: txHash
                    });
            }
        }
    } else
        return { "erreur": "Failed to fetch [transactions] from FCD, sorry" }


    // Si aucune erreur ne s'est produite, alors on renvoie le tableau complété
    return tblRetour;
}



const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}