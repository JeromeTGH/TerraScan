import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';

const listOfBlocks = []             // [blockHeight, blockNbTx, blockProposerTerra1adr, blockProposerName]
const tblValidators = []            // [valTerra1adr, valPubkey, valValconsAdr, valName]

export const getLatestBlocks = async (qte = 10) => {

    let lastBlockRead_Height = 0;
    let lastBlockRead_NbTx = 0;
    let lastBlockRead_ProposerAddress = 0;

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    // Récupération du dernier block
    const lastBlock = await lcd.tendermint.blockInfo().catch(handleError)
    if(lastBlock) {
        const checkBlockIinList = listOfBlocks.filter(ligne => ligne[0]===lastBlock.block.header.height);
        if(checkBlockIinList.length === 0) {
            // Block "non connu"
            lastBlockRead_Height = lastBlock.block.header.height;
            lastBlockRead_NbTx = lastBlock.block.data.txs.length;
            lastBlockRead_ProposerAddress = lastBlock.block.header.proposer_address;
            listOfBlocks.push([lastBlockRead_Height, lastBlockRead_NbTx, lastBlockRead_ProposerAddress]);
        } else {
            // Block "connu"
            lastBlockRead_Height = checkBlockIinList[0];
        }
    } else
        return { "erreur": "Failed to fetch last block ..." }
        
    // Récupération des 'n-1' blocks précédents, si non présents dans le tableau 'listOfBlocks'
    for(let i=(lastBlockRead_Height-1) ; i > (lastBlockRead_Height-qte) ; i--) {
        const checkBlockIinList = listOfBlocks.filter(ligne => ligne[0]===i.toString());
        if(checkBlockIinList.length === 0) {
            const blockNumberI = await lcd.tendermint.blockInfo(i).catch(handleError);
            if(blockNumberI) {
                listOfBlocks.push([blockNumberI.block.header.height, blockNumberI.block.data.txs.length, blockNumberI.block.header.proposer_address]);
            } else
                return { "erreur": "Failed to fetch previous blocks ..." }
        }
    }

    // Triage de la liste des blocks (le bloc le plus haut en tête !)
    listOfBlocks.sort((a, b) => {
        return b[0] - a[0];
    })

    // Et renvoie de la liste, tronquée au besoin
    return listOfBlocks.slice(0, qte);
    
}


const handleError = (err) => {
    console.log("ERREUR", err);
}