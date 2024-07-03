import { tblGlobalInfos, tblValidators, tblValidatorsAccounts } from "../application/AppData";
import { FCDclient } from "../apis/fcd/FCDclient";
import { Validator } from "../apis/fcd/classes/Validator";
import { loadNbStakedLunc } from "./loadNbStakedLunc";


export const loadValidators = async () => {

    // Chargement du nombre de LUNC stakés, si pas déjà fait
    await loadNbStakedLunc();

    // Chargement seulement si ça n'a pas déjà été fait auparavant (toujours en mémoire, je veux dire)
    if(Object.keys(tblValidators).length === 0) {

        // Instanciation d'une classe de requetage FCD
        const fcd = FCDclient.getSingleton();

        // Récupération de la liste de tous les validateurs (avec infos générales, à leur sujet)
        const rawValidatorList = await fcd.staking.getValidatorsList().catch(handleError);
        if(rawValidatorList && rawValidatorList.data) {

// console.log("rawValidatorList.data", rawValidatorList.data);

            for(const validator of rawValidatorList.data) {
                   
                try {
                    const validatorInfo = new Validator(validator);

                    // Calcul intermédiaire, pour les 'jailed validators'
                    let votingPowerInPercent = 0;
                    if(validatorInfo.status === 'active')
                        votingPowerInPercent = validatorInfo.votingPower.pourcentage;
                    else
                        votingPowerInPercent = validatorInfo.delegator_shares / (validatorInfo.delegator_shares + tblGlobalInfos['nbStakedLunc']) * 100;

                    
                    // Structure qui va être rajoutée au tableau des validators :
                    //      tblValidators["valoper"] = {
                    //          up_time,
                    //          status,
                    //          terra1_account_address,
                    //          description_moniker,
                    //          description_website,
                    //          description_security_contact,
                    //          description_details,
                    //          profile_icon,
                    //          voting_power_amount,
                    //          voting_power_pourcentage,
                    //          commission_actual_pourcentage,
                    //          commission_max_pourcentage,
                    //          commission_max_change_pourcentage,
                    //          self_delegation_amount,
                    //          self_delegation_pourcentage,
                    //          vote
                    //      }
                    tblValidators[validatorInfo.operator_address] = {
                        'up_time': validatorInfo.up_time,
                        'status': validatorInfo.status,
                        'terra1_account_address': validatorInfo.terra1_account_address,
                        'description_moniker':  validatorInfo.description.moniker,
                        'description_website':  validatorInfo.description.website,
                        'description_security_contact':  validatorInfo.description.security_contact,
                        'description_details': validatorInfo.description.details,
                        'profile_icon': validatorInfo.description.profile_icon,
                        'voting_power_amount': validatorInfo.delegator_shares,    // validatorInfo.votingPower.amount,
                        'voting_power_pourcentage': votingPowerInPercent,
                        'commission_actual_pourcentage': validatorInfo.commissionInfo.actual_pourcentage,
                        'commission_max_pourcentage': validatorInfo.commissionInfo.max_pourcentage,
                        'commission_max_change_pourcentage': validatorInfo.commissionInfo.max_change_pourcentage,
                        'self_delegation_amount': validatorInfo.selfDelegation.amount,
                        'self_delegation_pourcentage': validatorInfo.selfDelegation.pourcentage,
                        'vote': ''      // Champ non utilisé de manière directe (cf. pages Proposal/Proposals)
                    }
                    tblValidatorsAccounts[validatorInfo.terra1_account_address] = validatorInfo.operator_address;

// if(validatorInfo.operator_address === "terravaloper1...") {
//     console.log("validatorInfo", validatorInfo);
// }

                } catch(err) {
                    return { "erreur": err.toString() }
                }

            }
        } else
            return { "erreur": "Failed to fetch [validators list] ..." }

        // Fin du chargement
        // console.log("Liste des validateurs chargée.");
// console.log("tblValidators", tblValidators);
    }



    // Envoie d'un objet vide en retour, pour signifier qu'aucune erreur ne s'est produite
    return {};

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}