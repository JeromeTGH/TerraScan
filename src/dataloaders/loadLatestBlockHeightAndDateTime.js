import { FCDclient } from "../apis/fcd/FCDclient";
import { LCDclient } from "../apis/lcd/LCDclient";


export const loadLatestBlockHeightAndDateTime = async () => {

    // Variables
    let latestHeightFromLCD;
    // let latestDatetimeFromLCD;

    let latestHeightFromFCD;
    let latestDatetimeFromFCD;

    
    // Récupération du numéro de dernier block via ld LCD
    const lcd = LCDclient.getSingleton();
    const rawLatestBlockInfoLCD = await lcd.tendermint.getBlockInfos('latest').catch(handleError);
    if(rawLatestBlockInfoLCD?.data) {
        latestHeightFromLCD = rawLatestBlockInfoLCD.data.block.header.height;
        // latestDatetimeFromLCD = rawLatestBlockInfoLCD.data.block.header.time;
    } else
        return { "erreur": "Failed to fetch [latest block infos from LCD] ..." }

    
    // Récupération du numéro de dernier block via le FCD
    const fcd = FCDclient.getSingleton();
    const rawLatestBlockInfoFCD = await fcd.tendermint.getBlockInfos('latest').catch(handleError);
    if(rawLatestBlockInfoFCD?.data) {
        latestHeightFromFCD = rawLatestBlockInfoFCD.data.height;
        latestDatetimeFromFCD = rawLatestBlockInfoFCD.data.timestamp;
    } else
        return { "erreur": "Failed to fetch [latest block infos from FCD] ..." }


    // Check si écart important entre LCD et FCD
    if((latestHeightFromLCD - latestHeightFromFCD) > 10)
        return { "erreur": "WARNING : synchronization problem detected, between FCD and LCD. The displayed datas could be incorrect." }


    return {
        height : latestHeightFromFCD,
        datetime: latestDatetimeFromFCD
    }

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}