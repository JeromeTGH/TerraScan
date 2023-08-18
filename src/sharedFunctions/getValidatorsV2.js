import { tblValidators } from "../application/AppData";
import { FCDurl } from "../application/AppParams";
import { FCDclient } from "../fcd/FCDclient";
import { Validator } from "../fcd/classes/Validator";


export const loadValidatorsList = async () => {

    // Chargement seulement si ça n'a pas déjà été fait auparavant (toujours en mémoire, je veux dire)
    if(Object.keys(tblValidators).length === 0) {

        // Variables
        let total_shares = 0;

        // Instanciation d'une classe de requetage FCD
        const fcd = new FCDclient(FCDurl);

        // Récupération de la liste de tous les validateurs (avec infos générales, à leur sujet)
        const rawValidatorList = await fcd.staking.askForValidatorsList().catch(handleError);
        if(rawValidatorList.data && rawValidatorList.data.result) {
            for(const validator of rawValidatorList.data.result) {
                const validatorInfo = new Validator(validator);
                // Structure :
                //      tblValidators["valoper"] = {
                //          commission_max_change_rate, commission_max_rate, commission_actual_rate,
                //          description_details, description_moniker, description_security_contact, description_website,
                //          valaccount_address, status, delegator_shares, shares_on_total_shares_ratio
                //      }
                tblValidators[validatorInfo.operator_address] = {
                    'commission_max_change_rate': validatorInfo.commission.commission_rates.max_change_rate,
                    'commission_max_rate': validatorInfo.commission.commission_rates.max_rate,
                    'commission_actual_rate': validatorInfo.commission.commission_rates.actual_rate,
                    'description_details': validatorInfo.description.details,
                    'description_moniker':  validatorInfo.description.moniker,
                    'description_security_contact':  validatorInfo.description.security_contact,
                    'description_website':  validatorInfo.description.website,
                    'valaccount_address': validatorInfo.accAddress,
                    'status': validatorInfo.status,
                    'delegator_shares': validatorInfo.delegator_shares,
                    'shares_on_total_shares_ratio': 0
                }
                total_shares += validatorInfo.delegator_shares;
            }
        }


        // Calcul des ratios (validator_shares / all_validators_shares)
        Object.keys(tblValidators).forEach(valoper => {
            tblValidators[valoper].shares_on_total_shares_ratio = (tblValidators[valoper].delegator_shares / total_shares * 100).toFixed(2);
        })
    }

    // Envoie d'un objet vide en retour, pour signifier qu'aucune erreur ne s'est produite
    return {};

}


const handleError = (err) => {
    if(err.response && err.response.data)
    console.log("err.response.data", err.response.data);
else
    console.log(err);
}