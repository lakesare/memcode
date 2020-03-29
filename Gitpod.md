## Using gitpod 

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/lakesare/memcode)

### Troubleshooting

0. Press the above Blue `Ready to Code` Button
1. Add a valid `env.js` file while the build is happening.
    - Make sure the postgres userid is 'gitpod' and password is 'gitpod'
2. Click on the `Ports` window in the bottom console
        - Again `Port 3000`, click `"Show in Browser"` button 
3. If the `"Show" in Browser"` does not show up, do this: 
    - in the workspace/memcode/ terminal, press `<Ctrl-C>`
    - run the command `make all` 
    - Go back to Step 2
4. After launching the app in the browser, grab your URL from the addressbar which looks 
    something like https://3000-ed00f122-ff83-4345-8442-142d3707044c.ws-ap01.gitpod.io/
5. Click the Github login icon and the callback will fail
6. Replace the http://localhost:3000/ with your own gitpod URL (from Step 4)
    - and you should see the Memcode home page
    - That's it! You are done! 
        - You are all setup with a cloud development environment!

8. Create a bookmark in your browser for the gitpod container you have just created
    - You literally have a version of your project on the cloud! 
