
export class LuncStakingAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : /api/luncstaking/getPastValues?limit=50&timeunit=H1 (paramètres par défaut = 50 en limit, et H1 en timeunit)
    async getPastValues(params) {
        return this.apiRequester.get(this.paths.getPastValues, params);
    }


}