import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Svg,{ Circle, Line, G, Path, Text, Rect } from 'react-native-svg'
import * as d3 from "d3";
import * as scale from 'd3-scale';
import _ from 'lodash'
import createLegend from './util/createLegend'
import { calculateOverallLineChartData, buildColorArray } from './util/dataCalculation'
import { dummyData, leftAxisData, bottomAxisData } from './dummyData'

var linePathOne, linePathSecond, xCoordinate, yCoordinate, pointsOnLine, circleInFirstLine, circleInSecondLine, legend;

var WIDTH = 380,
        HEIGHT = 380,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 30
        }

export default class MulipleLineChart extends Component {

static defaultProps : any = {
		data: dummyData,
        leftAxisData: leftAxisData,
        bottomAxisData: bottomAxisData,
		axisColor: '#000',
		axisLabelColor: '#000',
		axisLineWidth: 1,
		chartFontSize: 10,
		color: [],
		dataPointRadius: 3,
		lineWidth: 2,
		hideAxis: false,
		dataPointsVisible: true,
		hideXAxisLabels: false,
		hideYAxisLabels: false,
		chartHeight: HEIGHT,
		chartWidth: WIDTH,
        showLegends: true,
        tickColorXAxis: '#000',
        tickWidthXAxis: '1',
        tickColorYAxis: '#000',
        tickWidthYAxis: '1',
        circleRadiusWidth: "2.5",
        circleRadius: 3,
        showTicks: true,
        lineStrokeOpacity: 1,
        lineStrokeDashArray: ['3','0'],
        showDashedLine: false,
        GraphWidth: 400,
        GraphHeight: 500,
        bottomAxisDataToShow: bottomAxisData,
        leftAxisDataToShow: leftAxisData,
        legendStyle: {
            width: 50,
            fillOpacity: 0.5,
            height: 20,
            strokeWidth: 2,
            legendFontSize: 12,
            legentTextFill: 'white'
        } 
	};    

constructor(props) {
    super(props)
}    

treeManipulation()
{
    const { data, leftAxisData, bottomAxisData, legendColor, legendText, minX, minY, maxX, maxY, scatterPlotEnable, dataPointsVisible, hideAxis, hideXAxisLabels, hideYAxisLabels, showLegends, axisColor, axisLabelColor, axisLineWidth, chartFontSize, Color, chartHeight, chartWidth, tickColorXAxis, tickColorYAxis, tickWidthXAxis, tickWidthYAxis, lineWidth, circleRadiusWidth, circleRadius, showTicks, legendStyle, lineStrokeOpacity, lineStrokeDashArray, showDashedLine, leftAxisDataToShow, bottomAxisDataToShow } = this.props

    const xScale = d3.scaleLinear().range(
        [MARGINS.left, chartWidth - MARGINS.right]).domain([minX,maxX]),
        yScale = d3.scaleLinear().range(
            [chartHeight - MARGINS.top, MARGINS.bottom]).domain([minY,maxY]),
        xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale).ticks(d3.timeDay, 1)
        .tickFormat(d3.timeFormat("%a %d")); 

    const TICKSIZE = chartWidth / 35
        let x = 0 ,y = chartHeight;
        let endX = x + chartWidth
        let endY = y
    xCoordinate =hideAxis ? null: <G fill='none'>
                                    <Line
                                    stroke={axisColor}
                                    strokeWidth={axisLineWidth}
                                    x1={x+10}
                                    x2={endX+10}
                                    y1={y}
                                    y2={endY} />
                                    {showTicks?_.map(bottomAxisData,function(d,i) {
                                    return     <Line
                                                key={i}
                                                stroke={tickColorXAxis}
                                                strokeWidth={tickWidthXAxis}
                                                x1={xScale(d)}
                                                y1={y}
                                                x2={xScale(d)}
                                                y2={y + TICKSIZE} />
                                    }) : null}
                                    {
                                        hideXAxisLabels ? null: _.map(bottomAxisData,function(d,i) {
                                                                return <Text
                                                                        key={i}
                                                                        fill={axisLabelColor}
                                                                        fontSize= {chartFontSize}
                                                                        textAnchor='middle'
                                                                        x={xScale(d)}
                                                                        y={chartHeight+20}>
                                                                        {bottomAxisDataToShow[i]}
                                                                    </Text>
                                                                })
                                    }
                                </G>

        let xx = 0 ,yy = chartHeight;
        let endXX = xx
        let endYY = yy - chartWidth
    yCoordinate = hideAxis ? null: <G fill='none'>
                                        <Line
                                        stroke={axisColor}
                                        strokeWidth={axisLineWidth}
                                        x1={xx+30}
                                        x2={endXX+30}
                                        y1={yy}
                                        y2={endYY} />
                                        {showTicks?_.map(leftAxisData,function(d,i) {
                                        return      <Line
                                                    key={i}
                                                    stroke={tickColorYAxis}
                                                    strokeWidth={tickWidthYAxis}
                                                    x1={xx+30}
                                                    y1={yScale(d)}
                                                    x2={xx + 20}
                                                    y2={yScale(d)} />
                                        }) : null}
                                        {
                                            hideYAxisLabels ? null : _.map(leftAxisData,function(d,i) {
                                                                    return <Text
                                                                            key={i}
                                                                            fill={axisLabelColor}
                                                                            fontSize= {chartFontSize}
                                                                            textAnchor='middle'
                                                                            x={xx+10}
                                                                            y={yScale(d)-8}>
                                                                            {leftAxisDataToShow[i]}
                                                                        </Text>
                                                                    })
                                        }
                                    </G>  
   var lineGen = d3.line()
                    .x(function(d) {
                        return xScale(d.x);
                    })
                    .y(function(d) {
                        return yScale(d.y);
                    })
   let linePointsData = formatLineData(data)
   linePathOne = scatterPlotEnable?null: _.map(linePointsData,(data,i) =>{
                    return (<Path strokeOpacity={lineStrokeOpacity} strokeDasharray={ showDashedLine ? lineStrokeDashArray[i] : ''} key={i} d={ data } fill="none" stroke={ Color[i] ? Color[i] : '#000'} strokeWidth={lineWidth} fill={'none'} />)
                 })
    let dataPointsColor = buildColorArray(data,Color) 

   let pointData = calculateOverallLineChartData(data)                  
   circleInFirstLine = dataPointsVisible? _.map(pointData,function(d,i) {
                                            let text
                                                text= <Text
                                                    fontSize= {chartFontSize}
                                                    x={xScale(d.x)} y={yScale(d.y)+5} >{ d.x }</Text>
                                            return (
                                                <G key={i}>
                                                <Circle key={'circle_' + i} strokeWidth={circleRadiusWidth} stroke= {dataPointsColor[i]} d= {d.x} fill= {'white'} cx= {xScale(d.x) } cy= {yScale(d.y) } r= {circleRadius} />
                                                {text}
                                                </G>
                                                )
                                            }) : null

   legend = showLegends? createLegend(legendColor,legendText,chartWidth,MARGINS,legendStyle) : null

   function formatLineData(data) 
   {

        let linePointsData = [],lineDataArray = [];

        for(let i = 0;i<data.length;i++)
        {
            lineDataArray.push(data[i]);
        }
        for(var i = 0;i < lineDataArray.length; i++)
        {
            linePointsData.push(lineGen(lineDataArray[i]));
        } 
  
        return linePointsData 
    }    
}

render()
{
    this.treeManipulation()
    const { GraphWidth, GraphHeight } = this.props
    return (
            <Svg width = {GraphWidth} height = {GraphHeight}>
                <G>
                    { yCoordinate }
                    { linePathOne }
                    { circleInFirstLine }
                    { legend }
                    { xCoordinate }
                </G>
            </Svg>
    )
}

}
 