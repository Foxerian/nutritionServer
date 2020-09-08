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
    $("#loginsubmit").on('click', function(){
    //var formData = $("#loginform").serializeObject();
    //console.log(formData);
    $.ajax({
            url: '/users/login', // url where to submit the request
            type : "POST", // type of action POST || GET
            dataType : 'json', // data type
            data : $("#loginform").serializeObject(), // post data || get data
            success : function(result) {
                                        console.log(result);
                                        window.localStorage.setItem("nutritionServerToken", result.token);
                                        if(result.admin)
                                                window.location.replace("/home.html");
                                        else if(result.reviewer)
                                                window.location.replace("/homer.html");
                                        else
                                                //window.open("/myname.html","_self");
                                                window.location.replace("/homes.html");
                                                //console.log(window.localStorage.getItem("nutritionServerToken"));
                                    },
            error: function(xhr, resp, text) {
                console.log(xhr, resp, text);
                }
        });

});
})