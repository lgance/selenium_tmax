const FoldingLayoutTestRunner = {
    foldingEventTestRun:async function(){
        try {
            console.warn('foldinglayout Event Test Runner');    
        } catch (error) {
            console.error(error);
        }
    },
    foldingAPITestRun:async function(){
        try {
            console.log('foldingLayout API Test Runner ');
        } catch (error) {
            console.error(error);
        }
    },
    click:function(){
        console.log('click Method')
    }
  }
  module.exports = {
    FoldingLayoutTestRunner:FoldingLayoutTestRunner
  }  
