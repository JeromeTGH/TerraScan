import { FCDclient } from "../fcd/FCDclient";


export const loadLatestBlockHeightAndDateTimeFromFCD = async () => {

    // Instanciation d'une classe de requetage FCD
    const fcd = FCDclient.getSingleton();

    // Récupération du numéro de dernier block
    const rawLatestBlockInfo = await fcd.tendermint.getBlockInfos('latest').catch(handleError);
    if(rawLatestBlockInfo?.data) {
        return {
            height : rawLatestBlockInfo.data.height,
            datetime: rawLatestBlockInfo.data.timestamp
        }
    } else
        return { "erreur": "Failed to fetch [latest block infos] ..." }

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}