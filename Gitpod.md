## Using gitpod 

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/lakesare/memcode)

### Troubleshooting

0. Press the above Blue `Ready to Code` Button
1. Be patient for at least 4-5 min (or even more) for the build to complete 
    - A VS Code Editor pane (and others) will pop up first
    - While the build is proceeding in the terminal console below, you can 
    start creating a `env.js` file
    - In the `env.js` file, make sure the postgres userid is `"gitpod"` and password is `"gitpod"`
2. Click on the `Ports` window in the bottom console
    - Against `Port 3000`, click the `"Show in Browser"` button 
3. If the `"Show" in Browser"` does not show up, do the following: 
    - in the workspace/memcode/ terminal, press `<Ctrl-C>`
    - Run the command `make all`  
    - Go back repeat Step 2 
    - This time, you should see the Memcode homepage pop in a separate tab. 
4. Grab the URL of the homepage tab from the addressbar which may look
   something like https://3000-ed00f122-ff83-4345-8442-142d3707044c.ws-ap01.gitpod.io/
5. Click the Github login icon and the callback will fail in the same tab
6. Replace the http://localhost:3000/ with your own gitpod URL (from Step 4)
    - Now you should see the Memcode home page, this time 
      after a successful `Github` authorization
    - That's it! You are done! 

8. Remember to create a bookmark in your browser for the gitpod container
   you have just created
    - You now have a complete cloud development environment!
