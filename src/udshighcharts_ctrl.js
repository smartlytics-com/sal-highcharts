import {
  MetricsPanelCtrl,
}
from 'app/plugins/sdk';
import _ from 'lodash';
import './css/udshighcharts-panel.css!';
import Highcharts from './highcharts/highcharts.js';
import addMore from './highcharts/highcharts-more.js';
addMore(Highcharts);
import theme from './highcharts/dark-blue.js';
Highcharts.setOptions(theme);

const panelDefaults = {
  bgColor: null,

  labels: {
    title: null,
    subtitle: null,
    x_legend: null,
    y_legend: null
  },

  chart: {
    type: 'bubble', //bubble, line
    animation_duration: 0,
  },

  postprocess: {
    accumulate: false,
  },

  fields: {
    x_label: null,
    y_label: null,
    name_label: null,
  }

};

export class UdsHighChartsCtrl extends MetricsPanelCtrl {


  constructor($scope, $injector, $rootScope) {
    super($scope, $injector);
    _.defaultsDeep(this.panel, panelDefaults);

    this.graphTypes = [
        { text: 'Area', value: 'area' },
        { text: 'Area Range', value: 'arearange' },
        { text: 'Area Spline', value: 'areaspline' },
        { text: 'Bar', value: 'bar' },
        { text: 'Bellcurve', value: 'bellcurve' },
        { text: 'Boxplot', value: 'boxplot' },
        { text: 'Bubble', value: 'bubble' },
        { text: 'Bullet', value: 'bullet' },
        { text: 'Column', value: 'column' },
        { text: 'Column Pyramid', value: 'columnpyramid' },
        { text: 'Column Range', value: 'columrange' },
        { text: 'Cylinder', value: 'cylinder' },
        { text: 'Errorbar', value: 'errorbar' },
        { text: 'Funnel', value: 'funnel' },
        { text: 'Gauge', value: 'gauge' },
        { text: 'Heatmap', value: 'heatmap' },
        { text: 'Histogram', value: 'histogram' },
        { text: 'Line Chart', value: 'line' },
        { text: 'Networkgraph', value: 'networkgraph' },
        { text: 'Packed Bubble', value: 'packedbubble' },
        { text: 'Pareto', value: 'pareto' },
        { text: 'Pie', value: 'pie' },
        { text: 'Polygon', value: 'polygon' },
        { text: 'Pyramid', value: 'pyramid' },
        { text: 'Sankey', value: 'sankey' },
        { text: 'Scatter Plot', value: 'scatter' },
        { text: 'Scatter Plot 3D', value: 'scatter3d' },
        { text: 'Solid Gauge', value: 'solidgauge' },
        { text: 'Spline', value: 'spline' },
        { text: 'Streamgraph', value: 'streamgraph' },
        { text: 'Cunburst', value: 'sunburst' },
        { text: 'Tilemap', value: 'tilemap' },
        { text: 'Treemap', value: 'treemap' },
        { text: 'Variable Pie', value: 'variablepie' },
        { text: 'Variwide', value: 'variwide' },
        { text: 'Vector', value: 'vector' },
        { text: 'Venn Diagram', value: 'venn' },
        { text: 'Waterfall', value: 'waterfall' },
        { text: 'Windbarb', value: 'windbarb' },
        { text: 'Wordcloud', value: 'wordcloud' },
        { text: 'XRange', value: 'xrange' }
    ];

    this.$rootScope = $rootScope;

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
    this.events.on('panel-initialized', this.render.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));

    this.data = [];
    this.canvasid = ('id' + (Math.random() * 100000)).replace('.', '');
    this.divid = ('id' + (Math.random() * 100000)).replace('.', '');
    this.ctx = null;
    this.chart = null;
    this.ready = false;

    this.updateChart();
  }

  onDataError() {
    //console.log('Data error');
    this.series = [];
    this.render();
  }

  updateChart() {
  }

  onRender() {
    if (this.ctx == null) {
      if (document.getElementById(this.canvasid) != null) {
        this.ctx = document.getElementById(this.canvasid).getContext('2d');
      }
    }
    if (!this.chart) {
        this.chart = Highcharts.chart(this.divid, {
            chart: {type: this.panel.chart.type, plotBorderWidth: 1,zoomType: 'xy'},
            legend: { enabled: false },
            title: (this.panel.labels.title) ? { show: true, text: this.panel.labels.title} : null,
            subtitle: (this.panel.labels.subtitle) ? { show: true, text: this.panel.labels.subtitle} : null,
            /*
            tooltip: {backgroundColor: '#FCFFC5', borderColor: 'black',borderRadius: 10,borderWidth: 3},
            */
            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
                    '<tr><th>' + (this.panel.fields.x_label || 'X') + ' :</th><td align="right">{point.x}</td></tr>' +
                    '<tr><th>' + (this.panel.fields.y_label || 'Y') + ' :</th><td align="right">{point.y}</td></tr>' +
                    '<tr><th>' + (this.panel.fields.name_label || 'Size') + ' :</th><td align="right">{point.z}</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },
            yAxis: {title: {text: null}, min:0},
            xAxis: {title: {text: null}, min:0},
            //xAxis: (this.panel.x_axis.categories) ? {categories: this.panel.x_axis.categories.split(',')} : {title: {text: null}, min:0},
            plotOptions: {
                series: {dataLabels: {enabled: true, format: '{point.name}', animation: {duration: this.panel.chart.animation_duration}}},
                line: {dataLabels: {enabled: true},enableMouseTracking: false, animation: {duration: this.panel.chart.animation_duration}}
            },
            series: (this.panel.chart.type.replace('string:','').trim() === 'bubble') ? [{data: [{ x: 0, y: 0, z: 0, name: '', country: '' }]}] : []
        });
    }

    if (this.data) {
        //Todo - determine setters based on data properties
        if (this.panel.chart.type.replace('string:','').trim() === 'bubble') {
            this.chart.series[0].setData(this.data);
            this.chart.render();
        } else {
            while (this.chart.series.length > 0) { this.chart.series[0].remove(false);}
            for (let i = 0; i < this.data.length; i++) {
                this.chart.addSeries(this.data[i], false);
            }
        }
    }

    /* If type changed
    let type = this.panel.chart.type.replace('string:','').trim();
    this.chart.series.forEach(function(series) {series.update({type: type},false)});
    */

    this.chart.redraw();
    //this.updateChart();
  }

  decodeNonHistoricalData(fulldata) {
    this.updateChart();
  }

  //***************************************************
  // Data received
  //***************************************************
  onDataReceived(dataList) {
      switch(this.panel.chart.type.replace('string:','').trim()) {
      case 'bubble': {
          this.bubbleData(dataList);
          break;
      }
      case 'line': {
          this.chartData(dataList);
          break;
      }
    }
    this.updateChart();
    this.render();
  }

  chartData(dataList) {
      let new_data = [];

      let series = null;
      let values = null;

      if (dataList && dataList[0] && dataList[0].columns) {
          for (let i = 0; i < dataList[0].columns.length; i++) {
              if (dataList[0].columns[i].text === 'series') series = i;

              if (dataList[0].columns[i].text === 'values') values = i;
          }
      }

      if (series != null && values != null) {
          if (dataList && dataList[0] && dataList[0].rows) {
              dataList[0].rows.forEach(function(row) {
                  new_data.push({name: row[series], data: JSON.parse(row[values].replace('(','[').replace(')',']'))});
              });
          }
      }

      if (this.panel.postprocess.accumulate) {
          for (let i = 0; i < new_data.length; i++) {
              let newValues = [];
              let sum = 0;
              for (let r = 0; r < new_data[i].data.length; r++) {
                  sum += new_data[i].data[r];
                  newValues.push(sum);
              }
              new_data[i].data = newValues;
          }
      }
      this.data = new_data;
  }

  bubbleData(dataList) {
      let new_data = [];
      if (dataList && dataList[0] && dataList[0].rows) {
          dataList[0].rows.forEach(function(row) {
              let entry = {};
              for (let i = 0; i < dataList[0].columns.length; i++) {
                  entry[dataList[0].columns[i].text] = row[i] || (dataList[0].columns[i].text === 'name' || dataList[0].columns[i].text === 'details' ? '' : 0);
              }
              new_data.push(entry);
          });
      }
      this.data = new_data;
      try {
          if (this.chart != null) this.chart.series[0].setData(this.data);
      } catch (e) {
          console.log('Error:', e);
      }
  }

  onInitEditMode() {
    //console.log('onInitEditMode');
    this.addEditorTab('Options', 'public/plugins/sp-highcharts/editor.html', 2);
  }

  onPanelTeardown() {
    //console.log('onPanelTeardown');
    this.$timeout.cancel(this.nextTickPromise);
  }

}

UdsHighChartsCtrl.templateUrl = 'module.html';