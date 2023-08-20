import { FCDurl } from "../application/AppParams";
import { APIrequester } from "./APIrequester";
import { BankAPI } from "./api/BankAPI";
import { StakingAPI } from "./api/StakingAPI";
import { TendermintAPI } from "./api/TendermintAPI";
import { TxAPI } from "./api/TxAPI";

export class FCDclient {

    _instance = null;

    // Constructeur
    constructor (url_of_FCD) {

        if(FCDclient._instance) {
            return FCDclient._instance;
        }
        else {
            this.apiRequester = new APIrequester(url_of_FCD);
            this.paths = {
                bank: {
                    getAccountDetails: '/v1/bank/'
                },
                tendermint: {
                    getNodeInfos: '/node_info',
                    getBlockInfos: '/v1/blocks/'
                },
                staking: {
                    getValidatorInfos: '/v1/staking/validators/',
                    getValidatorsList: '/v1/staking/validators'
                },
                tx: {
                    getAccountTxs: '/v1/txs',
                    getTxInfos: '/v1/tx/'
                }
            }
    
            this.account = new BankAPI(this.apiRequester, this.paths.bank);
            this.tendermint = new TendermintAPI(this.apiRequester, this.paths.tendermint);
            this.staking = new StakingAPI(this.apiRequester, this.paths.staking);
            this.tx = new TxAPI(this.apiRequester, this.paths.tx);

            FCDclient._instance = this;
            console.log('Instance FCD créée.');
        }
    }

    // Singleton (pour avoir une unique instance de cette classe)
    static getSingleton(url_of_FCD = FCDurl) {
        if(FCDclient._instance)
            return FCDclient._instance;
        else
            return new FCDclient(url_of_FCD);
    }

}
