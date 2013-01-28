//TODO
//gratulacje na infoBox
//organize css!
//js to sepetare file
//cookies for chrome
//save best score only
//stop elapsing time when wyniki
//cookies reset after re-open browser
var tab = new Array();
var statusTab = new Array();
var ileKlik = 0;
var lastKlik =0;
var tStartStop=0;

$(document).ready(function(){
	$("#ustawienia").click(function(){
		$("#ustpanel").slideToggle();
	});
	
	$("#start").click(function(){
		$("#infoBox").slideUp();
		$("#obszarGry").delay(500).fadeIn();
		$("#obszarGry").empty();
		initMem( $( "#amount" ).val() );
	});
	
	$("#wyniki").click(function(){
		createCookie("data","dzis");
		readCookies();
		tStartStop=0;
		$("#obszarGry").fadeOut();
		$("#infoBox").delay(500).slideDown();
		$("#infoBox table").slideDown();
	});
	
	$( "#slider" ).slider({
		range: "min",
		value: 12,
		min: 4,
		max: 20,
		step: 2,
		slide: function( event, ui )
		{
			$( "#amount" ).val( ui.value );
			$("#obszarGry").empty();
			initMem(ui.value);
		}
	});
	
	$( "#amount" ).val( $( "#slider" ).slider( "value" ) );
	
	readCookies();
	setInterval(czasMem,1000);	
});

$(document).on( "click", ".puzel", function(){
	var inx = parseInt($(this).attr("name"));
	
	if(tStartStop == 0)
	{
		tStartStop = new Date();
	}
	
	if(statusTab[inx]!=2)
	{
		ileKlik++;
		if(ileKlik==1)
		{
			statusTab[inx]=1;
			lastKlik = inx;
			rysuj();
		} else if(ileKlik==2)
		{
			if(tab[lastKlik]==tab[inx] && inx!=lastKlik){
				statusTab[lastKlik]=2;
				statusTab[inx]=2;
				rysuj();
			} else {
				statusTab[inx]=1;
				rysuj();
				statusTab[lastKlik]=0;
				statusTab[inx]=0;
				setTimeout(function()
				{rysuj();}, 2000);			
			}
			ileKlik=0;
		}
	}
});

function createCookie(name, value)
{
	document.cookie = name+"="+value+"; path=/";
}//createCookie

function readCookie(name)
{
	var nameC = name+"=";
	var allCookies = document.cookie.split(';');
	for(var i=0;i<allCookies.length;i++)
	{
		var c = allCookies[i];
		if(c.charAt(0)==" ")
			c = c.substring(1,c.length);
		if(c.indexOf(nameC)==0)
		{
			return c.substring(nameC.length,c.length);
		}
	}
}//readCookie

function readCookies()
{
	var wyniki = new Array();
	for(var i=4;i<=20;i=i+2)
	{
		var wartC = readCookie(i);
		if(wartC)
		{
			wyniki.push(i+":"+wartC);
		}
		else
		{
			createCookie(i,"Anonim:99999");
			wyniki.push(i+":"+"Anonim:99999");
		}
	}
	initWyniki(wyniki);
}//readCookies

function czasMem()
{
	var currTime = new Date();
	if(tStartStop != 0)
	{
		$("#time").html(parseInt((currTime-tStartStop)/1000));
	}
}//czasMem

function initWyniki(wynik)
{
	$("#infoBox table").empty();
	var pom = $("#infoBox table");
	var pomHead = ( ($("<caption></caption>")).html("Najlepsze wyniki") );
	//pomHead.append(($("<th></th>")).html("Najlepsze wyniki"));
	pom.append(pomHead);
	pomHead = ($("<tr></tr>"));
	pomHead.append(($("<th></th>")).html("Rozmiar"));
	pomHead.append(($("<th></th>")).html("Imię"));
	pomHead.append(($("<th></th>")).html("Czas"));
	pom.append(pomHead);
	
	for(var i=0;i<wynik.length;i++)
	{
		var wynRozmiar = wynik[i].split(":");
		var pRow=$("<tr></tr>");
		for(var j=0;j<3;j++)
		{
			if(j==2)
			{
				pRow.append($("<td></td>").html(wynRozmiar[j]+" s"));
			}
			else
			{
				pRow.append($("<td></td>").html(wynRozmiar[j]));
			}
		}
		pom.append(pRow);
	}
	//pom.addClass("infoBoxTable");
}//initWyniki

function initMem(size)
{
	var upPom=size;

	tab.length=0;
	statusTab.length=0;
	ileKlik = 0;
	lastKlik =0;
	tStartStop =0;

	for(var i=0;i<upPom;i++)
	{
		tab.push(-1);
		statusTab.push(0);
	}

	for(var i=0;i<upPom/2;i++)
	{
		for(var j=0;j<2;j++)
		{
			do
			{
				var ranLos = Math.round(Math.random() * upPom);
			}
			while(tab[ranLos]!=-1)
			tab[ranLos]=i;
		}
	}

	var iloscWierszy=Math.floor(Math.sqrt(upPom));
	for(var i=0;i<iloscWierszy;i++)
	{
		var pom = $("#obszarGry");
		var pRow=$("<tr></tr>");
		for(var j=0;j<Math.ceil(upPom/iloscWierszy);j++){
			if( (i*Math.ceil(upPom/iloscWierszy)+j) < upPom ){
				pRow.append($("<td></td>"))
				.append($("<div></div>").addClass("puzel").attr('name',(i*Math.ceil(upPom/iloscWierszy))+j));
			}
		}
		pom.append(pRow);
	}
} //initMem

function rysuj()
{
	var czyKoniec = 1;
	$.each($(".puzel"),function(){
		var inx = parseInt($(this).attr("name"));
		if(statusTab[inx]==1)
		{
			czyKoniec=0;
			var name1 = 'url(./image/i'+tab[inx]+'.svg) no-repeat center center, rgba(255,180,0,0.8)'
			$(this).css('background',name1).css('background-size','80%, 100%');
		} else if(statusTab[inx]==2){
			var name1 = 'url(./image/i'+tab[inx]+'.svg) no-repeat center center, rgba(255,180,0,0.8)';
			$(this).css('background',name1).css('background-size','80%, 100%');
		} else if(statusTab[inx]==0) {
			czyKoniec=0;
			var name1 = 'url(./image/i_back_t.jpg) no-repeat';
			$(this).css('background',name1).css('background-size','100%');
		}
	});
	if(czyKoniec)
	{
		tStartStop = 0;
		//alert("Gratulacje! Wygrałeś!");
		var oldWynik = readCookie( parseInt( $( "#amount" ).val() ));
		oldWynik = oldWynik.split(":");//name on [0], score on [1] 
		var wynik = parseInt( $( "#time" ).html() );
		if(wynik<oldWynik[1])
		{
			alert("Najlepszy wynik!");
			createCookie(
						parseInt( $( "#amount" ).val() ),
						$( "#imie" ).val() + ":" + $( "#time" ).html()
					);
		}
		/*var pom = oldWynik.split(":");
		alert(pom[1]);
		var wynik = $( "#time" ).html();
		*/
		
	}
}//rysuj

