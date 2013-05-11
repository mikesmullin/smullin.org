function Slideshow(slideshow, timeout, startingID, mediaID, medialinkID, albumlinkID) {
	$('loadingdiv').style.top = '100px';
	$('loadingdiv').style.left = '100px';

	$('sscontrols').style.display = '';
	new Effect.Appear('sscontrols',{duration:.3});

	this.slides = [];
	this.slides.push($('div0'));
	this.slides.push($('div1'));

	this.timeout = timeout;
	this.front = 1;
	this.back = 0;
	this.ready = 0;
	this.paused = false;

	this.startingID = startingID;
	this.previousID = mediaID;
	this.mediaID = mediaID;
	this.medialinkID = medialinkID;
	this.albumlinkID = albumlinkID;

	this.slides[this.front].style.zIndex = 1;
	this.slides[this.back].style.zIndex = 0;

	this.next();
}
Slideshow.prototype = {
	next: function() {
		if(this.slides[this.back].innerHTML) {
			this.slides[this.back].style.display = '';

			var slideheight = $('div' + this.back).offsetHeight;
			var ssheight = parseInt($('slideshow').style.height);
			if(!ssheight || ssheight < slideheight) {
				$('div' + this.front).style.height = slideheight + 'px';
				$('slideshow').style.height = slideheight + 'px';
			}
			var slidewidth = $('div' + this.back).offsetWidth;
			var sswidth = parseInt($('slideshow').style.width);
			if(!sswidth || sswidth < slidewidth) {
				$('div' + this.front).style.width = slidewidth + 'px';
				$('slideshow').style.width = slidewidth + 'px';
			}

			this.slides[this.front].style.zIndex = 2;
			this.slides[this.back].style.zIndex = 1;

			Effect.Fade(this.slides[this.front], {
				duration: .3,
				beforeStart: function(effect) {
					$('loadingdiv').style.display='none';
				},
				afterFinish: function(effect) {
					effect.element.style.zIndex = 0;
					Element.setOpacity(effect.element, 1);
					adjustTimeout(myslides);
					myslides.front = (myslides.front + 1) % 2;
					myslides.back = (myslides.back + 1) % 2;
					myslides.ready = 0;
					myslides.loadslide();
				}
			});
		}
		else {
			adjustTimeout(this);
			this.loadslide();
		}
	},
	loadslide: function() {
		var strParams = 'mediaID=' + this.mediaID + '&medialinkID=' + this.medialinkID + '&albumlinkID=' + this.albumlinkID;
		//alert(strParams);
		var loader1 = new net.ContentLoader(showmediaxmlfile,getNextSlide,null,"POST",strParams);
	}
}

function adjustTimeout(slide) {
	clearTimeout(timeoutID);
    timeoutID = setTimeout((function(){slide.next();}).bind(slide), slide.timeout + 500);
}

function getNextSlide() {
	var pair;
	var mediaID = "";
	var medialinkID = "";
	var albumlinkID = "";

	var contentstart = this.req.responseText.indexOf('<');
	var arglist = this.req.responseText.substr(0,contentstart);
	var content = this.req.responseText.substr(contentstart);

	arglist.replace('&amp;','&');
	var args = arglist.split("&");
	for(i = 0; i < args.length; i++) {
		pair = args[i].split("=");
		if(pair[0] == "mediaID")
			mediaID = pair[1];
		else if(pair[0] == "medialinkID")
			medialinkID = pair[1];
		else if(pair[0] == "albumlinkID")
			albumlinkID = pair[1];
	}

	if(!repeat && myslides.previousID == myslides.startingID) {
		stopshow(startmsg);
	}

	myslides.previousID = myslides.mediaID;
	myslides.mediaID = mediaID;
	myslides.medialinkID = medialinkID;
	myslides.albumlinkID = albumlinkID;

	$('div' + myslides.back).style.display = 'none';
	$('div' + myslides.back).innerHTML = content;
	myslides.ready = 1;
}

function stopshow(msg) {
	if(myslides.paused) {
		$('slidetoggle').innerHTML = stopmsg;
		myslides.paused = false;
       	new Effect.Appear('sscontrols',{duration:.3});
		timeoutID = setTimeout((function(){myslides.next();}).bind(myslides), myslides.timeout + 500);
	}
	else {
		clearTimeout(timeoutID);
		timeoutID = false;
		myslides.paused = true;
		if(!msg) msg = resumemsg;
		$('slidetoggle').innerHTML = msg;
	   	new Effect.Fade('sscontrols',{duration:.3});
	}
	return false;
}

function jump(mediaID,medialinkID,albumlinkID) {
	if(timeoutID) {
		clearTimeout(timeoutID);
		timeoutID = false;
		$('div' + myslides.back).innerHTML = '';
		new Effect.Opacity($('div' + myslides.front), {
			from:1,to:.4,duration:.2,
			afterFinish: function(effect) {
				$('loadingdiv').style.display = 'block';
			}
		});

		myslides.previousID = myslides.mediaID;
		myslides.mediaID = mediaID;
		myslides.medialinkID = medialinkID;
		myslides.albumlinkID = albumlinkID;

		adjustTimeout(myslides);
		myslides.loadslide();
		return false;
	}
	else
		return true;
}

function jumpnext(mediaID,medialinkID,albumlinkID) {
	if(timeoutID) {
		if(myslides.ready) {
			clearTimeout(timeoutID);
			timeoutID = false;
			myslides.next();
			return false;
		}
		else
			return jump(mediaID,medialinkID,albumlinkID);
	}
	else
		return true;
}

function changeSlideTime(delta) {
	if((myslides.timeout > 1000 && delta < 0) || (myslides.timeout < 10000 && delta > 0))
		myslides.timeout += delta;
	var secs = myslides.timeout / 1000;
	$('sssecs').innerHTML = secs.toPrecision(2);
	return false;
}
