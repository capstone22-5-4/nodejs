# 2022 캡스톤디자인 5-4
내부 포트번호 : 8880
#
## 사용자 등록
url : http://IP:PORT/user/singup  
#### header :
> POST 형식  
> content-type : x-www-form-urlencoded  
#### body : 
> id : (아이디)  
> pw : (비밀번호)  
> phone : (핸드폰번호)  
#
## 로그인
url : http://IP:PORT/user/login  
#### header :
> POST 형식  
> content-type : x-www-form-urlencoded  
#### body :
> id : (아이디)  
> pw : (비밀번호)  
#
## 로그아웃
url : http://IP:PORT/user/logout
### header : 
> GET 형식
#
## 사용자 삭제
로그인 되어있는 상태에서  
url : http://IP:PORT/user/signout
### header : 
> DELETE 형식
