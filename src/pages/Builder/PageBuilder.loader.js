
import { tblLatestBlockAtAppLoading } from "../../application/AppData";
import { loadValidators } from "../../dataloaders/loadValidators"
import { FCDclient } from "../../fcd/FCDclient";
import { LCDclient } from "../../lcd/LCDclient";


export const preloads = async () => {

    // Variables
    let latestHeightFromLCD;
    let latestHeightFromFCD;

    // Chargement de la liste de tous les validateurs
    const validatorsPreload = await loadValidators();
    if(validatorsPreload['erreur']) {
        console.warn("ERROR : failed to fetch [validators list] from FCD");
        return { "erreur" : "failed to load datas from Terra\u00a0Classic\u00a0blockchain"};
    }

    // Récupération du latest block, via le LCD
    const lcd = LCDclient.getSingleton();
    const rawLatestBlockInfoLCD = await lcd.tendermint.getBlockInfos('latest').catch(handleError);
    if(rawLatestBlockInfoLCD?.data) {
        latestHeightFromLCD = rawLatestBlockInfoLCD.data.block.header.height;

        tblLatestBlockAtAppLoading['height'] = rawLatestBlockInfoLCD.data.block.header.height;
        tblLatestBlockAtAppLoading['datetime'] = rawLatestBlockInfoLCD.data.block.header.time;
    } else {
        console.warn("ERROR : failed to fetch [latest block] from LCD");
        return { "erreur" : "failed to load datas from Terra\u00a0Classic\u00a0blockchain"};
    }

    // Récupération du numéro de dernier block via le FCD
    const fcd = FCDclient.getSingleton();
    const rawLatestBlockInfoFCD = await fcd.tendermint.getBlockInfos('latest').catch(handleError);
    if(rawLatestBlockInfoFCD?.data) {
        latestHeightFromFCD = rawLatestBlockInfoFCD.data.height;
    } else {
        console.warn("ERROR : failed to fetch [latest block] from FCD");
        return { "erreur" : "failed to load datas from Terra\u00a0Classic\u00a0blockchain"};
    }

    // Vérifications rapides
    if(!latestHeightFromLCD) {
        console.warn("ERROR : latest block from LCD = undefined");
        return { "erreur" : "missing data in Terra\u00a0Classic\u00a0blockchain"};
    }
    if(!latestHeightFromFCD) {
        console.warn("ERROR : latest block from FCD = undefined");
        return { "erreur" : "missing data in Terra\u00a0Classic\u00a0blockchain"};
    }
    if((latestHeightFromLCD - latestHeightFromFCD) > 10) {
        console.warn("ERROR : synchronization problem detected, between FCD and LCD (latest block gap)");
        return { "erreur" : "synchronization problem detected in Terra\u00a0Classic\u00a0blockchain"};
    }


    // *****
    // Nota : le script "loadNbStakedLunc.js" est appelé par "loadValidators.js" ; le nbre de LUNC stakés est donc chargé dans la foulée, au chargement de l'app
    // *****


    // Si pas d'erreur, renvoi d'un objet vide
    return {}
}



const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}