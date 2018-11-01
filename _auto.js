const topqa = require('./topqaModule/autoManager');

const osqa = new topqa();
    /*
        default ->Browser Chrome
        select -> 상단 메인 버튼들 클릭 
        menuSelect -> 좌측 menu 버튼 클릭 
*/
 // test Function 으로 만들어서 
// async await 로 변경 해야함 

// sample 
const targetTableViewId = 'auto_tableview';
osqa.init()
.then(() =>{
    return osqa.gnbMenuSelect('automation');
})
.then(()=>{
    return osqa.lnbMenuSelect('Container');
})
.then(()=>{
    return osqa.subMenuSelect('TableView');
})
.then(()=>{
    // console.log(" 테이블 테스트입니다.");
    return  osqa.tableViewHeaderClick(targetTableViewId);
})
.then(()=>{
    return osqa.tableViewRowClick(targetTableViewId);
})
.then(()=>{
    return osqa.tableViewRowDblClick(targetTableViewId);
})
.then(()=>{
    return osqa.testSubmit();
})
// .then(()=>{
//     return osqa.automationTestPageClose();
// })
.then(()=>{
    return osqa.testReport();
})
.then(()=>{
    return osqa.createJunitReport();
})
.then(()=>{
    // driver quit
    return osqa.quit();
})
.catch((err) =>{
    console.log("실패");
    console.warn(err);
});

/**
 * 
 * tableview 케이스 작성은
 * 
 * // on-rowClick
// on-rowdblClick
// on-rowCheck
// on-headerCheckno
// on-headerClick
// on-pageChange
// on-lengthchange
// addRows API 
ㅇㅇㅇ
로 이루어져야 함 
 * 
 * 
 * 
 */