// Généralités
export const appName = "TerraScan";
export const defaultThemeMode = "light";    // light ou dark

// Terra Classic blockchain ("mainnet" of classic)
export const chainName = "Terra Classic";
export const chainID = "columbus-5";
export const chainLCDurl = "https://terra-classic-lcd.publicnode.com";

export const LCDurl = "https://terra-classic-lcd.publicnode.com";
export const FCDurl = "https://terra-classic-fcd.publicnode.com";
export const TSAPIurl = "https://terrascanapi.terraclassic.app/";

// Tableau de correspondance Coin/Désignation
export const tblCorrespondanceValeurs = {
  uluna: "LUNC",
  uusd: "USTC",
  uaud: "AUTC",
  ucad: "CATC",
  uchf: "CHTC",
  ucny: "CNTC",
  udkk: "DKTC",
  ueur: "EUTC",
  ugbp: "GBTC",
  uhkd: "HKTC",
  uidr: "IDTC",
  uinr: "INTC",
  ujpy: "JPTC",
  ukrw: "KRTC",
  umnt: "MNTC",
  umyr: "MYTC",
  unok: "NOTC",
  uphp: "PHTC",
  usdr: "SDTC",
  usek: "SETC",
  usgd: "SGTC",
  uthb: "THTC",
  utwd: "TWTC",
};

// Tableau de messages
export const tblCorrespondanceMessages = {
  MsgSend: "Send",
  MsgDelegate: "Delegate",
  MsgUndelegate: "Undelegate",
  MsgTransfer: "Transfer",
  MsgBeginRedelegate: "Begin redelegate",
  MsgVote: "Vote",
  MsgWithdrawDelegatorReward: "Withdraw delegator reward",
  MsgWithdrawDelegationReward: "Withdraw delegation reward", // variante de 'MsgWithdrawDelegatorReward' (identifié au bloc #9106141, par exemple)
  MsgWithdrawValidatorCommission: "Withdraw validator commission",
  MsgAggregateExchangeRateVote: "Aggregate exchange rate vote",
  MsgAggregateExchangeRatePrevote: "Aggregate exchange rate prevote",
  MsgExecuteContract: "Execute contract",
  MsgSubmitProposal: "Submit proposal",
  MsgDeposit: "Deposit",
  MsgFundCommunityPool: "Fund community pool",
  MsgUpdateClient: "Update client",
  MsgAcknowledgement: "Acknowledgement",
  MsgExec: "Exec",
  MsgExecAuthorized: "Exec authorized", // variante de 'MsgExec'
  MsgInstantiateContract: "Instantiate contract",
  MsgUnjail: "Unjail",
  MsgCreateValidator: "Create validator",
  MsgGrantAuthorization: "Grant authorization",
  MsgGrant: "Grant", // variante de 'MsgGrantAuthorization'
  MsgStoreCode: "Store code",
  MsgMigrateContract: "Migrate contract",
  MsgSetWithdrawAddress: "Set withdraw address",
  MsgClearAdmin: "Clear admin",
  MsgModifyWithdrawAddress: "Modify withdraw address",
  MsgSwap: "Swap",
  MsgUpdateAdmin: "Update admin",
  MsgSwapSend: "Swap send",
  MsgRevoke: "Revoke",
  MsgRevokeAuthorization: "Revoke authorization", // variante de 'MsgRevoke'
  MsgMultiSend: "Multi send",
  MsgVoteWeighted: "Vote weighted",
  MsgEditValidator: "Edit Validator",
};

// Tableau de correspondance Adresse/Désignation de compte
export const tblCorrespondanceCompte = {
  // Terra
  terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu: "Burn wallet",
  terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f: "Oracle pool",
  terra1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8pm7utl: "Community Pool (shared)", // Distribution Module
  terra1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3nln0mh: "Bonded Tokens Pool",
  terra1tygms3xhhs3yv487phx3dw4a95jn7t7l8l07dr: "Unbonding Tokens Pool",

  // CEXs (source : LUNCdash and https://terraclassic.stakebin.io/terra/wallets)
  terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe: "Binance main wallet",
  // "terra1chq5ps8yya004gsw4xz62pd4psr5hafe7kdt6d": "Kucoin 2",
  // "terra12amk3hgzqn85n0zlsmxp75cdcwt782w23t7acx": "Kucoin 5",
  terra1nm0rrq86ucezaf8uj35pq9fpwr5r82clp5z7r5: "Kraken users",
  terra1w8nc8ev0ylg97qnj080np4lnljngdvpd90ev63: "MEXC wallet",
  terra14l46jrdgdhaw4cejukx50ndp0hss95ekt2kfmw: "Kucoin Deposit",
  terra1rvxcszyfecrt2v3a7md8p30hvu39kj6xf48w9e: "Kucoin Withdraw",
  terra1j435gkgg8d0qadjcn09s73rtk5k3ftrx7mc4a8: "ByBit wallet",
  terra1qf07h97m7s93q7dj450c57h79f3c7a7ddn37r2: "CoinInn wallet",
  terra1v9ku44wycfnsucez6fp085f5fsksp47u9x8jr4: "Coinone Deposit",
  terra1al546tmrj0wmwfctcqkch47h57h23mch7d8xqa: "Coinone Withdraw",
  terra14s5eqfppup8ymjywf3devy8gy75nsrqkq3utjj: "BtcTurk (cex)",
  terra1frh79vmtur5fmrghz6gfjvfhpa3u2c0uemv4af: "Binance (deposit ?!)",
  terra1ncjg4a59x2pgvqy9qjyqprlj8lrwshm0wleht5: "Binance (another)",
  terra15s66unmdcpknuxxldd7fsr44skme966tdckq8c: "Binance (withdraw ?!)",
  terra1luagdjcr9c9yvp3ak4d7chjm5gldcmgln5rku5: "FTX",
  terra1teescurtylg20tw3fu8cn2p7qe3klpk6f4s9uq: "Huobi",
  terra13s4gwzxv6dycfctvddfuy6r3zm7d6zklynzzj5: "OKX users",

  // Validateurs
  terra1uml7n30kyndkmjvrgy6d63kffpn6hvztx79mnf: "Frag",
  terra1a0lhtrf5dcpdtld9k5praqw0hp5n9plgq7n7mk: "Lunaclassic.com", // Val, but shutting down
  terra16e75e62ztl6yzkulfck0p99d4cua9zjcdj0wq3: "Nova (old)",
  terra16aumxyfeh2vrd2kr9qk2gadmwmg4jm5kw6nryp: "Burn It All validator",
  terra13avdm9rqxpftv3vrkaqaakakgh30909x8hrruz: "GalacticShift.io validator",
  terra120ppepaj2lh5vreadx42wnjjznh55vvktwj679: "AllNodes validator",
  terra1j27nm2gjm0m4lsye8lspa46rax0rw4fge9awrs: "Luna Station 88 validator",
  terra15ahd0dg9qwkg5tjmkn7fm6sdrpwa47m50selnm: "HCC validator",
  terra18kdk2kf8uvzs5gghky23hv4q7wdnk0ff2k83wt: "Garuda Universe validator",

  // Autres comptes notoires
  terra1g9htux72h5nj5c0hpzely3rqwnryzmy22xlxpu: "DFLunc",
  terra153mwt0upple9klvrryrtckx9vneguw6ja33d3c: "TerraCasino.io",
  terra1vwchc3pkrxn8kahd0g9wxd8zjr0drnduzkn4z3: "Cremation Coin",
  terra1l5czlksptahp4lz9snzs6gpszancuftvnjaf8e: "DIAMOND HODL",
  terra14ju0cvctm9v5d0xxtjj3h9ejkc92qgtzqynfpt: "LUNC Warriors Project",
  terra1sq6th05hdwwwxvymzytc93lvhjxyx4pkjurhgj: "LunaticsToken",
  terra1lahvss98xwyhuf7lz8rcgu2rc8zecz3htj6f8y: "Lunasphere",
  terra13yxmvax7ndvaptgxmqjgqmejka48nrcfm66xaa: "LUNCwhales",
  terra1nh8sjqy87z9mevgnmyd889s82g4hfj44dy7kp7: "Project LUNCBurn (HCC)",
  terra13yex6xefup97382jq07se35at3vzrkrt8d7h5k: "GarudaX Token",
  terra1xusghqxnaxmnflqxtuh6jlumjfvapksw5ctnm3: "Air Force Lunc",
  terra1gr0xesnseevzt3h4nxr64sh5gk4dwrwgszx3nw: "LFG's wallet",

  // TFL accounts (vegas)
  terra1dp0taj85ruc299rkdvzp4z5pfg6z6swaed74e6: "TFL wallet",
  terra1h5el75ha0zdwfawgxs6z0shqcw3m8r53f0wqrl: "TFL wallet 2 (vegas)",
  terra1xvmdjsdp58sanlzvnx6g79nyf2zk7cr5l78mxs: "TFL wallet 3 (vegas)",
  terra1wlc64fe7p6u37qq0vykeksmr40d6a6cscfcn28: "TFL wallet 4 (vegas)",
  terra14tlthgtg6ep6xnqptyg8dp3gcq4jxvgqmskwkd: "TFL wallet 5 (vegas)",
  terra1kakd0l3ll92gamdz8zq7pr7lmghxhkna7jjj39: "TFL wallet 6 (vegas)",
  terra1q0phshknw0pelzrwlezmt7vnmr8jh9vjgezt3z: "TFL wallet 7 (vegas)",
  terra1x04xgtwlw72gtfzrq7nfwmr6eexla8ecljw28z: "TFL wallet 8 (vegas)",   // Project Dawn
  terra1cwnw4mxanhk47kuvunz067smvwgzwjfgpfuzjy: "TFL shuttle bridge",
};

// Tableau de correspondance Adresse/Désignation de smart contracts
export const tblCorrespondanceSmartContract = {
  terra12f3f5fzfzxckc0qlv3rmwwkjfhzevpwmx77345n0zuu2678vxf0sm6vvcw: "Garudax Token",
  terra1vhgq25vwuhdhn9xjll0rhl2s67jzw78a4g2t78y5kz89q9lsdskq2pxcj2: "Juris Protocol Token (ex Rakoff)",
  terra15p8su45k45axng8ue59rl6zph4at27s49u3agr6uqrx3dhcxpg3qt0ekdt: "Cookie Monster Token",
  terra1cgmv3h23t9mrg7q5w5lkfcpkdrxm2csnc03afe5q6xd9x7et0desfeawx2: "Vegas Dao Coin",
  terra1x0d9yex70ngag7z5v7zcmsx6pk7fc6el5lt5qsaeycvqd7mq8vvqpak8v7: "Garuda Universe Hybrid Staking",
  terra1fdqhjvsumljna8rehljqwx3rgx4tej762fret70zvm0dhyhhz3wst2z463: "Juris Lockdrop Round #1",
  terra1pfefmmls2w67njucd2qgvv4qefcutyl95g986pd69caxdyzp7acsfp0fv8: "Juris Lockdrop List #1",
}