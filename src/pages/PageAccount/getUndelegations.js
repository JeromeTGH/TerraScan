
import { LCDclient } from '../../lcd/LCDclient';
import { tblValidators } from '../../application/AppData';


export const getUndelegations = async (accountAddress) => {

    // Préparation du tableau réponse en retour
    const tblRetour = [];

    // Récupération instance LCD
    const lcd = LCDclient.getSingleton();

    // Récupération des undelegations de ce compte
    const rawUndelegations = await lcd.staking.getUndelegations(accountAddress).catch(handleError);
    if(rawUndelegations?.data) {
        if(rawUndelegations.data.unbonding_responses) {
            for(const undelegation of rawUndelegations.data.unbonding_responses) {
                for(const entrie of undelegation.entries) {
                    tblRetour.push({
                        valoperAddress: undelegation.validator_address,
                        valMoniker: tblValidators[undelegation.validator_address].description_moniker,
                        balance: entrie.balance/1000000,
                        releaseDatetime: entrie.completion_time
                    })
                }
            }
        }
    } else
        return { "erreur": "Failed to fetch [undelegations] from LCD, sorry" }


    // Tri des dates de release, de la plus proche à la plus lointaine
    tblRetour.sort((a, b) => new Date(a.releaseDatetime) - new Date(b.releaseDatetime));

    // Si aucune erreur ne s'est produite, alors on renvoie le tableau complété
    return tblRetour;
}



const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}