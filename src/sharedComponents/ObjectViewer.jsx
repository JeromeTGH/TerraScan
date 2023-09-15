import React from 'react';
import styles from './ObjectViewer.module.scss';

const ObjectViewer = ({objetAvisualiser, recursif = false, className, nomChamp = '', virgule = false}) => {


    return (
        <pre className={recursif ? className : className + ' ' + styles.miseEnForme}>
            {Array.isArray(objetAvisualiser) ?
                <>
                    {nomChamp ? <div>{nomChamp} : [</div> : <div>[</div>}
                    {objetAvisualiser.map((element, index) => {
                        return <div key={index} className={styles.decalage}>
                            <ObjectViewer objetAvisualiser={element} recursif="yes" virgule={(index < (objetAvisualiser.length - 1))} />
                        </div>
                    })}
                    {virgule ? <div>],</div> : <div>]</div>}
                </>
            :
            (typeof objetAvisualiser === 'object' && objetAvisualiser !== null) ?
                <>
                    {nomChamp ? <div>{nomChamp} : &#123;</div> : <div>&#123;</div>}
                    {Object.entries(objetAvisualiser).map((element, index) => {
                        return <div key={index} className={styles.decalage}>
                            {Object.prototype.toString.call(element[1]) === "[object Date]" ? <span>{element[0]} : "{new Date(element[1]).toISOString()}"</span> : null}
                            {typeof element[1] === 'string' ? <span>{element[0]} : "{element[1].replaceAll("\"", "\\\"")}"</span> : null}
                            {element[1] === null ? <span>{element[0]} : null</span> : null}
                            {element[1] === 0 ? <span>{element[0]} : 0</span> : null}
                            {(typeof element[1] === 'object') && (element[1] !== null) && (Object.prototype.toString.call(element[1]) !== '[object Date]') ? <ObjectViewer objetAvisualiser={element[1]} nomChamp={element[0]} recursif="yes" virgule={(index < (Object.entries(objetAvisualiser).length - 1))} /> : (index < (Object.entries(objetAvisualiser).length - 1)) ? <span>,</span> : null}
                        </div>
                    })}
                    {virgule ? <div>&#125;,</div> : <div>&#125;</div>}
                </>
            : null}
            
        </pre>
    );
};

export default ObjectViewer;