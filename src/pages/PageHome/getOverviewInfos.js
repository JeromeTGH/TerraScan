import { LCDclient } from '../../apis/lcd/LCDclient';
import { tblGlobalInfos, tblValidators } from '../../application/AppData';
import { loadNbStakedLunc } from '../../dataloaders/loadNbStakedLunc';
import { loadSomeGeneralnfos } from '../../dataloaders/loadSomeGeneralnfos';

export const getOverviewInfos = async (totalSupplies, lastblockInfos) => {

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

    // ******************************************
    // Opérations ne nécessitant pas de requêtage
    // ******************************************

    // Récupération de la "total supply" du LUNC
    const idxLuncSupply = totalSupplies.findIndex(element => element.denom === "uluna");
    if(idxLuncSupply > -1) {
        tblAretourner['LuncTotalSupply'] = parseInt(totalSupplies[idxLuncSupply].amount/1000000);
    } else
        return { "erreur": "Failed to fetch [LUNC total supply] ..." }

    // Height, datetime, et next epoch
        // Paramètres de calcul
        const nbBlocksPerEpoch = 100800;        // Sur la base de 100 800 block par epoch
        const nbSecondsPerBlock = 6;            // Sur la base "moyenne" d'un nouveau bloc toutes les 6 secondes

        // Récupération des données qui nous intéresse ici
        const lastBlockHeight = lastblockInfos.height;
        const lastBlockDateTime = lastblockInfos.datetime;

        // Calculs (pour retrouver le n° de l'epoch en cours, le % d'avancement dans celle-ci, et la date de la prochaine)
        const estimatedCurrentEpoch = parseInt(lastBlockHeight/nbBlocksPerEpoch);
        const pourcentageAvancementDansEpoch = ((lastBlockHeight % nbBlocksPerEpoch)/nbBlocksPerEpoch*100).toFixed(1);
        const estimatedNbSecondsLeftUntilNextEpoch = ((estimatedCurrentEpoch+1)*nbBlocksPerEpoch - lastBlockHeight)*nbSecondsPerBlock;
        const dateTimeLastBlock = new Date(lastBlockDateTime);
        const estimatedNextEpochStart = new Date(dateTimeLastBlock.getTime() + estimatedNbSecondsLeftUntilNextEpoch*1000);  // *1000 pour conversion sec => millisecondes

        // Insertion des valeurs dans le tableau
        tblAretourner['LastBlockHeight'] = lastBlockHeight;
        tblAretourner['LastBlockEpoch'] = estimatedCurrentEpoch;
        tblAretourner['PourcentageAvancementDansEpoch'] = pourcentageAvancementDansEpoch;
        tblAretourner['DateEstimativeProchaineEpoch'] = estimatedNextEpochStart.toLocaleString();
        

    // Récupération du nombre total de validateurs ayant un status "bonded"
    tblAretourner['NbBondedValidators'] = Object.values(tblValidators).filter(element => element.status === 'active').length;


    // Calcul du Coefficient de Nakamoto (c'est à dire le nombre de validateurs minimum, qui s'ils s'allient, atteignent les 33,33% de VP, et peuvent halt la chaine)
    let coeffNakamoto = 0;
    let cumulativeVotingPower = 0;
    for(const validator of Object.values(tblValidators).sort((a, b) => {return b.voting_power_pourcentage - a.voting_power_pourcentage})) {
        coeffNakamoto += 1;
        cumulativeVotingPower += validator.voting_power_pourcentage;
        if(cumulativeVotingPower >= (100/3))
            break;
    }
    tblAretourner['NakamotoCoefficient'] = coeffNakamoto;


    // Récupération du nombre de LUNC stakés
    const nbLuncStaked = await loadNbStakedLunc();
    if(nbLuncStaked['erreur'])
        return nbLuncStaked['erreur'];

    tblAretourner['LuncBonded'] = parseInt(nbLuncStaked/1000000);


    // Récupération d'autres infos générales
    const someGeneralInfos = await loadSomeGeneralnfos();
    if(someGeneralInfos['erreur'])
        return someGeneralInfos['erreur'];

    tblAretourner['UnbondingTime'] = tblGlobalInfos['UnbondingTime'];
    tblAretourner['NbMaxValidators'] = tblGlobalInfos['NbMaxValidators'];
    tblAretourner['InflationMax'] = tblGlobalInfos['InflationMax'];
    tblAretourner['TobinTaxMax'] = tblGlobalInfos['TobinTaxMax'];
    tblAretourner['TobinTaxSplitToDistributionModule'] = tblGlobalInfos['TobinTaxSplitToDistributionModule'];
    tblAretourner['TobinTaxSplitToBeBurn'] = tblGlobalInfos['TobinTaxSplitToBeBurn'];
    tblAretourner['DistributionModuleSplitToStakers'] = tblGlobalInfos['DistributionModuleSplitToStakers']
    tblAretourner['DistributionModuleSplitToCommunityPool'] = tblGlobalInfos['DistributionModuleSplitToCommunityPool']

    // ****************************
    // Requetes LCD, à partir d'ici
    // ****************************

    // Création/récupération d'une instance de requétage LCD
    const lcd = LCDclient.getSingleton();

        
    // Récupération des infos concernant le "community pool"
    const rawDistributionCommunityPool = await lcd.distribution.getDistributionCommunityPool().catch(handleError);
    if(rawDistributionCommunityPool?.data?.pool) {
        const idxLuncInCP = rawDistributionCommunityPool.data.pool.findIndex(element => element.denom === "uluna");
        const idxUstcInCP = rawDistributionCommunityPool.data.pool.findIndex(element => element.denom === "uusd");

        if(idxLuncInCP > -1)
            tblAretourner['AmountOfLuncInCP'] = parseInt(rawDistributionCommunityPool.data.pool[idxLuncInCP].amount/1000000);
        else
            tblAretourner['AmountOfLuncInCP'] = 0;

        if(idxUstcInCP > -1)
            tblAretourner['AmountOfUstcInCP'] = parseInt(rawDistributionCommunityPool.data.pool[idxUstcInCP].amount/1000000);
        else
            tblAretourner['AmountOfUstcInCP'] = 0;

    }
    else
        return { "erreur": "Failed to fetch [distribution community pool] ..." }


    // Récupération des infos concernant le "oracle pool"
    const rawOraclePoolBalance = await lcd.bank.getOraclePoolBalance().catch(handleError);
    if(rawOraclePoolBalance?.data?.balances) {
        const idxLuncInCP = rawOraclePoolBalance.data.balances.findIndex(element => element.denom === "uluna");
        const idxUstcInCP = rawOraclePoolBalance.data.balances.findIndex(element => element.denom === "uusd");

        if(idxLuncInCP > -1)
            tblAretourner['AmountOfLuncInOP'] = parseInt(rawOraclePoolBalance.data.balances[idxLuncInCP].amount/1000000);
        else
            tblAretourner['AmountOfLuncInOP'] = 0;

        if(idxUstcInCP > -1)
            tblAretourner['AmountOfUstcInOP'] = parseInt(rawOraclePoolBalance.data.balances[idxUstcInCP].amount/1000000);
        else
            tblAretourner['AmountOfUstcInOP'] = 0;

    }
    else
        return { "erreur": "Failed to fetch [oracle pool balance] ..." }


    // Renvoie du tableau global/rempli, à la fin
    return tblAretourner;

}




const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}
