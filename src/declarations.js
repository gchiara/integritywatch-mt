import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'declarations',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  selectedMandate: 'all',
  charts: {
    topDeposits: {
      title: 'Top 10 MPs by deposits',
      info: 'Top 10 MPs by deposits amount'
    },
    partyDeposits: {
      title: 'Deposits amount by party',
      info: 'Deposits amount by party'
    },
    professions: {
      title: 'Top 10 Professions',
      info: 'Top 10 Professions by number of MPs'
    },
    investments: {
      title: 'Investments',
      info: 'Share of MPs with declared investments'
    },
    properties: {
      title: 'Properties',
      info: 'Share of MPs by number of properties'
    },
    associations: {
      title: 'Directorships or associations',
      info: 'Share of MPs by number of directorships or associations'
    },
    otherInterests: {
      title: 'Other financial interests',
      info: 'Share of MPs with other financial interests declared '
    },
    table: {
      chart: null,
      type: 'table',
      title: 'MPs',
      info: ''
    }
  },
  selectedEl: {"Name": ""},
  colors: {
    default: "#608a7d",
    range: ["#62aad9", "#3b95d0", "#1a6da3", "#085c9c", "#e3b419", "#e39219", "#de7010"],
    colorSchemeCloud: ["#62aad9", "#3b95d0", "#b7bebf", "#1a6da3", "#e3b419", "#e39219", "#de7010"],
    rangeProperties: {
      "1": "#7da89b",
      "2": "#608a7d",
      "3 - 5": "#467365",
      "6 - 9": "#2f5c4e",
      "10+": "#204a3d"
    },
    numPies: {
      "0": "#ddd",
      "1": "#ff516a",
      "2": "#f43461",
      "3": "#e51f5c",
      "4": "#d31a60",
      ">5": "#bb1d60"
    },
    parties: {
      "Partit Nazzjonalista": "#397191",
      "PN": "#397191",
      "Alternattiva Demokratika": "#57b34d",
      "Partit Demokratiku": "#e69340",
      "Partit Laburista": "#a6292c",
      "PL": "#a6292c",
      "Moviment Patrijotti Maltin": "#5a407d",
      "Imperium Europa": "#ffd500",
      "Brain, Not Ego": "#12c1c7",
      "Independent": '#ccc'
    }
  }
}

//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Integrity Watch Malta ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        //var toShareUrl = window.location.href.split('?')[0];
        var toShareUrl = 'https://iw.daphne.foundation';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})


//Charts
var charts = {
  topDeposits: {
    chart: dc.rowChart("#topdeposits_chart"),
    type: 'row',
    divId: 'topdeposits_chart'
  },
  partyDeposits: {
    chart: dc.pieChart("#partydeposits_chart"),
    type: 'pie',
    divId: 'partydeposits_chart'
  },
  professions: {
    chart: dc.rowChart("#professions_chart"),
    type: 'row',
    divId: 'professions_chart'
  },
  investments: {
    chart: dc.pieChart("#investments_chart"),
    type: 'pie',
    divId: 'investments_chart'
  },
  properties: {
    chart: dc.pieChart("#properties_chart"),
    type: 'pie',
    divId: 'properties_chart'
  },
  associations: {
    chart: dc.pieChart("#associations_chart"),
    type: 'pie',
    divId: 'associations_chart'
  },
  otherInterests: {
    chart: dc.pieChart("#otherinterests_chart"),
    type: 'pie',
    divId: 'otherinterests_chart'
  },
  table: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function() {
  //Replace element if with wordcloud column id
  var width = document.getElementById("wordcloud_chart_col").offsetWidth - vuedata.chartMargin*2;
  return [width, 410];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    var sizes = calcPieSize(charts[c].divId);
    var newWidth = recalcWidth(charts[c].divId);
    var charsLength = recalcCharsLength(newWidth);
    if(charts[c].type == 'row'){
      charts[c].chart.width(newWidth);
      charts[c].chart.label(function (d) {
        var thisKey = d.key;
        if(thisKey.indexOf('###') > -1){
          thisKey = thisKey.split('###')[0];
        }
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      })
      charts[c].chart.redraw();
    } else if(charts[c].type == 'bar') {
      charts[c].chart.width(newWidth);
      charts[c].chart.rescale();
      charts[c].chart.redraw();
    } else if(charts[c].type == 'pie') {
      charts[c].chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(15).autoItemWidth(true).horizontal(true).legendWidth(sizes.width));
        //.legend(dc.legend().x(0).y(sizes.legendY).gap(10));
      charts[c].chart.redraw();
    } else if(charts[c].type == 'cloud') {
      charts[c].chart.size(recalcWidthWordcloud());
      charts[c].chart.redraw();
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}
//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

function cleanAmount(amt) {
  amt = parseFloat(amt.replace(',',''))
  if(isNaN(amt)) {
    return 0;
  }
  return amt;
}

function getPropertiesRange(amt) {
  if(amt >= 10) {
    return "10+";
  } else if(amt >= 6) {
    return "6 - 9";
  } else if(amt >= 3) {
    return "3 - 5";
  } else if(amt > 1) {
    return "2";
  } else if(amt > 0) {
    return "1";
  }
  return 0;
}

//Load data and generate charts
//Generate random parameter for dynamic dataset loading (to avoid caching)

var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

csv('./data/declarations/declarations.csv?' + randomPar, (err, declarations) => {
csv('./data/declarations/deposits.csv?' + randomPar, (err, deposits) => {
csv('./data/declarations/directorships_or_associations.csv?' + randomPar, (err, directorshipsOrAssociations) => {
csv('./data/declarations/employment.csv?' + randomPar, (err, employment) => {
csv('./data/declarations/investments.csv?' + randomPar, (err, investments) => {
csv('./data/declarations/other_financial_interests.csv?' + randomPar, (err, otherFinancialInterests) => {
csv('./data/declarations/professions.csv?' + randomPar, (err, professions) => {
csv('./data/declarations/properties.csv?' + randomPar, (err, properties) => {
  //Parse data
  _.each(declarations, function (d) {
    d.fullname = d.Name + ' ' + d.Surname;
    d.Political_Party = d.Political_Party.trim();
    //Get deposits and calculate tot
    d.deposits = _.filter(deposits, function (d1) { return d1.FIMP == d.FIMP; });
    d.depositsTot = 0;
    _.each(d.deposits, function (d1) {
      d.depositsTot += cleanAmount(d1.Amount_EUR);
    });
    //Get other declarations elements
    d.directorshipsOrAssociations = _.filter(directorshipsOrAssociations, function (d1) { return d1.FIMP == d.FIMP; });
    d.employment = _.filter(employment, function (d1) { return d1.FIMP == d.FIMP; });
    d.investments = _.filter(investments, function (d1) { return d1.FIMP == d.FIMP; });
    d.otherFinancialInterests = _.filter(otherFinancialInterests, function (d1) { return d1.FIMP == d.FIMP; });
    d.professions = _.filter(professions, function (d1) { return d1.FIMP == d.FIMP; });
    d.properties = _.filter(properties, function (d1) { return d1.FIMP == d.FIMP; });
    d.professionStrings = [];
    _.each(d.professions, function (p) {
      d.professionStrings.push(p.Profession);
    });
    d.propertiesRange = getPropertiesRange(d.properties.length);
    d.directorshipsOrAssociationsRange = getPropertiesRange(d.directorshipsOrAssociations.length);
    //console.log(d);
  });

  //Set dc main vars
  var ndx = crossfilter(declarations);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = "" + d.fullname + " " + d.Political_Party;
      return entryString.toLowerCase();
  });

  //CHART 1 - TOP DEPOSITS
  var createTopDepositsChart = function() {
    var chart = charts.topDeposits.chart;
    var dimension = ndx.dimension(function (d) {
      return d.fullname;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
      return d.depositsTot;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topDeposits.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(520)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': €' + addcommas(d.value.toFixed(2));
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return '€' + addcommas(d); });
    chart.render();
  }

  //CHART 2 - DEPOSITS BY PARTY
  var createPartyDepositsChart = function() {
    var chart = charts.partyDeposits.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.Political_Party == "") {
        return "N/A";
      }
      return d.Political_Party;
    });
    var group = dimension.group().reduceSum(function (d) { 
      return d.depositsTot;
    });
    var sizes = calcPieSize(charts.partyDeposits.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .cap(7)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(15).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': €' + addcommas(d.value.toFixed(2));
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "Others") {
          return "#ddd";
        }
        return vuedata.colors.parties[d.key];
      })
      .group(group);

    chart.render();
  }

  //CHART 3 - TOP PROFESSIONS
  var createProfessionsChart = function() {
    var chart = charts.professions.chart;
    var dimension = ndx.dimension(function (d) {
      return d.professionStrings;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
      return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.professions.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(520)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value + ' MPs';
      })
      .elasticX(true)
      .xAxis().ticks(3).tickFormat(function(d) { return '' + addcommas(d); });
    chart.render();
  }

  //CHART 4 - INVESTMENTS
  var createInvestmentsChart = function() {
    var chart = charts.investments.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.investments && d.investments.length > 0) {
        return "Yes";
      }
      return "No";
    });
    var group = dimension.group().reduceSum(function (d) { 
      return 1;
    });
    var sizes = calcPieSize(charts.investments.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .cap(7)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(15).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "No") {
          return "#ddd";
        }
        return vuedata.colors.default;
      })
      .group(group);
    chart.render();
  }

  //CHART 5 - PROPERTIES
  var createPropertiesChart = function() {
    var chart = charts.properties.chart;
    var dimension = ndx.dimension(function (d) {
      return d.propertiesRange;
    });
    var group = dimension.group().reduceSum(function (d) { 
      return 1;
    });
    var sizes = calcPieSize(charts.properties.divId);
    var order = ["0","1","2","3 - 5","6 - 9","10+"];
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .ordering(function(d) { return order.indexOf(d.key)})
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(15).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "0") {
          return "#ddd";
        }
        return vuedata.colors.rangeProperties[d.key];
      })
      .group(group);

    chart.render();
  }

  //CHART 6 - PROPERTIES
  var createAssociationsChart = function() {
    var chart = charts.associations.chart;
    var dimension = ndx.dimension(function (d) {
      return d.directorshipsOrAssociationsRange.toString();
      //return d.propertiesRange;
    });
    var group = dimension.group().reduceSum(function (d) { 
      return 1;
    });
    var sizes = calcPieSize(charts.associations.divId);
    var order = ["0","1","2","3 - 5","6 - 9","10+"];
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .ordering(function(d) { return order.indexOf(d.key)})
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(15).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "0") {
          return "#ddd";
        }
        return vuedata.colors.rangeProperties[d.key];
      })
      .group(group);

    chart.render();
  }

  //CHART 7 - OTHER INTERESTS
  var createOtherInterestsChart = function() {
    var chart = charts.otherInterests.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.otherFinancialInterests && d.otherFinancialInterests.length > 0) {
        return "Yes";
      }
      return "No";
    });
    var group = dimension.group().reduceSum(function (d) { 
      return 1;
    });
    var sizes = calcPieSize(charts.otherInterests.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .cap(7)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(15).autoItemWidth(true).horizontal(true).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .colorCalculator(function(d, i) {
        if(d.key == "No") {
          return "#ddd";
        }
        return vuedata.colors.default;
      })
      .group(group);
    chart.render();
  }

  //TABLE
  var createTable = function() {
    var count=0;
    charts.table.chart = $("#dc-data-table").dataTable({
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": 0,   
          data: function ( row, type, val, meta ) {
            return count;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.fullname;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.Political_Party;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          //"class": "dt-body-right",
          "data": function(d) {
            return addcommas(Math.round(d.depositsTot));
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "type": "date-eu",
          "defaultContent":"N/A",
          //"class": "dt-body-right",
          "data": function(d) {
            return d.Declaration_Date;
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 1, "asc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.table.chart;
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.selectedEl = data;
      console.log(vuedata.selectedEl);
      $('#detailsModal').modal();
    });
  }
  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension.top(Infinity);
      charts.table.chart.fnClearTable();
      charts.table.chart.fnAddData(alldata);
      charts.table.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
  var typingTimer;
  var doneTypingInterval = 1000;
  var $input = $("#search-input");
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  function doneTyping () {
    var s = $input.val().toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Set word for wordcloud
  var setword = function(wd) {
    //console.log(charts.subject.chart);
    $("#search-input").val(wd);
    var s = wd.toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
        console.log ("redraw");
          dc.redrawAll();
      }, 250);
    }
  }

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    vuedata.selectedMandate = 'all';
    searchDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })


  
  //Render charts
  createTopDepositsChart();
  createPartyDepositsChart();
  createProfessionsChart();
  createInvestmentsChart();
  createPropertiesChart();
  createAssociationsChart();
  createOtherInterestsChart();
  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all);
  counter.render();
  counter.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };

});
});
});
});
});
});
});
});
