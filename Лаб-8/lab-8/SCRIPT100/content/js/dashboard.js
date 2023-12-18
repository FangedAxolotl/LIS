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

    var data = {"OkPercent": 87.25490196078431, "KoPercent": 12.745098039215685};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8613725490196078, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "/monolog_v_aptechnoi_lavke/vol1/1-22"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-29"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-4"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-1"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-8"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-20"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-21"], "isController": false}, {"data": [0.98, 500, 1500, "/monolog_v_aptechnoi_lavke-15"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-24"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-26"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-27"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-28"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-2"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-3"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-6"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-5"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "/internal/elementList/2134-11"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-32"], "isController": false}, {"data": [0.6466666666666666, 500, 1500, "/-7"], "isController": false}, {"data": [0.13666666666666666, 500, 1500, "/internal/elementList/2136-13"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-16"], "isController": false}, {"data": [0.10833333333333334, 500, 1500, "/internal/elementList/2118-14"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-19"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-30"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-31"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-10"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-33"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-34"], "isController": false}, {"data": [0.18166666666666667, 500, 1500, "/internal/elementList/2122-12"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-9"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-17"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-18"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-23"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-25"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10200, 1300, 12.745098039215685, 118.29166666666681, 41, 5155, 59.0, 159.0, 206.0, 1306.9599999999991, 403.5288997903232, 1330.1356903014598, 142.0278934406773], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/monolog_v_aptechnoi_lavke/vol1/1-22", 300, 300, 100.0, 149.18666666666667, 96, 699, 114.0, 236.80000000000007, 306.69999999999993, 635.930000000001, 15.107261557055091, 9.200774719256723, 8.33554958958606], "isController": false}, {"data": ["/canonical.html-29", 300, 0, 0.0, 63.14666666666666, 41, 207, 53.0, 99.1000000000003, 131.89999999999998, 193.94000000000005, 15.212210334161552, 4.4269908980274835, 4.813238426043304], "isController": false}, {"data": ["/canonical.html-4", 300, 0, 0.0, 66.19333333333336, 42, 207, 58.0, 92.0, 112.74999999999994, 200.97000000000003, 16.776646907504755, 4.882266385191812, 5.308235935577676], "isController": false}, {"data": ["/canonical.html-1", 300, 0, 0.0, 109.18999999999997, 42, 247, 85.5, 211.90000000000003, 222.0, 238.99, 16.605778811026237, 4.832541099302557, 5.254172201926271], "isController": false}, {"data": ["/canonical.html-8", 300, 0, 0.0, 94.83666666666663, 41, 411, 55.0, 267.7000000000001, 343.95, 371.98, 18.277080541001585, 5.318916016814914, 5.782982514926282], "isController": false}, {"data": ["/success.txt-20", 300, 0, 0.0, 58.153333333333336, 41, 150, 52.0, 81.50000000000017, 115.79999999999995, 145.97000000000003, 15.568240788790867, 3.2839257913855735, 4.956295407368968], "isController": false}, {"data": ["/success.txt-21", 300, 0, 0.0, 62.963333333333274, 41, 204, 53.0, 101.80000000000007, 130.74999999999994, 202.98000000000002, 15.565817464847196, 3.283414621491205, 4.955523919472838], "isController": false}, {"data": ["/monolog_v_aptechnoi_lavke-15", 300, 0, 0.0, 199.73999999999995, 111, 1400, 145.0, 297.50000000000017, 466.29999999999984, 1252.640000000003, 15.479876160990711, 610.4050769156347, 8.465557275541796], "isController": false}, {"data": ["/success.txt-24", 300, 0, 0.0, 63.89333333333332, 41, 209, 53.0, 101.80000000000007, 139.95, 202.0, 15.143102316894655, 3.1942481449699662, 4.820948589167634], "isController": false}, {"data": ["/success.txt-26", 300, 0, 0.0, 67.68333333333328, 42, 205, 54.0, 121.90000000000003, 149.84999999999997, 198.99, 15.135462388375966, 3.192636597548055, 4.818516346299379], "isController": false}, {"data": ["/success.txt-27", 300, 0, 0.0, 62.526666666666664, 42, 211, 53.0, 99.4000000000002, 116.94999999999999, 200.99, 15.217611849447094, 3.2099649994927466, 4.844669397382571], "isController": false}, {"data": ["/success.txt-28", 300, 0, 0.0, 70.1766666666667, 42, 207, 54.0, 124.90000000000003, 172.5499999999999, 203.96000000000004, 15.216068167985393, 3.2096393791844187, 4.844177951917224], "isController": false}, {"data": ["/success.txt-2", 300, 0, 0.0, 71.25999999999999, 41, 210, 61.5, 102.90000000000003, 163.39999999999986, 200.99, 16.768207478620536, 3.5370437650215196, 5.33831605276396], "isController": false}, {"data": ["/success.txt-3", 300, 0, 0.0, 72.70000000000007, 41, 201, 60.0, 125.60000000000014, 155.0, 198.92000000000007, 16.77101967799642, 3.53763696332737, 5.339211342799642], "isController": false}, {"data": ["/success.txt-6", 300, 0, 0.0, 69.98999999999992, 42, 204, 59.0, 114.7000000000001, 132.95, 184.97000000000003, 16.76727028839705, 3.536846076458753, 5.3380176894701545], "isController": false}, {"data": ["/success.txt-5", 300, 0, 0.0, 67.43999999999997, 42, 206, 56.0, 106.0, 130.44999999999987, 200.0, 16.764459346186086, 3.5362531433361273, 5.337122799664711], "isController": false}, {"data": ["/internal/elementList/2134-11", 300, 230, 76.66666666666667, 156.93333333333337, 96, 643, 121.0, 255.4000000000002, 345.5999999999999, 635.4100000000014, 17.89762558167283, 48.18586124865768, 7.95255824185658], "isController": false}, {"data": ["/canonical.html-32", 300, 0, 0.0, 66.97, 41, 206, 53.0, 126.90000000000003, 154.0, 202.0, 15.210667748314151, 4.426541981442986, 4.812750342240024], "isController": false}, {"data": ["/-7", 300, 0, 0.0, 1249.6933333333345, 118, 5155, 244.5, 3603.0000000000005, 3859.8999999999996, 4322.260000000002, 15.668250900924427, 891.5609637769625, 8.033038791977857], "isController": false}, {"data": ["/internal/elementList/2136-13", 300, 259, 86.33333333333333, 145.77666666666667, 96, 650, 119.0, 205.80000000000007, 307.69999999999993, 636.0200000000009, 16.855826497359256, 32.284778749719074, 7.489649469041466], "isController": false}, {"data": ["/canonical.html-16", 300, 0, 0.0, 58.93333333333334, 42, 198, 51.0, 81.90000000000003, 120.94999999999999, 176.73000000000025, 15.558552017425578, 4.527781739446116, 4.922823099263562], "isController": false}, {"data": ["/internal/elementList/2118-14", 300, 267, 89.0, 145.15333333333334, 94, 710, 114.5, 199.80000000000007, 308.9, 637.0, 16.453682882685243, 28.43455633329677, 7.3109626090056485], "isController": false}, {"data": ["/canonical.html-19", 300, 0, 0.0, 60.61333333333336, 41, 209, 52.0, 88.20000000000027, 116.0, 189.8900000000001, 15.558552017425578, 4.527781739446116, 4.922823099263562], "isController": false}, {"data": ["/success.txt-30", 300, 0, 0.0, 66.15666666666664, 41, 207, 54.0, 115.90000000000003, 142.79999999999995, 205.94000000000005, 15.209125475285171, 3.2081749049429655, 4.841967680608365], "isController": false}, {"data": ["/success.txt-31", 300, 0, 0.0, 64.81999999999996, 41, 203, 55.0, 101.80000000000007, 130.5499999999999, 195.93000000000006, 15.205271160669032, 3.207361885453624, 4.840740623416117], "isController": false}, {"data": ["/success.txt-10", 300, 0, 0.0, 63.96333333333337, 42, 275, 55.0, 80.90000000000003, 116.94999999999999, 264.9200000000001, 18.51052014561609, 3.9045628432158943, 5.892997624483248], "isController": false}, {"data": ["/success.txt-33", 300, 0, 0.0, 64.27666666666666, 42, 204, 53.0, 109.90000000000003, 123.84999999999997, 195.94000000000005, 15.207583514979468, 3.2078496476909817, 4.841476783089167], "isController": false}, {"data": ["/success.txt-34", 300, 0, 0.0, 64.89333333333332, 41, 199, 54.0, 106.50000000000017, 131.95, 184.99, 15.209896572703306, 3.2083375583046037, 4.842213166700466], "isController": false}, {"data": ["/internal/elementList/2122-12", 300, 244, 81.33333333333333, 157.28, 96, 724, 121.0, 250.7000000000001, 318.84999999999997, 638.98, 17.363120731566156, 41.2787847985878, 7.715058528186133], "isController": false}, {"data": ["/success.txt-9", 300, 0, 0.0, 63.18333333333338, 42, 205, 54.0, 84.0, 121.69999999999993, 198.98000000000002, 18.51508979818552, 3.9055267543047587, 5.8944524162192184], "isController": false}, {"data": ["/success.txt-17", 300, 0, 0.0, 58.16000000000003, 41, 202, 52.0, 71.90000000000003, 84.94999999999999, 198.95000000000005, 15.554518587649712, 3.2810312645823614, 4.951926815990046], "isController": false}, {"data": ["/success.txt-18", 300, 0, 0.0, 58.66333333333331, 41, 206, 51.0, 81.90000000000003, 108.94999999999999, 161.9000000000001, 15.56178026766262, 3.2825630252100844, 4.954238639900405], "isController": false}, {"data": ["/canonical.html-23", 300, 0, 0.0, 64.4566666666667, 42, 205, 54.0, 107.90000000000003, 142.4999999999999, 184.95000000000005, 15.146925174189638, 4.407991896395032, 4.79258179339594], "isController": false}, {"data": ["/canonical.html-25", 300, 0, 0.0, 62.91000000000006, 42, 210, 54.0, 98.90000000000003, 116.94999999999999, 199.99, 15.139281388776746, 4.405767435405733, 4.790163251917643], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 1300, 100.0, 12.745098039215685], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10200, 1300, "429/Too Many Requests", 1300, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/monolog_v_aptechnoi_lavke/vol1/1-22", 300, 300, "429/Too Many Requests", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/internal/elementList/2134-11", 300, 230, "429/Too Many Requests", 230, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/internal/elementList/2136-13", 300, 259, "429/Too Many Requests", 259, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/internal/elementList/2118-14", 300, 267, "429/Too Many Requests", 267, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/internal/elementList/2122-12", 300, 244, "429/Too Many Requests", 244, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
