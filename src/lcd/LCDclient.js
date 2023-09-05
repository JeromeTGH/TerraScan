import { LCDurl } from "../application/AppParams";
import { APIrequester } from "./APIrequester";

import { BankAPI } from "./api/BankAPI";
import { DistributionAPI } from "./api/DistributionAPI";
import { GovAPI } from "./api/GovAPI";
import { MintAPI } from "./api/MintAPI";
import { StakingAPI } from "./api/StakingAPI";
import { TendermintAPI } from "./api/TendermintAPI";
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
                    getAccountDetails: '/cosmos/bank/v1beta1/balances/***',
                    getOraclePoolBalance: '/cosmos/bank/v1beta1/balances/***',
                    getTotalSupplies: '/cosmos/bank/v1beta1/supply'
                },
                distribution: {
                    getDistributionCommunityPool: '/cosmos/distribution/v1beta1/community_pool',
                    getDistributionParameters: '/cosmos/distribution/v1beta1/params',
                    getPendingRewards: '/cosmos/distribution/v1beta1/delegators/***/rewards'
                },
                gov: {
                    getProposalInfos: '/cosmos/gov/v1beta1/proposals/***'
                },
                mint: {
                    getMintParameters: '/cosmos/mint/v1beta1/params'
                },
                staking: {
                    getDelegations: '/cosmos/staking/v1beta1/delegations/***',
                    getStakingParameters: '/cosmos/staking/v1beta1/params',
                    getStakingPool: '/cosmos/staking/v1beta1/pool',
                    getUndelegations: '/cosmos/staking/v1beta1/delegators/***/unbonding_delegations'
                },
                tendermint: {
                    getNodeInfos: '/cosmos/base/tendermint/v1beta1/node_info',
                    getBlockInfos: '/cosmos/base/tendermint/v1beta1/blocks/***'
                },
                treasury : {
                    getTreasuryParameters: '/terra/treasury/v1beta1/params'
                },
                tx: {
                    searchTxsByEvent: '/cosmos/tx/v1beta1/txs'
                }
            }
    
            this.bank = new BankAPI(this.apiRequester, this.paths.bank);
            this.distribution = new DistributionAPI(this.apiRequester, this.paths.distribution);
            this.gov = new GovAPI(this.apiRequester, this.paths.gov);
            this.mint = new MintAPI(this.apiRequester, this.paths.mint);
            this.staking = new StakingAPI(this.apiRequester, this.paths.staking);
            this.tendermint = new TendermintAPI(this.apiRequester, this.paths.tendermint);
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
