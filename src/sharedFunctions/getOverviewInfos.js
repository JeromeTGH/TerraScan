import { chainID, chainLCDurl } from '../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';
import Decimal from 'decimal.js';

export const getOverviewInfos = async () => {

    // Tableau à retourner
    const tblAretourner = {
        "LuncTotalSupply": null,
        "LuncBonded": null,
        "UnbondingTime": null,
        "NbMaxValidators": null,
        "NbBondedValidators": null
    }

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    // Récupération de la "total supply" du LUNC
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

    // Récupération du nombre de LUNC stakés (bonded)
    const rawStakingPool = await lcd.staking.pool().catch(handleError);
    if(rawStakingPool) {
        const bondedTokens = (new Decimal(rawStakingPool.bonded_tokens.amount)).toFixed(0);
        tblAretourner['LuncBonded'] = parseInt(bondedTokens/1000000);
    } else
        return { "erreur": "Failed to fetch [staking pool] ..." }

    // Récupération des paramètres du module Staking (plus exactement : l'unbonding_time, et le max_validators)
    const rawStakingParameters = await lcd.staking.parameters().catch(handleError);
    if(rawStakingParameters) {
        tblAretourner['UnbondingTime'] = rawStakingParameters.unbonding_time / 3600 / 24;       // Transformation nbSecondes --> nbJours
        tblAretourner['NbMaxValidators'] = rawStakingParameters.max_validators;
    } else
        return { "erreur": "Failed to fetch [staking parameters] ..." }

    // Récupération
    const rawValidators = await lcd.staking.validators({'pagination.limit': 9999, "status": "BOND_STATUS_BONDED"}).catch(handleError);
    if(rawValidators) {
        tblAretourner['NbBondedValidators'] = rawValidators[0].length
    } else
        return { "erreur": "Failed to fetch [validators] ..." }


    // Renvoie du tableau global/rempli, à la fin
    return tblAretourner;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}
