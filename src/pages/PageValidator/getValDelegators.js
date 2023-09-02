import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';
import Decimal from 'decimal.js';


export const getValDelegators = async (valAddress) => {
    
    const nbMaxValidateursAretourner = 50;
    const valDelegators = [];

    // Variables
    // let nbStakers = 0;
    let totalOfStakedLUNC = 0;

    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupère le nombre total de delegators qu'il a
    const rawDelegations = await lcd.staking.delegations(undefined, valAddress, {'pagination.limit': '99999'}).catch(handleError);
    if(rawDelegations) {
        // nbStakers = rawDelegations[0].length;
        rawDelegations[0].forEach(element => {
            const amountOfLUNCstaked = parseFloat((new Decimal(element.balance.amount)/1000000).toFixed(6));
            valDelegators.push([element.delegator_address, amountOfLUNCstaked, 0]);
            totalOfStakedLUNC += amountOfLUNCstaked;
        })
    } else
        return { "erreur": "Failed to fetch [delegations] from blockchain LCD ..." }


    // Triage par "delegator shares"
    valDelegators.sort(function(a, b) { return b[1] - a[1]; })
    
    
    // Ajout des pourcentages
    valDelegators.forEach(element => {
        element[2] = ((element[1] / totalOfStakedLUNC) * 100).toFixed(2);
        element[1] = element[1].toFixed(6);
    })
    
    
    // Limitation du nombre de lignes retournées
    if(valDelegators.length > nbMaxValidateursAretourner)
        return valDelegators.slice(0, nbMaxValidateursAretourner);
    else
        return valDelegators;
}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}