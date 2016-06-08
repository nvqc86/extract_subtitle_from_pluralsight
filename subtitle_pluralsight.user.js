// ==UserScript==
	// @name        Extract subtitle (SRT format) from pluralsight.com
	// @namespace   http://www.nvqcsolution.com
	// @description Extract subtitle (SRT format) from pluralsight.com
	// @include     http://*pluralsight.com*
    // @include     https://*pluralsight.com*
    // @grant       window.close
    // @grant       window.focus
    // @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// ==/UserScript==

function srtTimeFormat(totalSeconds) { //12.345
	var returnString = "";
	mm = Math.floor(totalSeconds / 60).toString();
	mm = (mm.length <= 1) ? ("0" + mm) : mm;

	ss = Math.floor(totalSeconds - (mm * 60)).toString();
	ss = (ss.length <= 1) ? ("0" + ss) : ss;

	ms = totalSeconds.substring(totalSeconds.lastIndexOf(".") + 1, totalSeconds.length);
	returnString = "00:" + mm + ":" + ss + "," + ms;
	return returnString;
}

$(document).ready(function(){
    setTimeout(function(){
        $("h3 a").after('<input type="button" class="download-subtitle" value="Create Download Link" />');
        $(".download-subtitle").on("click", function(){
		var parent = $(this).parent().parent();
		var subtitleLines = parent.find("p span a");

		var finalResult = "";

		var beginTimeArray = [];
		var endTimeArray = [];
		var subtitleTextArray = [];

		for (i = 0; i < subtitleLines.length; i++) {
			var time = $(subtitleLines[i]).attr("href");
			time = time.substring(time.lastIndexOf("=") + 1, time.length);
			beginTimeArray.push(srtTimeFormat(time));
			if (i > 0) {
				endTimeArray.push(srtTimeFormat(time));
			}
			subtitleTextArray.push(subtitleLines[i].innerHTML);
		}
		endTimeArray.push("00:59:59,999");

		for (i = 0; i < subtitleLines.length; i++) {
			finalResult += i + 1 + "\r\n";
			finalResult += beginTimeArray[i] + " --> " + endTimeArray[i] + "\r\n";
			finalResult += subtitleTextArray[i] + "\r\n\r\n";
		}
		//console.log(finalResult);

		uriContent = "data:application/octet-stream," + encodeURIComponent(finalResult);
		var fileName = $(this).parent().find("a").text() + ".srt";
		$(this).parent().append('<a href="' + uriContent + '" download="' + fileName + '">Download</a>');

	});
    }, 5000); //wait 5 seconds to appear the "Download button"; depend on your internet speed, adjust 5000 (5000 = 5 seconds) for your needs
});