# Visualization Tool for Cloud Computing Services (VTCCS)

VTCCS is a tool for visualization and analysis of web services with an Angular
4 frontend and Jersey backend.

Features include:

* Real-time display of web service response times
* A tool for designing graphs to visualize the compositions of web services

## Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Backend

Run `mvn tomcat7:run` to run the backend server. Java and a SQL server a both required to run the backend server. The database configuration file is located at
`java-server/src/main/java/edu/csula/directstem/ws/db/ConnectDB.java`.
