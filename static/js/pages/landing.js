'use strict';

/* global require, ga */

var $ = require('jquery');

var GroupedBarChart = require('../modules/bar-charts').GroupedBarChart;
var TopList = require('../modules/top-list').TopList;
var ReactionBox = require('../modules/reaction-box').ReactionBox;
var helpers = require('../modules/helpers');

var raisingData = [
  {
    'period': 'Jan 1 - June 30, 2015',
    'status': 'complete',
    'candidates': 305427675.73,
    'parties': 192007717.64,
    'pacs': 118403743.85,
    'other': 259698.70,
  },
  {
    'period': 'Jul 1 - Dec 31, 2015',
    'status': 'complete',
    'candidates': 529603187.6,
    'parties': 209606697.26,
    'pacs': 584266359.97,
    'other': 19512.72
  },
  {
    'period': 'Jan 1 - Mar 31, 2016',
    'status': 'complete',
    'candidates': 432197566.98,
    'parties': 145682466.69,
    'pacs': 590005249.82,
    'other': 401526.89
  },
  {
    'period': 'Apr 1 - June 30, 2016',
    'status': 'in-progress',
    'candidates': 104196285.25,
    'parties': 53314363.39,
    'pacs': 359289.27,
    'other': 0
  },
  {
    'period': 'Jul 1 - Sep 30, 2016',
    'status': 'not-started',
    'candidates': 0,
    'parties': 0,
    'pacs': 0,
    'other': 0
  },
  {
    'period': 'Oct 1 - Dec 31, 2016',
    'status': 'not-started',
    'candidates': 0,
    'parties': 0,
    'pacs': 0,
    'other': 0
  }
];

var spendingData = [
  {
    'period': 'Jan 1 - June 30, 2015',
    'status': 'complete',
    'candidates': 144725733.28,
    'parties': 192007717.64,
    'pacs': 118403743.85,
    'other': 259698.70
  },
  {
    'period': 'Jul 1 - Dec 31, 2015',
    'status': 'complete',
    'candidates': 414159558.73,
    'parties': 173218529.69,
    'pacs': 259718445.04,
    'other': 5482220.81
  },
  {
    'period': 'Jan 1 - Mar 31, 2016',
    'status': 'complete',
    'candidates': 476623668.08,
    'parties': 102074951.47,
    'pacs': 307355510.41,
    'other': 23331535.6
  },
  {
    'period': 'Apr 1 - June 30, 2016',
    'status': 'in-progress',
    'candidates': 127799212.55,
    'parties': 35904262.78,
    'pacs': 263191.92,
    'other': 242687
  },
  {
    'period': 'Jul 1 - Sep 30, 2016',
    'status': 'not-started',
    'candidates': 0,
    'parties': 0,
    'pacs': 0,
  },
  {
    'period': 'Oct 1 - Dec 31, 2016',
    'status': 'not-started',
    'candidates': 0,
    'parties': 0,
    'pacs': 0,
  }
];

function Overview(selector, data, index) {
  this.$element = $(selector);
  this.data = data;
  this.index = index;

  this.totals = this.$element.find('.js-total');
  this.reactionBox = this.$element.find('.js-reaction-box');

  helpers.zeroPad(selector + ' .js-totals', '.overview__total-number', '.figure__decimals');

  if (helpers.isLargeScreen()) {
    new GroupedBarChart(selector + ' .js-chart', this.data, this.index);
  }
}

new Overview('.js-raised-overview', raisingData, 1);
new Overview('.js-spent-overview', spendingData, 2);

$('.js-reaction-box').each(function() {
  new ReactionBox(this);
});

$('.js-top-list').each(function() {
  var dataType = $(this).data('type');
  new TopList(this, dataType);
});

$('.js-ga-event').each(function() {
  var eventName = $(this).data('ga-event');
  $(this).on('click', function() {
    if (helpers.trackerExists()) {
      var gaEventData = {
        hitType: 'event',
        eventCategory: eventName,
        eventValue: 1
      };
      ga('send', gaEventData);
    }
  });
});
