'use strict';

var _ = require('underscore');

var columnHelpers = require('./column-helpers');
var tables = require('./tables');
var helpers = require('./helpers');
var decoders = require('./decoders');


var dateColumn = columnHelpers.formattedColumn(helpers.datetime, {orderSequence: ['desc', 'asc']});
var currencyColumn = columnHelpers.formattedColumn(helpers.currency, {orderSequence: ['desc', 'asc']});
var barCurrencyColumn = columnHelpers.barColumn(helpers.currency);

var supportOpposeColumn = {
  data: 'support_oppose_indicator',
  render: function(data, type, row, meta) {
    return decoders.supportOppose[data] || 'Unknown';
  }
};

var amendmentIndicatorColumn = {
  data: 'amendment_indicator',
  className: 'hide-panel min-desktop',
  render: function(data) {
    return decoders.amendments[data] || '';
  },
};

var modalTriggerColumn = {
  className: 'all column--trigger',
  orderable: false,
  render: function(data, type, row, meta) {
    return tables.MODAL_TRIGGER_HTML;
  }
};

var candidateColumn = columnHelpers.formattedColumn(function(data, type, row) {
  if (row) {
    return columnHelpers.buildEntityLink(row.candidate_name, helpers.buildAppUrl(['candidate', row.candidate_id]), 'candidate');
  } else {
    return '';
  }
});

var committeeColumn = columnHelpers.formattedColumn(function(data, type, row) {
  if (row) {
    return columnHelpers.buildEntityLink(row.committee_name, helpers.buildAppUrl(['committee', row.committee_id]), 'committee');
  } else {
    return '';
  }
});

var renderCandidateColumn = function(data, type, row, meta) {
  if (data) {
    return columnHelpers.buildEntityLink(
      data,
      helpers.buildAppUrl(['candidate', row.candidate_id]),
      'candidate');
  } else {
    return '';
  }
};

var renderCommitteeColumn = function(data, type, row, meta) {
  if (data) {
    return columnHelpers.buildEntityLink(
      data,
      helpers.buildAppUrl(['committee', row.committee_id]),
      'committee');
  } else {
    return '';
  }
};

var candidates = [
  {data: 'name', className: 'all column--large', render: renderCandidateColumn},
  {data: 'office_full', className: 'min-tablet hide-panel-tablet column--med'},
  {
    data: 'election_years',
    className: 'min-tablet hide-panel column--med',
    render: function(data, type, row, meta) {
      return tables.yearRange(_.first(data), _.last(data));
    }
  },
  {data: 'party_full', className: 'min-tablet column--med hide-panel'},
  {data: 'state', className: 'min-desktop hide-panel column--state'},
  {data: 'district', className: 'min-desktop hide-panel column--small'},
  modalTriggerColumn
];

var candidateOffice = {
  name:   {data: 'name', className: 'all column--xl', render: renderCandidateColumn},
  party: {data: 'party_full', className: 'min-desktop'},
  state: {data: 'state', className: 'min-tablet column--state hide-panel'},
  district: {data: 'district', className: 'min-desktop column--small hide-panel'},
  receipts: currencyColumn({data: 'receipts', className: 'min-tablet hide-panel column--number'}),
  disbursements: currencyColumn({data: 'disbursements', className: 'min-tablet hide-panel column--number'}),
  trigger: modalTriggerColumn
};

var committees = [
  {
    data: 'name',
    className: 'all column--xl',
    render: function(data, type, row, meta) {
      if (data) {
        return columnHelpers.buildEntityLink(
          data,
          helpers.buildAppUrl(['committee', row.committee_id], tables.getCycle(row.cycles, meta)),
          'committee');
      } else {
        return '';
      }
    }
  },
  {data: 'treasurer_name', className: 'min-desktop hide-panel'},
  {data: 'committee_type_full', className: 'min-tablet hide-panel'},
  {data: 'designation_full', className: 'min-tablet hide-panel'},
  dateColumn({data: 'first_file_date', className: 'min-tablet hide-panel column--med' }),
  modalTriggerColumn
];

var communicationCosts = [
  {
    data: 'committee_name',
    orderable: false,
    className: 'all column--xl',
    render: renderCommitteeColumn,
  },
  _.extend({}, supportOpposeColumn, {className: 'min-tablet hide-panel-tablet column--med'}),
  {
    data: 'candidate_name',
    orderable: false,
    className: 'min-tablet hide-panel-tablet column--large',
    render: renderCandidateColumn
  },
  currencyColumn({data: 'transaction_amount', className: 'min-tablet hide-panel column--med column--number'}),
  dateColumn({data: 'transaction_date', className: 'min-tablet hide-panel column--med'}),
  modalTriggerColumn
];

var disbursements = [
  {
    data: 'committee',
    orderable: false,
    className: 'all column--large',
    render: function(data, type, row, meta) {
      if (data) {
        return columnHelpers.buildEntityLink(
          data.name,
          helpers.buildAppUrl(['committee', data.committee_id]),
          'committee'
        );
      } else {
        return '';
      }
    }
  },
  {
    data: 'recipient_name',
    orderable: false,
    className: 'all column--large',
    render: function(data, type, row, meta) {
      var committee = row.recipient_committee;
      if (committee) {
        return columnHelpers.buildEntityLink(
          committee.name,
          helpers.buildAppUrl(['committee', committee.committee_id]),
          'committee'
        );
      } else {
        return data;
      }
    }
  },
  {data: 'recipient_state', orderable: false, className: 'min-desktop column--state hide-panel'},
  {data: 'disbursement_description', className: 'min-desktop hide-panel', orderable: false},
  dateColumn({data: 'disbursement_date', className: 'min-tablet hide-panel column--med'}),
  currencyColumn({data: 'disbursement_amount', className: 'min-tablet hide-panel column--number column--med'}),
  modalTriggerColumn
];

var electioneeringCommunications = [
  {
    data: 'committee_name',
    orderable: false,
    className: 'all column--xl',
    render: renderCommitteeColumn
  },
  {
    data: 'candidate_name',
    orderable: false,
    className: 'min-desktop hide-panel-tablet',
    render: renderCandidateColumn
  },
  {
    data: 'number_of_candidates',
    className: 'min-desktop hide-panel column--small column--number',
  },
  currencyColumn({data: 'calculated_candidate_share', className: 'min-desktop hide-panel column--number column--med'}),
  dateColumn({data: 'disbursement_date', className: 'min-tablet hide-panel column--med'}),
  currencyColumn({data: 'disbursement_amount', className: 'min-tablet hide-panel column--number column--med'}),
  modalTriggerColumn
];

var filings = {
  filer_name: {
    data: 'committee_id',
    className: 'all column--large',
    orderable: false,
    render: function(data, type, row, meta) {
      var cycle = tables.getCycle([row.cycle], meta);
      if (row.candidate_name) {
        return columnHelpers.buildEntityLink(
          row.candidate_name,
          helpers.buildAppUrl(['candidate', row.candidate_id], cycle),
          'candidate'
        );
      } else if (row.committee_name) {
        return columnHelpers.buildEntityLink(
          row.committee_name,
          helpers.buildAppUrl(['committee', row.committee_id], cycle),
          'committee'
        );
      } else {
        return '';
      }
    },
  },
  pdf_url: columnHelpers.urlColumn('pdf_url', {
    data: 'document_description',
    className: 'all column--medium',
    orderable: false
  }),
  amendment_indicator: amendmentIndicatorColumn,
  receipt_date: dateColumn({data: 'receipt_date', className: 'min-tablet hide-panel column--med'}),
  coverage_end_date: dateColumn({data: 'coverage_end_date', className: 'min-tablet hide-panel column--med', orderable: false}),
  total_receipts: currencyColumn({data: 'total_receipts', className: 'min-desktop hide-panel column--number'}),
  total_disbursements: currencyColumn({data: 'total_disbursements', className: 'min-desktop hide-panel column--number'}),
  total_independent_expenditures: currencyColumn({data: 'total_independent_expenditures', className: 'min-desktop hide-panel column--number'}),
  modal_trigger: {
    className: 'all column--trigger',
    orderable: false,
    render: function(data, type, row) {
      if (row.form_type && row.form_type.match(/^F3[XP]?$/)) {
        return tables.MODAL_TRIGGER_HTML;
      } else {
        return '';
      }
    }
  }
};

var independentExpenditures = [
  {
    data: 'committee',
    orderable: false,
    className: 'all column--large',
    render: function(data, type, row, meta) {
      if (data) {
        return columnHelpers.buildEntityLink(
          data.name,
          helpers.buildAppUrl(['committee', data.committee_id]),
          'committee'
        );
      } else {
        return '';
      }
    }
  },
  _.extend({}, supportOpposeColumn, {className: 'min-tablet hide-panel-tablet column--med'}),
  {
    data: 'candidate_name',
    orderable: false,
    className: 'min-tablet hide-panel-tablet column--large',
    render: function(data, type, row, meta) {
      if (row.candidate_id) {
        return columnHelpers.buildEntityLink(
          data,
          helpers.buildAppUrl(['candidate', row.candidate_id], tables.getCycle(row, meta)),
          'candidate'
        );
      } else {
        return row.candidate_name;
      }
    }
  },
  columnHelpers.urlColumn('pdf_url', {data: 'expenditure_description', className: 'min-desktop hide-panel', orderable: false}),
  dateColumn({data: 'expenditure_date', className: 'min-tablet hide-panel column--med'}),
  currencyColumn({data: 'expenditure_amount', className: 'min-tablet hide-panel column--number column--med'}),
  modalTriggerColumn
];

var individualContributions = [
  {
    data: 'committee',
    orderable: false,
    className: 'all column--xl',
    render: function(data, type, row, meta) {
      if (data) {
        return columnHelpers.buildEntityLink(
          data.name,
          helpers.buildAppUrl(['committee', data.committee_id]),
          'committee'
        );
      } else {
        return '';
      }
    }
  },
  {
    data: 'contributor',
    orderable: false,
    className: 'all hide-panel-tablet column--large',
    render: function(data, type, row, meta) {
      if (data && row.receipt_type !== helpers.globals.EARMARKED_CODE) {
        return columnHelpers.buildEntityLink(
          data.name,
          helpers.buildAppUrl(['committee', data.committee_id]),
          'committee'
        );
      } else {
        return row.contributor_name;
      }
    }
  },
  {data: 'contributor_state', orderable: false, className: 'min-desktop hide-panel column--state '},
  {data: 'contributor_employer', orderable: false, className: 'min-desktop hide-panel'},
  dateColumn({data: 'contribution_receipt_date', className: 'min-tablet hide-panel column--med'}),
  currencyColumn({data: 'contribution_receipt_amount', className: 'min-tablet hide-panel column--number column--med'}),
  modalTriggerColumn
];

var receipts = [
  {
    data: 'committee',
    orderable: false,
    className: 'all column--xl',
    render: function(data, type, row, meta) {
      if (data) {
        return columnHelpers.buildEntityLink(
          data.name,
          helpers.buildAppUrl(['committee', data.committee_id]),
          'committee'
        );
      } else {
        return '';
      }
    }
  },
  {
    data: 'contributor',
    orderable: false,
    className: 'all column--xl',
    render: function(data, type, row, meta) {
      if (data && row.receipt_type !== helpers.globals.EARMARKED_CODE) {
        return columnHelpers.buildEntityLink(
          data.name,
          helpers.buildAppUrl(['committee', data.committee_id]),
          'committee'
        );
      } else {
        return row.contributor_name;
      }
    }
  },
  {data: 'contributor_state', orderable: false, className: 'min-desktop hide-panel column--state'},
  dateColumn({data: 'contribution_receipt_date', className: 'min-tablet hide-panel column--med'}),
  currencyColumn({data: 'contribution_receipt_amount', className: 'min-tablet hide-panel column--med column--number'}),
  modalTriggerColumn
];


module.exports = {
  candidateColumn: candidateColumn,
  committeeColumn: committeeColumn,
  dateColumn: dateColumn,
  currencyColumn: currencyColumn,
  barCurrencyColumn: barCurrencyColumn,
  supportOpposeColumn: supportOpposeColumn,
  amendmentIndicatorColumn: amendmentIndicatorColumn,
  candidates: candidates,
  candidateOffice: candidateOffice,
  committees: committees,
  communicationCosts: communicationCosts,
  disbursements: disbursements,
  electioneeringCommunications: electioneeringCommunications,
  independentExpenditures: independentExpenditures,
  individualContributions: individualContributions,
  filings: filings,
  receipts: receipts
};
