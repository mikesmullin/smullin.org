var screenWidth;
var screenHeight;
var widthScale;
var heightScale;
var winWidth;
var winHeight;
function bookOpen() {
	screenWidth = screen.width;
	screenHeight = screen.height;
	winWidth = screen.availWidth;
	winHeight = screen.availHeight;
	widthScale = screen.width / 1280;
	//heightScale = screen.height / 1024;
	heightScale = winHeight / 1024;
	theSniffer();
	PageFormat();
}

var BrowserType;
var leftEdge;
var bookWidth;
var spineWidth;

function theSniffer() {
	bookWidth=screenWidth*.95;
	leftEdge=((screenWidth-bookWidth)/2) + "px";
	spineWidth=200*widthScale;
	if (document.getElementById) {
	    divBook = document.getElementById("book");
		divBook.style.left = leftEdge;
		BrowserType="W3C";
		if (!document.all) {
			//self.menubar.visible=false;
			self.toolbar.visible=false;
			self.locationbar.visible=false;
			self.personalbar.visible=false;
			self.scrollbars.visible=false;
			self.statusbar.visible=false ;
		}
	}
}

var maxPages = 57;
function PageFormat() {
    var picLayer, picWidth, picHeight, picLeft, picTop, pageLeft;
    loadBackground();
    sizeImages();
	for(var i=2; i <= maxPages; i++) {
		picLayer = document.getElementById("pic"+i);
		pageLayer = document.getElementById("page"+i);
		captionLayer = document.getElementById("cap"+i);
		picWidth=picLayer.width;		
		picHeight=picLayer.height;
		pageLeft = (spineWidth + (screenWidth * .02));
		pageLayer.style.left=pageLeft + "px";
		pageLayer.style.width = ((bookWidth - pageLeft) - (screenWidth * .03) + "px");
		var newPageFontSize = parseInt(pageLayer.currentStyle.fontSize) * heightScale;
		pageLayer.style.fontSize = Math.ceil(newPageFontSize) + "pt";
		pageLayer.style.lineHeight = 1;
		captionLayer.style.width=picWidth + "px";
		captionLayer.style.top = (picHeight + (screenHeight * .01)) + "px";
		var newFontSize = parseInt(captionLayer.currentStyle.fontSize) * heightScale;
		captionLayer.style.fontSize = newFontSize+"pt";
    }
	sizeFonts();
	//SetFonts(screenHeight);
	var controlLayer = document.getElementById("navigate");
	controlLayer.style.visibility = "visible";
}

function loadBackground() {
    if(widthScale != 1) {
        var theBook = document.getElementById("book");
        switch (screenWidth) {
            case 800: theBook.style.backgroundImage = "url(graphics/bookpage760.gif)";
                break;
            case 1024: theBook.style.backgroundImage = "url(graphics/bookpage976.gif)";
                break;
            case 1152: theBook.style.backgroundImage = "url(graphics/bookpage1094.gif)";
                break;
          //case 1280: This is the default. No need to set it here.
            case 1360: theBook.style.backgroundImage = "url(graphics/bookpage1292.gif)";
                break;
            case 1440: theBook.style.backgroundImage = "url(graphics/bookpage1368.gif)";
                break;
            case 1600: theBook.style.backgroundImage = "url(graphics/bookpage1520.gif)";
                break;
        }
    }
}

function sizeImages() {
    if (heightScale != 1) {
        var imgs = document.getElementsByTagName("img"); //find all images
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            var imgScale = img.width / img.height;
            img.height *= heightScale;
            img.width = img.height * imgScale;
            var btm = parseInt(img.currentStyle.marginBottom) * heightScale;
            img.style.marginBottom = Math.ceil(btm)+"px";
        }
        var nextPageCtrl = document.getElementById("forward");
        var menuCtrl = document.getElementById("chapSelect");
        nextPageCtrl.style.width = menuCtrl.clientWidth;
        nextPageCtrl.style.height = 25 * heightScale;
    }
}

function sizeFonts() {
    if(heightScale != 1) {
        var newMenuFontSize = Math.floor(9 * heightScale)+1;
        document.getElementById("chapSelect").style.fontSize = newMenuFontSize + "pt";
        var newNavFontSize = Math.floor(14 * heightScale);
        document.getElementById("navigate").style.fontSize = newNavFontSize + "pt";
        var l, t, s;    //left, top, font size
        var lineLayer;
        for (var i = 1; i < 7; i++) {
            lineLayer = document.getElementById("line" + i);
            l = parseInt(lineLayer.style.left) * widthScale;
            lineLayer.style.left = l + "px";
            t = parseInt(lineLayer.style.top) * heightScale;
            lineLayer.style.top = t + "px";
            s = parseInt(lineLayer.style.fontSize) * heightScale;
            lineLayer.style.fontSize = s + "pt";
        }
        var inputs = document.getElementsByTagName("input"); //find all input tags
        for (var i = 0; i < inputs.length; i++) {
            var inp = inputs[i];
            inp.style.fontSize = 16 * heightScale;
        }
        var limit = document.getElementById("limit");
        limit.style.fontSize = (20 * heightScale) + "pt";
        var fonts = document.getElementsByTagName("font");  //find all the font tags
        var aFont, aFontSize;
        for (var i = 0; i < fonts.length; i++) {
            aFont = fonts[i];
            aFont.size *= heightScale;
        }
    }
}

function SetFonts(hScreen) {
	var objChapMenu = document.getElementById("chapSelect");
	switch(hScreen) {
		case 600: objChapMenu.style.fontSize = '5pt';
			break;
		case 720: objChapMenu.style.fontSize = '6pt';
			break;
		case 768: objChapMenu.style.fontSize = '6pt';
			break;
		case 800: objChapMenu.style.fontSize = '8pt';
			break;
		case 864: objChapMenu.style.fontSize = '8pt';
			break;
		case 900: objChapMenu.style.fontSize = '8pt';
			break;
		case 960: objChapMenu.style.fontSize = '9pt';
		    break;
		case 1024: objChapMenu.style.fontSize = '9pt';
		    break;
		case 1200: objChapMenu.style.fontSize = '10pt';
		    break;
		default: objChapMenu.style.fontSize = '11pt';
		    break;
	    }
}

function GoToPage() {
	var gopage = document.GoPage.pagedisplay.value;
	if(isNaN(parseInt(gopage, 10))) {
		//validate that gopage is not null
		if(gopage == '') {
			alert("NULL inputs are invalid");
			document.GoPage.pagedisplay.value = pageNum;
		}
		//validate for spaces
		else {
			for(var i=0; i<gopage.length; i++) {
				var c = gopage.charAt(i);
				if(c == ' ') {
					alert("Input cannot contain spaces");
					document.GoPage.pagedisplay.value = pageNum;
					break;
				}
				else {
					alert("Input must be a number between 1 and 61.");
					document.GoPage.pagedisplay.value = pageNum;
					break;
				}
			}
		}
	}
	else if(gopage > maxPages) {
		alert("Input cannot exceed " + maxPages + " pages.");
		document.GoPage.pagedisplay.value = pageNum;
	}
	else if(gopage < 1) {
		alert("Input cannot be less than 1 page.");
		document.GoPage.pagedisplay.value = pageNum;
	}
	else if(gopage == pageNum) {
		alert("You are already on this page. Select another.");
	}
	else {
		HideTheOldPage();
		var gopage = document.GoPage.pagedisplay.value;
		pageNum = gopage;
		var prevId="page"+(gopage-1);
		var pageId="page"+gopage;
		gopage -= 0;
		var gopageup = gopage + 1;
		var nextId="page"+(gopageup);
    	ChangePage(prevId, pageId, nextId);
    }
}

function HideTheOldPage() {
	var leaveId = pageNum;
	var leaveLayer=document.getElementById("page" + leaveId);
	leaveLayer.style.visibility = "hidden";
}

var pageNum=1;
function FlipPages(direction) {
	var prevId="page"+pageNum;
	pageNum -= 0;
	pageNum += direction;
	var pageId="page"+pageNum;
	var nextId="page"+(pageNum + 1);
    document.GoPage.pagedisplay.value = pageNum;
    ChangePage(prevId, pageId, nextId);
}

function JumpToChapter() {
	HideTheOldPage();	
	var chaptNum = document.gotochapter.chapters.value;
	var prevId="page"+(chaptNum-1);
	var pageId="page"+chaptNum;
	pageNum = chaptNum;
	document.GoPage.pagedisplay.value = chaptNum;
	chaptNum -= 0;
	chaptNum += 1;
	var nextId="page"+chaptNum;
    ChangePage(prevId, pageId, nextId)	
}

function ChangePage(prevId, pageId, nextId) {
	switch(BrowserType) {
		case "Nav4x":
			break;
		case "IE4x":
			break;        case "W3C":
			var forwardLayer=document.getElementById("forward");
			var backupLayer=document.getElementById("backup");
			backupLayer.style.visibility="hidden";
			if(pageNum > 1) {
				prevLayer=document.getElementById(prevId);
				prevLayer.style.visibility="hidden";
				backupLayer.style.visibility="visible";
			}
			forwardLayer.style.visibility="hidden";
			pageLayer=document.getElementById(pageId);
			pageLayer.style.visibility="visible";
			if(pageNum < maxPages) {
				nextLayer=document.getElementById(nextId);
				nextLayer.style.visibility="hidden";
				forwardLayer.style.visibility="visible";
			}
			break;
	}   //end switch
}  // end function

function ShowHelp() {
    var helpWin = window.open("helpFile.htm", "showHelp", "width=400, height=700, status=no,resizable=no");
}