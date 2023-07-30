import React from 'react';
import { CalculatorIcon } from '../../application/AppIcons';
import styles from './BlockValidators.module.scss';

const BlockValidators = () => {

    return (
        <>
            <h2><strong><CalculatorIcon /></strong><span><strong>Validators</strong></span></h2>

            <div className={styles.valContainer}>
                Liste des validateurs<br />
            </div>


        </>
    );
};

export default BlockValidators;