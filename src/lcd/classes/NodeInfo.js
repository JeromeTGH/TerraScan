
export class NodeInfo {

    constructor (objetAvecVariables) {

        this.node_info = {
            // + protocol_version{}
            id: objetAvecVariables.node_info.id,
            listen_addr: objetAvecVariables.node_info.listen_addr,
            network: objetAvecVariables.node_info.network,
            version: objetAvecVariables.node_info.version,
            channels: objetAvecVariables.node_info.channels,
            moniker: objetAvecVariables.node_info.moniker
            // + other{}
        }
        this.application_version =  {
            name: objetAvecVariables.application_version.name,
            server_name: objetAvecVariables.application_version.server_name,
            version: objetAvecVariables.application_version.version,
            commit: objetAvecVariables.application_version.commit,
            build_tags: objetAvecVariables.application_version.server_name,
            go: objetAvecVariables.application_version.go,
            // + build_deps[]
            cosmos_sdk_version: objetAvecVariables.application_version.cosmos_sdk_version
        }
    }


    static extractFromTendermintNodeInfos (rawApiData) {
        return new NodeInfo(rawApiData.data);
    }

}