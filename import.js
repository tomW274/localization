// The following imports back all text boxes content into an illustrator file
// September 30, 2024, Hanqiu Wang

var xmlFile = File.openDialog("Select the XML file with translated text");
if (xmlFile) {
    xmlFile.open("r");
    var xmlContent = xmlFile.read();
    xmlFile.close();
    
    var xmlDoc = new XML(xmlContent); 
    var doc = app.activeDocument;

	/*for each (var textFrame in xmlDoc.TextFrame) {
		alert(textFrame.TextID);
	}
	*/
    for each (var textFrame in xmlDoc.TextFrame) {
        var textID = parseInt(textFrame.TextID);
        var layerName = textFrame.LayerName; 
        var translatedContent = textFrame["trans-unit"]; 
		// Because variable name "trans-unit" contains a hyphen which is not allowed in identifiers. 
		// Need to use bracket notation textFrame["trans-unit"] to access it. 
		
        var targetLayer = doc.layers[layerName];

        if (targetLayer) {
            var textFrames = targetLayer.pageItems; 
            
            if (textID < textFrames.length) {
                var item = textFrames[textID];
                
                if (item.typename === "TextFrame") {
                    // Update contents with translated text
                    item.contents = translatedContent.replace(/&#10;/g, "\n"); // Restore line breaks
                } else {
                    alert("Item is not a TextFrame for TextID: " + textID);
                }
            } else {
                alert("TextID " + textID + " is out of bounds for layer: " + layerName);
            }
        } else {
            alert("Layer not found: " + layerName);
        }
    }
    alert("Text insertion complete!");
} else {
    alert("No XML file selected.");
}
