require('chromedriver');
require('iedriver');
const webdriver = require('selenium-webdriver');
const{ By, Util } = webdriver;

const targetBrowser = !!process.argv[2] ? process.argv[2] : 'chrome';

// module exports and topqa 
module.exports = topqa;

function topqa(){
    this._selectList = {
        "regression":"regBtn",
        "automation":"autoBtn",
        "api":"apiBtn",
        "integration":"integrationBtn"
      };
   

    this.driver;
    // 현재 페이지가 없으면 안됨;
    this.currTestPage;

    // 1 depth Web Element with Text
    this.currlnbMenu;
    this.currlnbMenuText;
    
    // 2 depth Web Element with Text
    this.currlnbSubMenu;
    this.currlnbSubMenuText;



    /** basic loading */
    this._url; 

}
topqa.prototype.test = async function(){

   

}
topqa.prototype.init = async function(){

    
    console.warn("Automation Start");
    console.warn("Start Browser  " + targetBrowser);
    console.warn("target Platform : "+ process.platform);
    console.warn("Start Time : " + process.uptime());
  
    if(targetBrowser==='chrome'){
//  WebDriverError: unknown error: DevToolsActivePort file doesn't exist
//  Issue Chrome 66 Update 로 인해서 DevtoolsActivePort 를 찾지 못하는 에러가 발생 
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

    try{
        //    driver = await driver.build();
            await this.driver.get(this._url);
            await this.driver.manage().window().maximize();
            // await driver.findElement(By.id('autoBtn')).click();;
    }
    catch(err){
            console.error(err);
    }
    finally{
        console.log("driver execute Success");
        // await this.driver.sleep(2000);
        // 실수로quit해버리니까 session 에러가 남.. 
        // await this.driver.quit();
    }
}
topqa.prototype.quit = async function(){
    await this.driver.sleep(2000);
    await this.driver.quit();
}
topqa.prototype.isIE = function(){
    return targetBrowser==='ie' ? true : false;
}
// subMenu Click after lnbMenu click 
topqa.prototype.subMenuSelect = async function(clickSubMenuText){
    try{
        // not select lnbMenu 
        if(this.currlnbMenu===undefined || !this.currlnbMenu === true){
                console.log("lnbMenu 를 선택해주세요");
                endFunction("prototype.subMenuSelect currlnbMenu is not exist");
                return;
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
            await Promise.all(subMenuList.map(async (item,index)=>{
                let topSubMenuTextTag = await item.findElement(By.css('.top-menu_text'));
                let targetText = await topSubMenuTextTag.getText();
                    if(clickSubMenuText.toLowerCase()===targetText.toLowerCase()){
                        console.log("find It");
                            this.currlnbSubMenu = item;
                            this.currlnbSubMenuText = targetText;
                            await topSubMenuTextTag.click();
                            return item;
                    }
                    else{
                            console.log("[subMenuSelect] Looking for element : " ,clickSubMenuText );
                            console.log("[subMenuSelect] Checking for element : " ,targetText );
                            console.log('');
                    }
            }));
        }
    
    }
    catch(err){
    console.log("subMenuSelect : ", err);
    }
    finally{
        endFunction("prototype.subMenuSelect");
    }
}

topqa.prototype.menuSelect = async function(lnbMenuText){
    try{
        let checkMenu = await this.driver.findElements(By.tagName('top-menu'))
        if(await checkMenu.length > 1){
                console.log("메뉴 2개");
                return;
        }
        else{
            console.log("메뉴 1개 확인");
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
                    console.log("[menuSelect]  Looking for element : " ,lnbMenuText);
                }
            }
      }else{
           await Promise.all(menuTextArray.map(async (item,index)=>{
                let topMenuText = await item.findElement(By.css('.top-menu_text'));
                let targetText = await topMenuText.getText();
                if(lnbMenuText === targetText){
                    console.log("Find");
                    this.currlnbMenu = item;
                    this.currlnbMenuText= targetText;
                    await topMenuText.click();
                    return item;
                }else{
                    console.log("[menuSelect]  Looking for element : " ,lnbMenuText);
                }  
            }));
        } // targetBrowser === 'chrome'
//. ECONNREFUSED connect ECONNREFUSED 확인 하여야함 
        }
    }
    catch(err){
        console.log("[menuSelect]  >>>> ", err);
    }
    finally{
        console.warn('click Lnb Menu : ', this.currlnbMenuText);
        endFunction("prototype.menuSelect");    
    }
}
topqa.prototype.select = async function(spec){
    let selectList = this._selectList;
    console.log("this Spec  : ",spec);
    try{
        console.log("ID Check   :  " + selectList[spec]);
        
        let moveBtn = await this.driver.findElement(By.id(selectList[spec]));
        await moveBtn.click();
        // 클릭 성공시 메뉴 반환 
        let lnbList = await this.driver.findElements(
        By.css('top-menu#lnbMenu .top-menu_nav > li')
    );
    // if(await lnbList.length>0){
    //     // Sub메뉴 가 존재할때
    //     lnbList.map(async i => {
    //         console.log(await i.getText());
    //     });
    // }
    }
    catch(err){
        console.error("[select Function Error] >>> " + err);
    }
    finally{
        this.currTestPage = spec;
        await endFunction("prototype.select");
    }
}
async function endFunction(message){
    console.log("--------------------------------[",message,"] >>>>>> End");
}