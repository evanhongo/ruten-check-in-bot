import { launch } from "puppeteer";

const checkIn = async () => {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto('https://member.ruten.com.tw/user/login.htm', { waitUntil: 'networkidle0', timeout: 100000 });
    await page.type('#userid', process.env.ACCOUNT);
    await page.type('#pass', process.env.PASSWORD);
    await page.click('#btn-login');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 100000 });
    await page.goto('https://www.ruten.com.tw/event/daily_mission.php', { waitUntil: 'networkidle0', timeout: 100000 });
    const btn = await page.$('.mission-card-active > button');
    let msg;
    if(!btn)
      msg = "今日已打卡";
    else {      
      await btn.click();
      await page.waitForTimeout(5000);
      const titleElemHandleArr = await page.$$('.rt-label.rt-label-pill.rt-label-secondary-solid');
      const todayTitleElemHandle = titleElemHandleArr[titleElemHandleArr.length -1];
      const { title, status } = await page.evaluate(elem => ({title: elem.textContent, status: elem.nextElementSibling.nextElementSibling.nextElementSibling.textContent}), todayTitleElemHandle);      
      if(status === "已領取") {
        if(title === "今日")
          msg = "打卡成功";
        else { //第7天
          const todayTitleElemHandle2 = await page.$('h3.rt-label.rt-label-pill.rt-label-primary-solid');
          const { title, status } = await page.evaluate(elem => ({title: elem.textContent, status: elem.nextElementSibling.nextElementSibling.nextElementSibling.textContent}), todayTitleElemHandle2);          
          msg = (title === "今日" && status === "已完成任務") ? "打卡成功" : "打卡失敗";
        }
      }
      else
        msg = "打卡失敗";
    }

    try {
      await browser.close();
    }
    catch(err) {
      console.error(err)
    }
    
    return msg
};
  
export default checkIn