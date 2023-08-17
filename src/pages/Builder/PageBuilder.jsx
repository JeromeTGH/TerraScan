import React from 'react';

import Header from '../../elements/Header';
import Footer from '../../elements/Footer';

import PageHome from '../PageHome/PageHome';
import PageAccount from '../PageAccount/PageAccount';
import PageAccounts from '../PageAccounts/PageAccounts';
import PageBlock from '../PageBlock/PageBlock';
import PageBlocksV2 from '../PageBlocks/PageBlocksV2';
import PageTransaction from '../PageTransaction/PageTransaction';
import PageTransactions from '../PageTransactions/PageTransactions';
import PageValidator from '../PageValidator/PageValidator';
import PageValidators from '../PageValidators/PageValidators';
import PageProposals from '../PageProposals/PageProposals';
import PageProposal from '../PageProposal/PageProposal';
import PageStaking from '../PageStaking/PageStaking';
import PageSearch from '../PageSearch/PageSearch';
import PageAbout from '../PageAbout/PageAbout';
import Page404 from '../Page404/Page404';

import styles from './PageBuilder.module.scss';
import SideBar from '../../elements/SideBar';
import AppBar from '../../elements/AppBar';

import { AppScrollToTop } from '../../application/AppScrollToTop'


const PageBuilder = (props) => {

    // Récupération des paramètres d'appel
    const withHeader = props.withHeader;
    const withFooter = props.withFooter;
    const targetPage = props.targetPage;

    // Sélecteur d'affichage
    const renderSwitch = (parametre) => {
        switch(parametre) {
            case 'home':
                return <PageHome />;
            case 'account':
                return <PageAccount />;
            case 'accounts':
                return <PageAccounts />;
            case 'block':
                return <PageBlock />;
            case 'blocks':
                return <PageBlocksV2 />;
            case 'transaction':
                return <PageTransaction />;
            case 'transactions':
                return <PageTransactions />;
            case 'validator':
                return <PageValidator />;
            case 'validators':
                return <PageValidators />;
            case 'about':
                return <PageAbout />;
            case 'proposal':
                return <PageProposal />;
            case 'proposals':
                return <PageProposals />;
            case 'staking':
                return <PageStaking />;
            case 'search':
                return <PageSearch />;
            case '404':
                return <Page404 />;
            case undefined:
                return <div>[ERROR] Missing parameter "targetPage" in PageBuilder.jsx</div>;
            default:
                return <div>[ERROR] Unknown page "{parametre}" in PageBuilder.jsx</div>;
        }
    }

    // Affichage
    return (
        <>
            <div className={styles.site}>
                <SideBar />
                <AppBar />
                <div id="pageContent" className={styles.content}>
                    <header>{withHeader === "no" ? null : <Header />}</header>
                    <main>{renderSwitch(targetPage)}</main>
                    <footer>{withFooter === "no" ? null : <Footer />}</footer>
                </div>
            </div>
            <AppScrollToTop />
        </>
    );
};

export default PageBuilder;