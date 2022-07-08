import axios from "axios";

export default async function lineNotify(msg) {
    await axios.post("https://notify-api.line.me/api/notify", null, {
      headers: {
        Authorization: `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
      },
      params: { message: msg },
    });
    return;
};