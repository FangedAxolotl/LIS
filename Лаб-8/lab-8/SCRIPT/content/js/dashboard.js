/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9823529411764705, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.95, 500, 1500, "/monolog_v_aptechnoi_lavke/vol1/1-22"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-29"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-4"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-1"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-8"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-20"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-21"], "isController": false}, {"data": [1.0, 500, 1500, "/monolog_v_aptechnoi_lavke-15"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-24"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-26"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-27"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-28"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-2"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-3"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-6"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-5"], "isController": false}, {"data": [1.0, 500, 1500, "/internal/elementList/2134-11"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-32"], "isController": false}, {"data": [0.475, 500, 1500, "/-7"], "isController": false}, {"data": [0.975, 500, 1500, "/internal/elementList/2136-13"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-16"], "isController": false}, {"data": [1.0, 500, 1500, "/internal/elementList/2118-14"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-19"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-30"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-31"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-10"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-33"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-34"], "isController": false}, {"data": [1.0, 500, 1500, "/internal/elementList/2122-12"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-9"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-17"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-18"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-23"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-25"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 680, 0, 0.0, 104.14264705882346, 44, 2349, 50.0, 143.0, 233.64999999999952, 1958.5299999999947, 64.8854961832061, 454.75011927480915, 22.837398616412212], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/monolog_v_aptechnoi_lavke/vol1/1-22", 20, 0, 0.0, 260.2, 160, 583, 236.5, 492.8000000000003, 579.1999999999999, 583.0, 3.1700744967506735, 301.2210049631479, 1.74911336978919], "isController": false}, {"data": ["/canonical.html-29", 20, 0, 0.0, 49.45, 45, 60, 47.5, 58.500000000000014, 59.95, 60.0, 3.2701111837802483, 0.951653449967299, 1.0346836167429694], "isController": false}, {"data": ["/canonical.html-4", 20, 0, 0.0, 49.65, 45, 60, 48.5, 57.60000000000001, 59.9, 60.0, 3.3450409767519655, 0.9734591905000836, 1.0583918715504266], "isController": false}, {"data": ["/canonical.html-1", 20, 0, 0.0, 99.44999999999999, 45, 207, 75.5, 206.70000000000002, 207.0, 207.0, 3.2451728054518902, 0.9443959922115852, 1.0267929579750121], "isController": false}, {"data": ["/canonical.html-8", 20, 0, 0.0, 52.65, 45, 65, 53.0, 63.900000000000006, 64.95, 65.0, 4.460303300624442, 1.298017952720785, 1.4112678412132025], "isController": false}, {"data": ["/success.txt-20", 20, 0, 0.0, 49.65, 45, 59, 48.0, 58.500000000000014, 59.0, 59.0, 3.462004500605851, 0.7302665743465466, 1.1021615890600658], "isController": false}, {"data": ["/success.txt-21", 20, 0, 0.0, 49.49999999999999, 46, 59, 47.5, 58.500000000000014, 59.0, 59.0, 3.4626038781163433, 0.7303930055401663, 1.1023524065096952], "isController": false}, {"data": ["/monolog_v_aptechnoi_lavke-15", 20, 0, 0.0, 173.79999999999998, 114, 441, 134.5, 416.7000000000004, 440.65, 441.0, 3.4170510849137194, 134.6601769391765, 1.8686998120621905], "isController": false}, {"data": ["/success.txt-24", 20, 0, 0.0, 50.25, 45, 59, 48.5, 58.900000000000006, 59.0, 59.0, 3.2610467960215233, 0.68787705853579, 1.0381848198271646], "isController": false}, {"data": ["/success.txt-26", 20, 0, 0.0, 49.449999999999996, 45, 60, 48.0, 58.60000000000001, 59.95, 60.0, 3.2674399607907203, 0.6892256167292925, 1.0402201437673582], "isController": false}, {"data": ["/success.txt-27", 20, 0, 0.0, 49.6, 45, 60, 48.5, 58.500000000000014, 59.95, 60.0, 3.2679738562091503, 0.6893382352941176, 1.040390114379085], "isController": false}, {"data": ["/success.txt-28", 20, 0, 0.0, 49.4, 45, 60, 47.5, 58.500000000000014, 59.95, 60.0, 3.2695765898316167, 0.6896763119176067, 1.040900359653425], "isController": false}, {"data": ["/success.txt-2", 20, 0, 0.0, 53.1, 45, 73, 49.5, 66.4, 72.69999999999999, 73.0, 3.33889816360601, 0.7042988313856428, 1.062969532554257], "isController": false}, {"data": ["/success.txt-3", 20, 0, 0.0, 53.849999999999994, 45, 70, 51.5, 69.0, 69.95, 70.0, 3.333888981496916, 0.7032422070345058, 1.0613748124687448], "isController": false}, {"data": ["/success.txt-6", 20, 0, 0.0, 50.05, 45, 65, 48.0, 58.60000000000001, 64.69999999999999, 65.0, 3.3450409767519655, 0.7055945810336176, 1.064925154708145], "isController": false}, {"data": ["/success.txt-5", 20, 0, 0.0, 50.150000000000006, 46, 60, 48.0, 58.800000000000004, 59.95, 60.0, 3.343922420999833, 0.7053586356796523, 1.0645690519979936], "isController": false}, {"data": ["/internal/elementList/2134-11", 20, 0, 0.0, 150.05000000000004, 109, 321, 126.0, 300.1000000000003, 320.65, 321.0, 4.225649693640397, 40.45192993344602, 1.8776080181702939], "isController": false}, {"data": ["/canonical.html-32", 20, 0, 0.0, 49.35, 45, 59, 47.0, 58.60000000000001, 59.0, 59.0, 3.272786777941417, 0.9524320896743578, 1.0355301914580266], "isController": false}, {"data": ["/-7", 20, 0, 0.0, 1084.5000000000002, 118, 2349, 1062.0, 2057.7, 2334.45, 2349.0, 3.080714725816389, 175.15698407655577, 1.5794679990757856], "isController": false}, {"data": ["/internal/elementList/2136-13", 20, 0, 0.0, 154.6, 111, 515, 119.0, 302.4000000000003, 505.09999999999985, 515.0, 3.7544584193730057, 38.16934954007884, 1.6682408015768726], "isController": false}, {"data": ["/canonical.html-16", 20, 0, 0.0, 50.599999999999994, 45, 73, 48.0, 59.900000000000006, 72.35, 73.0, 3.461405330564209, 1.007323035652475, 1.095210280373832], "isController": false}, {"data": ["/internal/elementList/2118-14", 20, 0, 0.0, 153.25, 111, 318, 131.5, 307.1000000000002, 317.9, 318.0, 3.6172906493036714, 38.91625406945198, 1.6072922318683307], "isController": false}, {"data": ["/canonical.html-19", 20, 0, 0.0, 50.24999999999999, 45, 61, 48.5, 58.500000000000014, 60.9, 61.0, 3.4644032565390614, 1.0081954789537502, 1.0961588428893123], "isController": false}, {"data": ["/success.txt-30", 20, 0, 0.0, 49.75, 44, 60, 48.0, 58.7, 59.95, 60.0, 3.270645952575634, 0.6899018806214227, 1.0412408013082584], "isController": false}, {"data": ["/success.txt-31", 20, 0, 0.0, 49.349999999999994, 45, 61, 48.0, 58.500000000000014, 60.9, 61.0, 3.271716015049894, 0.6901275969245869, 1.0415814657287747], "isController": false}, {"data": ["/success.txt-10", 20, 0, 0.0, 51.5, 45, 82, 49.0, 59.900000000000006, 80.89999999999998, 82.0, 4.477277815088426, 0.944425789120215, 1.425383366912917], "isController": false}, {"data": ["/success.txt-33", 20, 0, 0.0, 49.949999999999996, 45, 70, 47.5, 58.900000000000006, 69.44999999999999, 70.0, 3.273322422258593, 0.6904664484451718, 1.0420928805237315], "isController": false}, {"data": ["/success.txt-34", 20, 0, 0.0, 50.8, 45, 87, 47.5, 59.0, 85.59999999999998, 87.0, 3.2738582419381244, 0.690579472908823, 1.04226346374202], "isController": false}, {"data": ["/internal/elementList/2122-12", 20, 0, 0.0, 149.09999999999997, 111, 322, 122.5, 306.7000000000003, 321.9, 322.0, 4.057618178129438, 40.94489405812538, 1.8029455771961858], "isController": false}, {"data": ["/success.txt-9", 20, 0, 0.0, 52.8, 45, 72, 52.5, 60.800000000000004, 71.44999999999999, 72.0, 4.477277815088426, 0.944425789120215, 1.425383366912917], "isController": false}, {"data": ["/success.txt-17", 20, 0, 0.0, 52.35, 45, 112, 48.0, 59.900000000000006, 109.39999999999996, 112.0, 3.463203463203463, 0.7305194805194805, 1.1025432900432899], "isController": false}, {"data": ["/success.txt-18", 20, 0, 0.0, 49.6, 45, 60, 48.0, 58.60000000000001, 59.95, 60.0, 3.4644032565390614, 0.7307725619262082, 1.1029252554997402], "isController": false}, {"data": ["/canonical.html-23", 20, 0, 0.0, 53.25, 46, 112, 49.0, 59.0, 109.34999999999997, 112.0, 3.226847370119393, 0.9390630041949015, 1.0209946757018393], "isController": false}, {"data": ["/canonical.html-25", 20, 0, 0.0, 49.6, 45, 59, 48.0, 58.500000000000014, 59.0, 59.0, 3.2663726931242856, 0.9505654907724971, 1.0335007349338559], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 680, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
