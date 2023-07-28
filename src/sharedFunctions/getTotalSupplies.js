import { Coins, LCDClient } from '@terra-money/terra.js';
import { formateLeNombre } from '../application/AppUtils';
import { chainID, chainLCDurl, tblCorrespondanceValeurs } from '../application/AppParams';

export const getTotalSupplies = async (qte) => {

    // Variables de retour
    const tblCoinsMajeurs = [];
    const tblCoinsMineurs = [];

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    // Récupération des total supplies
    const totalSupplies = await lcd.bank.total({'pagination.limit': 9999}).catch(handleError);
    if(totalSupplies) {
        const lstCoinsWithTotalSupplies = (new Coins(totalSupplies[0])).toData();

        // Récupération de la total supply pour le LUNC
        const idxLunc = lstCoinsWithTotalSupplies.findIndex(element => element.denom === "uluna");
        if(idxLunc >= 0)
            tblCoinsMajeurs.push(['LUNC', formateLeNombre(parseInt(lstCoinsWithTotalSupplies[idxLunc].amount/1000000), " ")]);
        else
            return { "erreur": "Failed to fetch [LUNC total supply] ..." }

        // Récupération de la total supply pour le LUNC
        const idxUstc = lstCoinsWithTotalSupplies.findIndex(element => element.denom === "uusd");
        if(idxLunc >= 0)
            tblCoinsMajeurs.push(['USTC', formateLeNombre(parseInt(lstCoinsWithTotalSupplies[idxUstc].amount/1000000), " ")]);
        else
            return { "erreur": "Failed to fetch [USTC total supply] ..." }

        // Récupération des total supplies des coins restants
        lstCoinsWithTotalSupplies.forEach((element) => {
            if(tblCorrespondanceValeurs[element.denom]) {
                if(element.denom !== 'uluna' && element.denom !== 'uusd') {
                    tblCoinsMineurs.push([tblCorrespondanceValeurs[element.denom], formateLeNombre(parseInt(element.amount/1000000), " ")]);
                }
            }
        })

        // Retour des 2 tableaux (coins "majeurs", et coins "mineurs")
        return [tblCoinsMajeurs, tblCoinsMineurs];

    } else
        return { "erreur": "Failed to fetch [total supplies] ..." }

}


const handleError = (err) => {
    console.log("ERREUR", err);
}