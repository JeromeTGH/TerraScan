import { TerraScanAPI } from "../../apis/terrascan-api/TerraScanAPI";

export const getStakingRatio = async (timeunit = 'H1', limit = 50) => {

    const tblAretourner = []

    // Création/récupération d'une instance de requétage TSAPI
    const tsapi = TerraScanAPI.getSingleton();

    // Préparation de la requête
    const params = new URLSearchParams();
    params.append('timeunit', timeunit);
    params.append('limit', limit);
        
    // Récupération de l'historique du ratio de staking
    const rawLuncStaking = await tsapi.luncstaking.getPastValues(params).catch(handleError);
    if(rawLuncStaking?.data) {
            tblAretourner['StakingRatio'] = []
            tblAretourner['datetime'] = []

            // Extraction des données en plusieurs tableaux, pour alimenter le chart
            for(const lineofdata of rawLuncStaking.data.reverse()) {
                tblAretourner['StakingRatio'].push(lineofdata.stakingPercentage)
                tblAretourner['datetime'].push(new Date(lineofdata.datetimeUTC).toISOString().replace('T', ' ').replace(/.[0-9]*Z/, ''))
            }
    }
    else
        return { "erreur": "Failed to fetch [StakingRatio history] ..." }


    // Renvoie du tableau global/rempli, à la fin
    // console.log(tblAretourner);
    return tblAretourner;

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}
