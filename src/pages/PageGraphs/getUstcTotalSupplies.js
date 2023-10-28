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
        const tblDatas = rawTotalSuppliesHistory.data.reverse();
        tblAretourner['donnees'] = [];
        tblAretourner['last'] = 0;

        // Extraction des données en plusieurs tableaux, pour alimenter le chart
        let precedentClose;
        for(let idx = 0 ; idx < tblDatas.length ; idx++) {
            if(idx === 0) {
                precedentClose = tblDatas[0].ustcAmount;
            } else {
                const datetime = new Date(tblDatas[idx].datetimeUTC).toISOString().replace('T', ' ').replace(/.[0-9]*Z/, '');
                const valTotalSupply = tblDatas[idx].ustcAmount

                const candle = []
                candle.push(precedentClose)
                candle.push(precedentClose > valTotalSupply ? precedentClose : valTotalSupply)
                candle.push(precedentClose < valTotalSupply ? precedentClose : valTotalSupply)
                candle.push(valTotalSupply)

                tblAretourner['donnees'].push({ x: datetime, y: candle});

                precedentClose = tblDatas[idx].ustcAmount;
            }
            tblAretourner['last'] = tblDatas[idx].ustcAmount
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
