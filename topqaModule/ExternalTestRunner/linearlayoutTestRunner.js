const LinearLayoutTestRunner = {
  linearlayoutEventTestRun:async function(){
    try {
        console.warn('LinearLayout Event Test Runner');
    } 
    catch (error) {
        console.error(error);
    }
  },
  linearlayoutAPITestRun:async function(){
      try {
          console.warn('LinearLayout API Test Runner');        
      }
      catch (error) {
          console.error(error);
      }
  },
  click:function(){
      console.log('click Method')

  }
}
module.exports = {
  LinearLayoutTestRunner:LinearLayoutTestRunner
}  