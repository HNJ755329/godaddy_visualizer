import React from "react";
import {scaleLinear} from "d3-scale";

const SampleColor = (props) => {
	const colorScale = scaleLinear()
		.domain([props.min_value, props.max_value])
		.range([props.min_color, props.max_color])

	let sample_colors = [];
	for (let i = 0; i <= 10; i++) {
		const value = Number(props.min_value) + i * (Number(props.max_value) - Number(props.min_value)) / 10;
		sample_colors.push(<span style={{background: colorScale(value)}
		} > {Number(value)} </span >);
	}

	return (
		<div>
			{props.col} :
			{sample_colors}
		</div>
	);
};

export default SampleColor;
