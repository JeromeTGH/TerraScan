import { LCDclient } from "../../lcd/LCDclient";

export const getCommonHomeDatas = async () => {

    // Structure du tableau qui sera retourné
    const tblRetour = {
        totalSupplies: null,                // Sera un : array of { amount, denom } ou { erreur }
    }


        // Création/récupération d'une instance de requétage LCD
        const client_lcd = LCDclient.getSingleton();

        // Montage des paramètres nécessaires ici
        const params = new URLSearchParams();
        params.append("pagination.limit", 9999);

        // Exécution de la requête de récupération des total supplies
        const rawTotalSupplies = await client_lcd.bank.getTotalSupplies(params).catch(handleError);
        if(rawTotalSupplies.data?.supply)
            tblRetour['totalSupplies'] = rawTotalSupplies.data.supply;
        else
            tblRetour['totalSupplies'] = { "erreur": "Failed to fetch [first txs] for votes ..." }






    // Envoie d'un objet vide en retour, pour signifier qu'aucune erreur ne s'est produite
    return tblRetour;

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}