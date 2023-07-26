import React, { useEffect, useState } from 'react';
import { Stack1Icon } from '../../application/AppIcons';
import styles from './TableOfTotalSupplies.module.scss';
import { getTotalSupplies } from './getTotalSupplies';

const TableOfTotalSupplies = () => {

    // Variables react
    const [coinsTotalSupply, setCoinsTotalSupply] = useState({});
//    const [ infosTotalSupply, setInfosTotalSupply ] = useState([]);     // Tableau qui contiendra des infos concernant les total supplies
    const [ msgErreurGetTotalSupplies, setMsgErreurGetTotalSupplies ] = useState();


    // À exécuter au démarrage
    useEffect(() => {
        getTotalSupplies().then((res) => {
            if(res['erreur']) {
                setMsgErreurGetTotalSupplies(res['erreur']);
                setCoinsTotalSupply([]);
            }
            else {
                setCoinsTotalSupply(res);
                setMsgErreurGetTotalSupplies('');
            }
        });



        /*
        lcd.bank.total({'pagination.limit': 9999}).then(res => {
            if(res[0]) {
                const listeDesCoinsSupply = new Coins(res[0]);
                setInfosTotalSupply(listeDesCoinsSupply.toData())

                // Chargement des infos concernant les taux d'inflation
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
        

        // Extraction de la total Supply de chaque coin (USTC, LUNC, ...)
        const tblTotalSupplyParCoin = []
        props.infosTotalSupply.forEach((element) => {
            if(tblCorrespondanceValeurs[element.denom])
            tblTotalSupplyParCoin[tblCorrespondanceValeurs[element.denom]] = formateLeNombre(parseInt(element.amount/1000000), " ");
        })
        setCoinsTotalSupply(tblTotalSupplyParCoin);

*/

    }, [])

    // Affichage
    return (
        <>
            <h2><strong><Stack1Icon /></strong><span><strong>Total Supplies</strong> (latest)</span></h2>
            <table className={styles.tblTotalSupplies}>
                    {coinsTotalSupply ? (
                    <tbody>
                        <tr className={styles.coinMajeur}>
                            <td>{coinsTotalSupply['LUNC'] ? coinsTotalSupply['LUNC'] : "..."}</td>
                            <td>LUNC</td>
                        </tr>
                        <tr className={styles.coinMajeur}>
                            <td>{coinsTotalSupply['USTC'] ? coinsTotalSupply['USTC'] : "..."}</td>
                            <td>USTC</td>
                        </tr>
                        {Object.entries(coinsTotalSupply).map(([clef, valeur]) => {
                            return (clef==='LUNC' || clef==='USTC') ? null : (
                                <tr className={styles.coinMineur} key={clef}>
                                    <td>{valeur}</td>
                                    <td>{clef}</td>
                                </tr> 
                        )})}
                    </tbody>
                    ) : (
                        <tbody><tr><td colSpan="3">Loading ...</td></tr></tbody>
                    )}
            </table>
            <div className="erreur">{msgErreurGetTotalSupplies}</div>
        </>
    );
};

export default TableOfTotalSupplies;