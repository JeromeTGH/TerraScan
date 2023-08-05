import { chainID, chainLCDurl } from '../application/AppParams';
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
    // const rawTransactions = await lcd.tx.search({"events.tx.height": "13973270"}).catch(handleError);
    const rawTransactions = await lcd.tx.search({"events": ["tx.height=13973270"]}).catch(handleError);
    // const rawTransactions = await lcd.tx.search({"events" : [{"tx.height": "13973270"}]}).catch(handleError);
    // const rawTransactions = await lcd.tx.search({"events" : ["tx.height=13973270"]}).catch(handleError);
            
    
            // Réponse ?! "Please specify tx.height event with strict equality. Thank you for understanding."

    if(rawTransactions) {
        // Envoi des infos en retour
        return tblTransactions;
    } else
        return { "erreur": "Failed to fetch [transactions] ..." };

}


const handleError = (err) => {
    console.log("ERREUR", err);
}