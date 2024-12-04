import React, { useEffect, useState } from 'react';
import packageJson from '../../../package.json';
import { FCDurl, appName, chainID, chainLCDurl } from '../../application/AppParams';
import { CircleQuestionIcon } from '../../application/AppIcons';
import { LCDclient } from '../../apis/lcd/LCDclient';
import StyledBox from '../../sharedComponents/StyledBox';

const PageAboutDisclaimer = () => {

    // Variables React
    const [versionTerrad, setVersionTerrad] = useState("...");
    const [versionCosmosSDK, setVersionCosmosSDK] = useState("...");

    // Autre
    const anneeEnCours = new Date().getFullYear();

    // Exécution au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'About / Disclaimer - ' + appName;

        // Chargement "node_info"
        const lcd = LCDclient.getSingleton();
        lcd.tendermint.getNodeInfos().then((res) => {
            if(res.data?.application_version) {
                setVersionTerrad(res.data.application_version.version);
                setVersionCosmosSDK(res.data.application_version.cosmos_sdk_version);
            } else {
                console.warn("data > application_version : not found, in node_info response");
            }

        }).catch((err) => {
            setVersionTerrad("(LCD error)");
            setVersionCosmosSDK("(LCD error)");
            if(err.response && err.response.data)
                console.warn("err.response.data", err.response.data);
            else
                console.warn("err", err);
        })
    }, [])

    return (
        <div>
            <h1><span><CircleQuestionIcon /><strong>About / Disclaimer</strong></span></h1>
            <StyledBox title="This app" color="green">
                <p>This app <strong>"TerraScan" is an scanner/finder for Terra Classic blockchain</strong> essentially working on public LCD/FCD (Light / Full Client Daemon).<br />
                    <br />
                    <u>Link</u> : <a href="https://scan.terraclassic.app/">https://scan.terraclassic.app/</a><br />
                    <br />
                    <u>Project sources</u> : <a href="https://github.com/JeromeTGH/TerraScan" target="_blank" rel="noreferrer noopener">https://github.com/JeromeTGH/TerraScan</a><br />
                    <u>Licence</u> : <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noreferrer noopener">Creative Commons "BY-NC-ND 4.0"</a><br />
                    <br />
                    <strong>TerraScan version = {packageJson.version}</strong>
                </p>
            </StyledBox>
            <StyledBox title="TerraClassic Blockchain" color="orange">
                <p><u>Node infos</u> :</p>
                <p>- terrad version = {versionTerrad}</p>
                <p>- Cosmos SDK version = {versionCosmosSDK}</p>
                <br />
                <p><u>Network</u> : {chainID}</p>
                <p><u>LCD</u> : {chainLCDurl}</p>
                <p><u>FCD</u> : {FCDurl}</p>
            </StyledBox>
            <br />
            <br />
            <div className='erreur'>
                Very important :<br />
                - no financial advice here<br />
                - do your own research, always<br />
                - do not trust, verify<br />
                - the cryptocurrency world is full of scammers and thieves, so be extremely careful<br />
                - there is no guarantee of accuracy on this site, particularly on data extracted from the blockchain<br />
                - no responsibility can be engaged (against this site or its creator), as to the use of this site/content and its consequences, in any way
            </div>
            <br />
            <br />
            <p>Created by <a href="https://twitter.com/jerometomski" target="_blank" rel="noreferrer noopener">Jerome TOMSKI</a>, @2023-{anneeEnCours}</p>
            <br />
        </div>
    );
};

export default PageAboutDisclaimer;