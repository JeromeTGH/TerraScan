
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
//          commission_max_change_rate, commission_max_rate, commission_actual_rate,
//          description_details, description_moniker, description_security_contact, description_website,
//          terra1_account_address, status, delegator_shares, shares_on_total_shares_ratio
//      }
export const tblValidators = {};

