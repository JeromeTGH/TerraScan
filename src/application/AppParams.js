// Généralités
export const appName        = 'TerraScan';

// Terra Classic blockchain ("mainnet" of classic)
export const chainName      = 'Terra Classic';
export const chainID        = 'columbus-5';
export const chainLCDurl    = 'https://terra-classic-lcd.publicnode.com';
export const FCDurl         = 'https://terra-classic-fcd.publicnode.com';

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
    "terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe": "Binance main wallet",
    "terra1g9htux72h5nj5c0hpzely3rqwnryzmy22xlxpu": "DFLunc",
    "terra153mwt0upple9klvrryrtckx9vneguw6ja33d3c": "TerraCasino.io",
    "terra1nm0rrq86ucezaf8uj35pq9fpwr5r82clp5z7r5": "Kraken users",
    "terra1vwchc3pkrxn8kahd0g9wxd8zjr0drnduzkn4z3": "Cremation Coin",
    "terra13s4gwzxv6dycfctvddfuy6r3zm7d6zklynzzj5": "LUNC DAO",
    "terra1w8nc8ev0ylg97qnj080np4lnljngdvpd90ev63": "MEXC wallet",
    "terra1rvxcszyfecrt2v3a7md8p30hvu39kj6xf48w9e": "Kucoin wallet",
    "terra1uml7n30kyndkmjvrgy6d63kffpn6hvztx79mnf": "Frag",
    "terra1a0lhtrf5dcpdtld9k5praqw0hp5n9plgq7n7mk": "Lunaclassic.com",
    "terra16e75e62ztl6yzkulfck0p99d4cua9zjcdj0wq3": "Nova"
}


// Tableau de messages
export const tblCorrespondanceMessages = {
    "MsgSend": "Send",
    "MsgDelegate": "Delegate",
    "MsgUndelegate": "Undelegate",
    "MsgTransfer": "Transfer",
    "MsgBeginRedelegate": "Begin Redelegate",
    "MsgVote": "Vote",
    "MsgWithdrawDelegatorReward": "Withdraw Delegator Reward",
        "MsgWithdrawDelegationReward" : "Withdraw Delegation Reward",   // variante de 'MsgWithdrawDelegatorReward' (identifié au bloc #9106141, par exemple)
    "MsgWithdrawValidatorCommission": "Withdraw Validator Commission",
    "MsgAggregateExchangeRateVote": "Aggregate Exchange Rate Vote",
    "MsgAggregateExchangeRatePrevote": "Aggregate Exchange Rate Prevote",
    "MsgExecuteContract": "Execute Contract",
    "MsgSubmitProposal": "Submit Proposal",
    "MsgDeposit": "Deposit",
    "MsgFundCommunityPool": "Fund Community Pool",
    "MsgUpdateClient": "Update Client",
    "MsgAcknowledgement": "Acknowledgement",
    "MsgExec": "Exec",
        "MsgExecAuthorized": "Exec Authorized",     // variante de 'MsgExec'
    "MsgInstantiateContract": "Instantiate Contract",
    "MsgUnjail": "Unjail",
    "MsgCreateValidator": "Create Validator",
    "MsgGrantAuthorization": "Grant Authorization",
        "MsgGrant": "Grant",        // variante de 'MsgGrantAuthorization'
    "MsgStoreCode": "Store Code",
    "MsgMigrateContract": "Migrate Contract",
    "MsgSetWithdrawAddress": "Set Withdraw Address",
    "MsgClearAdmin": "Clear Admin",
    "MsgModifyWithdrawAddress": "Modify Withdraw Address",
    "MsgSwap": "Swap",
    "MsgUpdateAdmin": "Update Admin",
    "MsgSwapSend": "Swap Send"
}
