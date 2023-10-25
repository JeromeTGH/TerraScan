
import { LCDclient } from '../../apis/lcd/LCDclient';
import { tblValidators } from '../../application/AppData';


export const getRedelegations = async (accountAddress) => {

    // Préparation du tableau réponse en retour
    const tblRetour = [];

    // Récupération instance LCD
    const lcd = LCDclient.getSingleton();

    // Récupération des undelegations de ce compte
    const rawRedelegations = await lcd.staking.getRedelegations(accountAddress).catch(handleError);
    if(rawRedelegations?.data) {
        if(rawRedelegations.data.redelegation_responses) {
            for(const redelegation of rawRedelegations.data.redelegation_responses) {
                for(const entrie of redelegation.entries) {
                    tblRetour.push({
                        validator_src_address: redelegation.redelegation.validator_src_address,
                        validator_src_moniker: tblValidators[redelegation.redelegation.validator_src_address].description_moniker,
                        validator_dst_address: redelegation.redelegation.validator_dst_address,
                        validator_dst_moniker: tblValidators[redelegation.redelegation.validator_dst_address].description_moniker,
                        balance: entrie.balance/1000000,
                        releaseDatetime: entrie.redelegation_entry.completion_time
                    })
                }
            }
        }
    } else
        return { "erreur": "Failed to fetch [redelegations] from LCD, sorry" }


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