function divescapedContentelement(message) {
    return $('<div></div>').text(message)
}

function disSystemcontentelement(message) {
    return $('<div></div>').html('<i>' + message + '</i>')
}

function processUserInput(chatApp, socket) {
    var message = $('#send-message').val()

    var systemMessage

    if(message.chatAt(0) == '/'){
        systemMessage = chatApp.processCommand(message)
        if(systemMessage) {
            $('#messages').append(divescapedContentelement(systemMessage))
        }
    }else {
        chatApp.sendMessage($('#room').text(), message)
        $('#messages').append(divescapedContentelement(message))
        $('#messages').scrollTop($('#messages').prop('scrollHeight'))
    }

    $('#send-message').val('')
}

