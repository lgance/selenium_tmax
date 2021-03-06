const topqa = require("./autoManager");

const { Key, Origin, Button } = require("selenium-webdriver/lib/input");

const { LinearLayoutTestRunner }  = require('./ExternalTestRunner/linearlayoutTestRunner');
const { FoldingLayoutTestRunner } = require('./ExternalTestRunner/foldinglayoutTestRunner');
const { TabLayoutTestRunner}  = require('./ExternalTestRunner/tablayoutTestRunner');
// foldinglayout, linearlayout external TestCode



var osqa;
var globalDriver;
var commonStatus = {
  api: {
    status: true,
    name: "api",
    run: async () => {
      try {
      
        // this is Wait Trick
        await osqa.gnbMenuSelect("api");
        await osqa.gnbMenuSelect("automation");
        await osqa.execute("factory.syncAPIAutomation();");
      } catch (err) {
        console.error(err);
      }
    }
  },
  tablayout:{
    status:true,
    name:"tablayout",
    run:async () =>{

      // getCurrentDriver

      let _driver = osqa.getDriver();
      // Event Test
        await osqa.lnbOpen(["Layout","TabLayout","탭 레이아웃 이벤트"]);
        await TabLayoutTestRunner.tablayoutEventTestRun(_driver,osqa);

      // API Test
        await osqa.lnbOpen(["Layout","TabLayout","탭 레이아웃 API 테스트"]);
        await TabLayoutTestRunner.tablayoutAPITestRun(_driver,osqa);

      // Test Complete push in Factory Module
        await osqa.execute('return Auto.syncFactory("tablayout")');

    }
  },
  // soo 
  linearlayout:{
    status:true,
    name:"linearlayout",
    run:async () =>{
      // Event Test
        await osqa.lnbOpen(["Layout","LinearLayout","리니어레이아웃 이벤트"]);
        await LinearLayoutTestRunner.linearlayoutEventTestRun();

      // API Test
        await osqa.lnbOpen(["Layout","LinearLayout","리니어레이아웃 API"]);
        await LinearLayoutTestRunner.linearlayoutAPITestRun();

      // Test Complete push in Factory Module
        await osqa.execute('return Auto.syncFactory("linearlayout")');
    }
  },
  // "dong"
  foldinglayout:{
    status:true,
    name:"foldinglayout",
    run:async () =>{

      // Event Test
        await osqa.lnbOpen(["Layout","FoldingLayout","폴딩레이아웃 이벤트"]);
        await FoldingLayoutTestRunner.foldingEventTestRun();
    

      // API Test
        await osqa.lnbOpen(["Layout","FoldingLayout","폴딩레이아웃 API"]);
        await FoldingLayoutTestRunner.foldingAPITestRun();


     // Test Complete push in Factory Module
        await osqa.execute('return Auto.syncFactory("foldinglayout")');
    }
  },
  radiobutton: {
    status: true,
    name: "radiobutton",
    run: async () => {
      // API 테스트
      await osqa.lnbOpen(["Controls", "RadioButton", "라디오 API 테스트"]);
      await osqa.topButtonClick("radioButtonAPI");
      await osqa.userWait(2500);

      // adding TestCase Repo
      await osqa.execute('return Auto.syncFactory("radiobutton")');
    }
  },
  tableview: {
    status: true,
    testCase: [],
    name: "tableview",
    actionfilter: {},
    run: async () => {
      try {

        await osqa.lnbOpen(["Container", "TableView", "테이블 이벤트 테스트"]);
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



        let eventTableView2 = "tableview_event_test_2";
        // onEdit Complete
        await osqa.tableViewRowDblClick(eventTableView2);
        await _drvier
          .actions({ bridge: true })
          .sendKeys(Key.ENTER)
          .perform();

        // on-update
        await osqa.execute(
          'Top.Dom.selectById("tableview_event_test_2").update();'
        );

        // // on-headercheck
        await osqa.tableViewHeaderCheck(eventTableView2);

        // // on-scrollEnd  callback
        await osqa.tableViewScrollDrag("#scroll_tableview_event_test_2");

        // // on-cellcontextmenu
        await osqa.tableViewRowContextMenu(eventTableView2);

        // // on-indexclick
        await osqa.tableViewIndexClick(eventTableView2);

        // // on-nodata Callback
        await osqa.execute(
          'topqaAutomationRepo.setValue("onNoDataCallbackInstance",[]);'
        );

        // TableView API Test Start
        /*
                    PreCondition 
                        API 테스트의 경우 get 을 먼저 선행하기 때문에
                        2,2 셀에 클릭 이벤트 클릭이 한번 선행되어야함 
                        getCheckedData 로인해서
                        체크박스도 2 로우에 미리 클릭 동작 선행
                */
        //    await osqa.userWait(2000);
        await osqa.userWait(1500);

        await osqa.lnbOpen(["Container", "TableView", "테이블 API 테스트"]);
        let apiTableView1 = "tableview_api_test_1";

        // row Click , Row Check is Conflict Test Case
        // 임시 제거 2019 - 04 - 09
        // await osqa.tableViewRowClick(apiTableView1,2,2);
        await osqa.tableViewRowCheck(apiTableView1, 0, 2);
        await osqa.topButtonClick("tableViewAPIBtn");

        // adding TestCase Repo
        await osqa.execute('return Auto.syncFactory("tableview")');

        await osqa.userWait(1500);
      } catch (err) {
        console.error(err);
      }
    }
  },
  button: {
    status: true,
    run: async () => {
    
      await osqa.lnbOpen(["Button", "Button", "버튼 이벤트 테스트"]);
      let eventBtn_1 = "button_event_1_";

      await osqa.topButtonClick(eventBtn_1);
      await osqa.userWait(1000);
      await osqa.topButtonDblClick(eventBtn_1);
      await osqa.userWait(1000);


      await osqa.lnbOpen(["Button", "Button", "버튼 API 테스트"]);

      let apiBtn_1 = "button_apiStart";
      // API Start
      await osqa.topButtonClick(apiBtn_1);
      await osqa.execute('return Auto.syncFactory("button")');
    }
  },
  spinner: {
    status: true,
    run: async () => {
      await osqa.lnbOpen(["Controls", "Spinner", "스피너 이벤트 테스트"]);

      await osqa.lnbOpen(["Controls", "Spinner", "스피너 API 테스트"]);



    }
  },

  textview:{
    status:true,
    run:async ()=>{
        await osqa.lnbOpen([
          "Text",
          "TextView",
          "텍스트뷰 이벤트 테스트"
        ]);

        const textview_event_test_target="textview_event_test_target";
      

        await osqa.topTextViewClick(textview_event_test_target);
        await osqa.topTextViewDblclick(textview_event_test_target);

        await osqa.lnbOpen([
          "Text",
          "TextView",
          "텍스트뷰 API 테스트"
        ]);

        let textView_api_test_ = "textView_api_test_";
        await osqa.topButtonClick(textView_api_test_);
        await osqa.execute('Auto.syncFactory("textview");');
    }
  },
  textfield: {
    status: true,
    run: async () => {
      let flag;
      flag = await osqa.lnbOpen([
        "Text",
        "TextField",
        "텍스트필드 이벤트 테스트"
      ]);
      let _driver = osqa.getDriver();
      let _by = osqa.getBy();
      console.log(`이벤트 테스트 플래그 ${flag}`);
      if (!!flag) {
        // Event Test
        let textfield_event_test_1 = "textfield_event_test_1";
        await osqa.textFieldInput(textfield_event_test_1, "Test Key Input222");

        let iconTargetTextField = await _driver.findElement(
          _by.id("textfield_event_test_1")
        );
        let iconElement = await iconTargetTextField.findElement(
          _by.css("span.top-textfield-icon")
        );
        await iconElement.click();

        // //textfield event
        let textfield_event_test_2 = "textfield_event_test_2";
        await osqa.textFieldInput(textfield_event_test_2, "Test Key Input");
        await osqa.textFieldClick(textfield_event_test_2);
        await osqa.textFieldDblClick(textfield_event_test_2);

        // Copy And Paste 
        await osqa.textFieldStringCopyandPaste(textfield_event_test_2);

        await osqa.userWait(2500);

          // console.log(await osqa.execute('return Auto.get("textfield","event")'));
      }
      

      flag = await osqa.lnbOpen(["Text", "TextField", "텍스트필드 API 테스트"]);
      console.log(`API 테스트 플래그 ${flag}`);
      if (!!flag) {
        // API Test
        let textfield_api_test = "textField_api_test_";
        await osqa.topButtonClick(textfield_api_test);

        await osqa.execute('Top.Dom.selectById("textFieldFocusBlur").focus();');
        await osqa.execute('Top.Dom.selectById("textFieldFocusBlur").blur();');
      }
      // sync for factory 
      await osqa.execute('Auto.syncFactory("textfield");');
    }
  },

  textarea: {
    status: true,
    run: async () => {
      await osqa.lnbOpen(["Text", "TextArea", "텍스트에어리어 이벤트 테스트"]);

      let textarea_event_target = "textarea_event_targetButton";


      await osqa.topTextAreaClick(textarea_event_target);
      await osqa.topTextAreaDblClick(textarea_event_target);

      await osqa.topTextAreaInput(textarea_event_target,"입력간드아");
      
      await osqa.topTextAreaStringCopyandPaste(textarea_event_target);

  
      await osqa.lnbOpen(["Text", "TextArea", "텍스트에어리어 API 테스트"]);
      let textArea_api_target = "textarea_api_targetButton";
      await osqa.topButtonClick(textArea_api_target);

      // focus API call
      // blur APO call
      await osqa.execute('Top.Dom.selectById("textAreaFocusBlur").focus();');
      await osqa.execute('Top.Dom.selectById("textAreaFocusBlur").blur();');

      // sync for factory
      await osqa.execute('return Auto.syncFactory("textarea")');
    }
  },
  regression: {
    status: false,
    run: async () => {
      console.log("IMS Regression Automation Test Success");
      await osqa.gnbMenuSelect("topqa");
      // regression 재현코드가 있는 ListView를  순차적으로 클릭하여
      // 테스트 코드 진행
      await osqa.regressionListViewIteratorClick();
      // iterator ListView
    }
  },
};
/**
 * @param {object} testContent
 * @public
 */
exports.init = function(testContent) {
  console.warn(this);
};

function commonStatusOtherFalse(statusName) {
  let length = Object.keys(commonStatus).length;
  let commonStatusKeyArr = Object.keys(commonStatus);

  commonStatusKeyArr.forEach(i => {
    if (statusName.includes(i)) {
    } else {
      commonStatus[i].status = false;
    }
  });
}

/**
 * @public
 */
exports.start = async function() {
  // driver initilalize
  try {
    osqa = new topqa();
    await osqa.init();

    // test Lock
    // commonStatusOtherFalse(["tablayout"]);

    let length = Object.keys(commonStatus).length;
    let commonStatusKeyArr = Object.keys(commonStatus);
    await commonStatusKeyArr.reduce(async (prev, curr, index, arr) => {
      const nextItem = await prev;
      if (typeof nextItem === "boolean" && !nextItem) {
        return nextItem;
      }
      await osqa.reset();
      let flag = await run(curr);
      await osqa.userWait(2000);
      return flag;
    }, Promise.resolve());
  } catch (err) {
    console.log(err);
  }
};
/**
 *
 * @param {string} widgetName Top.js Component Name
 * @private
 */
async function run(widgetName) {
  try {
    let testValue = !!commonStatus[widgetName]
      ? commonStatus[widgetName].status === false
        ? console.warn(`is ${widgetName} not test Set`)
        : await commonStatus[widgetName].run()
      : console.warn(`is not Test Case ${widgetName}`);

    return testValue;
  } catch (err) {
    console.log(err);
  }
}
/**
 * E2E Test End Point
 * get testResult report and createJunitReport
 */
exports.quit = async function() {
  try {
    if (!osqa) {
      throw new Error("not yet Start");
      return;
    }
    {
      console.log("runner is Closed");
      // await osqa.createJunitReport();
      await osqa.createExcelReport();
      // var tt = await osqa.execute('return Auto.get("button")');
      // console.log(tt);
      await osqa.quit();
    }
  } catch (err) {
    console.log(err.message);
    console.dir(err);
  }
};
