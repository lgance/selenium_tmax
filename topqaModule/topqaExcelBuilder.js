const XLSX = require('xlsx');

const fs = require('fs');
const path= require('path');
const moment =require('moment');

// https://github.com/sheetjs/js-xlsx

// Cell Object
// Cell objects are plain JS objects with keys and values following the convention:

// Key	Description
// v	raw value (see Data Types section for more info)
// w	formatted text (if applicable)
// t	type: b Boolean, e Error, n Number, d Date, s Text, z Stub
// f	cell formula encoded as an A1-style string (if applicable)
// F	range of enclosing array if formula is array formula (if applicable)
// r	rich text encoding (if applicable)
// h	HTML rendering of the rich text (if applicable)
// c	comments associated with the cell
// z	number format string associated with the cell (if requested)
// l	cell hyperlink object (.Target holds link, .Tooltip is tooltip)
// s	the style/theme of the cell (if applicable)

// test Dummy Node 
const topqaTestCase = require('./testCase');

function makeDir(path){
      fs.mkdirSync(path,{mode:0777});
      console.log(`'Create Folder '${path} `);
}


function zeroPrint(input,digits){
    let display = '';

    let inputLength = input.toString().length;
    let loop = digits-inputLength;
    
    if(inputLength < digits){
      for(let i=0;i<loop;i++){
        display+='0';
      }
    }
    return display+input;
};



function makeExcelReport(testResultArray){

  
  const dirPath = path.join(__dirname,'../topqaExcel');
  !fs.existsSync(dirPath) ?  makeDir(dirPath) : console.log('폴더 미생성');

  let date_ = moment().format('YYYY_MM_DD');
  let excelName = dirPath+'/topqaResult_'+date_+'.xlsx';

  const automationSheetName ="TOP_Automation_Test_Result";
  const regressionSheetName="TOP_Regression_Test_Result";
  /* this line is only needed if you are not adding a script tag reference */
  if(typeof XLSX == 'undefined') XLSX = require('xlsx');
  /* Checked result xlsx */
  if(!!fs.existsSync(excelName)){
      console.log('엑셀 있음');
      // read workbook
      const workbook = XLSX.readFile(excelName,{
              cellStyles:true
      });
      let address_of_cell = 'A1';
      
      /* Get worksheet */
      let autoWorkSheet = workbook.Sheets[automationSheetName];
      let regWorkSheet = workbook.Sheets[regressionSheetName];
      
      /* Find desired cell */
      let desired_cell = worksheet[address_of_cell];
      
      /* Get the value */
      let desired_value = (desired_cell ? desired_cell.v : undefined);

  }
  else{
      console.log('테스트 결과가 없습니다. excel 을 생성합니다.');
          
          let lastLength = parseInt(testResultArray[testResultArray.length-1].tcNum.split('_')[1]);
          let regressionArr = [];
          topqaTestCase.reduce((prev,c,i,a) =>{
                  let tcNum = "TOP_"+zeroPrint(prev,4);
                  regressionArr.push({
                      "contents":c.contents,
                      "msg":"",
                      "result":"",
                      "tc":c.ims.toString(),
                      "tcNum":tcNum,
                      "type":"regression"
                  })

                  return ++prev;
          },++lastLength);

        /* make the worksheet */
        const automationWorkSheet = XLSX.utils.json_to_sheet(testResultArray);
        const regressionWorkSheet = XLSX.utils.json_to_sheet(regressionArr);
        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, automationWorkSheet,automationSheetName);
        XLSX.utils.book_append_sheet(wb, regressionWorkSheet,regressionSheetName,)

        /* generate an XLSX file */
        XLSX.writeFile(wb, excelName, {cellStyles:true});
  }
  // 
  // const firstWSheet = workbook.Sheets[firstWSheetName];
  // const workbook = xlsx.readFile('a.xlsx');

  // console.log(firstWsheet['A1'].v);
  // xlsx.writeFile(workbook,'out.xlsx');
}

// makeExcelReport();

module.exports = {
    makeExcelReport,
}





