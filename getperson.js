function innerToggle(part,subpart,subpartlink) {
	if( part == subpart )
		turnOn(subpart,subpartlink);
	else
		turnOff(subpart,subpartlink);
}

function turnOn(subpart,subpartlink) {
	document.getElementById(subpartlink).className = 'lightlink3';
	document.getElementById(subpart).style.display = "";
}

function turnOff(subpart,subpartlink) {
	document.getElementById(subpartlink).className = 'lightlink';
	document.getElementById(subpart).style.display = "none";
}

function highlightChild(flag,child) {
	$('child'+child).className = flag ? 'highlightedchild' : 'unhighlightedchild';
}