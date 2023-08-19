
// ******************************************************************************************
// Liste contenant des infos sur des blocs préalablement lus (pour ne pas avoir à les relire)
// ******************************************************************************************
// Structure :
//      tblBlocks["height"] = {
//          nb_tx,
//          validator_moniker,
//          validator_address,
//          datetime,
//          txs [] of {tx_hash, tx_description, tx_from_address, tx_from_moniker, tx_to_address, tx_to_moniker}
//      }
export const tblBlocks = {};


// *************************************************************************************
// Liste contenant la liste des validateurs chargés, à un moment donné, avec leurs infos
// *************************************************************************************
// Structure :
//      tblValidators["valoper"] = {
//          commission_max_change_rate, commission_max_rate, commission_actual_rate,
//          description_details, description_moniker, description_security_contact, description_website,
//          valaccount_address, status, delegator_shares, shares_on_total_shares_ratio
//      }
export const tblValidators = {};

