//on ready function wrapped around jQuery
$(document).on('ready', function(){

	// Firebase link
	var dataRef = new Firebase("https://adambay.firebaseio.com/");

	// Initial Values
	var keyId = "";
	var loggedIn = false;
	var trainName = "";
	var destination = "";
	var start = "";
	var frequency = 0;
	var startConverted = "";
	var diffTime = "";
	var tRemainder = "";
	var tilTrain = "";
	var nextTrain = "";
	var update = function(){
		$('#trainData > tbody').empty();
		$('#trainData > thead > tr').empty();
		if(loggedIn){
			$('#trainData > thead > tr').append("<th>" + "Train Name" + "</th><th>" + "Destination" + "</th><th>" + "Frequency (min)" + "</th><th>" + "Next Arrival" + "</th><th>" + "Minutes Away" + "</th><th>" + "Remove Train" + "</th><th>" + "Edit Train" + "</th>");
			dataRef.on("child_added", function(snapshot){
			
				startConverted = moment(snapshot.val().start,"HH:mm");

				diffTime = moment().diff(startConverted, "minutes");

				tRemainder = diffTime % snapshot.val().frequency;

		    tilTrain = snapshot.val().frequency - tRemainder;

		    nextTrain = moment().add(tilTrain, "minutes");
		   
		    $('#trainData > tbody').append("<tr><td>" + snapshot.val().trainName + "</td><td>" + snapshot.val().destination + "</td><td>" + snapshot.val().frequency + "</td><td>" + nextTrain.format("HH:mm") + "</td><td>" + tilTrain + "</td><td><button class=" + "remove" + " data-id=" + snapshot.key() + ">Remove</button></td><td><button class=" + "edit" + ">Edit</button></td></tr>");
			})
		}else{
			$('#trainData > thead > tr').append("<th>" + "Train Name" + "</th><th>" + "Destination" + "</th><th>" + "Frequency (min)" + "</th><th>" + "Next Arrival" + "</th><th>" + "Minutes Away" + "</th>");
			dataRef.on("child_added", function(snapshot){
			
				startConverted = moment(snapshot.val().start,"HH:mm");

				diffTime = moment().diff(startConverted, "minutes");

				tRemainder = diffTime % snapshot.val().frequency;

		    tilTrain = snapshot.val().frequency - tRemainder;

		    nextTrain = moment().add(tilTrain, "minutes");
		   
		    $('#trainData > tbody').append("<tr data-id=" + snapshot.key() + "><td>" + snapshot.val().trainName + "</td><td>" + snapshot.val().destination + "</td><td>" + snapshot.val().frequency + "</td><td>" + nextTrain.format("HH:mm") + "</td><td>" + tilTrain + "</td></tr>");
			})
		}
		
	};

	update();
  setInterval(update, 1000);

	// Capture Button Click
  $("#submitTrain").on("click", function() {

    trainName = $('#trainName').val().trim();
    destination = $('#destination').val().trim();
    start = $('#start').val().trim();
    frequency = $('#frequency').val().trim();

    dataRef.push({
        'trainName': trainName,
        'destination': destination,
        'start': start,
        'frequency': frequency,
    });

    //reset text field to placeholder
		$("#trainName , #destination , #start , #frequency").val('');

    // Don't refresh the page!
    return false;
  });

  // Capture Button Click
  $(".signBtn").on("click", function() {

  	$("#signUp").toggleClass('hide show');

  });

  // Capture Button Click
  $(".loginBtn").on("click", function() {

  	$("#login").toggleClass('hide show');

  });

  // Capture Button Click
  $(document).on('click', '.remove', function(){

  	keyId = $(this).attr('data-id');
  	console.log(keyId);
  	dataRef.child(keyId).remove();

  });

  // Capture Button Click
  $("#signSubmit").on("click", function() {

  	var signEmail = $('#signEmail').val().trim();
  	var signPass = $('#signPass').val().trim();

	  dataRef.createUser({
	  email    : signEmail,
	  password : signPass
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			  }
			});
	  // Don't refresh the page!
    return false;
  });

  // Capture Button Click
  $("#loginSubmit").on("click", function() {

  	var loginEmail = $('#loginEmail').val().trim();
  	var loginPass = $('#loginPass').val().trim();

	  dataRef.authWithPassword({
	  email    : loginEmail,
	  password : loginPass
			}, function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
			    remember: "sessionOnly"
			    loggedIn = true;
			    console.log(loggedIn);
			    $("#signUp, #login").addClass('hide');
			  }
		});
	  // Don't refresh the page!
    return false;
  });

});