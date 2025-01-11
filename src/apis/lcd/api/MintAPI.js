
export class MintAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }


    // Exemple d'appel : https://terra-classic-lcd.publicnode.com/cosmos/mint/v1beta1/params
    async getMintParameters(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getMintParameters, params);
    }


}