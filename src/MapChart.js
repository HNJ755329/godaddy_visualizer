import React, {useState, useEffect} from "react";
import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import {scaleLinear} from "d3-scale";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const colorScale = scaleLinear()
	.domain([0, 10])
	.range(["white", "red"])



const MapChart = (props) => {

	let sample_colors = new Array();
	for (let i = 0; i <= 10; i++) {
		sample_colors.push(<span style={{background: colorScale(i)}
		} >_{i}_ </span >);

	}

	return (
		<>
			{sample_colors}

			<ComposableMap projection="geoAlbersUsa">
				<Geographies geography={geoUrl}>
					{({geographies}) =>
						geographies.map(geo => {
							if (props.data) {
								const cur = props.data.find(s => s.id == geo.id);
								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={colorScale(cur ? cur.density : "#EEE")}
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
