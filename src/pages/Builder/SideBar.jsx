import React from 'react';

import styles from './SideBar.module.scss';
import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <div id={styles["sidebar"]}>
            <div id={styles["sidebar-title"]}>
                <p id={styles["sidebar-title-text"]}>TerraScan</p>
                <p id={styles["sidebar-title-subtext"]}>Terra Classic Scan/Finder</p>
            </div>
            <div id={styles["sidebar-content"]}>
                <ul>
                    <li className={styles.sidebar_content_mnu_active}><Link to={"/"}>
                        <span>1</span>&nbsp;
                        <span>Home</span>
                    </Link></li>
                    <li><Link to={"/"}><span>2</span>&nbsp;<span>Validators</span></Link></li>
                    <li><Link to={"/"}><span>3</span>&nbsp;<span>Blocks</span></Link></li>
                    <li><Link to={"/"}><span>4</span>&nbsp;<span>Transactions</span></Link></li>
                    <li><Link to={"/"}><span>5</span>&nbsp;<span>Staking</span></Link></li>
                    <li><Link to={"/"}><span>6</span>&nbsp;<span>About</span></Link></li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;