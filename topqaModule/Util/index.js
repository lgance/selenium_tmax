
module.exports = {

  timeout:8000,
  waitforVisibleElement:async function(driver,selector){
      return await driver.wait(
        until.elementIsVisible(
          await driver.findElement(By.css(selector))
        )
        ,this.timeout
      )
  },

  waitforLocatedElement:async function(driver,selector){
    return await driver.wait(
        until.elementLocated(
          await driver.findElement(By.css(selector))
        )
        ,this.timeout
      )
  }
}

