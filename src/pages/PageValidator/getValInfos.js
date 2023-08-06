import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';


export const getValInfos = async (valAddress) => {
    
    const valInfos = {
        'moniker': '',                  // Surnom
        'website': '',                  // Site web communiqué par le validateur, tel qu'indiqué dans sa "fiche"
        'email': '',                    // Email du validateur, tel qu'indiqué dans sa "fiche"
        'details': '',                  // Infos communiquées par le validateur, dans sa "fiche"
        'activeOrNot': false,           // Flag indiquant si ce validateur est actif ou non (status "bonded" ou "unbonded", pris en compte ici)
        'jailedOrNot': false            // Flag indiquant si ce validateur est "emprisonné" ou non
    }
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération des infos de ce validateur
    const rawValInfos = await lcd.staking.validator(valAddress).catch(handleError);
    if(rawValInfos) {
        valInfos['moniker'] = rawValInfos.description.moniker;
        valInfos['website'] = rawValInfos.description.website;
        valInfos['email'] = rawValInfos.description.security_contact;
        valInfos['details'] = rawValInfos.description.details;
        valInfos['activeOrNot'] = rawValInfos.status === "BOND_STATUS_BONDED";
        valInfos['jailedOrNot'] = rawValInfos.jailed;
    } else
        return { "erreur": "Failed to fetch [validator infos] ..." }
    

    // Envoi des infos en retour
    return valInfos;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}