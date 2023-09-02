import { tblBlocks } from "../application/AppData";
import { FCDclient } from "../fcd/FCDclient";
import { BlockInfo } from "../fcd/classes/BlockInfo";


export const loadLatestBlocks = async (nbre_de_block_a_charger, given_height = -1) => {
    
    // Variables
    let last_block_height = -1;

    // Instanciation d'une classe de requetage FCD
    const fcd = FCDclient.getSingleton();

    if(given_height === -1) {
        // console.log("Given height=none");
        
        // Récupération du numéro de dernier block, si non passé en argument
        const rawlastBlockInfo = await fcd.tendermint.getBlockInfos('latest').catch(handleError);
        if(rawlastBlockInfo) {
            const lastBlockInfo = BlockInfo.extractFromTendermintBlockInfos(rawlastBlockInfo);    
            last_block_height = lastBlockInfo.height;
        } else
            return { "erreur": "Failed to fetch [latest block] ..." }
    } else {
        // console.log("Given height=" + given_height);
        last_block_height = given_height;
    }


    // Récupération des X derniers blocs
    for(let i=last_block_height ; i>(last_block_height-nbre_de_block_a_charger) ; i--) {
        // Vérification s'il n'a pas déjà été téléchargé auparavant
        if(!tblBlocks[i.toString()]) {
            // Téléchargement du bloc "i"
            const rawBlockInfo = await fcd.tendermint.getBlockInfos(i).catch(handleError);
            if(rawBlockInfo) {
                const blockInfo = BlockInfo.extractFromTendermintBlockInfos(rawBlockInfo);
                // Structure :
                //      tblBlocks["height"] = {
                //          nb_tx,
                //          validator_moniker,
                //          validator_address,
                //          datetime,
                //          [tx_hash, tx_description, tx_from, tx_to]
                //      }
                tblBlocks[i.toString()] = {
                    'nb_tx': blockInfo.txs.length,
                    'validator_moniker': blockInfo.proposer.moniker,
                    'validator_address': blockInfo.proposer.operatorAddress,
                    'datetime': blockInfo.timestamp
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
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}