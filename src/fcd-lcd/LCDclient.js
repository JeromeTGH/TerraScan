import { APIrequester } from "./APIrequester";
import { AccountAPI } from "./api/AccountAPI";
import { StakingAPI } from "./api/StakingAPI";
import { TendermintAPI } from "./api/TendermintAPI";

export class LCDclient {

    _instance = null;

    // Constructeur
    constructor (LCDurl) {

        if(LCDclient._instance) {
            return LCDclient._instance;
        }
        else {            
            this.apiRequester = new APIrequester(LCDurl);


            //    À COMPLÉTER !!
            //    À COMPLÉTER !!
            //    À COMPLÉTER !!

            this.paths = {
                staking: {
                    askForValidatorInfo: '...',
                    askForValidatorsList: '...'
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
    static getSingleton(LCDurl = 'https://terra-classic-lcd.publicnode.com') {
        if(LCDclient._instance)
            return LCDclient._instance;
        else
            return new LCDclient(LCDurl);
    }

}
