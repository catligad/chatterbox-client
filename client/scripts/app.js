$(function() {
  var promise = [];

  //renders messages on the page: takes in the promise & the room that you're in
  var renderMessage = (result, roomSelected) => {
    var scriptPatternUser = /<script>|<\/script>|\s|\W+/gi;
    var scriptPatternMessage = /<script>|<\/script>|/gi;
    var rooms = {};
    for (let i = result.length - 1; i >= 0; i--) {
      let mesg = result[i]['text'];
      let roomname = result[i]['roomname'];
      let user = result[i]['username'];

      //sanitizing each input
      if (mesg !== undefined) {
        mesg = result[i]['text'].replace(scriptPatternMessage, '');
      } else {
        mesg = 'this user did not create a message!';
      }
      if (result[i]['username'] !== undefined) {
        user = result[i]['username'].replace(scriptPatternUser, '');
      } else {
        user = 'undefined';
      }
      if (result[i]['roomname'] === undefined) {
        roomname = 'undefined';
      }

      //append the chats of the room to your DOM
      if (result[i]['roomname'] === roomSelected) {
        $('.chats').append(
          `<div class = 'render completeMessage'>
                    <div class = 'user ${roomname} ${user}'> ${user} </div>
                    <div class = 'mesg ${roomname}'> ${mesg} </div>
                </div>
                `); 
      } 
    }
  };

  //creates the room dropdown
  var roomDropdown = (result) => {
    var rooms = {};
    for (let i = result.length - 1; i > 0; i--) {
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

  //renders the messages of the room on the DOM
  var displayMessagesFromRoom = () => {
    $('.completeMessage').remove();
    var roomSelected = $('#room').val();
    renderMessage(promise, roomSelected);
    $('.chats').scrollTop(5000);  
  };

  //posts message to the server
  var postMessage = () => {
    let message = {};
    let text = $('.textbox').val();
    let username = $('.usernameInput').val();
    let roomname = $('#room').val();

    console.log(username);
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

  //adds a new room to the options
  var addRoom = () => {
    var room = prompt('What room would you like to create?');
  
    if (room !== null || room !== '') {
      $('select').append(`<option id = '${room}'>${room}</option>`);
    }
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

  $('.send').on('click', postMessage);
  $('.submitMessage').on('click', postMessage);
  $('select').change(displayMessagesFromRoom);
  $('.textbox').val('start typing!');
  
  $(document).on('click', '.user', function(event) {
    let username = event.target.innerText;
    $(`.${username}`).closest('.completeMessage').toggleClass('clickedFriend');
  });

  $('.icon').click(function() {
    $.ajax({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',
      type: 'GET',
      contentType: 'application/json',
      data: {'order': '-createdAt'},
      success: function(obj) {
        promise = obj['results'];
        displayMessagesFromRoom();  
      } 
    });
  });

  $('.newRoomForm').on('click', addRoom);

});
