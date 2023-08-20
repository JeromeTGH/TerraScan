import { LCDurl } from "../application/AppParams";
import { APIrequester } from "./APIrequester";

export class LCDclient {

    _instance = null;

    // Constructeur
    constructor (url_of_LCD) {

        if(LCDclient._instance) {
            return LCDclient._instance;
        }
        else {            
            this.apiRequester = new APIrequester(url_of_LCD);


            //    À COMPLÉTER, AU BESOIN !!
            //    À COMPLÉTER, AU BESOIN !!
            //    À COMPLÉTER, AU BESOIN !!


            // ================
            // Exemple de paths
            // ================
            this.paths = {
                bank: {
                    getAccountDetails: '...'
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
    
            // =============================
            // Exemples d'intanciation d'API
            // =============================
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
