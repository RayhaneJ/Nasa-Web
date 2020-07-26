var dialog = {};

$('#submit').on('click', function () {

    if (dialog.isVisible == true) {
        $("#target").hide();
        var dialogObj = document.getElementById('dialog').ej2_instances[0];
        dialogObj.hide();

        dialog.isVisible == false;
    }

    var adress = document.getElementById('adress').value;

    if (adress == "") {
        $("#target").show();
        var dialogObj = document.getElementById('dialog').ej2_instances[0];
        dialogObj.show();
    }

    else {
        $("#progressBar").show();

        $.ajax({
            type: "GET",
            url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + adress + "&key=AIzaSyBBWCMJYfR8QWNXAGGn-TvX2szMIGChfd0",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    var lagitude = response.results[0].geometry.location.lat;
                    var longitude = response.results[0].geometry.location.lng;

                    $.ajax({
                        type: "GET",
                        url: "https://api.nasa.gov/planetary/earth/assets?lon=" + longitude + "&lat=" + lagitude + "&date=2015-01-01&&dim=0.25&api_key=qkWghemh2AKBBDaAIw9XEx8IMVPoSrB5p9V7McSN",
                        dataType: 'json',
                        success: function (data) {
                            if (data != null) {
                                document.getElementById('earthImage').src = data.url;
                                $("#earthImage").show();

                                console.log(data.url);
                            }
                            else {
                                $("#progressBar").hide();
                                $("#target").show();
                                var dialogObj = document.getElementById('dialog').ej2_instances[0];
                                dialogObj.show();
                            }
                        },
                        error: function (error) {
                            $("#progressBar").hide();
                            $("#target").show();
                            var dialogObj = document.getElementById('dialog').ej2_instances[0];
                            dialogObj.show();
                        },
                        failure: function (response) {
                            $("#progressBar").hide();
                            alert(response);
                        }
                    });
                }
                else {
                    $("#progressBar").hide();
                    $("#target").show();
                    var dialogObj = document.getElementById('dialog').ej2_instances[0];
                    dialogObj.show();
                }
            },

        });
    }
})


$('document').ready(function () {
    dialog.isVisible = false;
    $("#progressBar").hide();
    $("#target").hide();
    $("#earthImage").hide();
});
