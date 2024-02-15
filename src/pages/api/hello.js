import axios from "axios";
import qs from "qs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.token && req.body.token.length > 2000) {
      try {
        const captcha = await axios({
          method: "post",
          url: "https://hcaptcha.com/siteverify",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify({
            response: req.body.token,
            secret: process.env.HCAPTCHA,
          }),
        });

        if (captcha.status != 200) {
          res.status(captcha.status).json(captcha.data);
        } else if (captcha.data.success) {
          res.status(200).json({ name: "John Doe" });
        }
      } catch (error) {
        console.log("error.stack", error.response.data);
        res.status(500).json({ message: "catch hcaptcha" });
      }
    }
  }
}
