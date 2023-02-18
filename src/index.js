import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
		<a href="https://www.kaggle.com/competitions/godaddy-microbusiness-density-forecasting" target="_blank" rel="noopener noreferrer">back to kaggle</a><br />
		<a href="https://github.com/HNJ755329/godaddy_visualizer" target="_blank" rel="noopener noreferrer">github</a>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
