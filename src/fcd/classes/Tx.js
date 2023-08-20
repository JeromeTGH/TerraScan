
export class Tx {

    constructor (objetAvecVariables) {

        this.code = objetAvecVariables.code ? objetAvecVariables.code : 0;
        this.codespace = objetAvecVariables.codespace ? objetAvecVariables.codespace : 0;
        this.gas_used = objetAvecVariables.gas_used;
        this.gas_wanted = objetAvecVariables.gas_wanted;
        this.height = objetAvecVariables.height;
        this.id = objetAvecVariables.id;
        this.logs = objetAvecVariables.logs;
        this.raw_log = objetAvecVariables.raw_log;
        this.timestamp = objetAvecVariables.timestamp;
        this.tx = {
            value: {
                fee: {
                    amount: objetAvecVariables.tx.value.fee.amount      // objetAvecVariables.tx.value.fee.amount  =  array of {amount: '212865', denom: 'uusd'}, for example
                },
                msg:  objetAvecVariables.tx.value.msg     // objetAvecVariables.tx.value.msg  =  [i].type = "bank/MsgSend", "staking/MsgDelegate", ...
            }
        }
        this.txhash = objetAvecVariables.txhash;

    }


    static extractFromTxs (rawApiData) {
        return new Tx(rawApiData);
    }

}