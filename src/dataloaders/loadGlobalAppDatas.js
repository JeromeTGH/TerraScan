import { loadValidators } from "./loadValidators";

export const loadGlobalAppDatas = async () => {

    // Chargement de la liste des validateurs, avant tout
    await loadValidators();

    // Retour à l'appeleur
    return;
}