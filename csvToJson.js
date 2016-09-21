var readline = require('readline');
var fs = require('fs');

var rl = readline.createInterface({
  input: fs.createReadStream('Indicators.csv')
});
/*code to convert Indicator.csv into json of form :
* [
	{
		countryName : val,
		Indicator code : val,
		Indicator code : val,
	}
]
*
*/

//asian countries array
var asianCountries=["Arab World","Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei Darussalam","Cambodia","China","Cyprus","Egypt Arab Rep.","India","Indonesia","Iran Islamic Rep.","Iraq","Israel","Japan","Jordan","Kazakhstan","Korea Dem. Rep.","Korea Rep.","Kuwait","Kyrgyz Republic","Lao PDR","Lebanon","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Philippines","Qatar","Saudi Arabia","Singapore","Sri Lanka","Syrian Arab Republic","Tajikistan","Thailand","Timor-Leste","Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam","Yemen Rep."];

var lineNum = 1;
var countries = [];
var mainArray = [];
rl.on('line', function(line){
	if(lineNum === 1) {
		console.log('Line from file:', line);
	}
	else {
		var commaRemovedLine = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});// removing comma from between the quotes
		var arr = commaRemovedLine.split(','); 
		if(arr.length == 6){ // if all columns are present

		var countryName = arr[0];
		var year = arr[4];
		var indicatorCode = arr[3];
		var indicatorValue = arr[5];
	
		if(countries.indexOf(countryName)<0 && asianCountries.indexOf(countryName.replace(/["]/g,'')) >= 0) {
			countries.push(countryName);
			var tempObj = {};
			tempObj["countryName"] = countryName;
			tempObj['SP.DYN.LE00.FE.IN'] = 0 ;
			tempObj['SP.DYN.LE00.MA.IN'] = 0 ;
			mainArray.push(tempObj);
		}

		if(countries.indexOf(countryName)>=0) {

			if(indicatorCode == 'SP.DYN.LE00.FE.IN' || indicatorCode == 'SP.DYN.LE00.MA.IN')
			{
				for(var i = 0; i<mainArray.length ; i++){
				if(mainArray[i]['countryName'] == countryName) {
					mainArray[i][indicatorCode] = parseFloat(mainArray[i][indicatorCode]) + parseFloat(indicatorValue);
				}
			}
			}
		}

		
	}

	}
  
  lineNum++;
});

//writing to data.json when read stream is closed.

rl.on('close', function(){ 

	fs.writeFile("data.json", JSON.stringify(mainArray), function(err, data){

		if(err) {
			console.log(err);
		}


	})
});