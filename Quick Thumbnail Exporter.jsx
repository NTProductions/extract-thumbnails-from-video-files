var window = new Window("palette", "Quick Thumbnail Exporter", undefined);
window.orientation = "column";
var gOne = window.add("group", undefined, "gOne");
gOne.orientation = "row";
var folderInput = gOne.add("edittext", undefined, "Choose a folder");
folderInput.size = [220, 20];
var folderButton = gOne.add("button", undefined, "...");
folderButton.size = [20, 20];

var gTwo = window.add("group", undefined, "gTwo");
gTwo.orientation = "row";
var exportButton = gTwo.add("button", undefined, "Export");
var allFiles = [];

folderButton.onClick = function() {
    var f = new Folder;
    f = f.selectDlg("Select the source folder of footage");
    
    if(f.exists) {
        folderInput.text = f.fsName.replace(/%20/g, " ").replace(/\\/g, "/");
        } else {
            alert("No folder selected!", "NTProductions");
            return false;
            }
    }

exportButton.onClick = function() {
        if(Folder(folderInput.text).exists) {  
            allFiles = [];
            extractThumbs(Folder(folderInput.text));
            app.project.renderQueue.render();
            
            try {
                
               for(var a = 0; a < allFiles.length; a++) {
                   //$.writeln(allFiles[a].fsName);
                   allFiles[a].rename(allFiles[a].name.replace(".MOV", "").replace("_00000", "").replace(".mp4", ""));
                   }
               } catch(ee) {
    $.writeln(ee);
    }
            alert("done");
            }
    }

window.center();
window.show();

function extractThumbs(rootFolder) {
    //var rootFolder = Folder("C:/Users/Natel/Downloads/Premiere Pro FX Fixes/Premiere Pro FX Fixes/Music Scores");

    var styleFolders = rootFolder.getFiles();
    var subFolders = [];
    var subSubFolders = [];

    for(var f = 0; f < styleFolders.length; f++) {
        subFolders = [];
        if(styleFolders[f] instanceof Folder) {
            subFolders = styleFolders[f].getFiles();
            } else { // is a file
                main(styleFolders[f], true);
                }
        if(subFolders.length > 0) {
            for(var s = 0; s < subFolders.length; s++) {
                subSubFolders = [];
                if(subFolders[s] instanceof Folder) {
                    subSubFolders = subFolders[s].getFiles();
                        for(var ss = 0; ss < subSubFolders.length; ss++) {
                            if(subSubFolders[ss] instanceof File) {
                                main(subSubFolders[ss], true);
                                }
                            }
                    } else { // is a file
                        main(subFolders[s], true);
                        }
            }
        }
    }

function main(folder, isFileBool) {
    try {
    var files = [];
    var thisFolder;

    if(isFileBool) {
        files = [folder];
        thisFolder = folder.fsName.replace(/%20/g, " ").replace(/\\/g, "/");
        if(thisFolder.indexOf("/") != -1) {
            thisFolder = thisFolder.slice(0, thisFolder.lastIndexOf("/"));
            } else {
            thisFolder = thisFolder.slice(0, thisFolder.lastIndexOf("\\"));
               }
        } else {
        files = folder.getFiles();
        thisFolder = folder;
           }

    //app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);

    var items = [];
    var comp, layer, rqItem, module;
    for(var i = 0; i < files.length; i++) {
        if(files[i].name.toLowerCase().indexOf(".mp4") != -1 || files[i].name.toLowerCase().indexOf(".mov") != -1) {
            var ext = files[i].fsName.replace(/%20/g, " ");
            ext = ext.slice(-4, ext.length);
            allFiles.push(File(files[i].fsName.replace(/%20/g, " ").replace(ext, "_00000.jpg")));
            items.push(app.project.importFile(new ImportOptions(files[i])));
        }
        }
    
    //app.beginUndoGroup("Thumbnail Process");
    var duration = 3;
    if(items.length > 0) {
    for(var i = 0; i < items.length; i++) {
        duration = items[i].duration;
        comp = app.project.items.addComp(items[i].name.slice(0, -4), items[i].width, items[i].height, 1, duration, 30);
        layer = comp.layers.add(items[i]);
        if(duration/2 > comp.frameDuration) {
        comp.workAreaStart = comp.duration/2;
        comp.workAreaDuration = comp.frameDuration;
        }
        rqItem = app.project.renderQueue.items.add(comp);
        
        module = rqItem.outputModules[1];
      
        module.file = File(thisFolder+"/"+comp.name+".avi");
        module.applyTemplate("JPG");
        //comp.openInViewer();
        }
    
    
} catch(e) {
    $.writeln(e);
    }
    //alert("done");
    }

}