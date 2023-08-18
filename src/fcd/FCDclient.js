import { APIrequester } from "./APIrequester";
import { AccountAPI } from "./api/AccountAPI";
import { StakingAPI } from "./api/StakingAPI";
import { TendermintAPI } from "./api/TendermintAPI";

export class FCDclient {

    _instance = null;

    // Constructeur
    constructor (FCDurl = 'https://terra-classic-fcd.publicnode.com') {

        if(FCDclient._instance) {
            return FCDclient._instance;
        }
        else {
            this.apiRequester = new APIrequester(FCDurl);
    
            this.account = new AccountAPI(this.apiRequester);
            this.tendermint = new TendermintAPI(this.apiRequester);
            this.staking = new StakingAPI(this.apiRequester);

            FCDclient._instance = this;
        }
    }

    // Singleton (pour avoir une unique instance de cette classe)
    static getSingleton() {
        if(FCDclient._instance)
            return FCDclient._instance;
        else
            return new FCDclient();
    }

}
