/**
 *  테스트용 이라 ie 와 chrome을 분리하여서 작성 
 * -> 실제 사용 시에는 하나의 문법으로 정리
 * 
 */

// 에러 1 
// ECONNREFUSED connect ECONNREFUSED 127.0.0.1:4714
// 

// 에러 2
//  WebDriverError: unknown error: DevToolsActivePort file doesn't exist
//  Issue Chrome 66 Update 로 인해서 DevtoolsActivePort 를 찾지 못하는 에러가 발생  
/*    'args':[
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage'] 
    args로 해결 
 */
let singleton;

require('chromedriver');
require('iedriver');


const webdriver = require('selenium-webdriver');
const{ By, until,actions } = webdriver;
const { makeJunitReport } = require('./topqaXmlBuilder');


// chrome = require('selenium-webdriver/chrome');
// var path = require('chromedriver').path;


// no param -> default 'chrome';
// param -> not 'c
const targetBrowser = !process.argv[2]
? 'chrome' 
:(!!['ie','firefox','chrome'].includes(process.argv[2].toLowerCase()) 
    ? process.argv[2].toLowerCase() 
    : 'chrome');
// module exports and topqa 
module.exports = topqa;


// lazy loading
// module.exports = () => singleton || (singleton = new topqa());

function topqa(){
    // Global Navigator Bar 의 메뉴 매핑 
    this._selectList = {
        "regression":"regBtn",
        "automation":"autoBtn",
        "api":"apiBtn",
        "integration":"integrationBtn",
        "topqa":"testBtn",
      };
   
    // 파라미터에 맞게 빌드된 드라이버
    this.driver;

    // 현재 페이지가 없으면 안됨;
    this.currTestPage;

    // 1 depth Web Element with Text
    this.currlnbMenu;
    this.currlnbMenuText;
    
    // 2 depth Web Element with Text
    // this menu is recursive function 
    this.currlnbSubMenu;
    this.currlnbSubMenuText;

    // current test  Widget
    this.currentTestWidget ;

    /** basic loading */
    // 시연 url
    

    this._url = "http://localhost:5279/topqa/index.html";

};
topqa.prototype.reset = function(){
    this.currlnbMenu ='';
    this.currlnbMenuText='';
    
    this.currlnbSubMenu ='';
    this.currlnbSubMenuText='';

    this.currentTestWidget='';
};
topqa.prototype.test = async function(){
   
};
topqa.prototype.init = async function(){
    try{
    console.warn("Automation Start");
    console.warn("Start Browser  " + targetBrowser);
    console.warn("target Platform : "+ process.platform);
    console.warn("Start Time : " + process.uptime());
    if(targetBrowser==='chrome'){
//  WebDriverError: unknown error: DevToolsActivePort file doesn't exist
//  Issue Chrome 66 Update 로 인해서 DevtoolsActivePort 를 찾지 못하는 에러가 발생 
console.log('Chrome Start');
        var chromeCapa = webdriver.Capabilities.chrome();
        var chromeOptions = {
            'args':[
                // '--headless',
                '--no-sandbox',
                '--disable-dev-shm-usage']
        }
        chromeCapa.set('chromeOptions',chromeOptions);
        this.driver = new webdriver.Builder()
        .withCapabilities(chromeCapa)
        .forBrowser('chrome')
        .build();

        // this.driver = chrome.Driver.createSession(new chrome.Options(),
        // new chrome.ServiceBuilder(path).build());
    

    }
    else if(targetBrowser==='ie'){
        // const Capabilities = require('selenium-webdriver/lib/capabilities').Capabilities;
        // let capa = Capabilities.ie();
        var ieCapa = webdriver.Capabilities.ie();
        var ieOptions = {

        }
        this.driver = new webdriver.Builder()
        .withCapabilities(ieCapa)
        .build();
    }

   
        //    driver = await driver.build();
            await this.driver.get(this._url);
            await this.driver.manage().window().maximize();
            // await driver.findElement(By.id('autoBtn')).click();;
    }
    catch(err){
            console.error('driver init Error');
            console.error(err);
    }
    finally{
        console.log("driver execute Success");
        // await this.driver.sleep(2000);
        // 실수로quit해버리니까 session 에러가 남.. 
        // await this.driver.quit();
    }
};
topqa.prototype.quit = async function(){
    await this.driver.sleep(3000);
    await this.driver.close();
    
    await this.driver.quit();
};
topqa.prototype.isIE = function(){
    return targetBrowser==='ie' ? true : false;
};
// subMenu Click after lnbMenu click 
topqa.prototype.subMenuSelect = async function(clickSubMenuText){
    try{
        // not select lnbMenu 
        if(this.currlnbMenu===undefined || !this.currlnbMenu === true){
                console.log("lnbMenu 를 선택해주세요");
                endFunction("prototype.subMenuSelect currlnbMenu is not exist");
                return false;
        }
        console.warn(await this.currlnbMenuText,"의 하위 메뉴 인 ",clickSubMenuText ,"선택됨");
        let subMenuList = await this.currlnbMenu.findElements(By.css('ul li'));

        if(this.isIE()){
                console.log('is IE');
            let length = subMenuList.length;
            for(let i=0;i<length;i++){
                let topSubMenuTextTag = await subMenuList[i].findElement(By.css('.top-menu_text'));
                let targetText = await topSubMenuTextTag.getText();
                    if(clickSubMenuText.toLowerCase()===targetText.toLowerCase()){
                        console.log('find It');
                        this.currlnbSubMenu = subMenuList[i];
                        this.currlnbSubMenuText = targetText;
                        await topSubMenuTextTag.click();
                        break;
                    }
                    else{
                        console.log("[subMenuSelect] Looking for element : " ,clickSubMenuText );
                        console.log("[subMenuSelect] Checking for element : " ,targetText );
                        console.log('');
                    }
            }
        }
        else{
        console.warn('[Current LNB Menu :',this.currlnbMenuText);
        console.warn('[Current LNB Menu :',this.currlnbMenu);

        console.warn('[Current Menu] :',clickSubMenuText.toLowerCase());
            for await(const item of subMenuList){
                let topSubMenuTextTag = await item.findElement(By.css('.top-menu_text'));
                let targetText = await topSubMenuTextTag.getText();
                console.warn('[Target Menu] : ',targetText.toLowerCase());

                if(clickSubMenuText.toLowerCase()===targetText.toLowerCase()){
                        this.currlnbSubMenu = item;
                        this.currlnbSubMenuText = targetText;
                        await topSubMenuTextTag.click();
                        return item;
                }
                
            }
            // await Promise.all(subMenuList.map(async (item,index)=>{
            //     let topSubMenuTextTag = await item.findElement(By.css('.top-menu_text'));
            //     let targetText = await topSubMenuTextTag.getText();
            //         if(clickSubMenuText.toLowerCase()===targetText.toLowerCase()){
            //             console.log("find It");
            //                 this.currlnbSubMenu = item;
            //                 this.currlnbSubMenuText = targetText;
            //                 await topSubMenuTextTag.click();
            //                 return item;
            //         }
            //         else{
            //                 console.log("[subMenuSelect] Looking for element : " ,clickSubMenuText );
            //                 console.log("[subMenuSelect] Checking for element : " ,targetText );
            //                 console.log('');
            //         }
            // }));
        }
    
    }
    catch(err){
    console.log("subMenuSelect : ", err);
        return false;
    }
    finally{

        endFunction("prototype.subMenuSelect");
    }
};

topqa.prototype.lnbMenuSelect = async function(lnbMenuText){
    try{
        let checkMenu = await this.driver.findElements(By.tagName('top-menu'))
        if(await checkMenu.length > 1){
                console.log("메뉴 2개");
                return;
        }
        else{
            console.log("메뉴 1개 확인 : ",lnbMenuText);
            // List 만 가져옴 한번 더 타서 -> .top-menu_text 의 값을 확인 
            let menuTextArray = await this.driver.findElements(
               By.css('top-menu .top-menu_nav > li')
        );
      if(this.isIE()){
            let length = menuTextArray.length;
            for (let i=0;i<length;i++){
                let topMenuText = await menuTextArray[i].findElement(By.css('.top-menu_text'));
                let targetText = await topMenuText.getText();
                
                if(lnbMenuText===targetText){
                         console.log("Find it");
                         this.currlnbMenu = menuTextArray[i];
                         this.currlnbMenuText = targetText;
                         await topMenuText.click();
                         break;
                         
                }else{
                    console.log("[lnbMenuSelect]  Looking for element : " ,lnbMenuText);
                }
            }
      } // is IE true
      else{
        console.warn('[search Menu] :',lnbMenuText);
          for await(const item of menuTextArray){
            let topMenuText = await item.findElement(By.css('.top-menu_text'));
            let targetText = await topMenuText.getText();
            console.warn('[Current Menu] :',targetText.toLowerCase());
            if(lnbMenuText.toLowerCase() === targetText.toLowerCase()){
                this.currlnbMenu = item;
                this.currlnbMenuText= targetText;
                await topMenuText.click();
                return item;
            }
          } // for await of
        } // targetBrowser === 'chrome'
        }
    }
    catch(err){
        console.log("[lnbMenuSelect]  >>>> ", err);
    }
    finally{
        console.warn('click Lnb Menu : ', this.currlnbMenuText);
        endFunction("prototype.lnbMenuSelect");    
    }
};
topqa.prototype.gnbMenuSelect = async function(spec){
    let selectList = this._selectList;
    console.log("this Spec  : ",spec);
    try{
        console.log("ID Check   :  " + selectList[spec]);
        let moveBtn = await this.driver.findElement(By.id(selectList[spec]));
        await moveBtn.click();
    }
    catch(err){
        console.error("[gnbMenuSelect Function Error] >>> " + err);
    }
    finally{
        this.currTestPage = spec;
        endFunction("prototype.gnbMenuSelect");
    }
};
// id = targetId - 
// index = headerIndex ( default : 1 )
// count = Click Count;( default : 1 )
// running = true ;  // findElement X  ( default : false )
topqa.prototype.tableViewHeaderClick = async function(_id,_index,_count,_running){

        let id= _id || false;
        let index = (_index === 1 ? 0 : _index) || 0;
        let count = _count || 1;
        let running = _running || false;
        if(!id){return;}
    try{
         let retTarget = await this.isDisplayDOM(id);
        //this.currentTestWidget;
        let thead = await retTarget.findElement(By.css('table > thead'));
        let arr = await thead.findElements(By.css('th.head-cell'));
        console.log(await retTarget.getAttribute('tagName'));
        console.error(typeof arr);
        let length_;
        console.log("찾기 전 길이 : ",arr.length);

        // for await(const item of arr){
        //     let isNotColumn;
        //     let className = await item.getAttribute('class');
        //     isNotColumn =className.split(' ').includes('checkable') ||
        //     className.split(' ').includes('indexable');
        //     console.log(isNotColumn); 
        // }
        let startIdx=0;
        await Array.prototype.reduce.call(arr,async function(acc,item,index){
                const nextItem = await acc;
                    let isNotColumn;
                    let className = await item.getAttribute('class');
                    isNotColumn = className.split(' ').includes('checkable')||
                    className.split(' ').includes('indexable');
                    if(isNotColumn){startIdx++;}
                return nextItem;
        },Promise.resolve());

        console.log("컬럼인 Index 시작 지점  ",startIdx);
        console.log("첫번째 컬럼 네임 : >" ,await arr[startIdx].getAttribute('value'));
        // 인덱스 클릭 
                await arr[startIdx+index].click();
        }
        catch(err){ 
            console.log("[tableViewHeaderClick] :  ",err);
            return;
        }
        finally{
            endFunction('tableViewHeaderClick');
        }
};
topqa.prototype.tableViewRowDblClick = async function(_id,_columnIndex,_rowIndex,_count,_running){
        let id= _id || false;
        let columnIndex = (_columnIndex === 1 ? 0 : _columnIndex)  || 0;
        let rowIndex  = (_rowIndex ===1 ? 0 : _rowIndex) || 0;
        let count = _count || 1;
        let running = _running || false;
        if(!id){return;}
     try{   
        await this.tableViewRowClick(_id,_columnIndex,_rowIndex,_count,_running,true);
    }
    catch(err){console.log("[tableViewRowDblClick]  " ,err)}
    finally{
        endFunction("tableViewRowDblClick");
    }
};
topqa.prototype.tableViewRowClick = async function(_id,_columnIndex,_rowIndex,_count,_running,
    _dblClick){
    let id= _id || false;
    let columnIndex = (_columnIndex === 1 ? 0 : _columnIndex)  || 0;
    let rowIndex  = (_rowIndex ===1 ? 0 : _rowIndex) || 0;
    let count = _count || 1;
    let running = _running || false;
    let dblClick = _dblClick || false;
        if(!id){return;}

        try{
            let startIdx=0;    
            let retTarget = await this.isDisplayDOM(id);
            let tbody = await retTarget.findElement(By.css('table > tbody'));
            let totalRowArray = await tbody.findElements(By.css('tr'));
    // 이전에 checkable, indexable Indexing 확인이 필요함 

    //checking columnIndex 
        let sampleRowInnerArray = await totalRowArray[0].findElements(By.css('td'));

        await Array.prototype.reduce.call(sampleRowInnerArray,async function(acc,item,index){
                const nextItem = await acc;
                    let isNotColumn;
                    let className = await item.getAttribute('class');
                    isNotColumn = className.split(' ').includes('checkable') ||
                                  className.split(' ').includes('indexable');
                    if(isNotColumn){startIdx++;}
                return nextItem;
        },Promise.resolve());

        // startIdx 가 정해지면 = column 값이랑 같다고보면됨
        // columnIndex와 rowIndex를 정해야 하는데 값이 정해지지않은 경우는
        // 0, 0 으로 지정됨 startIdx가 2가 나옴 (첫번째 row및 column 을 클릭 )

        let selectRow = await totalRowArray[rowIndex].findElements(By.css('td'));
        
        let clickTarget = selectRow[columnIndex+startIdx];
        if(!dblClick){
                await selectRow[columnIndex+startIdx].click();
        }
        else{
            // 더블 클릭 코드 
                 await this.driver.actions({bridge:true}).doubleClick(clickTarget).perform();
        }
        }
        catch(err){console.log("[tableViewRowClick] : ",err)}
        finally{
            endFunction("tableViewRowClick");
        }
};
/**
 * 
 */
topqa.prototype.regressionListViewIteratorClick = async function(){
        // top-listview#imsListView .top-listview-root
        // document.querySelector("top-listview#imsListView .top-listview-root");
    try{
        let imsListView = await this.isDisplayDOM('',4000,'top-listview#imsListView .top-listview-root');

        console.warn('regressionListViewIteratorClick target');

    }catch(err){
       console.log("[regressionListViewIteratorClick] : ",err);
    }finally{
        endFunction('listviewIteratorClick');
    }
};

// {id:'',wait:'',cssSelector:''}
topqa.prototype.isDisplayDOM = async function(idSelector,waitTime,cssSelector){
    let maxWaitTime = waitTime || 3000;
    try{
        // let target = await this.driver.findElement(By.id(targetId));
    let target;
      if(!!cssSelector){
        target = await this.driver.wait(until.elementLocated(By.css(cssSelector)),maxWaitTime);
        console.warn('css Selected DOM is ',target);

        console.warn('content',await target.getTagName());
        return await target;
      } // !!cssSelector
      else{
        target = await this.driver.wait(until.elementLocated(By.id(idSelector)),maxWaitTime);
        if(idSelector === await target.getAttribute('id')){
            console.log("id Selected DOM is : ",idSelector);
            return await target;
        }
        else{
            return false;
        }
      } // else
    }   
    catch(err){
             console.warn("isDisplayDOM Error  : ",idSelector , " or " , cssSelector);
             console.error(err);
             return false;
    }
}; // isDisplayDOM3

topqa.prototype.automationTestPageClose = async function(targetId){

};




topqa.prototype.testSubmit = async function(){
    
    try{
        let target =  await this.driver.findElement(By.id('addTestRepoButton'));
        let innerBtn = await target.findElement(By.css('.top-button-root'));

        await target.click();
        await innerBtn.click();
    }
    catch(err){
        console.log(err);
    }
};


topqa.prototype.userWait = async function(waitTime){
    try{
        await this.driver.sleep(waitTime);
    }   
    catch(err){console.warn(err);}
}


// Down Load Button Click (E2E Test Page -> End Point)
topqa.prototype.testReport = async function(){
    try{
        // 임시 wait
        await this.driver.sleep(1500);

        let downBtn = await this.driver.findElement(By.id('downloadBtn'));
        if(!downBtn){throw new Error('Download Button not Display')}
       await downBtn.click();

       let array = [];
       const retVal = await this.driver.executeScript('return factory.report()');
       makeJunitReport(retVal);

    }
    catch(err){
        console.log(err);
    }
};

// temp remove
topqa.prototype.createJunitReport = async function(){
    try{
        let array = [];
        const retVal = await this.driver.executeScript('return factory.report()');
        makeJunitReport(retVal);
    }
    catch(err){
        console.log(err);
    }
}


function endFunction(message){
    console.log("--------------------------------[",message,"] >>>>>> End");
};



// let thead = await retTarget.findElement(By.css('table > thead'));
// let arr = await thead.findElements(By.css('th.head-cell'));
// console.log(await retTarget.getAttribute('tagName'));