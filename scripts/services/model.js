'use strict';

angular.module('crunchinatorApp.models').service('Model', function($rootScope, $http) {

    var Model = function() {
        this.all = [];
        this.dimensions = [];
        this.format = d3.time.format('%x');
    };

    Model.prototype.fetch = function() {
        var self = this;
        if (!this.url) { throw new Error('You must specify a url on the class'); }
        msos.console.debug('app - crunchinatorApp.models - fetch -> called,\n     url: ' + self.url);
        return $http.get(self.url).then(
            function (response) { self.all = self.parse(response.data) || []; }
        );
    };

    Model.prototype.get = function(id) {
        return _.find(this.all, function(item) {
            return item.id === id;
        });
    };

    Model.prototype.parse = function(response) {
        return response;
    };

    Model.prototype.resetAllDimensions = function() {
        _.each(this.dimensions, function (dimension) {
            dimension.filterAll();
        });
    };

    Model.prototype.runFilters = function(filterData) {
        var self = this;
        this.filterData = filterData;
        _.each(this.dataSets, function(exclusions, setName) {
            self.resetAllDimensions();
            self.applyFilters(exclusions);
            self[setName] = self.byName.bottom(Infinity);
        });

        _.each(this.groups, function(group, groupName){
            self[groupName] = group.all();
        });
    };

    Model.prototype.applyFilters = function(exclusions) {
        var self = this;
        exclusions = exclusions || [];
        _.each(this.filters, function(filterFunction, filterName) {
            if(!_.contains(exclusions, filterName)) {
                filterFunction.bind(self)();
            }
        });
    };

    Model.prototype.count = function() {
        return this.all.length;
    };

    Model.prototype.companyPassesFilters = function(company, filterData){
        var self = this;
        var parse = this.format.parse;

        //byTotalFunding
        if (filterData.ranges.length !== 0) {
            if(!self.fallsWithinRange(company.total_funding, filterData.ranges)) { return false; }
        }

        //byMostRecentFundingRoundRaised
        if (filterData.mostRecentRoundRanges.length !== 0) {
            var most_recent_funding_amount = _.max(company.funding_rounds, function(round){
                return round.funded_on ? parse(round.funded_on) : 0;
            }).raised_amount;
            if(!self.fallsWithinRange(most_recent_funding_amount, filterData.mostRecentRoundRanges)) { return false; }
        }

        //byStatus
        if (filterData.statuses.length !== 0) {
            if(!_.contains(filterData.statuses, company.status)) { return false; }
        }

        //byState
        if (filterData.states.length !== 0) {
            if(!_.contains(filterData.states, company.state_code)) { return false; }
        }

        //byAcquiredOn
        if (filterData.acquiredDate.length !== 0) {
            if(!company.acquired_on){ return false; }
            if(!self.fallsWithinRange(parse(company.acquired_on), filterData.acquiredDate)) { return false; }
        }

        //byFoundedOn
        if (filterData.foundedDate.length !== 0) {
            if(!company.founded_on){ return false; }
            if(!self.fallsWithinRange(parse(company.founded_on), filterData.foundedDate)) { return false; }
        }

        //byIPOValue
        if (filterData.ipoValueRange.length !== 0) {
            if(!self.fallsWithinRange(company.ipo_valuation, filterData.ipoValueRange)) { return false; }
        }

        //byIPODate
        if (filterData.ipoDateRange.length !== 0) {
            if(!company.ipo_on) { return false; }
            if(!self.fallsWithinRange(parse(company.ipo_on), filterData.ipoDateRange)) { return false; }
        }

        //byAcquiredValue
        if (filterData.acquiredValueRange.length !== 0) {
            if(!self.fallsWithinRange(company.acquired_value, filterData.acquiredValueRange)) { return false; }
        }

        return true;
    };

    Model.prototype.roundPassesFilters = function(round, filterData) {
        var self = this;
        var parse = this.format.parse;

        //byAllFundingRoundsRaised
        if (filterData.roundRanges.length > 0) {
            if(!self.fallsWithinRange(round.raised_amount, filterData.roundRanges)) { return false; }
        }

        //byAllFundingRoundsCodes
        if(filterData.roundCodes.length > 0) {
            if(!_.include(filterData.roundCodes, round.round_code)) { return false; }
        }

        //byAllFundingRoundsDate
        if (filterData.fundingActivity.length !== 0) {
            var funded_on = round.funded_on ? parse(round.funded_on) : null;
            if(!self.fallsWithinRange(funded_on, filterData.fundingActivity)) { return false; }
        }

        return true;
    };

    Model.prototype.anyItemFallsWithinRange = function(items, range) {
        if(range.length === 0) { return true; }
        if(items.length === 0) { return false; }


        for(var i = 0; i < items.length; i++) {
            if(this.fallsWithinRange(items[i], range)) {
                return true;
            }
        }

        return false;
    };

    Model.prototype.fallsWithinRange = function(item, range) {
        return item >= range[0] && item <= range[1];
    };

    return new Model();
});
