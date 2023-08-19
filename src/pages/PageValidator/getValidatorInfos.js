import { tblValidators } from "../../application/AppData";
import { loadValidatorsList } from "../../sharedFunctions/getValidatorsV2";

export const loadValidator = async (valAddress) => {
    
    // Chargement seulement si ça n'a pas déjà été fait auparavant (toujours en mémoire, je veux dire)
    if(Object.keys(tblValidators).length === 0) {
        await loadValidatorsList();
    } 

    // Envoie d'un objet vide en retour, pour signifier qu'aucune erreur ne s'est produite
    return {};

}
