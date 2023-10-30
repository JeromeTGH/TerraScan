import { TerraScanAPI } from "../../apis/terrascan-api/TerraScanAPI";

export const getNbStakedLunc = async (commonDatas, timeunit = 'H1', limit = 50) => {

    const tblAretourner = []

    // Création/récupération d'une instance de requétage TSAPI
    const tsapi = TerraScanAPI.getSingleton();

    // Préparation de la requête
    const params = new URLSearchParams();
    params.append('timeunit', timeunit);
    params.append('limit', limit);
        
    // Récupération de l'historique du nombre de LUNC stakés
    const rawLuncStaking = await tsapi.luncstaking.getPastValues(params).catch(handleError);
    if(rawLuncStaking?.data) {
        tblAretourner['NbStakedLunc'] = []
        tblAretourner['datetime'] = []
        tblAretourner['last'] = 0

        // Extraction des données en plusieurs tableaux, pour alimenter le chart
        for(const lineofdata of rawLuncStaking.data.reverse()) {
            tblAretourner['NbStakedLunc'].push(lineofdata.nbStakedLunc)
            tblAretourner['datetime'].push(new Date(lineofdata.datetimeUTC).toISOString().replace('T', ' ').replace(/.[0-9]*Z/, ''))
            tblAretourner['last'] = lineofdata.nbStakedLunc
        }

        if(commonDatas?.datetime && commonDatas?.lastNbStakedLunc) {
            tblAretourner['NbStakedLunc'].push(commonDatas.lastNbStakedLunc)
            tblAretourner['datetime'].push(commonDatas.datetime)
            tblAretourner['last'] = commonDatas.lastNbStakedLunc
        }
    }
    else
        return { "erreur": "Failed to fetch [NbStakedLunc history] ..." }


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
