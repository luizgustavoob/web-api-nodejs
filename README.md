# Building a complete Node.js WebApi + testing with no frameworks

This repo is part of the youtube video [Creating and testing a complete Node.js Rest API (With no frameworks)](https://www.youtube.com/watch?v=xR4D2bp8_S0&t=71s).

## Features Checklist

- Web API
    - [x] it should have an endpoint for storing heroes' data
    - [x] it should have an endpoint for retrieving heroes' data
    - [x] it should have an endpoint for updating heroes' data
    - [x] it should have an endpoint for deleting heroes' data

- Testing
    - Unit
        - [x] it should test all files on the routes layer
        - [x] it should test all files on the repositories layer
        - [ ] it should test all files on the factories layer
        - [ ] it should test when the application throws an error
        - Plus
          - [ ] it should reach 100% code coverage (it's currently not possible to get code coverage metrics using only the native Node.js, see [c8](https://www.npmjs.com/package/c8) for this task)

    - Integration / E2E
        - [x] it should test the endpoint for storing heroes' data
        - [x] it should test the endpoint for retrieving heroes' data
        - [x] it should test the endpoint for updating heroes' data
        - [x] it should test the endpoint for deleting heroes' data
        - [x] it should test when the application throws an error
