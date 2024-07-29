
// ******************************************************************************************
// Liste contenant des infos sur des blocs préalablement lus (pour ne pas avoir à les relire)
// ******************************************************************************************
// Structure :
//      tblBlocks["height"] = {
//          nb_tx,
//          validator_moniker,
//          validator_address,
//          datetime,
//          optional txs [] of {
//              tx_hash,
//              tx_status,
//              tx_type,
//              tx_description,
//              tx_from_account,
//              tx_from_name,
//              tx_from_valoper,
//              tx_to_account,
//              tx_to_name,
//              tx_to_valoper,
//              proposal_id,
//              vote_choice
//          }
//      }
export const tblBlocks = {};


// *************************************************************************************
// Liste contenant la liste des validateurs chargés, à un moment donné, avec leurs infos
// *************************************************************************************
// Structure :
//      tblValidators["valoper"] = {
//          up_time,
//          status,
//          terra1_account_address,
//          description_moniker,
//          description_website,
//          description_security_contact,
//          description_details,
//          profile_icon,
//          voting_power_amount,
//          voting_power_pourcentage,
//          commission_actual_pourcentage,
//          commission_max_pourcentage,
//          commission_max_change_pourcentage,
//          self_delegation_amount,
//          self_delegation_pourcentage
//      }
export const tblValidators = {};
// Structure :
//      tblValidators["terra1_account_address"] = {
//          terravaloper1_address
//      }
export const tblValidatorsAccounts = {};



// ***********************************************************************************
// Liste contenant des infos du 'latest block' récupéré au chargement de l'application
// ***********************************************************************************
// Structure :
//      tblLatestBlockAtAppLoading = {
//          height,
//          datetime
//      }
export const tblLatestBlockAtAppLoading = {};


// *******************************************************************************
// Liste contenant des paramètres généraux concernant la gouvernance ("proposals")
// *******************************************************************************
// Structure :
//      tblGovInfos = {
//          nbLuncRequisPourValiderDeposit,     // Nombre minimum de LUNC à déposer, pour qu'une proposition puisse passer au vote
//          nbJoursMaxPourDeposit,              // Nombre de jours max pour atteindre le depôt requis, afin qu'une proposition puisse passer au vote
//          nbJoursMaxPourVoter,                // Nombre de jours max pour voter une proposition
//          pourcentageQuorum,                  // Quorum (nombre de votant minimum, pour qu'une décision de vote soit jugée valide)
//          pourcentageAcceptation,             // Pourcentage d'acceptation (threshold), pour une proposition donnée ; à comparer à : YES_votes / (YES_votes + NO_votes + VETO_votes)
//          pourcentageRefus,                   // Pourcentage de refus ;  ; à comparer à : NO_votes / (YES_votes + NO_votes + VETO_votes)
//          pourcentageVeto,                    // Pourcentage de vote sur une proposition, pour rejeter une proposition (en faisant perdre son dépôt au proposant)
//                                              // nota : ce pourcentage de VETO est à comparer à : VETO_votes / (YES_votes + NO_votes + VETO_votes)
//      }
export const tblGovInfos = {};


// *******************************************************************************
// Liste contenant toutes les proposals (évite d'avoir à recharger plusieurs fois)
// *******************************************************************************
// Structure :
//      tblProposals = {
//      }
export const tblProposals = [];


// ******************************************************
// Liste contenant des données globales, et peu variantes
// ******************************************************
// Structure :
//      tblGlobalInfos = {
//          nbStakedLunc,           // en 'uluna'
//      +
//          UnbondingTime,          // nombre de jours de blocage d'opération (annulation de délégation, redélégation, par exemple) ; par défaut = 21
//          NbMaxValidators,        // nombre maximale de validateurs actifs possible ; par défaut = 130
//          InflationMax,           // taux d'inflation (mint) maxi ; par défaut, actuellement = 0
//          BurnTaxMax,                            // taxe burn ; actuellement = 0,5 %
//          BurnTaxSplitToBeBurn,                  // dispatching de la taxe burn ; actuellement = 80 % burn et 
//          BurnTaxSplitToDistributionModule,      // 20 % vers module de distribution
//          DistributionModuleSplitToOraclePool,        // dispatching du module de distribution ; actuellement = 50 % vers le pool oracle
//          DistributionModuleSplitToCommunityPool,     // 50 % vers le pool communautaire
//          
//      }
export const tblGlobalInfos = {};