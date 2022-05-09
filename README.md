# 2022 캡스톤디자인 5-4
git clone -> npm install -> node ./src/main.js  
내부 포트번호 : 8880

![ERD_04_08](https://user-images.githubusercontent.com/33221641/162347728-ec820f79-cc6b-4785-8fc6-fd38c786c3f3.png)

#
## 사용자 등록
이메일, 닉네임 중복 금지  
url : http://IP:PORT/user/singup  
### header :
> POST 형식  
> content-type : x-www-form-urlencoded  
### body : 
> email : (이메일)  
> pw : (비밀번호)  
> name : (이름)  
> nickname : (닉네임)
### return : 
|     cause      | status | content                                  |
|:-------------:|:------:|------------------------------------------|
|    정보부족   |   404  | "Please fill it up"                      |
|   email 중복  |   202  | "email ${email} is already exists"       |
| nickname 중복 |   202  | "nickname ${nickname} is already exists" |
|   생성 성공   |   200  | "${email} has been created."             |
|      오류     |   202  | "something wrong in signup"              |
#
## 로그인
url : http://IP:PORT/user/login  
### header :
> POST 형식  
> content-type : x-www-form-urlencoded  
### body :
> email : (이메일)  
> pw : (비밀번호)  
### return : 
|    cause    | status | content                                    |
|:-----------:|:------:|--------------------------------------------|
| 로그인 성공 |   200  | { "email": "email", "nickname":"nickname", "score": 10, "credit : 10} |
| 로그인 실패 |   401  | "Unauthorized"                             |
#
## 현재 로그인 상태
url : http://IP:PORT/user/islogin  
### header :
> Get 형식    
### return : 
|    cause     | status | content |
|:------------:|:------:|--------|
| 로그인 상태   |   200  |  true  |
| 비로그인 상태 |   202  |  false |
#
## 로그아웃
로그인 되어있는 상태에서  
url : http://IP:PORT/user/logout
### header : 
> GET 형식
### return : 
|     cause     | status | content |
|:-------------:|:------:|---------|
| 로그아웃 성공 |   200  | "logout" |
#
## 사용자 삭제
로그인 되어있는 상태에서  
url : http://IP:PORT/user/signout
### header : 
> DELETE 형식
### return :
|      cause     | status | content        |
|:--------------:|:------:|----------------|
| 회원탈퇴 성공  |   200  | "sign out"     |
|  비로그인 상태 |   401  | "log in first" |
#
## 사용자 정보
로그인 되어있는 상태에서  
url : http://IP:PORT/user/detail  
nickname 과 email 반환
### header : 
> GET 형식  
### return :
|     cause     | status | content                                   |
|:-------------:|:------:|-------------------------------------------|
|   요청 성공   |   200  | { "nickname":"nickname", "email":"email"} |
| 비로그인 상태 |   401  | "log in first"                            |
# 
# 이미지 목록과 이미지 업로드
#
## 가지고 있는 이미지 목록
로그인 되어있는 상태에서  
url : http://IP:PORT/book/list/has  
### header :
> GET 형식
## return :
|     cause     | status | content                                                 |
|:-------------:|:------:|---------------------------------------------------------|
|   요청 성공   |   200  | [{ no:1, animalName:동물이름, photo:파일 명 }, ... ]     |
| 비로그인 상태 |   401  | "login first"                                            |
#
## 가지고 있지 않은 이미지 목록
로그인 되어있는 상태에서  
url : http://IP:PORT/book/list/less  
### header :
> GET 형식
## return :
|     cause     | status | content                       |
|:-------------:|:------:|-------------------------------|
|   요청 성공   |   200  | [ 동물1, 동물2, 동물3, ...]     |
| 비로그인 상태 |   401  | "login first"                  |
#
## 다른사람 이미지 목록
로그인 되어있는 상태에서  
url : http://IP:PORT/book/list/(닉네임)  
### header :
> GET 형식
## return :
|     cause     | status | content                                              |
|:-------------:|:------:|------------------------------------------------------|
|   요청 성공   |   200  | [{ no:1, animalName:동물이름, photo:파일 명 }, ... ]   |
|  닉네임 없음  |   202  | "check the nickname"                                  |
| 비로그인 상태 |   401  | "login first"                                         |
#
#
## 사용 방법
> react-native : <Image source={{uri : "/book/파일 명"}} />  
> html : \<Img src="/book/파일 명">
#
#
## 이미지 분석 웹 페이지
url : http://IP:PORT/analmal
### header :
> GET 형식
#
## 코인 보유량
url : http://IP:PORT/credit  
### header :
> GET 형식
## return :
|     cause     | status | content                    |
|:-------------:|:------:|----------------------------|
|   요청 성공   |   200  | 100 (가지고 있는 코인의 수)  |
| 비로그인 상태 |   401  | "login first"               |
#
# 상점과 점수
#
## 내 점수
url : http://IP:PORT/score  
### header :
> GET 형식
## return :
|     cause     | status | content         |
|:-------------:|:------:|-----------------|
|   요청 성공   |   200  | 100 (나의 점수)  |
| 비로그인 상태 |   401  | "login first"    |
#
## 전체랭킹
url : http://IP:PORT/top10  
### header :
> GET 형식
## return :
|    cause   | status | content                                                 |
|:----------:|:------:|---------------------------------------------------------|
|  요청 성공  |   200  | [{no : 1, score : 10, nickname : "nick"}, {no : 2}...]  |
|  요청 실패  |   401  | "Wrong Url"                                            |
#