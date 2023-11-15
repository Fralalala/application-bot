## Installations

1.  You need to have Node.Js installed. Go to https://nodejs.org/en/download/current and install first.
2.  For Mac Users, run this in your terminal: 
    ```
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
    ```

    It will give you message like this: 
    ```
    DevTools listening on ws://127.0.0.1:9222/devtools/browser/1551e574-1c45-4dbd-b30d-9a045b1c43ef
    ```

    Copy: ```ws://127.0.0.1:9222/devtools/browser/1551e574-1c45-4dbd-b30d-9a045b1c43ef``` . 
    
    ATTENTION: This will look differently to yours, do not copy this exact url, copy what's in your terminal

4. After copuing the link provided in the terminal, the one with ```ws``` at the beginning, copy that value inside of the `indeedApply.js` File in the `wsChromeEndpointurl` variable.

3. Run:  ```npm install```

4. To use indeedApply.js, use the commands: 

```
node indeedApply.js "https://www.indeed.com/jobs?q=software+engineer+%2470%2C000&l=United+States&sc=0kf%3Aexplvl%28ENTRY_LEVEL%29%3B&vjk=2a73f56510ac6714"
``` 

The command above command will make you apply on all "Easily Apply" job postings in Indeed. Autofill must be enabled in the browser.

Tested and working with `Google Chrome` and a `Gmail` account for autofill.