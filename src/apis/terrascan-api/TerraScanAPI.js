import { APIrequester } from "./APIrequester";
import { CommunityPoolAPI } from "./api/CommunityPoolAPI";
import { LunkStakingAPI } from "./api/LunkStakingAPI";
import { OraclePoolAPI } from "./api/OraclePoolAPI";
import { TotalSuppliesAPI } from "./api/TotalSuppliesAPI";

export class TerraScanAPI {

    _instance = null;

    // Constructeur
    constructor (url_of_TSAPI) {

        if(TerraScanAPI._instance) {
            return TerraScanAPI._instance;
        }
        else {
            this.apiRequester = new APIrequester(url_of_TSAPI);
            this.paths = {
                communitypool: {
                    getPastValues: '/api/communitypool/getPastValues'
                },
                lunkstaking: {
                    getPastValues: '/api/luncstaking/getPastValues'
                },
                oraclepool: {
                    getPastValues: '/api/oraclepool/getPastValues'
                },
                totalsupplies: {
                    getPastValues: '/api/totalsupplies/getPastValues'
                }
            }
    
            this.communitypool = new CommunityPoolAPI(this.apiRequester, this.paths.bank);
            this.lunkstaking = new LunkStakingAPI(this.apiRequester, this.paths.tendermint);
            this.oraclepool = new OraclePoolAPI(this.apiRequester, this.paths.staking);
            this.totalsupplies = new TotalSuppliesAPI(this.apiRequester, this.paths.tx);

            TerraScanAPI._instance = this;
            console.log('Instance TSAPI créée.');
        }
    }

    // Singleton (pour avoir une unique instance de cette classe)
    static getSingleton(url_of_TSAPI = TSAPIurl) {
        if(TerraScanAPI._instance)
            return TerraScanAPI._instance;
        else
            return new TerraScanAPI(url_of_TSAPI);
    }

}
