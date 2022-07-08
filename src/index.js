import dotenv from "dotenv";

import checkIn from "./utils/checkIn.js";
import lineNotify from "./utils/lineNotify.js";

dotenv.config();

const main = async () => {
  try {        
    const msg = await checkIn();
    await lineNotify(msg);
  }
  catch(err){
    console.error(err)
  }
};

main();
