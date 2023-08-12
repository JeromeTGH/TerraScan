import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';


export const getProposals = async () => {

    const tblProposals = [];

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération de toutes les propositions
    const rawDeposals = await lcd.gov.proposals({'pagination.limit': '9999'}).catch(handleError);
    if(rawDeposals)
        tblProposals.push(...rawDeposals[0].reverse());
    else
        return { "erreur": "Failed to fetch [proposals] ..." }
    

    // Envoi des infos en retour
    return tblProposals;
}


// ===========================
// Log les éventuelles erreurs
// ===========================
const handleError = (err) => {
    console.log("ERREUR", err);
}
