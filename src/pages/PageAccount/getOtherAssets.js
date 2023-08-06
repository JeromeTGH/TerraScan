import { chainID, chainLCDurl, tblCorrespondanceValeurs } from '../../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';

export const getOtherAssets = async (accountAddress) => {

    // Variables
    let tblAssets = [];

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // Récupération des assets présents dans ce compte (nota : uniquement les jetons natifs 'Terra Classic', hormis LUNC et USTC)
    const rawAccountAssets = await lcd.bank.balance(accountAddress).catch(handleError);
    if(rawAccountAssets) {
        const lstCoins = (new Coins(rawAccountAssets[0])).toData();

        lstCoins.forEach(element => {
            if(element.denom !== 'uluna' && element.denom !== 'uusd') {
                if(tblCorrespondanceValeurs[element.denom]) {
                    
                    const nomAsset = tblCorrespondanceValeurs[element.denom];
                    const valeurAsset = (parseFloat(element.amount) / 1000000).toFixed(6);

                    tblAssets.push([
                        nomAsset,
                        valeurAsset,
                        0
                    ])
                }
            }
        })
    } else
        return { "erreur": "Failed to fetch [account assets] ..." }


    // Récupération du montant total des rewards en attente, par coin
    const rawRewards = await lcd.distribution.rewards(accountAddress).catch(handleError);
    if(rawRewards) {
        const lstRewardsPerCoin = (new Coins(rawRewards.total)).toData();

        lstRewardsPerCoin.forEach(element => {
            if(tblCorrespondanceValeurs[element.denom]) {
                const idxElement = tblAssets.findIndex(lgTbl => lgTbl[0] === tblCorrespondanceValeurs[element.denom]);
                if(idxElement > -1)
                    tblAssets[idxElement][2] = (element.amount/1000000).toFixed(6);
            }
        })
    } else
        return { "erreur": "Failed to fetch [rewards infos] ..." }


    // Envoi des infos en retour
    return tblAssets;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}