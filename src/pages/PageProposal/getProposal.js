import { chainID, chainLCDurl } from '../../application/AppParams';
import { AccAddress, LCDClient } from '@terra-money/terra.js';
import Decimal from 'decimal.js';


export const getProposal = async (propID) => {

    const proposalInfos = {
        'contentTitle': null,           // Titre de la proposition
        'contentDescription': null,     // Description de la proposition
        'depositEndTime': null,         // Date et heure de fin, pour apporter suffisamment de dépôt (1M de LUNC, actuellement), pour qu'une proposition soit soumise au vote
        'status': null,                 // 1=PROPOSAL_STATUS_DEPOSIT_PERIOD, 2=PROPOSAL_STATUS_VOTING_PERIOD, 3=PROPOSAL_STATUS_PASSED, 4=PROPOSAL_STATUS_REJECTED
        'submitDatetime': null,         // Date et heure de la création de la proposition
        'totalDeposit': null,           // Quantité de LUNC déposés (pour rappel, en ce moment, il faut 1M de LUNC pour qu'une proposition puisse passer au vote)
        'votingStartTime': null,        // Date/heure de début de la phase de vote (si le dépôt a été suffisant, pour que le vote soit lancé)
        'votingEndTime': null,          // Date/heure de fin de la phase de vote (si le dépôt a été suffisant, pour que le vote soit lancé)
        'proposerAddress': null,        // Adresse "terra1..." du proposer
        'proposerValAddress': null,     // Adresse "terravaloper1..." du validateur, si c'est lui le proposer
        'proposerValMoniker': null,     // Surnom du validateur, si c'est lui le proposer
        'nbStakedLunc': null,           // Nombre de LUNC stakés (montant en "uluna", ici)
        'seuilDuQuorum': null,          // Seuil d'atteinte du quorum (nbre de participant minimum à avoir, pour qu'un vote soit valide)
        'seuilDacceptation': null,      // Seuil de votes YES à avoir, pour qu'une proposition soit adoptée
        'seuilDeRefus': null,           // Seuil de votes NO + NO_WITH_VETO à partir duquel une proposition est rejetée
        'seuilDeVeto': null,            // Seuil de votes NO_WITH_VETO à partir duquel une proposition reçoit un veto (non remboursement du dépôt, dans ce cas)
        // Etc... (inutile de vraiment lister quoi que ce soit ici, en fait)
    }

   
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération des infos concernant cette proposition
    const rawProposal = await lcd.gov.proposal(propID).catch(handleError);
    if(rawProposal) {
        proposalInfos['contentTitle'] = rawProposal.content.title;
        proposalInfos['contentDescription'] = rawProposal.content.description;
        proposalInfos['depositEndTime'] = rawProposal.deposit_end_time;
            proposalInfos['finalVotesYes'] = parseFloat(rawProposal.final_tally_result.yes.toString())*100;
            proposalInfos['finalVotesAbstain'] = parseFloat(rawProposal.final_tally_result.abstain.toString())*100;
            proposalInfos['finalVotesNo'] = parseFloat(rawProposal.final_tally_result.no.toString())*100;
            proposalInfos['finalVotesNoWithVeto'] = parseFloat(rawProposal.final_tally_result.no_with_veto.toString())*100;
        proposalInfos['status'] = rawProposal.status;
        proposalInfos['submitDatetime'] = rawProposal.submit_time;
        proposalInfos['totalDeposit'] = rawProposal.total_deposit;
        proposalInfos['votingStartTime'] = rawProposal.voting_start_time;
        proposalInfos['votingEndTime'] = rawProposal.voting_end_time;
    } else
        return { "erreur": "Failed to fetch [proposal] ..." }


    // Ajout d'un "status texte", pour que ce soit plus parlant
    switch(proposalInfos['status']) {
        case 1:     // 1 = PROPOSAL_STATUS_DEPOSIT_PERIOD
            proposalInfos['statusText'] = 'waiting for enough deposits';
            break;
        case 2:     // 2 = PROPOSAL_STATUS_VOTING_PERIOD
            proposalInfos['statusText'] = 'voting in progress';
            break;
        case 3:     // 3 = PROPOSAL_STATUS_PASSED
            proposalInfos['statusText'] = 'proposal ADOPTED';
            break;
        case 4:     // 4 = PROPOSAL_STATUS_REJECTED
            proposalInfos['statusText'] = 'proposal REJECTED';
            break;
        default:    // Other cases
            proposalInfos['statusText'] = '(unknonw status)';
            break;
    }


    // Recherche de l'auteur de la proposition
    const rawProposer = await lcd.gov.proposer(propID).catch(handleError);
    if(rawProposer) {
        proposalInfos['proposerAddress'] = rawProposer;
    } else
        return { "erreur": "Failed to fetch [proposer] ..." }


    // Scan de toute la liste des validateurs, pour voir si cette adresse ne correspondrait pas à l'un d'entre eux
    const rawValidators = await lcd.staking.validators({'pagination.limit': '9999'}).catch(handleError);
    if(rawValidators) {
        for(let i=0 ; i<rawValidators[0].length ; i++) {
            if(AccAddress.fromValAddress(rawValidators[0][i].operator_address) === proposalInfos['proposerAddress']) {
                proposalInfos['proposerValAddress'] = rawValidators[0][i].operator_address;
                proposalInfos['proposerValMoniker'] = rawValidators[0][i].description.moniker;
            }
        }
    } else
        return { "erreur": "Failed to fetch [validators] ..." }


    // Si un vote est en cours (status = 2), alors on récupère d'autres infos particulières
    if(proposalInfos['status'] === 2) {

        // Récupération du nombre total de LUNC stakés, en ce moment
        const rawStakingPool = await lcd.staking.pool().catch(handleError);
        if(rawStakingPool) {
            proposalInfos['nbStakedLunc'] = (new Decimal(rawStakingPool.bonded_tokens.amount)).toFixed(0);
        } else
            return { "erreur": "Failed to fetch [staking pool] ..." }


        // Récupération des règles de vote
        const rawTallyParameters = await lcd.gov.tallyParameters().catch(handleError);
        if(rawTallyParameters) {
            const valQuorum = parseFloat(rawTallyParameters.quorum.toString())*100;                     // * 100 pour avoir ça en pourcentage
            const valThreshold = parseFloat(rawTallyParameters.threshold.toString())*100;
            const valVetoThreshold = parseFloat(rawTallyParameters.veto_threshold.toString())*100;
            proposalInfos['seuilDuQuorum'] = valQuorum;
            proposalInfos['seuilDacceptation'] = valThreshold;
            proposalInfos['seuilDeRefus'] = 100 - valThreshold;
            proposalInfos['seuilDeVeto'] = valVetoThreshold;
        } else
            return { "erreur": "Failed to fetch [tally parameters] ..." }


        // Récupération des tally de ce vote en cours
        const rawTally = await lcd.gov.tally(propID).catch(handleError)
        if(rawTally) {

            proposalInfos['nbVotesYesLunc'] = parseInt(rawTally.yes.toString());
            proposalInfos['nbVotesAbstainLunc'] = parseInt(rawTally.abstain.toString());
            proposalInfos['nbVotesNoLunc'] = parseInt(rawTally.no.toString());
            proposalInfos['nbVotesNowithvetoLunc'] = parseInt(rawTally.no_with_veto.toString());
                proposalInfos['nbVotersLunc'] = proposalInfos['nbVotesYesLunc'] + proposalInfos['nbVotesAbstainLunc'] + proposalInfos['nbVotesNoLunc'] + proposalInfos['nbVotesNowithvetoLunc'];

            proposalInfos['sommesDesVotesNON'] = proposalInfos['nbVotesNoLunc'] + proposalInfos['nbVotesNowithvetoLunc'];
            proposalInfos['pourcentageOfYESvsNOs'] = proposalInfos['nbVotesYesLunc'] / (proposalInfos['nbVotesYesLunc'] + proposalInfos['sommesDesVotesNON']) * 100;
            proposalInfos['pourcentageOfNOsvsYES'] = 100 - proposalInfos['pourcentageOfYESvsNOs'];


            proposalInfos['pourcentageOfYes'] = proposalInfos['nbVotesYesLunc'] / proposalInfos['nbStakedLunc'] * 100;
            proposalInfos['pourcentageOfAbstain'] = proposalInfos['nbVotesAbstainLunc'] / proposalInfos['nbStakedLunc'] * 100;
            proposalInfos['pourcentageOfNo'] = proposalInfos['nbVotesNoLunc'] / proposalInfos['nbStakedLunc'] * 100;
            proposalInfos['pourcentageOfNoWithVeto'] = proposalInfos['nbVotesNowithvetoLunc'] / proposalInfos['nbStakedLunc'] * 100;
                proposalInfos['pourcentageOfVoters'] = proposalInfos['nbVotersLunc'] / proposalInfos['nbStakedLunc'] * 100;


            const statutVote = proposalInfos['pourcentageOfVoters'] < proposalInfos['seuilDuQuorum'] ? "Quorum not reached, for the moment (" + proposalInfos['seuilDuQuorum'] + "% needed)" :
                                    proposalInfos['pourcentageOfNoWithVeto'] > proposalInfos['seuilDeVeto'] ? "VETO threshold reached, for the moment (veto threshold = " + proposalInfos['seuilDeVeto'] + "%)" :
                                    proposalInfos['pourcentageOfYes'] < proposalInfos['seuilDacceptation'] ? "Majority of NO, for the moment (reject threshold = " + proposalInfos['seuilDeRefus'] + "%)" :
                                                                                                             "Majority of YES, for the moment (acceptation threshold = " + proposalInfos['seuilDacceptation'] + "%)";

            proposalInfos['statutVote'] = statutVote;

        } else
            return { "erreur": "Failed to fetch [tally] ..." }

    }

    // Si un vote est en finis (status = 3 si adopté, ou 4 si rejeté), alors on récupère d'autres infos particulières
    if(proposalInfos['status'] === 3 || proposalInfos['status'] === 4) {

        // Calculs
            proposalInfos['nbVotesYesLunc'] = proposalInfos['finalVotesYes'];
            proposalInfos['nbVotesAbstainLunc'] = proposalInfos['finalVotesAbstain'];
            proposalInfos['nbVotesNoLunc'] = proposalInfos['finalVotesNo'];
            proposalInfos['nbVotesNowithvetoLunc'] = proposalInfos['finalVotesNoWithVeto'];
                proposalInfos['nbVotersLunc'] = proposalInfos['nbVotesYesLunc'] + proposalInfos['nbVotesAbstainLunc'] + proposalInfos['nbVotesNoLunc'] + proposalInfos['nbVotesNowithvetoLunc'];

            proposalInfos['sommesDesVotesNON'] = proposalInfos['nbVotesNoLunc'] + proposalInfos['nbVotesNowithvetoLunc'];
            proposalInfos['pourcentageOfYESvsNOs'] = proposalInfos['nbVotesYesLunc'] / (proposalInfos['nbVotesYesLunc'] + proposalInfos['sommesDesVotesNON']) * 100;
            proposalInfos['pourcentageOfNOsvsYES'] = 100 - proposalInfos['pourcentageOfYESvsNOs'];

            proposalInfos['pourcentageOfYes'] = proposalInfos['nbVotesYesLunc'] / proposalInfos['nbVotersLunc'] * 100;
            proposalInfos['pourcentageOfAbstain'] = proposalInfos['nbVotesAbstainLunc'] / proposalInfos['nbVotersLunc'] * 100;
            proposalInfos['pourcentageOfNo'] = proposalInfos['nbVotesNoLunc'] / proposalInfos['nbVotersLunc'] * 100;
            proposalInfos['pourcentageOfNoWithVeto'] = proposalInfos['nbVotesNowithvetoLunc'] / proposalInfos['nbVotersLunc'] * 100;

            if(proposalInfos['status'] === 3)
                proposalInfos['statutVote'] = "Proposal ADOPTED";
            else
                proposalInfos['statutVote'] = "Proposal REJECTED";
        
    }













    // Traitement des dates de vote
    if(rawProposal.voting_end_time > Date.now()) {
        proposalInfos['totalVotesYes'] = proposalInfos['finalVotesYes'];
        proposalInfos['totalVotesAbstain'] = proposalInfos['finalVotesAbstain'];
        proposalInfos['totalVotesNo'] = proposalInfos['finalVotesNo'];
        proposalInfos['totalVotesNoWithVeto'] = proposalInfos['finalVotesNoWithVeto'];
    }











    // // Récupération des infos concernant les dépôts (qté de LUNC nécessaire pour lancer le vote, et durée max de deposit)
    // const rawDepositParameters = await lcd.gov.depositParameters().catch(handleError);
    // if(rawDepositParameters) {
    //     governanceInfos['nbMinDepositLunc'] = coinsListToFormatedText(rawDepositParameters.min_deposit);
    //     governanceInfos['nbJoursMaxDeposit'] = rawDepositParameters.max_deposit_period / 3600 / 24;
    // } else
    //     return { "erreur": "Failed to fetch [deposit parameters] ..." }


    // // Récupération des infos concernant la durée maximal d'un vote
    // const rawVotingParameters = await lcd.gov.votingParameters().catch(handleError);
    // if(rawVotingParameters) {
    //     governanceInfos['nbJoursMaxPourVoter'] = rawVotingParameters.voting_period / 3600 / 24;
    // } else
    //     return { "erreur": "Failed to fetch [voting parameters] ..." }

        
    // // Règles de validation de vote
    // const rawTallyParameters = await lcd.gov.tallyParameters().catch(handleError);
    // if(rawTallyParameters) {
    //     const valQuorum = parseFloat(rawTallyParameters.quorum.toString())*100;                     // * 100 pour avoir ça en pourcentage
    //     const valThreshold = parseFloat(rawTallyParameters.threshold.toString())*100;
    //     const valVetoThreshold = parseFloat(rawTallyParameters.veto_threshold.toString())*100;
    //     governanceInfos['quorum'] = valQuorum;
    //     governanceInfos['seuilDacceptation'] = valThreshold;
    //     governanceInfos['seuilDeRefus'] = 100 - valThreshold;
    //     governanceInfos['seuilDeVeto'] = valVetoThreshold;
    // } else
    //     return { "erreur": "Failed to fetch [tally parameters] ..." }
    

    // Envoi des infos en retour
    return proposalInfos;
}


// ===========================
// Log les éventuelles erreurs
// ===========================
const handleError = (err) => {
    console.log("ERREUR", err);
}


// // ======================================================================
// // Créé un STRING avec montant+devise, séparé de virgules si multidevises
// // ======================================================================
// const coinsListToFormatedText = (coinsList) => {
//     const dataCoinsList = (new Coins(coinsList)).toData();
//     let retour = "";
    
//     if(dataCoinsList.length > 0) {
//         for(let i=0 ; i < dataCoinsList.length ; i++) {
//             const msgAmount = formateLeNombre(dataCoinsList[i].amount/1000000, ' ');
//             const msgCoin = tblCorrespondanceValeurs[dataCoinsList[i].denom] ? tblCorrespondanceValeurs[dataCoinsList[i].denom] : dataCoinsList[i].denom;
//             if(retour !== "")
//                 retour += ", ";
//             retour += (msgAmount + "\u00a0" + msgCoin);
//         }
//     } else {
//         retour = "---";
//     }

//     return retour;
// }