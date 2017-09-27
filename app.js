var num;
let leagues = [];
let comps = [];
let topper, match, info;

 let makeRequest = function(url, callback){
 	
  let request = new XMLHttpRequest();
  request.open('GET', url);
  request.setRequestHeader('X-Auth-Token', "d05a758a12b345e9802a6953707abd2e");
  request.onload = callback;
  request.send();
};

let requestComplete = function(){

  if (this.status !== 200) return;

    let jsonString = this.responseText;
    let data = JSON.parse(jsonString);

    displayLeagueHeadings(data);
};


let displayLeagueHeadings = function(data){

  for (let i = 0; i < data.length; i++){
  	let p = document.createElement('div');
  	let head = document.createElement('h3');

  	p.id = i;
  	head.innerHTML = data[i].caption;

  	p.appendChild(head);
  	document.getElementById('list').appendChild(p);

  	leagues.push(data[i]._links.fixtures.href);
  	comps.push(data[i].caption);
  }

  collectFixtures();
  
};

let collectFixtures = function(){

	for (let i = 0; i < leagues.length; i++){
		let section = document.getElementById(i);
		let p = document.createElement('p');
		let btn = document.createElement('button');
		btn.innerHTML = 'See Fixtures';
		let stuff = "clicked on "+ leagues[i];

		btn.onclick = function(){
			document.getElementById('fix').innerText = "";
      document.getElementById('match').innerText = "";
			topper = comps[i];
			makeRequest(leagues[i], printFixtures)
		}
		
		p.appendChild(btn);
		section.appendChild(p);

	}
}

let printFixtures = function(){
	if (this.status !== 200) return;

    let jsonString = this.responseText;
    let data = JSON.parse(jsonString);
    let games = data.fixtures;

    let fixList = document.getElementById('fix'); 

    let heading = document.createElement('h3');
    let text = document.createTextNode(topper);
    heading.appendChild(text);
    fixList.appendChild(heading);

    let table = document.createElement('table');

    games.forEach(function(tie){

    	if (tie.status === "TIMED"){
    		let row = document.createElement('tr');

    		let ht = document.createElement('td');
    		let versus = document.createElement('td');
    		let at = document.createElement('td');
    		let butn = document.createElement('input');
    		butn.type = 'button';

    		let home = document.createTextNode(tie.homeTeamName);
    		let vs = document.createTextNode('vs');
    		let away = document.createTextNode(tie.awayTeamName);

    		ht.appendChild(home);
    		versus.appendChild(vs);
    		at.appendChild(away);
    		butn.value = "See Match";

    	  let mtch = {
                    game: tie.homeTeamName + " vs " + tie.awayTeamName,
                    ht: tie.homeTeamName,
                    at: tie.awayTeamName, 
                    comp: tie._links.competition.href+"/leagueTable"
                  };


    		butn.onclick = function(){
				    document.getElementById('match').innerText = "";
				    info = mtch;
            makeRequest(info.comp, matchStats);

  			}

    		row.appendChild(ht);
    		row.appendChild(versus);
    		row.appendChild(at);
    		row.appendChild(butn);

    		table.appendChild(row);
    		
    		fixList.appendChild(table);	
    	}
    });

    fixList.appendChild(table);

}

let matchStats = function(){

  if (this.status !== 200) return;

    let jsonString = this.responseText;
    let data = JSON.parse(jsonString);

  console.log(info);
	console.log(data);

    let gameStat = document.getElementById('match');

    let title = document.createElement('div');
    let hteam = document.createElement('div');
    let ateam = document.createElement('div');
    let top = document.createElement('h3');
    let text = document.createTextNode(info.game);

   // top.innerHTML(info.game);
    top.appendChild(text);
    title.appendChild(top);
    hteam.id = "home";
    ateam.id = "away";

    gameStat.appendChild(title);
    gameStat.appendChild(hteam);
    gameStat.appendChild(ateam);

}

var app = function(){
  var url = "http://api.football-data.org/v1/competitions";
  makeRequest(url, requestComplete);

};

window.onload  = app;

