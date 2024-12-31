// TODO:
//  -Comments
//  -Github



var level = 1; // Tracks the current level (number of buttons to press)
var colorOrder = []; // The current color order to be flashed
var playerClickedColorOrder; // The list of colors the player has clicked this level


setStartProcedure();


// Start the game when any key is pressed
function setStartProcedure() {
    $(document).on("keypress", function () {
        $(document).off("keypress");
        startNextLevel();
    });
}

// Goes through the procedure for a new level
function startNextLevel() {
    playerClickedColorOrder = [];
    setLevelHeader();
    newLevelAnimation();
    // Wait for animation to be finished to add the click listeners
    setTimeout(addButtonClickListeners, (level - 1) * 1000);
}

// Changes the header to reflect the current level
function setLevelHeader() {
    $("h1").text("Level " + level);
}

// Play the button flashing animation
function newLevelAnimation() {
    addColorToOrder();
    setTimeout(function () {
        for (let i = 0; i < level; i++) {
            setTimeout(function () {
                buttonAnimation(i);
            }, i * 1000); // The delay increases to evenly space out the button flashes
        }
    }, 1000);
}

// Temporarily gray out one button
function buttonAnimation(buttonIndex) {
    var color = colorOrder[buttonIndex];
    setButtonBackgroundColor(color, "gray");
    setButtonResetTimeout(color, 500);
}

// Sets the background color of one button to the specified color
function setButtonBackgroundColor(buttonColor, color) {
    $("#" + buttonColor + "Button").css("background-color", color);
}

// Resets a button's background color to its original color
function setButtonResetTimeout(buttonColor, resetTime) {
    setTimeout(function () {
        setButtonBackgroundColor(buttonColor, buttonColor);
    }, resetTime);
}

// Chooses one of the four colors at random and adds it the color order
function addColorToOrder() {
    var randColorNum = Math.ceil(Math.random() * 4);
    var color;
    switch (randColorNum) {
        case 1: // Green
            color = "green";
            break;
        case 2: // Red
            color = "red";
            break;
        case 3: // Yellow
            color = "yellow";
            break;
        case 4: // Blue
            color = "blue";
            break;
        default: // Should never occur
            console.log(randColorNum);
            break;
    }
    colorOrder.push(color);
}

// Adds a button click listener for each of the four buttons
function addButtonClickListeners() {
    setTimeout(function () {
        addButtonClickListener("green");
        addButtonClickListener("red");
        addButtonClickListener("yellow");
        addButtonClickListener("blue");
    }, 1000);
}

// Temporarily blacks out the button to show that it has been pressed, and then
// figures out whether it was the correct button or not
function addButtonClickListener(buttonColor) {
    var button = "#" + buttonColor + "Button"
    $(button).on("click", function () {
        setButtonBackgroundColor(buttonColor, "black");
        setButtonResetTimeout(buttonColor, 200);
        buttonClicked(buttonColor);
    });
}

// Determines whether the player clicked the correct button in the color order
// Determines whether to progress to the next level, continue this level, or restart the game
function buttonClicked(buttonColorClicked) {
    playerClickedColorOrder.push(buttonColorClicked);
    if (playerClickedColorOrder.length === colorOrder.length) { // Level is over
        var anyWrong = false;
        for (var i = 0; i < playerClickedColorOrder.length; i++) {
            if (playerClickedColorOrder[i] !== colorOrder[i]) { // Player made a mistake
                anyWrong = true;
                break;
            }
        }
        if (anyWrong) {
            lose();
        } else {
            win();
        } 
    } else if (playerClickedColorOrder.length < colorOrder.length) { // Level might continue
        for (var i = 0; i < playerClickedColorOrder.length; i++) {
            if (playerClickedColorOrder[i] !== colorOrder[i]) {
                lose();
                break;
            }
        }
    } else {
        console.log("Something went wrong");
    }
}

// Resets the game after the player loses
function lose() {
    removeButtonClickListeners();
    $("h1").text("You Lose. Press Any Key to Play Again.");
    level = 1;
    colorOrder = [];
    setStartProcedure();
}

// Progresses the game to the next level
function win() {
    removeButtonClickListeners();
    level++;
    startNextLevel();
}

// Disables all the button click listeners
function removeButtonClickListeners() {
    $("#greenButton").off("click");
    $("#redButton").off("click");
    $("#yellowButton").off("click");
    $("#blueButton").off("click");
}