import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';
import { bech32 } from 'bech32';

/*
    Remarques générales
    ===================

    /!\ L'adresse 'terravalcons' obtenue à partir du 'proposer_address' d'un block donné, n'est pas égal au moindre 'terravalcons' du moindre validateur.
    
    Pour retrouver les infos validateurs d'un proposer_address donné, il faut :
        - récupérer le proposer_address d'un block donné
        - transformer cela en "block valcons address"
        - récupérer le validator set du block donné
        - retrouver la pubkey correspondant au "block valcons address" ci-dessus
        - récupérer la liste des validateurs
        - et retrouver les infos validateur (nom, adresse terravaloper, ...) à partir de la pubkey précédemment trouvée

*/

const listOfBlocks = []             // RETURN ==> [[blockHeight, blockNbTx, blockValConsAdr, valOperAdr, valName]]
const tblValidators = []            // [[valOperAdr, valPubkey, blockValConsAdr, valName]]

export const getLatestBlocks = async (qte) => {

    let lastBlockRead_Height = 0;
    let lastBlockRead_NbTx = 0;
    let lastBlockRead_ProposerValConsAdr = 0;
    let lastBlockRead_indexInTblOfBlocks = 0;

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération de la liste de tous les validateurs
    const validatorsList = await lcd.staking.validators({'pagination.limit': '9999'}).catch(handleError);
    if(validatorsList) {
        validatorsList[0].forEach((validateur) => {
            // push [valOperAdr, valPubkey, blockValConsAdr, valName]
            tblValidators.push([
                validateur.operator_address,            // terravaloper1...
                validateur.consensus_pubkey.key,        // pubkey
                '',
                validateur.description.moniker          // name
            ])

        })
    } else
        return { "erreur": "Failed to fetch [validators list] ..." }


    // Récupération du dernier block
    const lastBlock = await lcd.tendermint.blockInfo().catch(handleError);
    if(lastBlock) {
        const checkBlockIinList = listOfBlocks.filter(ligne => ligne[0]===lastBlock.block.header.height);
        if(checkBlockIinList.length === 0) {
            // Block "non connu"
            lastBlockRead_Height = lastBlock.block.header.height;
            lastBlockRead_NbTx = lastBlock.block.data.txs.length;
            lastBlockRead_ProposerValConsAdr = bech32.encode('terravalcons', bech32.toWords(Buffer.from(lastBlock.block.header.proposer_address, 'base64')));
            // [blockHeight, blockNbTx, blockValConsAdr, valOperAdr, valName]
            lastBlockRead_indexInTblOfBlocks = listOfBlocks.push([
                lastBlockRead_Height,
                lastBlockRead_NbTx,
                lastBlockRead_ProposerValConsAdr,
                '',
                'Unknown'
            ]) - 1;         // Push et récup index-1 dans la foulée
        } else {
            // Block "connu"
            lastBlockRead_Height = checkBlockIinList[0][0];
            lastBlockRead_NbTx = checkBlockIinList[0][1];
            lastBlockRead_ProposerValConsAdr = checkBlockIinList[0][2];
            lastBlockRead_indexInTblOfBlocks = listOfBlocks.findIndex(lgTblBlocks => lgTblBlocks[0].includes(lastBlockRead_Height));
        }
    } else
        return { "erreur": "Failed to fetch [last block] ..." }


    // Récupération du validator set du "dernier" block lu
    const validatorSetOfLastBlockRead = await lcd.tendermint.validatorSet(lastBlockRead_Height).catch(handleError);
    if(validatorSetOfLastBlockRead) {                       // Nota : seuls les 100 premiers du ValidatorSet sont retournés ici
        
        // Enregistrement des 100 validator address des 100 premiers validators retournés dans le Set
        validatorSetOfLastBlockRead[0].forEach((val) => {
            const indexValInGlobalTbl = tblValidators.findIndex(lgTblValidator => lgTblValidator.includes(val.pub_key.key));
            if(indexValInGlobalTbl >= 0)
                tblValidators[indexValInGlobalTbl][2] = val.address;
        })
        
        // Récupération des X*100 suivants
        const nbAutresLecteuresDe100ValidateursAfaire = parseInt(validatorSetOfLastBlockRead[1].total / 100) + 1
        for(let i=1 ; i < nbAutresLecteuresDe100ValidateursAfaire ; i++) {
            const nextValidatorSetOfLastBlockRead = await lcd.tendermint.validatorSet(lastBlockRead_Height, {'pagination.offset': 100*i}).catch(handleError)
            if(nextValidatorSetOfLastBlockRead) {
                nextValidatorSetOfLastBlockRead[0].forEach((val) => {
                    const indexValInGlobalTbl = tblValidators.findIndex(lgTblValidator => lgTblValidator.includes(val.pub_key.key));
                    if(indexValInGlobalTbl >= 0)
                        tblValidators[indexValInGlobalTbl][2] = val.address;
                })
            }
        }
    } else
        return { "erreur": "Failed to fetch [validator set] of block " + lastBlockRead_Height + " ..." }

        
    // Mise à jour des infos du block précédemment chargé ("dernier block"), si listOfBlocks→valOpenAdr = ''
    if(listOfBlocks[lastBlockRead_indexInTblOfBlocks][3] === '') {
        const indexValWithThisValConsAddress = tblValidators.findIndex(lgTblValidator => lgTblValidator.includes(lastBlockRead_ProposerValConsAdr));
        if(indexValWithThisValConsAddress >= 0) {
            // listOfBlocks : array of [blockHeight, blockNbTx, blockValConsAdr, valOperAdr, valName]
            // tblValidators : array of [valOperAdr, valPubkey, blockValConsAdr, valName]
            listOfBlocks[lastBlockRead_indexInTblOfBlocks][3] = tblValidators[indexValWithThisValConsAddress][0];
            listOfBlocks[lastBlockRead_indexInTblOfBlocks][4] = tblValidators[indexValWithThisValConsAddress][3];
        }
    }


    // Récupération des 'n-1' blocks précédents, si non présents dans le tableau 'listOfBlocks'
    for(let i=(lastBlockRead_Height-1) ; i > (lastBlockRead_Height-qte) ; i--) {
        const checkBlockIinList = listOfBlocks.filter(ligne => ligne[0]===i.toString());
        if(checkBlockIinList.length === 0) {
            const blockNumberI = await lcd.tendermint.blockInfo(i).catch(handleError);
            if(blockNumberI) {
                
                // Récupération des infos du validateur (nota : on se limite au validatorSet précédent ici, mais il faudrait idéalement creuser plus loin, en cas d'unknown)
                let blockI_ProposerValConsAdr = bech32.encode('terravalcons', bech32.toWords(Buffer.from(blockNumberI.block.header.proposer_address, 'base64')));
                let blockI_valOpenAdr = ''
                let blockI_valName = 'Unknown'
                const nextIndexValWithThisValConsAddress = tblValidators.findIndex(lgTblValidator => lgTblValidator.includes(blockI_ProposerValConsAdr));
                if(nextIndexValWithThisValConsAddress >= 0) {
                    blockI_valOpenAdr = tblValidators[nextIndexValWithThisValConsAddress][0];
                    blockI_valName = tblValidators[nextIndexValWithThisValConsAddress][3];
                }

                // [blockHeight, blockNbTx, blockValConsAdr, valOperAdr, valName]
                listOfBlocks.push([
                    blockNumberI.block.header.height,
                    blockNumberI.block.data.txs.length,
                    blockI_ProposerValConsAdr,
                    blockI_valOpenAdr,
                    blockI_valName
                ]);
            } else
                return { "erreur": "Failed to fetch a [previous block] (n°" + i + ") ..." }
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