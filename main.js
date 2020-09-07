const jSoul = jQuery;

const statistics = ['strength', 'agility', 'vitality', 'energy', 'command'];
const classes = ['dk', 'dw', 'elf', 'dl', 'mg', 'sum'];

const event_links = new Event('linksloaded');

function getClassShortcut(classname)
{
	let shortcut = '';
	
	switch(classname.trim())
	{
		
		case 'Dark Knight': case 'Blade Knight': case 'Blade Master':
			shortcut = classes[0];
			break;
		case 'Dark Wizard': case 'Soul Master': case 'Grand Master':
			shortcut = classes[1];
			break;
		case 'Elf': case 'Muse Elf': case 'High Elf':
			shortcut = classes[2];
			break;
		case 'Dark Lord': case 'Lord Emperor':
			shortcut = classes[3];
			break;
		case 'Magic Gladiator': case 'Duel Master':
			shortcut = classes[4];
			break;
		case 'Summoner': case 'Bloody Summoner': case 'Dimension Master':
			shortcut = classes[5];
			break;
		default:
			shortcut = classes[0];
	}
	
	return shortcut;
}

jSoul(document).ready(function(){
	let char_table = $("table[width=210][height=484]");

	let charactersCount = 0;
	
	char_table.find('td[background*="nowypanel"]').each(function(index, item){
		if(jSoul(this).text().length == 0)
			return;

		charactersCount++;	

		let td_char = jSoul(this).find('td[width=120][height=65]').eq(0);
		
		let charname = td_char.find('a[href*="char"]').text();
		let charclass = getClassShortcut(td_char.find('font').eq(1).text().match(/^\D*/g)[0]);
		let charreset = parseInt(td_char.find('font').eq(1).text().match(/\d+/g)[1]);
		let pointsPerReset = getPointsForReset(charclass);

		saveOrCreateBuild(charname, {reset: charreset, ppr: pointsPerReset, class: charclass});

		if(charreset > 99)
		{
			saveOrCreateBuild(charname, {active: false});
		}
		
		let availablePoints = (charreset+1)*pointsPerReset;

		let build = getBuild(charname);

		let checkFreePoints = calculateStats(availablePoints, build.stats, true);
		let buildNeedsUpdate = !Array.isArray(checkFreePoints) && build.active;
		
		let buildLinkToAppend = buildLink(charname, charclass, charreset, buildNeedsUpdate).click(showBuildWindow);
		jSoul('td[width=190][height=15]').eq(index).append(buildLinkToAppend).css('text-align', 'center');
		buildLinkToAppend.parent().append(buildIsOn(charname))
	});
	
	if(charactersCount > 0)
		document.dispatchEvent(event_links);
})

jSoul(document).on("click", "#closeBuild", function(){
	$(this).parent().parent().remove();
})

jSoul(document).on("submit", "#buildStats", function(e){
	e.preventDefault();

	if(!updateStats(true))
		return;		

	let checkPercentage = 0;
	
	jSoul.each(jSoul('.percentInput'), function(){
		checkPercentage += parseInt($(this).val());
	});
	
	if(checkPercentage != 100 && checkPercentage != 0)
	{
		alert("Wartości procentowe muszą mieć łącznie 100%.\nBuild nie zostanie zapisany.");
		return;
	}
	
	var data = jSoul("#buildStats :input").serializeArray();
	
	let charname = jSoul("#buildStats").data('charname');
	
	saveOrCreateBuild(charname, {stats: data} );
	
	alert("Zapisano pomyślnie");
		
})

jSoul(document).on('change', '#buildStats .constInput', function(){
	jSoul(this).data('points', parseInt(jSoul(this).val()))
	updateStats();
})

jSoul(document).on('change', '#buildStats .percentInput', function(){	
	jSoul(this).data('points', parseInt(jSoul(this).val()))
	updateStats();
})

function updateStats(onSave = false)
{
	jSoul('.pointsToAdd').text('');

	let availablePoints = jSoul('.rrPoints').data('points'); // 81 000
	var data = jSoul("#buildStats :input").serializeArray();
	
	try {
		let calc = calculateStats(availablePoints, data, onSave);
		if(!Array.isArray(calc))
		{
			throw 'Nie wykorzystałeś jeszcze wszystkich punktów.\nPozostało: '+calc;
		}

		console.log(calc);
			
		calc.forEach(function(stat){
			let pointToAddColor = jSoul(`select[name="${stat.name}"]`).parent().find('.pointsToAdd');
			pointToAddColor.text(`+${stat.value}`);
		});
		return true;
	} 
	catch(e)
	{
		alert(e);
		return false;
	}
}

function calculateStats(availablePoints, stats, checkFreePoints=false)
{

	let points = [];

	let percentageStats = stats.filter(function(stat){
		return stat.name.indexOf('percent') >= 0;
	});

	percentageStats.sort(function(a, b){return b.value-a.value});

	let constStats = stats.filter(function(stat){
		return stat.name.indexOf('const') >= 0;
	});

	let pointsLeft = availablePoints;

	constStats.forEach(function(stat){
		if(stat.value > 32000)
			throw 'Jedna ze statystyk przekroczyła limit 32000 pkt.';
		else if(stat.value > pointsLeft)
			throw 'Przekroczno limit dostępnych punktów.';
		else {
			pointsLeft -= parseInt(stat.value);
			points.push({name: stat.name.replace('_const',''), value: parseInt(stat.value)});
		}
	});


	let pointsOverLimit = 0;

	percentageStats.forEach(function(stat){
		let pointsToAdd = Math.floor(stat.value/100 * pointsLeft);

		if(pointsToAdd > 32000)
		{
			pointsOverLimit += pointsToAdd-32000;
			pointsToAdd = 32000;
		}
		else
		{
			if(pointsToAdd+pointsOverLimit > 32000)
			{
				pointsOverLimit = pointsToAdd+pointsOverLimit-32000;
				pointsToAdd = 32000;
			}
			else
			{
				pointsToAdd += pointsOverLimit;
				pointsOverLimit = 0;
			}
		}

		points.push({name: stat.name.replace('_percent',''), value: pointsToAdd})
	});

	if(checkFreePoints)
	{
		if(pointsOverLimit > 0)
			return pointsOverLimit;
		if(percentageStats.length == 0 && pointsLeft > 0)
			return pointsLeft;
	}
	
	return points;
}

function buildIsOn(charname)
{
	let data = JSON.parse(localStorage.getItem(charname));
	
	return jSoul(`<span style="cursor: pointer; color: ${data.active ? 'green':'red' }; margin-left: 5px;">${data.active ? '[Włączony]' : '[Wyłączony]' }</span>`).click(function(){
		let data = JSON.parse(localStorage.getItem(charname));
		
		jSoul(this).text(!data.active ? '[Włączony]':'[Wyłączony]');
		jSoul(this).css('color', !data.active ? 'green':'red');
		
		saveOrCreateBuild(charname, {active: !data.active});	
	});
	
	
}

function buildLink(charname, charclass, charreset, buildNeedsUpdate)
{
	return jSoul(`${buildNeedsUpdate ? '<span class="needsUpdate">[UPDATE]</span>':''}`+'<a class="buildWindowLink" href="#buildWindow">Build postaci</a>').data('charname', charname).data('charclass', charclass).data('charreset', charreset);
}

function showBuildWindow(e)
{
	let charname = jSoul(e.target).data('charname');
	let charclass = jSoul(e.target).data('charclass');
	let charreset = jSoul(e.target).data('charreset');
	
	jSoul('body').append(jSoul(buildWindow(charname, charreset, charclass)));
	
	jSoul.each(statistics, function(){
		
		if(this == 'command' && charclass != 'dl')
			return;
		
		let stat = jSoul(`<div class="statistic"><span>${this}</span><div class="pointsToAdd"></div></div>`);
		
		let select_list = jSoul(selectList()).attr('name', this).change(function(){
			updateSelectList(this);
			
			updateStats();
		});
		
		jSoul('#buildStats').append(stat.append(select_list));
	});
	
	loadBuild(charname)
	
	jSoul('#buildStats').append(`<div style="text-align: center"><button>Zapisz build</button></div>`);
}

function updateSelectList(list)
{
	let selectedOption = $(list).prop('selectedIndex');
			
	jSoul(list).parent().find('.optionExt').remove();
	jSoul(list).parent().find('.pointsToAdd').text('');
	
	switch(selectedOption)
	{
		case 1: {jSoul(list).after(`<span class="optionExt"><input class="constInput" name="${jSoul(list).attr('name')+'_const'}" type="number" min="1" max="32000" value="0">p.</input></span>`);break;}
		case 2: {
			jSoul(list).after(`<span class="optionExt"><input class="percentInput" name="${jSoul(list).attr('name')+'_percent'}" type="number" min="1" max="100" value="0" title="Procent punktów z pozostałej puli">%</input></span>`);
			break;
		}
	}
}

function buildWindow(charname, charreset, charclass)
{
	return `
		<div class="buildWindowOverlay">
			<div class="buildWindow">
				<span id="closeBuild"></span>
				<div class="content">
					<img class="charImage" src="${chrome.runtime.getURL(`icons/${charclass}.jpg`)}">
					<div class="charDetails">
						<span>${charname}</span>
						<small style="font-style: italic">${charreset}rr</small>
						<div class="rrPoints" data-points="${(charreset+1)*getPointsForReset(charclass)}">Następny res:<br>${(charreset+1)*getPointsForReset(charclass)} pkt.</div>
						
					</div>
				</div>
				<div class="content">
					<form id="buildStats" data-charname="${charname}" data-charreset="${charreset}">
					</form>
				</div>
			</div>
		</div>
		`;
}

function selectList()
{
	return `
	<select>
		<option value="0">Nie dodawaj nic</option>
		<option value="1">Stała ilość</option>
		<option value="2">Dynamiczna ilość</option>
	</select>
	`
}

function getBuild(charname)
{
	if(localStorage.getItem(charname) != null)
		return JSON.parse(localStorage.getItem(charname));
	
	return null;
}

function loadBuild(charname)
{
	let build = getBuild(charname);

	if(build != null)
	{
		let stats_from_storage = build;
		
		stats_from_storage.stats.forEach(function(item){
			
			if(item.name.indexOf('_') > -1)
				return;
			
			jSoul(`select[name=${item.name}]`).val(item.value);
		});
		jSoul.each(jSoul('#buildStats select'), function(){
			updateSelectList(this);
		});
		
		stats_from_storage.stats.forEach(function(item){
			
			if(item.name.indexOf('_') == -1)
				return;
			
			jSoul(`input[name=${item.name}]`).val(item.value);
		});
		
		if(stats_from_storage.stats.length > 0)
			updateStats();
	}
}

function saveOrCreateBuild(charname, dataToSave=null)
{
	if(localStorage.getItem(charname) == null)
	{
		localStorage.setItem(charname, JSON.stringify(jSoul.extend({active: false, stats:[]}, dataToSave)));
	}
	else
	{
		if(dataToSave == null)
			return;
		
		let data = JSON.parse(localStorage.getItem(charname));
		jSoul.extend(data, dataToSave);
		
		localStorage.setItem(charname, JSON.stringify(data));
	}
}

function getPointsForReset(charclass)
{
	let points = 1000;
	
	switch(charclass)
	{
		case 'dl': case 'mg':
			points = 1200;
			break;
	}
	
	return points;
}