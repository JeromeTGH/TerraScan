import { chainID, chainLCDurl, tblCorrespondanceValeurs } from '../../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';
import Decimal from 'decimal.js';
import { tblValidators, tblValidatorsAccounts } from '../../application/AppData';
import { LCDclient } from '../../lcd/LCDclient';
import { formateLeNombre } from '../../application/AppUtils';

export const getProposal = async (propID) => {

    // Idée de la structure de retour
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
    
    
    // Création/récupération d'une instance de requétage LCD
    const client_lcd = LCDclient.getSingleton();

       

    // Effacement mémoire, en cas d'erreur non bloquante ensuite
    let tblDesVotesDeValidateur = {};
    let tblDesVotesNonValidateur = {};
    const tblHistoriqueDesVotesValidateur = [];
    const tblHistoriqueDesVotesNonValidateur = [];


    // Récupération des infos concernant cette proposition
    const rawProposal = await lcd.gov.proposal(propID).catch(handleError);
    if(rawProposal) {
        // console.log(rawProposal);

        
        proposalInfos['contentAmount'] = rawProposal.content.amount ? coinsListToFormatedText(rawProposal.content.amount) : null;
        proposalInfos['contentChanges'] = rawProposal.content.changes ? rawProposal.content.changes : null;
        proposalInfos['contentPlan'] = rawProposal.content.plan ? rawProposal.content.plan : null;
        // console.log("proposalInfos['contentPlan']", proposalInfos['contentPlan']);
        // console.log("proposalInfos['contentPlan']", JSON.stringify(proposalInfos['contentPlan']));
        // console.log("proposalInfos['contentPlan']", JSON.parse(JSON.stringify(proposalInfos['contentPlan'])));
        // console.log("proposalInfos['contentPlan']", JSON.parse(JSON.parse(JSON.stringify(proposalInfos['contentPlan']))));
        // console.log("proposalInfos['contentPlan']", JSON.stringify(JSON.parse(JSON.parse(JSON.stringify(proposalInfos['contentPlan'])))));


        proposalInfos['contentDescription'] = rawProposal.content.description;
        proposalInfos['contentRecipient'] = rawProposal.content.recipient ? rawProposal.content.recipient : null;
        proposalInfos['contentTitle'] = rawProposal.content.title;
        proposalInfos['depositEndTime'] = rawProposal.deposit_end_time;
            proposalInfos['finalVotesYes'] = parseFloat(rawProposal.final_tally_result.yes.toString())*100;
            proposalInfos['finalVotesAbstain'] = parseFloat(rawProposal.final_tally_result.abstain.toString())*100;
            proposalInfos['finalVotesNo'] = parseFloat(rawProposal.final_tally_result.no.toString())*100;
            proposalInfos['finalVotesNoWithVeto'] = parseFloat(rawProposal.final_tally_result.no_with_veto.toString())*100;
        proposalInfos['status'] = rawProposal.status;
        proposalInfos['submitDatetime'] = rawProposal.submit_time;
        proposalInfos['totalDeposit'] = returnLUNCfromCoinList(rawProposal.total_deposit);
        proposalInfos['votingStartTime'] = rawProposal.voting_start_time;
        proposalInfos['votingEndTime'] = new Date(rawProposal.voting_end_time).toISOString();
    } else
        return { "erreur": "Failed to fetch this proposal from blockchain (LCD), sorry ..." }


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
        proposalInfos['proposerAddress'] = "";


    // Scan de toute la liste des validateurs, pour voir si cette adresse ne correspondrait pas à l'un d'entre eux
    const isValidatorAccount = Object.entries(tblValidators).find(lg => lg[1].terra1_account_address === proposalInfos['proposerAddress']);
    if(isValidatorAccount) {
        proposalInfos['proposerValAddress'] = isValidatorAccount[0];
        proposalInfos['proposerValMoniker'] = isValidatorAccount[1].description_moniker;
    }


    // Si un vote est en attente d'un dépôt suffisant (status = 1), alors on récupère d'autres infos particulières
    if(proposalInfos['status'] === 1) {

        // Récupération des infos concernant les dépôts (qté de LUNC nécessaire pour lancer le vote)
        const rawDepositParameters = await lcd.gov.depositParameters().catch(handleError);
        if(rawDepositParameters) {
            proposalInfos['nbMinDepositLunc'] = returnLUNCfromCoinList(rawDepositParameters.min_deposit);
        } else
            return { "erreur": "Failed to fetch [deposit parameters] ..." }

        const ratioDepot = parseFloat((proposalInfos['totalDeposit'] / proposalInfos['nbMinDepositLunc']).toFixed(4));  // 4 pour pourcentage avec 2 chiffres après la virgule
        if(ratioDepot >= 1)
            proposalInfos['pourcentageDeLuncFournisSurRequis'] = 100;
        else
            proposalInfos['pourcentageDeLuncFournisSurRequis'] = (ratioDepot * 100);
    }


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


            proposalInfos['seuilQuorum'] = proposalInfos['seuilDuQuorum'];
            proposalInfos['seuilVeto'] = proposalInfos['seuilDeVeto'] * (proposalInfos['pourcentageOfYes'] + proposalInfos['pourcentageOfNo'] + proposalInfos['pourcentageOfNoWithVeto']) / 100;
            proposalInfos['seuilAcceptation'] = proposalInfos['seuilDacceptation'] * (proposalInfos['pourcentageOfYes'] + proposalInfos['pourcentageOfNo'] + proposalInfos['pourcentageOfNoWithVeto']) / 100;

            proposalInfos['isQuorumReached'] = proposalInfos['pourcentageOfVoters'] >= proposalInfos['seuilDuQuorum'];
            proposalInfos['isVetoReached'] = proposalInfos['isQuorumReached'] && (proposalInfos['pourcentageOfNoWithVeto'] > proposalInfos['seuilVeto']);
                

            const statutVote = proposalInfos['pourcentageOfVoters'] < proposalInfos['seuilDuQuorum'] ? "Quorum not reached, for the moment (" + proposalInfos['pourcentageOfVoters'].toFixed(2) + "% have voted, but " + proposalInfos['seuilDuQuorum'] + "% of voting power is required)" :
                                    proposalInfos['pourcentageOfNoWithVeto'] > proposalInfos['seuilVeto'] ? "VETO threshold reached, for the moment (veto threshold = " + proposalInfos['seuilDeVeto'] + "% of YES+NO+VETO)" :
                                    proposalInfos['pourcentageOfYes'] < (proposalInfos['pourcentageOfNo'] + proposalInfos['pourcentageOfNoWithVeto']) ? "Majority of NO, for the moment (reject threshold = " + proposalInfos['seuilDeRefus'] + "% of YES+NO+VETO)" :
                                                                                                             "Majority of YES, for the moment (acceptation threshold = " + proposalInfos['seuilDacceptation'] + "% of YES+NO+VETO)";

            proposalInfos['statutVote'] = statutVote;

            // Calcul du pourcentage d'avancement, dans la période de vote
            let startDatetime = new Date(proposalInfos['votingStartTime']);
            let endDatetime = new Date(proposalInfos['votingEndTime']);
            let actualDatetime = new Date();
            proposalInfos['pourcentageOfVotePeriod'] = (actualDatetime.getTime()/1000 - startDatetime.getTime()/1000) / (endDatetime.getTime()/1000 - startDatetime.getTime()/1000) * 100;
            

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


    // =======================================================
    // Exploration des txs, pour récupérer les votes de chacun
    // =======================================================
    // Nota 1 : même si on scanne tout, on excluera les votes de "non validateur"
    // Nota 2 : on enregistrera toutes les transactions validateur dans un tableau historique
    //              array of { txHash, datetime, valoperaddress, valmoniker, vote }
    
    
    if(proposalInfos['status'] === 2 || proposalInfos['status'] === 3 || proposalInfos['status'] === 4) {

        // Montage des paramètres nécessaires ici
        const params = new URLSearchParams();
        params.append("pagination.offset", 0);
        params.append("events", "proposal_vote.proposal_id=" + propID.toString());

        // Exécution de la requête de recherche de Tx, ayant voté pour cette prop (traitement 'obligé' par lot de 100, attention)
        const rawTxs = await client_lcd.tx.searchTxsByEvent(params).catch(handleError);
        if(rawTxs?.data?.pagination?.total) {
            const nbTotalDeTxs = parseInt(rawTxs.data.pagination.total);

            if(nbTotalDeTxs > 0) {
                
                // ===================================================
                // Création d'un tableau de vote, pour les validateurs
                // ===================================================
                // Nota 1 : mettre tous les validateurs, si status = 3 (prop adoptée) ou status = 4 (prop rejetée)
                // Nota 2 : mettre uniquement les validateurs actifs, si status = 2 (prop en cours de vote)
                
                if(proposalInfos['status'] === 3 || proposalInfos['status'] === 4) {
                    tblDesVotesDeValidateur = {...tblValidators};
                            // On effacera ensuite ceux qui n'ont pas voté, du fait qu'on ne saurait distinguer s'ils étaient là à l'époquer, pour voter ou non

                    for (const valoperAdr of Object.keys(tblDesVotesDeValidateur)) {
                        tblDesVotesDeValidateur[valoperAdr].vote = '***';
                    }
                }
                if(proposalInfos['status'] === 2) {
                    for (const [valoperAdr, validator] of Object.entries(tblValidators)) {
                        if(validator.status === "active") {
                            tblDesVotesDeValidateur[valoperAdr] = validator;
                            tblDesVotesDeValidateur[valoperAdr].vote = 'DID_NOT_VOTE';
                        }
                    }
                }
                
                // Traitement des 100 premiers txs (ou moins, si y'en a moins, bien sûr)
                for(let i=0 ; i < rawTxs.data.txs.length ; i++) {
                    let txcode = rawTxs.data.tx_responses[i].code;
                    // On analyse seulement les transactions réussie (code = 0)
                    if(txcode === 0) {
                        let txhash = rawTxs.data.tx_responses[i].txhash;
                        let txtdatetime = rawTxs.data.tx_responses[i].timestamp;
                        // On parcoure les messages de cette tx
                        for(let j=0 ; j < rawTxs.data.tx_responses[i].tx.body.messages.length ; j++) {
                            // Check si y'a un "proposal_id"
                            if(rawTxs.data.tx_responses[i].tx.body.messages[j].proposal_id) {
                                let voter = rawTxs.data.tx_responses[i].tx.body.messages[j].voter;          // Adresse "terra1..."
                                let voteoption = rawTxs.data.tx_responses[i].tx.body.messages[j].option;    // du type "VOTE_OPTION_NO_WITH_VETO", no, abstain, ou yes
                                // Si c'est le vote d'un validateur ...
                                if(tblValidatorsAccounts[voter] && tblDesVotesDeValidateur[tblValidatorsAccounts[voter]]?.vote) {
                                    tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].vote = voteoption;
                                    tblHistoriqueDesVotesValidateur.push({
                                        // array of { txHash, datetime, valoperaddress, valmoniker, vote }
                                        'txhash': txhash,
                                        'datetime': txtdatetime,
                                        'valoperaddress': tblValidatorsAccounts[voter],
                                        'valmoniker': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].description_moniker,
                                        'vote': voteoption
                                    })
                                } else {
                                    tblDesVotesNonValidateur[voter] = {};
                                    tblDesVotesNonValidateur[voter].vote = voteoption;
                                    tblHistoriqueDesVotesNonValidateur.push({
                                        // array of { txHash, datetime, terra1address, vote }
                                        'txhash': txhash,
                                        'datetime': txtdatetime,
                                        'terra1address': voter,
                                        'vote': voteoption
                                    })
                                }
                            }
                            // Check si y'a un msgs, avant le "proposal_id"
                            if(rawTxs.data.tx_responses[i].tx.body.messages[j].msgs) {
                                for(let k=0 ; k < rawTxs.data.tx_responses[i].tx.body.messages[j].msgs.length ; k++) {
                                    if(rawTxs.data.tx_responses[i].tx.body.messages[j].msgs[k].proposal_id) {
                                        let voter = rawTxs.data.tx_responses[i].tx.body.messages[j].msgs[k].voter;          // Adresse "terra1..."
                                        let voteoption = rawTxs.data.tx_responses[i].tx.body.messages[j].msgs[k].option;    // du type "VOTE_OPTION_NO_WITH_VETO", no, abstain, ou yes
                                        // Si c'est le vote d'un validateur ...
                                        if(tblValidatorsAccounts[voter] && tblDesVotesDeValidateur[tblValidatorsAccounts[voter]]?.vote) {
                                            tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].vote = voteoption;
                                            tblHistoriqueDesVotesValidateur.push({
                                                // array of { txHash, datetime, valoperaddress, valmoniker, vote }
                                                'txhash': txhash,
                                                'datetime': txtdatetime,
                                                'valoperaddress': tblValidatorsAccounts[voter],
                                                'valmoniker': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].description_moniker,
                                                'vote': voteoption
                                            })
                                        } else {
                                            tblDesVotesNonValidateur[voter] = {};
                                            tblDesVotesNonValidateur[voter].vote = voteoption;
                                            tblHistoriqueDesVotesNonValidateur.push({
                                                // array of { txHash, datetime, terra1address, vote }
                                                'txhash': txhash,
                                                'datetime': txtdatetime,
                                                'terra1address': voter,
                                                'vote': voteoption
                                            })        
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                let nbDeLecturesAfaire = parseInt(nbTotalDeTxs/100);
                if((nbTotalDeTxs/100)%1 > 0)
                    nbDeLecturesAfaire += 1;
                for(let n=1 ; n < nbDeLecturesAfaire ; n++) {

                    // Montage des paramètres nécessaires ici
                    const params = new URLSearchParams();
                    params.append("pagination.offset", n*100);
                    params.append("events", "proposal_vote.proposal_id=" + propID.toString());

                    // Exécution de la requête de recherche des 100 txs suivants
                    const rawTxsSuivants = await client_lcd.tx.searchTxsByEvent(params).catch(handleError);
                    if(rawTxsSuivants?.data?.txs) {
                        // Traitement des 100 premiers txs (ou moins, si y'en a moins, bien sûr)
                        for(let i=0 ; i < rawTxsSuivants.data.txs.length ; i++) {
                            let txcode = rawTxsSuivants.data.tx_responses[i].code;
                            // On analyse seulement les transactions réussie (code = 0)
                            if(txcode === 0) {
                                let txhash = rawTxsSuivants.data.tx_responses[i].txhash;
                                let txtdatetime = rawTxsSuivants.data.tx_responses[i].timestamp;
                                // On parcoure les messages de cette tx
                                for(let j=0 ; j < rawTxsSuivants.data.tx_responses[i].tx.body.messages.length ; j++) {
                                    // Check si y'a un "proposal_id"
                                    if(rawTxsSuivants.data.tx_responses[i].tx.body.messages[j].proposal_id) {
                                        let voter = rawTxsSuivants.data.tx_responses[i].tx.body.messages[j].voter;          // Adresse "terra1..."
                                        let voteoption = rawTxsSuivants.data.tx_responses[i].tx.body.messages[j].option;    // du type "VOTE_OPTION_NO_WITH_VETO", no, abstain, ou yes
                                        // Si c'est le vote d'un validateur ...
                                        if(tblValidatorsAccounts[voter] && tblDesVotesDeValidateur[tblValidatorsAccounts[voter]]?.vote) {
                                            tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].vote = voteoption;
                                            tblHistoriqueDesVotesValidateur.push({
                                                // array of { txHash, datetime, valoperaddress, valmoniker, vote }
                                                'txhash': txhash,
                                                'datetime': txtdatetime,
                                                'valoperaddress': tblValidatorsAccounts[voter],
                                                'valmoniker': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].description_moniker,
                                                'vote': voteoption
                                            })
                                        } else {
                                            tblDesVotesNonValidateur[voter] = {};
                                            tblDesVotesNonValidateur[voter].vote = voteoption;
                                            tblHistoriqueDesVotesNonValidateur.push({
                                                // array of { txHash, datetime, terra1address, vote }
                                                'txhash': txhash,
                                                'datetime': txtdatetime,
                                                'terra1address': voter,
                                                'vote': voteoption
                                            })        
                                        }
                                    }
                                    // Check si y'a un msgs, avant le "proposal_id"
                                    if(rawTxsSuivants.data.tx_responses[i].tx.body.messages[j].msgs) {
                                        for(let k=0 ; k < rawTxsSuivants.data.tx_responses[i].tx.body.messages[j].msgs.length ; k++) {
                                            if(rawTxsSuivants.data.tx_responses[i].tx.body.messages[j].msgs[k].proposal_id) {
                                                let voter = rawTxsSuivants.data.tx_responses[i].tx.body.messages[j].msgs[k].voter;          // Adresse "terra1..."
                                                let voteoption = rawTxsSuivants.data.tx_responses[i].tx.body.messages[j].msgs[k].option;    // du type "VOTE_OPTION_NO_WITH_VETO", no, abstain, ou yes
                                                // Si c'est le vote d'un validateur ...
                                                if(tblValidatorsAccounts[voter] && tblDesVotesDeValidateur[tblValidatorsAccounts[voter]]?.vote) {
                                                    tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].vote = voteoption;
                                                    tblHistoriqueDesVotesValidateur.push({
                                                        // array of { txHash, datetime, valoperaddress, valmoniker, vote }
                                                        'txhash': txhash,
                                                        'datetime': txtdatetime,
                                                        'valoperaddress': tblValidatorsAccounts[voter],
                                                        'valmoniker': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].description_moniker,
                                                        'vote': voteoption
                                                    })
                                                } else {
                                                    tblDesVotesNonValidateur[voter] = {};
                                                    tblDesVotesNonValidateur[voter].vote = voteoption;
                                                    tblHistoriqueDesVotesNonValidateur.push({
                                                        // array of { txHash, datetime, terra1address, vote }
                                                        'txhash': txhash,
                                                        'datetime': txtdatetime,
                                                        'terra1address': voter,
                                                        'vote': voteoption
                                                    })                
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else
                        return { "erreur": "Failed to fetch [nexts tx] for votes ..." }
                }
            }

        } else
            return { "erreur": "Failed to fetch [first txs] for votes ..." }
    }


    // Ajout de ces votes validateurs, au retour-données
    proposalInfos['tblDesVotesDeValidateur'] = tblDesVotesDeValidateur;
    proposalInfos['tblHistoriqueDesVotesValidateur'] = tblHistoriqueDesVotesValidateur;
    proposalInfos['tblDesVotesNonValidateur'] = tblDesVotesNonValidateur;
    proposalInfos['tblHistoriqueDesVotesNonValidateur'] = tblHistoriqueDesVotesNonValidateur;

    // Comptage des votes de validateur, par catégorie
    proposalInfos['validator_NB_ACTIVES'] = Object.keys(tblDesVotesDeValidateur).length;
    proposalInfos['validator_TOTAL_VOTES'] = 0;
    proposalInfos['validator_DID_NOT_VOTE'] = 0;
    proposalInfos['validator_VOTE_OPTION_YES'] = 0;
    proposalInfos['validator_VOTE_OPTION_ABSTAIN'] = 0;
    proposalInfos['validator_VOTE_OPTION_NO'] = 0;
    proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO'] = 0;
    proposalInfos['validator_VP_VOTED_YES'] = 0;
    proposalInfos['validator_VP_VOTED_ABSTAIN'] = 0;
    proposalInfos['validator_VP_VOTED_NOS'] = 0;
    proposalInfos['validator_VP_TOTAL'] = 0;
    for (const validator of Object.values(tblDesVotesDeValidateur)) {
        proposalInfos['validator_TOTAL_VOTES'] += 1;
        if(validator.vote === "DID_NOT_VOTE")
            proposalInfos['validator_DID_NOT_VOTE'] += 1;
        if(validator.vote === "VOTE_OPTION_YES") {
            proposalInfos['validator_VOTE_OPTION_YES'] += 1;
            proposalInfos['validator_VP_VOTED_YES'] += validator.voting_power_pourcentage;
        }
        if(validator.vote === "VOTE_OPTION_ABSTAIN") {
            proposalInfos['validator_VOTE_OPTION_ABSTAIN'] += 1;
            proposalInfos['validator_VP_VOTED_ABSTAIN'] += validator.voting_power_pourcentage;
        }
        if(validator.vote === "VOTE_OPTION_NO") {
            proposalInfos['validator_VOTE_OPTION_NO'] += 1;
            proposalInfos['validator_VP_VOTED_NOS'] += validator.voting_power_pourcentage;            
        }
        if(validator.vote === "VOTE_OPTION_NO_WITH_VETO") {
            proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO'] += 1;
            proposalInfos['validator_VP_VOTED_NOS'] += validator.voting_power_pourcentage;            
        }
    }

    // Ramener les "voting power" des validateurs sur la base de ceux qui ont voté, uniquement (pour le graphe circulaire)
    proposalInfos['validator_VP_TOTAL'] = proposalInfos['validator_VP_VOTED_YES'] + proposalInfos['validator_VP_VOTED_ABSTAIN'] + proposalInfos['validator_VP_VOTED_NOS'];
    proposalInfos['validator_VP_VOTED_YES'] = proposalInfos['validator_VP_VOTED_YES'] / proposalInfos['validator_VP_TOTAL'] * 100;
    proposalInfos['validator_VP_VOTED_ABSTAIN'] = proposalInfos['validator_VP_VOTED_ABSTAIN'] / proposalInfos['validator_VP_TOTAL'] * 100;
    proposalInfos['validator_VP_VOTED_NOS'] = proposalInfos['validator_VP_VOTED_NOS'] / proposalInfos['validator_VP_TOTAL'] * 100;


    
    // Détermination du nombre de votes validateurs, par choix de vote
    proposalInfos['validator_NB_VOTE_TOTAL'] = proposalInfos['validator_VOTE_OPTION_YES'] + proposalInfos['validator_VOTE_OPTION_ABSTAIN'] + proposalInfos['validator_VOTE_OPTION_NO'] + proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO'];
    proposalInfos['validator_NB_VOTE_YES'] = (proposalInfos['validator_VOTE_OPTION_YES'] / proposalInfos['validator_NB_VOTE_TOTAL']) *100;
    proposalInfos['validator_NB_VOTE_ABSTAIN'] = (proposalInfos['validator_VOTE_OPTION_ABSTAIN'] / proposalInfos['validator_NB_VOTE_TOTAL']) *100;
    proposalInfos['validator_NB_VOTE_NOS'] = (proposalInfos['validator_VOTE_OPTION_NO'] + proposalInfos['validator_VOTE_OPTION_NO_WITH_VETO']) / proposalInfos['validator_NB_VOTE_TOTAL'] * 100;
    

    // Comptage des votes des "non validateur", par catégorie
    proposalInfos['non_validator_TOTAL_VOTES'] = 0;
    proposalInfos['non_validator_VOTE_OPTION_YES'] = 0;
    proposalInfos['non_validator_VOTE_OPTION_ABSTAIN'] = 0;
    proposalInfos['non_validator_VOTE_OPTION_NO'] = 0;
    proposalInfos['non_validator_VOTE_OPTION_NO_WITH_VETO'] = 0;
    for (const nonvalidator of Object.values(tblDesVotesNonValidateur)) {
        proposalInfos['non_validator_TOTAL_VOTES'] += 1;
        if(nonvalidator.vote === "VOTE_OPTION_YES")
            proposalInfos['non_validator_VOTE_OPTION_YES'] += 1;
        if(nonvalidator.vote === "VOTE_OPTION_ABSTAIN")
            proposalInfos['non_validator_VOTE_OPTION_ABSTAIN'] += 1;
        if(nonvalidator.vote === "VOTE_OPTION_NO")
            proposalInfos['non_validator_VOTE_OPTION_NO'] += 1;
        if(nonvalidator.vote === "VOTE_OPTION_NO_WITH_VETO")
            proposalInfos['non_validator_VOTE_OPTION_NO_WITH_VETO'] += 1;
    }


    // Envoi des infos en retour
    return proposalInfos;
}


// ===========================
// Log les éventuelles erreurs
// ===========================
const handleError = (err) => {
    if(err.response && err.response.data)
        console.warn("err.response.data", err.response.data);
    else
        console.warn("err", err);
}


// ======================================================================
// Retourne le nombre de 'uluna' d'une liste de coins, passée en argument
// ======================================================================
const returnLUNCfromCoinList = (coinsList) => {
    const dataCoinsList = (new Coins(coinsList)).toData();

    const idxLunc = dataCoinsList.findIndex(element => element.denom === "uluna");

    if(idxLunc > -1) {
        return parseInt(dataCoinsList[idxLunc].amount/1000000);
    } else
        return 0;
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