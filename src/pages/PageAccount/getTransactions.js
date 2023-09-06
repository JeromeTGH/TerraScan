
import { FCDclient } from '../../fcd/FCDclient';
// import { tblValidators } from '../../application/AppData';


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
        console.log(rawTransactions.data);

        if(rawTransactions.data.txs) {
            for(const transaction of rawTransactions.data.txs) {
                const txHash = transaction.hash;
                const txCode = transaction.code ? transaction.code : 0;     // = 0 si tout s'est bien passé
                const txDatetime = transaction.timestamp;
                const messages = transaction.tx.value.msg;      // Liste de tous les messages que contient cette transaction

                // for(const message of messages) {
                //     const msgType = message.type;       // Par ex : bank/MsgSend
                //     const tblCoins = message.value?.amount;
                // }
                
                let txMessage = '';
                let txAmount = '';
                if(messages.length === 0)
                    txMessage = 'Nothing';
                else if(messages.length > 1) {
                    txMessage = 'Multiple (' + messages.length + ' messages)';
                    txAmount = messages[0].amount ? messages[0].amount : '';
                } else 
                    txMessage = messages[0].type.split('/')[1];

            }
        }
    } else
        return { "erreur": "Failed to fetch [transactions] from FCD, sorry" }


    // // Tri des dates de release, de la plus proche à la plus lointaine
    // tblRetour.sort((a, b) => new Date(a.releaseDatetime) - new Date(b.releaseDatetime));

    // Si aucune erreur ne s'est produite, alors on renvoie le tableau complété
    return tblRetour;
}



const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}