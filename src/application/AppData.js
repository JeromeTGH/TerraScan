
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



// **********************************************************************************************
// Liste contenant des paramètres généraux, figurant sur la homepage, et ne bougeant que rarement
// **********************************************************************************************
// Structure :
//      tblHomeData = {
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
export const tblHomeData = {};
