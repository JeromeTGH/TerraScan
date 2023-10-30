import { TerraScanAPI } from "../../apis/terrascan-api/TerraScanAPI";

export const getCommunityPool = async (commonDatas, timeunit = 'H1', limit = 50) => {

    const tblAretourner = []

    // Création/récupération d'une instance de requétage TSAPI
    const tsapi = TerraScanAPI.getSingleton();

    // Préparation de la requête
    const params = new URLSearchParams();
    params.append('timeunit', timeunit);
    params.append('limit', limit);
        
    // Récupération de l'historique du nombre de LUNC et USTC du "community pool"
    const rawCommunityPool = await tsapi.communitypool.getPastValues(params).catch(handleError);
    if(rawCommunityPool?.data) {
        tblAretourner['nbLuncInCP'] = []
        tblAretourner['nbUstcInCP'] = []
        tblAretourner['datetime'] = []
        tblAretourner['lastLunc'] = 0
        tblAretourner['lastUstc'] = 0
        tblAretourner['minLunc'] = 9999999999999
        tblAretourner['minUstc'] = 9999999999999
        tblAretourner['maxLunc'] = 0
        tblAretourner['maxUstc'] = 0

        // Extraction des données en plusieurs tableaux, pour alimenter le chart
        for(const lineofdata of rawCommunityPool.data.reverse()) {
            tblAretourner['nbLuncInCP'].push(lineofdata.nbLuncInCP)
            tblAretourner['nbUstcInCP'].push(lineofdata.nbUstcInCP)
            tblAretourner['datetime'].push(new Date(lineofdata.datetimeUTC).toISOString().replace('T', ' ').replace(/.[0-9]*Z/, ''))
            tblAretourner['lastLunc'] = lineofdata.nbLuncInCP
            tblAretourner['lastUstc'] = lineofdata.nbUstcInCP
            if(lineofdata.nbLuncInCP < tblAretourner['minLunc'])
                tblAretourner['minLunc'] = lineofdata.nbLuncInCP
            if(lineofdata.nbUstcInCP < tblAretourner['minUstc'])
                tblAretourner['minUstc'] = lineofdata.nbUstcInCP
            if(lineofdata.nbLuncInCP > tblAretourner['maxLunc'])
                tblAretourner['maxLunc'] = lineofdata.nbLuncInCP
            if(lineofdata.nbUstcInCP > tblAretourner['maxUstc'])
                tblAretourner['maxUstc'] = lineofdata.nbUstcInCP
        }

        if(commonDatas?.datetime && commonDatas?.lastLuncAmountInCP && commonDatas?.lastUstcAmountInCP) {
            tblAretourner['nbLuncInCP'].push(commonDatas.lastLuncAmountInCP)
            tblAretourner['nbUstcInCP'].push(commonDatas.lastUstcAmountInCP)
            tblAretourner['datetime'].push(commonDatas.datetime)
            tblAretourner['lastLunc'] = commonDatas.lastLuncAmountInCP
            tblAretourner['lastUstc'] = commonDatas.lastUstcAmountInCP
            if(commonDatas.lastLuncAmountInCP < tblAretourner['minLunc'])
                tblAretourner['minLunc'] = commonDatas.lastLuncAmountInCP
            if(commonDatas.lastUstcAmountInCP < tblAretourner['minUstc'])
                tblAretourner['minUstc'] = commonDatas.lastUstcAmountInCP
            if(commonDatas.lastLuncAmountInCP > tblAretourner['maxLunc'])
                tblAretourner['maxLunc'] = commonDatas.lastLuncAmountInCP
            if(commonDatas.lastUstcAmountInCP > tblAretourner['maxUstc'])
                tblAretourner['maxUstc'] = commonDatas.lastUstcAmountInCP
        }
    }
    else
        return { "erreur": "Failed to fetch [CommunityPool history] ..." }


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
