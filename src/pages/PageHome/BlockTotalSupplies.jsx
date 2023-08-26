import React, { useEffect, useState } from 'react';
import { Stack1Icon } from '../../application/AppIcons';
import styles from './BlockTotalSupplies.module.scss';
import { formateLeNombre } from '../../application/AppUtils';
import { tblCorrespondanceValeurs } from '../../application/AppParams';

const BlockTotalSupplies = (props) => {

    // Variables react
    const [totalSupplies, setTotalSupplies] = useState();

    // À exécuter au chargement du component, et à chaque changement de props.totalSupplies
    useEffect(() => {
        // On check tout d'abord s'il y a des données à traiter ou pas
        if(props.totalSupplies) {
            // S'il y a des données à traiter, et qu'il s'agit d'un message d'erreur, alors on le transmet et s'arrête là
            if(props.totalSupplies['erreur']) {
                setTotalSupplies(props.totalSupplies['erreur'])
            } else {

                // S'il y a des données à traiter, et qu'il n'y a pas de message d'erreur, alors on analyse ces données
                const tblAretourner = [];

                // On cherche d'abord la supply du LUNC
                const idxLunc = props.totalSupplies.findIndex(element => tblCorrespondanceValeurs[element.denom] === 'LUNC');
                if(idxLunc)
                    tblAretourner.push({
                        "denom": tblCorrespondanceValeurs[props.totalSupplies[idxLunc].denom],
                        "amount": formateLeNombre(parseInt(props.totalSupplies[idxLunc].amount / 1000000), '\u00a0')
                    })

                // On cherche ensuite la supply de l'USTC
                const idxUstc = props.totalSupplies.findIndex(element => tblCorrespondanceValeurs[element.denom] === 'USTC');
                if(idxUstc)
                    tblAretourner.push({
                        "denom": tblCorrespondanceValeurs[props.totalSupplies[idxUstc].denom],
                        "amount": formateLeNombre(parseInt(props.totalSupplies[idxUstc].amount / 1000000), '\u00a0')
                    })

                // Et on traite les coins suivants, et excluant les 2 précédents, ainsi que ceux qui ne sont "pas connus"
                props.totalSupplies.forEach((element) => {
                    if(tblCorrespondanceValeurs[element.denom] &&
                    tblCorrespondanceValeurs[element.denom] !== 'LUNC' &&
                    tblCorrespondanceValeurs[element.denom] !== 'USTC') {
                        tblAretourner.push({
                            "denom": tblCorrespondanceValeurs[element.denom],
                            "amount": formateLeNombre(parseInt(element.amount / 1000000), '\u00a0')
                        })
                    }
                })

                setTotalSupplies(tblAretourner);
            }
        }

    }, [props.totalSupplies])

    
    // Affichage
    return (
        <div className={"boxContainer " + styles.suppliesBlock}>
            <h2 className={styles.totalSupplyH2}><strong><Stack1Icon /></strong><span><strong>Total&nbsp;Supplies</strong> (latest)</span></h2>
            {totalSupplies && totalSupplies['erreur'] ?
                <div className="erreur">{totalSupplies['erreur']}</div>
            :
                <table className={styles.tblTotalSupplies}>
                    <tbody>
                        {totalSupplies ?
                            totalSupplies.map((element, index) => {
                                return <tr className={(element.denom === 'LUNC' || element.denom === 'USTC') ? styles.coinMajeur : styles.coinMineur} key={index}>
                                        <td>{element.denom}</td>
                                        <td>{element.amount}</td>
                                </tr>
                            })
                        :
                            <tr><td colSpan="2">Loading data from blockchain (lcd) ...</td></tr>
                        }
                    </tbody>
                </table>
            }
            
        </div>
    );
};

export default BlockTotalSupplies;