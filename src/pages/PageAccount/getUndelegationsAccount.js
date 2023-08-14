import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';


export const getUndelegationsAccount = async (accountAddress) => {
    
    // Variables
    const tblUndelegations = [];
    let totalUndelegatedLunc = 0;
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    
    // Récupération des undelegations de ce compte
    const rawUndelegationsForThisAccount = await lcd.staking.unbondingDelegations(accountAddress).catch(handleError)


    if(rawUndelegationsForThisAccount) {
        rawUndelegationsForThisAccount[0].forEach(element => {
            let totalValUndelegations = 0;
            let dateTimeCompletion = null;
            element.entries.forEach(entry => {
                totalValUndelegations += parseInt(entry.balance.toString());
                dateTimeCompletion = entry.completion_time;
            })

            tblUndelegations.push([
                element.validator_address,                                  // Validator address
                "(unknown)",                                                // Validator name
                "(status)",                                                 // Validator status (active / jailed)
                (totalValUndelegations/1000000).toFixed(6),                 // Total of unstaked LUNC on this validator
                -1,                                                         // Percentage of total LUNC undelegated
                dateTimeCompletion                                          // Date de libération des fonds
            ]);
            totalUndelegatedLunc += totalValUndelegations/1000000;
        });
    } else
        return { "erreur": "Failed to fetch [undelegations infos] ..." }


    // Récupération de la liste de tous les validateurs (pour récupérer leur nom et leur statut, en fait)
    const rawValidators = await lcd.staking.validators({'pagination.limit': '9999'}).catch(handleError);
    if(rawValidators) {
        tblUndelegations.forEach(element => {
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


    // Calcul des % d'allocation de lunc (sur chaque validateur, par rapport au montant total unstacké)
    tblUndelegations.forEach((element, index) => {
        element[4] = (element[3] / totalUndelegatedLunc * 100).toFixed(2);
    })

    // Triage par nombre de LUNC stakés
    tblUndelegations.sort(function(a, b) { return b[3] - a[3]; })

    // Envoi des infos en retour
    return tblUndelegations;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}