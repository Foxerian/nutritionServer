$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var displayFood = function(x) {
console.log("from fucntion");
console.log(x);
var a = document.createElement("article");
var h = document.createElement("h3");
var b = document.createElement("BUTTON");
var p = document.createElement("p");
p.innerHTML=x.description;
b.id = "fooditem_"+x.name;
b.type = "button";
b.innerHTML="add"

h.innerHTML = x.name;
a.appendChild(h);
a.appendChild(p);
a.appendChild(b);
document.getElementById("foodlist").appendChild(a);
};

$(document).ready(function(){
    const token = localStorage.getItem('nutritionServerToken');
    var Fooditems;
    var st = 'Bearer ' + token;
    var foodItemId;
    $.ajax({
        url: '/fooditems', // url where to submit the request
        type : "GET", // type of action POST || GET
        dataType : 'json', // data type expected from server
        //data : $("#foodAddForm").serializeObject(), // post data to server
        //headers: {"Authorization": localStorage.getItem('token')},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', st);
        },
        success : function(response, status, xhr) {
                                    console.log(response);
                                    console.log(status);
                                    var x;
                                    Fooditems = Object.keys(response).length;
                                    if(response ==null)
                                        {
                                            console.log("null response");
                                        }
                                    else if(!Object.keys(response).length){
                                        console.log("Currently no food item is available for review");
                                    }
                                    else{
                                        console.log(Object.keys(response).length);
                                        for (x in response){
                                            //console.log(response[x]);
                                            displayFood(response[x]);
                                        }
                                        
                                    }
                                },
        complete: function(){
            $('button[id^=fooditem_]').click(function(e){
                var id=$(this).attr('id').split("_")[1];
                console.log(id);
            });

        },
        error: function(xhr, resp, text) {
            console.log(xhr, resp, text);
            }
    });

    
});