
import { LCDclient } from "../lcd/LCDclient";


export const loadBlockFromLCD = async (blockNum) => {
    
    const lcd = LCDclient.getSingleton();

    const rawLatestBlockInfoLCD = await lcd.tendermint.getBlockInfos(blockNum).catch(handleError);
    if(rawLatestBlockInfoLCD?.data?.block?.header) {
        return rawLatestBlockInfoLCD.data.block;
        // return {
        //     height : rawLatestBlockInfoLCD.data.block.header.height,
        //     datetime: rawLatestBlockInfoLCD.data.block.header.time
        // }    
    } else
        return { "erreur": "Failed to fetch [block " + blockNum + "] from LCD ..." }

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}