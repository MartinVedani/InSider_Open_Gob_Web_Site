// SENATE 
// const url = "https://api.propublica.org/congress/v1/113/senate/members.json - H X-API-Key: 2lUCEQErUjMba8vJdJhZBXWdthaOwl7V4uiOUtXJ";

// HOUSE 
// const url= "https://api.propublica.org/congress/v1/113/house/members.json - H X-API-Key: 2lUCEQErUjMba8vJdJhZBXWdthaOwl7V4uiOUtXJ";


var url = "https://api.propublica.org/congress/v1/113/house/members.json";

if (document.title.includes("Senate")) {
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
}

//var members = [];

var app = new Vue({
    el: '#app',
    data: {
        members: [],
        stats: {
            showTablePercent: 0.1,
            republicans: [],
            democrats: [],
            independents: [],
            countR: 0,
            countD: 0,
            countI: 0,
            countTotal: 0,
            sumR: 0,
            sumD: 0,
            sumI: 0,
            sumTotal: 0,
            avgR: 0,
            avgD: 0,
            avgI: 0,
            avgTotal: 0,
            leastEngaged: [],
            mostEngaged: [],
            engagedTop: [],
            engagedBottom: [],
            leastLoyal: [],
            mostLoyal: [],
            loyalTop: [],
            loyalBottom: [],
        },
    },

    created() {
        fetch(url, {
                method: 'GET', // or 'PUT'
                headers: {
                    'X-API-Key': '2lUCEQErUjMba8vJdJhZBXWdthaOwl7V4uiOUtXJ',
                }
            }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(json => {
                this.members = json.results[0].members;
                app.getStats();
                app.mostEngagedTable();
                app.leastEngagedTable();
                app.leastLoyaltyTable();
                app.mostLoyaltyTable();
            })
    },

    methods: {

        getStats() {
            for (var i = 0; i < this.members.length; i++) {

                this.members[i].full_name = (this.members[i].first_name.concat(" ", this.members[i].middle_name || " ", " ", this.members[i].last_name)).link(this.members[i].url);

                if (this.members[i].party == "R") {
                    this.stats.republicans.push(this.members[i]);
                    this.stats.sumR = this.stats.sumR + this.members[i].votes_with_party_pct;
                };

                if (this.members[i].party == "D") {
                    this.stats.democrats.push(this.members[i]);
                    this.stats.sumD = this.stats.sumD + this.members[i].votes_with_party_pct;
                };

                if (this.members[i].party == "ID") {
                    this.stats.independents.push(this.members[i]);
                    this.stats.sumI = this.stats.sumI + this.members[i].votes_with_party_pct;
                };

                this.stats.sumTotal = this.stats.sumTotal + this.members[i].votes_with_party_pct;
            };

            this.stats.countR = this.stats.republicans.length;
            this.stats.countD = this.stats.democrats.length;
            this.stats.countI = this.stats.independents.length;
            this.stats.countTotal = this.members.length;

            this.stats.avgR = (this.stats.sumR / this.stats.countR).toFixed(2);
            this.stats.avgD = (this.stats.sumD / this.stats.countD).toFixed(2);
            this.stats.avgI = (this.stats.sumI / this.stats.countI).toFixed(2);
            this.stats.avgTotal = (this.stats.sumTotal / this.stats.countTotal).toFixed(2);

            if (isNaN(this.stats.avgR)) {
                this.stats.avgR = 0;
                this.stats.avgR = this.stats.avgI.toFixed(2);
            };

            if (isNaN(this.stats.avgD)) {
                this.stats.avgD = 0;
                this.stats.avgD = this.stats.avgI.toFixed(2);
            };

            if (isNaN(this.stats.avgI)) {
                this.stats.avgI = 0;
                this.stats.avgI = this.stats.avgI.toFixed(2);
            };

        },

        // mostEngaged table -> engagedTop
        mostEngagedTable() {
            this.stats.mostEngaged = this.members.sort(compareMissed);

            for (var i = 0; i < this.members.length * this.stats.showTablePercent; i++) {
                this.stats.engagedTop.push(this.stats.mostEngaged[i]);
            };
        },

        // leastEngaged table -> engagedBottom
        leastEngagedTable() {
            this.stats.leastEngaged = this.stats.mostEngaged.reverse();

            for (var i = 0; i < this.members.length * this.stats.showTablePercent; i++) {
                this.stats.engagedBottom.push(this.stats.leastEngaged[i]);
            };
        },

        // leastLoyal table -> loyalBottom
        leastLoyaltyTable() {
            this.stats.leastLoyal = this.members.sort(compareLoyalty);

            for (var i = 0; i < this.members.length * this.stats.showTablePercent; i++) {
                this.stats.leastLoyal[i].partyVotes = (this.stats.leastLoyal[i].total_votes * (this.stats.leastLoyal[i].votes_with_party_pct / 100)).toFixed(0);
                this.stats.loyalBottom.push(this.stats.leastLoyal[i]);
            };
        },

        // mostLoyal table -> loyalTop
        mostLoyaltyTable() {
            this.stats.mostLoyal = this.stats.leastLoyal.reverse();

            for (var i = 0; i < this.members.length * this.stats.showTablePercent; i++) {
                this.stats.mostLoyal[i].partyVotes = (this.stats.mostLoyal[i].total_votes * (this.stats.mostLoyal[i].votes_with_party_pct / 100)).toFixed(0);
                this.stats.loyalTop.push(this.stats.mostLoyal[i]);
            };
        },

    },
});

// SORT TABLE variable
function compareMissed(a, b) {
    if (a.missed_votes_pct > b.missed_votes_pct) {
        return 1;
    } else if (a.missed_votes_pct < b.missed_votes_pct) {
        return -1;
    } else {
        return 0;
    };
};

// LOYALTY tables

function compareLoyalty(a, b) {
    if (a.votes_with_party_pct > b.votes_with_party_pct) {
        return 1;
    } else if (a.votes_with_party_pct < b.votes_with_party_pct) {
        return -1;
    } else {
        return 0;
    };
};