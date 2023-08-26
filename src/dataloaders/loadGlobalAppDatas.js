import { loadValidatorsList } from "../sharedFunctions/getValidatorsV2";

export const loadGlobalAppDatas = async () => {

    // Chargement de la liste des validateurs, avant tout
    await loadValidatorsList();

    // Retour à l'appeleur
    return;
}