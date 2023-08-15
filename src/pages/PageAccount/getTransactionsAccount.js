import { metEnFormeDateTime } from "../../application/AppUtils";
import { FCDclient } from "../../fcd/FCDclient";


export const getTransactionsAccount = async (accountAddress) => {
    
    // Variables
    const tblTransactions = [];
    
    // Instanciation FCD
    const FCDurl = 'https://terra-classic-fcd.publicnode.com';
    const fcd = new FCDclient(FCDurl);

    // Préparation de la requête
    const params = new URLSearchParams();
    params.append('offset', 0);
    params.append('account', accountAddress);

    // Récupération des 100 dernières transactions
    const rawTxs = await fcd.account.txs(params).catch(handleError);
    if(rawTxs) {
        // console.log(rawTxs);
        if(rawTxs.txs) {
            rawTxs.txs.forEach(element => {
                const datetime = metEnFormeDateTime(element.timestamp);
                const txHash = element.txhash;
                const txHeight = element.height;
                const msgs = element.tx.value.msg;
                let msgType = '';
                if(msgs.length === 0)
                    msgType = 'Nothing';
                else if(msgs.length > 1)
                    msgType = 'Multiple (' + msgs.length + ')';
                else {
                    const msgTxtBrut = msgs[0].type;
                    const msgTxtSeul = msgTxtBrut.split("/")[1];
                    msgType = msgTxtSeul.replace('Msg', '');
                }
                const errorCode = element.code ? element.code : 0;
                tblTransactions.push([datetime, txHash, txHeight, msgType, errorCode]);
            })
        }
    } else
        return { "erreur": "Failed to fetch [txs] ..." }


    // Renvoie du tableau
    return tblTransactions;

}


const handleError = (err) => {
    console.log("ERREUR", err);
}