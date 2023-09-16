
import { LCDclient } from '../lcd/LCDclient';
import { tblGlobalInfos } from '../application/AppData';


export const loadSomeGeneralnfos = async () => {

    // Si données déjà chargées, alors on quitte
    if(tblGlobalInfos && tblGlobalInfos['DistributionModuleSplitToCommunityPool'])
        return {}

    // Création/récupération d'une instance de requétage LCD
    const lcd = LCDclient.getSingleton();
    // console.log("load general infos");


    // Récupération des paramètres du module Staking (plus exactement : l'unbonding_time, et le max_validators)
    const rawStakingParameters = await lcd.staking.getStakingParameters().catch(handleError);
    if(rawStakingParameters?.data?.params) {
        tblGlobalInfos['UnbondingTime'] = parseInt(rawStakingParameters.data.params.unbonding_time.replace('s', '')) / 3600 / 24;       // Transformation nbSecondes --> nbJours
        tblGlobalInfos['NbMaxValidators'] = rawStakingParameters.data.params.max_validators;
    }
    else
        return { "erreur": "Failed to fetch [staking parameters] ..." }


    // Récupération du taux d'inflation max
    const rawMintParameters = await lcd.mint.getMintParameters().catch(handleError);
    if(rawMintParameters?.data?.params) {
        tblGlobalInfos['InflationMax'] = rawMintParameters.data.params.inflation_max * 100;
    }
    else
        return { "erreur": "Failed to fetch [mint parameters] ..." }


    // Récupération de la taxe tobin max (initialement nommée la "taxe burn"), et des paramètres de son split
    const rawTreasuryParameters = await lcd.treasury.getTreasuryParameters().catch(handleError);
    if(rawTreasuryParameters?.data?.params) {
        tblGlobalInfos['TobinTaxMax'] = rawTreasuryParameters.data.params.tax_policy.rate_max * 100;
        tblGlobalInfos['TobinTaxSplitToDistributionModule'] = rawTreasuryParameters.data.params.burn_tax_split * 100;
        tblGlobalInfos['TobinTaxSplitToBeBurn'] = 100 - tblGlobalInfos['TobinTaxSplitToDistributionModule'];
    }
    else
        return { "erreur": "Failed to fetch [treasury parameters] ..." }


    // Récupération des infos concernant le split du "distribution module"
    const rawDistributionParameters = await lcd.distribution.getDistributionParameters().catch(handleError);
    if(rawDistributionParameters?.data?.params) {
        tblGlobalInfos['DistributionModuleSplitToStakers'] = rawDistributionParameters.data.params.community_tax * 100;
        tblGlobalInfos['DistributionModuleSplitToCommunityPool'] = 100 - tblGlobalInfos['DistributionModuleSplitToStakers'];
    }
    else
        return { "erreur": "Failed to fetch [distribution parameters] ..." }


    // Renvoie d'un tableau vide à la fin, si pas d'erreur
    return {};

}




const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}
