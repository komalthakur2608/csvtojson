var readline = require('readline');
var fs = require('fs');

var rl = readline.createInterface({
  input: fs.createReadStream('Indicators.csv')
});
/*code to convert Indicator.csv into json of form :
* [
	{
		countryName : val,
		code :value
	}
]
*
*/

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
		if(countries.indexOf(countryName)<0) {
			countries.push(countryName);
			countryTotal = {};
			countryTotal['countryName'] = countryName ;
			countryTotal['total'] = 0 ;
			mainArray .push(countryTotal);
		}

		if(indicatorCode == 'SP.DYN.LE00.IN')
		{
			for(var i = 0; i<mainArray .length ; i++){
				if(mainArray[i]['countryName'] == countryName) {
					mainArray[i]['total'] = parseFloat(mainArray[i]['total']) + parseFloat(indicatorValue);
				}
			}
		}
	}

	}
  
  lineNum++;
});

//writing to data1.json when read stream is closed.

rl.on('close', function(){ 
	// sorting the array in decreasing order according to the value of total
	mainArray.sort(function(a, b) {
		return b['total'] - a['total'];
	});
	var finalJson = [];

	//creating json of top 5 objects in mainArray
	for(var i = 0; i<5; i++) {
		finalJson.push(mainArray[i]);
	}

	fs.writeFile("data1.json", JSON.stringify(finalJson), function(err, data){

		if(err) {
			console.log(err);
		}
	})
});