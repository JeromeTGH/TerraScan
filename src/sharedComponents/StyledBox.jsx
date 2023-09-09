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
                    onNext
                }) => {

    const determineClassAvecColor = (couleur) => {
        return couleur + 'StyledBox';
    }

    return (
        <div className={styles.styledBoxContainer + (className ? ' ' + className : '')}>
            <div className={styles.styledBoxContent}>
                <div className={styles.styledBoxHeadContainer}>
                    <div className={styles.styledBoxTitle + ' ' + styles[determineClassAvecColor(color)]}>{title}</div>
                    <div className={styles.styledBoxBtns}>
                        {showBtnNav ? 
                        <>
                            <button onClick={() => onPrevious()}><LeftArrowIcon /></button>
                            <button onClick={() => onNext()}><RightArrowIcon /></button>
                        </> : null}
                    </div>
                </div>
                <div className={styles.styledBoxWithPadding}>{children}</div>
            </div>
        </div>
    );
};

export default StyledBox;