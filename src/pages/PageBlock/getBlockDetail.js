import { chainID, chainLCDurl } from '../../application/AppParams';
import { LCDClient } from '@terra-money/terra.js';
import { bech32 } from 'bech32';


export const getBlockDetail = async (blockNumber) => {
    
    const blockInfos = {
        'height': null,                 // Numéro de block (doit être égal à 'blockNumber', ici)
        'datetime': null,               // Date et heure du block en question
        'nbTransactions': null,         // Nombre de transactions incluses dans ce block
        'proposerAddress': null,        // Adresse "terravaloper1..." du proposer
        'proposerName': null            // Nom du validateur (proposer)
    }

    // Variables
    let blockProposerValconsAddress;
    let validatorSetValPubKey;
    
    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération des infos concernant ce block
    const rawBlockInfos = await lcd.tendermint.blockInfo(blockNumber).catch(handleError);
    if(rawBlockInfos) {
        blockInfos['height'] = rawBlockInfos.block.header.height;
        blockInfos['datetime'] = rawBlockInfos.block.header.time;
        blockInfos['nbTransactions'] = rawBlockInfos.block.data.txs.length;
        blockProposerValconsAddress = bech32.encode('terravalcons', bech32.toWords(Buffer.from(rawBlockInfos.block.header.proposer_address, 'base64')));
    } else
        return { "erreur": "Failed to fetch [block infos] ..." }
    
    
    // Récupération du validator set du block en question (pour chercher le "valcons" qui nous intéresse)
    const rawValidatorSet = await lcd.tendermint.validatorSet(blockInfos['height']).catch(handleError);
    if(rawValidatorSet) {                       
        // Nota : seuls les 100 premiers du ValidatorSet sont retournés ici
        rawValidatorSet[0].forEach(element => {
            if(element.address === blockProposerValconsAddress)
                validatorSetValPubKey = element.pub_key.key;
        })

        // Si on n'a pas trouvé le valcons qui nous intéresse dans les 100 premiers, on passe aux suivants
        if(validatorSetValPubKey === undefined) {
            const nbAutresLecteuresDe100ValidateursAfaire = parseInt(rawValidatorSet[1].total / 100) + 1;
            for(let i=1 ; i < nbAutresLecteuresDe100ValidateursAfaire ; i++) {
                const rawNextValidatorSet = await lcd.tendermint.validatorSet(blockInfos['height']*0, {'pagination.offset': 100*i}).catch(handleError);
                if(rawNextValidatorSet) {
                    // eslint-disable-next-line
                    rawNextValidatorSet[0].forEach(element => {
                        if(element.address === blockProposerValconsAddress)
                            validatorSetValPubKey = element.pub_key.key;
                    })
                } else
                    return { "erreur": "Failed to fetch [validator set] page #" + (i+1) + " ..." }
            }
        }
    } else
        return { "erreur": "Failed to fetch [validator set] ..." }
        

    // Récupération de la liste de tous les validateurs
    const rawValidators = await lcd.staking.validators({'pagination.limit': '9999'}).catch(handleError);
    if(rawValidators) {
        rawValidators[0].forEach((element) => {
            if(element.consensus_pubkey.key === validatorSetValPubKey) {
                blockInfos['proposerAddress'] = element.operator_address;
                blockInfos['proposerName'] = element.description.moniker;
            }
        })
    } else
        return { "erreur": "Failed to fetch [validators list] ..." }


    // Envoi des infos en retour
    return blockInfos;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}