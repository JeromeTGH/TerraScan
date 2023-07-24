import React, { useEffect, useState } from 'react';
import { LCDClient, Coins } from '@terra-money/terra.js';

import { chainID, chainLCDurl } from '../../application/AppParams';

import MessageLoading from '../_elements/MessageLoading';
import MessageLCD from '../_elements/MessageLCD';
import PageHomeContent from './PageHomeContent';

const PageHome = () => {

    // Variables react
    const [ etatPage, setEtatPage ] = useState('vide');                 // Variable d'état, pour conditionner l'affichage à l'écran
    const [ infosTotalSupply, setInfosTotalSupply ] = useState([]);     // Tableau qui contiendra des infos concernant les total supplies
    const [ infosMintingParams, setInfosMintingParams] = useState();    // Ici les paramètres de mint (inflation, essentiellement)

    // Connexion au LCD
    const lcd = new LCDClient({
        URL: chainLCDurl,
        chainID: chainID,
        isClassic: true
    });


    // const chargeInfosTotalSupply = async () => {
    // }

    // Récupération d'infos, au chargement du component
    useEffect(() => {
        // Chargement des infos concernant la supply
        lcd.bank.total({'pagination.limit': 9999}).then(res => {
            // console.log("Réponse LCD", res);
            if(res[0]) {
                const listeDesCoinsSupply = new Coins(res[0]);
                setInfosTotalSupply(listeDesCoinsSupply.toData())

                lcd.mint.parameters({}).then(res => {
                    setInfosMintingParams(res);
                    setEtatPage('ok');

                }).catch(err => {
                    setEtatPage(err.message);
                    console.log(err);
                })

            } else {
                setInfosTotalSupply(res);
                setEtatPage('message');
            }
        }).catch(err => {
            setEtatPage(err.message);
            console.log(err);
        })
        // eslint-disable-next-line
    }, [])


    // Sélecteur d'affichage
    const renderSwitch = () => {
        switch(etatPage) {
            case 'vide':
                return <MessageLoading />;
            case 'ok':
                return <PageHomeContent
                    infosTotalSupply={infosTotalSupply}
                    infosMintingParams={infosMintingParams}
                />;
            case 'message':
                return <MessageLCD message={etatPage} />;
            default:
                return <MessageLCD message={etatPage} />;
        }
    }

    // Et affichage de la page, au final
    return (
        <>
            {renderSwitch()}
        </>
    );
};

export default PageHome;