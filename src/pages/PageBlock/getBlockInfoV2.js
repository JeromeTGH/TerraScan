import { tblBlocks, tblValidators } from "../../application/AppData";
import { FCDclient } from "../../fcd/FCDclient";
import { BlockInfo } from "../../fcd/classes/BlockInfo";
import { loadValidatorsList } from "../../sharedFunctions/getValidatorsV2";


export const getBlockInfoV2 = async (blockNum) => {
    
    // Interroge le FCD, seulement si ce bloc n'a pas déjà été téléchargé en mémoire, précédemment
    if(!tblBlocks[blockNum.toString()] !== 12) {

        // Charge la liste des validateurs, si elle est vide
        await loadValidatorsList();

        // Récupération du singleton de la classe FCDclient
        const fcd = FCDclient.getSingleton();

        // Récupération des infos concernant le block recherché
        const rawBlockInfo = await fcd.tendermint.askForBlockInfo(blockNum).catch(handleError);
        if(rawBlockInfo) {
            // console.log("rawBlockInfo", rawBlockInfo);
            const blockInfo = BlockInfo.extractFromTendermintBlockInfo(rawBlockInfo);    
            // console.log("blockInfo", blockInfo);


            // Analyse/synthèse des transactions de ce block
            const tblTxs = [];
            for(const tx of blockInfo.txs) {
                console.log("tx", tx);

                // Description de la transaction (type : MsgDelegate, MsgSend, ..., sinon Multiple...)
                const tx_description = (tx.tx.value.msg.length === 1 ?
                            tx.tx.value.msg[0].type.split('/')[1]
                            : 'Multiple (' + tx.tx.value.msg.length + ')');

                // Détermination des potentiels "from" et "to"
                let tx_from_account = '';
                let tx_from_name = '';
                let tx_from_valoper = '';
                let tx_to_account = '';
                let tx_to_name = '';
                let tx_to_valoper = '';
                if(tx_description.includes("Msg")) {
                    switch (tx_description) {
                        case 'MsgSend':
                            tx_from_account = tx.tx.value.msg[0].value.from_address;
                            tx_to_account = tx.tx.value.msg[0].value.to_address;
                            break;
                        default:
                            break;
                    }
                }

                // Renseignement validateur, s'il s'agit de son compte (côté sender ou receiver)
                const isSenderValidatorAccount = Object.entries(tblValidators).find(lg => lg[1].terra1_account_address === tx_from_account);
                if(isSenderValidatorAccount) {
                    tx_from_name = isSenderValidatorAccount[1].description_moniker;
                    tx_from_valoper = isSenderValidatorAccount[0];
                }
                const isReceiverValidatorAccount = Object.entries(tblValidators).find(lg => lg[1].terra1_account_address === tx_to_account);
                if(isReceiverValidatorAccount) {
                    tx_to_name = isReceiverValidatorAccount[1].description_moniker;
                    tx_to_valoper = isReceiverValidatorAccount[0];
                }


                // Création d'un objet représentant la synthèse de cette transaction
                const objTx = {
                    'tx_hash': tx.txhash,
                    'tx_status': tx.code,
                    'tx_description': tx_description,
                    'tx_from_account': tx_from_account,
                    'tx_from_name': tx_from_name,
                    'tx_from_valoper': tx_from_valoper,
                    'tx_to_account': tx_to_account,
                    'tx_to_name': tx_to_name,
                    'tx_to_valoper': tx_to_valoper
                }
                tblTxs.push(objTx);
            }



            // Structure :
            //      tblBlocks["height"] = {
            //          nb_tx,
            //          validator_moniker,
            //          validator_address,
            //          datetime,
            //          txs [] of {tx_hash, tx_status, tx_description, tx_from_address, tx_from_moniker, tx_to_address, tx_to_moniker}
            //      }
            tblBlocks[blockNum.toString()] = {
                'nb_tx': blockInfo.txs.length,
                'validator_moniker': blockInfo.proposer.moniker,
                'validator_address': blockInfo.proposer.operatorAddress,
                'datetime': blockInfo.timestamp,
                'txs': tblTxs
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