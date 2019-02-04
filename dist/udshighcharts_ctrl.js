'use strict';

System.register(['app/plugins/sdk', 'lodash', './css/udshighcharts-panel.css!', './highcharts/highcharts.js', './highcharts/highcharts-more.js', './highcharts/dark-blue.js'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, Highcharts, addMore, theme, _createClass, panelDefaults, UdsHighChartsCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_appPluginsSdk) {
            MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_cssUdshighchartsPanelCss) {}, function (_highchartsHighchartsJs) {
            Highcharts = _highchartsHighchartsJs.default;
        }, function (_highchartsHighchartsMoreJs) {
            addMore = _highchartsHighchartsMoreJs.default;
        }, function (_highchartsDarkBlueJs) {
            theme = _highchartsDarkBlueJs.default;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            addMore(Highcharts);

            Highcharts.setOptions(theme);

            panelDefaults = {
                bgColor: null,

                labels: {
                    title: null,
                    subtitle: null,
                    x_legend: null,
                    y_legend: null
                },

                chart: {
                    type: 'bubble', //bubble, line
                    animation_duration: 0
                },

                postprocess: {
                    accumulate: false
                },

                fields: {
                    x_label: null,
                    y_label: null,
                    name_label: null
                }

            };

            _export('UdsHighChartsCtrl', UdsHighChartsCtrl = function (_MetricsPanelCtrl) {
                _inherits(UdsHighChartsCtrl, _MetricsPanelCtrl);

                function UdsHighChartsCtrl($scope, $injector, $rootScope) {
                    _classCallCheck(this, UdsHighChartsCtrl);

                    var _this = _possibleConstructorReturn(this, (UdsHighChartsCtrl.__proto__ || Object.getPrototypeOf(UdsHighChartsCtrl)).call(this, $scope, $injector));

                    _.defaultsDeep(_this.panel, panelDefaults);

                    _this.graphTypes = [{ text: 'Area', value: 'area' }, { text: 'Area Range', value: 'arearange' }, { text: 'Area Spline', value: 'areaspline' }, { text: 'Bar', value: 'bar' }, { text: 'Bellcurve', value: 'bellcurve' }, { text: 'Boxplot', value: 'boxplot' }, { text: 'Bubble', value: 'bubble' }, { text: 'Bullet', value: 'bullet' }, { text: 'Column', value: 'column' }, { text: 'Column Pyramid', value: 'columnpyramid' }, { text: 'Column Range', value: 'columrange' }, { text: 'Cylinder', value: 'cylinder' }, { text: 'Errorbar', value: 'errorbar' }, { text: 'Funnel', value: 'funnel' }, { text: 'Gauge', value: 'gauge' }, { text: 'Heatmap', value: 'heatmap' }, { text: 'Histogram', value: 'histogram' }, { text: 'Line Chart', value: 'line' }, { text: 'Networkgraph', value: 'networkgraph' }, { text: 'Packed Bubble', value: 'packedbubble' }, { text: 'Pareto', value: 'pareto' }, { text: 'Pie', value: 'pie' }, { text: 'Polygon', value: 'polygon' }, { text: 'Pyramid', value: 'pyramid' }, { text: 'Sankey', value: 'sankey' }, { text: 'Scatter Plot', value: 'scatter' }, { text: 'Scatter Plot 3D', value: 'scatter3d' }, { text: 'Solid Gauge', value: 'solidgauge' }, { text: 'Spline', value: 'spline' }, { text: 'Streamgraph', value: 'streamgraph' }, { text: 'Cunburst', value: 'sunburst' }, { text: 'Tilemap', value: 'tilemap' }, { text: 'Treemap', value: 'treemap' }, { text: 'Variable Pie', value: 'variablepie' }, { text: 'Variwide', value: 'variwide' }, { text: 'Vector', value: 'vector' }, { text: 'Venn Diagram', value: 'venn' }, { text: 'Waterfall', value: 'waterfall' }, { text: 'Windbarb', value: 'windbarb' }, { text: 'Wordcloud', value: 'wordcloud' }, { text: 'XRange', value: 'xrange' }];

                    _this.$rootScope = $rootScope;

                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
                    _this.events.on('panel-initialized', _this.render.bind(_this));
                    _this.events.on('render', _this.onRender.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));

                    _this.data = [];
                    _this.canvasid = ('id' + Math.random() * 100000).replace('.', '');
                    _this.divid = ('id' + Math.random() * 100000).replace('.', '');
                    _this.ctx = null;
                    _this.chart = null;
                    _this.ready = false;

                    _this.updateChart();
                    return _this;
                }

                _createClass(UdsHighChartsCtrl, [{
                    key: 'onDataError',
                    value: function onDataError() {
                        //console.log('Data error');
                        this.series = [];
                        this.render();
                    }
                }, {
                    key: 'updateChart',
                    value: function updateChart() {}
                }, {
                    key: 'onRender',
                    value: function onRender() {
                        if (this.ctx == null) {
                            if (document.getElementById(this.canvasid) != null) {
                                this.ctx = document.getElementById(this.canvasid).getContext('2d');
                            }
                        }
                        if (!this.chart) {
                            this.chart = Highcharts.chart(this.divid, {
                                chart: { type: this.panel.chart.type, plotBorderWidth: 1, zoomType: 'xy' },
                                legend: { enabled: false },
                                title: this.panel.labels.title ? { show: true, text: this.panel.labels.title } : null,
                                subtitle: this.panel.labels.subtitle ? { show: true, text: this.panel.labels.subtitle } : null,
                                /*
                                tooltip: {backgroundColor: '#FCFFC5', borderColor: 'black',borderRadius: 10,borderWidth: 3},
                                */
                                tooltip: {
                                    useHTML: true,
                                    headerFormat: '<table>',
                                    pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' + '<tr><th>' + (this.panel.fields.x_label || 'X') + ' :</th><td align="right">{point.x}</td></tr>' + '<tr><th>' + (this.panel.fields.y_label || 'Y') + ' :</th><td align="right">{point.y}</td></tr>' + '<tr><th>' + (this.panel.fields.name_label || 'Size') + ' :</th><td align="right">{point.z}</td></tr>',
                                    footerFormat: '</table>',
                                    followPointer: true
                                },
                                yAxis: { title: { text: null }, min: 0 },
                                xAxis: { title: { text: null }, min: 0 },
                                //xAxis: (this.panel.x_axis.categories) ? {categories: this.panel.x_axis.categories.split(',')} : {title: {text: null}, min:0},
                                plotOptions: {
                                    series: { dataLabels: { enabled: true, format: '{point.name}', animation: { duration: this.panel.chart.animation_duration } } },
                                    line: { dataLabels: { enabled: true }, enableMouseTracking: false, animation: { duration: this.panel.chart.animation_duration } }
                                },
                                series: this.panel.chart.type.replace('string:', '').trim() === 'bubble' ? [{ data: [{ x: 0, y: 0, z: 0, name: '', country: '' }] }] : []
                            });
                        }

                        if (this.data) {
                            //Todo - determine setters based on data properties
                            if (this.panel.chart.type.replace('string:', '').trim() === 'bubble') {
                                this.chart.series[0].setData(this.data);
                                this.chart.render();
                            } else {
                                while (this.chart.series.length > 0) {
                                    this.chart.series[0].remove(false);
                                }
                                for (var i = 0; i < this.data.length; i++) {
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
                }, {
                    key: 'decodeNonHistoricalData',
                    value: function decodeNonHistoricalData(fulldata) {
                        this.updateChart();
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        switch (this.panel.chart.type.replace('string:', '').trim()) {
                            case 'bubble':
                                {
                                    this.bubbleData(dataList);
                                    break;
                                }
                            case 'line':
                                {
                                    this.chartData(dataList);
                                    break;
                                }
                        }
                        this.updateChart();
                        this.render();
                    }
                }, {
                    key: 'chartData',
                    value: function chartData(dataList) {
                        var new_data = [];

                        var series = null;
                        var values = null;

                        if (dataList && dataList[0] && dataList[0].columns) {
                            for (var i = 0; i < dataList[0].columns.length; i++) {
                                if (dataList[0].columns[i].text === 'series') series = i;

                                if (dataList[0].columns[i].text === 'values') values = i;
                            }
                        }

                        if (series != null && values != null) {
                            if (dataList && dataList[0] && dataList[0].rows) {
                                dataList[0].rows.forEach(function (row) {
                                    new_data.push({ name: row[series], data: JSON.parse(row[values].replace('(', '[').replace(')', ']')) });
                                });
                            }
                        }

                        if (this.panel.postprocess.accumulate) {
                            for (var _i = 0; _i < new_data.length; _i++) {
                                var newValues = [];
                                var sum = 0;
                                for (var r = 0; r < new_data[_i].data.length; r++) {
                                    sum += new_data[_i].data[r];
                                    newValues.push(sum);
                                }
                                new_data[_i].data = newValues;
                            }
                        }
                        this.data = new_data;
                    }
                }, {
                    key: 'bubbleData',
                    value: function bubbleData(dataList) {
                        var new_data = [];
                        if (dataList && dataList[0] && dataList[0].rows) {
                            dataList[0].rows.forEach(function (row) {
                                var entry = {};
                                for (var i = 0; i < dataList[0].columns.length; i++) {
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
                }, {
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        //console.log('onInitEditMode');
                        this.addEditorTab('Options', 'public/plugins/sp-highcharts/editor.html', 2);
                    }
                }, {
                    key: 'onPanelTeardown',
                    value: function onPanelTeardown() {
                        //console.log('onPanelTeardown');
                        this.$timeout.cancel(this.nextTickPromise);
                    }
                }]);

                return UdsHighChartsCtrl;
            }(MetricsPanelCtrl));

            _export('UdsHighChartsCtrl', UdsHighChartsCtrl);

            UdsHighChartsCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=udshighcharts_ctrl.js.map
