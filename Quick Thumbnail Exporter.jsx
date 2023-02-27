var rootFolder = Folder("C:/Users/Natel/Downloads/CINEPUNCH for DaVinci Resolve/CINEPUNCH for DaVinci Resolve/CINEPUNCH.dra/MediaFiles");

var styleFolders = rootFolder.getFiles();
var subFolders = [];

for(var f = 0; f < styleFolders.length; f++) {
    $.writeln(styleFolders[f].fsName);
    $.writeln("f = " + f.toString() + "/"+(styleFolders.length-1).toString());
    subFolders = styleFolders[f].getFiles();
for(var s = 0; s < subFolders.length; s++) {
    $.writeln(subFolders[s].fsName);
    $.writeln("s = " + s.toString() + "/"+(subFolders.length-1).toString());
    main(subFolders[s]);
}
}

function main(folder) {
    $.writeln("start main");
var files = folder.getFiles();

app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);

var items = [];
var comp, layer, rqItem, module;
for(var i = 0; i < files.length; i++) {
    if(files[i].name.toLowerCase().indexOf(".mp4") != -1 || files[i].name.toLowerCase().indexOf(".mov") != -1 || files[i].name.toLowerCase().indexOf(".jpg") != -1 || files[i].name.toLowerCase().indexOf(".png") != -1) {
        $.writeln(files[i].name);
    items.push(app.project.importFile(new ImportOptions(files[i])));
    }
    }

//app.beginUndoGroup("Thumbnail Process");
var duration = 3;
for(var i = 0; i < items.length; i++) {
    if(items[i].duration != 0) duration = items[i].duration;
    comp = app.project.items.addComp(items[i].name.slice(0, -4), items[i].width, items[i].height, 1, duration, 30);
    layer = comp.layers.add(items[i]);
    comp.workAreaStart = comp.duration/2;
    comp.workAreaDuration = comp.frameDuration;
    rqItem = app.project.renderQueue.items.add(comp);
    
    module = rqItem.outputModules[1];
    module.file = File(folder.fsName+"/"+comp.name+".avi");
    module.applyTemplate("JPG");
    //comp.openInViewer();
    }

app.project.renderQueue.render();

files = folder.getFiles();
for(var i = 0; i < files.length; i++) {
    if(files[i].fsName.indexOf(".jpg") != -1) {
    files[i].rename(files[i].name.replace(".MOV", "").replace("_00000", "").replace(".mp4", ""));
    }
    }
//app.endUndoGroup();

$.writeln("done");
}