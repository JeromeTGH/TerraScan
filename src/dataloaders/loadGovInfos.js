import { tblGovInfos } from "../application/AppData";

// *******************************************************************************
// Liste contenant des paramètres généraux concernant la gouvernance ("proposals")
// *******************************************************************************
// Structure :
//      tblGovInfos = {
//          nbJoursMaxPourDeposit,              // Nombre de jours max pour atteindre le depôt requis, afin qu'une proposition puisse passer au vote
//          nbLuncRequisPourValiderDeposit,     // Nombre minimum de LUNC à déposer, pour qu'une proposition puisse passer au vote
//          nbJoursMaxPourVoter,                // Nombre de jours max pour voter une proposition
//          pourcentageQuorum,                  // Quorum (nombre de votant minimum, pour qu'une décision de vote soit jugée valide)
//          pourcentageAcceptation,             // Pourcentage d'acceptation (threshold), pour une proposition donnée ; à comparer à : YES_votes / (YES_votes + NO_votes + VETO_votes)
//          pourcentageRefus,                   // Pourcentage de refus ;  ; à comparer à : NO_votes / (YES_votes + NO_votes + VETO_votes)
//          pourcentageVeto,                    // Pourcentage de vote sur une proposition, pour rejeter une proposition (en faisant perdre son dépôt au proposant)
//                                              // nota : ce pourcentage de VETO est à comparer à : VETO_votes / (YES_votes + NO_votes + VETO_votes)
//      }

export const loadGovInfos = async () => {
   
    
    // Classe de requétage LCD
    const client_lcd = LCDclient.getSingleton();


    // const rawLatestBlockInfoLCD = await client_lcd.tendermint.getBlockInfos(blockNum).catch(handleError);
    // if(rawLatestBlockInfoLCD?.data?.block?.header) {

        
    // } else
    //     return { "erreur": "Failed to fetch [block " + blockNum + "] from LCD ..." }








    // Récupération des infos concernant les dépôts (qté de LUNC nécessaire pour lancer le vote, et durée max de deposit)
    const rawDepositParameters = await client_lcd.gov.depositParameters().catch(handleError);
    if(rawDepositParameters) {
        governanceInfos['nbMinDepositLunc'] = parseInt(rawDepositParameters.min_deposit)/1000000; // coinsListToFormatedText(rawDepositParameters.min_deposit);
        governanceInfos['nbJoursMaxDeposit'] = rawDepositParameters.max_deposit_period / 3600 / 24;
    } else
        return { "erreur": "Failed to fetch [deposit parameters] ..." }


    // Récupération des infos concernant la durée maximal d'un vote
    const rawVotingParameters = await client_lcd.gov.votingParameters().catch(handleError);
    if(rawVotingParameters) {
        governanceInfos['nbJoursMaxPourVoter'] = rawVotingParameters.voting_period / 3600 / 24;
    } else
        return { "erreur": "Failed to fetch [voting parameters] ..." }

        
    // Règles de validation de vote
    const rawTallyParameters = await client_lcd.gov.tallyParameters().catch(handleError);
    if(rawTallyParameters) {
        const valQuorum = parseFloat(rawTallyParameters.quorum.toString())*100;                     // * 100 pour avoir ça en pourcentage
        const valThreshold = parseFloat(rawTallyParameters.threshold.toString())*100;
        const valVetoThreshold = parseFloat(rawTallyParameters.veto_threshold.toString())*100;
        governanceInfos['quorum'] = valQuorum;
        governanceInfos['seuilDacceptation'] = valThreshold;
        governanceInfos['seuilDeRefus'] = 100 - valThreshold;
        governanceInfos['seuilDeVeto'] = valVetoThreshold;
    } else
        return { "erreur": "Failed to fetch [tally parameters] ..." }
    

    // Envoi des infos en retour
    return governanceInfos;
}


const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}