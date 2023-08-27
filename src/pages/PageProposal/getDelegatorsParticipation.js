import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';
import { tblValidators } from '../../application/AppData';
// import { metEnFormeGrandNombre } from '../../application/AppUtils';

// Variable globale
let nbreTotalDeStakersUniques = 0;

// ================================================================================
// Récupération du nombre total de délégateurs (récup du nbre par validateur actif)
// ================================================================================
export const getDelegatorsParticipation = async () => {

    // Si la liste des validateurs n'est pas en mémoire (donc pas réussie à charger au niveau du "getProposal"), alors on ne va pas plus loin
    if(!tblValidators)
        return { "erreur": "(unable to load)" }


    // Si le nombre total unique de staker est déjà chargé, alors on le retransmet
    if(nbreTotalDeStakersUniques > 0)
        return nbreTotalDeStakersUniques;

    // Variables locales
    const tblDelegators = {};           // object of { delegatorAddress, delegatorInfos } avec delegatorInfos = { stakedAmount }
    let totalStackedAmount = 0;

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    // Parcours de toute la liste des validateurs
    for(const [valoperAddress, valInfos] of Object.entries(tblValidators)) {

        // Prise en compte des validateurs actifs, uniquement
        if(valInfos.status === 'active') {

            // Chargement de la liste des delegators de ce validator
            const rawDelegators = await lcd.staking.delegations(undefined, valoperAddress, {"pagination.limit": 99999}).catch(handleError);
            if(rawDelegators) {

                // Parcours des délégateurs de ce validateur
                for(const delegator of rawDelegators[0]) {
                    // eslint-disable-next-line
                    totalStackedAmount += delegator.balance.amount / 1000000;

                    // On regarde si ce délégateur a été trouvé dans d'autres validateurs ou pas
                    if(tblDelegators[delegator.delegator_address]) {
                        // S'il est déjà connu, on n'augemente que son compte de LUNC stackés
                        tblDelegators[delegator.delegator_address].stakedAmount += delegator.balance.amount / 1000000
                    } else {
                        // Sinon, on l'enregistre, avec son montant stacké
                        tblDelegators[delegator.delegator_address] = {};
                        tblDelegators[delegator.delegator_address].stakedAmount = delegator.balance.amount / 1000000
                    }
                }                

            } else
                return { "erreur": "Failed to fetch [delegations] ..." }

        }
    }

    // On enregistre ce résultat
    nbreTotalDeStakersUniques = Object.keys(tblDelegators).length;
    
    // Debug/vérif
    // console.log("Total staked LUNC = " + metEnFormeGrandNombre(totalStackedAmount, 3));

    // Et on retourne le nbre de stackers uniques
    return nbreTotalDeStakersUniques;

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