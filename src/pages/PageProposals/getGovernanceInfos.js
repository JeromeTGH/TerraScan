import { chainID, chainLCDurl, tblCorrespondanceValeurs } from '../../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';
import { formateLeNombre } from '../../application/AppUtils';


export const getGovernanceInfos = async () => {

    const governanceInfos = {
        'nbJoursMaxDeposit': null,      // Nombre de jours max, pour valider un depôt, et passer au vote
        'nbMinDepositLunc': null,       // Nombre minimum de LUNC à déposer, pour valider une proposition, pour qu'elle passe au vote
        'nbJoursMaxPourVoter': null,    // Nombre de jours max pour voter une proposition
        'quorum': null,                 // Quorum (nombre de votant minimum, pour qu'une décision soit jugée valide)
        'seuilDacceptation': null,      // Seuil d'acceptation (threshold), pour une proposition
        'seuilDeRefus': null,           // 100% - pourcentage d'acceptation
        'seuilDeVeto': null,            // Seuil de veto sur une proposition (veto_threshold), pour rejeter une proposition (en faisant perdre son dépôt au proposant)
    }

   
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération des infos concernant les dépôts (qté de LUNC nécessaire pour lancer le vote, et durée max de deposit)
    const rawDepositParameters = await lcd.gov.depositParameters().catch(handleError);
    if(rawDepositParameters) {
        governanceInfos['nbMinDepositLunc'] = coinsListToFormatedText(rawDepositParameters.min_deposit);
        governanceInfos['nbJoursMaxDeposit'] = rawDepositParameters.max_deposit_period / 3600 / 24;
    } else
        return { "erreur": "Failed to fetch [deposit parameters] ..." }


    // Récupération des infos concernant la durée maximal d'un vote
    const rawVotingParameters = await lcd.gov.votingParameters().catch(handleError);
    if(rawVotingParameters) {
        governanceInfos['nbJoursMaxPourVoter'] = rawVotingParameters.voting_period / 3600 / 24;
    } else
        return { "erreur": "Failed to fetch [voting parameters] ..." }

        
    // Règles de validation de vote
    const rawTallyParameters = await lcd.gov.tallyParameters().catch(handleError);
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


// ===========================
// Log les éventuelles erreurs
// ===========================
const handleError = (err) => {
    console.log("ERREUR", err);
}


// ======================================================================
// Créé un STRING avec montant+devise, séparé de virgules si multidevises
// ======================================================================
const coinsListToFormatedText = (coinsList) => {
    const dataCoinsList = (new Coins(coinsList)).toData();
    let retour = "";
    
    if(dataCoinsList.length > 0) {
        for(let i=0 ; i < dataCoinsList.length ; i++) {
            const msgAmount = formateLeNombre(dataCoinsList[i].amount/1000000, ' ');
            const msgCoin = tblCorrespondanceValeurs[dataCoinsList[i].denom] ? tblCorrespondanceValeurs[dataCoinsList[i].denom] : dataCoinsList[i].denom;
            if(retour !== "")
                retour += ", ";
            retour += (msgAmount + "\u00a0" + msgCoin);
        }
    } else {
        retour = "---";
    }

    return retour;
}