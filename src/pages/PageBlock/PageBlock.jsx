import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BlocksIcon } from '../../application/AppIcons';
import styles from './PageBlock.module.scss';
import BlockDetail from './BlockDetail';
import BlockTransactions from './BlockTransactions';
import { appName } from '../../application/AppParams';

const PageBlock = () => {

    // Récupération de l'adresse du validateur, éventuellement passé en argument
    const { blockNum } = useParams();         // Ne rien mettre revient à demander à voir le "latest" (le dernier)

    // Changement du "title" de la page web
    useEffect(() => {
        document.title = 'Block #' + blockNum + ' - ' + appName;
    }, [blockNum])

    return (
        <>
            <h1><span><BlocksIcon /><strong>Block</strong> #{blockNum}</span></h1>
            <br />
            <div className={styles.blocksBlockPage}>
                <BlockDetail blockNumber={blockNum} />
                <BlockTransactions blockNumber={blockNum} />
            </div>
        </>
    );
};

export default PageBlock;