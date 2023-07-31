import { chainID, chainLCDurl } from '../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';
import Decimal from 'decimal.js';

export const getOverviewInfos = async () => {

    // Tableau à retourner
    const tblAretourner = {
        "LuncTotalSupply": null,
        "LuncBonded": null,
        "UnbondingTime": null,
        "NbMaxValidators": null,
        "NbBondedValidators": null,
        "InflationMax": null,
        "TobinTaxMax": null,                // Tobin tax ("Tax burn") ; initially 1.2%, then 0.2%, then 0.5%
        "TobinTaxSplitToBeBurn": null,              // Split of above tax ("Burn tax AnteHandler") ; typically 80/20,
        "TobinTaxSplitToDistributionModule": null,  // so 80% to be burn, and 20% to the distribution module
        "DistributionModuleSplitToStakers": null,           // Split of distribution module ; typically 50/50, so 50% du stakers
        "DistributionModuleSplitToCommunityPool": null,     // and 50% du community pool
        "AmountOfLuncInCP": null,       // Community Pool
        "AmountOfUstcInCP": null,
        "AmountOfLuncInOP": null,       // Oracle Pool
        "AmountOfUstcInOP": null,
        "LastBlockHeight": null,
        "LastBlockEpoch": null,
        "LastBlockDateTime": null,
        "PourcentageAvancementDansEpoch": null,
        "DateEstimativeProchaineEpoch": null
    }

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    // Récupération de la "total supply" du LUNC
    const rawTotalSupplies = await lcd.bank.total({'pagination.limit': 9999}).catch(handleError);
    if(rawTotalSupplies) {
        const lstTotalSupplies = (new Coins(rawTotalSupplies[0])).toData();
        const idxLunc = lstTotalSupplies.findIndex(element => element.denom === "uluna");

        if(idxLunc >= 0) {
            tblAretourner['LuncTotalSupply'] = parseInt(lstTotalSupplies[idxLunc].amount/1000000);
        } else
            return { "erreur": "Failed to fetch [LUNC total supply] ..." }
    } else
        return { "erreur": "Failed to fetch [total supplies] ..." }

    // Récupération du nombre de LUNC stakés (bonded)
    const rawStakingPool = await lcd.staking.pool().catch(handleError);
    if(rawStakingPool) {
        const bondedTokens = (new Decimal(rawStakingPool.bonded_tokens.amount)).toFixed(0);
        tblAretourner['LuncBonded'] = parseInt(bondedTokens/1000000);
    } else
        return { "erreur": "Failed to fetch [staking pool] ..." }

    // Récupération des paramètres du module Staking (plus exactement : l'unbonding_time, et le max_validators)
    const rawStakingParameters = await lcd.staking.parameters().catch(handleError);
    if(rawStakingParameters) {
        tblAretourner['UnbondingTime'] = rawStakingParameters.unbonding_time / 3600 / 24;       // Transformation nbSecondes --> nbJours
        tblAretourner['NbMaxValidators'] = rawStakingParameters.max_validators;
    } else
        return { "erreur": "Failed to fetch [staking parameters] ..." }

    // Récupération du nombre total de validateurs ayant un status "bonded"
    const rawValidators = await lcd.staking.validators({'pagination.limit': 9999, "status": "BOND_STATUS_BONDED"}).catch(handleError);
    if(rawValidators) {
        tblAretourner['NbBondedValidators'] = rawValidators[0].length
    } else
        return { "erreur": "Failed to fetch [validators] ..." }


    // Récupération du taux d'inflation max
    const rawMintParameters = await lcd.mint.parameters().catch(handleError);
    if(rawMintParameters) {
        const inflationMax = (new Decimal(rawMintParameters.inflation_max)).toFixed(3);
        tblAretourner['InflationMax'] = inflationMax*100;       // Pour afficher des pourcentages
    } else
        return { "erreur": "Failed to fetch [mint parameters] ..." }

    // Récupération de la taxe tobin max (initialement nommée la "taxe burn"), et des paramètres de son split
    const rawTreasuryParameters = await lcd.treasury.parameters().catch(handleError);
    if(rawTreasuryParameters) {
        const tobinTaxMax = (new Decimal(rawTreasuryParameters.tax_policy.rate_max)).toFixed(3);
        const tobinTaxSplitToDistributionModule = (new Decimal(rawTreasuryParameters.burn_tax_split)).toFixed(3);
        const tobinTaxSplitToBeBurn = 1 - tobinTaxSplitToDistributionModule;
        tblAretourner['TobinTaxMax'] = tobinTaxMax*100;                                                 // Pour afficher des pourcentages
        tblAretourner['TobinTaxSplitToBeBurn'] = tobinTaxSplitToBeBurn * 100;                           // Pour afficher des pourcentages
        tblAretourner['TobinTaxSplitToDistributionModule'] = tobinTaxSplitToDistributionModule * 100;   // Pour afficher des pourcentages
    } else
        return { "erreur": "Failed to fetch [treasury parameters] ..." }

    // Récupération des infos concernant le split du "distribution module"
    const rawDistributionParameters = await lcd.distribution.parameters().catch(handleError);
    if(rawDistributionParameters) {
        const distributionModuleSplitToCommunityPool = (new Decimal(rawDistributionParameters.community_tax)).toFixed(3);
        const distributionModuleSplitToStakers = 1 - distributionModuleSplitToCommunityPool;
        tblAretourner['DistributionModuleSplitToStakers'] = distributionModuleSplitToStakers * 100;                 // Pour afficher des pourcentages
        tblAretourner['DistributionModuleSplitToCommunityPool'] = distributionModuleSplitToCommunityPool * 100;     // Pour afficher des pourcentages
    } else
        return { "erreur": "Failed to fetch [distribution parameters] ..." }

    // Récupération des infos concernant le "community pool"
    const rawCommunityPool = await lcd.distribution.communityPool().catch(handleError);
    if(rawCommunityPool) {
        const lstCoinsInCP = (new Coins(rawCommunityPool)).toData();
        const idxLuncInCP = lstCoinsInCP.findIndex(element => element.denom === "uluna");
        const idxUstcInCP = lstCoinsInCP.findIndex(element => element.denom === "uusd");

        if(idxLuncInCP >= 0)
            tblAretourner['AmountOfLuncInCP'] = parseInt(lstCoinsInCP[idxLuncInCP].amount/1000000);
        else
            tblAretourner['AmountOfLuncInCP'] = 0;

        if(idxUstcInCP >= 0)
            tblAretourner['AmountOfUstcInCP'] = parseInt(lstCoinsInCP[idxUstcInCP].amount/1000000);
        else
            tblAretourner['AmountOfUstcInCP'] = 0;
    } else
        return { "erreur": "Failed to fetch [distribution parameters] ..." }


    // Récupération des infos concernant le "oracle pool" (adresse = terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f)
    const rawOraclePool = await lcd.bank.balance("terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f").catch(handleError);
    if(rawOraclePool) {
        const lstCoinsInOP = (new Coins(rawOraclePool[0])).toData();
        const idxLuncInOP = lstCoinsInOP.findIndex(element => element.denom === "uluna");
        const idxUstcInOP = lstCoinsInOP.findIndex(element => element.denom === "uusd");

        if(idxLuncInOP >= 0)
            tblAretourner['AmountOfLuncInOP'] = parseInt(lstCoinsInOP[idxLuncInOP].amount/1000000);
        else
            tblAretourner['AmountOfLuncInOP'] = 0;

        if(idxUstcInOP >= 0)
            tblAretourner['AmountOfUstcInOP'] = parseInt(lstCoinsInOP[idxUstcInOP].amount/1000000);
        else
            tblAretourner['AmountOfUstcInOP'] = 0;
    } else
        return { "erreur": "Failed to fetch [oracle pool balance] ..." }
        
    // Récupération des infos concernant le dernier block
    const rawLastBlock = await lcd.tendermint.blockInfo().catch(handleError);
    if(rawLastBlock) {
        // Paramètres de calcul
        const nbBlocksPerEpoch = 100800;        // Sur la base de 100 800 block par epoch
        const nbSecondsPerBlock = 6;            // Sur la base "moyenne" d'un nouveau bloc toutes les 6 secondes

        // Récupération des données qui nous intéresse ici
        const lastBlockHeight = rawLastBlock.block.header.height;
        const lastBlockDateTime = rawLastBlock.block.header.time;

        // Calculs (pour retrouver le n° de l'epoch en cours, le % d'avancement dans celle-ci, et la date de la prochaine)
        const estimatedCurrentEpoch = parseInt(lastBlockHeight/nbBlocksPerEpoch);
        const pourcentageAvancementDansEpoch = ((lastBlockHeight % nbBlocksPerEpoch)/nbBlocksPerEpoch*100).toFixed(1);
        const estimatedNbSecondsLeftUntilNextEpoch = ((estimatedCurrentEpoch+1)*nbBlocksPerEpoch - lastBlockHeight)*nbSecondsPerBlock;
        const dateTimeLastBlock = new Date(lastBlockDateTime);
        const estimatedNextEpochStart = new Date(dateTimeLastBlock.getTime() + estimatedNbSecondsLeftUntilNextEpoch*1000);  // *1000 pour conversion sec => millisecondes

        tblAretourner['LastBlockHeight'] = lastBlockHeight;
        tblAretourner['LastBlockEpoch'] = estimatedCurrentEpoch
        tblAretourner['PourcentageAvancementDansEpoch'] = pourcentageAvancementDansEpoch;
        tblAretourner['DateEstimativeProchaineEpoch'] = estimatedNextEpochStart.toLocaleString();
    } else
        return { "erreur": "Failed to fetch [last block info] ..." }

    // Renvoie du tableau global/rempli, à la fin
    return tblAretourner;
}




const handleError = (err) => {
    console.log("ERREUR", err);
}
