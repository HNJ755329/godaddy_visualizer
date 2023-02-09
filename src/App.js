import './App.css';
import React, {useState, useEffect} from "react";
import MapChart from "./MapChart"
import {csv} from "d3-fetch";
import {csvParse} from "d3-dsv";

const setyyyymmdd = (year, month, day) => {
	return year + "-" + ("00" + month).slice(-2) + "-" + ("00" + day).slice(-2);
}


const App = (props) => {
	const [data, setData] = useState({});
	const [year, setYY] = useState(2022);
	const [month, setMM] = useState(1);
	const [day, setDD] = useState(1);
	const [filter_day, setFilter] = useState(setyyyymmdd(2022, 1, 1));
	const [file, setFile] = useState();
	const fileReader = new FileReader();

	const handleOnChange = (e) => {
		setFile(e.target.files[0]);
	};
	const csvFiletoData = (csvdata) => {
		const array = csvParse(csvdata);
		let contents = array.map(elem => ({id: Number(elem.row_id.split("_")[0]), yyyymmdd: elem.row_id.split("_")[1], density: elem.microbusiness_density}));
		let ymd = new Set(contents.map(elem => elem.yyyymmdd));
		for (const x of ymd) {
			data[x] = contents.filter(v => v.yyyymmdd == x);
		}
		setData(data);
	};

	const handleOnSubmit = (e) => {
		e.preventDefault();

		if (file) {
			fileReader.onload = function (event) {
				const text = event.target.result;
				csvFiletoData(text);
			};

			fileReader.readAsText(file);
		}
	};

	useEffect(() => {
		setFilter(setyyyymmdd(year, month, day));
		csv("train_short.csv").then(counties => {
			let contents = counties.map(elem => ({id: Number(elem.row_id.split("_")[0]), yyyymmdd: elem.row_id.split("_")[1], density: elem.microbusiness_density}));
			let ymd = new Set(contents.map(elem => elem.yyyymmdd));
			for (const x of ymd) {
				data[x] = contents.filter(v => v.yyyymmdd == x);
			}
			setData(data);
		});
	}, []);

	return (
		<div>
			<a href="https://www.kaggle.com/competitions/godaddy-microbusiness-density-forecasting" target="_blank">←back to kaggle</a>
			<h1>GoDaddy web vizualiser</h1>
			<a href="https://github.com/HNJ755329/godaddy_visualizer" target="_blank">github</a>
			<div>
				<div class="input-group mt-4 w-50">
					<label for="csv" class="input-group-text">Update submission.csv:</label>
					<input type={"file"} class="form-control" accept={".csv"} onChange={handleOnChange} />
					<button class="btn btn-outline-primary px-4"
						onClick={(e) => {
							handleOnSubmit(e);
						}}
					>
						IMPORT CSV
					</button>
				</div>
				<div>
					<div class="input-group mt-1">
						<label class="input-group-text">
							Year
						</label>
						<button class="btn btn-outline-primary px-3" onClick={() => {setYY(year + 1); setFilter(setyyyymmdd(year + 1, month, day));}}>
							+Y
						</button>
						<button class="btn btn-outline-primary px-3" onClick={() => {setYY(year - 1); setFilter(setyyyymmdd(year - 1, month, day));}}>
							-Y
						</button>
					</div>

					<div class="input-group mt-1">
						<label class="input-group-text">
							Month
						</label>
						<button class="btn btn-outline-primary px-3" onClick={() => {
							if (month == 12) {
								setYY(year + 1);
								setMM(1);
								setFilter(setyyyymmdd(year + 1, 1, day));
							}
							else {
								setMM(month + 1);
								setFilter(setyyyymmdd(year, month + 1, day));
							}
						}}>
							+M
						</button>
						<button class="btn btn-outline-primary px-3" onClick={() => {
							if (month == 1) {
								setYY(year - 1);
								setMM(12);
								setFilter(setyyyymmdd(year - 1, 12, day));
							}
							else {
								setMM(month - 1);
								setFilter(setyyyymmdd(year, month - 1, day));
							}
						}}>
							-M
						</button>
					</div>
					<div>
						{year}-{month}-{day} / {filter_day}
					</div>
				</div>
			</div>
			<MapChart data={data[filter_day]} />
		</div >
	);
}

export default App;
