# tomcat-visual

An animated, beginner-friendly guide to **Apache Tomcat**, told as the story of Ravi's restaurant. Nine clickable steps build one SVG diagram. No build step, no dependencies.

**You will learn:** what a client and server are, what Tomcat does, what port 8080 is, how a WAR file is deployed, how a servlet and JSP make a response, how threads serve many users, and how to read logs.

## Moving objects

| Object | Meaning | Restaurant analogy |
|---|---|---|
| ✉️ Envelope | HTTP request | Customer's order slip |
| 📦 Package | WAR deployment | Packed new menu |
| ⚙️ Gear | Java processing | Chef cooking |
| 📄 Document | HTML response | The served dish |
| ✅ Check mark | Successful response | Happy customer |
| ⚠️ Warning | Error | Kitchen problem |
| 📋 Clipboard | Log entry | Line in the daily register |

## The 9 steps

1. **Customer opens a browser** - a client types a website address.
2. **Request reaches the server** - an HTTP request travels to the web server (reception). Client asks, server answers.
3. **Apache Tomcat starts** - a Java servlet container listens on port 8080 and runs on the JVM.
4. **Deploy a Java application** - a WAR file lands in `webapps`; Tomcat unpacks and starts it.
5. **Process the request** - Tomcat passes the request to a Java Servlet.
6. **Generate the response** - the servlet (optionally with JSP) returns HTML and a 200 OK.
7. **Handle multiple users** - a thread pool gives each request a free worker thread.
8. **Monitor and troubleshoot** - logs, errors, port conflicts and service status.
9. **Deploy and manage in the real world** - full cycle, redeploy, restart, HTTPS, security updates and configuration.

## Run locally

```bash
cd tomcat-visual
python3 -m http.server 8000
```
Open http://localhost:8000.

## Host on GitHub Pages

1. Create a GitHub repository named `tomcat-visual`.
2. Upload the project files to the `main` branch.
3. Open **Settings → Pages**.
4. Under Source choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Click **Save**, wait a minute, then open the published website link.

## Project structure

```
tomcat-visual/
├── index.html      page structure
├── css/style.css   layout, light/dark themes, animation, reduced motion
├── js/app.js       step data, SVG helpers, diagram, captions, autoplay
├── .nojekyll
├── LICENSE
└── README.md
```

## Customise

- **Text:** edit the `STEPS` array (and `LEGEND`) at the top of `js/app.js`.
- **Positions:** each component is one helper call, for example `node(5, 520, 265, 150, 60, C.purple, 'Java Servlet', 'the chef')` = step, x, y, width, height, colour, title, subtitle. Wires are `wire(step, id, 'M x,y L x,y', colour)`; packets use `pk(step, emoji, wireId, seconds, delay)`. The canvas is 1100x620.
- **Colours:** change the `C` object in `js/app.js` for the diagram, and the CSS variables at the top of `css/style.css` for the page.

## Glossary

- **Client / browser** - the program that asks for a page.
- **Server** - the computer that answers.
- **HTTP request / response** - the message asked and the message returned.
- **Web server** - front desk that receives requests (Apache HTTP Server, Nginx).
- **Apache Tomcat** - software that runs Java web applications.
- **Servlet** - a Java class that handles a request.
- **JSP** - JavaServer Pages: HTML templates with Java logic.
- **WAR file** - Web Application Archive: a packed Java web app.
- **webapps** - the folder where Tomcat finds applications.
- **Port 8080** - Tomcat's default HTTP port.
- **Deployment** - installing an application into Tomcat.
- **JVM** - Java Virtual Machine, runs Java programs.
- **Thread pool** - a set of ready worker threads that handle requests.
- **Logs** - Tomcat's activity records in the `logs` folder.
- **HTTPS** - HTTP encrypted with TLS.

## Troubleshooting

- **Port 8080 already in use:** another program holds the port. Find it (`ss -ltnp | grep 8080`), stop it, or change the Connector `port` in `conf/server.xml`.
- **Tomcat will not start:** check `logs/catalina.out`, confirm Java is installed (`java -version`) and `JAVA_HOME` is set, and look for port conflicts or XML mistakes in `server.xml`.
- **HTTP 404:** wrong URL or app not deployed. Check the folder in `webapps` and the context path.
- **HTTP 500:** the application crashed. Read the stack trace in `logs/localhost.*.log` and `catalina.out`.
- **WAR deployment fails:** check the file is a valid WAR, `webapps` is writable, the Java version matches the app, and read the deployment errors in `catalina.out`.
- **Always check the logs first.** They are in `$CATALINA_HOME/logs`.

## License

MIT, see `LICENSE`. Replace `YOUR NAME`.
