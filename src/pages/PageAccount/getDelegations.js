
import { LCDclient } from '../../lcd/LCDclient';
import { tblCorrespondanceValeurs } from '../../application/AppParams';
import { tblValidators } from '../../application/AppData';


export const getDelegations = async (accountAddress) => {

    // Préparation du tableau réponse en retour
    const tblRetour = [];

    // Récupération instance LCD
    const client_lcd = LCDclient.getSingleton();

    // Récupération des delegations de ce compte
    const rawDelegations = await client_lcd.staking.getDelegations(accountAddress).catch(handleError);
    if(rawDelegations?.data) {
        if(rawDelegations.data.delegation_responses) {
            for(const delegation of rawDelegations.data.delegation_responses) {
                if(delegation.balance.amount > 0)
                    tblRetour.push({
                        amountStaked: delegation.balance.amount/1000000,
                        valoperAddress: delegation.delegation.validator_address,
                        valMoniker: tblValidators[delegation.delegation.validator_address].description_moniker,
                        rewards: [],
                        isJailedValidator: tblValidators[delegation.delegation.validator_address].status !== 'active'
                    })
            }
        } else
            return { "erreur": "Failed to fetch [data.delegation_responses] from LCD response, sorry" }
    } else
        return { "erreur": "Failed to fetch [delegations] from LCD, sorry" }


    // Récupération des rewards de ce compte
    const rawRewards = await client_lcd.distribution.getPendingRewards(accountAddress).catch(handleError);
    if(rawRewards?.data) {
        if(rawRewards.data.rewards) {
            for(const rewards of rawRewards.data.rewards) {
                const idxDansTblRetour = tblRetour.findIndex(element => element.valoperAddress === rewards.validator_address);
                if(idxDansTblRetour > -1) {
                    const tblRewards = [];
                    for(const [denom, coinName] of Object.entries(tblCorrespondanceValeurs)) {
                        const idxCoin = rewards.reward.findIndex(element => element.denom === denom);
                        if(idxCoin > -1)
                            tblRewards.push({
                                amount: (rewards.reward[idxCoin].amount / 1000000).toFixed(6),
                                denom: coinName
                            })
                        else
                            tblRewards.push({
                                amount: "0.000000",
                                denom: coinName
                            })
                    }
                    tblRetour[idxDansTblRetour].rewards.push(...tblRewards);
                }
            }
        } else
            return { "erreur": "Failed to fetch [data.rewards] from LCD response, sorry" }
    } else
        return { "erreur": "Failed to fetch [delegations rewards] from LCD, sorry" }


    // Tri des montants stakés, du "plus gros" au "plus petit"
    tblRetour.sort((a, b) => b.amountStaked - a.amountStaked);


    // Si aucune erreur ne s'est produite, alors on renvoie le tableau complété
    return tblRetour;
}



const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}