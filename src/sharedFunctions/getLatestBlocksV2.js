import { tblBlocks } from "../application/AppData";
import { FCDurl } from "../application/AppParams";
import { FCDclient } from "../fcd/FCDclient";
import { BlockInfo } from "../fcd/classes/BlockInfo";


export const loadLatestBlocks = async (nbre_de_block_a_charger) => {
    
    // Variables
    let last_block_height = -1;

    // Instanciation d'une classe de requetage FCD
    const fcd = new FCDclient(FCDurl);


    // Récupération du numéro de dernier block
    const rawLatestBlockInfo = await fcd.tendermint.askForBlockInfo().catch(handleError);
    if(rawLatestBlockInfo) {
        const latestBlockInfo = BlockInfo.extractFromTendermintBlockInfo(rawLatestBlockInfo);    
        last_block_height = latestBlockInfo.height;
    } else
        return { "erreur": "Failed to fetch [latest block] ..." }


    // Récupération des X derniers blocs
    for(let i=last_block_height ; i>(last_block_height-nbre_de_block_a_charger) ; i--) {
        // Vérification s'il n'a pas déjà été téléchargé auparavant
        if(!tblBlocks[i.toString()]) {
            // Téléchargement du bloc "i"
            const rawBlockInfo = await fcd.tendermint.askForBlockInfo(i).catch(handleError);
            if(rawBlockInfo) {
                const blockInfo = BlockInfo.extractFromTendermintBlockInfo(rawBlockInfo);    
                // tblBlocks["height"] = { nb_tx, validator_moniker, validator_address, datetime }
                tblBlocks[i.toString()] = {
                    "nb_tx": blockInfo.txs.length,
                    "validator_moniker": blockInfo.proposer.moniker,
                    "validator_address": blockInfo.proposer.operatorAddress,
                    "datetime": blockInfo.timestamp
                }
            } else
                return { "erreur": "Failed to fetch [block " +  + "] ..." }
        }
    
    }


    // Envoie du "block height" du latest_block, lu au moment de l'appel de cette fonction
    return last_block_height;
}


const handleError = (err) => {
    if(err.response && err.response.data)
    console.log("err.response.data", err.response.data);
else
    console.log(err);
}