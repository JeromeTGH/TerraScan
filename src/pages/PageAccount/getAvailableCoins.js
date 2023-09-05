
import { LCDclient } from '../../lcd/LCDclient';
import { tblCorrespondanceValeurs } from '../../application/AppParams';


export const getAvailableCoins = async (accountAddress) => {

    // Préparation du tableau réponse en retour
    const tblRetour = [];

    // Récupération de la balance de ce compte
    const client_lcd = LCDclient.getSingleton();
    const rawAccountDetails = await client_lcd.bank.getAccountDetails(accountAddress).catch(handleError);

    if(rawAccountDetails?.data) {
        if(rawAccountDetails.data.balances) {
            // Enregistrement des coins, dans l'ordre de la liste (LUNC, USTC, puis les autres)
            for(const [denom, coinName] of Object.entries(tblCorrespondanceValeurs)) {
                const idxCoin = rawAccountDetails.data.balances.findIndex(element => element.denom === denom);
                if(idxCoin > -1)
                    tblRetour.push({
                        amount: (rawAccountDetails.data.balances[idxCoin].amount / 1000000).toFixed(6),
                        denom: coinName
                    })
                else
                    tblRetour.push({
                        amount: "0.000000",
                        denom: coinName
                    })
            }
        } else
            return { "erreur": "Failed to fetch [data.balances] from LCD response, sorry" }
    } else
        return { "erreur": "Failed to fetch [account balance] from LCD, sorry" }


    // Si aucune erreur ne s'est produite, alors on renvoie le tableau complété
    return tblRetour;
}



const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}