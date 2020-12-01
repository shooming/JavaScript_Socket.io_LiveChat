var socket = io()

/* 소켓 접속시 실행 */
socket.on('connect', function() {
    var name = prompt('반갑습니다!', '') //이름 입력 받고
    /* 이름이 빈칸인 경우 */
    if(!name) {
        name = '익명'
    }

    socket.emit('newUser', name) // 서버에 새로운 유저 접속 알림
})

socket.on('update', function(data) {
    var chat = document.getElementById('chat')

    var message = document.createElement('div')
    var node = document.createTextNode(`${data.name}: ${data.message}`)
    var className = ''


    // 타입에 따라 적용할 클래스를 다르게 지정
    switch(data.type) {
        case 'message':
        className = 'other'
        break

        case 'connect':
        className = 'connect'
        break

        case 'disconnect':
        className = 'disconnect'
        break
  }

  message.classList.add(className)
  message.appendChild(node)
  chat.appendChild(message)

})


/* 메시지 전송 함수 */
function send() {
    // 입력된 데이터 가져옴
    var message = document.getElementById('test').value

    // 데이터 가져온 후 입력된 내용 지움
    document.getElementById('test').value = ''

    /*
    서버로 send 이벤트 전달 + 데이터와 함께
    socket.emit(전송), socket.on(수신)으로 사용함
    만약 send라는 이름으로 이벤트 전송하면 받는곳에서는 on('send')가 있어야함
    즉 이벤트명이 동일한것 끼지 데이터 송/수신이 이루어짐
    */

    // 내가 전송할 메시지 클라이언트에게 표시
    var chat = document.getElementById('chat')
    var msg = document.createElement('div')
    var node = document.createTextNode(message)
    msg.classList.add('me')
    msg.appendChild(node)
    chat.appendChild(msg)

    socket.emit('message', {'type': 'message', message: message})
}



