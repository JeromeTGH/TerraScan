import { chainID, chainLCDurl } from '../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';
import { metEnFormeGrandNombre } from '../application/AppUtils';

export const getOverviewInfos = async () => {

    // Tableau à retourner
    const tblAretourner = {
        "LuncTotalSupply": null
    }

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    // Récupère la "total supply" du LUNC
    const rawTotalSupplies = await lcd.bank.total({'pagination.limit': 9999}).catch(handleError);
    if(rawTotalSupplies) {
        const lstTotalSupplies = (new Coins(rawTotalSupplies[0])).toData();
        const idxLunc = lstTotalSupplies.findIndex(element => element.denom === "uluna");

        if(idxLunc >= 0) {
            tblAretourner['LuncTotalSupply'] = metEnFormeGrandNombre(parseInt(lstTotalSupplies[idxLunc].amount/1000000), 3);
        } else
            return { "erreur": "Failed to fetch [LUNC total supply] ..." }
    } else
        return { "erreur": "Failed to fetch [total supplies] ..." }







    // Retourne tableau à la fin
    return tblAretourner;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}
