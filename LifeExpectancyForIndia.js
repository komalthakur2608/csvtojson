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

var lineNum = 1;
var years = [];
var mainArray = [];
rl.on('line', function(line){
	if(lineNum === 1) {
	}
	else {
		var commaRemovedLine = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});// removing comma from between the quotes
		var arr = commaRemovedLine.split(','); 
		if(arr.length == 6){ // if all columns are present

			var countryName = arr[0];
			var year = arr[4];
			var indicatorCode = arr[3];
			var indicatorValue = arr[5];
		

			if(years.indexOf(year) < 0 && countryName == 'India' && parseFloat(indicatorValue) > 0) {
				var tempObj = {};
				tempObj['year'] = year;
				mainArray.push(tempObj);
				years.push(year);
			}
			if(parseFloat(indicatorValue) > 0 && (indicatorCode == 'SP.DYN.LE00.FE.IN' || indicatorCode == 'SP.DYN.LE00.MA.IN' || indicatorCode == 'SP.DYN.LE00.IN')){
				for(var i = 0; i<mainArray.length ; i++){
					if(mainArray[i]['year'] == year) {
						mainArray[i][indicatorCode] = parseFloat(indicatorValue);
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