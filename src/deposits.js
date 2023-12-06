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
  page: 'deposits',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  selectedMandate: 'all',
  selectedYear: 'all',
  charts: {
    type: {
      title: 'Deposits/Loans',
      info: 'Transaction type by amount'
    },
    years: {
      title: 'Deposits/Loans by year',
      info: 'Deposits/loans absolute amount by year'
    },
    partyDeposits: {
      title: 'Deposits/loans amount by party',
      info: 'Deposits/loans absolute amount by party'
    },
    partyDepositsYears: {
      title: 'Deposits by party',
      info: 'Deposits by party per year'
    },
    partyLoansYears: {
      title: 'Loans by party',
      info: 'Loans by party per year'
    },
    topDeposits: {
      title: 'Top 10 MPs by deposits',
      info: 'Top 10 MPs by deposits amount'
    },
    topLoans: {
      title: 'Top 10 MPs by loans',
      info: 'Top 10 MPs by loans amount'
    },
    banks: {
      title: 'Top 10 banks by deposits/loans',
      info: 'Top 10 banks by deposits/loans'
    },
    table: {
      chart: null,
      type: 'table',
      title: 'Deposits/Loans',
      info: ''
    }
  },
  selectedEl: {"Name": ""},
  parties: [],
  years: ["2017","2018","2019","2020","2021","2022"],
  colors: {
    default: "#608a7d",
    defaultPurple: "#7e003f",
    range: ["#62aad9", "#3b95d0", "#1a6da3", "#085c9c", "#e3b419", "#e39219", "#de7010"],
    colorSchemeCloud: ["#62aad9", "#3b95d0", "#b7bebf", "#1a6da3", "#e3b419", "#e39219", "#de7010"],
    years: ["#608a7d", "#7e003f"],
    partiesOrdinal: [],
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
    //Add commas
    addcommas: function(x) {
      if(parseInt(x)){
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return x;
    },
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

//Get URL parameters
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var urlYear = getParameterByName('y');
if(urlYear && vuedata.years.indexOf(urlYear) > -1) {
  vuedata.selectedYear = urlYear;
} else {
  vuedata.selectedYear = 'all';
}

//Charts
if(vuedata.selectedYear == 'all') {
  var charts = {
    years: {
      chart: dc.barChart("#years_chart"),
      type: 'bar',
      divId: 'years_chart'
    },
    partyDepositsYears: {
      chart: dc.barChart("#partydepositsyears_chart"),
      type: 'bar',
      divId: 'partydepositsyears_chart'
    },
    partyLoansYears: {
      chart: dc.barChart("#partyloansyears_chart"),
      type: 'bar',
      divId: 'partyloansyears_chart'
    },
    table: {
      chart: null,
      type: 'table',
      divId: 'dc-data-table'
    }
  }
} else {
  var charts = {
    type: {
      chart: dc.pieChart("#type_chart"),
      type: 'pie',
      divId: 'type_chart'
    },
    partyDeposits: {
      chart: dc.pieChart("#partydeposits_chart"),
      type: 'pie',
      divId: 'partydeposits_chart'
    },
    topDeposits: {
      chart: dc.rowChart("#topdeposits_chart"),
      type: 'row',
      divId: 'topdeposits_chart'
    },
    topLoans: {
      chart: dc.rowChart("#toploans_chart"),
      type: 'row',
      divId: 'toploans_chart'
    },
    /*
    banks: {
      chart: dc.rowChart("#banks_chart"),
      type: 'row',
      divId: 'banks_chart'
    },
    */
    table: {
      chart: null,
      type: 'table',
      divId: 'dc-data-table'
    }
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
    if(date.indexOf("(") > -1){
      var dateStr = date.split(" ")[0];
      _.each(dateStr, function (w) {
          if(w.includes("/")) {
            date = w;
          }
      });
    }
      //console.log(date);
      return dmy(date);
  },
  "date-eu-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "amt-custom-pre": function (amt) {
    amt = amt.toString().replace(',','');
    if(isNaN(amt)) {
      amt = 0;
    }
    return parseFloat(amt);
  },
  "amt-custom-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "amt-custom-desc": function ( a, b ) {
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

//Load data and generate charts
//Generate random parameter for dynamic dataset loading (to avoid caching)

var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

csv('./data/deposits/mps.csv?' + randomPar, (err, mps) => {
json('./data/deposits/deposits.json?' + randomPar, (err, deposits) => {
  //Filter data based on selected year
  deposits = _.filter(deposits, function (x) { return x.Amount_EUR !== 'N/A'; });
  if(vuedata.selectedYear !== 'all') {
    deposits = _.filter(deposits, function (x) { return x.Year == vuedata.selectedYear; });
  }
  //Parse data
  _.each(deposits, function (d) {
    //Get deposits and calculate tot
    d.mp = _.find(mps, function (d1) { return d1.FIMP == d.FIMP; });
    if(!d.mp) {
      console.log('MP missing ' + d.FIMP);
    }
    d.mpFullname = d.mp.Name.trim() + ' ' + d.mp.Surname.trim();
    d.mpParty = d.mp.Party.trim();
    if(vuedata.parties.indexOf(d.mpParty) == -1) {
      vuedata.parties.push(d.mpParty);
    }
    if(vuedata.years.indexOf(d.Year) == -1) {
      vuedata.years.push(d.Year);
    }
    //Clean amounts
    d.cleanAmountValue = parseFloat(d.Amount_EUR);
    if(isNaN(d.cleanAmountValue)) {
      d.cleanAmountValue = 0;
    }
    d.type = 'Other';
    if(d.cleanAmountValue > 0) {
      d.type = 'Deposits';
    } else if(d.cleanAmountValue < 0) {
      d.type = 'Loans';
    }
    d.absoluteValue = Math.abs(d.cleanAmountValue);
  });
  console.log(vuedata.parties);
  _.each(vuedata.parties, function (p) {
    vuedata.colors.partiesOrdinal.push(vuedata.colors.parties[p]);
  });

  //Set dc main vars
  var ndx = crossfilter(deposits);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = "" + d.Description + " " + d.mpFullname + " " + d.mpParty;
      return entryString.toLowerCase();
  });

  //CHART 1 - YEARS
  var createYearsChart = function() {
    var chart = charts.years.chart;
    var dimension = ndx.dimension(function (d) {
        return d.Year;
    });
    var group = dimension.group().reduceSum(function (d) {
        if(d.type == 'Deposits'){
          return d.absoluteValue;
        }
        return 0;
    });
    var group2 = dimension.group().reduceSum(function (d) {
      if(d.type == 'Loans'){
        return d.absoluteValue;
      }
      return 0;
    });
    var width = recalcWidth(charts.years.divId);
    chart
      .width(width)
      .height(360)
      .group(group)
      .stack(group2)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 60})
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .gap(20)
      .elasticY(true)
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': €' + addcommas(d.value.toFixed(2));
      })
      .ordinalColors(vuedata.colors.years);
    chart.render();
  }

  //CHART 2 - PARTY DEPOSITS BY YEARS
  var createPartyDepositsYearsChart = function() {
    var chart = charts.partyDepositsYears.chart;
    var dimension = ndx.dimension(function (d) {
        return d.Year;
    });
    var group = dimension.group().reduceSum(function (d) {
        if(d.type == 'Deposits' && d.mpParty == vuedata.parties[0]){
          return d.absoluteValue;
        }
        return 0;
    });
    var width = recalcWidth(charts.partyDepositsYears.divId);
    chart
      .width(width)
      .height(360)
      .group(group)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 60})
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .gap(20)
      .elasticY(true)
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': €' + addcommas(d.value.toFixed(2));
      })
      .ordinalColors(vuedata.colors.partiesOrdinal);

    _.each(vuedata.parties, function (p,i) {
      if(i > 0) {
        chart.stack(
          dimension.group().reduceSum(function (d) {
            if(d.type == 'Deposits' && d.mpParty == p){
              return d.absoluteValue;
            }
            return 0;
          })
        );
      }
    });
    chart.render();
  }

  //CHART 3 - PARTY LOANS BY YEARS
  var createPartyLoansYearsChart = function() {
    var chart = charts.partyLoansYears.chart;
    var dimension = ndx.dimension(function (d) {
        return d.Year;
    });
    var group = dimension.group().reduceSum(function (d) {
        if(d.type == 'Loans' && d.mpParty == vuedata.parties[0]){
          return d.absoluteValue;
        }
        return 0;
    });
    var width = recalcWidth(charts.partyLoansYears.divId);
    chart
      .width(width)
      .height(360)
      .group(group)
      .dimension(dimension)
      .on("preRender",(function(chart,filter){
      }))
      .margins({top: 0, right: 10, bottom: 20, left: 60})
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .gap(20)
      .elasticY(true)
      .title(function(d){
        var thisKey = d.key;
        return thisKey + ': €' + addcommas(d.value.toFixed(2));
      })
      .ordinalColors(vuedata.colors.partiesOrdinal);

    _.each(vuedata.parties, function (p,i) {
      if(i > 0) {
        chart.stack(
          dimension.group().reduceSum(function (d) {
            if(d.type == 'Loans' && d.mpParty == p){
              return d.absoluteValue;
            }
            return 0;
          })
        );
      }
    });
    chart.render();
  }

  //CHART 1B - DEPOSIT TYPE
  var createTypeChart = function() {
    var chart = charts.type.chart;
    var dimension = ndx.dimension(function (d) {
      console.log(d);
      return d.type;
      /*
      if(d.type !== 'Other') {
        return d.type;
      }
      */
    });
    var group = dimension.group().reduceSum(function (d) { 
      return d.absoluteValue;
    });
    var sizes = calcPieSize(charts.type.divId);
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
        if(d.key == "Other") {
          return "#ddd";
        }
        if(d.key == "Loans") {
          return vuedata.colors.defaultPurple;
        }
        return vuedata.colors.default;
      })
      .group(group);

    chart.render();
  }

  //CHART 2B - DEPOSITS BY PARTY
  var createPartyDepositsChart = function() {
    var chart = charts.partyDeposits.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.mpParty == "") {
        return "N/A";
      }
      return d.mpParty;
    });
    var group = dimension.group().reduceSum(function (d) { 
      return d.absoluteValue;
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

  //CHART 3B - TOP DEPOSITS
  var createTopDepositsChart = function() {
    var chart = charts.topDeposits.chart;
    var dimension = ndx.dimension(function (d) {
      return d.mpFullname;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
      //return d.absoluteValue;
      if(d.cleanAmountValue > 0) {
        return d.cleanAmountValue;
      }
      return 0;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            if(d.value > 0.001) { 
              return true;
            }
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topDeposits.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(400)
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

  //CHART 4B - TOP LOANS
  var createTopLoansChart = function() {
    var chart = charts.topLoans.chart;
    var dimension = ndx.dimension(function (d) {
      return d.mpFullname;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
      if(d.cleanAmountValue < 0) {
        return d.absoluteValue;
      }
      return 0;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            if(d.value > 0.001) { 
              return true;
            }
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topLoans.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(400)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.defaultPurple;
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

  //CHART 5B - BANKS
  var createBanksChart = function() {
    var chart = charts.banks.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.Bank == "") {
        return "N/A";
      }
      return d.Bank;
    });
    var group = dimension.group().reduceSum(function (d) {
      return d.absoluteValue;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            if(d.value > 0.001) { 
              return true;
            }
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.banks.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(520)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return "#757573";
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
            return d.mpFullname;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.mpParty;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "type": "amt-custom",
          //"class": "dt-body-right",
          "data": function(d) {
            if(d.Amount_EUR == 'N/A') {
              return 'N/A';
            }
            return addcommas(Math.round(d.cleanAmountValue));
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "type": "number",
          "defaultContent":"N/A",
          //"class": "dt-body-right",
          "data": function(d) {
            return d.Year;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.Description;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
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
  if(vuedata.selectedYear == 'all') {
    createYearsChart();
    createPartyDepositsYearsChart();
    createPartyLoansYearsChart();
  } else {
    createTypeChart();
    createPartyDepositsChart();
    createTopDepositsChart();
    createTopLoansChart();
    //createBanksChart();
  }
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
