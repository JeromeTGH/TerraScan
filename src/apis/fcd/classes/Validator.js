
export class Validator {

    constructor (objetAvecVariables) {

        this.operator_address = objetAvecVariables.operatorAddress;
        // this.tokens = objetAvecVariables.tokens;                         // Nota : doublon avec "delegator_shares" ?
        this.delegator_shares = parseInt(objetAvecVariables.delegatorShares);
        this.up_time = parseFloat((objetAvecVariables.upTime*100.0).toFixed(2));
        this.status = objetAvecVariables.status;    // = "jailed" ou "active"
        this.terra1_account_address = objetAvecVariables.accountAddress;
        this.description = {
            // identity: objetAvecVariables.description.identity,
            moniker: objetAvecVariables.description.moniker,
            website: objetAvecVariables.description.website,
            security_contact: objetAvecVariables.description.securityContact,
            details: objetAvecVariables.description.details,
            profile_icon: objetAvecVariables.description.profileIcon
        }
        this.votingPower = {
            amount: parseInt(objetAvecVariables.votingPower.amount),
            pourcentage: parseFloat((objetAvecVariables.votingPower.weight*100).toFixed(2))
        }
        this.commissionInfo = {
            actual_pourcentage: parseFloat((objetAvecVariables.commissionInfo.rate*100).toFixed(2)),
            max_pourcentage: parseFloat((objetAvecVariables.commissionInfo.maxRate*100).toFixed(2)),
            max_change_pourcentage: parseFloat((objetAvecVariables.commissionInfo.maxChangeRate*100).toFixed(2))
            // update_time: objetAvecVariables.commission.updateTime
        }
        // this.rewards_pool = { total + denoms[] }
        this.selfDelegation = {
            amount: parseInt(objetAvecVariables.selfDelegation.amount),
            pourcentage: parseFloat((objetAvecVariables.selfDelegation.weight*100).toFixed(2))
        }
        // this.commissions = { denoms[] }

// if(objetAvecVariables.operatorAddress === "terravaloper1...") {
//     console.log("objetAvecVariables 1", objetAvecVariables);
// }

    }


    static extractFromStakingValidator (rawApiData) {
        return new Validator(rawApiData.data.result);
    }

}