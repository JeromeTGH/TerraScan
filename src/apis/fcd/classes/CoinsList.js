
export class CoinsList {

    constructor (objetAvecVariables) {
        this.tbl = objetAvecVariables;
    }


    // static extractFromBalance (rawApiData) {

    //     // Initialisation du tableau général, à l'image de la classe
    //     const objetAvecVariables = {};

    //     // Champs à insérer dedans
    //     objetAvecVariables['tbl'] = [];

    //     // Récupération des données
    //     const reponseResult = rawApiData.data.result;
    //     for (const coin of reponseResult) {
    //         objetAvecVariables['tbl'].push([parseInt(coin.amount), coin.denom])
    //     }      

    //     // Et renvoie de l'instance
    //     return new CoinsList(objetAvecVariables);
    // }

}