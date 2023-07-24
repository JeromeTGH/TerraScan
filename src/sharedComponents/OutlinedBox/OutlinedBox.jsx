import React from 'react';
import styles from './OutlinedBox.module.scss';

const OutlinedBox = (props) => {
    return (
        <div className={styles.container}>
            {props.children}
        </div>
    );
};

export default OutlinedBox;