# Fill in Factorial clock-in hourse with puppeteer

Install puppeteer with `yarn install`.

Get your factorial cookie by opening factorial in your browser, then log in,
then go to Developer Tools -> Storage -> Cookies -> .api.factorialhr.com.

Run `yarn start 2021 START_YEAR START_MONTH COOKIE` to fill in all clock in
hours from 10:00 to 18:00 until present day (or december if not current year).

