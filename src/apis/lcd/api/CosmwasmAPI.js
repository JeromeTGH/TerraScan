
export class CosmwasmAPI {

    // Constructeur
    constructor (apiRqt, paths) {
        this.apiRequester = apiRqt;
        this.paths = paths;
    }

    // Exemple d'appel : /cosmwasm/wasm/v1/contract/terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu
    async getContractInfo(contractAdr, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getContractInfo.replace('***', contractAdr), params);
    }

    // Exemple d'appel : /cosmwasm/wasm/v1/contract/terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu/history
    async getContractHistory(contractAdr, params = new URLSearchParams()) {
        return await this.apiRequester.get(this.paths.getContractHistory.replace('***', contractAdr), params);
    }


}