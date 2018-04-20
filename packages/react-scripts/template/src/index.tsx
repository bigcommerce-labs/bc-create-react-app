import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import register from './registerServiceWorker';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
register();
