import { TerraScanAPI } from "../../apis/terrascan-api/TerraScanAPI";

export const getUstcTotalSupplies = async (timeunit = 'H1', limit = 50) => {

    const tblAretourner = []

    // Création/récupération d'une instance de requétage TSAPI
    const tsapi = TerraScanAPI.getSingleton();

    // Préparation de la requête
    const params = new URLSearchParams();
    params.append('timeunit', timeunit);
    params.append('limit', limit);
        
    // Récupération de l'historique de la total supply de l'USTC
    const rawTotalSuppliesHistory = await tsapi.totalsupplies.getPastValues(params).catch(handleError);
    if(rawTotalSuppliesHistory?.data) {
            tblAretourner['UstcSupplies'] = []
            tblAretourner['datetime'] = []

            // Extraction des données en plusieurs tableaux, pour alimenter le chart
            for(const lineofdata of rawTotalSuppliesHistory.data.reverse()) {
                tblAretourner['UstcSupplies'].push(lineofdata.ustcAmount)
                tblAretourner['datetime'].push(new Date(lineofdata.datetimeUTC).toLocaleString())
            }
    }
    else
        return { "erreur": "Failed to fetch [USTC total supplies history] ..." }


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
