// SENATE 
// const url = "https://api.propublica.org/congress/v1/113/senate/members.json - H X-API-Key: 2lUCEQErUjMba8vJdJhZBXWdthaOwl7V4uiOUtXJ";

// HOUSE 
// const url= "https://api.propublica.org/congress/v1/113/house/members.json - H X-API-Key: 2lUCEQErUjMba8vJdJhZBXWdthaOwl7V4uiOUtXJ";


var url = "https://api.propublica.org/congress/v1/113/house/members.json";
if (document.title.includes("Senate")) {
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
}

var app = new Vue({
    el: '#app',
    data: {
        members: [],
        select: "all",
        checkedParty: ["R", "D", "ID"],
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
                for (var i = 0; i < this.members.length; i++) {

                    this.members[i].full_name = (this.members[i].first_name.concat(" ", this.members[i].middle_name || " ", " ", this.members[i].last_name)).link(this.members[i].url);
                };
            })
    },

    methods: {

        orderStates() {
            var sortStates = this.members.map(member => {
                return member.state
            }).sort();

            return [...new Set(sortStates)];
        },

        filterMember() {
            return this.members.filter(member => {
                if ((member.state == this.select || this.select == "all") && ((this.checkedParty.includes(member.party)))) {
                    return member
                };
            })
        },
    }
});