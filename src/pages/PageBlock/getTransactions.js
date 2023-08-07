import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient, hashToHex } from '@terra-money/terra.js';


export const getTransactions = async (blockNumber) => {
    
    const transactionsInfos = [];
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération des infos concernant ce block
    const rawBlockInfos = await lcd.tendermint.blockInfo(blockNumber).catch(handleError);
    if(rawBlockInfos) {
        rawBlockInfos.block.data.txs.forEach(element => {
            transactionsInfos.push([
                hashToHex(element)
            ])

        })
        
        // blockInfos['height'] = rawBlockInfos.block.header.height;
        // blockInfos['datetime'] = rawBlockInfos.block.header.time;
        // blockInfos['nbTransactions'] = rawBlockInfos.block.data.txs.length;
        // blockProposerValconsAddress = bech32.encode('terravalcons', bech32.toWords(Buffer.from(rawBlockInfos.block.header.proposer_address, 'base64')));
    } else
        return { "erreur": "Failed to fetch [block infos] ..." }
    

    // Envoi des infos en retour
    return transactionsInfos;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}