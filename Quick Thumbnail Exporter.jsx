var folder = Folder("G:/Stock Utilities/NT Productions/Ink/Raw Footage");
main(folder);

function main(folder) {
    
var files = folder.getFiles();

var items = [];
var comp, layer, rqItem, module;
for(var i = 0; i < files.length; i++) {
    items.push(app.project.importFile(new ImportOptions(files[i])));
    }

//app.beginUndoGroup("Thumbnail Process");

for(var i = 0; i < items.length; i++) {
    comp = app.project.items.addComp(items[i].name, items[i].width, items[i].height, 1, items[i].duration, items[i].frameRate);
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
    files[i].rename(files[i].name.replace(".MOV", "").replace("_00000", ""));
    }
    }
//app.endUndoGroup();
}