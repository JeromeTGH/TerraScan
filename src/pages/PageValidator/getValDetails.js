import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient, AccAddress } from '@terra-money/terra.js';
import Decimal from 'decimal.js';


export const getValDetails = async (valAddress) => {
    
    const valDetails = {
        'actual_commission_rate': 0,        // Taux de commission actuel
        'max_commission_rate': 0,           // Commission maximale que ce validateur peut prendre
        'max_change_commission_rate': 0,    // Varition de commission en pourcent et par jour, que ce validateur peut faire
        'nb_lunc_staked': 0,                // Nombre de LUNC stakés avec ce validateur
        'pourcentage_voting_power': 0,      // Nombre de % de droit de vote (% de lunc staké chez ce validateur, par rapport à la totalité stakée)
        'adresse_compte_validateur': '',    // Adresse "terra1..." liée à ce validateur
        'nb_lunc_self_bonded': 0,           // Nombre de LUNC stakés par ce validateur sur lui-même
        'pourcentage_self_bonding': 0,      // Nombre de % de LUNC self-bonded
        'nb_delegators': 0                  // Nombre de delegator pour ce validator (nombre de compte qui font du staking avec lui, donc)
    }

    // Variables
    let totalDelegatorShares = 0;
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération du montant total délégué par validateur (le nombre de LUNC stakés pour chacun d'entre eux, en fait)
    const rawValidators = await lcd.staking.validators({'pagination.limit': '9999', "status": "BOND_STATUS_BONDED"}).catch(handleError);
    if(rawValidators) {
        rawValidators[0].forEach((validateur) => {
            const delegatorShares = (new Decimal(validateur.delegator_shares)/1000000).toFixed(0);
            totalDelegatorShares += parseInt(delegatorShares);

            if(validateur.operator_address === valAddress) {
                valDetails['actual_commission_rate'] = (new Decimal(validateur.commission.commission_rates.rate)*100).toFixed(0);
                valDetails['max_commission_rate'] = (new Decimal(validateur.commission.commission_rates.max_rate)*100).toFixed(0);
                valDetails['max_change_commission_rate'] = (new Decimal(validateur.commission.commission_rates.max_change_rate)*100).toFixed(0);
                valDetails['nb_lunc_staked'] = (new Decimal(validateur.delegator_shares)/1000000).toFixed(6);
                valDetails['adresse_compte_validateur'] = AccAddress.fromValAddress(valAddress)
            }

        })
    } else
        return { "erreur": "Failed to fetch [validators list] ..." }


    // Récupère le total de LUNC délégués, par le validateur lui-même
    const rawDelegation = await lcd.staking.delegation(valDetails['adresse_compte_validateur'], valAddress).catch(handleError);
    if(rawDelegation) {
        valDetails['nb_lunc_self_bonded'] = (new Decimal(rawDelegation.shares)/1000000).toFixed(6);
    } else
        return { "erreur": "Failed to fetch [account delegation] ..." }


    // Récupère le nombre total de delegators qu'il a
    const rawDelegations = await lcd.staking.delegations(undefined, valAddress, {'pagination.limit': '99999'}).catch(handleError);
    if(rawDelegations) {
        valDetails['nb_delegators'] = rawDelegations[0].length;
    } else
        return { "erreur": "Failed to fetch [delegations] ..." }



    
    // Calcul de pourcentages
    valDetails['pourcentage_voting_power'] = (valDetails['nb_lunc_staked'] / totalDelegatorShares * 100).toFixed(2);
    valDetails['pourcentage_self_bonding'] = (valDetails['nb_lunc_self_bonded'] / valDetails['nb_lunc_staked'] * 100).toFixed(2);


    // Envoi des infos en retour
    return valDetails;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}