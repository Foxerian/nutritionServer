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
$(document).ready(function(){
    const token = localStorage.getItem('nutritionServerToken');
    var st = 'Bearer ' + token;
    var foodItemId;
    $.ajax({
        url: '/seeder', // url where to submit the request
        type : "GET", // type of action POST || GET
        dataType : 'json', // data type expected from server
        //data : $("#foodAddForm").serializeObject(), // post data to server
        //headers: {"Authorization": localStorage.getItem('token')},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', st);
        },
        success : function(response, status, xhr) {
                                    console.log(response);
                                    //console.log(status);
                                    if(!Object.keys(response).length){
                                        document.getElementById("foodUpdateForm").style.display="none";
                                        console.log("no data found");
                                    }
                                    else{
                                        document.getElementById("foodUpdateForm").style.display="true";
                                        $("#foodAddSubmit").attr("disabled", true);
                                        document.getElementById("foodname").value=response[0].name;
                                        foodItemId=response[0]._id;
                                    }
                                },
        error: function(xhr, resp, text) {
            console.log(xhr, resp, text);
            }
    });

    $("#foodUpdateForm button").click(function (ev) {
        ev.preventDefault();
        if ($(this).attr("value") == "Submit") {            
          console.log("First Button is pressed - Form will submit");
          $.ajax({
            url: '/seeder/'+foodItemId, // url where to submit the request
            type : "PUT", // type of action POST || GET
            dataType : 'json', // data type expected from server
            data : $("#foodUpdateForm").serializeObject(), // post data to server
            //headers: {"Authorization": localStorage.getItem('token')},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', st);
            },
            success : function(response, status, xhr) {
                                        console.log(response);
                                        console.log(status);
                                    },
            error: function(xhr, resp, text) {
                console.log(xhr, resp, text);
                }
        });
        }
        if ($(this).attr("value") == "Reject") {
          console.log("Reject button is pressed - Form did not submit");
          $.ajax({
            url: '/seeder/'+foodItemId, // url where to submit the request
            type : "DELETE", // type of action POST || GET
            dataType : 'json', // data type expected from server
            data : $("#foodUpdateForm").serializeObject(), // post data to server
            //headers: {"Authorization": localStorage.getItem('token')},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', st);
            },
            success : function(response, status, xhr) {
                                        console.log(response);
                                        console.log(status); 
                                    },
            error: function(xhr, resp, text) {
                console.log(xhr, resp, text);
                }
        });
        }
        window.location.reload(true);
      });


    $("#foodAddSubmit").on('click', function(){
    var formData = $("#foodAddForm").serializeObject();
    console.log(formData);
    //const token = new String(window.localStorage.getItem('nutritionServerToken'));
    const token = localStorage.getItem('nutritionServerToken');
    var st = 'Bearer ' + token;
    //console.log(token);
    //console.log(st);
    $.ajax({
            url: '/seeder', // url where to submit the request
            type : "POST", // type of action POST || GET
            dataType : 'json', // data type expected from server
            data : $("#foodAddForm").serializeObject(), // post data to server
            //headers: {"Authorization": localStorage.getItem('token')},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', st);
            },
            success : function(response, status, xhr) {
                                        console.log(response);
                                        console.log(status);
                                        if(response.failed)
                                        {
                                            $('#foodalert').text("Food already present mate, try another!!");
                                            $('#foodalert').css({"display":"true","color":"red"});
                                            console.log("data already present");
                                        }
                                        else{
                                            window.location.reload(true);
                                        }
                                    },
            error: function(xhr, resp, text) {
                console.log(xhr, resp, text);
                }
        });

});
})