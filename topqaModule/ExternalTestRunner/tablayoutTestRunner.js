const path = require('path');
const Util = require(path.join(__dirname,('../Util/')));


const TabLayoutTestRunner = {
  tablayoutEventTestRun:async function(driver){
    try {
        console.warn('tablayout Event Test Runner');
        
        // tab Change 및 tab Select 
        let tabChange_tabSelect_test_target ="top-tablayout#tabChange_tabSelect_test_target #selectCallback";
        Util.waitforVisibleElement(driver,tabChange_tabSelect_test_target).then((change_select_Tablayout)=>{
            change_select_Tablayout.click();
        })
        .catch(()=>{
            console.error('error');
        })
        





    } 
    catch (error) {
        console.error(error);
    }
  },
  tablayoutAPITestRun:async function(driver,osqa){
      try {
          console.warn('tablayout API Test Runner');        
          await osqa.topButtonClick();
      }
      catch (error) {
          console.error(error);
      }
  },
  
}
module.exports = {
  TabLayoutTestRunner:TabLayoutTestRunner
}  