import { LCDurl } from "../application/AppParams";
import { APIrequester } from "./APIrequester";
import { AccountAPI } from "./api/AccountAPI";
import { StakingAPI } from "./api/StakingAPI";
import { TendermintAPI } from "./api/TendermintAPI";

export class LCDclient {

    _instance = null;

    // Constructeur
    constructor (url_of_LCD) {

        if(LCDclient._instance) {
            return LCDclient._instance;
        }
        else {            
            this.apiRequester = new APIrequester(url_of_LCD);


            //    À COMPLÉTER !!
            //    À COMPLÉTER !!
            //    À COMPLÉTER !!

            this.paths = {
                bank: {
                    getAccountDetails: '...',
                    getAccountTxs: '...'
                },
                tendermint: {
                    getNodeInfos: '...',
                    getBlockInfos: '...'
                },
                staking: {
                    getValidatorInfos: '...',
                    getValidatorsList: '...'
                }
            }
    
            // this.account = new AccountAPI(this.apiRequester, null);
            // this.tendermint = new TendermintAPI(this.apiRequester, null);
            // this.staking = new StakingAPI(this.apiRequester, this.paths.staking);

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
