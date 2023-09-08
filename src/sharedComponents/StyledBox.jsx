import React from 'react';
import { LeftArrowIcon, RightArrowIcon } from '../application/AppIcons';

const StyledBox = ({children, title, color, showBtnNav = false, onPrevious, onNext}) => {

    return (
        <div className='styledBoxContainer'>
            <div className='styledBoxContent'>
                <div className='styledBoxHeadContainer'>
                    <div className={'styledBoxTitle ' + color + 'StyledBox'}>{title}</div>
                    <div className='styledBoxBtns'>
                        {showBtnNav ? 
                        <>
                            <button onClick={() => onPrevious()}><LeftArrowIcon /></button>
                            <button onClick={() => onNext()}><RightArrowIcon /></button>
                        </> : null}
                    </div>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default StyledBox;