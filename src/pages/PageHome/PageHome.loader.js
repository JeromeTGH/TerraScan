import { loadTotalSupplies } from "../../dataloaders/loadTotalSupplies";


export const loadCommonAppDatas = async () => {

    // ===============================
    // Chargement des données communes
    // ===============================

        // Structure du tableau qui sera retourné
        const tblRetour = {
            totalSupplies: null,                // Sera un : array of { amount, denom } ou { erreur }
        }

        // Chargement des données
        tblRetour['totalSupplies'] = await loadTotalSupplies();

        // Transmission des données
        return tblRetour;

}
