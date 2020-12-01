const express = require('express') //express 모듈 불러옴
const socket = require('socket.io') //socket.io 모듈 불러옴
const http = require('http') //node.js 내장 http 모듈 불러옴
const fs = require('fs') //node.js 내장 fs(파일처리 관련) 모듈 불러옴
const { response } = require('express')

const app = express() //express 객체 생성
const server = http.createServer(app) //express http 서버 생성
const io = socket(server) //생성된 서버 socket.io에 바인딩

/* 미들웨어 역할로 http:// 서버주소/css 액세스 시도 할 경우 거부를 방지하기 위해 추가 */
app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

/*Get으로 / 경로 접속시 실행됨*/
app.get('/', function(req, res){
    fs.readFile('./static/index.html', function(err, data) {
        if(err) {
            res.send('에러')
        } else {
            res.writeHead(200, {'Content-Type':'text/html'})
            res.write(data)
            res.end() //write를 통해 응답 할 경우 end 사용해 주어야함
        }
    })
})

io.sockets.on('connection', function(socket){ //connection 발생시 콜백함수 실행, io.sockets는 접속되는 모든 소켓들
 
    /* 새루운 유저 접속시 다른 소켓에 알림*/
    socket.on('newUser', function(name){
        console.log(name + ' 님이 접속하였습니다.')
        socket.name = name // 소켓에 이름 저장
        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'}) // 모든 소켓에 전송
    })

    /* 전송한 메시지 받기 */
    socket.on('message', function(data){ //message라는 이벤트 받을 경우 호출 message는 변수명이기 때문에 자신이 원하는 이벤트 명으로 바꿀 수 있음
        data.name = socket.name // 받은 데이터 누가 보낸건지 이름 추가
        console.log(data) // data는 client에서 보내온 json data임
        socket.broadcast.emit('update', data); // 보낸 사람을 제외한 나머지 유저에게 메시지 전송
    })

    /* 접속 종료 */
    socket.on('disconnect', function() { //disconnect는 socket.io 기본 이벤트 연결된 소켓과 접속 끊기면 자동으로 실행
        console.log(socket.name + '님이 나가셨습니다.')
        /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
        socket.broadcast.emit('update', {type : 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
    })
})

/* 
메시지 보낼때
io.sockets.emit() = 모든 유저(본인 포함)
socket.broadcast.emit() = 본인을 제외한 나머지 모두
*/

/*서버를 8080 포트로 listen*/
server.listen(8080, function() {
    console.log('서버 실행 중..')
})