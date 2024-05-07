import React, { useEffect, useState } from 'react';

import Header from '../../elements/Header';
import Footer from '../../elements/Footer';

import PageHome from '../PageHome/PageHome';
import PageGraphs from '../PageGraphs/PageGraphs';
import PageAccount from '../PageAccount/PageAccount';
import PageAccounts from '../PageAccounts/PageAccounts';
import PageBlock from '../PageBlock/PageBlock';
import PageBlocks from '../PageBlocks/PageBlocks';
import PageTransaction from '../PageTransaction/PageTransaction';
import PageTransactions from '../PageTransactions/PageTransactions';
import PageValidator from '../PageValidator/PageValidator';
import PageValidators from '../PageValidators/PageValidators';
import PageProposals from '../PageProposals/PageProposals';
import PageProposal from '../PageProposal/PageProposal';
import PageBurns from '../PageBurns/PageBurns';
import PageStaking from '../PageStaking/PageStaking';
import PageSearch from '../PageSearch/PageSearch';
import PageAboutDisclaimer from '../PageAboutDisclaimer/PageAboutDisclaimer';
import Page404 from '../Page404/Page404';

import styles from './PageBuilder.module.scss';
import SideBar from '../../elements/SideBar';
import AppBar from '../../elements/AppBar';

import { AppScrollToTop } from '../../application/AppScrollToTop'
import LoadingAnim from '../../elements/LoadingAnim';
import { preloads } from './PageBuilder.loader';


const PageBuilder = (props) => {

    // Variable React
    const [ isLoading, setIsLoading ] = useState(true);
    const [ animActivated, setAnimActivated ] = useState(true);
    const [ preloadErrorMessage, setpreloadErrorMessage ] = useState();

    // Exécution au démarrage (une fois seulement, donc, même s'il y a des changements de page ultérieurs)
    useEffect(() => {
        setIsLoading(true);
    }, [])


    useEffect(() => {
        if(isLoading) {
            setAnimActivated(true);
            preloads().then(res => {
                if(res['erreur']) {
                    setpreloadErrorMessage(res['erreur']);
                    setAnimActivated(false);
                } else {
                    setIsLoading(false);
                }
            })
        }
    }, [isLoading])

    // Récupération des paramètres d'appel
    const withHeader = props.withHeader;
    const withFooter = props.withFooter;
    const targetPage = props.targetPage;

    // Sélecteur d'affichage
    const renderSwitch = (parametre) => {
        switch(parametre) {
            case 'home':
                return <PageHome />;
            case 'graphs':
                return <PageGraphs />;
            case 'account':
                return <PageAccount />;
            case 'accounts':
                return <PageAccounts />;
            case 'block':
                return <PageBlock />;
            case 'blocks':
                return <PageBlocks />;
            case 'transaction':
                return <PageTransaction />;
            case 'transactions':
                return <PageTransactions />;
            case 'validator':
                return <PageValidator />;
            case 'validators':
                return <PageValidators />;
            case 'about-disclaimer':
                return <PageAboutDisclaimer />;
            case 'proposal':
                return <PageProposal />;
            case 'proposals':
                return <PageProposals category="all" />;
            case 'proposals_voting':
                return <PageProposals category="voting" />;
            case 'proposals_deposits':
                return <PageProposals category="deposits" />;
            case 'proposals_adopted':
                return <PageProposals category="adopted" />;
            case 'proposals_rejected':
                return <PageProposals category="rejected" />;
            case 'burns':
                return <PageBurns />;
            case 'staking':
                return <PageStaking />;
            // case 'donate':
            //     return <PageDonate />;
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
            {isLoading ?
                <LoadingAnim anim={animActivated} message={preloadErrorMessage} />
            :
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
            }
        </>
    );
};

export default PageBuilder;