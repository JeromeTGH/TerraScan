import { TerraScanAPI } from "../../apis/terrascan-api/TerraScanAPI";

export const getLuncTotalSupplies = async (timeunit = 'H1', limit = 50) => {

    const tblAretourner = []

    // Création/récupération d'une instance de requétage TSAPI
    const tsapi = TerraScanAPI.getSingleton();

    // Préparation de la requête
    const params = new URLSearchParams();
    params.append('timeunit', timeunit);
    params.append('limit', limit);
        
    // Récupération de l'historique de la total supply du LUNC
    const rawTotalSuppliesHistory = await tsapi.totalsupplies.getPastValues(params).catch(handleError);
    if(rawTotalSuppliesHistory?.data) {
            tblAretourner['LuncSupplies'] = []
            tblAretourner['datetime'] = []

            // Extraction des données en plusieurs tableaux, pour alimenter le chart
            for(const lineofdata of rawTotalSuppliesHistory.data.reverse()) {
                tblAretourner['LuncSupplies'].push(lineofdata.luncAmount)
                tblAretourner['datetime'].push(new Date(lineofdata.datetimeUTC).toISOString().replace('T', ' ').replace(/.[0-9]*Z/, ''))
            }
    }
    else
        return { "erreur": "Failed to fetch [LUNC total supplies history] ..." }


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
