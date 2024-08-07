import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { appName } from '../application/AppParams';
import styles from './SideBar.module.scss';
import { Link, NavLink } from 'react-router-dom';
import { BlocksIcon, CalculatorIcon, CircleQuestionIcon, ExchangeIcon, HomeIcon, LockIcon, SearchIcon, VoteIcon, AccountIcon, BurnIcon, GraphBarIcon, ContractIcon } from '../application/AppIcons';
import BtnJourNuit from './BtnJourNuit';

const SideBar = () => {

    // const navigate = useNavigate();
    const location = useLocation();
    const [isProposalsPageOrChilds, setIsProposalsPageOrChilds] = useState(false);

    // // Fonction de redirection "donate"
    // const handleDon = () => {
    //     navigate('/donate/');
    // }

    // Fixation du "hover" du menu gouvernance, si la page principale ou ses enfants sont sélectionnés
    // (nota : ici, le link /proposals/voting ne permet pas de faire les choses plus simplement)
    useEffect(() => {
        if(location.pathname.toLowerCase().slice(0, 10) === '/proposals')
            setIsProposalsPageOrChilds(true)
        else
            setIsProposalsPageOrChilds(false)
    }, [location.pathname])


    // Affichage
    return (
        <div id={styles["sidebar"]}>
            <div id={styles["sidebar-title"]}>
                <div id={styles["sidebar-title-text"]}>
                    <Link to="/">
                        <img src='/images/terra_luna_classic_logo.png' alt="Terra Luna Classic logo" />
                        <span>{appName}</span>
                    </Link>
                </div>
            </div>
            <nav id={styles["sidebar-content"]}>
                <ul>
                    <li>
                        <NavLink to={"/"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><HomeIcon /></span>
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/graphs"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><GraphBarIcon /></span>
                            <span>Graphs</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/blocks"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><BlocksIcon /></span>
                            <span>Blocks</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/validators"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><CalculatorIcon /></span>
                            <span>Validators</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/accounts"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><AccountIcon /></span>
                            <span>Accounts</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/transactions"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><ExchangeIcon /></span>
                            <span>Transactions</span>
                        </NavLink>
                    </li>
                    <li>
                        <Link to={"/proposals/voting"} className={ isProposalsPageOrChilds ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive}>
                            <span><VoteIcon /></span>
                            <span>Governance</span>
                        </Link>
                    </li>
                    <li>
                        <NavLink to={"/burns"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><BurnIcon /></span>
                            <span>Burns</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/staking"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><LockIcon /></span>
                            <span>Staking</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/search"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><SearchIcon /></span>
                            <span>Search</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/smartcontracts"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><ContractIcon /></span>
                            <span>Smart Contracts</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/about-disclaimer"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><CircleQuestionIcon /></span>
                            <span>About / Disclaimer</span>
                        </NavLink>
                    </li>
                </ul>
                <div id={styles["sidebar-theme"]}>
                    Switch theme to →&nbsp;<BtnJourNuit filled="yes" />
                </div>
                {/* <br />
                <br />
                <div className={styles.don}>
                    Want to help me ?<br />
                    To make this app sustainable ?<br />
                    <button onClick={() => handleDon()}><CoffeeIcon /><span>Donate</span></button><br />
                    So please donate ! Thanks ;)<br />
                </div> */}
            </nav>
        </div>
    );
};

export default SideBar;