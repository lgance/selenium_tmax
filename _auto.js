



const r = require('./topqaModule/testRunner');
const topqa = require('./topqaModule/autoManager');

(function(){
   r.init();
   r.start()
   .then(()=>{
    return r.quit();
   })
   .catch((err)=>{
       console.log("_auto.js Main");
       console.log(err);  
   });
})();


/**
 * ETC
 *  to do list 드라이버 체크 후 삭제 
 * SessionNotCreatedError 이슈 해결 
 * 
var totalmem = require('os').totalmem();

const os = require('os');
(os.platform()==='win32' && os.arch()==='x64') ?
win32ProcessCheck() :
console.log('Linux');


function win32ProcessCheck(){
    console.warn('win32 Process Check');
    totalmem
}
function linuxProcessCheck(){
   console.warn('linux process Check ');
    const { spawn } = require('child_process');
    const ls = spawn('ls', ['-lh', '/usr']);
    
    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    
    ls.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
'aix'
'darwin'
'freebsd'
'linux'
'openbsd'
'sunos'
 * 
 */

