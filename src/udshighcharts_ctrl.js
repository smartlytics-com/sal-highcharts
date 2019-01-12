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
    console.log('render!');
    if (this.ctx == null) {
      if (document.getElementById(this.canvasid) != null) {
        this.ctx = document.getElementById(this.canvasid).getContext('2d');
      }
    }
    if (!this.chart) {
        this.chart = Highcharts.chart(this.divid, {
            chart: {type: 'bubble',plotBorderWidth: 0,zoomType: 'xy'},
            legend: { enabled: false },
            title: null,    //{ show: false, text: 'Sugar and fat intake per country'},
            subtitle: null, //{text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'},
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
            plotOptions: {series: {dataLabels: {enabled: true, format: '{point.name}'}}},
            series: [{data: [{ x: 0, y: 0, z: 0, name: '', country: '' }]}]
        });
    }
    if (this.data) this.chart.series[0].setData(this.data);
    this.chart.render();
    //console.log("chart: ", this.chart);
    //this.updateChart();

  }

  decodeNonHistoricalData(fulldata) {
    this.updateChart();
  }

  //***************************************************
  // Data received
  //***************************************************
  onDataReceived(dataList) {
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
    this.updateChart();
    this.render();
  }

  onInitEditMode() {
    //console.log('onInitEditMode');
    this.addEditorTab('Options', 'public/plugins/uds-highcharts-panel/editor.html', 2);
  }

  onPanelTeardown() {
    //console.log('onPanelTeardown');
    this.$timeout.cancel(this.nextTickPromise);
  }

}

UdsHighChartsCtrl.templateUrl = 'module.html';