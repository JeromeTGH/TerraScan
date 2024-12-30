
import { LCDclient } from '../apis/lcd/LCDclient';

export const loadBurnTaxExemptionList = async () => {

    // Création/récupération d'une instance de requétage LCD
    const lcd = LCDclient.getSingleton();

    // Récupération de la liste des adresses exemptes de la burn tax
    const rawTreasuryBurnTaxExemptionList = await lcd.treasury.getBurnTaxExemptionList().catch(handleError);    
    if(rawTreasuryBurnTaxExemptionList?.data?.addresses) {
        return { "donnees": rawTreasuryBurnTaxExemptionList.data.addresses };
    }
    else
        return { "erreur": "Failed to fetch [treasury burn tax exemption list] ..." }

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}
