const topqa = require('./autoManager');
const {Key, Origin, Button} = require('selenium-webdriver/lib/input');

var osqa;

var globalDriver;
var commonStatus = {
    "tableview":{
        statsu:true,
        testCase:[],
        actionfilter:{},
        run:async ()=>{
            try{
              await osqa.reset();
              await osqa.lnbOpen(["Container","TableView",'테이블 이벤트 테스트']);
            // on-rowclic, on-rowdblclick, on-rowcontextmenu, on-pagechange,
            // on-rowcheck, on-headerclick , on-headerdblclick
                let _drvier = osqa.getDriver();
                let eventTableView1 = "tableview_event_test_1";
                await osqa.tableViewRowClick(eventTableView1);
                await osqa.tableViewRowDblClick(eventTableView1);
                await osqa.tableViewRowContextMenu(eventTableView1);
                await osqa.tableViewPageChange(eventTableView1);
                await osqa.tableViewRowCheck(eventTableView1);
                await osqa.tableViewHeaderClick(eventTableView1);

                // 미 동작 나중에 확인 
                // await osqa.tableViewHeaderDblClick(eventTableView1);
                
                let eventTableView2 = 'tableview_event_test_2';
                // onEdit Complete
                await osqa.tableViewRowDblClick(eventTableView2);
                await _drvier.actions({bridge:true})
                .sendKeys(Key.ENTER)
                .perform();
                
                // on-update
                await osqa.execute('Top.Dom.selectById("tableview_event_test_2").update();');
                
                // on-headercheck
                await osqa.tableViewHeaderCheck(eventTableView2);

                // on-scrollEnd  callback
                await osqa.tableViewScrollDrag("#scroll_tableview_event_test_2");

                // on-cellcontextmenu 
                await osqa.tableViewRowContextMenu(eventTableView2);
                await osqa.userWait(2500);
                console.log(await osqa.execute('return Auto.get("tableview")'));
                
            }
            catch(err){
                console.error(err);
            }
        }
    },
    "button":{
        status:false,
        run:async()=>{
            console.log('Button Test Success');
        }
    },
    "regression":{
        status:false,
        run:async()=>{
                console.log('IMS Regression Automation Test Success');
            await osqa.gnbMenuSelect('topqa');
            // regression 재현코드가 있는 ListView를  순차적으로 클릭하여
            // 테스트 코드 진행 
            await osqa.regressionListViewIteratorClick();
           // iterator ListView 

        }
    },

    // Not Use 
       // reFactoring
       "tableview_2":{
        status:false,
        testCase:[],
        actionfilter:{},
        run:async () =>{
            try{
                const targetTableViewId = 'auto_tableview';
                osqa.reset();
                // set Located Table Page
                await osqa.gnbMenuSelect('automation');
                await osqa.lnbMenuSelect('Container');
                await osqa.subMenuSelect('TableView');

                // set Located Table Page
            if(await osqa.isDisplayDOM(targetTableViewId)){
                await osqa.tableViewHeaderClick(targetTableViewId);
                await osqa.tableViewRowClick(targetTableViewId);
                await osqa.tableViewRowDblClick(targetTableViewId);
            }

                /* 테스트 코드 factory 에 submit */
                await osqa.testSubmit();
            }
            catch(err){console.warn('tableview : Run Error');}
        }
    },

};
/**
 * @param {object} testContent
 * @public 
 */
exports.init = function(testContent){
        console.warn(this);
}
/**
 * @public
 */
exports.start = async function(){
    // driver initilalize
    try{
        osqa = new topqa();
        osqa.init();
        
        // totalTest Start based on commonStatus 
        let length = Object.keys(commonStatus).length;
        let commonStatusKeyArr = Object.keys(commonStatus);
        await commonStatusKeyArr.reduce(async(prev,curr,index,arr)=>{
                const nextItem = await prev;
                await run(curr);
                await osqa.userWait(1000);
        },Promise.resolve());

    }
    catch(err){console.log(err);}
}
/**
 * 
 * @param {string} widgetName Top.js Component Name
 * @private 
 */
async function run(widgetName){
        try{
    !!commonStatus[widgetName] ?
	(commonStatus[widgetName].status===false ?
            console.warn(`is ${widgetName} not test Set`) :
			await commonStatus[widgetName].run()) :
            console.warn(`is not Test Case ${widgetName}`);
    }
    catch(err){console.log(err);}
}
/**
 * E2E Test End Point
 * get testResult report and createJunitReport 
 */
exports.quit = async function(){
    try{
        if(!osqa){
           throw new Error('not yet Start');
           return; 
        }{  
            console.log('runner is Closed');
        //    await osqa.gnbMenuSelect('integration');
           // deprecated
           //await osqa.testReport();
        //    await osqa.createJunitReport();
           await osqa.quit();
        }
    }
    catch(err){
            console.log(err.message);
            console.dir(err);
    }
}


