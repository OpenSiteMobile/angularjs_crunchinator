"use strict";
angular.module("crunchinatorApp.models", []), angular.module("crunchinatorApp.directives", []), angular.module("crunchinatorApp.services", []), angular.module("crunchinatorApp.controllers", ["ui.state", "ui.bootstrap", "configuration", "crunchinatorApp.models", "crunchinatorApp.directives", "crunchinatorApp.services", "infinite-scroll"]).config(["$stateProvider", function(a) {
    a.state("crunchinator", {
        url: "/crunchinator",
        views: {
            main: {
                controller: "CrunchinatorCtrl",
                templateUrl: "views/main.tpl.html"
            },
            about: {
                controller: "AboutCtrl",
                templateUrl: "views/about.tpl.html"
            }
        },
        data: {
            pageTitle: "Crunchinator - A Cloudspace Project"
        }
    })
}]), angular.module("crunchinatorApp", ["ui.state", "ui.route", "crunchinatorApp.controllers"]).config(["$stateProvider", "$urlRouterProvider", function(a, b) {
    b.otherwise("/crunchinator")
}]).run(function() {}).controller("AppCtrl", ["$scope", "$location", "Browser", function(a, b, c) {
    a.isIE = c.isIE(), a.isMobile = c.isMobile.any(), a.shared_results = !!b.search().filters, a.$on("$stateChangeSuccess", function(b, c) {
        angular.isDefined(c.data.pageTitle) && (a.pageTitle = c.data.pageTitle)
    }), (a.isIE || a.isMobile) && angular.element("html, body").css({
        overflow: "visible"
    })
}]), angular.module("configuration", []).constant("ENV", "production").constant("API_VERSION", "v1.3.0").constant("BITLY_KEY", "98766bc61a09e3d4cd9c5d16dae3b2b604f97a98");
var exp_dist = function(a, b) {
        var c, d = (b - a) / 6;
        do {
            var e = Math.random(),
                f = -1 * Math.log(e) / 1;
            c = a + f * d
        } while (a >= c || c >= b);
        return c
    },
    exponential_distribution = function(a, b) {
        return Math.floor(exp_dist(a, b))
    },
    randomDate = function(a, b) {
        return new Date(a.getTime() + (1 - exp_dist(0, 1)) * (b.getTime() - a.getTime()))
    };
! function(a, b) {
    var c = a.injector(["configuration", "ng"]),
        d = c.get("ENV"),
        e = c.get("API_VERSION"),
        f = function(a) {
            var c = b.Company.companyName();
            a = a || 0;
            var d = ["alive", "deadpooled", "acquired", "IPOed"],
                e = b.definitions.us_state_abbr;
            return {
                id: a,
                name: c,
                permalink: c.toLowerCase(),
                category_id: 0,
                total_funding: exponential_distribution(1, 6e9),
                latitude: 1,
                longitude: 1,
                acquired_on: d3.time.format("%x")(randomDate(new Date(2006, 1, 1), new Date)),
                founded_on: d3.time.format("%x")(randomDate(new Date(1992, 1, 1), new Date)),
                investor_ids: [],
                most_recent_raised_amount: Math.floor(1e8 * Math.random()),
                status: d[exponential_distribution(0, d.length)],
                state_code: e[exponential_distribution(0, e.length)],
                ipo_on: d3.time.format("%x")(randomDate(new Date(1992, 1, 1), new Date)),
                ipo_valuation: exponential_distribution(3e6, 17e10),
                acquired_value: exponential_distribution(3e6, 17e10)
            }
        },
        g = function(a) {
            var c = Math.random() < .5 ? "company" : "person",
                d = "company" === c ? b.Company.companyName() : b.Name.findName();
            return a = a || 0, {
                id: a,
                name: d,
                investor_type: c,
                permalink: d.toLowerCase(),
                invested_company_ids: [],
                invested_category_ids: []
            }
        },
        h = function(a) {
            a = a || 0;
            var c = b.random.bs_noun();
            return {
                id: a,
                name: c,
                permalink: c.toLowerCase(),
                display_name: c,
                company_ids: [],
                investor_ids: []
            }
        },
        i = function(a) {
            return a = a || 0, {
                id: a,
                company_id: 0,
                round_code: "Unattributed",
                raised_amount: Math.floor(1e8 * Math.random()),
                funded_on: d3.time.format("%x")(randomDate(new Date(2e3, 1, 1), new Date)),
                investor_ids: []
            }
        },
        j = function(a, b) {
            for (var c = [], d = 0; a > d; d++) c.push(b(d));
            return c
        },
        k = function(a, b, c, d) {
            _.each(a, function(a) {
                var d = c[exponential_distribution(0, c.length)];
                a.category_id = d.id, d.company_ids.push(a.id), _(exponential_distribution(1, 10)).times(function() {
                    var c = b[exponential_distribution(0, b.length)];
                    a.investor_ids.push(c.id), d.investor_ids.push(c.id), c.invested_company_ids.push(a.id), c.invested_category_ids.push(a.category_id)
                })
            }), _.each(d, function(b) {
                var c = a[Math.floor(Math.random() * a.length)];
                b.investor_ids = c.investor_ids, b.company_id = c.id
            })
        },
        l = function() {
            var b = j(42, h),
                c = j(9987, g),
                d = j(16635, f),
                e = j(3e4, i);
            k(d, c, b, e), a.module("crunchinatorApp").config(["$provide", function(b) {
                b.decorator("$httpBackend", a.mock.e2e.$httpBackendDecorator)
            }]).run(["$httpBackend", function(a) {
                a.when("GET", "/companies.json").respond({
                    companies: d
                }), a.when("GET", "/categories.json").respond({
                    categories: b
                }), a.when("GET", "/investors.json").respond({
                    investors: c
                }), a.when("GET", "/funding_rounds.json").respond({
                    funding_rounds: e
                }), a.when("GET", /.*/).passThrough(), a.when("POST", /.*/).passThrough(), a.when("DELETE", /.*/).passThrough(), a.when("PUT", /.*/).passThrough()
            }])
        },
        m = "";
    switch (d) {
        case "development":
            l();
            break;
        case "staging":
            m = "http://staging.crunchinator.com/api/" + e;
            break;
        case "production":
            m = "http://crunchinator.com/api/" + e
    }
    a.module("crunchinatorApp.models").constant("API_BASE_URL", m)
}(angular, window.Faker), angular.module("crunchinatorApp.services").service("ToolBox", [function() {
    this.abbreviateNumber = function(a) {
        var b = a;
        if (a >= 1e3) {
            for (var c = ["", "K", "M", "B", "T"], d = Math.floor((("" + a).length - 1) / 3), e = "", f = 2; f >= 1; f--) {
                e = parseFloat((0 !== d ? a / Math.pow(1e3, d) : a).toPrecision(f));
                var g = (e + "").replace(/[^a-zA-Z 0-9]+/g, "");
                if (g.length <= 3) break
            }
            b = e + c[d]
        }
        return b
    }, this.labelfy = function(a) {
        return "$" + this.abbreviateNumber(a)
    }
}]), angular.module("crunchinatorApp.models").service("Model", ["$rootScope", "$http", function(a, b) {
    var c = function() {
        this.all = [], this.dimensions = [], this.format = d3.time.format("%x")
    };
    return c.prototype.fetch = function() {
        var a = this;
        if (!this.url) throw new Error("You must specify a url on the class");
        return b.get(a.url).success(function(b) {
            a.all = a.parse(b)
        })
    }, c.prototype.get = function(a) {
        return _.find(this.all, function(b) {
            return b.id === a
        })
    }, c.prototype.parse = function(a) {
        return a
    }, c.prototype.resetAllDimensions = function() {
        _.each(this.dimensions, function(a) {
            a.filterAll()
        })
    }, c.prototype.runFilters = function(a) {
        var b = this;
        this.filterData = a, _.each(this.dataSets, function(a, c) {
            b.resetAllDimensions(), b.applyFilters(a), b[c] = b.byName.bottom(1 / 0)
        }), _.each(this.groups, function(a, c) {
            b[c] = a.all()
        })
    }, c.prototype.applyFilters = function(a) {
        var b = this;
        a = a || [], _.each(this.filters, function(c, d) {
            _.contains(a, d) || c.bind(b)()
        })
    }, c.prototype.count = function() {
        return this.all.length
    }, c.prototype.companyPassesFilters = function(a, b) {
        var c = this,
            d = this.format.parse;
        if (0 !== b.ranges.length && !c.fallsWithinRange(a.total_funding, b.ranges)) return !1;
        if (0 !== b.mostRecentRoundRanges.length) {
            var e = _.max(a.funding_rounds, function(a) {
                return a.funded_on ? d(a.funded_on) : 0
            }).raised_amount;
            if (!c.fallsWithinRange(e, b.mostRecentRoundRanges)) return !1
        }
        if (0 !== b.statuses.length && !_.contains(b.statuses, a.status)) return !1;
        if (0 !== b.states.length && !_.contains(b.states, a.state_code)) return !1;
        if (0 !== b.acquiredDate.length) {
            if (!a.acquired_on) return !1;
            if (!c.fallsWithinRange(d(a.acquired_on), b.acquiredDate)) return !1
        }
        if (0 !== b.foundedDate.length) {
            if (!a.founded_on) return !1;
            if (!c.fallsWithinRange(d(a.founded_on), b.foundedDate)) return !1
        }
        if (0 !== b.ipoValueRange.length && !c.fallsWithinRange(a.ipo_valuation, b.ipoValueRange)) return !1;
        if (0 !== b.ipoDateRange.length) {
            if (!a.ipo_on) return !1;
            if (!c.fallsWithinRange(d(a.ipo_on), b.ipoDateRange)) return !1
        }
        return 0 === b.acquiredValueRange.length || c.fallsWithinRange(a.acquired_value, b.acquiredValueRange) ? !0 : !1
    }, c.prototype.roundPassesFilters = function(a, b) {
        var c = this,
            d = this.format.parse;
        if (b.roundRanges.length > 0 && !c.fallsWithinRange(a.raised_amount, b.roundRanges)) return !1;
        if (b.roundCodes.length > 0 && !_.include(b.roundCodes, a.round_code)) return !1;
        if (0 !== b.fundingActivity.length) {
            var e = a.funded_on ? d(a.funded_on) : null;
            if (!c.fallsWithinRange(e, b.fundingActivity)) return !1
        }
        return !0
    }, c.prototype.anyItemFallsWithinRange = function(a, b) {
        if (0 === b.length) return !0;
        if (0 === a.length) return !1;
        for (var c = 0; c < a.length; c++)
            if (this.fallsWithinRange(a[c], b)) return !0;
        return !1
    }, c.prototype.fallsWithinRange = function(a, b) {
        return a >= b[0] && a <= b[1]
    }, new c
}]), angular.module("crunchinatorApp.models").service("Company", ["Model", "API_BASE_URL", function(a, b) {
    var c = function() {
        this.url = b + "/companies.json"
    };
    return c.prototype = Object.create(a), c.prototype.constructor = c, c.prototype.parse = function(a) {
        return a.companies
    }, c.prototype.setupDimensions = function() {
        var a = crossfilter(this.all),
            b = this.format.parse;
        this.dimensions = {
            byId: a.dimension(function(a) {
                return a.id
            }),
            byCategory: a.dimension(function(a) {
                return a.category_id
            }),
            byInvestors: a.dimension(function(a) {
                return a.investor_ids
            }),
            byTotalFunding: a.dimension(function(a) {
                return a.total_funding
            }),
            byAcquiredOn: a.dimension(function(a) {
                return a.acquired_on ? b(a.acquired_on) : null
            }),
            byAcquiredValue: a.dimension(function(a) {
                return a.acquired_value
            }),
            byFundingRounds: a.dimension(function(a) {
                return a.funding_rounds || []
            }),
            byFoundedOn: a.dimension(function(a) {
                return a.founded_on ? b(a.founded_on) : null
            }),
            byMostRecentRaisedAmount: a.dimension(function(a) {
                return a.most_recent_raised_amount
            }),
            byStatuses: a.dimension(function(a) {
                return a.status
            }),
            byState: a.dimension(function(a) {
                return a.state_code
            }),
            byIPOValue: a.dimension(function(a) {
                return a.ipo_valuation ? a.ipo_valuation : null
            }),
            byIPODate: a.dimension(function(a) {
                return a.ipo_on ? b(a.ipo_on) : null
            })
        }, this.byName = a.dimension(function(a) {
            return a.name
        });
        var c = this.all,
            d = _.pluck(c, "total_funding"),
            e = _.pluck(c, "ipo_valuation"),
            f = _.pluck(c, "acquired_value");
        this.maxCompanyValue = parseInt(_.max(d, function(a) {
            return parseInt(a)
        })), this.maxRecentFundingValue = parseInt(_.max(c, function(a) {
            return parseInt(a.most_recent_raised_amount)
        }).most_recent_raised_amount), this.maxIPOValue = parseInt(_.max(e, function(a) {
            return parseInt(a)
        })), this.maxAcquiredValue = parseInt(_.max(f, function(a) {
            return parseInt(a)
        }))
    }, c.prototype.dataSets = {
        dataForCompaniesList: ["byId"],
        dataForCategoriesList: ["byCategory"],
        dataForInvestorsList: ["byInvestors"],
        dataForTotalFunding: ["byTotalFunding"],
        dataForLocationMap: ["byState"],
        dataForFundingRoundAreaChart: ["byFundingActivity"],
        dataForAcquiredOnAreaChart: ["byAcquiredDate"],
        dataForFoundedOnAreaChart: ["byFoundedDate"],
        dataForFundingPerRound: ["byFundingPerRound"],
        dataForMostRecentRaisedAmount: ["byMostRecentRaisedAmount"],
        dataForCompanyStatus: ["byStatus"],
        dataForIPOValue: ["byIPOValue"],
        dataForIPODate: ["byIPODate"],
        dataForAcquiredValue: ["byAcquiredValue"],
        dataForRoundCodesList: ["byFundingRoundCode"]
    }, c.prototype.filters = {
        byCategory: function() {
            var a = this.filterData.categoryIds;
            a.length > 0 && this.dimensions.byCategory.filter(function(b) {
                return a.indexOf(b) > -1
            })
        },
        byInvestors: function() {
            var a = this.filterData.investorIds;
            a.length > 0 && this.dimensions.byInvestors.filter(function(b) {
                return _.intersection(b, a).length > 0
            })
        },
        byId: function() {
            var a = this.filterData.companyIds;
            a.length > 0 && this.dimensions.byId.filter(function(b) {
                return a.indexOf(b) > -1
            })
        },
        byTotalFunding: function() {
            var a = this.filterData.ranges;
            if (a.length > 0) {
                var b = this;
                this.dimensions.byTotalFunding.filter(function(c) {
                    return b.fallsWithinRange(c, a)
                })
            }
        },
        byMostRecentRaisedAmount: function() {
            var a = this.filterData.mostRecentRoundRanges;
            if (a.length > 0) {
                var b = this;
                this.dimensions.byMostRecentRaisedAmount.filter(function(c) {
                    return b.fallsWithinRange(c, a)
                })
            }
        },
        byStatus: function() {
            var a = this.filterData.statuses;
            a.length > 0 && this.dimensions.byStatuses.filter(function(b) {
                return _.contains(a, b)
            })
        },
        byState: function() {
            var a = this.filterData.states;
            a.length > 0 && this.dimensions.byState.filter(function(b) {
                return _.contains(a, b)
            })
        },
        byAcquiredDate: function() {
            var a = this.filterData.acquiredDate;
            if (a.length > 0) {
                var b = this;
                this.dimensions.byAcquiredOn.filter(function(c) {
                    return c = c || new Date(1, 1, 1), b.fallsWithinRange(c, a)
                })
            }
        },
        byFoundedDate: function() {
            var a = this.filterData.foundedDate;
            if (a.length > 0) {
                var b = this;
                this.dimensions.byFoundedOn.filter(function(c) {
                    return c = c || new Date(1, 1, 1), b.fallsWithinRange(c, a)
                })
            }
        },
        byIPOValue: function() {
            var a = this.filterData.ipoValueRange;
            if (a.length > 0) {
                var b = this;
                this.dimensions.byIPOValue.filter(function(c) {
                    return b.fallsWithinRange(c, a)
                })
            }
        },
        byIPODate: function() {
            var a = this.filterData.ipoDateRange;
            if (a.length > 0) {
                var b = this;
                this.dimensions.byIPODate.filter(function(c) {
                    return c = c || new Date(1, 1, 1), b.fallsWithinRange(c, a)
                })
            }
        },
        byAcquiredValue: function() {
            var a = this.filterData.acquiredValueRange;
            if (a.length > 0) {
                var b = this;
                this.dimensions.byAcquiredValue.filter(function(c) {
                    return b.fallsWithinRange(c, a)
                })
            }
        },
        byFundingRounds: function() {
            var a = this;
            this.dimensions.byFundingRounds.filter(function(b) {
                for (var c = 0; c < b.length; c++) {
                    var d = b[c];
                    if (a.roundPassesFilters(d, a.filterData)) return !0
                }
                return !1
            })
        }
    }, new c
}]), angular.module("crunchinatorApp.models").service("Category", ["Model", "API_BASE_URL", function(a, b) {
    var c = function() {
        this.url = b + "/categories.json"
    };
    return c.prototype = Object.create(a), c.prototype.constructor = c, c.prototype.parse = function(a) {
        return a.categories
    }, c.prototype.linkModels = function(a, b) {
        _.each(this.all, function(c) {
            c.companies = [], c.investors = [], c.funding_rounds = [], _.each(c.company_ids, function(b) {
                var d = a[b];
                d && c.companies.push(d)
            }), _.each(c.investor_ids, function(a) {
                c.investors.push(b[a])
            }), c.companies = _.compact(c.companies), c.investors = _.compact(c.investors)
        })
    }, c.prototype.setupDimensions = function() {
        var a = crossfilter(this.all);
        this.dimensions = {
            byCompanies: a.dimension(function(a) {
                return a.companies
            }),
            byFundingRounds: a.dimension(function(a) {
                return a.funding_rounds
            })
        }, this.byName = a.dimension(function(a) {
            return a.display_name.toLowerCase()
        })
    }, c.prototype.dataSets = {
        dataForCategoryList: []
    }, c.prototype.filters = {
        byCompanies: function() {
            var a = this;
            this.dimensions.byCompanies.filter(function(b) {
                for (var c = 0; c < b.length; c++)
                    if (a.companyPassesFilters(b[c], a.filterData)) return !0;
                return !1
            })
        },
        byFundingRounds: function() {
            var a = this;
            this.dimensions.byFundingRounds.filter(function(b) {
                for (var c = 0; c < b.length; c++) {
                    var d = b[c];
                    if (a.roundPassesFilters(d, a.filterData)) return !0
                }
                return !1
            })
        }
    }, c.prototype.roundPassesFilters = function(b, c) {
        return c.investorIds.length > 0 && _.intersection(c.investorIds, b.company.investor_ids).length < 1 ? !1 : c.companyIds.length > 0 && !_.include(c.companyIds, b.company.id) ? !1 : a.roundPassesFilters(b, c) ? !0 : !1
    }, c.prototype.companyPassesFilters = function(b, c) {
        return c.investorIds.length > 0 && _.intersection(c.investorIds, b.investor_ids).length < 1 ? !1 : c.companyIds.length > 0 && !_.include(c.companyIds, b.id) ? !1 : a.companyPassesFilters(b, c) ? !0 : !1
    }, new c
}]), angular.module("crunchinatorApp.models").service("Investor", ["Model", "API_BASE_URL", function(a, b) {
    var c = function() {
        this.url = b + "/investors.json"
    };
    return c.prototype = Object.create(a), c.prototype.constructor = c, c.prototype.parse = function(a) {
        return a.investors
    }, c.prototype.linkModels = function(a, b) {
        _.each(this.all, function(c) {
            c.invested_companies = [], c.invested_categories = [], _.each(c.invested_company_ids, function(b) {
                var d = a[b];
                d && c.invested_companies.push(d)
            }), _.each(c.invested_category_ids, function(a) {
                c.invested_categories.push(b[a])
            }), c.invested_companies = _.compact(c.invested_companies), c.invested_categories = _.compact(c.invested_categories)
        })
    }, c.prototype.setupDimensions = function() {
        var a = crossfilter(this.all);
        this.dimensions = {
            byCompanies: a.dimension(function(a) {
                return a.invested_companies
            }),
            byFundingRounds: a.dimension(function(a) {
                return a.funding_rounds || []
            })
        }, this.byName = a.dimension(function(a) {
            return a.name
        })
    }, c.prototype.dataSets = {
        dataForInvestorsList: []
    }, c.prototype.filters = {
        byCompanies: function() {
            var a = this;
            this.dimensions.byCompanies.filter(function(b) {
                for (var c = 0; c < b.length; c++)
                    if (a.companyPassesFilters(b[c], a.filterData)) return !0;
                return !1
            })
        },
        byFundingRounds: function() {
            var a = this;
            this.dimensions.byFundingRounds.filter(function(b) {
                for (var c = 0; c < b.length; c++) {
                    var d = b[c];
                    if (a.roundPassesFilters(d, a.filterData)) return !0
                }
                return !1
            })
        }
    }, c.prototype.roundPassesFilters = function(b, c) {
        return c.categoryIds.length > 0 && !_.include(c.categoryIds, b.company.category_id) ? !1 : c.companyIds.length > 0 && !_.include(c.companyIds, b.company.id) ? !1 : a.roundPassesFilters(b, c) ? !0 : !1
    }, c.prototype.companyPassesFilters = function(b, c) {
        return c.categoryIds.length > 0 && !_.include(c.categoryIds, b.category_id) ? !1 : c.companyIds.length > 0 && !_.include(c.companyIds, b.id) ? !1 : a.companyPassesFilters(b, c) ? !0 : !1
    }, new c
}]), angular.module("crunchinatorApp.models").service("FundingRound", ["Model", "API_BASE_URL", function(a, b) {
    var c = function() {
        this.url = b + "/funding_rounds.json"
    };
    return c.prototype = Object.create(a), c.prototype.constructor = c, c.prototype.parse = function(a) {
        return a.funding_rounds
    }, c.prototype.linkModels = function(a, b, c) {
        _.each(this.all, function(d) {
            var e = a[d.company_id];
            e.funding_rounds = e.funding_rounds || [], e.funding_rounds.push(d), d.company = e, d.category = c[e.category_id], d.category.funding_rounds = d.category.funding_rounds || [], d.category.funding_rounds.push(d), d.investors = [], _.each(d.investor_ids, function(a) {
                var c = b[a];
                c.funding_rounds = c.funding_rounds || [], c && (d.investors.push(c), c.funding_rounds.push(d))
            })
        })
    }, c.prototype.setupDimensions = function() {
        var a = crossfilter(this.all),
            b = this.format.parse,
            c = this;
        this.dimensions = {
            byCompany: a.dimension(function(a) {
                return a.company
            }),
            byFundedOn: a.dimension(function(a) {
                return a.funded_on ? b(a.funded_on) : null
            }),
            byFundingAmount: a.dimension(function(a) {
                return a.raised_amount
            }),
            byRoundCode: a.dimension(function(a) {
                return a.round_code
            })
        }, this.byName = a.dimension(function(a) {
            return a.round_code
        });
        var d = _.pluck(this.all, "raised_amount");
        this.maxFundingValue = parseInt(_.max(d, function(a) {
            return parseInt(a)
        })), this.fundingSeries = _.unique(_.pluck(this.all, "round_code")), this.roundHash = {}, _.each(this.fundingSeries, function(a) {
            c.roundHash[a] = {
                name: a.length > 1 ? a : "Series " + a,
                id: a
            }
        })
    }, c.prototype.dataSets = {
        dataForInvestments: ["byFundedOn"],
        dataForFundingAmount: ["byFundingAmount"],
        dataForRoundName: ["byRoundCode"]
    }, c.prototype.filters = {
        byCompany: function() {
            var a = this;
            this.dimensions.byCompany.filter(function(b) {
                return a.companyPassesFilters(b, a.filterData)
            })
        },
        byFundedOn: function() {
            var a = this.filterData.fundingActivity;
            if (a.length > 0) {
                var b = this;
                this.dimensions.byFundedOn.filter(function(c) {
                    return c = c || new Date(1, 1, 1), b.fallsWithinRange(c, a)
                })
            }
        },
        byFundingAmount: function() {
            var a = this.filterData.roundRanges;
            if (a.length > 0) {
                var b = this;
                this.dimensions.byFundingAmount.filter(function(c) {
                    return b.fallsWithinRange(c, a)
                })
            }
        },
        byRoundCode: function() {
            var a = this.filterData.roundCodes;
            a.length > 0 && this.dimensions.byRoundCode.filter(function(b) {
                return _.contains(a, b)
            })
        }
    }, c.prototype.companyPassesFilters = function(b, c) {
        return c.categoryIds.length > 0 && !_.include(c.categoryIds, b.category_id) ? !1 : c.companyIds.length > 0 && !_.include(c.companyIds, b.id) ? !1 : c.investorIds.length > 0 && _.intersection(c.investorIds, b.investor_ids).length < 1 ? !1 : a.companyPassesFilters(b, c) ? !0 : !1
    }, new c
}]), angular.module("crunchinatorApp.services").service("ComponentData", ["Company", "Investor", "Category", "FundingRound", "ToolBox", function(a, b, c, d, e) {
    function f(a, b) {
        return Math.log(a) / Math.log(b)
    }

    function g(a, b, c) {
        return b > a ? 0 : Math.ceil(f(a / b, c))
    }

    function h(a, b, c, d, f, h) {
        f = f || 1e4, d = d || 2, h = h || 1;
        for (var i = _.pluck(a, b), j = [{
                start: h,
                end: f,
                label: e.labelfy(f),
                count: 0
            }], k = f; c > k; k *= d) j.push({
            start: k,
            end: k * d,
            label: e.labelfy(k * d),
            count: 0
        });
        return _.each(i, function(a) {
            if (!isNaN(a) && a > 0) {
                var b = g(a, f, d);
                j[b].count++
            }
        }), j
    }

    function i(a, b, c, d) {
        d = d || 1992;
        var e = d3.time.format("%x").parse,
            f = d3.time.format(c),
            g = f.parse(d),
            h = new Date,
            i = {};
        if ("%Y" === c)
            for (var j = g.getFullYear(); j <= h.getFullYear(); j++) i[j.toString()] = 0;
        else
            for (var k = f.parse(d); h >= k; k.setMonth(k.getMonth() + 1)) i[f(k)] = 0;
        return _.each(a, function(a) {
            if (a[b]) {
                var c = e(a[b]);
                c >= g && i[f(c)]++
            }
        }), _.reduce(i, function(a, b, c) {
            return a.push({
                date: c,
                count: b
            }), a
        }, [])
    }
    this.dataSets = {}, this.updateDataSets = function() {
        var e = this.dataSets;
        e.roundCodeListData = this.roundCodeListData(d.dataForRoundName, d.roundHash), e.categoryListData = this.categoryListData(c.dataForCategoryList, a.dataForCategoriesList), e.investorListData = this.investorListData(b.dataForInvestorsList, a.dataForInvestorsList), e.totalFunding = this.totalFunding(a.dataForTotalFunding, a.maxCompanyValue), e.fundingRoundCount = this.fundingRoundCount(d.dataForInvestments, "1/2000"), e.acquiredOnCount = this.acquiredOnCount(a.dataForAcquiredOnAreaChart, "1/2006"), e.acquiredValueCount = this.acquiredValueCount(a.dataForAcquiredValue, a.maxAcquiredValue), e.foundedOnCount = this.foundedOnCount(a.dataForFoundedOnAreaChart, "1992"), e.fundingPerRound = this.fundingPerRound(d.dataForFundingAmount, d.maxFundingValue), e.mostRecentFundingRound = this.mostRecentFundingRound(a.dataForMostRecentRaisedAmount, a.maxRecentFundingValue), e.companyStatusData = this.companyStatusData(a.dataForCompanyStatus), e.companyStateData = this.companyStateData(a.dataForLocationMap), e.ipoValueData = this.ipoValueData(a.dataForIPOValue, a.maxIPOValue), e.ipoDateData = this.ipoDateData(a.dataForIPODate, "1992")
    };
    var j = function(a) {
        var b = _.pluck(a, "id").join("|");
        return b
    };
    this.roundCodeListData = _.memoize(function(a, b) {
        if ("undefined" == typeof a) return [];
        var c = _.unique(_.pluck(a, "round_code")),
            d = _.sortBy(_.map(c, function(a) {
                return b[a]
            }), function(a) {
                return a.name
            });
        return d
    }, j), this.categoryListData = function(a, b) {
        return "undefined" == typeof a || "undefined" == typeof b ? [] : (_.each(a, function(a) {
            var c = _.select(b, function(b) {
                return b.category_id === a.id
            }).length;
            a.model_count = c
        }), a)
    }, this.investorListData = function(a, b) {
        if ("undefined" == typeof a || "undefined" == typeof b) return [];
        if (b.length <= 1e3) {
            var c = _.sortBy(a, function(a) {
                var c = _.select(b, function(b) {
                    return _.contains(a.invested_company_ids, b.id)
                }).length;
                return a.model_count = c, -1 * c
            });
            return c
        }
        return _.each(a, function(a) {
            delete a.model_count
        }), a
    }, this.totalFunding = _.memoize(function(a, b) {
        return "undefined" != typeof b && "undefined" != typeof a ? h(a, "total_funding", b) : void 0
    }, j), this.fundingRoundCount = _.memoize(function(a, b) {
        return i(a, "funded_on", "%m/%Y", b)
    }, j), this.acquiredOnCount = _.memoize(function(a, b) {
        return i(a, "acquired_on", "%m/%Y", b)
    }, j), this.acquiredValueCount = _.memoize(function(a, b) {
        return "undefined" != typeof b && "undefined" != typeof a ? h(a, "acquired_value", b) : void 0
    }, j), this.foundedOnCount = _.memoize(function(a, b) {
        return i(a, "founded_on", "%Y", b)
    }, j), this.fundingPerRound = _.memoize(function(a, b) {
        return "undefined" != typeof b && "undefined" != typeof a ? h(a, "raised_amount", b) : void 0
    }, j), this.mostRecentFundingRound = _.memoize(function(a, b) {
        return "undefined" != typeof b && "undefined" != typeof a ? h(a, "most_recent_raised_amount", b) : void 0
    }, j), this.companyStatusData = _.memoize(function(a) {
        var b = ["alive", "deadpooled", "acquired", "IPOed"],
            c = _.groupBy(a, function(a) {
                return a.status
            }),
            d = [];
        return _.isEmpty(c) ? d : (_.each(b, function(a) {
            c[a] ? d.push({
                label: a,
                count: c[a].length
            }) : d.push({
                label: a,
                count: 0
            })
        }), d)
    }, j), this.companyStateData = _.memoize(function(a) {
        var b = _.countBy(a, function(a) {
            return a.state_code
        });
        return b
    }, j), this.ipoValueData = _.memoize(function(a, b) {
        return "undefined" != typeof b && "undefined" != typeof a ? h(a, "ipo_valuation", b) : void 0
    }, j), this.ipoDateData = _.memoize(function(a, b) {
        return i(a, "ipo_on", "%Y", b)
    }, j)
}]), angular.module("crunchinatorApp.services").service("Bitly", ["$http", "BITLY_KEY", function(a, b) {
    this.shorten = function(c) {
        var d = "https://api-ssl.bitly.com/v3/shorten?access_token=" + b + "&longUrl=" + c;
        return a({
            method: "GET",
            url: d,
            transformResponse: function(a) {
                return JSON.parse(a).data.url
            }
        })
    }
}]), angular.module("crunchinatorApp.services").service("Browser", [function() {
    var a = {
        getUserAgent: function() {
            return navigator.userAgent
        },
        isIE: function() {
            var b = a.getUserAgent().toLowerCase();
            return -1 !== b.indexOf("msie") ? parseInt(b.split("msie")[1]) : !1
        },
        isMobile: {
            Android: function() {
                return a.getUserAgent().match(/Android/i)
            },
            BlackBerry: function() {
                return a.getUserAgent().match(/BlackBerry/i)
            },
            iOS: function() {
                return a.getUserAgent().match(/iPhone|iPad|iPod/i)
            },
            Opera: function() {
                return a.getUserAgent().match(/Opera Mini/i)
            },
            Windows: function() {
                return a.getUserAgent().match(/IEMobile/i)
            },
            any: function() {
                return a.isMobile.Android() || a.isMobile.BlackBerry() || a.isMobile.iOS() || a.isMobile.Opera() || a.isMobile.Windows()
            }
        }
    };
    return a
}]), angular.module("crunchinatorApp.services").service("Analytics", [function() {
    var a = function(a, b, c) {
            ga("send", "event", a, b, c)
        },
        b = function(a, b, c, d) {
            d.category = a, d.action = b, _kmq.push(["record", c, d])
        };
    this.event = function(c, d, e, f) {
        f = f || {}, a(c, d, e), b(c, d, e, f)
    }
}]), angular.module("crunchinatorApp.controllers").controller("CrunchinatorCtrl", ["$scope", "$rootScope", "$location", "$q", "Company", "Category", "Investor", "FundingRound", "ComponentData", "Bitly", "Analytics", function(a, b, c, d, e, f, g, h, i, j, k) {
    a.shouldScroll = !1, i.updateDataSets(), j.shorten(encodeURIComponent(c.absUrl())).then(function(b) {
        a.shortUrl = b.data
    }), a.filterData = {
        categoryIds: [],
        investorIds: [],
        companyIds: [],
        ranges: [],
        roundRanges: [],
        mostRecentRoundRanges: [],
        statuses: [],
        states: [],
        fundingActivity: [],
        acquiredDate: [],
        foundedDate: [],
        ipoValueRange: [],
        ipoDateRange: [],
        acquiredValueRange: [],
        roundCodes: []
    }, a.selectedRanges = [], a.companies = e, a.investors = g, a.categories = f, a.fundingRounds = h, a.Analytics = k;
    var l = 0,
        m = [e, f, g, h];
    _.each(m, function(d) {
        d.fetch().then(function() {
            if (l++, l === m.length) {
                var d = _.indexBy(e.all, "id"),
                    j = _.indexBy(f.all, "id"),
                    k = _.indexBy(g.all, "id");
                if (g.linkModels(d, j), f.linkModels(d, k), h.linkModels(d, k, j), c.search().filters) {
                    a.filterData = JSON.parse(decodeURIComponent(c.search().filters));
                    var n = function(a) {
                        return new Date(a)
                    };
                    a.filterData.fundingActivity = _.map(a.filterData.fundingActivity, n), a.filterData.ipoDateRange = _.map(a.filterData.ipoDateRange, n), a.filterData.foundedDate = _.map(a.filterData.foundedDate, n), a.filterData.acquiredDate = _.map(a.filterData.acquiredDate, n)
                }
                _.each(m, function(b) {
                    b.setupDimensions(), b.runFilters(a.filterData)
                }), i.updateDataSets(), a.initiated = !0, b.initiated = !0, angular.element("video")[0].play()
            }
        })
    }), a.ComponentData = i, a.$on("filterAction", function() {
        function b() {
            return _.delay(function() {
                a.$apply(function() {
                    c.search({
                        filters: encodeURIComponent(JSON.stringify(a.filterData))
                    }), e.runFilters(a.filterData), f.runFilters(a.filterData), g.runFilters(a.filterData), h.runFilters(a.filterData), i.updateDataSets(), j.shorten(encodeURIComponent(c.absUrl())).then(function(b) {
                        a.shortUrl = b.data
                    }), l.resolve("Finished filters")
                })
            }, 250), l.promise
        }
        k.event("Graphs", "Interaction", "Filter Action");
        var l = d.defer();
        a.loading = !0, b().then(function() {
            a.loading = !1
        })
    })
}]), angular.module("crunchinatorApp.controllers").controller("AboutCtrl", ["$scope", "Browser", "Analytics", function(a, b, c) {
    var d = angular.element("#about"),
        e = angular.element("body");
    a.showPage = "about", a.isMobile = b.isMobile.any(), a.Analytics = c, a.navigate = function(b) {
        c.event("Navigation", "Click", b), e.scrollTop() === d.offset().top ? a.showPage = b : angular.element("body").animate({
            scrollTop: d.offset().top
        }, "slow", function() {
            a.showPage = b, a.$digest()
        })
    }
}]), angular.module("crunchinatorApp.controllers").controller("BlankCtrl", [function() {}]), angular.module("crunchinatorApp.directives").directive("d3Bars", ["$rootScope", "ToolBox", function(a, b) {
    return {
        restrict: "EA",
        scope: {
            data: "=",
            chartTitle: "@",
            selected: "@",
            ranges: "@",
            filterProperty: "@"
        },
        templateUrl: "views/d3-chart.tpl.html",
        link: function(c, d) {
            c.selectedItems = [], c.oldFilterData = {};
            var e, f = angular.element(d[0]).parent();
            d = angular.element(d[0]).find(".chart");
            var g, h, i, j, k, l = {
                    top: 10,
                    right: 25,
                    bottom: 20,
                    left: 25
                },
                m = d.width() - l.left - l.right,
                n = f.height() - l.top - l.bottom - 70,
                o = d3.scale.ordinal().rangeRoundBands([0, m], .1),
                p = d3.scale.linear().range([n, 0]),
                q = Math.floor(1e10 * Math.random()),
                r = d3.select(d[0]).append("svg").style("width", m + l.left + l.right + "px").style("height", n + l.top + l.bottom + "px").append("g").attr("transform", "translate(" + l.left + "," + l.top + ")");
            r.append("clipPath").attr("id", "clip-" + q).append("rect").attr("width", m).attr("height", n);
            var s = function(a) {
                    i = [1 / 0, -1 / 0], g.each(function(b) {
                        var c = o(b.label);
                        a[0] <= c && c <= a[1] && (b.start < i[0] && (i[0] = b.start), b.end > i[1] && (i[1] = b.end))
                    }), (1 / 0 === i[0] || i[1] === -1 / 0) && (i = e), c.min = b.labelfy(i[0]), c.max = b.labelfy(i[1]), r.selectAll(".resize.e").selectAll(".range_text").text(c.max), r.selectAll(".resize.w").selectAll(".range_text").text(c.min), e = i, "undefined" == typeof j && (j = [i[0], i[1]])
                },
                t = [0, m],
                u = d3.svg.brush().x(o).extent(t).on("brush", function() {
                    var a = u.extent();
                    r.selectAll("#clip-" + q + " rect").attr("x", a[0]).attr("width", a[1] - a[0]), c.$parent.$apply(function() {
                        s(a)
                    })
                }).on("brushend", function() {
                    _.isEqual(v, u.extent()) || (c.selectedItems = _.isEqual(i, j) ? [] : i, c.$parent.$apply(function() {
                        c.oldFilterData !== a.filterData && (c.$parent.filterData[c.selected] = c.selectedItems, a.$broadcast("filterAction"))
                    })), v = u.extent()
                }),
                v = u.extent();
            window.onresize = function() {
                c.$apply()
            }, c.$watch("data", function(a) {
                return c.render(a)
            }, !0), c.$watch(function() {
                return angular.element(window)[0].innerWidth
            }, function() {
                c.render(c.data)
            });
            var w = !1;
            c.render = function(a) {
                if (a) {
                    h = r.selectAll(".background.bar").data(a), h.enter().append("rect"), g = r.selectAll(".foreground.bar").data(a), g.enter().append("rect");
                    for (var d = _.pluck(a, "label"), e = [], f = 0; f < d.length; f++) {
                        var i = d[f];
                        f % 3 === 0 && e.push(i)
                    }
                    var j = d3.svg.axis().scale(o).tickValues(e).orient("bottom");
                    o.domain(a.map(function(a) {
                        return a.label
                    })), p.domain([0, d3.max(a, function(a) {
                        return a.count
                    })]);
                    var l = c.$parent.filterData[c.selected];
                    if (l.length > 0 && !w) {
                        var v = o(b.labelfy(l[0]));
                        v = v ? v : 0;
                        var x = o(b.labelfy(l[1]));
                        x = x ? x : m, t = [v, x], u.extent(t), r.selectAll("#clip-" + q + " rect").attr("x", t[0]).attr("width", t[1] - t[0]), w = !0
                    }
                    r.selectAll("g").remove(), r.append("g").attr("class", "x axis").attr("transform", "translate(" + Math.floor(o.rangeBand() / 2) + ", " + n + ")").call(j), r.selectAll("text").style("fill", "#fff"), g.attr("class", "foreground bar").attr("x", function(a) {
                        return o(a.label)
                    }).attr("width", o.rangeBand()).style("fill", "#67BEFD").transition().duration(1e3).attr("height", function(a) {
                        return n - p(a.count)
                    }).attr("y", function(a) {
                        return p(a.count)
                    }), h.attr("class", "background bar").attr("x", function(a) {
                        return o(a.label)
                    }).attr("width", o.rangeBand()).style("fill", "#374D5D").transition().duration(1e3).attr("height", function(a) {
                        return n - p(a.count)
                    }).attr("y", function(a) {
                        return p(a.count)
                    }), g.attr("clip-path", "url(#clip-" + q + ")"), k = r.append("g").attr("class", "brush").call(u), k.selectAll("rect").attr("height", n), k.selectAll(".resize").append("rect").attr("class", "limit").attr("height", n - 35).attr("transform", "translate(0,35)").attr("width", 1), k.selectAll(".resize").append("rect").attr("class", "range").attr("height", 20).attr("width", 40).attr("transform", "translate(-20,30)").attr("rx", 5).attr("ry", 5), k.selectAll(".resize").append("text").attr("class", "range_text").attr("transform", "translate(0,45)"), k.selectAll(".resize").append("circle").attr("class", "handle").attr("transform", "translate(0," + n + ")").attr("r", 5), s(u.extent())
                }
            }, c.$parent.$watch("filterData." + c.filterProperty, function(a) {
                if (0 === a.length) {
                    if ("undefined" == typeof k) return;
                    r.selectAll("#clip-" + q + " rect").attr("x", 0).attr("width", m), u.extent([0, m]), k.call(u), s(u.extent()), v = u.extent()
                }
            })
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("d3Pie", ["$rootScope", function(a) {
    return {
        restrict: "EA",
        scope: {
            data: "=",
            chartTitle: "@",
            selected: "@",
            filterProperty: "@"
        },
        templateUrl: "views/d3-chart.tpl.html",
        link: function(b, c) {
            b.selectedItems = b.$parent.filterData[b.selected].slice(0);
            var d = angular.element(c[0]).parent();
            c = angular.element(c[0]).find(".chart");
            var e, f, g, h = c[0].clientWidth,
                i = d.height() - 70,
                j = Math.min(h, i) / 2 - 20,
                k = function(a) {
                    return {
                        deadpooled: "#caeafc",
                        acquired: "#36b0f1",
                        IPOed: "#0096ed",
                        alive: "#8acff7"
                    }[a]
                },
                l = d3.svg.arc().outerRadius(j - 10).innerRadius(0),
                m = d3.layout.pie().sort(null).value(function(a) {
                    return a.count
                }),
                n = d3.select(c[0]).append("svg").attr("width", h).attr("height", i).append("g").attr("transform", "translate(" + h / 2 + "," + i / 2 + ")"),
                o = function(a) {
                    return 0 === b.selectedItems.length || _.contains(b.selectedItems, a.data.label) ? k(a.data.label) : "#666"
                };
            window.onresize = function() {
                b.$apply(), a.$broadcast("filterAction")
            };
            var p = !0;
            b.$parent.$watch("filterData." + b.filterProperty, function(a) {
                0 !== a.length || p ? a.length > 0 && p && (b.selectedItems = b.$parent.filterData[b.selected].slice(0), n.selectAll("path").style("fill", o), p = !1) : (b.selectedItems = [], n.selectAll("path").style("fill", o))
            }), b.$watch("data", function(c) {
                return !e && c.length > 0 ? (e = n.selectAll("path").data(m(c)).enter().append("path").attr("fill", function(a) {
                    return o(a)
                }).attr("d", l).each(function(a) {
                    this._current = a
                }), e.on("click", function(c) {
                    c = c.data, b.$parent.$apply(function() {
                        if (_.contains(b.selectedItems, c.label)) {
                            var d = b.selectedItems.indexOf(c.label);
                            b.selectedItems.splice(d, 1)
                        } else b.selectedItems.push(c.label);
                        n.selectAll("path").style("fill", o), b.$parent.filterData[b.selected] = b.selectedItems.slice(0), a.$broadcast("filterAction")
                    })
                }), f = n.selectAll("line").data(m(c)).enter().append("line"), f.attr("x1", 0).attr("x2", 0).attr("y1", -j + 4).attr("y2", -j - 2).attr("stroke", "gray").attr("transform", function(a) {
                    return "rotate(" + (a.startAngle + a.endAngle) / 2 * (180 / Math.PI) + ")"
                }), g = n.selectAll("text").data(m(c)).enter().append("text"), g.attr("class", "value").attr("transform", function(a) {
                    var b = j + 15,
                        c = (a.startAngle + a.endAngle) / 2,
                        d = b * Math.sin(c),
                        e = -b * Math.cos(c);
                    return "translate(" + d + "," + e + ")"
                }).attr("dy", "0.35em").attr("text-anchor", "middle").text(function(a) {
                    return "alive" === a.data.label ? "active" : a.data.label
                }).style("fill", "#fff"), void 0) : b.render(c)
            }, !0), b.render = function(a) {
                a && 0 !== a.length && (e = e.data(m(a)), e.transition().duration(1e3).attrTween("d", function(a) {
                    var b = d3.interpolate(this._current, a),
                        c = d3.interpolate(l.outerRadius()(), j - 10);
                    return this._current = b(0),
                        function(a) {
                            return l.outerRadius(c(a))(b(a))
                        }
                }), f = f.data(m(a)), f.classed("hidden", function(a) {
                    return 0 === a.value
                }), f.transition().duration(1e3).attr("transform", function(a) {
                    return "rotate(" + (a.startAngle + a.endAngle) / 2 * (180 / Math.PI) + ")"
                }), g = g.data(m(a)), g.classed("hidden", function(a) {
                    return 0 === a.value
                }), g.transition().duration(1e3).attr("transform", function(a) {
                    var b = j + 15,
                        c = (a.startAngle + a.endAngle) / 2,
                        d = b * Math.sin(c),
                        e = -b * Math.cos(c);
                    return "translate(" + d + "," + e + ")"
                }))
            }
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("d3Area", ["$rootScope", function(a) {
    return {
        restrict: "EA",
        scope: {
            data: "=",
            chartTitle: "@",
            extent: "@",
            selected: "@",
            format: "@",
            ranges: "@",
            filterProperty: "@"
        },
        templateUrl: "views/d3-chart.tpl.html",
        link: function(b, c) {
            function d(a) {
                var c = function(a) {
                    return a.getMonth() + 1 + "/" + a.getDate() + "/" + a.getFullYear()
                };
                b.min = c(a[0]), b.max = c(a[1]), s.selectAll(".resize.e").selectAll(".range_text").text(b.max), s.selectAll(".resize.w").selectAll(".range_text").text(b.min)
            }
            var e = angular.element(c[0]).parent();
            c = angular.element(c[0]).find(".chart"), b.format = b.format || "%m/%Y";
            var f, g, h = {
                    top: 10,
                    right: 42,
                    bottom: 20,
                    left: 42
                },
                i = c.width() - h.left - h.right,
                j = e.height() - h.top - h.bottom - 70,
                k = d3.time.format(b.format),
                l = k.parse,
                m = [l(b.extent), new Date],
                n = d3.time.scale().range([0, i]),
                o = d3.scale.linear().range([j, 0]),
                p = Math.floor(1e10 * Math.random()),
                q = d3.svg.axis().scale(n).tickFormat(d3.time.format("'%y")).orient("bottom"),
                r = d3.svg.area().x(function(a) {
                    return n(a.parsed_date)
                }).y0(j).y1(function(a) {
                    return o(a.count)
                }),
                s = d3.select(c[0]).append("svg").attr("width", i + h.left + h.right).attr("height", j + h.top + h.bottom).append("g").attr("transform", "translate(" + h.left + "," + h.top + ")");
            s.append("clipPath").attr("id", "clip-" + p).append("rect").attr("width", i).attr("height", j), s.append("path").attr("class", "background area"), s.append("path").attr("class", "foreground area"), s.append("g").attr("class", "x axis"), b.$watch("data", function(a) {
                return a ? b.render(a) : void 0
            }, !0), n.domain(m);
            var t = m;
            b.$parent.filterData[b.selected].length > 0 && (t = b.$parent.filterData[b.selected], s.selectAll("#clip-" + p + " rect").attr("x", n(t[0])).attr("width", n(t[1]) - n(t[0])));
            var u = d3.svg.brush().x(n).extent(t).on("brush", function() {
                    var a = u.extent();
                    s.selectAll("#clip-" + p + " rect").attr("x", n(a[0])).attr("width", n(a[1]) - n(a[0])), b.$parent.$apply(function() {
                        d(a)
                    })
                }).on("brushend", function() {
                    var c = u.extent();
                    _.isEqual(c, v) || (b.selectedItems = _.isEqual(c, m) ? [] : [c[0], c[1]], b.$parent.$apply(function() {
                        b.$parent.filterData[b.selected] = b.selectedItems, a.$broadcast("filterAction")
                    })), v = c
                }),
                v = u.extent(),
                w = s.append("g").attr("class", "brush").call(u);
            w.selectAll("rect").attr("height", j), w.selectAll(".resize").append("rect").attr("class", "limit").attr("height", j - 35).attr("transform", "translate(0,35)").attr("width", 1), w.selectAll(".resize").append("rect").attr("class", "range").attr("height", 20).attr("width", 74).attr("transform", "translate(-37,30)").attr("rx", 5).attr("ry", 5), w.selectAll(".resize").append("text").attr("class", "range_text").attr("transform", "translate(0,45)"), w.selectAll(".resize").append("circle").attr("class", "handle").attr("transform", "translate(0," + j + ")").attr("r", 5), b.render = function(a) {
                a.forEach(function(a) {
                    a.parsed_date = l(a.date)
                }), a = _.sortBy(a, function(a) {
                    return a.parsed_date
                }), o.domain([0, d3.max(a, function(a) {
                    return a.count
                })]), g = s.selectAll(".background.area").datum(a).transition().duration(1e3).attr("d", r).style("fill", "#374D5D"), f = s.selectAll(".foreground.area").datum(a).transition().duration(1e3).attr("d", r).style("fill", "#67BEFD"), s.selectAll(".x.axis").attr("transform", "translate(0," + j + ")").call(q).style("fill", "#fff"), f.attr("clip-path", "url(#clip-" + p + ")"), d(u.extent())
            };
            var x = !0;
            b.$parent.$watch("filterData." + b.filterProperty, function(a) {
                if (0 !== a.length || x) {
                    if (x && a.length > 0) {
                        var c = b.$parent.filterData[b.selected];
                        s.selectAll("#clip-" + p + " rect").attr("x", n(c[0])).attr("width", n(c[1]) - n(c[0])), u.extent(c), w.call(u), d(u.extent()), v = c, x = !1
                    }
                } else s.selectAll("#clip-" + p + " rect").attr("x", n(m[0])).attr("width", n(m[1]) - n(m[0])), u.extent(m), w.call(u), d(u.extent()), v = m
            })
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("d3Map", ["$rootScope", function(a) {
    return {
        restrict: "EA",
        scope: {
            data: "=",
            chartTitle: "@",
            selected: "@",
            filterProperty: "@"
        },
        templateUrl: "views/d3-chart.tpl.html",
        link: function(b, c) {
            function d(a, b, c) {
                var d = parseInt(a.slice(1), 16),
                    e = parseInt(b.slice(1), 16),
                    f = d >> 16,
                    g = d >> 8 & 255,
                    h = 255 & d,
                    i = e >> 16,
                    j = e >> 8 & 255,
                    k = 255 & e;
                return "#" + (16777216 + 65536 * (Math.round((i - f) * c) + f) + 256 * (Math.round((j - g) * c) + g) + (Math.round((k - h) * c) + h)).toString(16).slice(1)
            }
            b.selected_states = b.$parent.filterData[b.selected].slice(0);
            var e = angular.element(c[0]).parent();
            c = angular.element(c[0]).find(".chart");
            var f = c[0].clientWidth,
                g = e.height() - 70,
                h = d3.geo.albersUsa().scale(1.3 * f).translate([f / 2, g / 2]),
                i = d3.geo.path().projection(h),
                j = d3.select(c[0]).append("svg").attr("width", f).attr("height", g),
                k = j.append("g"),
                l = k.append("g"),
                m = function(a) {
                    var c = _.max(a, function(a) {
                            return a
                        }),
                        e = d3.scale.log();
                    return e.domain([1, c + 1]),
                        function(c) {
                            var f = a[c.properties.postal] ? a[c.properties.postal] + 1 : 1,
                                g = 1 - e(f);
                            return b.selected_states.length > 0 ? _.contains(b.selected_states, c.properties.postal) ? d("#0095ea", "#ffffff", g) : d("#818181", "#dddddd", g) : d("#0095ea", "#ffffff", g)
                        }
                },
                n = function(c) {
                    var d = c.properties.postal,
                        e = _.contains(b.selected_states, d);
                    e ? b.selected_states = _.without(b.selected_states, d) : b.selected_states.push(d), b.$parent.filterData[b.selected] = b.selected_states.slice(0), l.selectAll(".state").attr("fill", m(b.data)), b.$parent.$apply(function() {
                        a.$broadcast("filterAction")
                    })
                };
            d3.json("/data/us.json", function(a, c) {
                l.selectAll(".state").data(topojson.feature(c, c.objects.states).features).enter().append("path").attr("fill", m(b.data)).attr("class", "state").on("click", n).attr("d", i), l.append("path").datum(topojson.mesh(c, c.objects.states)).attr("d", i).attr("class", "state-boundary")
            });
            var o = !0;
            b.$parent.$watch("filterData." + b.filterProperty, function(a) {
                0 !== a.length || o ? a.length > 0 && o && (b.selected_states = b.$parent.filterData[b.selected].slice(0), l.selectAll(".state").attr("fill", m(b.data)), o = !1) : (b.selected_states = [], l.selectAll(".state").attr("fill", m(b.data)))
            }), b.$watch("data", function(a) {
                return b.render(a)
            }, !0), b.render = function(a) {
                var b = m(a);
                l.selectAll(".state").transition().duration(1e3).attr("fill", b)
            }
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("listSelect", ["$rootScope", function(a) {
    return {
        restrict: "EA",
        scope: {
            items: "=",
            chartTitle: "@",
            selected: "@",
            total: "=",
            link: "=",
            count: "=",
            showSearch: "=",
            filterProperty: "@"
        },
        templateUrl: "views/list-select.tpl.html",
        link: function(b, c) {
            var d = angular.element(c[0]).parent();
            c = angular.element(c[0]).find(".dataset"), c.height(d.height() - (b.showSearch ? 120 : 65)), b.items = b.items || [], b.scrollItems = [], b.selectedItems = [], b.selectedShownItems = _.intersection(b.selectedItems, b.items);
            var e = !1;
            b.$watch("items", function() {
                !e && b.items.length > 0 && (b.selectedItems = _.filter(b.items, function(a) {
                    return _.include(b.$parent.filterData[b.selected], a.id)
                }), e = !0), b.scrollItems = [], b.selectedShownItems = _.intersection(b.selectedItems, b.items), b.updateScrollItems()
            }), b.$parent.$watch("filterData." + b.filterProperty, function(a) {
                0 === a.length && (b.selectedItems = [], b.selectedShownItems = [])
            }), b.selectItem = function(d) {
                d = d ? d : b.selectedItem, _.contains(b.selectedItems, d) || (b.selectedItems.push(d), c[0].scrollTop = 0, b.selectedItem = ""), b.selectedShownItems = _.intersection(b.selectedItems, b.items), b.$parent.filterData[b.selected] = _.pluck(b.selectedItems, "id"), a.$broadcast("filterAction")
            }, b.removeItem = function(c) {
                b.selectedItems = _.without(b.selectedItems, c), b.selectedShownItems = _.intersection(b.selectedItems, b.items), b.$parent.filterData[b.selected] = _.pluck(b.selectedItems, "id"), a.$broadcast("filterAction")
            }, b.updateScrollItems = function() {
                var a = [],
                    c = b.scrollItems.length,
                    d = 100;
                a = b.items.slice(c, c + d), b.scrollItems = b.scrollItems.concat(a)
            }
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("dragArrange", [function() {
    return {
        restrict: "A",
        link: function(a, b) {
            var c = window.jQuery || {};
            c(b[0]).shapeshift({
                minColumns: 3,
                handle: ".head"
            })
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("placeholder", function() {
    return {
        restrict: "EA",
        scope: {
            chartTitle: "@",
            placeholderText: "@"
        },
        templateUrl: "views/d3-chart.tpl.html"
    }
}), angular.module("crunchinatorApp.directives").directive("waitThenScroll", ["$window", "$rootScope", function(a, b) {
    return {
        restrict: "A",
        scope: {
            shouldScroll: "="
        },
        controller: ["$scope", function(b) {
            b.isScrolling = !1, b.jQuery = a.jQuery
        }],
        link: function(a, c, d) {
            a.$watch("shouldScroll", function(c) {
                if (c && !a.isScrolling) {
                    var e = d.scrollSpeed || 1500;
                    a.isScrolling = !0, a.jQuery("#splash").animate({
                        height: 0,
                        "margin-bottom": 0
                    }, e, function() {
                        a.isScrolling = !1, b.$broadcast("scrollFinish")
                    })
                }
            })
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("affix", [function() {
    return {
        restrict: "A",
        scope: {
            parent: "@",
            bottom: "@"
        },
        link: function(a, b) {
            var c, d, e = function() {
                if (c = angular.element(a.parent).offset().top, a.bottom) {
                    var b = angular.element(document).height(),
                        e = angular.element(a.bottom).offset().top,
                        f = angular.element(window).height();
                    d = b - e + f
                }
            };
            e(), a.$watch(function() {
                return angular.element(document).height()
            }, e), a.$watch(function() {
                return angular.element(window).height()
            }, e);
            var f = {
                offset: {
                    top: function() {
                        return c
                    }
                }
            };
            a.bottom && (f.offset.bottom = function() {
                return d
            }), angular.element(b[0]).affix(f)
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("fbShare", ["Analytics", function(a) {
    return {
        restrict: "A",
        link: function(b, c) {
            c.bind("click", function() {
                a.event("Social", "Share", "Facebook"), FB.ui({
                    method: "feed",
                    name: "Slice, Filter & Explore Crunchbase Data",
                    link: b.$parent.shortUrl,
                    picture: "http://crunchinator.com/images/logo.png",
                    caption: "",
                    description: "With Cloudspace's free Crunchinator tool, you can quickly identify all companies and investors based upon a variety of criteria, including geography, fundraising amounts and exits.",
                    message: ""
                })
            })
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("emailShare", ["Analytics", function(a) {
    return {
        restrict: "A",
        link: function(b, c) {
            c.bind("click", function() {
                a.event("Social", "Share", "Email");
                var c = encodeURIComponent(b.$parent.shortUrl),
                    d = "mailto:?body=" + c;
                window.location.href = d
            })
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("twitterShare", ["$window", "Analytics", function(a, b) {
    return {
        restrict: "A",
        link: function(c, d) {
            d.on("click", function() {
                b.event("Social", "Share", "Twitter");
                var d = encodeURIComponent(c.$parent.shortUrl),
                    e = "https://twitter.com/share?url=" + d;
                a.open(e, "Twitter", "width=575,height=400")
            })
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("crunchNav", ["$rootScope", "$location", "Company", "Investor", "Category", "ToolBox", "Analytics", function(a, b, c, d, e, f, g) {
    return {
        restrict: "EA",
        scope: {
            companyCount: "@",
            investorCount: "@",
            filters: "="
        },
        templateUrl: "views/crunch-nav.tpl.html",
        link: function(h) {
            function i(a, b) {
                var f;
                switch (b) {
                    case "companyIds":
                        f = c;
                        break;
                    case "investorIds":
                        f = d;
                        break;
                    case "categoryIds":
                        f = e
                }
                return _.map(a, function(a) {
                    var b = f.get(a);
                    return f === e ? b.display_name : b.name
                })
            }

            function j(a, b) {
                this.type = this.typeLookup[b], this.label = a[0] instanceof Date || !isNaN(a[0]) ? this.prettifyRange(a) : this.prettifyList(a), this.raw_type = b
            }
            h.Analytics = g;
            var k = ["companyIds", "investorIds", "categoryIds"];
            h.$watch("filters", function() {
                h.filterList = [], _.each(h.filters, function(a, b) {
                    0 !== a.length && (_.contains(k, b) ? h.filterList.push(new j(i(a, b), b)) : h.filterList.push(new j(a, b)))
                })
            }, !0), h.chevron = function() {
                g.event("Navigation", "Click", "Continue to the Crunchinator");
                var a = angular.element("#splash");
                a.slideUp("slow", function() {
                    h.chevroned = !0, angular.element("html, body").css({
                        overflow: "visible"
                    }), h.$digest()
                })
            }, h.$parent.$watch("loading", function(a) {
                h.loading = a
            }), h.$parent.$watch("initiated", function(a) {
                h.initiated = a, h.$parent.initiated === !0 && b.search().filters && _.defer(function() {
                    h.chevron()
                })
            }), h.removeFilter = function(b) {
                h.$parent.filterData[b.raw_type] = [], a.$broadcast("filterAction")
            }, h.reset = function() {
                _.each(h.$parent.filterData, function(a, b) {
                    h.$parent.filterData[b] = []
                }), a.$broadcast("filterAction")
            }, j.prototype.prettifyList = function(a) {
                var b = "";
                return b = a.length > 3 ? a.slice(0, 3).join(", ") + "..." : a.join(", ")
            }, j.prototype.prettifyRange = function(a) {
                if (a[0] instanceof Date) {
                    var b = d3.time.format("%m/%Y");
                    return b(a[0]) + " - " + b(a[1])
                }
                return f.labelfy(a[0]) + " - " + f.labelfy(a[1])
            }, j.prototype.typeLookup = {
                categoryIds: "Categories",
                investorIds: "Investors",
                companyIds: "Companies",
                ranges: "Total Funding",
                roundRanges: "Any Round",
                mostRecentRoundRanges: "Latest Round",
                statuses: "Company Status",
                states: "Company HQ",
                fundingActivity: "Investments",
                acquiredDate: "Acquisition Date",
                foundedDate: "Founding Date",
                ipoValueRange: "IPO Raise",
                ipoDateRange: "IPO Date",
                acquiredValueRange: "Acquisition Price",
                roundCodes: "Round Name"
            }
        }
    }
}]), angular.module("crunchinatorApp.directives").directive("popOpen", ["$window", function(a) {
    return {
        restrict: "A",
        link: function(b, c) {
            var d = angular.element(c);
            angular.element(a).bind("scroll", function() {
                var a = d.offset().top,
                    b = this.pageYOffset,
                    c = a - 400;
                b > c && d.addClass("active")
            })
        }
    }
}]);