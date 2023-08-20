// Généralités
export const appName        = 'TerraScan';

// Terra Classic blockchain ("mainnet" of classic)
export const chainName      = 'Terra Classic';
export const chainID        = 'columbus-5';
export const chainLCDurl    = 'https://lcd.terraclassic.community';

export const LCDurl = 'https://terra-classic-lcd.publicnode.com';
export const FCDurl = 'https://terra-classic-fcd.publicnode.com';

// Tableau de correspondance Coin/Désignation
export const tblCorrespondanceValeurs = {
    "uluna": "LUNC",
    "uusd": "USTC",
    "uaud": "AUTC",
    "ucad": "CATC",
    "uchf": "CHTC",
    "ucny": "CNTC",
    "udkk": "DKTC",
    "ueur": "EUTC",
    "ugbp": "GBTC",
    "uhkd": "HKTC",
    "uidr": "IDTC",
    "uinr": "INTC",
    "ujpy": "JPTC",
    "ukrw": "KRTC",
    "umnt": "MNTC",
    "umyr": "MYTC",
    "unok": "NOTC",
    "uphp": "PHTC",
    "usdr": "SDTC",
    "usek": "SETC",
    "usgd": "SGTC",
    "uthb": "THTC",
    "utwd": "TWTC"
}

// Tableau de correspondance Adresse/Désignation de compte
export const tblCorrespondanceCompte = {
    "terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu": "Burn wallet",
    "terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f": "Oracle pool",              // Nota : noté en dur, dans la section "overview" de la "homepage"
    "terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe": "Binance main wallet"
}


// Tableau de messages
export const tblCorrespondanceMessages = {
    "MsgSend": "Send",
    "MsgDelegate": "Delegate",
    "MsgUndelegate": "Undelegate",
    "MsgTransfer": "Transfer",
    "MsgBeginRedelegate": "Begin Redelegate",
    "MsgVote": "Vote",
    "MsgWithdrawDelegatorReward": "Withdraw Delegator Reward",  // variante 'MsgWithdrawDelegationReward' trouvée dans bloc #9106141, par exemple
        "MsgWithdrawDelegationReward" : "Withdraw Delegation Reward",
    "MsgWithdrawValidatorCommission": "Withdraw Validator Commission",
    "MsgAggregateExchangeRateVote": "Aggregate Exchange Rate Vote",
    "MsgAggregateExchangeRatePrevote": "Aggregate Exchange Rate Prevote",
    "MsgExecuteContract": "Execute Contract",
    "MsgSubmitProposal": "Submit Proposal",
    "MsgDeposit": "Deposit",
    "MsgFundCommunityPool": "Fund Community Pool",
    "MsgUpdateClient": "Update Client",
    "MsgAcknowledgement": "Acknowledgement",
    "MsgExecAuthorized": "Exec Authorized",
    "MsgInstantiateContract": "Instantiate Contract",
    "MsgUnjail": "Unjail",
        "MsgCreateValidator": "Create Validator"            // à implémenter
}
