$(document).ready(function(){
    $('#search').on('input', function(){
       var query = $(this).val();
       $.get('/search', {query: query}, function(data){
          $('#results').empty();
          data.forEach(function(d){
            if (d.value){
               $('#results').append('<label class="container">' + d.name + '<input type="checkbox" id="' + d.name +'" onchange="ajaxRequest(this)" checked><span class="checkmark"></span></label>');
            } else {
               $('#results').append('<label class="container">' + d.name + '<input type="checkbox" id="' + d.name +'" onchange="ajaxRequest(this)"><span class="checkmark"></span></label>');
            }
             
          });
       });
    });
 });

//  <form action="">
//  {% for option in complexity_classes %}
//      <label for="{{ option.name }}" class="container">{{ option.name }}
//          {% if option.value: %}
//              <input type="checkbox" id="{{ option.name }}" name="checkbox" value="{{ option.name }}" onchange="ajaxRequest(this)" checked><span class="checkmark"></span>
//          {% else %}
//              <input type="checkbox" id="{{ option.name }}" name="checkbox" value="{{ option.name }}" onchange="ajaxRequest(this)"><span class="checkmark"></span>
//          {% endif %}
//      </label>
//  {% endfor %}
// </form>
// </html>

function ajaxRequest(inp) {
   console.log(inp);
   var checked = document.getElementById(inp.id).checked;
   console.log("Sending data to the server that the checkbox is", checked);
   if (checked) {
      checked = 1;
   } else {
      checked = 0;
   }


   // Use the XMLHttpRequest API
   const xhttp = new XMLHttpRequest();
   xhttp.onload = function() {
     console.log("Result sent to server!");
   }
   xhttp.open("POST", "/searchresults", true);
   xhttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
   xhttp.send("name=" + inp.id + "&checked=" +checked);
 }