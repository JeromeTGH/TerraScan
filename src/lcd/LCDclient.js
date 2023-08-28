import { LCDurl } from "../application/AppParams";
import { APIrequester } from "./APIrequester";

import { BankAPI } from "./api/BankAPI";
import { MintAPI } from "./api/MintAPI";
import { StakingAPI } from "./api/StakingAPI";
import { TreasuryAPI } from "./api/TreasuryAPI";
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
                mint: {
                    getMintParameters: '/cosmos/mint/v1beta1/params'
                },
                staking: {
                    getStakingPool: '/cosmos/staking/v1beta1/pool',
                    getStakingParameters: '/cosmos/staking/v1beta1/params'
                },
                treasury : {
                    getTreasuryParameters: '/terra/treasury/v1beta1/params'
                },
                tx: {
                    searchTxsByEvent: '/cosmos/tx/v1beta1/txs'
                }
            }
    
            this.bank = new BankAPI(this.apiRequester, this.paths.bank);
            this.mint = new MintAPI(this.apiRequester, this.paths.mint);
            this.staking = new StakingAPI(this.apiRequester, this.paths.staking);
            this.treasury = new TreasuryAPI(this.apiRequester, this.paths.treasury);
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
