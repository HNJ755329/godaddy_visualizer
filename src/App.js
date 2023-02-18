import './App.css';
import React, {useState, useEffect} from "react";
import MapChart from "./MapChart"
import {csv} from "d3-fetch";
import {csvParse} from "d3-dsv";

const setyyyymmdd = (year, month, day) => {
	return year + "-" + ("00" + month).slice(-2) + "-" + ("00" + day).slice(-2);
}


const App = () => {
	const [data, setData] = useState({});
	const [year, setYY] = useState(2022);
	const [month, setMM] = useState(1);
	const [day, _setDD] = useState(1);
	const [active_col, set_active_col] = useState(1);
	const [col, setcol] = useState([]);
	const [filter_day, setFilter] = useState(setyyyymmdd(2022, 1, 1));
	const [file, setFile] = useState();
	const [min_value, setMinValue] = useState(0);
	const [max_value, setMaxValue] = useState(10);
	const [min_color, setMinColor] = useState("#FFFFFF");
	const [max_color, setMaxColor] = useState("#FF0000");
	const fileReader = new FileReader();

	const handleOnChange = (e) => {
		setFile(e.target.files[0]);
	};
	const set_values = (array) => {
		let contents = array.map(elem => {
			let id = Number(elem.row_id.split("_")[0]);
			let yyyymmdd = elem.row_id.split("_")[1];
			return Object.assign({id: id, yyyymmdd: yyyymmdd}, elem);
		});
		let ymd = new Set(contents.map(elem => elem.yyyymmdd));
		for (const x of ymd) {
			data[x] = contents.filter(v => v.yyyymmdd == x);
		}
		setcol(Object.keys(array[0]));
		set_active_col(Object.keys(array[0]).length - 1);
		setData(data);
	};

	const csvFiletoData = (csvdata) => {
		const array = csvParse(csvdata);
		set_values(array);
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
			set_values(counties);
		});
	}, []);


	return (
		<div>
			<div>
				<div className="input-group mt-4 w-50">
					<label htmlFor="csv" className="input-group-text">Update submission.csv:</label>
					<input type={"file"} className="form-control" accept={".csv"} onChange={handleOnChange} />
					<button className="btn btn-outline-primary px-4"
						onClick={(e) => {
							handleOnSubmit(e);
						}}
					>
						IMPORT CSV
					</button>
				</div>
				<div>
					<div className="input-group mt-1">
						<label className="input-group-text">
							Year
						</label>
						<button className="btn btn-outline-primary px-3" onClick={() => {setYY(v => v + 1); setFilter(setyyyymmdd(year + 1, month, day));}}>
							+Y
						</button>
						<button className="btn btn-outline-primary px-3" onClick={() => {setYY(v => v - 1); setFilter(setyyyymmdd(year - 1, month, day));}}>
							-Y
						</button>
					</div>

					<div className="input-group mt-1">
						<label className="input-group-text">
							Month
						</label>
						<button className="btn btn-outline-primary px-3" onClick={() => {
							if (month == 12) {
								setYY(v => v + 1);
								setMM(1);
								setFilter(setyyyymmdd(year + 1, 1, day));
							}
							else {
								setMM(v => v + 1);
								setFilter(setyyyymmdd(year, month + 1, day));
							}
						}}>
							+M
						</button>
						<button className="btn btn-outline-primary px-3" onClick={() => {
							if (month == 1) {
								setYY(v => v - 1);
								setMM(12);
								setFilter(setyyyymmdd(year - 1, 12, day));
							}
							else {
								setMM(v => v - 1);
								setFilter(setyyyymmdd(year, month - 1, day));
							}
						}}>
							-M
						</button>
					</div>
					<div className="panel panel-default">
						<div className="panel-body">
							{year}-{month}-{day} / {filter_day}
						</div>
					</div>
					<div>
						{col.map(elem => {
							if (elem === col[active_col]) {
								return <span stype="background:rgb(255,0,0);">[{elem}] </span>
							}
							else {
								return <span>{elem} </span>
							}
						}
						)}
						<div className="input-group mt-1">
							<label className="input-group-text">
								columns
							</label>
							<button className="btn btn-outline-primary px-3" onClick={() => {
								if (active_col > 0) {
									set_active_col(v => v - 1);
								}
							}}>
								←
							</button>
							<button className="btn btn-outline-primary px-3" onClick={() => {
								if (active_col + 1 < col.length) {
									set_active_col(v => v + 1);
								}
							}}>
								→
							</button>
						</div>
						<div className="input-group mt-1">
							<label className="input-group-text">
								min
							</label>
							<input value={min_value} onChange={(e) => {setMinValue(Number(e.target.value))}}></input>
							<label className="input-group-text">
								min_color
							</label>
							<input type="color" value={min_color} onChange={(e) => {setMinColor(e.target.value)}}></input>

						</div>
						<div className="input-group mt-1">
							<label className="input-group-text">
								Max
							</label>
							<input value={max_value} onChange={(e) => {setMaxValue(Number(e.target.value))}}></input>
							<label className="input-group-text">
								Max_color
							</label>
							<input type="color" value={max_color} onChange={(e) => {setMaxColor(e.target.value)}}></input>
						</div>
					</div>
				</div>
			</div>
			<MapChart data={data[filter_day]} col={col[active_col]} min_value={min_value} max_value={max_value} min_color={min_color} max_color={max_color} key="us-state" />
			<a href="https://www.kaggle.com/competitions/godaddy-microbusiness-density-forecasting" target="_blank">←back to kaggle</a>,
			<a href="https://github.com/HNJ755329/godaddy_visualizer" target="_blank">github</a>
		</div >
	);
}

export default App;
