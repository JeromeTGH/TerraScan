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
                const seuilDeRejet = governanceInfos['seuilDeRefus'];

                const statutVote = pourcentageOfVoters < seuilQuorum ? "Quorum not reached, for the moment (" + seuilQuorum + "% needed)" :
                                        pourcentageOfNoWithVeto > seuilVeto ? "VETO threshold reached, for the moment (veto threshold = " + seuilVeto + "%)" :
                                        pourcentageOfYes < (pourcentageOfNo + pourcentageOfNoWithVeto) ? "Majority of NO, for the moment (reject threshold = " + seuilDeRejet + "%, vs YES)" :
                                                                              "Majority of YES, for the moment (acceptation threshold = " + seuilAcceptation + "%, vs NO+VETO)";
                                      
                tblProposals[i]['pourcentageOfYes'] = pourcentageOfYes.toFixed(2);
                tblProposals[i]['pourcentageOfAbstain'] = pourcentageOfAbstain.toFixed(2);
                tblProposals[i]['pourcentageOfNo'] = pourcentageOfNo.toFixed(2);
                tblProposals[i]['pourcentageOfNoWithVeto'] = pourcentageOfNoWithVeto.toFixed(2);

                tblProposals[i]['pourcentageOfVoters'] = pourcentageOfVoters.toFixed(2);
                tblProposals[i]['pourcentageOfAllNo'] = (pourcentageOfNo + pourcentageOfNoWithVeto).toFixed(2);

                tblProposals[i]['statutVote'] = statutVote;
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
