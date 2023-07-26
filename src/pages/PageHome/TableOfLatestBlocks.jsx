import React, { useEffect, useState } from 'react';
import styles from './TableOfLatestBlocks.module.scss';
import { ChainIcon } from '../../application/AppIcons';
import { Link } from 'react-router-dom';
import { getLatestBlocks } from './getLatestBlocks';

const TableOfLatestBlocks = () => {

    // Variables react
    const [ derniersBlocks, setDerniersBlocks ] = useState();           // Ici les 'n' derniers blocks [height, nbtx, proposerAddress]
    const [ msgErreurGetDerniersBlocks, setMsgErreurGetDerniersBlocks ] = useState();

    // Récupération d'infos, au chargement du component
    useEffect(() => {
        getLatestBlocks(10).then((res) => {
            if(res['erreur']) {
                setMsgErreurGetDerniersBlocks(res['erreur']);
                setDerniersBlocks([]);
            }
            else {
                setDerniersBlocks(res);
                setMsgErreurGetDerniersBlocks('');
            }
        });
    }, [])

    // Affichage
    return (
        <>
            <h2><strong><ChainIcon /></strong><span><strong>Latest Blocks</strong></span></h2>
            <table className={styles.tblListOfBlocks}>
                <thead>
                    <tr>
                        <th>Height</th>
                        <th>Nb&nbsp;Tx</th>
                        <th>Validator</th>
                    </tr>
                </thead>
                <tbody>
                    {derniersBlocks ? derniersBlocks.map((valeur, clef) => {
                        return (
                            <tr key={clef}>
                                <td><Link to={'/blocks/' + valeur[0]}>{valeur[0]}</Link></td>
                                <td>{valeur[1]}</td>
                                <td><Link to={'/validators/' + valeur[3]}>{valeur[4]}</Link></td>
                            </tr> 
                    )}) : <tr><td colSpan="3">Loading ...</td></tr> }
                </tbody>
            </table>
            <div className="erreur">{msgErreurGetDerniersBlocks}</div>
        </>
    );
};

export default TableOfLatestBlocks;