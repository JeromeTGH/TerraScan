
export class Validator {

    constructor (objetAvecVariables) {

        this.operator_address = objetAvecVariables.operator_address;
        this.delegator_shares = parseInt(objetAvecVariables.delegator_shares);
        // Missing : this.up_time = parseFloat((objetAvecVariables.upTime*100.0).toFixed(2));
        this.status = objetAvecVariables.jailed ? "jailed" : "active";    // true ou false
        // Missing : this.terra1_account_address = objetAvecVariables.accountAddress;
        this.description = {
            // identity: objetAvecVariables.description.identity,
            moniker: objetAvecVariables.description.moniker,
            website: objetAvecVariables.description.website,
            security_contact: objetAvecVariables.description.securityContact,
            details: objetAvecVariables.description.details,
            // Missing : profile_icon: objetAvecVariables.description.profileIcon
        }
        // Missing :
        // this.votingPower = {
        //     amount: parseInt(objetAvecVariables.votingPower.amount),
        //     pourcentage: parseFloat((objetAvecVariables.votingPower.weight*100).toFixed(2))
        // }
        this.commissionInfo = {
            actual_pourcentage: parseFloat((objetAvecVariables.commission.commission_rates.rate*100).toFixed(2)),
            max_pourcentage: parseFloat((objetAvecVariables.commission.commission_rates.max_rate*100).toFixed(2)),
            max_change_pourcentage: parseFloat((objetAvecVariables.commission.commission_rates.max_change_rate*100).toFixed(2))
            // update_time: objetAvecVariables.commission.update_time
        }
        // Missing (mais non utile, ici) : this.rewards_pool = { total + denoms[] }
        // Missing :
        // this.selfDelegation = {
        //     amount: parseInt(objetAvecVariables.selfDelegation.amount),
        //     pourcentage: parseFloat((objetAvecVariables.selfDelegation.weight*100).toFixed(2))
        // }


// if(objetAvecVariables.operatorAddress === "terravaloper1...") {
//     console.log("objetAvecVariables 1", objetAvecVariables);
// }

    }


    static extractFromStakingValidator (rawApiData) {
        return new Validator(rawApiData.data.result);
    }

}