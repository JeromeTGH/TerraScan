import { LCDClient } from '@terra-money/terra.js';
import { chainID, chainLCDurl } from '../application/AppParams';
import Decimal from 'decimal.js';

export const getValidators = async () => {

    // Variables de retour
    const tblValidateurs = [];
    let totalDelegatorShares = 0;

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    // Récupération des tous les validateurs "actifs" (ayant le status "bonded", donc)
    const rawValidators = await lcd.staking.validators({'pagination.limit': '9999', "status": "BOND_STATUS_BONDED"}).catch(handleError);
    if(rawValidators) {
        rawValidators[0].forEach((validateur) => {

            const valCommissionRate = parseInt((new Decimal(validateur.commission.commission_rates.rate)).toFixed(2) * 100);    // *100 pour mettre en pourcentage
            const delegatorShares = (new Decimal(validateur.delegator_shares)/1000000).toFixed(0);
            totalDelegatorShares += parseInt(delegatorShares);

            tblValidateurs.push([
                validateur.description.moniker,         // name
                validateur.operator_address,            // terravaloper1...
                valCommissionRate,
                delegatorShares,
                0
            ])

        })
    } else
        return { "erreur": "Failed to fetch [validators list] ..." }

    // Ajout du voting power (calcul à la volée)
    for(let i=0 ; i<tblValidateurs.length ; i++) {
        const ratio = tblValidateurs[i][3] / totalDelegatorShares * 100;
        // if(ratio >= 0.01)
            tblValidateurs[i][4] = ratio.toFixed(2);
        // else if(ratio >= 0.001)
        //     tblValidateurs[i][4] = ratio.toFixed(3);
        // else
        //     tblValidateurs[i][4] = ratio.toFixed(4);
    }


    // Triage par "delegator shares"
    tblValidateurs.sort(function(a, b) { return b[3] - a[3]; })

    // Et envoie du tableau
    return tblValidateurs;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}