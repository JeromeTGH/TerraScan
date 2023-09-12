import { LCDclient } from '../../lcd/LCDclient';


export const getStakingInfos = async () => {


    // Tableau à retourner
    const tblAretourner = {
        "LuncTotalSupply": null,
        "LuncBonded": null,
        "StakingPercentage": null
    }


    // Création/récupération d'une instance de requétage LCD
    const client_lcd = LCDclient.getSingleton();


    // Montage des paramètres nécessaires ici
    const params = new URLSearchParams();
    params.append("pagination.limit", 9999);


    // Récupération de la total supply du LUNC
    const rawTotalSupplies = await client_lcd.bank.getTotalSupplies(params).catch(handleError);
    if(rawTotalSupplies.data?.supply) {
        const idxLuncSupply = rawTotalSupplies.data.supply.findIndex(element => element.denom === "uluna");
        if(idxLuncSupply > -1)
            tblAretourner['LuncTotalSupply'] = parseInt(rawTotalSupplies.data.supply[idxLuncSupply].amount/1000000);
        else
            return { "erreur": "Failed to fetch [LUNC total supply] ..." }
    } else
        return { "erreur": "Failed to fetch [total supplies] ..." }


    // Récupération du nombre de LUNC stakés (bonded)
    const rawStakingPool = await client_lcd.staking.getStakingPool().catch(handleError);
    if(rawStakingPool?.data?.pool?.bonded_tokens)
        tblAretourner['LuncBonded'] = parseInt(rawStakingPool.data.pool.bonded_tokens/1000000);
    else
        return { "erreur": "Failed to fetch [staking pool] ..." }


    // Calcul du nombre de LUNC stakés
    tblAretourner['StakingPercentage'] = (tblAretourner['LuncBonded'] / tblAretourner['LuncTotalSupply'])*100;


    // Renvoie du tableau global/rempli, à la fin
    return tblAretourner;

}




const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}
