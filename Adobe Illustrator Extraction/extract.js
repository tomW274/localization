// The following extracts all text boxes content from an illustrator file
// September 30, 2024, Hanqiu Wang

var doc = app.activeDocument;

var originalFilePath = doc.fullName; 
var originalFileName = doc.name; 

// Create the XML file path based on the Illustrator file path
var exportPath = originalFilePath.parent.fsName + "/" + originalFileName + ".xml";

var file = new File(exportPath);
file.open("w", "UTF-8"); 
file.encoding = "UTF-8"; 
//This ensures support for non-English characters

file.writeln("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
file.writeln("<concept>");

var activeLayer = doc.activeLayer; 

for (var i = 0; i < activeLayer.pageItems.length; i++) {
    var item = activeLayer.pageItems[i];
    
    if (item.typename === "TextFrame") {
        var x = item.position[0];
        var y = item.position[1];

		//Extraction of text from boxes is usually polluted by line breaks, we need the following action to take care of them.
        var content = item.textRange.contents;
		content = content.replace(/&/g, "&amp;");
        content = content.replace(/\r\n/g, "&#10;") // Windows line breaks
                         .replace(/\n/g, "&#10;")  // Unix line breaks
                         .replace(/\r/g, "&#10;")  // Mac line breaks
                         .replace(/\x03/g, "&#10;"); // Remove ETX character (End of Text)
		
		file.writeln("  <TextFrame>");
		file.writeln("    <TextID translate='no'>" + i + "</TextID>");
		file.writeln("    <LayerName translate='no'>" + activeLayer.name + "</LayerName>");
		file.writeln("    <X translate='no'>" + x + "</X>");
		file.writeln("    <Y translate='no'>" + y + "</Y>");
		file.writeln("    <trans-unit>" + content + "</trans-unit>");
		file.writeln("  </TextFrame>");
    }
}
file.writeln("</concept>");
file.close();
alert("Text extraction complete! Check the output file.");
