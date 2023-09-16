
import { tblGlobalInfos } from "../application/AppData";
import { LCDclient } from "../lcd/LCDclient";


export const loadNbStakedLunc = async () => {

    // Si donnée déjà chargée, on ne la recharge pas
    if(tblGlobalInfos['nbStakedLunc'])
        return tblGlobalInfos['nbStakedLunc'];
    

    // Création/récupération d'une instance de requétage LCD
    const lcd = LCDclient.getSingleton();
    // console.log('Récupération du nombre de LUNC stakés...');


    // Récupération du nombre de LUNC stakés
    const rawStakingPool = await lcd.staking.getStakingPool().catch(handleError);
    if(rawStakingPool?.data?.pool?.bonded_tokens)
        tblGlobalInfos['nbStakedLunc'] = parseInt(rawStakingPool.data.pool.bonded_tokens);      // en 'uluna'
    else
        return { "erreur": "Failed to fetch [staking pool] ..." }


    // Renvoi d'un tableau vide
    return tblGlobalInfos['nbStakedLunc'];
}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}