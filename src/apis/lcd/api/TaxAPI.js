
export class TaxAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : https://terra-classic-lcd.publicnode.com/terra/tax/v1beta1/burn_tax_rate
    async getBurnTaxRate(params = new URLSearchParams()) {
        return this.apiRequester.get(this.paths.getBurnTaxRate, params);
    }

}