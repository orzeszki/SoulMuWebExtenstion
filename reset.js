jSoul(document).on('linksloaded', function(){
    let url = new URL(window.location.href);
    let charname = url.searchParams.get('char');
    let build = getBuild(charname);

    if(build != null && build.active)
    {
        let ptkstart = 1*build.ppr;
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

       // console.log(prepare_stats);

        if(points.length > 0)
        {
            jSoul.post('http://soulmu.pl/index.php?strona=mupageaccount/rozdaj&char='+charname,
            `str=18&agl=18&vit=15&enr=30&com=0&ptkstart=${ptkstart}&ptkend=${ptkend}&stradd=${prepare_stats['strength']}&agladd=${prepare_stats['agility']}&vitadd=${prepare_stats['vitality']}&enradd=${prepare_stats['energy']}&comadd=${prepare_stats['command']}&chr2=${charname}`)
            .done(function(data){
                if(jSoul(data).find('center:contains(rozdane)').length == 0)
                    alert("Wystąpił błąd, punkty musisz dodać ręcznie.");
            })
            .fail(function(){
                alert("Automatyczne dodawanie punktów nie powiodło się.")
            });
        }
    }
});