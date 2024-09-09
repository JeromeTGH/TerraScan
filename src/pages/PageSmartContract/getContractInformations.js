
import { LCDclient } from '../../apis/lcd/LCDclient';


export const getContractInformations = async (contractAddress) => {

    // Préparation du tableau réponse en retour
    const objRetour = [];

    // Récupération du LCD
    const lcd = LCDclient.getSingleton();

    // Récupération des infos du smart contrat
    const rawSmartcontractInfos = await lcd.cosmwasm.getContractInfo(contractAddress).catch(handleError);

    if(rawSmartcontractInfos?.data) {
        if(rawSmartcontractInfos.data.contract_info) {
            objRetour['code_id'] = rawSmartcontractInfos.data.contract_info.code_id ? rawSmartcontractInfos.data.contract_info.code_id : null;
            objRetour['creator'] = rawSmartcontractInfos.data.contract_info.creator ? rawSmartcontractInfos.data.contract_info.creator : null;
            objRetour['admin'] = rawSmartcontractInfos.data.contract_info.admin ? rawSmartcontractInfos.data.contract_info.admin : null;
            objRetour['label'] = rawSmartcontractInfos.data.contract_info.label ? rawSmartcontractInfos.data.contract_info.label : null;
            objRetour['block_height'] = rawSmartcontractInfos.data.contract_info.created?.block_height ? rawSmartcontractInfos.data.contract_info.created.block_height : null;
            objRetour['tx_index'] = rawSmartcontractInfos.data.contract_info.created?.tx_index ? rawSmartcontractInfos.data.contract_info.created.tx_index : null;
            objRetour['ibc_port_id'] = rawSmartcontractInfos.data.contract_info.ibc_port_id ? rawSmartcontractInfos.data.contract_info.ibc_port_id : null;
        } else
            return { "erreur": "Failed to fetch [data.contract_info] from LCD response, sorry" }
    } else
        return { "erreur": "Failed to fetch [contract infos] from LCD, sorry" }


    // Récupération des infos du smart contrat
    const rawSmartcontractHistory = await lcd.cosmwasm.getContractHistory(contractAddress).catch(handleError);

    if(rawSmartcontractHistory?.data) {
// console.log("data", rawSmartcontractHistory.data);
        if(rawSmartcontractHistory.data.entries && rawSmartcontractHistory.data.entries.length >= 1) {
            objRetour['entries'] = rawSmartcontractHistory.data.entries;
            const msg = rawSmartcontractHistory.data.entries[0].msg ? rawSmartcontractHistory.data.entries[0].msg : null
            if(msg) {
                objRetour['msg'] = msg;
                objRetour['decimals'] = msg.decimals ? msg.decimals : null;
                objRetour['initial_balances_amount'] = msg.initial_balances?.amount ? msg.initial_balances.amount : null;
                objRetour['mint_cap'] = msg.mint?.cap ? msg.mint.cap : null;
                objRetour['name'] = msg.name ? msg.name : null;
                objRetour['symbol'] = msg.symbol ? msg.symbol : null;
            } else {
                objRetour['msg'] = null;
                objRetour['decimals'] = null;
                objRetour['initial_balances_amount'] = null;
                objRetour['mint_cap'] = null;
                objRetour['name'] = null;
                objRetour['symbol'] = null;
            }

            // ----------------------------
            // MAJ manuelle, pour l'instant
            // ----------------------------
            // JURIS
                        // {
                        //   "new_info": {
                        //     "name": "Juris Protocol",
                        //     "symbol": "JURIS"
                        //   }
                        // }
            objRetour['name'] = objRetour['name'] ? objRetour['name'].replace("RakoffToken", "Juris Protocol") : null;
            objRetour['symbol'] = objRetour['symbol'] ? objRetour['symbol'].replace("Rakoff", "JURIS") : null;
            // Garuda Universe Hybrid Staking - GRDX
            objRetour['name'] = contractAddress === "terra1x0d9yex70ngag7z5v7zcmsx6pk7fc6el5lt5qsaeycvqd7mq8vvqpak8v7" ? "Garuda Universe Hybrid Staking" : objRetour['name'];
            objRetour['symbol'] = contractAddress === "terra1x0d9yex70ngag7z5v7zcmsx6pk7fc6el5lt5qsaeycvqd7mq8vvqpak8v7" ? "GRDX" : objRetour['symbol'];

            // ----------------------------

        } else
            return { "erreur": "Failed to fetch [data.entries] from LCD response, sorry" }
    } else
        return { "erreur": "Failed to fetch [contract history] from LCD, sorry" }

    // Si aucune erreur ne s'est produite, alors on renvoie l'objet complété
// console.log("contract informations", objRetour);
    return objRetour;
}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}