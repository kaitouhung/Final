# Information assignment 5

## 1. Overview

- The assignment has 5 features: signup, login, forgotpassword, resetPassword, get-user-myself.
- With each route: signup, login, forgotpassword, resetPassword. Request must pass validation before entering controller that also has some validation. Then controller will implement and response to client.
- With route get-user-myself: Request must pass validate token before implement and response to client.
- You can review validation folder to know validation details.
- Sometime, service email can be error timeout. Because it is free or weak internet connection, you can go into db, remove delete newly created user and practice again.
- Check file `Assign5.postman_collection.json` to know details

## 2. Features

### Directory structure

![](./img/structure.PNG)

### Sign up

- wrong input will appear error, all wrong input will handle in validation layer and controller.
- Example: Email is exsits => catch in controller, empty input in validation layer

`validate input`

![](./img/signup_1.PNG)

`email exsits`

![](./img/signup_2.PNG)

- If nothing happens, user will sign up success and system will send email to user.
- System will send: status, token and info user. Token will expire after 7 days.Password will be hashed.

`sign up success`

![](./img/signup_3.PNG)

`email sign up success`
![](./img/signup_4.PNG)

### Login

- Before login success must pass validation layer. if pass it, user will receive information and login success.
- Information such as status, token, data of user. Token will also expire after 7 days.

`validate input`

![](./img/login_1.PNG)

`login success`

![](./img/login_2.PNG)

### Forgot password

- User enters email to take password.
- Email is must right if not it will appear error.
- If email is correct, system will send email reset password.
- Link reset password will be sent. It contains resetToken in params. Reset token is also hashed and expires after 10 minutes
- User will use link to take password.

`input wrong`

![](./img/forgot_1.PNG)

`send mail success`
![](./img/forgot_2.PNG)

`email reset token`
![](./img/forgot_3.PNG)

### Reset Password

- User uses link that will be send to email to reset new password.
- Reset token must right and not expires. password and confirm password is also right.
- If nothing happends, user will be reponse information such as token, data of user, status.

`validate input`

![](./img/reset_3.PNG)

`reset password success`

![](./img/reset_2.PNG)

`reset Token is invalid or has expired`

![](./img/reset_1.PNG)

### Get User Info

- User has to login before getting Information of user.
- user id will be taken in payload of token.
- If login succedd and enter token, user will receive information.

`token invalid`

![](./img/get_3.PNG)

`token`

![](./img/get_1.PNG)

`get information success`

![](./img/get_2.PNG)
