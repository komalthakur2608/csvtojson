var readline = require('readline');
var fs = require('fs');

var rl = readline.createInterface({
  input: fs.createReadStream('Indicators.csv')
});
/*code to convert Indicator.csv into json of form :
* [
	{
		countryName : val,
		code :value,
		count : 
	}
]
*
*/

var lineNum = 1;
var countries = [];
var mainArray = [];
var header = [];
rl.on('line', function(line){
	if(lineNum === 1) {
		header = line.split(',');
	}
	else {
		var commaRemovedLine = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});// removing comma from between the quotes
		var arr = commaRemovedLine.split(','); 
		if(arr.length == 6){ // if all columns are present

			var countryName = arr[header.indexOf('CountryName')];
			var year = arr[header.indexOf('Year')];
			var indicatorCode = arr[header.indexOf('IndicatorCode')];
			var indicatorValue = arr[header.indexOf('Value')];
			
			if(countries.indexOf(countryName)<0) {
				countries.push(countryName);
				countryTotal = {};
				countryTotal['countryName'] = countryName ;
				countryTotal['total'] = 0 ;
				countryTotal['count'] = 0;
				mainArray .push(countryTotal);
			}

			if(indicatorCode == 'SP.DYN.LE00.IN')
			{
				for(var i = 0; i<mainArray .length ; i++){
					if(mainArray[i]['countryName'] == countryName) {
						mainArray[i]['total'] = parseFloat(mainArray[i]['total']) + parseFloat(indicatorValue);
						if(indicatorValue > 0) {
							mainArray[i]['count'] = mainArray[i]['count'] + 1;
						}
					}
				}
			}
		}
	}
  
  lineNum++;
});

//writing to data1.json when read stream is closed.

rl.on('close', function(){ 
	
	//forcalculating average
	for(var i = 0; i<mainArray.length; i++) {
		mainArray[i].total = mainArray[i].total/mainArray[i].count;
		
	}

	// sorting the array in decreasing order according to the value of total
	mainArray.sort(function(a, b) {
		return b['total'] - a['total'];
	});

	var finalJson = [];

	//creating json of top 5 objects in mainArray
	for(var i = 0; i<5; i++) {
		finalJson.push(mainArray[i])
	}
	
	fs.writeFile("JsonData_TopFiveCountries.json", JSON.stringify(finalJson), function(err, data){

		if(err) {
			console.log(err);
		}
	})
});