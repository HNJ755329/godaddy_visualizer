import './App.css';
import React, {useState, useEffect} from "react";
import MapChart from "./MapChart"
import SampleColor from "./SampleColor"
import {csv} from "d3-fetch";
import {csvParse} from "d3-dsv";

const setyyyymmdd = (year, month, day) => {
	return year + "-" + ("00" + month).slice(-2) + "-" + ("00" + day).slice(-2);
}


const App = () => {
	const [data, setData] = useState({});
	const [year, setYY] = useState(2022);
	const [month, setMM] = useState(1);
	const day = 1;
	const [activeCol, setActiveCol] = useState(1);
	const [col, setCol] = useState([]);
	const [filter_day, setFilter] = useState(setyyyymmdd(2022, 1, 1));
	const [file, setFile] = useState();
	const [file_name, setFileName] = useState("");
	const [min_value, setMinValue] = useState(0);
	const [max_value, setMaxValue] = useState(10);
	const [min_color, setMinColor] = useState("#FFFFFF");
	const [max_color, setMaxColor] = useState("#FF0000");
	const [has_row_id, setHasrowid] = useState(true);
	const fileReader = new FileReader();

	const handleOnChange = (e) => {
		setFile(e.target.files[0]);
	};
	const setValues = (array) => {
		if ("row_id" in array[0]) {
			setHasrowid(true);
			const contents = array.map(elem => {
				const cfips = Number(elem.row_id.split("_")[0]);
				const first_day_of_month = elem.row_id.split("_")[1];
				return Object.assign({cfips: cfips, first_day_of_month: first_day_of_month}, elem);
			});
			const yymd = new Set(contents.map(elem => elem.first_day_of_month));
			for (const x of yymd) {
				data[x] = contents.filter(v => v.first_day_of_month === x);
			}
			setData(data);
		}
		else if ("cfips" in array[0]) {
			if ("first_day_of_month" in array[0]) {
				setHasrowid(true);
				const yymd = new Set(array.map(elem => elem.first_day_of_month));
				for (const x of yymd) {
					data[x] = array.filter(v => v.first_day_of_month === x);
				}
				setData(data);
			}
			else {
				setHasrowid(false);
				data["!"] = array;
				setData(data);
			}
		}
		else {
			setHasrowid(false);
		}
		setCol(Object.keys(array[0]));
		let colindex = Object.keys(array[0]).indexOf("microbusiness_density");
		if (colindex < 0) {
			colindex = Object.keys(array[0]).length - 1;
		}
		setActiveCol(colindex);
	};

	const csvFiletoData = (csvdata) => {
		const array = csvParse(csvdata);
		setValues(array);
	};

	const handleOnSubmit = (e) => {
		e.preventDefault();

		if (file) {
			fileReader.onload = function (event) {
				const text = event.target.result;
				csvFiletoData(text);
			};

			setFileName(file.name);
			fileReader.readAsText(file);
		}
	};

	useEffect(() => {
		const filename = "train_short.csv";
		csv(filename).then(counties => {
			setValues(counties);
		});
		setFileName(filename);
	}, []);

	const YearButton = (
		<div className="input-group mt-1">
			<label className="input-group-text">
				Year
			</label>
			<input value={year} disabled></input>
			<button className="btn btn-outline-primary px-3" onClick={() => {setYY(v => v - 1); setFilter(setyyyymmdd(year - 1, month, day));}}>
				-Y
			</button>
			<button className="btn btn-outline-primary px-3" onClick={() => {setYY(v => v + 1); setFilter(setyyyymmdd(year + 1, month, day));}}>
				+Y
			</button>
		</div>
	);
	const MonthButton = (
		<div className="input-group mt-1">
			<label className="input-group-text">
				Month
			</label>
			<input value={month} disabled></input>
			<button className="btn btn-outline-primary px-3" onClick={() => {
				if (month === 1) {
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
			<button className="btn btn-outline-primary px-3" onClick={() => {
				if (month === 12) {
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
		</div>
	);

	const ImportButton = (
		<div className="input-group mt-4 w-50">
			<input type={"file"} className="form-control" accept={".csv"} onChange={handleOnChange} />
			<button className="btn btn-outline-primary px-4"
				onClick={(e) => {
					handleOnSubmit(e);
				}} t
			>
				IMPORT CSV
			</button>
		</div>

	);

	const FileName = (
		< div >
			{file_name}
		</div >
	);

	const ColPanel = (
		<div>
			{col.map(elem => {
				if (elem === col[activeCol]) {
					return <span style={{fontWeight: "bold"}}> [{elem}] </span>
				}
				else {
					return <span> {elem} </span>
				}
			}
			)}
		</div >
	);

	const ColButton = (
		<div className="input-group mt-1">
			<label className="input-group-text">
				column
			</label>
			<input value={col[activeCol]} disabled></input>
			<button className="btn btn-outline-primary px-3" onClick={() => {
				if (activeCol > 0) {
					setActiveCol(v => v - 1);
				}
			}}>
				←
			</button>
			<button className="btn btn-outline-primary px-3" onClick={() => {
				if (activeCol + 1 < col.length) {
					setActiveCol(v => v + 1);
				}
			}}>
				→
			</button>
		</div>
	);
	const MinButton = (
		<div className="input-group mt-1">
			<label className="input-group-text">
				min
			</label>
			<input value={min_value} onChange={(e) => {setMinValue(e.target.value)}}></input>
			<label className="input-group-text">
				min_color
			</label>
			<input type="color" value={min_color} onChange={(e) => {setMinColor(e.target.value)}}></input>

		</div>
	);

	const MaxButton = (
		<div className="input-group mt-1">
			<label className="input-group-text">
				Max
			</label>
			<input value={max_value} onChange={(e) => {setMaxValue(e.target.value)}}></input>
			<label className="input-group-text">
				Max_color
			</label>
			<input type="color" value={max_color} onChange={(e) => {setMaxColor(e.target.value)}}></input>
		</div >
	);

	const YMDPanel = (
		<div>
			{year}-{month}-{day} / {filter_day}
		</div>
	);

	return (
		<div>
			{ImportButton}

			{FileName}
			{ColPanel}
			{YMDPanel}
			{MinButton}
			{MaxButton}

			{ColButton}
			{YearButton}
			{MonthButton}
			<SampleColor col={col[activeCol]} min_value={min_value} max_value={max_value} min_color={min_color} max_color={max_color} key="sample-color" />
			<MapChart data={has_row_id ? data[filter_day] : data["!"]} col={col[activeCol]} min_value={min_value} max_value={max_value} min_color={min_color} max_color={max_color} key="us-state" />
		</div >
	);
}

export default App;
