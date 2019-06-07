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
const {Key, Origin, Button} = require('selenium-webdriver/lib/input');
const{ By, until, actions } = webdriver;

// Key,
// Keyboard,
// FileDetector,
// Origin,

const { makeJunitReport } = require('./topqaXmlBuilder');
const { makeExcelReport } = require('./topqaExcelBuilder');

// no param -> default 'chrome';
// param -> not 'c
const targetBrowser = !process.argv[2]
? 'chrome' 
:(!!['ie','firefox','chrome'].includes(process.argv[2].toLowerCase()) 
    ? process.argv[2].toLowerCase() 
    : 'chrome');
// module exports and topqa 

function topqaWait(timeout){
        return new Promise(resolve => setTimeout(resolve,timeout))
}



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

    // External driver Instance
    this.driverInstance = undefined;

    // 현재 페이지가 없으면 안됨;
    this.currTestPage;

    // 프로젝트 타이틀 ( driver waiting )
    this.projectTitle="topMainWindow";


    // topLNB Menu

    this.lnbMenuRoot;
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
    this.copyFlag = false;

    // tableview test  Session Created Error 
    this._url = 'http://127.0.0.1:5279/topqa/index.html#!/automation';

    // 버전 별 테이블 구조가 자꾸 바뀜 
    this._topVersion;

};
topqa.prototype.reset = function(){
    this.currlnbMenu ='';
    // this.currlnbMenuText='';
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
        console.log("IE Start");
        var ieCapa = webdriver.Capabilities.ie();
        var ieOptions = {

        }
        this.driver = new webdriver.Builder()
        .withCapabilities(ieCapa)
        .build();
    }
            // with Capabilities는 this.capabilities_ 를 한다
   
            await this.driver.get(this._url);
            await this.driver.manage().window().maximize();

            await this.driver.wait(until.titleIs(this.projectTitle),5000);

            topqaWait(5000).then(()=>{
                console.log('Code Start');
            });
    }
    catch(err){
            console.error('driver init Error');
            console.error(err);
            process.exit(1); 
        // create session 에러
        // 이런 에러는 대부분 브라우저가 뜨지 않았을 경우가 많음

        // node Exit 
        await this.driver.close();
        await this.driver.quit();
       

       return false;
    }
};
topqa.prototype.topTextViewDblclick = async function(_id){
    try {
        let id = _id || false;
        if(!id){return;}
        this.topTextViewClick(_id,true);
    } catch (error) {
        console.error(error);
    }
    finally{
        console.log(`textview Dblclick ${_id}`);
    }
}
topqa.prototype.topTextViewClick = async function(_id,_dblclick){
    try {
        let id = _id || false;
        let dblClick = _dblclick | false;
        if(!id){throw new Error('textview Click is Not Exist id')}

        let textviewEle = await this.driver.findElement(By.id(id));
        let targetElement = await textviewEle.findElement(By.css('.top-textview-root'));

        if(!!_dblclick){
            await this.driver.actions({bridge:true})
            .doubleClick(targetElement)
            .perform();
        }else{
           await targetElement.click();
        }

    } catch (err) {
        console.error(err);
    }
}
topqa.prototype.textFieldStringCopyandPaste = async function(_id){
    try {
        let id = _id || false;
        if(!id){throw new Error('textfieldStringCopyand Paste is Not Exist id')}
        
        let textFieldEle = await this.driver.findElement(By.id(id));
        let targetElement = await textFieldEle.findElement(By.css('input.top-textfield-text'));
        
        await this.driver.executeScript('arguments[0].focus();',targetElement);

        await targetElement.sendKeys(Key.CONTROL,'a','c','v');

    } catch (error) {
            console.error(error);
    }
    finally{
            console.warn('textfieldStringCopy and Paste ');
    }
}

topqa.prototype.textFieldInput = async function(_id,_input){
    try{
        let id = _id || false;
        if(!id){return;}
        let input = _input || 'Input Sample';

        let textFieldEle = await this.driver.findElement(By.id(id));
        // let textFieldEle = await this.isDisplayDOM(id);
        let inputElement = await textFieldEle.findElement(By.css('input.top-textfield-text'));
        
        await this.driver.executeScript('arguments[0].focus();',inputElement);
        await this.driver.actions({bridge:true})
       .click(inputElement).sendKeys(input).perform();
    }
    catch(err){console.error(err);}
}
topqa.prototype.textFieldDblClick = async function(_id){
    try{
        let id = _id || false;
        if(!id){return;}
        this.textFieldClick(_id,true);
    }
    catch(err){console.error(err);}
    finally{
        console.log(`textField DblClick ${_id}`);
    }
}
topqa.prototype.textFieldClick = async function(_id,_dblClick){
    try{
        let id = _id || false;
        let dblClick = _dblClick | false;
        if(!id){return;}

        let textfieldEle = await this.driver.findElement(By.id(id));
        let targetElement = await textfieldEle.findElement(By.css('input.top-textfield-text'));
        if(!!dblClick){
            await this.driver.actions({bridge:true})
            .doubleClick(targetElement)
            .perform();
        }else{
            await targetElement.click();
        }
    }
    catch(err){console.error(err);}
    finally{
        console.log(`textField Click ${_id}`);
    }
}


topqa.prototype.topTextAreaClick = async function(_id,_dblClick){
    try{
        let id = _id || false;
        let dblClick = _dblClick | false;
        if(!id){return;}

        let textAreaEle = await this.driver.findElement(By.id(id));
        let targetElement = await textAreaEle.findElement(By.css('textarea'));

        if(!!dblClick){
            await this.driver.actions({bridge:true})
            .doubleClick(targetElement)
            .perform();
        }else{
            await targetElement.click();
        }

    }
    catch(err){console.error(err)}
    finally{
        let consoleOut = !!_dblClick ? 'textArea DbClick' :'textArea Click';
        console.log(`${consoleOut}  ${_id}`);
    }
}

topqa.prototype.topTextAreaDblClick = async function(_id){
    try{
        let id = _id || false;
        if(!id){return;}
        this.topTextAreaClick(_id,true);
    }
    catch(err){console.error(err);}
}

topqa.prototype.topTextAreaInput = async function(_id,_input){
        try{
            let id = _id || false;
            if(!id){return;}
            let input = _input || 'Input Sample';

            let textAreaEle = await this.driver.findElement(By.id(id));
            let inputElement = await textAreaEle.findElement(By.css('textarea'));

            await this.driver.executeScript('arguments[0].focus();',inputElement);
            await inputElement.sendKeys(input);
            
        }
        catch(err){console.error(err);}
}
topqa.prototype.topTextAreaStringCopyandPaste = async function(_id){
    try {
        let id = _id || false;
        if(!id){throw new Error('Not Exist ID topTextAreaStringCopyandPaste');}

        let textAreaEle = await this.driver.findElement(By.id(id));
        let targetElement = await textAreaEle.findElement(By.css('textarea'));

        // focus in Textarea
        await this.driver.executeScript('arguments[0].focus();',targetElement);

        // all Select -> Copy - > Paste 
        await targetElement.sendKeys(Key.CONTROL,'a','c','v');

    } catch (error) {
        console.error(error);
        return;
    }
    finally{
        console.log(`topTextAreaStringCopyandPaste`);
    }

}
// only Copy
topqa.prototype.topTextAreaStringCopy = async function(_id){
    try {
        let id = _id || false;
        if(!id){throw new Error('Not Exist ID topTextAreaStringCopy');}

        let textAreaEle = await this.driver.findElement(By.id(id));
        let targetElement = await textAreaEle.findElement(By.css('textarea'));

        this.copyFlag = true;

         // focus in Textarea
        await this.driver.executeScript('arguments[0].focus();',targetElement);
        // Copy 
        await targetElement.sendKeys(Key.CONTROL,'a','c')
        

        // // Create All Select Actions
        // await this.driver.actions({bridge:true})
        // .keyDown(Key.CONTROL)
        // .keyDown(Key.A)
        // .press()
        // .perform();

        // // Create Copy Actions
        // await this.driver.actions({bridge:true})
        // .keyDown(Key.CONTROL)
        // .keyDown(C)
        // .press()
        // .perform();

        // Complete 


    } catch (error) {
        console.error(error);
        return;
    }
    finally{
        console.log(`topTextArea String Copy `);
    }

}

// Only String Paste 
topqa.prototype.topTextAreaStringPaste = async function(_id){
    try {
        let id = _id || false;
        if(!id){throw new Error('Not Exist ID topTextAreaStringPaste');}

        let textAreaEle = await this.driver.findElement(By.id(id));
        let targetElement = await textAreaEle.findElement(By.css('textarea'));

        // focus in Textarea
        await this.driver.executeScript('arguments[0].focus();',targetElement);

        // true 이면 Ctrl + A  Skip
        !!this.copyFlag ? await targetElement.sendKeys(Key.CONTROL,'v'):
        await targetElement.sendKeys(Key.CONTROL,'a','c','v');

        this.copyFlag = false;

    } catch (error) {
        console.error(error);
        return;
    }
    finally{
        console.log(`topTextArea String Copy `);
    }
}
topqa.prototype.getDriver = function(){
    return  typeof this.driver ==='undefined' ? false : this.driver;
};
topqa.prototype.getBy = function(){
    return By;
}
/**
 * @param menuText 'String or Array'
 * @param menuDepth
 * @public
 */
topqa.prototype.lnbOpen = async function(menuText){
        try{
            if(!Array.isArray(menuText)){
                console.log('MenuText is only Array');
                return;
            }
            if(!this.lnbMenuRoot){
                console.log('lnbMenuRoot find');
                this.lnbMenuRoot = await this.isDisplayDOM('lnbMenu',20000);
            }
         
            //  Button Button 
        console.log(menuText);
        let console_ = this.qaConsole;
        let menuTextLength = menuText.length;
        let returnflag = false;
        this.currlnbMenu="";
        for(let i=0;i<menuTextLength;i++){
            let searchMenuText = menuText[i];
            if(searchMenuText===''){continue;}

            let li_selectIterator;
            let li_menuArray

            if(this.currlnbMenu!==""  &&  this.currlnbMenu!=="undefined"){
                // li_selectIterator = 'ul[style="display: block;"] > li';
                console.log(await this.currlnbMenu.getTagName());               
                // li_selectIterator = i===1 ? "li[class~=top-menu_collapsed]" : 'li';
                li_selectIterator = i===1 ? "li[class~=depth2]" : 'li';
                li_menuArray = await this.currlnbMenu.findElements(By.css(li_selectIterator));
            }
            else{
                li_selectIterator  = `.top-menu-root .top-menu_nav li.depth${i+1}`;
                li_menuArray = await this.lnbMenuRoot.findElements(By.css(li_selectIterator));
            }

            console_(`Search Text   ${searchMenuText}\t
            ChildNodelength  : ${li_menuArray.length}\t
            Selector -> : ${li_selectIterator}`);

            let li_menuArrayLength = li_menuArray.length;
            for(let j=0;j<li_menuArrayLength;j++){
                    
                    // span Tags
                    // let textElement = await li_menuArray[j].findElement(By.css('.top-menu_text'));
                    let textElement = await this.driver.wait(
                        until.elementIsVisible(await li_menuArray[j].findElement(By.css('.top-menu_text'))
                        )
                        // ,5000
                    );
                    let currentText = await textElement.getText();
                                // getText()
                                
                                // getAttribute('text');
                    if(i>=1){
                        console_(`${await li_menuArray[j].getAttribute('innerHTML')}`,'MG');
                    }
                    console_(`Currnet Text ${currentText}`,"RED");

                    if(currentText===searchMenuText){
                        // a Tags
                        // let clickTarget = await li_menuArray[j].findElement(By.css('a.top-menu_item_inner'));

                        let clickTarget = await this.driver.wait(
                            until.elementIsVisible(await li_menuArray[j].findElement(By.css('a.top-menu_item_inner'))
                            ,5000)
                        );
                        console_(`clickTarget Text Test ${await clickTarget.getAttribute('text')} `,'TEST');
                        
                        this.lnbMenuText=currentText;
                        if(i!==(menuTextLength-1)){
                              console.log(`ul 태그 삽입 ${currentText}`);
                              this.currlnbMenu = await li_menuArray[j].findElement(By.css('ul')) 
                        }
                        
                        let liClassNames = await li_menuArray[j].getAttribute('class');

                        // 1depth 는 active 유무 
                        // 2depth 는 top-menu_open (열렸을시)
                        //           top-menu_collapsed(닫혔을시)
                        if(liClassNames.split(' ').includes('active')  ||
                            liClassNames.split(' ').includes('top-menu_open')
                        ){
                            console.log(`not Clicked ${liClassNames}  searchText ${currentText} `);
                            break;
                        }
                        else{
                            console_(`lnbMenu Clicked ${currentText}`,"GREEN");
                            console.log(await clickTarget.getAttribute('innerHTML'))
                            // if(currentText==="Container")   break;
                            await clickTarget.click();
                            if(i===(menuTextLength-1)){returnflag = true;}
                            break;
                        }   
                    }
            }
        }
            return returnflag;
          
        }
        catch(err){
            console.error(err);
            return false;
        }
        //  this.isIE()
        // await this.driver.actions({bridge:true})
        // .move({x:10,y:10,origin:clickTarget})
        // .click()
        // .perform();
}


        // await this.driver.actions({bridge:true}).dragAndDrop(scroll,br).perform();

topqa.prototype.tableViewScrollDrag = async function(css){
    try{
        let scroll = await this.cssDisplay(css);

        // Virtual Scroll 이 이동은 하나  이벤트를 받지 못함
        await this.driver.actions({bridge:true})
            .move({origin:scroll})
            .press()                       
            .move({x:0,y:100,origin:Origin.POINTER})
            .release()
            .perform();
        
        

// 02 버전 
// 03 버전 
// IMS 번호 명시

    }
    catch(err){console.error(err);}

}
topqa.prototype.quit = async function(){
    try{
        await this.driver.sleep(3000);
        await this.driver.close();
        await this.driver.quit();
    }
    catch(err){
        console.error(err);
    }
};
topqa.prototype.isIE = function(){
    return targetBrowser==='ie' ? true : false;
};
// subMenu Click after lnbMenu click 
topqa.prototype.lnbsubMenuSelect = async function(clickSubMenuText){
    try{
        // not select lnbMenu 
        if(this.currlnbMenu===undefined || !this.currlnbMenu === true){
                console.log("lnbsubMenu 를 선택해주세요");
                endFunction("prototype.lnbsubMenuSelect currlnbMenu is not exist");
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
                        console.log("[lnbsubMenuSelect] Looking for element : " ,clickSubMenuText );
                        console.log("[lnbsubMenuSelect] Checking for element : " ,targetText );
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
          
        }
    
    }
    catch(err){
    console.log("lnbsubMenuSelect : ", err);
        return false;
    }
    finally{

        endFunction("prototype.lnbsubMenuSelect");
    }
};

// TOP Main Pages 
// lnb Menu Control API
/**
 *  @param {lnbMenuText} 
 *  @public 
 */
// naming based click 


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
   
    try{
        
        // let moveBtn = await this.driver.findElement(By.id(selectList[spec]));
        // let moveBtn = await this.isDisplayDOM(selectList[spec],8000);
       
        let _id = this._selectList[spec];
        this.qaConsole(`this GNB Menu Select  : ${_id} `,)
        

        let waitButton = await this.driver.wait(
            until.elementIsVisible(await this.driver.findElement(By.id(_id)))
        )
        let gnbButton = await waitButton.findElement(By.css('.top-button-root'));
        await gnbButton.click();




        // let rootButton = await this.driver.findElement(By.id(_id));
        // let gnbButton = await this.driver.wait(
        //         // until.elementIsVisible(await rootButton.findElement(By.css('.top-button-root')),15000)
        //         until.elementLocated(await rootButton.findElement(By.id(_id)))
        // )
        // await gnbButton.click();
    }
    catch(err){
        console.error("[gnbMenuSelect Function Error] >>> " + err);
    }
    finally{
        this.currTestPage = spec;
        endFunction("prototype.gnbMenuSelect");
    }
};

topqa.prototype.tableViewIndexClick = async function(_id){
    try{
        let id= _id || false;
        if(!id) return;
        let retTarget = await this.isDisplayDOM(id);
        let indexCell = await retTarget.findElement(By.css('tbody tr .indexable'));
        await indexCell.click();
    }
    catch(err){console.error(err);}
};
topqa.prototype.tableViewHeaderCheck = async function(_id,_count){
    try{
        let id = _id || false;
        if(!id){return;}
        let count = _count || 1;
        
        let retTarget = await this.isDisplayDOM(id);
        let headerCheck = await retTarget.findElement(By.css('thead tr th.checkable'));
        await headerCheck.click();
        
        // let theadArr = await retTarget.findElements(By.css('thead tr th'));

        // Array.prototype.reduce.call(theadArr,async (prev,curr)=>{
        //     try{
        //         const nextItem = await prev;
        //         let _className = await curr.getAttribute('className');
        //         let _currSplitClassName = _className.split(' ');
        //                 if(!!_currSplitClassName.includes('checkable')){
        //                         let _headCheckBox = await curr.findElement(By.css('.top-checkbox-check'));
        //                     console.log(_headCheckBox);
        //                         // await _headCheckBox.click();
        //                 }
        //         return nextItem;
        //     }catch(err){console.error('Array.Reduce.HeaderCheck', err);}
        // },Promise.resolve());

    }
    catch(err){
        console.error(err);
    }
};
// id = targetId - 
// index = headerIndex ( default : 1 )
// count = Click Count;( default : 1 )
// running = true ;  // findElement X  ( default : false )
topqa.prototype.tableViewHeaderDblClick = async function(_id,_index,_count,_running){

    let id= _id || false;
    let index = (_index === 1 ? 0 : _index) || 0;
    let count = _count || 1;
    let running = _running || false;
    if(!id){return;}
    try{
        this.tableViewHeaderClick(id,index,count,running,true);
    }
    catch(err){console.error(err);}
};
topqa.prototype.tableViewHeaderClick = async function(_id,_index,_count,_running,_dblClick){

        let id= _id || false;
        let index = (_index === 1 ? 0 : _index) || 0;
        let count = _count || 1;
        let running = _running || false;
        let dblClick = _dblClick || false;
        if(!id){return;}
    try{
         let retTarget = await this.isDisplayDOM(id);
        //this.currentTestWidget;
        let thead = await retTarget.findElements(By.css('table > thead'));
        let arr = await thead[1].findElements(By.css('th.head-cell'));
        console.log(await retTarget.getAttribute('tagName'));
        console.error(typeof arr);
        let length_;
        console.log("찾기 전 길이 : ",arr.length);




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
        let clickTarget = arr[startIdx+index];
           if(!!dblClick){
                console.log('double click');
                console.log(clickTarget);
                await this.driver.actions({bridge:true}).doubleClick(clickTarget).perform();
           }else{
                await this.driver.actions({bridge:true}).click(clickTarget).perform();
           }
           
        }
        catch(err){ 
            console.log("[tableViewHeaderClick] :  ",err);
            return;
        }
        finally{
            endFunction('tableViewHeaderClick');
        }
};
/**
 * @param _type 
 * 
 */

topqa.prototype.tableViewPageChange = async function(_id,_type){
    try{
        let id= _id || false;
        if(!id){return;}
        let type = _type || 'next';
        if(!['first','prev','next','last'].includes(type)){
            console.log('not supported type ',type);
            return;
        }
        let pgTypeSelector = `.top-pagination-root .${type} .cell_link`;

        let retTarget = await this.isDisplayDOM(id);
        let pgTypeElement = await retTarget.findElement(By.css(pgTypeSelector));
        
        await pgTypeElement.click();
    
    }
    catch(err){console.error(err)}
};
topqa.prototype.tableViewRowCheck = async function(_id,_columnIndex,_rowIndex,_count,_running){
    try{
        let id= _id || false;
        let columnIndex = (_columnIndex === 1 ? 0 : _columnIndex)  || 0;
        let rowIndex  = (_rowIndex ===1 ? 0 : _rowIndex) || 0;
        let count = _count || 1;
        let running = _running || false;
        if(!id){return;}

        // let checkSelector = `tbody tr td top-checkbox`;
        // let retTarget = await this.isDisplayDOM(id);
        // let rowCheckElement = await retTarget.findElement(By.css(checkSelector));
        // await rowCheckElement.click();

        let checkSelector = `td top-checkbox label`;
        let retTarget = await this.isDisplayDOM(id);
        let tbody = await retTarget.findElements(By.css('table > tbody'));


        let tableRecord = await tbody[1].findElements(By.css('tr'));

        let targetCheckBox = await tableRecord[rowIndex].findElement(By.css(checkSelector));

        await targetCheckBox.click();
        // await this.driver.actions({bridge:true}).click(targetCheckBox).perform();
        // incomplete Fucntion 
    }
    catch(err){console.error(err);}
};
topqa.prototype.tableViewRowContextMenu = async function(_id,_columnIndex,_rowIndex,_count,_running){
    try{
        let id= _id || false;
        let columnIndex = (_columnIndex === 1 ? 0 : _columnIndex)  || 0;
        let rowIndex  = (_rowIndex ===1 ? 0 : _rowIndex) || 0;
        let count = _count || 1;
        let running = _running || false;
        if(!id){return;}
        await this.tableViewRowClick(_id,_columnIndex,_rowIndex,_count,_running,'CONTEXT');
    }
    catch(err){console.error(err);}
};
topqa.prototype.tableViewRowDblClick = async function(_id,_columnIndex,_rowIndex,_count,_running){
        let id= _id || false;
        let columnIndex = (_columnIndex === 1 ? 0 : _columnIndex)  || 0;
        let rowIndex  = (_rowIndex ===1 ? 0 : _rowIndex) || 0;
        let count = _count || 1;
        let running = _running || false;
        if(!id){return;}
     try{   
        await this.tableViewRowClick(_id,_columnIndex,_rowIndex,_count,_running,"DOUBLECLICK");
    }
    catch(err){console.log("[tableViewRowDblClick]  " ,err)}
    finally{
        endFunction("tableViewRowDblClick");
    }
};
topqa.prototype.tableViewRowClick = async function(_id,_columnIndex,_rowIndex,_count,_running,
    _dblClick){
        try{
             let id= _id || false;
            let columnIndex = (_columnIndex === 1 ? 0 : _columnIndex)  || 0;
            let rowIndex  = (_rowIndex ===1 ? 0 : _rowIndex) || 0;
            let count = _count || 1;
            let running = _running || false;
            let dblClick = _dblClick || false;
           if(!id){return;}
            let startIdx=0;    
            let retTarget = await this.isDisplayDOM(id);
            let tbody = await retTarget.findElements(By.css('table > tbody'));
            
            console.log('Test TableView ', id);
        // 구조 변경으로 인해 2가지의 바디를 사용 함 
        // [1] 로 처리 하면 해결되지만
        // TableView의 구조를 확인시  odd와 even 이 있을시 사용하는 body 테이블임이 확인됨

        // 구조 변경으로 인해 odd와 even 같은 클래스 네임으로 비교하는건 무의미 해졌음 
            if(tbody.length >1){
                for(let i=0;i<tbody.length;i++){
                    // let elementClassName = await firstRow.getAttribute('class');
                    // let isUseBody = elementClassName.split(' ').includes('odd') ||
                    //                 elementClassName.split(' ').includes('even') 
                    let firstRow = await tbody[i].findElement(By.css('tr'));
                    let isUseBody= await firstRow.getAttribute('childElementCount') >=1 ? true :false;
                    if(!!isUseBody){
                        tbody  = tbody[i];
                        break;
                    }
                }
            }
        /* includes에 대한 착각 
            arr.includes('odd','even'); 는 arr안에 odd나 even이 있는지 판별하는게아니라
            ,로 들어가면 두번째 인자가 fromIndex가된다. 그래서 아래와 같이 변경 
            elementClassName.split(' ').includes('odd') ||
            elementClassName.split(' ').includes('even') 
         * 
         */  
            
            let totalRowArray = await tbody.findElements(By.css('tr'));


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


        switch(dblClick){
            case 'CONTEXT':
                await this.driver.actions({bridge:true}).contextClick(clickTarget).perform();
            break;
            // double click 
            case "DOUBLECLICK":
                await this.driver.actions({bridge:true}).doubleClick(clickTarget).perform();
            break;

            default:
                await clickTarget.click();
            break;

        }
        // if(dblClick ==='context'){
        //     console.log('Context Click');
            // await this.driver.actions({bridge:true}).contextClick(clickTarget).perform();

            // Context Click 코드 
           // await this.driver.actions({bridge:true}).click(clickTarget,Button.RIGHT).perform();
         
        // }
        // else if(!dblClick){
        //     await clickTarget.click();
        // }
        // else{
        //     // 더블 클릭 코드 
        //     await this.driver.actions({bridge:true}).doubleClick(clickTarget).perform();
        // }

        }
        catch(err){console.log("[tableViewRowClick] : ",err)}
        finally{
            endFunction("tableViewRowClick");
        }
};
/**
 *  is Postponed
 */
topqa.prototype.regressionListViewIteratorClick = async function(){
    try{
        let imsListView = await this.isDisplayDOM('top-listview#imsListView .top-listview-root',4000);
        console.warn('regressionListViewIteratorClick target');
    }catch(err){
       console.log("[regressionListViewIteratorClick] : ",err);
    }finally{
        endFunction('listviewIteratorClick');
    }
};

topqa.prototype.cssDisplay = async function(selector,waitTime){
    let browserLazy = targetBrowser ==='ie' ? 5 : 1;
    let maxWaitTime =  waitTime *browserLazy || 4000 * browserLazy;
    try{
        let target;
        target = await this.driver.wait(until.elementLocated(By.css(selector)),maxWaitTime);
        return await target;
    }   
    catch(err){
        console.warn("cssDisplay Error  : ",selector);
        console.error(err);
        return false;
    }
};
// Top.js is ID Based Element 
topqa.prototype.isDisplayDOM = async function(selector,waitTime){
    // let browserLazy = targetBrowser ==='ie' ? 5 : 1;
    // let maxWaitTime =  waitTime *browserLazy || 10000 * browserLazy;
    let maxWaitTime = waitTime || 15000;
    try{
        let target = await this.driver.wait(until.elementLocated(By.id(selector)),maxWaitTime);
        return await target;
    }   
    catch(err){
        console.warn("isDisplayDOM Error  : ",selector);
        console.error(err);
        return false;
    }
}; // isDisplayDOM

topqa.prototype.qaConsole = function (message,type){
    try{
        let colorConfig = {
            Reset : "\x1b[0m",
            Bright : "\x1b[1m",
            Dim : "\x1b[2m",
            Underscore : "\x1b[4m",
            Blink : "\x1b[5m",
            Reverse : "\x1b[7m",
            Hidden : "\x1b[8m",
            FgBlack : "\x1b[30m",
            FgRed : "\x1b[31m",
            FgGreen : "\x1b[32m",
            FgYellow : "\x1b[33m",
            FgBlue : "\x1b[34m",
            FgMagenta : "\x1b[35m",
            FgCyan : "\x1b[36m",
            FgWhite : "\x1b[37m",
            BgBlack : "\x1b[40m",
            BgRed : "\x1b[41m",
            BgGreen : "\x1b[42m",
            BgYellow : "\x1b[43m",
            BgBlue : "\x1b[44m",
            BgMagenta : "\x1b[45m",
            BgCyan : "\x1b[46m",
            BgWhite : "\x1b[47m",
        }
        // .toUpperCase()
        switch(type){
                case 'RED':
                    console.log(`${colorConfig["FgRed"]}%s\x1b[0m`,message);
                break;
                case 'GREEN':
                    console.log(`${colorConfig["FgGreen"]}%s\x1b[0m`,message);
                break;
                case 'MG':
                    console.log(`${colorConfig["FgMagenta"]}%s\x1b[0m`,message);
                break;
                case 'CY':
                    console.log(`${colorConfig["FgCyan"]}%s\x1b[0m`,message);
                    break;
                case 'TEST':
                     console.log(`${colorConfig["FgBlue"]}%s\x1b[0m`,message);
                    break;
                default:
                    console.log('\x1b[33m%s\x1b[0m', message);  //yellow
                break;
        }
    }
    catch(err){
        console.error(err);
    }
    


}
topqa.prototype.userWait = async function(waitTime){
    try{
        console.log(`Wait Time ............ {${waitTime/1000} 초}`);
        await this.driver.sleep(waitTime);
    }   
    catch(err){console.warn(err);}
};

topqa.prototype.execute = async function(str){
    try{
        console.log(`executeScript  : [ ${str} ]`);
        return await this.driver.executeScript(str);
    }
    catch(err){console.error(err);}



};
// temp remove
topqa.prototype.createJunitReport = async function(){
    try{
        const retVal = await this.driver.executeScript('return factory.report()');
        console.log(retVal.length);
        makeJunitReport(retVal);

        await this.driver.sleep(3500);
    }
    catch(err){
        console.log(err);
    }
};

topqa.prototype.createExcelReport = async function(){
    try{
        const retVal = await this.driver.executeScript('return factory.report()');
        makeExcelReport(retVal,targetBrowser);
        await this.driver.sleep(2000);
    }
    catch(err){
            console.log(err);
    }

}

topqa.prototype.__log = function(error){
    // Access.log 
    console.log(error);
};


function endFunction(message){
    console.log("--------------------------------[",message,"] >>>>>> End");
};

// deprecated 
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
topqa.prototype.topButtonClick = async function(_id,_dblClick){
    try{
        let id = _id || false;
        let dblClick = _dblClick| false;
        if(!id){return;}
    
        // let topElement = await this.driver.wait(
        //     until.elementIsVisible(this.driver.findElement(By.id(id)) ,5000)
        // );
        let topElement = await this.isDisplayDOM(id);

        // let topElement = this.driver.findElement(By.id(id));
        let targetElement = await topElement.findElement(By.css('.top-button-root'));
        
        if(!!dblClick){
            console.warn('Button DblCLick ');
            await this.driver.actions({bridge:true}).doubleClick(targetElement).perform();
            console.log(`Top Button Double Click :  ${id}`);
        }
        else{
            await targetElement.click();
            console.log(`Top Button Click :  ${id}`);
        }
        

        this.driver.sleep(500);

    }
    catch(err){console.error(err);
            console.log('Error Id ', _id);}
}
topqa.prototype.topButtonDblClick = async function(_id){
    try{
        let id = _id || false;
        if(!id){return;}
            this.topButtonClick(id,true);
    }
    catch(err){console.error(err);}
}

// is Deprecated 
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

// not prototype static function
topqa.driverEnter = async function(){
    try{
        console.log(this);
        console.log(this.driver);
        this.driver.actions({bridge:true})
        .sendKeys(this.driver.key.ENTER)
        .perform();
    }
    catch(err){console.error(err);}
};