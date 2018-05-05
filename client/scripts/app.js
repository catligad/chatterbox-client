$(function() {

  var promise = [];
  var friends = [];

  function renderMessage(result, roomSelected) {
    var scriptPattern = /<script>|<\/script>/;
    var rooms = {};
    for (let i = result.length-1; i > 0 ; i--) {
      let mesg = result[i]['text'];
      let roomname = result[i]['roomname'];
      let user = result[i]['username'];

      if (mesg !== undefined){
        mesg = result[i]['text'].replace(scriptPattern, '');
      } else {
        mesg = 'this user did not create a message!';
      }
      if (result[i]['username'] === undefined) {
        user = 'undefined';
      }
      if (result[i]['roomname'] === undefined) {
        roomname = 'undefined';
      }
      if (result[i]['roomname'] === roomSelected){
        $('.chats').append(
                `<div class = 'render'>
                <div class = 'user ${roomname}'> ${user} </div>
                <div class = 'mesg ${roomname}'> ${mesg} </div>
                </div>
                `); 
      } 
    }
  };

  function roomDropdown(result) {
    var rooms = {};
    for (let i = result.length-1; i > 0 ; i--) {
      let roomname = result[i]['roomname'];

      if (roomname) {
        if (!rooms[roomname]) {
          rooms[roomname] = 'HI!';
          $('select').append(`<option id = '${roomname}'>${roomname}</option>`);
        }
      }
    }
    $('select').val('');
  };

  function displayMessagesFromRoom() {
    $('.render').remove();
    var roomSelected = $('#room').val();
    renderMessage(promise, roomSelected);
    $('.chats').scrollTop(5000);  
  };


  function postMessage () {
    let message = {};
    let text = $('.textbox').val();
    let username = $('.usernameInput').val();
    let roomname = $('#room').val();

    message['username'] = username;
    message['roomname'] = roomname;
    message['text'] = text;
    
    $.ajax({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(obj) {
        promise.unshift(message);
        displayMessagesFromRoom();
      }
    });
  };







  //Actual code that is running
  $.ajax({
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',
    type: 'GET',
    contentType: 'application/json',
    data: {'order': '-createdAt'},
    success: function(obj) {
      promise = obj['results'];
      roomDropdown(promise);    
    } 
  });

  $('select').change(displayMessagesFromRoom);
  $('.submitMessage').on('click', postMessage);

});
