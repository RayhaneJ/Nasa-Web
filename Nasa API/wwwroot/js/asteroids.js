var dialog = {};

$('#submit').on('click', function () {
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
    console.log(ajaxResponse.near_earth_objects);
    let asteroidsObjects = [];

    try {
        for (const [key, value] of Object.entries(ajaxResponse.near_earth_objects)) {
            console.log(`${key}: ${value}`);
        }
        //ajaxResponse.near_earth_objects.forEach(function (entry) {
        //    console.log(entry);
            //entry.forEach(function (asteroid) {
            //    console.log(asteroid.id);
                //let asteroidsObjects = {
                //    ActivityID: entry.activityID, Catalog: entry.catalog, StartTime: entry.startTime,
                //    SourceLocation: entry.sourceLocation, Url: entry.link, Note: entry.note, Latitude: entry.cmeAnalyses[0].latitude,
                //    Longitude: entry.cmeAnalyses[0].longitude, Speed: entry.cmeAnalyses[0].speed, Type: entry.cmeAnalyses[0].type
                //}
                //cmeObjects.push(cmeObject);
            //});
        //});
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
