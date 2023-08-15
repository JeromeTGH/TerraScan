import { APIrequester } from "./APIrequester";
import { AccountAPI } from "./api/AccountAPI";

export class FCDclient {

    constructor (FCDurl) {
        this.apiRequester = new APIrequester(FCDurl);
        this.account = new AccountAPI(this.apiRequester);
    }

}