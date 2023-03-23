import React from 'react';
import ReactSelect from 'react-select';
import arrows from './assets/images/arrows.svg';
import loadingIcon from './assets/images/load.png';
import './app.css';

export default function App() {
	const API_KEY = process.env.REACT_APP_API_KEY;
	const [listOfAvailableCurrencies, setListOfAvailableCurrencies] =
		React.useState([]);
	const [minimalExchangeAmount, setMinimalExchangeAmount] = React.useState('');
	const [estimatedExchangeAmount, setEstimatedExchangeAmount] =
		React.useState('');
	const [fromCurrency, setFromCurrency] = React.useState('');
	const [toCurrency, setToCurrency] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(true);
	const [infoLabel, setInfoLabel] = React.useState('');

	const URL_LIST_OF_AVAILABLE_CURRENCIES =
		'https://api.changenow.io/v1/currencies?active=true';
	const URL_MINIMAL_EXCHANGE_AMOUNT = `https://api.changenow.io/v1/min-amount/${fromCurrency}_${toCurrency}?api_key=${API_KEY}`;
	const URL_ESTIMATED_EXCHANGE_AMOUNT = `https://api.changenow.io/v1/exchange-amount/${minimalExchangeAmount}/${fromCurrency}_${toCurrency}?api_key=${API_KEY}`;

	let requestOptions = {
		method: 'GET',
		redirect: 'follow',
	};

	React.useEffect(() => {
		fetch(URL_LIST_OF_AVAILABLE_CURRENCIES, requestOptions)
			.then(response => response.json())
			.then(result => {
				setListOfAvailableCurrencies(result);
			})
			.catch(error => console.log('error', error));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (fromCurrency && toCurrency) {
			fetch(URL_MINIMAL_EXCHANGE_AMOUNT, requestOptions)
				.then(response => response.json())
				.then(result => {
					if (result.error === 'deposit_too_small') {
						setInfoLabel('*Deposit too small');
						setEstimatedExchangeAmount('-');
					}
					if (result.error === 'pair_is_inactive') {
						setInfoLabel('*Pair is inactive');
						setMinimalExchangeAmount('-');
						setEstimatedExchangeAmount('-');
					} else {
						// setInfoLabel('');
						setMinimalExchangeAmount(result.minAmount);
					}
				})

				.catch(error => {
					console.error(error);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [URL_MINIMAL_EXCHANGE_AMOUNT, fromCurrency, toCurrency]);

	React.useEffect(() => {
		if (minimalExchangeAmount && fromCurrency && toCurrency) {
			fetch(URL_ESTIMATED_EXCHANGE_AMOUNT, requestOptions)
				.then(response => response.json())
				.then(result => {
					if (result.error === 'deposit_too_small') {
						setInfoLabel('*Deposit too small');
						setEstimatedExchangeAmount('-');
					}
					if (result.error === 'pair_is_inactive') {
						setInfoLabel('*Pair is inactive');
						setMinimalExchangeAmount('-');
						setEstimatedExchangeAmount('-');
					} else {
						setInfoLabel('');
						setEstimatedExchangeAmount(result.estimatedAmount);
						setIsLoading(false);
					}
				})
				.catch(error => {
					console.error(error);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		URL_MINIMAL_EXCHANGE_AMOUNT,
		fromCurrency,
		toCurrency,
		minimalExchangeAmount,
	]);

	const getFromCurrency = e => {
		setFromCurrency(e.ticker);
		setIsLoading(true);
	};
	const getToCurrency = e => {
		setToCurrency(e.ticker);
		setIsLoading(true);
	};

	const getMinimalAmount = e => {
		setMinimalExchangeAmount(e.target.value);
		setIsLoading(true);
	};

	return (
		<div className='app'>
			<div className='inner'>
				<div className='title'>Crypto Exchange</div>
				<div className='description'>Exchange fast and easy</div>
				<div className='inputs_container'>
					<div className='input_container'>
						<input
							onChange={getMinimalAmount}
							className='input'
							value={minimalExchangeAmount}
						/>
						<div className='select'>
							<ReactSelect
								onChange={getFromCurrency}
								value={listOfAvailableCurrencies.ticker}
								options={listOfAvailableCurrencies}
								formatOptionLabel={data => (
									<div className='options'>
										<img className='icon' src={data.image} alt='' />
										<span className='ticker'> {data.ticker}</span>
										<span className='name'> {data.name}</span>
									</div>
								)}
							/>
							<div className='info_label'>{infoLabel}</div>
						</div>
					</div>
					<div className='image_container'>
						{!isLoading ? (
							<img className='image' src={arrows} alt='' />
						) : (
							<img className='image_loading' src={loadingIcon} alt='' />
						)}
					</div>
					<div className='input_container'>
						<input
							className='input'
							defaultValue={estimatedExchangeAmount}
							disabled
						/>
						<div className='select'>
							<ReactSelect
								onChange={getToCurrency}
								value={listOfAvailableCurrencies.ticker}
								options={listOfAvailableCurrencies}
								formatOptionLabel={data => (
									<div className='option'>
										<img className='icon' src={data.image} alt='' />
										<span className='ticker'> {data.ticker}</span>
										<span className='name'> {data.name}</span>
									</div>
								)}
							/>
							<div className='info_label'>{infoLabel}</div>
						</div>
					</div>
				</div>
				<div className='label'>Your Ethereum address</div>
				<div className='address'>
					<input className='input_address' />
					<button className='button' disabled={isLoading ? true : false}>
						Exchange
					</button>
				</div>
			</div>
		</div>
	);
}
