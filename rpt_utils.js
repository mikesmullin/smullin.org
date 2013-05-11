function toggleSection(section,img,display) {
	if(display == 'on') {
		$(img).src = cmstngpath + 'tng_collapse.gif';
		new Effect.Appear(section,{duration:.3});
	}
	else if(display == 'off') {
		$(img).src = cmstngpath + 'tng_expand.gif';
		new Effect.Fade(section,{duration:.3});
	}
	else {
		$(img).src= $(img).src.indexOf('collapse') > 0 ? cmstngpath + 'tng_expand.gif' : cmstngpath + 'tng_collapse.gif';
		new Effect.toggle(section,'appear',{duration:.3});
	}
	return false;
}