import React from 'react';

import { chainName, chainID, chainLCDurl} from '../../application/AppParams';

import styles from './SideBar.module.scss';
import { Link } from 'react-router-dom';
import { BlocksIcon, ChainIcon, CircleQuestionIcon, ExchangeIcon, HomeIcon, LockIcon, VoteIcon } from '../../application/AppIcons';

const SideBar = () => {
    return (
        <div id={styles["sidebar"]}>
            <div id={styles["sidebar-title"]}>
                <p id={styles["sidebar-title-text"]}>TerraScan</p>
                <p id={styles["sidebar-title-subtext"]}>== Terra Classic Scan/Finder ==</p>
            </div>
            <div id={styles["sidebar-content"]}>
                <ul>
                    <li className={styles.sidebar_content_mnu_active}><Link to={"/"}>
                        <span><HomeIcon /></span>
                        <span>Home</span>
                    </Link></li>
                    <li className={styles.sidebar_content_mnu_inactive}><Link to={"/"}>
                        <span><BlocksIcon /></span>
                        <span>Validators</span>
                    </Link></li>
                    <li className={styles.sidebar_content_mnu_inactive}><Link to={"/"}>
                        <span><ChainIcon /></span>
                        <span>Blocks</span>
                    </Link></li>
                    <li className={styles.sidebar_content_mnu_inactive}><Link to={"/"}>
                        <span><ExchangeIcon /></span>
                        <span>Transactions</span>
                    </Link></li>
                    <li className={styles.sidebar_content_mnu_inactive}><Link to={"/"}>
                        <span><VoteIcon /></span>
                        <span>Gouvernance</span>
                    </Link></li>
                    <li className={styles.sidebar_content_mnu_inactive}><Link to={"/"}>
                        <span><LockIcon /></span>
                        <span>Staking</span>
                    </Link></li>
                    <li className={styles.sidebar_content_mnu_inactive}><Link to={"/"}>
                        <span><CircleQuestionIcon /></span>
                        <span>About</span>
                    </Link></li>
                </ul>
                <div className={styles.chainInfos}>
                    {chainName} ({chainID})<br />
                    {chainLCDurl}

                </div>
            </div>
        </div>
    );
};

export default SideBar;