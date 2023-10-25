import { tblGovInfos, tblProposals } from '../../application/AppData';
import { loadGovInfos } from '../../dataloaders/loadGovInfos';
import { loadNbStakedLunc } from '../../dataloaders/loadNbStakedLunc';
import { loadProposals } from '../../dataloaders/loadProposals';
import { LCDclient } from '../../apis/lcd/LCDclient';


export const getProposals = async () => {

    // Chargement des paramètres de gouvernance
    const retourLoadGovInfos = await loadGovInfos();
    if(retourLoadGovInfos['erreur'])
        return retourLoadGovInfos['erreur'];

    // Chargement de toutes les proposals
    const retourLoadProposals = await loadProposals();
    if(retourLoadProposals['erreur'])
        return retourLoadProposals['erreur'];



    // Création/récupération d'une instance de requétage LCD
    const lcd = LCDclient.getSingleton();
    

    // Récupération du nombre de LUNC stakés
    const nbLuncStaked = await loadNbStakedLunc();
    if(nbLuncStaked['erreur'])
        return nbLuncStaked['erreur'];


    // Ajout de champs "tally", pour les votes en cours
    for(let i=0 ; i<tblProposals.length ; i++) {
        if(tblProposals[i].status === "PROPOSAL_STATUS_DEPOSIT_PERIOD") {

            // console.log(tblProposals[i]);

            let totalDeposit = 0;
            if(tblProposals[i].total_deposit.length > 0) {
                for(const deposit of tblProposals[i].total_deposit) {
                    if(deposit.denom === 'uluna')
                        totalDeposit += deposit.amount / 1000000;
                }
            }

            tblProposals[i]['totalDeposit'] = totalDeposit;
            tblProposals[i]['pourcentageDeposit'] = totalDeposit / tblGovInfos['nbLuncRequisPourValiderDeposit'] * 100;
            tblProposals[i]['nbMinDepositLunc'] = tblGovInfos['nbLuncRequisPourValiderDeposit'];

            // Calcul du pourcentage d'avancement, dans la période de deposit
            let startDatetime = new Date(tblProposals[i]['submit_time']);
            let endDatetime = new Date(tblProposals[i]['deposit_end_time']);
            let actualDatetime = new Date();
            tblProposals[i]['pourcentageOfDepositPeriod'] = (actualDatetime.getTime()/1000 - startDatetime.getTime()/1000) / (endDatetime.getTime()/1000 - startDatetime.getTime()/1000) * 100;
            
        }
        if(tblProposals[i].status === "PROPOSAL_STATUS_PASSED" || tblProposals[i].status === "PROPOSAL_STATUS_REJECTED") {
            // console.log(tblProposals[i].final_tally_result);
            const qteLuncAbstain = parseInt(tblProposals[i].final_tally_result.abstain)/1000000;
            const qteLuncNo = parseInt(tblProposals[i].final_tally_result.no)/1000000;
            const qteLuncNoWithVeto = parseInt(tblProposals[i].final_tally_result.no_with_veto)/1000000;
            const qteLuncYes = parseInt(tblProposals[i].final_tally_result.yes)/1000000;
            const qteLuncTotal = qteLuncAbstain + qteLuncNo + qteLuncNoWithVeto + qteLuncYes;
            tblProposals[i]['pourcentageOfYes'] = (qteLuncYes/qteLuncTotal*100).toFixed(2);
            tblProposals[i]['pourcentageOfAbstain'] = (qteLuncAbstain/qteLuncTotal*100).toFixed(2);
            tblProposals[i]['pourcentageOfNo'] = (qteLuncNo/qteLuncTotal*100).toFixed(2);
            tblProposals[i]['pourcentageOfNoWithVeto'] = (qteLuncNoWithVeto/qteLuncTotal*100).toFixed(2);
        }
        if(tblProposals[i].status === "PROPOSAL_STATUS_VOTING_PERIOD") {
            const rawTally = await lcd.gov.getTally(tblProposals[i].proposal_id).catch(handleError);
            if(rawTally?.data?.tally) {
                const pourcentageOfYes = rawTally.data.tally.yes / nbLuncStaked * 100;
                const pourcentageOfAbstain = rawTally.data.tally.abstain / nbLuncStaked * 100;
                const pourcentageOfNo = rawTally.data.tally.no / nbLuncStaked * 100;
                const pourcentageOfNoWithVeto = rawTally.data.tally.no_with_veto / nbLuncStaked * 100;
                const pourcentageOfVoters = pourcentageOfYes + pourcentageOfAbstain + pourcentageOfNo + pourcentageOfNoWithVeto;

                const seuilQuorum = tblGovInfos['pourcentageQuorum'];
                const seuilVeto = tblGovInfos['pourcentageVeto'];
                const seuilAcceptation = tblGovInfos['pourcentageAcceptation'];

                
                // Infos supplémentaires
                tblProposals[i]['seuilQuorum'] = seuilQuorum;
                tblProposals[i]['seuilVeto'] = seuilVeto * (pourcentageOfYes + pourcentageOfNo + pourcentageOfNoWithVeto) / 100;
                tblProposals[i]['seuilAcceptation'] = seuilAcceptation * (pourcentageOfYes + pourcentageOfNo + pourcentageOfNoWithVeto) / 100;

                tblProposals[i]['isQuorumReached'] = pourcentageOfVoters >= seuilQuorum;
                tblProposals[i]['isVetoReached'] = tblProposals[i]['isQuorumReached'] && (pourcentageOfNoWithVeto > tblProposals[i]['seuilVeto']);


                const statutVote = pourcentageOfVoters < seuilQuorum ? "quorum not reached (" + pourcentageOfVoters.toFixed(2) + "% voted, but " + seuilQuorum + "% needed)" :
                pourcentageOfNoWithVeto > tblProposals[i]['seuilVeto'] ? "VETO threshold reached (threshold = " + seuilVeto + "% of YES+NO+VETO)" :
                pourcentageOfYes < (pourcentageOfNo + pourcentageOfNoWithVeto) ? "majority of NO, for the moment" :
                                                    "majority of YES, for the moment";
                

                tblProposals[i]['pourcentageOfYes'] = pourcentageOfYes.toFixed(2);
                tblProposals[i]['pourcentageOfAbstain'] = pourcentageOfAbstain.toFixed(2);
                tblProposals[i]['pourcentageOfNo'] = pourcentageOfNo.toFixed(2);
                tblProposals[i]['pourcentageOfNoWithVeto'] = pourcentageOfNoWithVeto.toFixed(2);

                tblProposals[i]['pourcentageOfVoters'] = pourcentageOfVoters.toFixed(2);
                tblProposals[i]['pourcentageOfAllNo'] = (pourcentageOfNo + pourcentageOfNoWithVeto).toFixed(2);

                tblProposals[i]['statutVote'] = statutVote;


                // Calcul du pourcentage d'avancement, dans la période de vote
                let startDatetime = new Date(tblProposals[i]['voting_start_time']);
                let endDatetime = new Date(tblProposals[i]['voting_end_time']);
                let actualDatetime = new Date();
                tblProposals[i]['pourcentageOfVotePeriod'] = (actualDatetime.getTime()/1000 - startDatetime.getTime()/1000) / (endDatetime.getTime()/1000 - startDatetime.getTime()/1000) * 100;


            } else
                return { "erreur": "Failed to fetch [tally of proposal #" + tblProposals[i].proposal_id + "] ..." }
        }
    }


    // Envoi des infos en retour
    return tblProposals;
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
