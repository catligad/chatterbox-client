// http://parse.sfm6.hackreactor.com/chatterbox/classes/messages
//BARE MINUMUM REQUIREMENTS:
//display messages received from the parse server
  //use proper escaping on any user input


  // POST:
  //var message = {
  //   username: 'shawndrost',
  //   text: 'trololo',
  //   roomname: '4chan'
  // };


  // $.ajax({
  //   // This is the url you should use to communicate with the parse API server.
  //   url: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',
  //   type: 'POST',
  //   data: JSON.stringify(message),
  //   contentType: 'application/json',
  //   success: function (data) {
  //     console.log('chatterbox: Message sent');
  //   },
  //   error: function (data) {
  //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
  //     console.error('chatterbox: Failed to send message', data);
  //   }
  // });

  // var app = { 
  //   init: function(){},
    // send: function() {
    //   $.ajax({
    //     url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    //     type: 'POST',
    //     data: JSON.stringify(message),
    //     contentType: 'application/json',
    //     success: function(message) {
    //     }
    //   })
    // },

  //   fetch: function() {
  //     $.ajax({
  //       url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',
  //       type: 'GET',
  //       contentType: 'application/json',
  //       data: {'order': '-createdAt'},
  //       success: function(obj) {
  //         result = obj['results'];
    
  //         var scriptPattern = /<script>|<\/script>/;
  //         var rooms = {};
  //         for (let i = result.length-1; i > 0 ; i--) {
  //           var mesg = result[i]['text'];
  //           if (mesg !== undefined){
  //           mesg = result[i]['text'].replace(scriptPattern, '');
  //           }
  //           let roomname = result[i]['roomname'];
            
  //           $('.chats').append(`<div class = 'mesg ${roomname}'>${mesg}</span>`);
  //           $('.mesg').hide();
  //           if (!rooms[roomname]) {
  //             rooms[roomname] = 'HI!';
  //             $('select').append(`<option id = '${roomname}'>${roomname}</option>`);
  //           }
  //         }
    
  //         function changeRooms() {
  //           var val = $('select').val();
  //           $(`${val}`).show();
  //         }
    
  //         $( 'select' ).change(changeRooms);
    
    
    
  //       } 
  //     })
  //   },

  //   clearMessages: function() {

  //   }
  // };




$(function() {

  var promise = [];

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
  }

  function displayMessagesFromRoom() {
    $('.render').remove();
    var roomSelected = $('#room').val();
    renderMessage(promise, roomSelected);

  }

  function postMessage () {
    let message = {};
    let text = $('.textbox').val();
    let username = $('.usernameInput').val();
    let roomname = $('#room').val();

    message['username'] = username;
    message['roomname'] = roomname;
    message['text'] = text;

    console.log(message)
    
    $.ajax({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(message) {
        promise.push(message);
        console.log(promise)
        displayMessagesFromRoom(roomname);
      }
    });


  }

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
