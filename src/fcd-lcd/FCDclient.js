import { APIrequester } from "./APIrequester";
import { BankAPI } from "./api/BankAPI";
import { StakingAPI } from "./api/StakingAPI";
import { TendermintAPI } from "./api/TendermintAPI";

export class FCDclient {

    _instance = null;

    // Constructeur
    constructor (FCDurl) {

        if(FCDclient._instance) {
            return FCDclient._instance;
        }
        else {
            this.apiRequester = new APIrequester(FCDurl);
            this.paths = {
                bank: {
                    getAccountDetails: '/v1/bank/',
                    getAccountTxs: '/v1/txs'
                },
                tendermint: {
                    getNodeInfos: '/node_info',
                    getBlockInfos: '/v1/blocks/'
                },
                staking: {
                    getValidatorInfos: '/v1/staking/validators/',
                    getValidatorsList: '/v1/staking/validators'
                }
            }
    
            this.account = new BankAPI(this.apiRequester, this.paths.bank);
            this.tendermint = new TendermintAPI(this.apiRequester, this.paths.tendermint);
            this.staking = new StakingAPI(this.apiRequester, this.paths.staking);

            FCDclient._instance = this;
            console.log('Instance FCD créée.');
        }
    }

    // Singleton (pour avoir une unique instance de cette classe)
    static getSingleton(FCDurl = 'https://terra-classic-fcd.publicnode.com') {
        if(FCDclient._instance)
            return FCDclient._instance;
        else
            return new FCDclient(FCDurl);
    }

}
