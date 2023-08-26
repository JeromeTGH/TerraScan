import { loadTotalSupplies } from "../../dataloaders/loadTotalSupplies";
import { loadValidators } from "../../dataloaders/loadValidators";


export const preloadDatas = async () => {

    // ==================================================
    // Chargement de la liste des validateurs, avant tout
    // ==================================================
    
        await loadValidators();

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
