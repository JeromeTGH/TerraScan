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

    const determineClassAvecColor = (couleur) => {
        return couleur + 'StyledBox';
    }

    return (
        <div className={styles.styledBoxContainer + (className ? ' ' + className : '')}>
            <div className={styles.styledBoxContent}>
                <div className={styles.styledBoxHeadContainer}>
                    <div className={styles.styledBoxTitle + ' ' + styles[determineClassAvecColor(color)]}>{title}</div>
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