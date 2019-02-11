/*

    ***** Pass Test Case
    <testsuite>
        <testcase classname="casebind" name="testName"></testcase>
    </testsuite>

        ***** Fail Test Case
    <testsuite>
        <testcase classname="casebind" name="testName">
            <failure type="test">Error Message</failure>
        </testcase>
    </testsuite>
*/

const builder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');
const xmlHeader="<?xml version='1.0' encoding='UTF-8'?>";

// Create Test Dir
function makeDir(path){
    fs.mkdirSync(path,{mode:0777});
}
//  write file junit-testCase.xml 
function makeJunitReportFile(xmlContent,path,testCase){
    // console.log(testCase); // 2018-11-23 잠시 막음
    let fd = fs.openSync(path+'/junit-'+testCase+'.xml','w');
    fs.writeFileSync(fd,xmlContent,{encoding:"utf-8"});
}

function _isArray (array){
    if((!!array && (array.length !==0 && typeof array.length!=="undefined"))){
		// [1] 의 배열도 return 이 되는데 이건 추후 생각 
		return array;
    }
	else{
		return false;
    }
}
function makeJunitReport(testResultArray){
    const array = _isArray(testResultArray);
    if(array===false){return;}

    
    // console.log(array); 2018-11-23 잠시 막음 
    // // File Write for junit-*.xml
    const dirPath = path.join(__dirname,'../chromeBuilding');
    !fs.existsSync(dirPath) ? makeDir(dirPath) : console.log('폴더 미생성');

        testResultArray.reduce((acc,curr,index,arr) =>{
            let junitObj = {
                'testsuite': {
                    'testcase':{
                        '@classname':curr.tc,
                        '@name':curr.tc,
                    }
                }
            };
            // fail Case
            if(curr.result.toLowerCase()==='fail' || curr.result.toLowerCase()==='block'){
                let failObj  = {
                    '#text':curr.msg,
                    '@type':curr.result.toLowerCase() + 'Case'
                };
                junitObj.testsuite.testcase['failure'] = failObj
            }
            // xml Create
            const junit = builder.create(junitObj,{encoding:'utf-8'});
            // Create xml pretty change
            const xmlContent = junit.end({pretty:true});
            if(curr.tc.length>=1){
                makeJunitReportFile(xmlContent,dirPath,curr.tc);
            }
            
        },0);
        console.warn('test Result reporting Complete');
}
function api(){console.log('api')}

module.exports = {
    makeJunitReport,
    api
}



