import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';


export const getTransactionsAccount = async (accountAddress) => {
    
    // Variables
    const tblTransactions = [];
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });



    // Recherche de transactions, pour un compte donné
    const rawTransactions = await lcd.tx.search({
        events: [
            // { key: 'tx.height', value: '14100312' }                                          // Test #1 : works
            // { key: 'submit_proposal.proposal_id', value: 11695 }                             // Test #2 : works
            { key: 'bank.account', value: 'terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd' }      // Test #3 : does not work
        ],
        'pagination.limit': '9999'
      }).catch(handleError);


    if(rawTransactions) {
        // Envoi des infos en retour
        console.log("rawTransactions", rawTransactions);
    } else
        return { "erreur": "Failed to fetch [transactions] ..." };







    // === Fetch validators
    // const params = new URLSearchParams();
    // params.append("pagination.limit", "9999");

    // const rawValidators = await lcd.staking.validators(params).catch(handleError);
    // if(rawValidators) {
    //     console.log("rawValidators", rawValidators);
    // } else
    //     return { "erreur": "Failed to fetch [validators] ..." };


    return tblTransactions;

}


const handleError = (err) => {
    // console.log("ERREUR", err);
    console.log(err.response.data.message);
}