import { bech32 } from 'bech32';

export class Validator {

    constructor (objetAvecVariables) {

        this.commission = {
            // update_time: objetAvecVariables.commission.update_time,
            commission_rates: {
                max_change_pourcentage: parseFloat((objetAvecVariables.commission.commission_rates.max_change_rate*100).toFixed(2)),
                max_pourcentage: parseFloat((objetAvecVariables.commission.commission_rates.max_rate*100).toFixed(2)),
                actual_pourcentage: parseFloat((objetAvecVariables.commission.commission_rates.rate*100).toFixed(2))
            }
        }
        // this.consensus_pubkey = {
        //     type: objetAvecVariables.consensus_pubkey.type,
        //     value: objetAvecVariables.consensus_pubkey.value
        // }
        this.delegator_shares = parseInt(objetAvecVariables.delegator_shares);
        this.description = {
            details: objetAvecVariables.description.details,
            // identity: objetAvecVariables.description.identity,
            moniker: objetAvecVariables.description.moniker,
            security_contact: objetAvecVariables.description.security_contact,
            website: objetAvecVariables.description.website
        }
        // this.min_self_delegation = objetAvecVariables.min_self_delegation;
        this.operator_address = objetAvecVariables.operator_address;
        this.status = objetAvecVariables.status;
        // this.tokens = objetAvecVariables.tokens;                         // Nota : doublon avec "delegator_shares" ?
        // this.unbonding_height = objetAvecVariables.unbonding_height;
        // this.unbonding_time = objetAvecVariables.unbonding_time;


        // AJOUT : adresse "terra1..." associée au compte validateur "terravaloper1..."
        this.terra1_account_address = bech32.encode('terra', bech32.decode(objetAvecVariables.operator_address).words);

    }


    static extractFromStakingValidator (rawApiData) {
        return new Validator(rawApiData.data.result);
    }

}