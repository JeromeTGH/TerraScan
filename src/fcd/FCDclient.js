import { APIrequester } from "./APIrequester";
import { AccountAPI } from "./api/AccountAPI";
import { StakingAPI } from "./api/StakingAPI";
import { TendermintAPI } from "./api/TendermintAPI";

export class FCDclient {

    constructor (FCDurl) {
        this.apiRequester = new APIrequester(FCDurl);

        this.account = new AccountAPI(this.apiRequester);
        this.tendermint = new TendermintAPI(this.apiRequester);
        this.staking = new StakingAPI(this.apiRequester);
    }

}