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
    $('#foodReviewForm').hide();
    var foodItemId;
    $("#foodFetch").on('click', function(){
        $.ajax({
            url: '/reviewer', // url where to submit the request
            type : "GET", // type of action POST || GET
            dataType : 'json', // data type expected from server
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', st);
            },
            success : function(response, status, xhr) {
                                        console.log(response);
                                        if(response ==null)
                                        {
                                            console.log("null response");
                                        }
                                        else if(!Object.keys(response).length){
                                            console.log("Currently no food item is available for review");
                                            
                                        }
                                        else{
                                            console.log(response);
                                            $('#foodReviewForm').hide();
                                            document.getElementById("foodReserveInput").value=response.name;
                                            foodItemId=response._id;
                                        }
                                    },
            error: function(xhr, resp, text) {
                console.log(xhr, resp, text);
                }
        });
    });

    $("#foodReservation").on('click', function(){
        $.ajax({
            url: '/reviewer/'+foodItemId, // url where to submit the request
            type : "GET", // type of action POST || GET
            dataType : 'json', // data type expected from server
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', st);
            },
            success : function(response, status, xhr) {
                                        console.log(response);
                                        //$('#foodReviewForm').css({"display":"true"});
                                        $('#foodReviewForm').show();
                                        $("#foodFetch").attr("disabled", true);
                                        document.getElementById("foodname").value=response.name;
                                        $("#foodReservation").attr("disabled", true);
                                    },
            error: function(xhr, resp, text) {
                console.log(xhr, resp, text);
                }
        });
    });

    $("#foodReviewForm button").click(function (ev) {
        ev.preventDefault();
        if ($(this).attr("value") == "Approve") {            
          console.log("First Button is pressed - Food will approve");
          $.ajax({
            url: '/reviewer/'+foodItemId, // url where to submit the request
            type : "PUT", // type of action POST || GET
            dataType : 'json', // data type expected from server
            data : $("#foodReviewForm").serializeObject(), // post data to server
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
          console.log("Reject button is pressed - food will reject");
          $.ajax({
            url: '/reviewer/'+foodItemId+'/reject', // url where to submit the request
            type : "PUT", // type of action POST || GET
            dataType : 'json', // data type expected from server
            data : $("#foodReviewForm").serializeObject(), // post data to server
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

});