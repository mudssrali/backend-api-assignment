## Backend-end Assignment

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Assumptions

* It is assumed that `fein` is unique for each business so no new business can be registered with the same `fein`.
* Since no validation roles provided for business  `fein` and `name`, only applied simple required validation
* It is assumed that business can progress one step at a time.
* Since no valid format for `contact.phone` is provided, so no validations applied
* It is assumed that a valid contact must have both a `name` and a `phone` to move a business from Market Approved 
* It is assumed that system will not accept any industries other than these four. 
* Since no external services (e.g. databases) are required, it is assumed that businesses will be stored in-memory.