import { tblGovInfos } from "../application/AppData";
import { LCDclient } from "../lcd/LCDclient";


export const loadGovInfos = async () => {
   
    // Si ces données sont déjà chargées, alors on ne les recharge pas
    if(tblGovInfos && tblGovInfos['pourcentageVeto'])
        return {};

        
    // Classe de requétage LCD
    const client_lcd = LCDclient.getSingleton();
    console.log("Chargement des paramètres de gouvernance...");

    // Récupération des infos concernant les dépôts (qté de LUNC nécessaires pour lancer le vote, et durée max de deposit)
    const rawDepositParameters = await client_lcd.gov.getDepositParameters().catch(handleError);
    if(rawDepositParameters?.data?.deposit_params) {
        for(const deposit of rawDepositParameters.data.deposit_params.min_deposit) {
            if(deposit.denom === 'uluna')
                tblGovInfos['nbLuncRequisPourValiderDeposit'] = parseInt(deposit.amount) / 1000000;
        }
        tblGovInfos['nbJoursMaxPourDeposit'] = parseInt(rawDepositParameters.data.deposit_params.max_deposit_period.replace('s', '')) / 3600 / 24;
    } else
        return { "erreur": "Failed to fetch [deposit parameters] ..." }


    // Récupération des infos concernant la durée maximal d'un vote
    const rawVotingParameters = await client_lcd.gov.getVotingParameters().catch(handleError);
    if(rawVotingParameters?.data?.voting_params?.voting_period) {
        tblGovInfos['nbJoursMaxPourVoter'] = parseInt(rawVotingParameters.data.voting_params.voting_period.replace('s', '')) / 3600 / 24;
    } else
        return { "erreur": "Failed to fetch [voting parameters] ..." }

        
    // Règles de validation de vote
    const rawTallyParameters = await client_lcd.gov.getTallyParameters().catch(handleError);
    if(rawTallyParameters?.data?.tally_params) {
        tblGovInfos['pourcentageQuorum'] = parseFloat(rawTallyParameters.data.tally_params.quorum) * 100;
        tblGovInfos['pourcentageAcceptation'] = parseFloat(rawTallyParameters.data.tally_params.threshold) * 100;
        tblGovInfos['pourcentageRefus'] = 100 - tblGovInfos['pourcentageAcceptation'];
        tblGovInfos['pourcentageVeto'] = parseFloat(rawTallyParameters.data.tally_params.veto_threshold) * 100;
    } else
        return { "erreur": "Failed to fetch [tally parameters] ..." }
 
    return {}

}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}