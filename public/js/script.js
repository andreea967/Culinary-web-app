console.log("Script loaded succesfully");
function myFunction() {
    console.log("S-a apelat functia myFunction");
    var checkBox = document.getElementById("checkbox");
    var text = document.getElementById("text");

    if (checkBox.checked == true){
      text.style.color = "red";
    } else {
      text.style.color = "green";
    }
};

$(".check").on('click', function(event) {  
    console.log("S-a apelat functia");
    if ($(this).is(":checked")){
      console.log("Checked");
      $(this).next().css("color", "green");
    } else {
      console.log("Unchecked");

      $(this).next().css("color", "red");
    }
});