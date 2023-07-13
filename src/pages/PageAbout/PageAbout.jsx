import React from 'react';

const PageAbout = () => {
    return (
        <div>
            <h1>About</h1>
            <br />
            <p>This app, "TerraScan", is an analyzer (scan & finder) for Terra Classic blockchain.</p>
            <p>Realised by JT, @2023</p>
            <br />
            <p><u>Project sources</u> : <a href="https://github.com/JeromeTGH/Terra-Scan">https://github.com/JeromeTGH/Terra-Scan</a></p>
            <br />
            <br />
            <p>
                <mark>
                    Issues to resolve :<br />
                    - ScrollRestoration does not work as expected (when we go forward with Link, then backward ; in fact, there is an automatic scroll to top on previous page)
                </mark>
            </p>

        </div>
    );
};

export default PageAbout;