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
    // const rawTransactions = await lcd.tx.search({"events.tx.height": "13975534"}).catch(handleError);
    // const rawTransactions = await lcd.tx.search({"events": [{"transfer.recipient": accountAddress}]}).catch(handleError);
    const rawTransactions = await lcd.tx.search({"events": ["tx.height=13975534"]}).catch(handleError);
    // const rawTransactions = await lcd.tx.search({"events" : [{"tx.height": "13975534"}]}).catch(handleError);
    // const rawTransactions = await lcd.tx.search({"events" : ["tx.height=13975534"]}).catch(handleError);
            
    

    if(rawTransactions) {
        // Envoi des infos en retour
        console.log("rawTransactions", rawTransactions);
        return tblTransactions;
    } else
        return { "erreur": "Failed to fetch [transactions] ..." };

}


const handleError = (err) => {
    console.log("ERREUR", err);
}