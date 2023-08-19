import { tblBlocks } from "../../application/AppData";
import { FCDclient } from "../../fcd/FCDclient";
import { BlockInfo } from "../../fcd/classes/BlockInfo";


export const getBlockInfoV2 = async (blockNum) => {
    
    // Interroge le FCD, seulement si ce bloc n'a pas déjà été téléchargé en mémoire, précédemment
    if(!tblBlocks[blockNum.toString()] !== 12) {

        // Récupération du singleton de la classe FCDclient
        const fcd = FCDclient.getSingleton();

        // Récupération des infos concernant le block recherché
        const rawBlockInfo = await fcd.tendermint.askForBlockInfo(blockNum).catch(handleError);
        if(rawBlockInfo) {
            const blockInfo = BlockInfo.extractFromTendermintBlockInfo(rawBlockInfo);    


            console.log("blockInfo", blockInfo);



            // tblBlocks["height"] = { nb_tx, validator_moniker, validator_address, datetime }
            tblBlocks[blockNum.toString()] = {
                'nb_tx': blockInfo.txs.length,
                'validator_moniker': blockInfo.proposer.moniker,
                'validator_address': blockInfo.proposer.operatorAddress,
                'datetime': blockInfo.timestamp
            }
        } else
            return { "erreur": "Failed to fetch [block " +  + "] ..." }
    }


    // Envoie du "block height" recherché, pour signifier qu'il n'y a pas eu d'erreur
    return blockNum;
}


const handleError = (err) => {
    if(err.response && err.response.data)
    console.log("err.response.data", err.response.data);
else
    console.log(err);
}