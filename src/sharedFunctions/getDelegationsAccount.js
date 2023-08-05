import { chainID, chainLCDurl } from '../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';
import Decimal from 'decimal.js';


export const getDelegationsAccount = async (accountAddress) => {
    
    // Variables
    const tblDelegations = [];
    let totalDelegatedLunc = 0;
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    
    // Récupération des délégations de ce compte
    const rawDelegationsForThisAccount = await lcd.staking.delegations(accountAddress).catch(handleError);
    if(rawDelegationsForThisAccount) {
        // console.log("rawDelegationsForThisAccount", rawDelegationsForThisAccount);
        rawDelegationsForThisAccount[0].forEach(element => {
            tblDelegations.push([
                element.validator_address,                                  // Validator address
                "(unknown)",                                                // Validator name
                "(status)",                                                 // Validator status (active / jailed)
                (element.balance.amount/1000000).toFixed(6),                // Total of staked LUNC on this validator
                -1                                                          // Percentage of total LUNC delegated
            ]);
            totalDelegatedLunc += element.balance.amount/1000000;
        });
    } else
        return { "erreur": "Failed to fetch [delegations infos] ..." }


    // Calcul des % d'allocation de lunc (sur chaque validateur, par rapport au montant total stacké)
    tblDelegations.forEach((element, index) => {
        element[4] = (element[3] / totalDelegatedLunc * 100).toFixed(2);
    })



    // Envoi des infos en retour
    return tblDelegations;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}