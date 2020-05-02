<template>
    <div ref="parent">
        <div class="bar_race" id="barRace"></div>
        <SlideController :start-date="startDate" :end-date="endDate" :current-date="day" @change="changeDate" @playPause="playing = $event"></SlideController>
    </div>

</template>

<script>
    /* eslint-disable */
    import SlideController from './SlideController'
    import {isDateValid} from '../js/locationUtils'
    export default {
        name: "BarRace",
        components: {
            SlideController
        },
        props: {
            raceData: Array,
            title: String,
            subtitle: String,
            source: String,
            id:String,
            changeLabelPosition: Boolean,
            isRate: Boolean,
            color: String,
            mainDate: String
        },
        data:function () {
            return {
                width:500,
                day:"",
                playing: true,
                startDate: "",
                endDate: "",
            }
        },
        created() {
            // window.addEventListener("resize", this.resizeEventHandler);
        },
        destroyed() {
            // console.log("destoryed");
            // window.removeEventListener("resize", this.resizeEventHandler);
        },
        methods: {
            resizeEventHandler() {
                if(this.$refs.parent){
                    this.width = this.$refs.parent.clientWidth;
                }
                // this.width = window.innerWidth>510?510: window.innerWidth-55;
                // console.log(this.width)
            },
            changeDate(e){
                this.day = e;
                this.emitDateChange(e)
            },
            emitDateChange(e){
                this.$emit('dateChange', e)
            }
        },
        mounted() {
            const moment = require('moment');
            this.resizeEventHandler();
            this.startDate = this.raceData[0].day;
            this.endDate = this.raceData[this.raceData.length-1].day;
            const d3 = require('d3');
            //ref https://gist.github.com/jrzief/70f1f8a5d066a286da3a1e699823470f NEED REFACTOR THO, no time yet
            // Feel free to change or delete any of the code you see in this editor!
            let svg = d3.select("#barRace").append("svg")
                .attr("width", this.width)
                .attr("height", 500);

            let tickDuration = 1000;

            let top_n = 12;
            let height = 500;
            let width = this.width;

            const margin = {
                top: 30,
                right: 0,
                bottom: 5,
                left: 0
            };

            let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);

            // let title = svg.append('text')
            //     .attr('class', 'title')
            //     .attr('y', 24)
            //     .html(this.title);
            //
            // let subTitle = svg.append("text")
            //     .attr("class", "subTitle")
            //     .attr("y", 55)
            //     .html(this.subtitle);

            let caption = svg.append('text')
                .attr('class', 'caption')
                .attr('x', width)
                .attr('y', height-5)
                .style('text-anchor', 'end')
                .html("©covid19track.site | Data ©JHU");

            this.day =  this.mainDate && isDateValid(this.mainDate, this.raceData[0].day, this.raceData[this.raceData.length-1].day ) ? this.mainDate :  this.raceData[0].day;

            let totalString = this.$t('total');
            let that = this;

            function loadData(data) {
                //if (error) throw error;

                // console.log(data);

                data.forEach(d => {
                    d.value = +d.value,
                        d.lastValue = d.lastValue<0? 0: +d.lastValue,
                        d.value = isNaN(d.value) && d.value < 0 ? 0 : d.value,
                        d.colour = that.color?that.color:"#33CCFF"
                });

                // console.log(data);

                let daySlice = data.filter(d => d.day == that.day && !isNaN(d.value))
                    .sort((a,b) => b.value - a.value)
                    .slice(0, top_n);

                daySlice.forEach((d,i) => d.rank = i);

                // console.log('daySlice: ', daySlice)


                const getClassName = (d)=>"bar_"+d.name.replace(/[^\w]/g, "_");

                const isTooSmall = (d)=>{
                    let theBar = d3.select(`.${getClassName(d)}`);
                    return theBar?.node()?.getBoundingClientRect().width < 100
                };
                const getOutsideWidth = (d) => x(d.value)+15+(d.value.toFixed(0)).length*10;

                const getLabelX = (d)=>that.changeLabelPosition && isTooSmall(d)?getOutsideWidth(d): x(d.value)-8;
                const getLabelAnchor = (d)=>that.changeLabelPosition && isTooSmall(d)?'start':'end';



                let x = d3.scaleLinear()
                    .domain([0, d3.max(daySlice, d => d.value)])
                    .range([margin.left, width-margin.right-65]);

                let y = d3.scaleLinear()
                    .domain([top_n, 0])
                    .range([height-margin.bottom, margin.top]);

                let xAxis = d3.axisTop()
                    .scale(x)
                    .ticks(width > 500 ? 5:2)
                    .tickSize(-(height-margin.top-margin.bottom))
                    .tickFormat(d => d3.format(',')(d));

                svg.append('g')
                    .attr('class', 'axis xAxis')
                    .attr('transform', `translate(0, ${margin.top})`)
                    .call(xAxis)
                    .selectAll('.tick line')
                    .classed('origin', d => d == 0);

                svg.selectAll('rect.bar')
                    .data(daySlice, d => d.name)
                    .enter()
                    .append('rect')
                    .attr('class', d =>  `bar ${getClassName(d)}`)
                    .attr('x', x(0)+1)
                    .attr('width', d => (x(d.value)-x(0)-1)<0?0:(x(d.value)-x(0)-1))
                    .attr('y', d => y(d.rank)+5)
                    .attr('height', y(1)-y(0)-barPadding)
                    .style('fill', d => d.colour);

                svg.selectAll('text.label')
                    .data(daySlice, d => d.name)
                    .enter()
                    .append('text')
                    .attr('class', 'label')
                    .attr('x', d => getLabelX(d))
                    .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
                    .style('text-anchor',d =>  getLabelAnchor(d))
                    .style('color', 'white')
                    .html(d => d.name);

                svg.selectAll('text.valueLabel')
                    .data(daySlice, d => d.name)
                    .enter()
                    .append('text')
                    .attr('class', 'valueLabel')
                    .attr('x', d => x(d.value)+5)
                    .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
                    .text(d => d3.format(',.0f')(d.lastValue));

                let dayText = svg.append('text')
                    .attr('class', 'dayText')
                    .attr('x', width-margin.right)
                    .attr('y', height-60)
                    .style('text-anchor', 'end')
                    .html(that.day);
                    // .call(halo, 10);

                let totalText = svg.append('text')
                    .attr('class', 'totalText')
                    .attr('x', width-margin.right)
                    .attr('y', height-30)
                    .style('text-anchor', 'end')
                    .html(totalString + " - 0");

                let total = 0;

                let ticker = d3.interval(e => {
                    if(!that.playing) return;
                    that.resizeEventHandler();

                    daySlice = data.filter(d => d.day == that.day && !isNaN(d.value))
                        .sort((a,b) => b.value - a.value);

                    total = daySlice.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);

                    if(that.isRate){
                        totalText.text(d => "Data Average - " + d3.format(',.2f')(total/daySlice.length)+"%");
                    }else {
                        totalText.text(d => totalString + " - " + d3.format(',.0f')(total));
                    }

                    daySlice = daySlice.slice(0,top_n);

                    daySlice.forEach((d,i) => d.rank = i);

                    // console.log('Intervalday: ', daySlice);

                    x.domain([0, d3.max(daySlice, d => d.value)]);

                    svg.select('.xAxis')
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .call(xAxis);

                    let bars = svg.selectAll('.bar').data(daySlice, d => d.name);

                    bars
                        .enter()
                        .append('rect')
                        .attr('class', d => `bar ${getClassName(d)}`)
                        .attr('x', x(0)+1)
                        .attr( 'width', d => (x(d.value)-x(0)-1)<0?0:(x(d.value)-x(0)-1))
                        .attr('y', d => y(top_n+1)+5)
                        .attr('height', y(1)-y(0)-barPadding)
                        .style('fill', d => d.colour)
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .attr('y', d => y(d.rank)+5);

                    bars
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .attr('width', d => (x(d.value)-x(0)-1)<0?0:(x(d.value)-x(0)-1))
                        .attr('y', d => y(d.rank)+5);

                    bars
                        .exit()
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .attr('width', d => (x(d.value)-x(0)-1)<0?0:(x(d.value)-x(0)-1))
                        .attr('y', d => y(top_n+1)+5)
                        .remove();

                    let labels = svg.selectAll('.label')
                        .data(daySlice, d => d.name);



                    labels
                        .enter()
                        .append('text')
                        .attr('class', 'label')
                        .attr('x', d => getLabelX(d))
                        .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
                        .style('text-anchor',  d => getLabelAnchor(d))
                        .style('color', 'white')
                        .html(d => d.name)
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);


                    labels
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .attr('x', d => getLabelX(d))
                        .style('text-anchor',  d => getLabelAnchor(d))
                        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

                    labels
                        .exit()
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .attr('x', d => getLabelX(d))
                        .style('text-anchor',  d => getLabelAnchor(d))
                        .attr('y', d => y(top_n+1)+5)
                        .remove();



                    let valueLabels = svg.selectAll('.valueLabel').data(daySlice, d => d.name);

                    valueLabels
                        .enter()
                        .append('text')
                        .attr('class', 'valueLabel')
                        .attr('x', d => x(d.value)+5)
                        .attr('y', d => y(top_n+1)+5)
                        .text(d => d3.format(',.0f')(d.lastValue))
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

                    valueLabels
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .attr('x', d => x(d.value)+5)
                        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
                        .tween("text", function(d) {
                            let i = d3.interpolateRound(d.lastValue, d.value);
                            return function(t) {
                                this.textContent = d3.format(',')(i(t));
                            };
                        });


                    valueLabels
                        .exit()
                        .transition()
                        .duration(tickDuration)
                        .ease(d3.easeLinear)
                        .attr('x', d => x(d.value)+5)
                        .attr('y', d => y(top_n+1)+5)
                        .remove();

                    dayText.html(that.day);
                    that.emitDateChange(that.day);

                    let currentMoment = moment(that.day+' 2020', window.dateFormat + ' YYYY');
                    let endMoment = moment(data[data.length-1].day+' 2020', window.dateFormat + ' YYYY');
                    // day = d3.format('.1f')((+day) + 0.1);
                    that.day = currentMoment.add(1, 'days').format(window.dateFormat);
                    if(currentMoment.isAfter(endMoment)) that.day= data[0].day;
                    // console.log(day)
                    // console.log(day)
                },tickDuration);

            }
            loadData(this.raceData);


            // const halo = function(text, strokeWidth) {
            //     text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
            //         .style('fill', '#ffffff')
            //         .style( 'stroke','#ffffff')
            //         .style('stroke-width', strokeWidth)
            //         .style('stroke-linejoin', 'round')
            //         .style('opacity', 1);
            //
            // }
        }
    }
</script>

<style>
    .bar_race text{
        font-size: 16px;
        font-family: Open Sans, sans-serif;
    }
    .bar_race text.title{
        font-size: 24px;
        font-weight: 500;
    }
    .bar_race text.subTitle{
        font-weight: 500;
        fill: #777777;
    }
    .bar_race text.totalText{
        font-size: 23px;
        font-weight: bold;
        fill: #3d3d3d;
    }
    .bar_race text.caption{
        font-weight: 400;
        font-size: 14px;
        fill: #777777;
    }
    .bar_race text.label{
        color: white !important;
        font-weight: 600;
    }

    .bar_race text.valueLabel{
        font-weight: 300;
    }

    .bar_race text.dayText{
        font-size: 64px;
        font-weight: 700;
        opacity: 0.25;
    }
    dayText{
        font-size: 80px !important;
        font-weight: 700;
        opacity: 0.25;
    }
    .tick text {
        fill: #777777;
    }
    .xAxis .tick:nth-child(2) text {
        text-anchor: start;
    }
    .tick line {
        shape-rendering: CrispEdges;
        stroke: #dddddd;
    }
    .tick line.origin{
        stroke: #aaaaaa;
    }
    path.domain{
        display: none;
    }
</style>