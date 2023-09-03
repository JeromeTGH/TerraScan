import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';
import Decimal from 'decimal.js';


export const getProposals = async (governanceInfos) => {

    // Variables
    const tblProposals = [];
    let nbLuncStaked = 0;

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération de toutes les propositions
    const rawDeposals = await lcd.gov.proposals({'pagination.limit': '9999'}).catch(handleError);
    if(rawDeposals)
        tblProposals.push(...rawDeposals[0].reverse());             // Enregistrement dans tableau, avec tri du plus récent au plus ancien
    else
        return { "erreur": "Failed to fetch [proposals] ..." }
    

    // Récupération du montant total de LUNC stakés (pour avoir des ratios de vote)
    const rawStakingPool = await lcd.staking.pool().catch(handleError);
    if(rawStakingPool) {
        const bondedTokens = (new Decimal(rawStakingPool.bonded_tokens.amount)).toFixed(0);
        // nbLuncStaked = parseInt(bondedTokens/1000000);       // On garde les uluna ici, pour plus de précision
        nbLuncStaked = bondedTokens;
    } else
        return { "erreur": "Failed to fetch [staking pool] ..." }


    // Ajout de champs "tally", pour les votes en cours
    for(let i=0 ; i<tblProposals.length ; i++) {
        if(tblProposals[i].status === 1) {
            // console.log(tblProposals[i]);
            if(tblProposals[i].total_deposit.toString() !== "") {
                tblProposals[i]['totalDeposit'] = parseInt(tblProposals[i].total_deposit.toString().replace('uluna', ''))/1000000;
                tblProposals[i]['pourcentageDeposit'] = tblProposals[i]['totalDeposit'] / governanceInfos['nbMinDepositLunc'] * 100;
            } else {
                tblProposals[i]['totalDeposit'] = 0;
                tblProposals[i]['pourcentageDeposit'] = 0;
            }
            tblProposals[i]['nbMinDepositLunc'] = governanceInfos['nbMinDepositLunc'];

            // Calcul du pourcentage d'avancement, dans la période de deposit
            let startDatetime = new Date(tblProposals[i]['submit_time']);
            let endDatetime = new Date(tblProposals[i]['deposit_end_time']);
            let actualDatetime = new Date();
            tblProposals[i]['pourcentageOfDepositPeriod'] = (actualDatetime.getTime()/1000 - startDatetime.getTime()/1000) / (endDatetime.getTime()/1000 - startDatetime.getTime()/1000) * 100;
            
        }
        if(tblProposals[i].status === 3 || tblProposals[i].status === 4) {              // 3 = proposition adopté et 4 = proposition rejetée
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
        if(tblProposals[i].status === 2) {              // 2 = vote en cours
            const rawTally = await lcd.gov.tally(tblProposals[i].id).catch(handleError);
            if(rawTally) {
                const pourcentageOfYes = rawTally.yes / nbLuncStaked * 100;
                const pourcentageOfAbstain = rawTally.abstain / nbLuncStaked * 100;
                const pourcentageOfNo = rawTally.no / nbLuncStaked * 100;
                const pourcentageOfNoWithVeto = rawTally.no_with_veto / nbLuncStaked * 100;
                const pourcentageOfVoters = pourcentageOfYes + pourcentageOfAbstain + pourcentageOfNo + pourcentageOfNoWithVeto;

                const seuilQuorum = governanceInfos['quorum'];
                const seuilVeto = governanceInfos['seuilDeVeto'];
                const seuilAcceptation = governanceInfos['seuilDacceptation'];
                // const seuilDeRejet = governanceInfos['seuilDeRefus'];


                const statutVote = pourcentageOfVoters < seuilQuorum ? "quorum not reached (" + pourcentageOfVoters.toFixed(2) + "% voted, but " + seuilQuorum + "% needed)" :
                pourcentageOfNoWithVeto > seuilVeto ? "VETO threshold reached (threshold = " + seuilVeto + "%)" :
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

                // Infos supplémentaires
                tblProposals[i]['isQuorumReached'] = pourcentageOfVoters >= seuilQuorum;
                tblProposals[i]['seuilQuorum'] = seuilQuorum;
                tblProposals[i]['isVetoReached'] = tblProposals[i]['isQuorumReached'] && (pourcentageOfNoWithVeto > seuilVeto);
                tblProposals[i]['seuilVeto'] = seuilVeto * pourcentageOfVoters / 100;
                tblProposals[i]['seuilAcceptation'] = seuilAcceptation * (pourcentageOfYes + pourcentageOfNo + pourcentageOfNoWithVeto) / 100;

            } else
                return { "erreur": "Failed to fetch [tally of proposal #" + tblProposals[i].id + "] ..." }
        }
    }


    // Envoi des infos en retour
    return tblProposals;
}


// ===========================
// Log les éventuelles erreurs
// ===========================
const handleError = (err) => {
    console.log("ERREUR", err);
}
