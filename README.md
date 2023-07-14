
# Code Editor Backend

https://cometk.onrender.com/
 
## PostMan Documentation

- checkout postman documentation for detailed Description

### [Postman](https://documenter.getpostman.com/view/20003749/2s946e9Ywj)


## Installation

Install with npm

To run server
```bash
 npm i
 npm run dev
```
### `All API call(except Register and Login) should contain access token in headers with key "auth-token"`
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`- port number

`ACCESS_TOKEN`- Sphere engine API 

`ENDPOINT` - sphere engine Endpoint

`MONGO_URI` - mongo db url

`TOKEN_KEY` - Secret Token key 




## API Reference

### Register User

```http
  POST /api/auth/register
```
#### Returns access token and email 


### Login user

```http
  POST /api/auth/login
```
#### Returns access token and email 


### Add problems

```http
  POST /api/admin/problems
```
#### Returns problemId and problemCode


### Get problem list

```http
  GET /api/admin/problems?limit={n}
```
#### Returns List of Problems added


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `n`      | `int` | **Required**. no. of problem to be fetched in one call, can be used in pagination |




### Get problem Description

```http
  GET /api/admin/problems/{id}
```
#### Returns Problem Details


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. problem ID|



### Update Problem

```http
  PUT /api/admin/problems/{id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. problem ID|


### Delete Problem

```http
  DELETE /api/admin/problems/{id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. problem ID|


### Add test cases

```http
  POST /api/admin/testcase
```



### Get test cases

```http
  GET /api/admin/testcase/{id}
```
#### Returns all the test case of problem 
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. problem ID|


### Get submission status

```http
  POST /api/participant/submissions
```
### sends Submission status to User's Email(using nodemailer)

#### Returns status of submission of code

