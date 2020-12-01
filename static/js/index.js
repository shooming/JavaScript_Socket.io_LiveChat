var socket = io()

/* 소켓 접속시 실행 */
socket.on('connect', function() {
    var input = document.getElementById('test')
    input.placeholder = '메시지를 입력해 주세요'
})

/* 내용 전송 함수 */
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
    socket.emit('send', {msg: message})
}