import React from 'react';
import styles from './BlockDelegations.module.scss';
import { DelegationIcon } from '../../application/AppIcons';

const BlockDelegations = () => {
    return (
        <div className={"boxContainer " + styles.delegationsBlock}>
            <h2><DelegationIcon /><span>Delegations</span></h2>
            <table className={styles.tblDelegations}>
                <thead>
                    <tr>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BlockDelegations;