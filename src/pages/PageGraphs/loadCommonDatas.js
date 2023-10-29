import { LCDclient } from "../../apis/lcd/LCDclient";

export const loadCommonDatas = async () => {

    // Tableau à retourner
    const tblAretourner = [];
    tblAretourner['datetime'] = new Date(Date.now()).toISOString().replace('T', ' ').replace(/.[0-9]*Z/, '');

    // Création/récupération d'une instance de requétage LCD
    const lcd = LCDclient.getSingleton();

    // Montage des paramètres nécessaires ici
    const params = new URLSearchParams();
    params.append("pagination.limit", 9999);

    // Récupération des actuelles valeurs de "total supplies", pour le LUNC et l'USTC
    const rawTotalSupplies = await lcd.bank.getTotalSupplies(params).catch(handleError);
    if(rawTotalSupplies.data?.supply) {
        const idxLuncTS = rawTotalSupplies.data.supply.findIndex(element => element.denom === "uluna");
        const idxUstcTS = rawTotalSupplies.data.supply.findIndex(element => element.denom === "uusd");

        if(idxLuncTS > -1)
            tblAretourner['lastLuncTotalSupply'] = parseInt(rawTotalSupplies.data.supply[idxLuncTS].amount/1000000);
        else
            tblAretourner['lastLuncTotalSupply'] = null;

        if(idxUstcTS > -1)
            tblAretourner['lastUstcTotalSupply'] = parseInt(rawTotalSupplies.data.supply[idxUstcTS].amount/1000000);
        else
            tblAretourner['lastUstcTotalSupply'] = null;
    }
    else
        return { "erreur": "Failed to fetch [actual total supply] ..." }


    // Récupération des actuels montants de LUNC et d'USTC, dans le community pool
    const rawDistributionCommunityPool = await lcd.distribution.getDistributionCommunityPool().catch(handleError);
    if(rawDistributionCommunityPool?.data?.pool) {
        const idxLuncInCP = rawDistributionCommunityPool.data.pool.findIndex(element => element.denom === "uluna");
        const idxUstcInCP = rawDistributionCommunityPool.data.pool.findIndex(element => element.denom === "uusd");

        if(idxLuncInCP > -1)
            tblAretourner['lastLuncAmountInCP'] = parseInt(rawDistributionCommunityPool.data.pool[idxLuncInCP].amount/1000000);
        else
            tblAretourner['lastLuncAmountInCP'] = null;

        if(idxUstcInCP > -1)
            tblAretourner['lastUstcAmountInCP'] = parseInt(rawDistributionCommunityPool.data.pool[idxUstcInCP].amount/1000000);
        else
            tblAretourner['lastUstcAmountInCP'] = null;

    }
    else
        return { "erreur": "Failed to fetch [actual community pool balance] ..." }


    // Récupération des actuels montants de LUNC et d'USTC, dans l'oracle pool
    const rawOraclePoolBalance = await lcd.bank.getOraclePoolBalance().catch(handleError);
    if(rawOraclePoolBalance?.data?.balances) {
        const idxLuncInCP = rawOraclePoolBalance.data.balances.findIndex(element => element.denom === "uluna");
        const idxUstcInCP = rawOraclePoolBalance.data.balances.findIndex(element => element.denom === "uusd");

        if(idxLuncInCP > -1)
            tblAretourner['lastLuncAmountInOP'] = parseInt(rawOraclePoolBalance.data.balances[idxLuncInCP].amount/1000000);
        else
            tblAretourner['lastLuncAmountInOP'] = null;

        if(idxUstcInCP > -1)
            tblAretourner['lastUstcAmountInOP'] = parseInt(rawOraclePoolBalance.data.balances[idxUstcInCP].amount/1000000);
        else
            tblAretourner['lastUstcAmountInOP'] = null;

    }
    else
        return { "erreur": "Failed to fetch [actual oracle pool balance] ..." }
    

    // Récupération du nombre de LUNC stakés
    const rawStakingPool = await lcd.staking.getStakingPool().catch(handleError);
    if(rawStakingPool?.data?.pool?.bonded_tokens) {
        tblAretourner['lastNbStakedLunc'] = parseInt(rawStakingPool.data.pool.bonded_tokens/1000000);
        if (tblAretourner['lastLuncTotalSupply'])
            tblAretourner['lastStakingRatio'] = parseFloat((tblAretourner['lastNbStakedLunc'] / tblAretourner['lastLuncTotalSupply'] * 100).toFixed(2));
        else
            tblAretourner['lastStakingRatio'] = null;
    }
    else
        return { "erreur": "Failed to fetch [actual nbStakedLunc] ..." }

    // Et envoi du tableau avec les valeurs générales
    // console.log("tblAretourner", tblAretourner);
    return tblAretourner;
}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}