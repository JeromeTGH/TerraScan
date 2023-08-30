import { loadLatestBlockHeightAndDateTimeFromFCD } from "../../dataloaders/loadLatestBlockHeightAndDateTimeFromFCD";
import { loadTotalSupplies } from "../../dataloaders/loadTotalSupplies";


export const loadCommonAppDatas = async () => {

    // ===============================
    // Chargement des données communes
    // ===============================

    // Structure du tableau qui sera retourné
    const tblRetour = {
        totalSupplies: null,                    // Sera un : array of { amount, denom } ou { erreur }
        latestBlockHeightAndDatetime: null      // Sera un : array of { height, datetime } ou { erreur }
    }

    // Chargement des données
    tblRetour['totalSupplies'] = await loadTotalSupplies();
    tblRetour['latestBlockHeightAndDatetime'] = await loadLatestBlockHeightAndDateTimeFromFCD();

    // Transmission des données
    return tblRetour;

}
