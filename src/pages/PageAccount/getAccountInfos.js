import { chainID, chainLCDurl } from '../../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';
import Decimal from 'decimal.js';


export const getAccountInfos = async (accountAddress) => {
    
    const accountInfos = {
        'availableLUNCs': 0,            // Nombre de LUNC disponibles (sur le compte, et non stakés, donc)
        'availableUSTCs': 0,            //    (idem, pour les USTC)
        'stakedLUNCs': 0,               // Montant total des LUNC stakés
        'pendingLUNCrewards': 0,        // Montant total des rewards en attente (pour le LUNC)
        'pendingUSTCrewards': 0,        //    (idem, pour les USTC)
        'unbondingLUNC': 0,             // Montant total des LUNC en attente d'unbonding (suite à de l'undelegation)
        'totalLUNC': 0,                 // Montant total des LUNC pour ce compte (i.e. la somme des LUNC libres + stakés + rewards + unbonding)
        'totalUSTC': 0,                 //    (idem, pour les USTC)
    }
    
    // Variables
    let amountOfLuncStaked = 0;
    let amountOfLuncUnbonding = 0;
    let lstValidatorsForThisAccount = [];

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });

    
    // Récupération du nombre de LUNC et USTC disponibles, pour ce compte
    const rawAccountInfos = await lcd.bank.balance(accountAddress).catch(handleError);
    if(rawAccountInfos) {
        const lstCoins = (new Coins(rawAccountInfos[0])).toData();
        const idxLunc = lstCoins.findIndex(element => element.denom === "uluna");
        const idxUstc = lstCoins.findIndex(element => element.denom === "uusd");

        if(idxLunc >= 0)
            accountInfos['availableLUNCs'] = lstCoins[idxLunc].amount/1000000;
        else
            accountInfos['availableLUNCs'] = 0;

        if(idxUstc >= 0)
            accountInfos['availableUSTCs'] = lstCoins[idxUstc].amount/1000000;
        else
            accountInfos['availableUSTCs'] = 0;
    } else
        return { "erreur": "Failed to fetch [account balance] ..." }


    // Récupération de la liste complète des validateurs, auquel ce compte a souscrit, ainsi que la somme totale des LUNK stakés
    const rawDelegationsInfos = await lcd.staking.delegations(accountAddress).catch(handleError);
    if(rawDelegationsInfos) {
        rawDelegationsInfos[0].forEach(element => {
            lstValidatorsForThisAccount.push(element.validator_address);
            amountOfLuncStaked += (element.balance.amount/1000000);
        });
        accountInfos['stakedLUNCs'] = amountOfLuncStaked;
    } else
        return { "erreur": "Failed to fetch [delegations infos] ..." }


    // Récupération du montant total des rewards en attente, pour ce compte
    const rawDelegatorRewards = await lcd.distribution.rewards(accountAddress).catch(handleError);
    if(rawDelegatorRewards) {
        const lstRewardsPerCoin = (new Coins(rawDelegatorRewards.total)).toData();
        const idxLuncReward = lstRewardsPerCoin.findIndex(element => element.denom === "uluna");
        const idxUstcReward = lstRewardsPerCoin.findIndex(element => element.denom === "uusd");
        if(idxLuncReward >= 0)
            accountInfos['pendingLUNCrewards'] = lstRewardsPerCoin[idxLuncReward].amount/1000000;
        else
            accountInfos['pendingLUNCrewards'] = 0;
        if(idxUstcReward >= 0)
            accountInfos['pendingUSTCrewards'] = lstRewardsPerCoin[idxUstcReward].amount/1000000;
        else
            accountInfos['pendingUSTCrewards'] = 0;
    } else
        return { "erreur": "Failed to fetch [rewards infos] ..." }


    // Récupération du montant total des undelegations, pour ce compte
    const rawUndelegations = await lcd.staking.unbondingDelegations(accountAddress).catch(handleError);
    if(rawUndelegations) {
        rawUndelegations[0].forEach(entrees => {
            entrees.entries.forEach(entree => {
                amountOfLuncUnbonding += (new Decimal(entree.balance)).toNumber()/1000000;
            });
        });
        accountInfos['unbondingLUNC'] = amountOfLuncUnbonding;
    } else
        return { "erreur": "Failed to fetch [unbonding infos] ..." }


    // Calcul de la sommes des LUNC de ce compte (libres + stakés + rewards + unbonding)
    accountInfos['totalLUNC'] = accountInfos['availableLUNCs'] + accountInfos['stakedLUNCs'] + accountInfos['pendingLUNCrewards'] + accountInfos['unbondingLUNC'];
    accountInfos['totalUSTC'] = accountInfos['availableUSTCs'] + accountInfos['pendingUSTCrewards'];

    // Envoi des infos en retour
    return accountInfos;
}


const handleError = (err) => {
    console.log("ERREUR", err);
}