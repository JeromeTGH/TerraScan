import React from 'react';
import styles from './_Presentation.module.scss';
import { tblValidators } from '../../application/AppData';
import StyledBox from '../../sharedComponents/StyledBox';
import { AccountIcon, EmailIcon, WorldIcon } from '../../application/AppIcons';
import { Link } from 'react-router-dom';


const Presentation = (props) => {

    // Affichage
    return (
        <StyledBox title="Presentation" color="green" className={styles.infosBlock}>
            <div className={styles.blockInfos}>
                <div className={styles.valLogo}>
                    {tblValidators[props.valAddress].profile_icon ?
                        <img src={tblValidators[props.valAddress].profile_icon} alt="Validator logo" />
                    :
                        <img src='/images/terra-classic-logo-200x200.png' alt="TerraClassic logo" />
                    }
                </div>
                <div className={styles.valInfos}>
                    <div className={styles.valMoniker}>{tblValidators[props.valAddress].description_moniker}</div>
                    {tblValidators[props.valAddress].description_website ?
                         <div className={styles.valWebsite}>
                            <WorldIcon />
                            <a
                                className={styles.website}
                                href={tblValidators[props.valAddress].description_website}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {tblValidators[props.valAddress].description_website}
                            </a>
                        </div>
                    : null}
                    {tblValidators[props.valAddress].description_security_contact ?
                         <div className={styles.valContactEmail}>
                            <EmailIcon />
                            <a
                                className={styles.website}
                                href={'mailto:' + tblValidators[props.valAddress].description_security_contact}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {tblValidators[props.valAddress].description_security_contact}
                            </a>
                        </div>
                    : null}
                    <div className={styles.valAccountAddress}>
                        <AccountIcon />
                        <Link to={"/accounts/" + tblValidators[props.valAddress].terra1_account_address}>{tblValidators[props.valAddress].terra1_account_address}</Link>
                    </div>
                    {tblValidators[props.valAddress].description_details ?
                         <div className={styles.valDescription}>
                            {tblValidators[props.valAddress].description_details}
                        </div>
                    : null}
                    <div className={styles.valStatus}>
                        {tblValidators[props.valAddress].status === 'active' ? <span className='active'>Active ({tblValidators[props.valAddress].up_time}% uptime)</span> : <span className='jailed'>Jailed or Inactive</span>}
                    </div>
                </div>
            </div>
        </StyledBox>
    );
};

export default Presentation;