import { tblProposals } from "../application/AppData";
import { LCDclient } from "../apis/lcd/LCDclient";


export const loadProposals = async () => {
   
    // Si ces données sont déjà chargées (ou un ID en particulier), alors on ne les recharge pas
    if(tblProposals && tblProposals.length > 0)
        return {};

        
    // Classe de requétage LCD
    const lcd = LCDclient.getSingleton();
    // console.log("Chargement de toutes les proposals...");

    // Montage des paramètres nécessaires ici
    const params = new URLSearchParams();
    params.append("pagination.limit", 100);
    // params.append("pagination.limit", 9999);             // Ne fonctionne plus, à présent
    params.append("pagination.reverse", "true");
    

    // Récupération de toutes les propositions
    const rawProposals = await lcd.gov.getProposals(params).catch(handleError);
    if(rawProposals?.data?.proposals) {
        // console.log("rawProposals.data.proposals", rawProposals.data.proposals);
        //tblProposals.push(...rawProposals.data.proposals.reverse());            // Enregistrement dans tableau, avec tri du plus récent au plus ancien
        tblProposals.push(...rawProposals.data.proposals);          // Annulation de l'inversion
        // console.log("tblProposals", tblProposals);
    } else
        return { "erreur": "Failed to fetch [proposals] ..." }

    
    // Si aucun soucis, on renvoie un objet vide
    return {}

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}