import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';


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


    // Récupération de la liste de tous les validateurs (pour récupérer leur nom et leur statut, en fait)
    const rawValidators = await lcd.staking.validators({'pagination.limit': '9999'}).catch(handleError);
    if(rawValidators) {
        tblDelegations.forEach(element => {
            const idxValidator = rawValidators[0].findIndex(val => val.operator_address === element[0]);
            if(idxValidator > -1) {
                element[1] = rawValidators[0][idxValidator].description.moniker;
                const bondedState = rawValidators[0][idxValidator].status;
                const jailedState = rawValidators[0][idxValidator].jailed;

                if(jailedState)
                    element[2] = 'Jailed';
                else
                    if(bondedState === "BOND_STATUS_BONDED")
                        element[2] = 'Active';
                    else
                        element[2] = 'Inactive';
            }
        })

    } else
        return { "erreur": "Failed to fetch [validators list] ..." }


    // Calcul des % d'allocation de lunc (sur chaque validateur, par rapport au montant total stacké)
    tblDelegations.forEach((element, index) => {
        element[4] = (element[3] / totalDelegatedLunc * 100).toFixed(2);
    })

    // Triage par nombre de LUNC stakés
    tblDelegations.sort(function(a, b) { return b[3] - a[3]; })

    // Envoi des infos en retour
    return tblDelegations;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}