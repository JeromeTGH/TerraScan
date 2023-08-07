import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';


export const getBlockDetail = async (blockNumber) => {
    
    const blockInfos = {
        'datetime': null,               // Date et heure du block en question
        'nbTransactions': null,         // Nombre de transactions incluses dans ce block
        'proposerAddress': null,        // Adresse "terravaloper1..." du proposer
        'proposerName': null            // Nom du validateur (proposer)
    }
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // // Récupération des infos de ce validateur
    // const rawValInfos = await lcd.staking.validator(valAddress).catch(handleError);
    // if(rawValInfos) {
    //     valInfos['moniker'] = rawValInfos.description.moniker;
    //     valInfos['website'] = rawValInfos.description.website;
    //     valInfos['email'] = rawValInfos.description.security_contact;
    //     valInfos['details'] = rawValInfos.description.details;
    //     valInfos['activeOrNot'] = rawValInfos.status === "BOND_STATUS_BONDED";
    //     valInfos['jailedOrNot'] = rawValInfos.jailed;
    // } else
    //     return { "erreur": "Failed to fetch [validator infos] ..." }
    

    // Envoi des infos en retour
    return blockInfos;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}