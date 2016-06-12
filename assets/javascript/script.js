// Firebase link
var dataRef = new Firebase("https://adambay.firebaseio.com/");

// Initial Values
var name = "";
var destination = "";
var start = "";
var frequency = 0;
var startConverted = "";
var diffTime = "";
var tRemainder = "";
var tilTrain = "";
var nextTrain = "";
var now = moment();

//on ready function wrapped around jQuery
$(document).on('ready', function(){

	// Capture Button Click
    $("#submitTrain").on("click", function() {

        name = $('#trainName').val().trim();
        destination = $('#destination').val().trim();
        start = $('#start').val().trim();
        frequency = $('#frequency').val().trim();

        dataRef.push({
            'name': name,
            'destination': destination,
            'start': start,
            'frequency': frequency,
            // 'dateAdded': Firebase.ServerValue.TIMESTAMP
        });

        // Don't refresh the page!
        return false;
    });

    //Firebase watcher + initial loader HINT: .on("value")
    dataRef.on("child_added", function(snapshot) {

        // Log everything that's coming out of snapshot
        console.log(snapshot.val());
        console.log(snapshot.val().name);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().start);
        console.log(snapshot.val().frequency);
        // console.log(snapshot.val().dateAdded);

        // console.log(now.diff(moment(snapshot.val().start), 'hh:mm'));

        startConverted = moment(snapshot.val().start,"hh:mm");
    		console.log(startConverted);

    		diffTime = moment().diff(startConverted, "minutes");
    		console.log("DIFFERENCE IN TIME: " + diffTime);

    		tRemainder = diffTime % snapshot.val().frequency;
		    console.log(tRemainder);

		    tilTrain = snapshot.val().frequency - tRemainder;
		    console.log("MINUTES UNTIL TRAIN: " + tilTrain);

		    nextTrain = moment().add(tilTrain, "minutes");
		    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        $('#trainData > tbody').append("<tr><td>" + snapshot.val().name + "</td><td>" + snapshot.val().destination + "</td><td>" + snapshot.val().frequency + "</td><td>" + nextTrain.format("hh:mm") + "</td><td>" + tilTrain + "</td></tr>");

    // Handle the errors
    }, function(errorObject) {

        console.log("Errors handled: " + errorObject.code);
    });

    // dataRef.orderByChild('dateAdded').limitToLast(1).on('child_added', function(){

    // });

});