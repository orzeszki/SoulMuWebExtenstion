jSoul(document).on('linksloaded', function(){
    let url = new URL(window.location.href);
    let charname = url.searchParams.get('char');
    let build = getBuild(charname);

    if(build != null && !build.active)
    {
        console.log(build);
        //calculateStats(build.reset * build.ppr)
    }
});