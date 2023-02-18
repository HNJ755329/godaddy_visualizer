import React from "react";
import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import {scaleLinear} from "d3-scale";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const MapChart = (props) => {
	const colorScale = scaleLinear()
		.domain([props.min_value, props.max_value])
		.range([props.min_color, props.max_color])

	return (
		<>
			<ComposableMap projection="geoAlbersUsa">
				<Geographies geography={geoUrl}>
					{({geographies}) =>
						geographies.map(geo => {
							if (props.data) {
								const cur = props.data.find(s => Number(s.cfips) === Number(geo.id));
								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={colorScale(cur ? cur[props.col] : "#EEE")}
									/>
								);
							}
							else {
								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={colorScale("#EEE")}
									/>
								);

							}
						})
					}
				</Geographies>
			</ComposableMap>
		</>
	);
};

export default MapChart;
