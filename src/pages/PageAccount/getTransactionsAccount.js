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
    const params = new URLSearchParams();
    params.append("pagination.limit", "9999");
    params.append("events", "bank.account='terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd'");         // Search test by event => failed
    // params.toString() ===> pagination.limit=9999&events=bank.account%3D%27terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd%27

    const rawTransactions = await lcd.tx.search(params).catch(handleError);

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
    console.log("ERREUR", err);
}