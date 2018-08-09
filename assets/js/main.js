// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed



// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAPUN2aNrPOOd8UZoXYml974WDEfJulHCU",
    authDomain: "train-schedule-5f565.firebaseapp.com",
    databaseURL: "https://train-schedule-5f565.firebaseio.com",
    projectId: "train-schedule-5f565",
    storageBucket: "",
    messagingSenderId: "232587175674"
};

firebase.initializeApp(config);


// 2. Create click event to add new train 

$("#add-train-btn").on("click", function(event){
    event.preventDefault();

     var trainName = $("#train-name-input").val().trim();
     var trainDest= $("#destination-input").val().trim();
     var firstTime = moment($("#first-train-input").val().trim(), "hh:mm A").format("HH:mm");
     var trainFreq = $("#freq-input").val().trim();


    // Create object for holding new train data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        firstTime: firstTime,
        trainFreq: trainFreq
    };


// Push object to firebase
firebase.database().ref().push(newTrain);

// Logs to console
console.log(newTrain.name);
console.log(newTrain.destination);
console.log(newTrain.firstTime);
console.log(newTrain.trainFreq);

alert("New Train Added!");


// Clears textboxes after submission
$("#train-name-input").val("");
$("#destination-input").val("");
$("#first-train-input").val("");
$("#freq-input").val("");


}); 

// 3. Create listener event when new row added to db, and update html

firebase.database().ref().on("child_added", function(snapshot){
    console.log(snapshot.val());

    // Store in local variables
    var trainName = snapshot.val().name;
    var trainDest = snapshot.val().destination;
    var firstTime = snapshot.val().firstTime;
    var trainFreq = snapshot.val().trainFreq;

    // Log out train info
    console.log(trainName);
    console.log(trainDest);
    console.log(firstTime);
    console.log(trainFreq);

//----------------------------------------------------------------
// Math to calculate next arrival time and next train
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("converted time" + firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    console.log(tRemainder);

    // Minute Until Train
    var minAway = trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minAway);

    // Next Train
    var nextTrain = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


//----------------------------------------------------------------

    // Add new rows to train table
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(moment(nextTrain).format("hh:mm A")),
        $("<td>").text(minAway + " min")
      );

      $("#train-table > tbody").append(newRow);

});