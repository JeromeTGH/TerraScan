
import { loadLatestBlockHeightAndDateTime } from "../../dataloaders/loadLatestBlockHeightAndDateTime";
import { loadTotalSupplies } from "../../dataloaders/loadTotalSupplies";


export const loadCommonAppDatas = async () => {

    
    // ===============================
    // Chargement des données communes
    // ===============================
    
    // Structure du tableau qui sera retourné
    const tblRetour = {
        totalSupplies: null                 // Sera un : array of { amount, denom } ou { erreur }
    }

    // Récupération d'infos concernant le dernier block (son height, et son datetime)
    const infosLastBlock = await loadLatestBlockHeightAndDateTime();
    
    // Chargement des données
    tblRetour['totalSupplies'] = await loadTotalSupplies();
    tblRetour['latestBlock'] = { height: infosLastBlock.height, datetime: infosLastBlock.datetime};

    // Transmission des données
    return tblRetour;

}
