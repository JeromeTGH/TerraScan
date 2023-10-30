import { TerraScanAPI } from "../../apis/terrascan-api/TerraScanAPI";

export const getOraclePool = async (commonDatas, timeunit = 'H1', limit = 50) => {

    const tblAretourner = []

    // Création/récupération d'une instance de requétage TSAPI
    const tsapi = TerraScanAPI.getSingleton();

    // Préparation de la requête
    const params = new URLSearchParams();
    params.append('timeunit', timeunit);
    params.append('limit', limit);
        
    // Récupération de l'historique du nombre de LUNC et USTC de "l'oracle pool"
    const rawOraclePool = await tsapi.oraclepool.getPastValues(params).catch(handleError);
    if(rawOraclePool?.data) {
        tblAretourner['nbLuncInOP'] = []
        tblAretourner['nbUstcInOP'] = []
        tblAretourner['datetime'] = []
        tblAretourner['lastLunc'] = 0
        tblAretourner['lastUstc'] = 0
        tblAretourner['minLunc'] = 9999999999999
        tblAretourner['minUstc'] = 9999999999999
        tblAretourner['maxLunc'] = 0
        tblAretourner['maxUstc'] = 0

        // Extraction des données en plusieurs tableaux, pour alimenter le chart
        for(const lineofdata of rawOraclePool.data.reverse()) {
            tblAretourner['nbLuncInOP'].push(lineofdata.nbLuncInOP)
            tblAretourner['nbUstcInOP'].push(lineofdata.nbUstcInOP)
            tblAretourner['datetime'].push(new Date(lineofdata.datetimeUTC).toISOString().replace('T', ' ').replace(/.[0-9]*Z/, ''))
            tblAretourner['lastLunc'] = lineofdata.nbLuncInOP
            tblAretourner['lastUstc'] = lineofdata.nbUstcInOP
            if(lineofdata.nbLuncInOP < tblAretourner['minLunc'])
                tblAretourner['minLunc'] = lineofdata.nbLuncInOP
            if(lineofdata.nbUstcInOP < tblAretourner['minUstc'])
                tblAretourner['minUstc'] = lineofdata.nbUstcInOP
            if(lineofdata.nbLuncInOP > tblAretourner['maxLunc'])
                tblAretourner['maxLunc'] = lineofdata.nbLuncInOP
            if(lineofdata.nbUstcInOP > tblAretourner['maxUstc'])
                tblAretourner['maxUstc'] = lineofdata.nbUstcInOP
        }

        if(commonDatas?.datetime && commonDatas?.lastLuncAmountInOP && commonDatas?.lastUstcAmountInOP) {
            tblAretourner['nbLuncInOP'].push(commonDatas.lastLuncAmountInOP)
            tblAretourner['nbUstcInOP'].push(commonDatas.lastUstcAmountInOP)
            tblAretourner['datetime'].push(commonDatas.datetime)
            tblAretourner['lastLunc'] = commonDatas.lastLuncAmountInOP
            tblAretourner['lastUstc'] = commonDatas.lastUstcAmountInOP
            if(commonDatas.lastLuncAmountInOP < tblAretourner['minLunc'])
                tblAretourner['minLunc'] = commonDatas.lastLuncAmountInOP
            if(commonDatas.lastUstcAmountInOP < tblAretourner['minUstc'])
                tblAretourner['minUstc'] = commonDatas.lastUstcAmountInOP
            if(commonDatas.lastLuncAmountInOP > tblAretourner['maxLunc'])
                tblAretourner['maxLunc'] = commonDatas.lastLuncAmountInOP
            if(commonDatas.lastUstcAmountInOP > tblAretourner['maxUstc'])
                tblAretourner['maxUstc'] = commonDatas.lastUstcAmountInOP
        }
    }
    else
        return { "erreur": "Failed to fetch [OraclePool history] ..." }


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
