import { TerraScanAPI } from "../../apis/terrascan-api/TerraScanAPI";

export const getHistoricalTotalSupplies = async () => {

    const tblAretourner = []

    // Création/récupération d'une instance de requétage TSAPI
    const tsapi = TerraScanAPI.getSingleton();
        
    // Récupération de l'historique des LUNC et USTC total supplies
    const rawTotalSuppliesHistory = await tsapi.totalsupplies.getPastValues().catch(handleError);
    if(rawTotalSuppliesHistory?.data) {
            tblAretourner['LuncSupplies'] = []
            tblAretourner['UstcSupplies'] = []
            tblAretourner['datetime'] = []

            // Extraction des données en plusieurs tableaux, pour alimenter les charts respectifs
            for(const lineofdata of rawTotalSuppliesHistory.data.reverse()) {
                tblAretourner['LuncSupplies'].push(lineofdata.luncAmount)
                tblAretourner['UstcSupplies'].push(lineofdata.ustcAmount)
                tblAretourner['datetime'].push(new Date(lineofdata.datetimeUTC).toLocaleString())
            }

    }
    else
        return { "erreur": "Failed to fetch [total supplies history] ..." }



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
