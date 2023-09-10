import React from 'react';
import { LeftArrowIcon, RightArrowIcon } from '../application/AppIcons';
import styles from './StyledBox.module.scss';

const StyledBox = ({
                    children,
                    className,
                    title,
                    color,
                    showBtnNav = false,
                    onPrevious,
                    onNext,
                    showCheckbox = false,
                    checkboxLabel,
                    inCheckState,
                    onCheckChange
                }) => {


    // Sélecteur d'affichage
    const colorRender = (couleur) => {
        switch(couleur) {
            case 'blue':
                return styles.blueStyledBox;
            case 'red':
                return styles.redStyledBox;
            case 'green':
                return styles.greenStyledBox;
            case 'orange':
                return styles.orangeStyledBox;
            case 'purple':
                return styles.purpleStyledBox;
            case 'brown':
                return styles.brownStyledBox;
            case 'turquoise':
                return styles.turquoiseStyledBox;
            case undefined:
                return styles.neutralStyledBox;
            default:
                return styles.neutralStyledBox;
        }
    }


    // Rendu du component
    return (
        <div className={styles.styledBoxContainer + (className ? ' ' + className : '')}>
            <div className={styles.styledBoxContent}>
                <div className={styles.styledBoxHeadContainer}>
                    <div className={styles.styledBoxTitle + ' ' + colorRender(color)}>{title}</div>
                    {showBtnNav ? 
                        <div className={styles.styledBoxBtns}>
                            <button onClick={() => onPrevious()}><LeftArrowIcon /></button>
                            <button onClick={() => onNext()}><RightArrowIcon /></button>
                        </div>
                    : null}
                    {showCheckbox ?
                        <div className={styles.styledBoxCheckbox}>
                            <input 
                                type="checkbox"
                                id="checkboxLiveView"
                                checked={inCheckState}
                                onChange={(e) => onCheckChange(e)}
                            />
                            <label htmlFor='checkboxLiveView'>{checkboxLabel.replaceAll(' ', '\u00a0')}</label>
                        </div>
                    : null}
                </div>
                <div className={styles.styledBoxWithPadding}>{children}</div>
            </div>
        </div>
    );
};

export default StyledBox;