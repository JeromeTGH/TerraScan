
import { tblCorrespondanceValeurs } from '../../application/AppParams';
import { FCDclient } from '../../fcd/FCDclient';


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
                let msgAmount = '';
                let msgUnit = '';
                if(messages.length === 0)
                    msgType = 'Nothing';
                else if(messages.length === 1) {
                    msgType = messages[0].type.split('/')[1];
                    if(messages[0].value?.amount) {
                        if(Array.isArray(messages[0].value.amount)) {
                            if(messages[0].value.amount.length === 1) {
                                msgAmount = (messages[0].value.amount[0].amount/1000000).toFixed(6);
                                msgUnit = tblCorrespondanceValeurs[messages[0].value.amount[0].denom] ? tblCorrespondanceValeurs[messages[0].value.amount[0].denom] : messages[0].value.amount[0].denom;
                            }
                        } else {
                            if(messages[0].value.amount?.amount && messages[0].value.amount?.denom) {
                                msgAmount = (messages[0].value.amount.amount/1000000).toFixed(6);
                                msgUnit = tblCorrespondanceValeurs[messages[0].value.amount.denom] ? tblCorrespondanceValeurs[messages[0].value.amount.denom] : messages[0].value.amount.denom;
                            }
                        }
                    }
                } else 
                    msgType = 'Multiple (' + messages.length + ' messages)';

                    tblRetour.push({
                        datetime: txDatetime,
                        msgType: msgType,
                        errorCode: txCode,
                        amount: msgAmount,
                        unit: msgUnit,
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