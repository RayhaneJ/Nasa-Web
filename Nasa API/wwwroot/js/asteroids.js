var dialog = {};

$('#submit').on('click', function () {
    $("#asteroidsGrid").hide();

    if (dialog.isVisible == true) {
        $("#target").hide();
        var dialogObj = document.getElementById('dialog').ej2_instances[0];
        dialogObj.hide();

        dialog.isVisible == false;
    }

    var endDate = $('#date').val();

    if (endDate == "") {
        $("#target").show();
        var dialogObj = document.getElementById('dialog').ej2_instances[0];
        dialogObj.show();
    }
    else {
        $("#progressBar").show();

        var startDate = new Date($('#date').val());
        startDate.setDate(startDate.getDate() - 6);
        startDate = startDate.toISOString().substring(0, 10);

        $.ajax({
            type: "GET",
            url: "https://api.nasa.gov/neo/rest/v1/feed" + "?start_date=" + startDate + "&end_date=" + endDate + "&api_key=qkWghemh2AKBBDaAIw9XEx8IMVPoSrB5p9V7McSN",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    let eventObjects = jsonResponseToDataGridList(response);
                    var grid = document.getElementById("asteroidsGrid").ej2_instances[0];
                    grid.dataSource = eventObjects;

                    $("#asteroidsGrid").show();
                    $("#progressBar").hide();
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
})

function jsonResponseToDataGridList(ajaxResponse) {
    let asteroidsObjects = [];

    try {
        for (var key in ajaxResponse.near_earth_objects) {
            for (index in ajaxResponse.near_earth_objects[key]) {
                var propValue = ajaxResponse.near_earth_objects[key][index];

                let minDiameter =  parseInt(propValue.estimated_diameter.meters.estimated_diameter_min);
                let maxDiameter =  parseInt(propValue.estimated_diameter.meters.estimated_diameter_max);
                let avgDiameter = (minDiameter + maxDiameter) / 2;

                let name = propValue.name.replace("(", "");
                name = name.replace(")", "");

                let speed = propValue.close_approach_data[0].relative_velocity.kilometers_per_hour.substr(0, propValue.close_approach_data[0].relative_velocity.kilometers_per_hour.indexOf('.')); 
                let missDistance = propValue.close_approach_data[0].miss_distance.kilometers.substr(0, propValue.close_approach_data[0].miss_distance.kilometers.indexOf('.')); 

                 let asteroidObject = {
                     Id: propValue.id, Name: name,
                     Url: propValue.nasa_jpl_url, Magnitude: propValue.absolute_magnitude_h, 
                     Diameter: avgDiameter, Speed: speed,
                     MissDistance: missDistance
                }
                asteroidsObjects.push(asteroidObject);
                }
            }
    } catch (e) {

    }

    return asteroidsObjects;
}

function toolbarClick(args) {
    var gridObj = document.getElementById("asteroidsGrid").ej2_instances[0];
    if (args.item.id === 'asteroidsGrid_excelexport') {
        gridObj.showSpinner();
        gridObj.excelExport();
    }
    else {
        if (args.item.id === 'asteroidsGrid_pdfexport') {
            gridObj.showSpinner();
            gridObj.pdfExport();
        }
    }
}

function pdfExportComplete(args) {
    this.hideSpinner();
}

function excelExportComplete(args) {
    this.hideSpinner();
}

$('document').ready(function () {
    dialog.isVisible = false;

    $("#asteroidsGrid").hide();
    $("#progressBar").hide();
    $("#target").hide();
});

