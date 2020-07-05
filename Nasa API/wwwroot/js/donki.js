var dialog = {};

$('#submit').on('click', function () {
    $("#cmeEventsGrid").hide();

    if (dialog.isVisible == true) {
        $("#target").hide();
        var dialogObj = document.getElementById('dialog').ej2_instances[0];
        dialogObj.hide();

        dialog.isVisible == false;
    }

    var endDate = $('#eventDate').val();
    var eventName = dropdownEventNameToUrl($('#events').val());

    if (eventName == "" || endDate == "") {
        $("#target").show();
        var dialogObj = document.getElementById('dialog').ej2_instances[0];
        dialogObj.show();
    }
    else {
        $("#progressBar").show();

        var startDate = new Date($('#eventDate').val());
        startDate.setDate(startDate.getDate() - 30);
        startDate = startDate.toISOString().substring(0, 10);

        $.ajax({
            type: "GET",
            url: "https://api.nasa.gov/DONKI/" + eventName + "?startDate=" + startDate + "&endDate=" + endDate + "&api_key=qkWghemh2AKBBDaAIw9XEx8IMVPoSrB5p9V7McSN",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    let eventObjects = jsonResponseToDataGridList(response, eventName);
                    var grid = document.getElementById("cmeEventsGrid").ej2_instances[0];
                    grid.dataSource = eventObjects;

                    $("#cmeEventsGrid").show();
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



function jsonResponseToDataGridList(ajaxResponse, eventName) {
    let eventObjects = null;

    switch (eventName) {
        case "CME":
            eventObjects = cmeEventsAjaxObjectsToDataGridModels(ajaxResponse);
            break;
        default:
    }

    return eventObjects;
}

function cmeEventsAjaxObjectsToDataGridModels(ajaxResponse) {
    let cmeObjects = [];

    try {
        ajaxResponse.forEach(function (entry) {
            let cmeObject = {
                ActivityID: entry.activityID, Catalog: entry.catalog, StartTime: entry.startTime,
                SourceLocation: entry.sourceLocation, Url: entry.link, Note: entry.note, Latitude: entry.cmeAnalyses[0].latitude,
                Longitude: entry.cmeAnalyses[0].longitude, Speed: entry.cmeAnalyses[0].speed, Type: entry.cmeAnalyses[0].type
            }
            cmeObjects.push(cmeObject);
        });
    } catch (e) {

    }

    return cmeObjects;
}

function toolbarClick(args) {
    var gridObj = document.getElementById("cmeEventsGrid").ej2_instances[0];
    if (args.item.id === 'cmeEventsGrid_excelexport') {
        gridObj.showSpinner();
        gridObj.excelExport();
    }
    else {
        if (args.item.id === 'cmeEventsGrid_pdfexport') {
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

function dropdownEventNameToUrl(eventName) {
    let apiCallEventName = "";
    switch (eventName) {
        case "Coronal Mass Ejection (CME)":
            apiCallEventName = "CME";
            break;
        case "Geomagnetic Storm (GST)":
            apiCallEventName = "GST";
            break;
        case "Interplanetary Shock (IPS)":
            apiCallEventName = "IPS";
            break;
        case "Solar Flare (FLR)":
            apiCallEventName = "FLR";
            break;
        case "Solar Energetic Particle (SEP)":
            apiCallEventName = "SEP";
            break;
        case "Magnetopause Crossing (MPC)":
            apiCallEventName = "MPC";
            break;
        case "Radiation Belt Enhancement (RBE)":
            apiCallEventName = "RBE";
        case "Hight Speed Stream (HSS)":
            apiCallEventName = "HSS";
            break;
        case "WSA+EnlilSimulation":
            apiCallEventName = "WSAEnlilSimulations";
            break;
        case "Notifications":
            apiCallEventName = "notifications";
            break;
        default:
            break;
    }
    return apiCallEventName;
}

$('document').ready(function () {
    dialog.isVisible = false;
    $("#cmeEventsGrid").hide();
    $("#progressBar").hide();
    $("#target").hide();
});
