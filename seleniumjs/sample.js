const topqa = require('./topqaModule/autoManager');

const osqa = new topqa();
/*
        default ->Browser Chrome
        select -> 상단 메인 버튼들 클릭 
        menuSelect -> 좌측 menu 버튼 클릭 
*/

osqa.init()
.then(() =>{
    return osqa.select('automation');
})
.then(()=>{
    return osqa.menuSelect('Container');
})
.then(()=>{
    return osqa.subMenuSelect('TableView');
    // return osqa.test();
})
.then(()=>{
    console.log("정상 종료 합니다.");
    return osqa.quit();
})
.catch((err) =>{
    console.log("실패");
    console.warn(err);
});



