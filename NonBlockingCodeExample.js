
+ Blocking Code Example
-----------------------
Create a text file named input.txt with the following content −

Tutorials Point is giving self learning content
to teach the world in simple and easy way!!!!!
Create a js file named main.js with the following code −

------------------------------- Code Snippet
var fs = require("fs");

var data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log("Program Ended");
---------------------------------------------
Now run the main.js to see the result −

$ node main.js
-- Verify the Output.

Tutorials Point is giving self learning content
to teach the world in simple and easy way!!!!!
Program Ended

--------------------------------------------------
+ Non-Blocking Code Example
---------------------------
Create a text file named input.txt with the following content.

Tutorials Point is giving self learning content
to teach the world in simple and easy way!!!!!
Update main.js to have the following code −

------------------------ Code Snippet
var fs = require("fs");

fs.readFile('input.txt', function (err, data) {
   if (err) return console.error(err);
   console.log(data.toString());
});

console.log("Program Ended");
---------------------------------------
Now run the main.js to see the result −

$ node main.js
Verify the Output.
------------------
Program Ended
Tutorials Point is giving self learning content
to teach the world in simple and easy way!!!!!

