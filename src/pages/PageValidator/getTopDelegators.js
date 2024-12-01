
import { LCDclient } from '../../apis/lcd/LCDclient';
import { tblValidators } from '../../application/AppData';


export const getTopDelegators = async (valoperAddress, nbToShow) => {

    // Préparation du tableau réponse en retour
    const tblRetour = [];

    // Récupération instance LCD
    const lcd = LCDclient.getSingleton();

    // Préparation de la requête
    const params = new URLSearchParams();
    params.append('pagination.limit', 99999);

    // Récupération des delegators de ce validator
    const rawDelegators = await lcd.staking.getValidatorDelegators(valoperAddress, params).catch(handleError);
    if(rawDelegators?.data) {       
        if(rawDelegators.data.delegation_responses) {
            for(const delegator of rawDelegators.data.delegation_responses) {
                tblRetour.push({
                    staked: parseInt(delegator.balance.amount/1000000),
                    percentage: ((delegator.balance.amount/tblValidators[valoperAddress].voting_power_amount)*100).toFixed(2),
                    delegatorAddress: delegator.delegation.delegator_address
                })
            }
        }
    } else
        return { "erreur": "Failed to fetch [top delegators] from LCD, sorry" }


    // Tri du "plus gros staking" au plus faible
    tblRetour.sort((a, b) => new Date(b.staked) - new Date(a.staked));

    // Filtrage des X derniers, et renvoi
    return tblRetour.slice(0, nbToShow);
}



const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}