jSoul(document).on('linksloaded', function(){
    let url = new URL(window.location.href);
    let charname = url.searchParams.get('char');
    let build = getBuild(charname);
    let resetSuccess = jSoul('center:contains(resetowana)').length > 0;

    if(build != null && build.active && resetSuccess)
    {
        let ptkstart = (build.reset+1)*build.ppr; //+1 do rr, bo strona od resa nie aktualizuje od razu jego wartosci do nowej
        let ptkend = 0;
        let points = calculateStats(ptkstart, build.stats);

        let prepare_stats = [];

        statistics.forEach(function(stat){
            prepare_stats[stat] = 0;
        });

        points.forEach(function(stat){
            prepare_stats[stat.name] = stat.value;
            ptkend += stat.value;
        });

        ptkend = ptkstart - ptkend;

        if(points.length > 0)
        {
            jSoul.post('http://soulmu.pl/index.php?strona=mupageaccount/rozdaj&char='+charname,
            `str=20&agl=20&vit=20&enr=20&com=${build.class=='dl' ? 20 : 0}&ptkstart=${ptkstart}&ptkend=${ptkend}&stradd=${prepare_stats['strength']}&agladd=${prepare_stats['agility']}&vitadd=${prepare_stats['vitality']}&enradd=${prepare_stats['energy']}&comadd=${prepare_stats['command']}&chr2=${charname}`)
            .done(function(data){
                let message = jSoul(data).find('center:contains(rozdane)');
                if(message.length == 0)
                    alert("Wystąpił błąd, punkty musisz dodać ręcznie.");
                else
                {
                    jSoul('center:contains(resetowana)').last().before(`<div style="color:lime; text-align: center;">Punkty rozdano wg buildu.</div>`);
                }
            })
            .fail(function(){
                alert("Automatyczne dodawanie punktów nie powiodło się.");
            });
        }
        else
        {
            alert('Masz włączony build dla tej postaci, ale nie jest skonfigurowany.');
        }
    }
    else
        console.log('Build jest nieaktywny albo brak');
});