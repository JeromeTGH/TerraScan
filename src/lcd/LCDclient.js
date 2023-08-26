import { LCDurl } from "../application/AppParams";
import { APIrequester } from "./APIrequester";
import { BankAPI } from "./api/BankAPI";
import { TxAPI } from "./api/TxAPI";

export class LCDclient {

    _instance = null;

    // Constructeur
    constructor (url_of_LCD) {

        if(LCDclient._instance) {
            return LCDclient._instance;
        }
        else {            
            this.apiRequester = new APIrequester(url_of_LCD);
            this.paths = {
                bank: {
                    getTotalSupplies: '/cosmos/bank/v1beta1/supply'
                },
                tx: {
                    searchTxsByEvent: '/cosmos/tx/v1beta1/txs'
                }
            }
    
            this.bank = new BankAPI(this.apiRequester, this.paths.bank);
            this.tx = new TxAPI(this.apiRequester, this.paths.tx);

            LCDclient._instance = this;
            console.log('Instance LCD créée.');
        }
    }

    // Singleton (pour avoir une unique instance de cette classe)
    static getSingleton(url_of_LCD = LCDurl) {
        if(LCDclient._instance)
            return LCDclient._instance;
        else
            return new LCDclient(url_of_LCD);
    }

}
