# Question 2

## Description

This is a Nest.js simple application for managing shopping carts. It provides endpoints for creating a new cart, adding items to a cart, deleting items from a cart, and updating the quantity of items in a cart..

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

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Endpoints

### Create a New Cart

- **URL:** `/carts`
- **Method:** `POST`
- **Description:** Create a new shopping cart.
- **Response:** Returns the newly created cart.

Example:

```http
POST /carts
```

### Add an Item to a Cart

- **URL:** `/carts/:cartId`
- **Method:** `POST`
- **Description:** Add an item to a specific cart.
- **Parameters:**
  - `cartId` (string): The ID of the cart to add the item to.
- **Request Body:** The item to add to the cart in the format of `CreateItemDto`.
- **Response:** Returns the newly added item or an error message if the cart is not found.

Example:

```http
POST /carts/12345
Content-Type: application/json

{
  "name": "Product Name",
  "price": 19.99,
  "quantity": 2
}
```

### Delete an Item from a Cart

- **URL:** `/carts/:cartId/:itemId`
- **Method:** `DELETE`
- **Description:** Delete an item from a specific cart.
- **Parameters:**
  - `cartId` (string): The ID of the cart to delete the item from.
  - `itemId` (number): The ID of the item to delete.
- **Response:** Returns the updated cart or an error message if the cart or item is not found.

Example:

```http
DELETE /carts/12345/6789
```

### Update the Quantity of an Item in a Cart

- **URL:** `/carts/:cartId/:itemId`
- **Method:** `PATCH`
- **Description:** Update the quantity of an item in a specific cart.
- **Parameters:**
  - `cartId` (string): The ID of the cart containing the item to update.
  - `itemId` (number): The ID of the item to update.
- **Request Body:** The new quantity of the item in the format of `CreateItemDto`.
- **Response:** Returns the updated cart or an error message if the cart or item is not found.

Example:

```http
PATCH /carts/12345/6789
Content-Type: application/json

{
  "quantity": 5
}
```

## Interactive Swagger UI URL

```
http://localhost:3000/api
```
