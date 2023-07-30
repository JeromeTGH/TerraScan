import { chainID, chainLCDurl } from '../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';
import Decimal from 'decimal.js';

export const getOverviewInfos = async () => {

    // Tableau à retourner
    const tblAretourner = {
        "LuncTotalSupply": null,
        "LuncBonded": null
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
            tblAretourner['LuncTotalSupply'] = parseInt(lstTotalSupplies[idxLunc].amount/1000000);
        } else
            return { "erreur": "Failed to fetch [LUNC total supply] ..." }
    } else
        return { "erreur": "Failed to fetch [total supplies] ..." }

    // Récupère le nombre de LUNC stakés (bonded)
    const rawStakingPool = await lcd.staking.pool().catch(handleError);
    if(rawStakingPool) {
        const bondedTokens = (new Decimal(rawStakingPool.bonded_tokens.amount)).toFixed(0);
        tblAretourner['LuncBonded'] = parseInt(bondedTokens/1000000);
    } else
        return { "erreur": "Failed to fetch [staking pool] ..." }





    // Retourne tableau à la fin
    return tblAretourner;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}
