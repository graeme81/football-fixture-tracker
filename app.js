var num;
var leagues = [];
let comps = [];
let topper;

 var makeRequest = function(url, callback){
 	
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.setRequestHeader('X-Auth-Token', "d05a758a12b345e9802a6953707abd2e");
  request.onload = callback;
  request.send();
};

var requestComplete = function(){

  if (this.status !== 200) return;

    var jsonString = this.responseText;
    var data = JSON.parse(jsonString);

    // console.log(data.length);

    displayLeagueHeadings(data);
};


var displayLeagueHeadings = function(data){
	
  var div = document.getElementById('fixtures');

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
  


  // for(var i = 1; i < data.length; i++){

  //   var p = document.createElement('p');
  //   p.setAttribute('id','p'+i); 
  //   p.innerText = data[i].caption;

  //   num = i;
  //   div.appendChild(p);

  //   url = data[i]._links.fixtures.href;
  //   makeRequest(url, getFixtures);
    
  //   console.log(num);
  // };
};

let collectFixtures = function(){

	for (let i = 0; i < leagues.length; i++){
		let section = document.getElementById(i);
		let p = document.createElement('p');
		let btn = document.createElement('button');
		btn.innerHTML = 'See Fixtures';
		let stuff = "clicked on "+ leagues[i];

		btn.onclick = function(){
			document.getElementById('fix').innerText = ''; 
			topper = comps[i];
			makeRequest(leagues[i], printFixtures)
		}
		
		p.appendChild(btn);
		section.appendChild(p);

	}
}

let printFixtures = function(){
	if (this.status !== 200) return;

    var jsonString = this.responseText;
    var data = JSON.parse(jsonString);

    let games = data.fixtures;

    let heading = document.createElement('h3');
    let text = document.createTextNode(topper);
    
    heading.appendChild(text);

    document.getElementById('fix').appendChild(heading);

    //appendChild(heading);

    games.forEach(function(tie){
    	if (tie.status === "TIMED"){
    		//let li = document.createElement('li');
    		//console.log(tie.homeTeamName + ' vs ' + tie.awayTeamName);
    		
    	}
    });

}



var getFixtures = function(){
  console.log('happened');
  if (this.status !== 200) return;
    var jsonString = this.responseText;
    var data = JSON.parse(jsonString);

    games = data.fixtures;

    games.forEach(function(tie){
      if((tie.status==='SCHEDULED'|| tie.status ==='TIMED' ) && tie.odds){

        var li = document.createElement('li');
        li.innerText = tie.homeTeamName + " vs " + tie.awayTeamName;
        console.log(num);
        var p = document.getElementById('p'+num);

        p.appendChild(li);
        
      }
    });
}



var app = function(){
  var url = "http://api.football-data.org/v1/competitions";
  makeRequest(url, requestComplete);

};

window.onload  = app;

