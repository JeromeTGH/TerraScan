import { LCDclient } from "../lcd/LCDclient";

export const loadTotalSupplies = async () => {

    // Création/récupération d'une instance de requétage LCD
    const client_lcd = LCDclient.getSingleton();

    // Montage des paramètres nécessaires ici
    const params = new URLSearchParams();
    params.append("pagination.limit", 9999);

    // Exécution de la requête de récupération des total supplies
    const rawTotalSupplies = await client_lcd.bank.getTotalSupplies(params).catch(handleError);
    if(rawTotalSupplies.data?.supply)
        return rawTotalSupplies.data.supply;
    else
        return { "erreur": "Failed to fetch [total supply] ..." }

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}