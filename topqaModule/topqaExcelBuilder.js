// is not Styling
const XLSX = require('xlsx');

// is Styling
const XL = require('excel4node');

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



function makeExcelReport(testResultArray,browserType){

  
  const _browserType = browserType || 'chrome';
  console.log(`테스트 결과 Browser는 ${_browserType} 입니다.`);
  const dirPath = path.join(__dirname,'../topqaExcel');
  !fs.existsSync(dirPath) ?  makeDir(dirPath) : console.log('폴더 미생성');

  let date_ = moment().format('YYYY_MM_DD');
  let excelName = `${dirPath}/topqaResult_${date_}_${_browserType}.xlsx`;

  const automationSheetName ="TOP_Automation_Test_Result";
  const regressionSheetName="TOP_Regression_Test_Result";
  /* this line is only needed if you are not adding a script tag reference */
  if(typeof XLSX == 'undefined') XLSX = require('xlsx');
  /* Checked result xlsx */
  if(!!fs.existsSync(excelName)){
      // read workbook
      const workbook = XLSX.readFile(excelName,{
              cellStyles:true
      });
      let address_of_cell = 'A1';
      
      /* Get worksheet */
      let autoWorkSheet = workbook.Sheets[automationSheetName];
      let regWorkSheet = workbook.Sheets[regressionSheetName];
      
      console.log('엑셀이 있습니다.');

  }
  else{
      console.log('테스트 결과가 없습니다. excel 을 생성합니다.');
     
      let wb = new XL.Workbook();

      // Excel Setting Options and Styles
      let options = {

      }
      let topqaStyle = wb.createStyle({
          font:{
              bold:true,
          },
          alignment:{
               horizontal:'center'
          },
          border:{
            left:{
              style:'thin',
              color:'#000000'
            },
            right:{
              style:'thin',
              color:'#000000'
            },
            top:{
              style:'thin',
              color:'#000000'
            },
            bottom:{
              style:'thin',
              color:'#000000'
            }
          }
      });


      // add Work Sheet
      let automationWorkSheet = wb.addWorksheet(automationSheetName,options);
      let regressionWorkSheet = wb.addWorksheet(regressionSheetName,options);
      
      let headerColumnName = ["내용","실패 메시지","테스트 결과","테스트 케이스","테스트 넘버링","테스트 타입"];
      let headerColumnNameLength = headerColumnName.length;
      let columnWidth = 30;

      // Work Sheet Settings
      for(let i=1;i<=6;i++){
        automationWorkSheet.column(i).setWidth(columnWidth);
        automationWorkSheet.cell(1,i)
          .string(headerColumnName[i-1])
          .style(topqaStyle);

        regressionWorkSheet.column(i).setWidth(columnWidth);
        regressionWorkSheet.cell(1,i)
          .string(headerColumnName[i-1])
          .style(topqaStyle);
     };

      //contents , msg      resutl,        tc,          tcNum,       type
      let automationLength = testResultArray.length+2;
      let headerColumnObjectKey = Object.keys(testResultArray[0]);

      testResultArray.forEach((item,index,arr) =>{
          let cellIndex = index+2;
          for(let i=1;i<=headerColumnNameLength;i++){
             automationWorkSheet.cell(cellIndex,i)
                .string(item[headerColumnObjectKey[i-1]]);
          }
      });

      let lastLength = parseInt(testResultArray[testResultArray.length-1].tcNum.split('_')[1]);
      let tcNum = "TOP_"+zeroPrint(++lastLength,4);
       // regression test Result set to Excel
       topqaTestCase.reduce((prev,curr,index,arr)=>{
            let cellIndex = index+2;
            let tcNum = "TOP_"+zeroPrint(prev,4);
            let topqaObj = {
                contents:curr.contents,
                msg:"",
                result:"",
                tc:curr.ims.toString(),
                tcNum:tcNum,
                type:"regression"
            }
            for(let i=1;i<headerColumnNameLength;i++){
                regressionWorkSheet.cell(cellIndex,i)
                .string(topqaObj[headerColumnObjectKey[i-1]]);
            }
            return ++lastLength;
      },++lastLength);
    
      wb.write(excelName);

     
  }

}
makeExcelReport();

module.exports = {
    makeExcelReport,
}





