# SMU Portal - Backend


## Table of content

* [Overview](#overview)
* [Features](#features)
* [System requirements](#system-requirements)
* [Prerequisites](#prerequisites)
* [Dependencies](#dependencies)
* [Bug reports](#bug-reports)
* [License](#license)
* [Contact](#contact)
* [Wiki][wiki]

## Overview

**SMU Portal** is a free and open source portal for universities. It is an attempt at centralizing the different services that SMU offers in one platform to ensure easier and more efficient access for both staff members and students.
SMU Portal is a junior project developed for the ISS396 course taught at [MedTech](http://www.medtech.tn/).    
This repository is dedicated to the backend of SMU Portal, you can find the frontend [here](https://github.com/MedTech-CS321/smuportal-frontend).

## Features
- Authentication with support for email and app based 2FA.
- Box reservation for all SMU departments.
- Expandable codebase with a built-in support for modules (called Apps).
- Email delivery system to notify user about changes related to their account (password reset, account confirmation, etc.).

## System requirements

- This project was mainly developed on Windows 10. Since no OS dependent APIs were used, it should work on all operating systems supported by Node.js. If you encouter any compatibility issues refer to the [bug reports](#bug-reports) section.
- A decent CPU in order to process all requests in a timely manner.

## Prerequisites

- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or any cloud database service with support for MongoDB.
- [Node.js 12+](https://nodejs.org/en/download/)

## Dependencies

All the dependencies are listed inside [`package.json`][package.json]. Here is a list of all the relevant frameworks and libraries used:
- express
- mongoose
- nodemailer
- nodemon
- @hapi/joi
- simple-oauth2
- speakeasy
- jsonwebtoken

## Bug reports

To file one or multiple bug reports, please use the [issue tracker][issue-tracker] related to the approriate repository.   
Failure to report the bug in the relevant repository (only backend bugs should be reported here) or to comply with the template instructions for creating an issue will result in the closure of said issue.
## License

SMU Portal is licensed under AGPLv3 "or later" by default. Learn more about the permissions and limitations of this license [here](https://github.com/MedTech-CS321/smuportal-backend/blob/master/LICENSE).

## Contact

Please refrain from contacting the contributors of this project individually. Forward all your requests and feedback through these means:

- **Email**: <SMUPortalTA@msb.tn>
- **GitHub issue tracker**: [issue tracker][issue-tracker] (report bugs here)

## Additional information
For a complete guide on how to setup a development environment and run the project, please check the [Wiki][wiki].

[issue-tracker]: https://github.com/MedTech-CS321/smuportal-backend/issues
[package.json]: https://github.com/MedTech-CS321/smuportal-backend/blob/master/package.json
[Wiki]: https://github.com/MedTech-CS321/smuportal-backend/wiki