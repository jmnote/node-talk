var socket = io();
var last_sender = null;
var avatar_type = 'identicon';
// var avatar_type = 'letter';

function randomUsername() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function send() {
	socket.emit('message', {
		'username' : $('#username').val(),
		'content' : $('#content').val()
	});
	$('#content').focus();
}

function createIdenticonAvatar( username ) {
	var hash = CryptoJS.MD5(username).toString();
	var img_data = new Identicon(hash, 50).toString();
	return $('<div class="avatar-box">')
		.append( $('<img class="photo">').attr('src', "data:image/png;base64," + img_data) );
}

function createLetterAvatar( username ) {
	var colorHash = new ColorHash({ lightness: 0.5, saturation: 0.7 });
    var color = colorHash.hex( username );
    var initial = username.charAt(0);
	return $('<div class="avatar-box">')
		.append( $('<div class="photo lavatar">').css('background', color).text(initial) );
}

function showMessage(message) {
	var avatar_box = ( avatar_type == 'identicon' )? 
		createIdenticonAvatar( message.username ) : createLetterAvatar( message.username );
	
	var who = ( $("#username").val() == message.username )? 'mine' : 'others';
	var sender_visible = ( last_sender == message.username )? 'sender-hidden' : 'sender-show';
	

	$('#chat').append(
		$('<div class="message">').addClass(who).addClass(sender_visible)
			.append( avatar_box )
			.append( $('<div class="text-box">')
				.append( $('<div class="username-box">' ).text( message.username ) )
				.append( $('<div class="content-box">')
					.append($('<span>').text(message.content))
				)
			)
	);
	$("#chat")[0].scrollTop = $("#chat")[0].scrollHeight;
	last_sender = message.username;
}

$(function () {
	$("form").submit( function (e) { e.preventDefault(); });
	$('#send-btn').click(function () { send(); });
	socket.on('message', function (message) { showMessage(message); });
	$("#username").val( randomUsername() );
	$('#content').focus();
});
