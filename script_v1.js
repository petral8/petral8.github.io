//===============================================================================
//
//         FILE: script_v1.0.js
//
//        USAGE: 
//
//  DESCRIPTION: OpenClinica ClinCapture Casebook Downloader
//
//      OPTIONS: ---
// REQUIREMENTS: jquery, occccd.xls
//         BUGS: ---
//        NOTES: Needs row validation rules
//       AUTHOR: ALAN PETRAHEN (alanpetrashen@gmail.com) 
// ORGANIZATION: 
//      VERSION: 1.0
//      CREATED: 09.12.2018
//     REVISION: ---
//===============================================================================
$.noConflict();
jQuery(document).ready(function ($) {
	//---Div id inputs
	var SUBJECT_IDs = "#eSubID";
	var SPLIT = "#eSplit";
	var CASEBOOK_FORMAT = "#eCaFo";
	var OPTIONS = "#eOpt";
	var INPUT_START_URL = "#eUrlSt";
	var INPUT_END_URL = "#eUrlEd";
	var ADDITIONAL_OPTIONS = "#eCheck";
	var PAUSE_TIME = "#ePause";
	//---Start program
	$("#down").click(function () { //click buttun
		var subIdLink = $(SUBJECT_IDs).parent().parent().find("input"); //get input link
		var splitLink = $(SPLIT).parent().parent().find("input");
		var subIdVal = subIdLink.val();
		var arrSubIdVal = subIdVal.split(splitLink.val()); //get input values in array 
		var casebookFlag; //Casebook format flag
		var optionsFlag; //Options flag
		var urlMode; //Casebook url mode
		var urlEnd = ""; //Options url mode
		//Know Casebook format
		var casebookFormatLink = $(CASEBOOK_FORMAT).parent().parent().find("input");
		for (casebookFlag = 0; casebookFlag < 4; casebookFlag++) {
			if (casebookFormatLink[casebookFlag].checked)
				break
		}
		//Know Options
		var optionsLink = $(OPTIONS).parent().parent().find("input");
		for (optionsFlag = 0; optionsFlag < 2; optionsFlag++) {
			if (optionsLink[optionsFlag].checked) {
				if (optionsFlag == 0)
					urlEnd = "includeDNs=y";
				else if (urlEnd.length > 0)
					urlEnd += "&includeAudits=y";
				else
					urlEnd = "includeAudits=y";
			}
		}
		//make URL with options
		var url = window.location.protocol + '//' + window.location.host;
		switch (casebookFlag) {
			case 0: //Printable HTML
				urlMode = "/ClinCapture/print/clinicaldata/html/print/S_DEFAULTS1/SS_";
				urlEnd = "/*/*?" + urlEnd;
				break
			case 1: //Printable PDF
				urlMode = "/ClinCapture/pages/generateCasebook?studyOid=S_DEFAULTS1&studySubjectOid=SS_";
				urlEnd = "&" + urlEnd;
				break
			case 2: //JSON
				urlMode = "/ClinCapture/print/clinicaldata/json/view/S_DEFAULTS1/SS_";
				urlEnd = "/*/*?" + urlEnd;
				break
			case 3: //CDISC ODM XML
				urlMode = "/ClinCapture/print/clinicaldata/xml/view/S_DEFAULTS1/SS_";
				urlEnd = "/*/*?" + urlEnd;
				break
			case 4: //Input URL
				var tUrl = $(INPUT_START_URL).parent().parent().find("input");
				url += tUrl.val();
				tUrl = $(INPUT_END_URL).parent().parent().find("input");
				url += tUrl.val();
				urlMode = "";
				urlEnd = "";
				break
			default:
				alert('Please choose Casebook Format')
				return (0);
		}


		// identify the group radio buttons
		url += urlMode;
		//Know Additional Options
		var addOptionsLink = $(ADDITIONAL_OPTIONS).parent().parent().find("input");
		var addOptionsFlag1 = false; //Flag 1 option
		var addOptionsFlag2 = false; //Flag 2 option
		for (var i = 0; i < 2; i++) {
			if (addOptionsLink[i].checked) {
				if (i == 0)
					addOptionsFlag1 = true;
				addOptionsFlag2 = true;
			}
		}
		var pauseTimeLink = $(PAUSE_TIME).parent().parent().find("input");
		var la = arrSubIdVal.length; //for for{
		for (var i = 0; i < la; i++) {
			if (addOptionsFlag2 == true) //Option 1
				arrSubIdVal[i] = arrSubIdVal[i].replace(/[<>\|&\.\\\/\0\W\s//_]/g, "");
			if (arrSubIdVal[i] == "")
				continue;
			var lUrl = url + arrSubIdVal[i] + urlEnd; //Url
			var link = document.createElement('a');
			link.setAttribute('href', lUrl);
			link.setAttribute('download', 'download');
			link.click();
			pausecomp(pauseTimeLink.val() * 1000);//Without pause between interaction "for" possible data error (use 100 or more seconds)
			if (i == 0 && addOptionsFlag1 == true) {
				alert("First link: " + lUrl)
				if (!confirm("Please check link & first Casebook doc. Please put Ok if doc correct or Cancel if not"))
					return (0);
			}
		}
	});

	function pausecomp(millis) {
		var date = new Date();
		var curDate = null;
		do {
			curDate = new Date();
		}
		while (curDate - date < millis);
	}

})
