
import { LCDclient } from '../../lcd/LCDclient';
// import { tblCorrespondanceValeurs } from '../../application/AppParams';
// import { tblValidators } from '../../application/AppData';


export const getUndelegations = async (accountAddress) => {

    // Préparation du tableau réponse en retour
    const tblRetour = [];

    // Récupération instance LCD
    const client_lcd = LCDclient.getSingleton();

    // Récupération des delegations de ce compte
    const rawUndelegations = await client_lcd.staking.getUndelegations(accountAddress).catch(handleError);
    if(rawUndelegations?.data) {
        console.log("rawUndelegations.data", rawUndelegations.data);
        // if(rawDelegations.data.delegation_responses) {
        //     for(const delegation of rawDelegations.data.delegation_responses) {
        //         if(delegation.balance.amount > 0)
        //             tblRetour.push({
        //                 amountStaked: delegation.balance.amount/1000000,
        //                 valoperAddress: delegation.delegation.validator_address,
        //                 valMoniker: tblValidators[delegation.delegation.validator_address].description_moniker,
        //                 rewards: []
        //             })
        //     }
        // } else
        //     return { "erreur": "Failed to fetch [data.delegation_responses] from LCD response, sorry" }
    } else
        return { "erreur": "Failed to fetch [undelegations] from LCD, sorry" }




    // Si aucune erreur ne s'est produite, alors on renvoie le tableau complété
    return tblRetour;
}



const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}