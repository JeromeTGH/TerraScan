
// ******************************************************************************************
// Liste contenant des infos sur des blocs préalablement lus (pour ne pas avoir à les relire)
// ******************************************************************************************
// Structure : tblBlocks["height"] = { nb_tx, validator_moniker, validator_address, datetime }
export const tblBlocks = {};


// *************************************************************************************
// Liste contenant la liste des validateurs chargés, à un moment donné, avec leurs infos
// *************************************************************************************
// Structure :
//      tblValidators["valoper"] = {
//          commission_max_change_rate, commission_max_rate, commission_actual_rate,
//          description_details, description_moniker, description_security_contact, description_website,
//          operator_address, accAddress,
//          status, delegator_shares
//      }
export const tblValidators = {};

