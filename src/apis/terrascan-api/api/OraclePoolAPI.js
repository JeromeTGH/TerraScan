
export class OraclePoolAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : /api/oraclepool/getPastValues?limit=50&timeunit=H1 (paramètres par défaut = 50 en limit, et H1 en timeunit)
    async getPastValues(params) {
        return this.apiRequester.get(this.paths.getAccountTxs, params);
    }


}