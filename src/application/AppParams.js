// Généralités
export const appName        = 'TerraScan';

// Terra Classic blockchain ("mainnet" of classic)
export const chainName      = 'Terra Classic';
export const chainID        = 'columbus-5';
// export const chainLCDurl    = 'https://lcd.terraclassic.community';
export const chainLCDurl    = 'https://terra-classic-lcd.publicnode.com';    // Faster

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
    "terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe": "Binance wallet"
}
