import { tblCorrespondanceValeurs } from '../../application/AppParams';
import { tblGovInfos, tblProposals, tblValidators, tblValidatorsAccounts } from '../../application/AppData';
import { LCDclient } from '../../apis/lcd/LCDclient';
import { loadGovInfos } from '../../dataloaders/loadGovInfos';
import { loadProposals } from '../../dataloaders/loadProposals';
import { CoinsList } from '../../apis/fcd/classes/CoinsList';
import { isValidTerraAddressFormat, metEnFormeAmountPartieEntiere, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import { loadNbStakedLunc } from '../../dataloaders/loadNbStakedLunc';

// const getIpfsData = async(ipfsUrlToFetch) => {
//     try {
//         const res = await fetch(ipfsUrlToFetch).catch(handleError);
//         if (res.ok) {
//             return res.json();
//         } else {
//             return Promise.reject(res);
//         }    
//     } catch(err) {
//         return null;
//     }
// };

export const getProposal = async (propID) => {


    // Chargement des paramètres de gouvernance
    const retourLoadGovInfos = await loadGovInfos();
    if(retourLoadGovInfos['erreur'])
        return retourLoadGovInfos['erreur'];

    // Chargement de toutes les proposals
    const retourLoadProposals = await loadProposals();
    if(retourLoadProposals['erreur'])
        return retourLoadProposals['erreur'];


    // Récupération du numéro de ligne de cette proposition, dans la table tblProposals
    const idxOfThisProp = tblProposals.findIndex(element => element.id === propID);
    if (idxOfThisProp === -1)
        return { "erreur": "Failed to fetch this proposal into tblProposals, sorry ..." }


    // Support de retour d'infos
    const proposalInfos = {}


    // Création/récupération d'une instance de requétage LCD
    const lcd = LCDclient.getSingleton();

          

    // Effacement mémoire, en cas d'erreur non bloquante ensuite
    let tblDesVotesDeValidateur = {};
    // let tblDesVotesNonValidateur = {};
    const tblHistoriqueDesVotesValidateur = [];
    // const tblHistoriqueDesVotesNonValidateur = [];


    // Récupération des infos de cette proposition là en particulier
 //console.log("tblProposals[idxOfThisProp]", tblProposals[idxOfThisProp]);

    proposalInfos['propMsgs'] = tblProposals[idxOfThisProp].messages ? tblProposals[idxOfThisProp].messages : null;
    if((tblProposals[idxOfThisProp].metadata || tblProposals[idxOfThisProp].summary) && !tblProposals[idxOfThisProp].messages[0]?.content) {
        // SDK v0.47
        proposalInfos['propType'] = tblProposals[idxOfThisProp].messages[0] ? tblProposals[idxOfThisProp].messages[0]["@type"] ? tblProposals[idxOfThisProp].messages[0]["@type"].split('.').slice(-1) : 'unknown' : 'unknown';
        proposalInfos['propAmount'] = tblProposals[idxOfThisProp].messages[0]?.amount ? coinsListToFormatedText(tblProposals[idxOfThisProp].messages[0].amount) : null;
        proposalInfos['contentAutority'] = tblProposals[idxOfThisProp].messages[0]?.authority ? tblProposals[idxOfThisProp].messages[0].authority : null;
        proposalInfos['contentRecipient'] = tblProposals[idxOfThisProp].messages[0]?.recipient ? tblProposals[idxOfThisProp].messages[0].recipient : null;
        proposalInfos['contentDescription'] = tblProposals[idxOfThisProp].summary ? tblProposals[idxOfThisProp].summary : null;
        proposalInfos['contentTitle'] = tblProposals[idxOfThisProp].title ? tblProposals[idxOfThisProp].title : null;
        proposalInfos['metadataField'] = tblProposals[idxOfThisProp].metadata ? tblProposals[idxOfThisProp].metadata : null;

        const ipfsRegex = new RegExp('^ipfs://[A-Za-z0-9]+$');
        // if(ipfsRegex.test(proposalInfos['metadataField'])) {
        //     const ipfsAdr = 'https://ipfs.io/ipfs/' + proposalInfos['metadataField'].replace('ipfs://', '');
        //     const ipfsData = await getIpfsData(ipfsAdr);
        //     proposalInfos['ipfsDatas'] = ipfsData;
        // }
        if(ipfsRegex.test(proposalInfos['metadataField'])) {
            proposalInfos['ipfsDatas'] = proposalInfos['metadataField'];
        }


    } else if(tblProposals[idxOfThisProp].messages[0]?.content && tblProposals[idxOfThisProp].messages[0]?.content["@type"]) {
        proposalInfos['propType'] = tblProposals[idxOfThisProp].messages[0]?.content["@type"] ? tblProposals[idxOfThisProp].messages[0].content["@type"].split('.').slice(-1) : 'unknown';
        proposalInfos['contentAmount'] = tblProposals[idxOfThisProp].messages[0]?.content.amount ? coinsListToFormatedText(tblProposals[idxOfThisProp].messages[0]?.content.amount[0].amount) : null;
        proposalInfos['contentChanges'] = tblProposals[idxOfThisProp].messages[0]?.content.changes ? tblProposals[idxOfThisProp].messages[0].content.changes : null;
        proposalInfos['contentPlan'] = tblProposals[idxOfThisProp].messages[0]?.content.plan ? tblProposals[idxOfThisProp].messages[0].content.plan : null;
        proposalInfos['ClientUpdateProposal'] = tblProposals[idxOfThisProp].messages[0]?.content?.['@type'].includes("ClientUpdateProposal") ?
            [tblProposals[idxOfThisProp].messages[0].content.subject_client_id, tblProposals[idxOfThisProp].messages[0].content.substitute_client_id]
        : null;
        proposalInfos['contentDescription'] = tblProposals[idxOfThisProp].messages[0]?.content.description ? tblProposals[idxOfThisProp].messages[0].content.description : null;
        proposalInfos['contentRecipient'] = tblProposals[idxOfThisProp].messages[0]?.content.recipient ? tblProposals[idxOfThisProp].messages[0].content.recipient : null;
        proposalInfos['contentTitle'] = tblProposals[idxOfThisProp].messages[0]?.content.title ? tblProposals[idxOfThisProp].messages[0].content.title : null;        
    } else {
        return { "erreur": "Failed to fetch proposal's infos into tblProposals, sorry ..." }
    }

    if(tblProposals[idxOfThisProp].proposer && isValidTerraAddressFormat(tblProposals[idxOfThisProp].proposer, "terra1")) {
        proposalInfos['proposerAddress'] = tblProposals[idxOfThisProp].proposer
    } else {
        proposalInfos['proposerAddress'] = ""   
    }

    proposalInfos['depositEndTime'] = tblProposals[idxOfThisProp].deposit_end_time;
        proposalInfos['finalVotesYes'] = parseFloat(tblProposals[idxOfThisProp].final_tally_result.yes_count.toString())*100;
        proposalInfos['finalVotesAbstain'] = parseFloat(tblProposals[idxOfThisProp].final_tally_result.abstain_count.toString())*100;
        proposalInfos['finalVotesNo'] = parseFloat(tblProposals[idxOfThisProp].final_tally_result.no_count.toString())*100;
        proposalInfos['finalVotesNoWithVeto'] = parseFloat(tblProposals[idxOfThisProp].final_tally_result.no_with_veto_count.toString())*100;
    proposalInfos['status'] = tblProposals[idxOfThisProp].status;
    proposalInfos['submitDatetime'] = tblProposals[idxOfThisProp].submit_time;
    proposalInfos['votingStartTime'] = tblProposals[idxOfThisProp].voting_start_time;
    proposalInfos['votingEndTime'] = new Date(tblProposals[idxOfThisProp].voting_end_time).toISOString();
    
    let totalDeposit = 0;
    if(tblProposals[idxOfThisProp].total_deposit.length > 0) {
        for(const deposit of tblProposals[idxOfThisProp].total_deposit) {
            if(deposit.denom === 'uluna')
                totalDeposit += deposit.amount / 1000000;
        }
    }

    proposalInfos['totalDeposit'] = totalDeposit;


    // Ajout d'un "status texte", pour que ce soit plus parlant
    switch(proposalInfos['status']) {
        case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
            proposalInfos['statusText'] = 'waiting for enough deposits';
            break;
        case "PROPOSAL_STATUS_VOTING_PERIOD":
            proposalInfos['statusText'] = 'voting in progress';
            break;
        case "PROPOSAL_STATUS_PASSED":
            proposalInfos['statusText'] = 'proposal ADOPTED';
            break;
        case "PROPOSAL_STATUS_REJECTED":
            proposalInfos['statusText'] = 'proposal REJECTED';
            break;
        default:    // Other cases
            proposalInfos['statusText'] = '(unknonw status)';
            break;
    }


    // TxSearch doc. : https://terra-classic-lcd.publicnode.com/swagger/#/Service/GetTxsEvent
    // ======================================================================================
    // Si 407 entrées, par exemple
    // ---------------------------
    // Page 1 (0-99) :     https://lcd.terraclassic.community/cosmos/tx/v1beta1/txs?page=1&events=proposal_vote.proposal_id%3D11784
    // Page 2 (100-199) :  https://lcd.terraclassic.community/cosmos/tx/v1beta1/txs?page=2&events=proposal_vote.proposal_id%3D11784
    // Page 3 (200-299) :  https://lcd.terraclassic.community/cosmos/tx/v1beta1/txs?page=3&events=proposal_vote.proposal_id%3D11784
    // Page 4 (300-399) :  https://lcd.terraclassic.community/cosmos/tx/v1beta1/txs?page=4&events=proposal_vote.proposal_id%3D11784
    // Page 5 (400-406) :  https://lcd.terraclassic.community/cosmos/tx/v1beta1/txs?page=5&events=proposal_vote.proposal_id%3D11784



    if(proposalInfos['proposerAddress'] !== "") {
        // Préparation de la requête
        const paramsTxSearch = new URLSearchParams();
        // %3D pour =               // Si tests web direct
        // %27 pour '
        // %2F pour /
        // paramsTxSearch.append('events', "message.action='/cosmos.gov.v1beta1.MsgSubmitProposal'");      // Enlevé, car certains peuvent voter avec la fonction MsgExec (key : "action", value : "/cosmos.authz.v1beta1.MsgExec")
        paramsTxSearch.append('events', 'submit_proposal.proposal_id=' + propID);
    
        // Recherche de l'auteur de la proposition
        const rawProposer = await lcd.tx.searchTxsByEvent(paramsTxSearch).catch(handleError);
        if(rawProposer?.data?.txs) {
            for(const tx of rawProposer.data.txs) {
                if(tx.body?.messages) {
                    for(const message of tx.body.messages) {
                        if(message.proposer) {
                            proposalInfos['proposerAddress'] = message.proposer;
                            break;
                        }
                    }
                }
            }
        }
    }
        

    // Scan de toute la liste des validateurs, pour voir si cette adresse ne correspondrait pas à l'un d'entre eux
    const isValidatorAccount = Object.entries(tblValidators).find(lg => lg[1].terra1_account_address === proposalInfos['proposerAddress']);
    if(isValidatorAccount) {
        proposalInfos['proposerValAddress'] = isValidatorAccount[0];
        proposalInfos['proposerValMoniker'] = isValidatorAccount[1].description_moniker;
    }


    // Si un vote est en attente d'un dépôt suffisant (status = "PROPOSAL_STATUS_DEPOSIT_PERIOD"), alors on récupère d'autres infos particulières
    if(proposalInfos['status'] === "PROPOSAL_STATUS_DEPOSIT_PERIOD") {
        const ratioDepot = parseFloat((proposalInfos['totalDeposit'] / tblGovInfos['nbLuncRequisPourValiderDeposit']).toFixed(4));  // 4 pour pourcentage avec 2 chiffres après la virgule
        if(ratioDepot >= 1)
            proposalInfos['pourcentageDeLuncFournisSurRequis'] = 100;
        else
            proposalInfos['pourcentageDeLuncFournisSurRequis'] = (ratioDepot * 100);

        proposalInfos['nbMinDepositLunc'] = tblGovInfos['nbLuncRequisPourValiderDeposit'];


        // Récupération des deposits effectués
        const rawDeposits = await lcd.gov.getDeposits(propID).catch(handleError);
        if(rawDeposits?.data?.deposits) {
            proposalInfos['deposits'] = rawDeposits.data.deposits;
        } else
            return { "erreur": "Failed to fetch [deposits] ..." }


    }


    // Si un vote est en cours (status = "PROPOSAL_STATUS_VOTING_PERIOD"), alors on récupère d'autres infos particulières
    if(proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD") {


        // Récupération du nombre de LUNC stakés
        const nbLuncStaked = await loadNbStakedLunc();
        if(nbLuncStaked['erreur'])
            return nbLuncStaked['erreur'];
        proposalInfos['nbStakedLunc'] = nbLuncStaked;



        // Récupération des règles de vote
        proposalInfos['seuilDuQuorum'] = tblGovInfos['pourcentageQuorum'];
        proposalInfos['seuilDacceptation'] = tblGovInfos['pourcentageAcceptation'];
        proposalInfos['seuilDeRefus'] = tblGovInfos['pourcentageRefus'];
        proposalInfos['seuilDeVeto'] = tblGovInfos['pourcentageVeto'];



        // Récupération des tally de ce vote en cours
        const rawTally = await lcd.gov.getTally(propID).catch(handleError);
        if(rawTally?.data?.tally) {

            proposalInfos['nbVotesYesLunc'] = parseInt(rawTally.data.tally.yes);
            proposalInfos['nbVotesAbstainLunc'] = parseInt(rawTally.data.tally.abstain);
            proposalInfos['nbVotesNoLunc'] = parseInt(rawTally.data.tally.no);
            proposalInfos['nbVotesNowithvetoLunc'] = parseInt(rawTally.data.tally.no_with_veto);
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

    // Si un vote est en finis (status = "PROPOSAL_STATUS_PASSED", ou "PROPOSAL_STATUS_REJECTED"), alors on récupère d'autres infos particulières
    if(proposalInfos['status'] === "PROPOSAL_STATUS_PASSED" || proposalInfos['status'] === "PROPOSAL_STATUS_REJECTED") {

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

        if(proposalInfos['status'] === "PROPOSAL_STATUS_PASSED")
            proposalInfos['statutVote'] = "Proposal ADOPTED";
        else {
            proposalInfos['seuilVeto'] = tblGovInfos['pourcentageVeto'] * (proposalInfos['pourcentageOfYes'] + proposalInfos['pourcentageOfNo'] + proposalInfos['pourcentageOfNoWithVeto']) / 100;
            proposalInfos['isVetoReached'] = (proposalInfos['pourcentageOfNoWithVeto'] > proposalInfos['seuilVeto']);

            if(proposalInfos['isVetoReached'])
                proposalInfos['statutVote'] = "Proposal REJECTED (VETO reached)";
            else
                proposalInfos['statutVote'] = "Proposal REJECTED";
        }

    }         
        

    // =======================================================
    // Exploration des txs, pour récupérer les votes de chacun
    // =======================================================
    // Nota 1 : même si on scanne tout, on excluera les votes de "non validateur"
    // Nota 2 : on enregistrera toutes les transactions validateur dans un tableau historique
    //              array of { txHash, datetime, valoperaddress, valmoniker, vote }
    
    
    if(proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD" || proposalInfos['status'] === "PROPOSAL_STATUS_PASSED" || proposalInfos['status'] === "PROPOSAL_STATUS_REJECTED") {


        // TxSearch doc. : https://terra-classic-lcd.publicnode.com/swagger/#/Service/GetTxsEvent
        // ======================================================================================
        // Si 407 entrées, par exemple
        // ---------------------------
        // Page 1 (0-99) :     https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=1&events=proposal_vote.proposal_id%3D11784
        // Page 2 (100-199) :  https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=2&events=proposal_vote.proposal_id%3D11784
        // Page 3 (200-299) :  https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=3&events=proposal_vote.proposal_id%3D11784
        // Page 4 (300-399) :  https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=4&events=proposal_vote.proposal_id%3D11784
        // Page 5 (400-406) :  https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=5&events=proposal_vote.proposal_id%3D11784

        
        // Montage des paramètres nécessaires ici
        const params = new URLSearchParams();
        params.append("page", 1);
        //params.append("events", "message.action='/cosmos.gov.v1beta1.MsgVote'");      // Enlevé, car certains peuvent voter avec la fonction MsgExec (key : "action", value : "/cosmos.authz.v1beta1.MsgExec")
        params.append("events", "proposal_vote.proposal_id=" + propID.toString());

        // Exécution de la requête de recherche de Tx, ayant voté pour cette prop (traitement 'obligé' par lot de 100, attention)
        const rawTxs = await lcd.tx.searchTxsByEvent(params).catch(handleError);
        if(rawTxs?.data?.total || rawTxs?.data?.pagination?.total) {
// console.log("rawTxs.data", rawTxs.data);
            const nbTotalDeTxs = rawTxs.data.total ? parseInt(rawTxs.data.total) : parseInt(rawTxs.data.pagination.total);

            if(nbTotalDeTxs > 0) {
                
                // ===================================================
                // Création d'un tableau de vote, pour les validateurs
                // ===================================================
                // Nota 1 : mettre tous les validateurs, si status = "PROPOSAL_STATUS_PASSED" ou status = "PROPOSAL_STATUS_REJECTED"
                // Nota 2 : mettre uniquement les validateurs actifs, si status = "PROPOSAL_STATUS_VOTING_PERIOD" (prop en cours de vote)
                
                if(proposalInfos['status'] === "PROPOSAL_STATUS_PASSED" || proposalInfos['status'] === "PROPOSAL_STATUS_REJECTED") {
                    tblDesVotesDeValidateur = {...tblValidators};
                            // On effacera ensuite ceux qui n'ont pas voté, du fait qu'on ne saurait distinguer s'ils étaient là à l'époquer, pour voter ou non

                    for (const valoperAdr of Object.keys(tblDesVotesDeValidateur)) {
                        tblDesVotesDeValidateur[valoperAdr].vote = '***';
                    }
                }
                if(proposalInfos['status'] === "PROPOSAL_STATUS_VOTING_PERIOD") {
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
// console.log(rawTxs.data.tx_responses[i].height);
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
                                        // array of { txHash, datetime, valoperaddress, valmoniker, voting_power_pourcentage, vote, memo, version }
                                        'txhash': txhash,
                                        'datetime': txtdatetime,
                                        'valoperaddress': tblValidatorsAccounts[voter],
                                        'valmoniker': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].description_moniker,
                                        'voting_power_pourcentage': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].voting_power_pourcentage,
                                        'vote': voteoption,
                                        'memo': rawTxs.data.tx_responses[i].tx.body.memo ? rawTxs.data.tx_responses[i].tx.body.memo : "",
                                        'version': null
                                    })
                                }
                                //  else {
                                //     tblDesVotesNonValidateur[voter] = {};
                                //     tblDesVotesNonValidateur[voter].vote = voteoption;
                                //     tblHistoriqueDesVotesNonValidateur.push({
                                //         // array of { txHash, datetime, terra1address, vote }
                                //         'txhash': txhash,
                                //         'datetime': txtdatetime,
                                //         'terra1address': voter,
                                //         'vote': voteoption
                                //     })
                                // }
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
                                                // array of { txHash, datetime, valoperaddress, valmoniker, voting_power_pourcentage, vote, memo, version }
                                                'txhash': txhash,
                                                'datetime': txtdatetime,
                                                'valoperaddress': tblValidatorsAccounts[voter],
                                                'valmoniker': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].description_moniker,
                                                'voting_power_pourcentage': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].voting_power_pourcentage,
                                                'vote': voteoption,
                                                'memo': rawTxs.data.tx_responses[i].tx.body.memo ? rawTxs.data.tx_responses[i].tx.body.memo : "",
                                                'version': null
                                            })
                                        }
                                        //  else {
                                        //     tblDesVotesNonValidateur[voter] = {};
                                        //     tblDesVotesNonValidateur[voter].vote = voteoption;
                                        //     tblHistoriqueDesVotesNonValidateur.push({
                                        //         // array of { txHash, datetime, terra1address, vote }
                                        //         'txhash': txhash,
                                        //         'datetime': txtdatetime,
                                        //         'terra1address': voter,
                                        //         'vote': voteoption
                                        //     })        
                                        // }
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


                    // TxSearch doc. : https://terra-classic-lcd.publicnode.com/swagger/#/Service/GetTxsEvent
                    // ======================================================================================
                    // Si 407 entrées, par exemple
                    // ---------------------------
                    // Page 1 (0-99) :     https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=1&events=proposal_vote.proposal_id%3D11784
                    // Page 2 (100-199) :  https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=2&events=proposal_vote.proposal_id%3D11784
                    // Page 3 (200-299) :  https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=3&events=proposal_vote.proposal_id%3D11784
                    // Page 4 (300-399) :  https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=4&events=proposal_vote.proposal_id%3D11784
                    // Page 5 (400-406) :  https://terra-classic-lcd.publicnode.com/cosmos/tx/v1beta1/txs?page=5&events=proposal_vote.proposal_id%3D11784


                    // Montage des paramètres nécessaires ici
                    const params = new URLSearchParams();
                    params.append("page", n+1);
                    // params.append("events", "message.action='/cosmos.gov.v1beta1.MsgVote'");      // Enlevé, car certains peuvent voter avec la fonction MsgExec (key : "action", value : "/cosmos.authz.v1beta1.MsgExec")
                    params.append("events", "proposal_vote.proposal_id=" + propID.toString());

                    // Exécution de la requête de recherche des 100 txs suivants
                    const rawTxsSuivants = await lcd.tx.searchTxsByEvent(params).catch(handleError);
                    if(rawTxsSuivants?.data?.txs) {
    // console.log("rawTxsSuivants.data", rawTxsSuivants.data);
                        // Traitement des 100 premiers txs (ou moins, si y'en a moins, bien sûr)
                        for(let i=0 ; i < rawTxsSuivants.data.txs.length ; i++) {
                            let txcode = rawTxsSuivants.data.tx_responses[i].code;
                            // On analyse seulement les transactions réussie (code = 0)
                            if(txcode === 0) {
    // console.log(rawTxsSuivants.data.tx_responses[i].height);
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
                                                // array of { txHash, datetime, valoperaddress, valmoniker, voting_power_pourcentage, vote, memo, version }
                                                'txhash': txhash,
                                                'datetime': txtdatetime,
                                                'valoperaddress': tblValidatorsAccounts[voter],
                                                'valmoniker': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].description_moniker,
                                                'voting_power_pourcentage': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].voting_power_pourcentage,
                                                'vote': voteoption,
                                                'memo': rawTxsSuivants.data.tx_responses[i].tx.body.memo ? rawTxsSuivants.data.tx_responses[i].tx.body.memo : "",
                                                'version': null
                                            })
                                        }
                                        //  else {
                                        //     tblDesVotesNonValidateur[voter] = {};
                                        //     tblDesVotesNonValidateur[voter].vote = voteoption;
                                        //     tblHistoriqueDesVotesNonValidateur.push({
                                        //         // array of { txHash, datetime, terra1address, vote }
                                        //         'txhash': txhash,
                                        //         'datetime': txtdatetime,
                                        //         'terra1address': voter,
                                        //         'vote': voteoption
                                        //     })        
                                        // }
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
                                                        // array of { txHash, datetime, valoperaddress, valmoniker, voting_power_pourcentage, vote, memo, version }
                                                        'txhash': txhash,
                                                        'datetime': txtdatetime,
                                                        'valoperaddress': tblValidatorsAccounts[voter],
                                                        'valmoniker': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].description_moniker,
                                                        'voting_power_pourcentage': tblDesVotesDeValidateur[tblValidatorsAccounts[voter]].voting_power_pourcentage,
                                                        'vote': voteoption,
                                                        'memo': rawTxsSuivants.data.tx_responses[i].tx.body.memo ? rawTxsSuivants.data.tx_responses[i].tx.body.memo : "",
                                                        'version': null
                                                    })
                                                }
                                                //  else {
                                                //     tblDesVotesNonValidateur[voter] = {};
                                                //     tblDesVotesNonValidateur[voter].vote = voteoption;
                                                //     tblHistoriqueDesVotesNonValidateur.push({
                                                //         // array of { txHash, datetime, terra1address, vote }
                                                //         'txhash': txhash,
                                                //         'datetime': txtdatetime,
                                                //         'terra1address': voter,
                                                //         'vote': voteoption
                                                //     })                
                                                // }
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

        } else {
            console.log("rawTxs.data", rawTxs.data);
            console.warn("[ERROR] Failed to fetch [txs] for votes ...");
            //return { "erreur": "Failed to fetch [txs] for votes ..." }
        }
    }



    // Ajout des numéros de version, en cas de votes multiples, dans l'historique des votes des validateurs
    // (pour rappel, c'est un array of { txHash, datetime, valoperaddress, valmoniker, voting_power_pourcentage, vote, memo, version })
    if(tblHistoriqueDesVotesValidateur.length > 1) {
        for(let idxTblVal=0 ; idxTblVal < tblHistoriqueDesVotesValidateur.length ; idxTblVal++) {
            let valVoteVersion = 0;
            for(let idxPrevTblVal=0 ; idxPrevTblVal < idxTblVal ; idxPrevTblVal++) {
                if(tblHistoriqueDesVotesValidateur[idxPrevTblVal].valoperaddress === tblHistoriqueDesVotesValidateur[idxTblVal].valoperaddress) {
                    if(valVoteVersion === 0) {
                        tblHistoriqueDesVotesValidateur[idxPrevTblVal].version = 1;
                        valVoteVersion += 2;
                    } else {
                        valVoteVersion += 1;
                    }
                }
            }
            tblHistoriqueDesVotesValidateur[idxTblVal].version = valVoteVersion;
        }
    }


    // Ajout de ces votes validateurs, au retour-données
    proposalInfos['tblDesVotesDeValidateur'] = tblDesVotesDeValidateur;
    proposalInfos['tblHistoriqueDesVotesValidateur'] = tblHistoriqueDesVotesValidateur;
    // proposalInfos['tblDesVotesNonValidateur'] = tblDesVotesNonValidateur;
    // proposalInfos['tblHistoriqueDesVotesNonValidateur'] = tblHistoriqueDesVotesNonValidateur;

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
    

    // // Comptage des votes des "non validateur", par catégorie
    // proposalInfos['non_validator_TOTAL_VOTES'] = 0;
    // proposalInfos['non_validator_VOTE_OPTION_YES'] = 0;
    // proposalInfos['non_validator_VOTE_OPTION_ABSTAIN'] = 0;
    // proposalInfos['non_validator_VOTE_OPTION_NO'] = 0;
    // proposalInfos['non_validator_VOTE_OPTION_NO_WITH_VETO'] = 0;
    // for (const nonvalidator of Object.values(tblDesVotesNonValidateur)) {
    //     proposalInfos['non_validator_TOTAL_VOTES'] += 1;
    //     if(nonvalidator.vote === "VOTE_OPTION_YES")
    //         proposalInfos['non_validator_VOTE_OPTION_YES'] += 1;
    //     if(nonvalidator.vote === "VOTE_OPTION_ABSTAIN")
    //         proposalInfos['non_validator_VOTE_OPTION_ABSTAIN'] += 1;
    //     if(nonvalidator.vote === "VOTE_OPTION_NO")
    //         proposalInfos['non_validator_VOTE_OPTION_NO'] += 1;
    //     if(nonvalidator.vote === "VOTE_OPTION_NO_WITH_VETO")
    //         proposalInfos['non_validator_VOTE_OPTION_NO_WITH_VETO'] += 1;
    // }


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
// Créé un STRING avec montant+devise, séparé de virgules si multidevises
// ======================================================================
const coinsListToFormatedText = (coinsList) => {
    if(coinsList===undefined)
        return "---";

    //const dataCoinsList = (new Coins(coinsList)).toData();
    const dataCoinsList = new CoinsList(coinsList);
    let retour = "";
    
    if(dataCoinsList.tbl.length > 0) {
        for(let i=0 ; i < dataCoinsList.tbl.length ; i++) {
            const msgAmount = (dataCoinsList.tbl[i].amount/1000000).toFixed(6);
            const msgCoin = tblCorrespondanceValeurs[dataCoinsList.tbl[i].denom] ? tblCorrespondanceValeurs[dataCoinsList.tbl[i].denom] : dataCoinsList.tbl[i].denom;
            if(retour !== "")
                retour += ", ";
            retour += (metEnFormeAmountPartieEntiere(msgAmount) + retournePartieDecimaleFixed6(msgAmount) + "\u00a0" + msgCoin);
        }
    } else {
        retour = "---";
    }

    return retour;
}