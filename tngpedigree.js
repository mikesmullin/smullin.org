for( var h = 1; h < slotceiling; h++ ) {
	eval( 'var timer' + h + '=false' );
}
var timerleft = false;

function showPopup( slot, tall, high ){
// hide any other currently visible popups
	if( lastpopup ) {
		cancelTimer(lastpopup);
		hidePopup(lastpopup);
	}
	lastpopup = slot;

// show current
	var ref = $("popup" + slot);
	ref.innerHTML = getPopup(slot);

	ref.style.top = ( tall + high ) < 0 ? 0 : ( tall + high + pedborderwidth ) + 'px';
	if ( ref.style.visibility != "show" && ref.style.visibility != "visible" ) {
		ref.style.top = ( tall + high ) < 0 ? 0 : ( tall + high + pedborderwidth ) + 'px';
		ref.style.zIndex = 8;
    	ref.style.visibility = "visible";
	}
}

function hidePopup(slot) {
	var ref = $("popup" + slot);
	if (ref) { ref.style.visibility = "hidden"; }
	eval("timer" + slot + "=false;");
}

function showBackPopup() {
	if( lastpopup ) {
		cancelTimer(lastpopup);
		hidePopup(lastpopup);
	}
	lastpopup = '';
	
	var ref = $("popupleft");
	ref.innerHTML = getBackPopup();

	if ( ref.style.visibility != "show" && ref.style.visibility != "visible" ) {
		ref.style.zIndex = 8;
    	ref.style.visibility = "visible";
	}
}

function setTimer(slot) {
	eval( "timer" + slot + "=setTimeout(\"hidePopup('" + slot + "')\",popuptimer);");
}

function cancelTimer(slot) {
	eval( "clearTimeout(timer" + slot + ");" );
	eval( "timer" + slot + "=false;" );
}

function setFirstPerson(newperson) {
	if(newperson != firstperson) {
		firstperson = newperson;
		if( !tngprint ) {
			var params = 'personID=' + newperson + '&tree=' + tree + '&parentset=' + parentset + '&generations=' + generations;
			$("stdpedlnk").href = pedigree_url + params + '&display=standard';
			$("compedlnk").href = pedigree_url + params + '&display=compact';
			$("boxpedlnk").href = pedigree_url + params + '&display=box';
			$("textlnk").href = pedigreetext_url + params;
			$("ahnlnk").href = ahnentafel_url + params;
			$("extralnk").href = extrastree_url + params + '&showall=1';
		}
	}
}

function fetchData(famParams,newgens) {
   	var loading = document.getElementById("loading");
	loading.style.visibility = "visible";

	var strParams = "generations=" + newgens + "&tree=" + tree + '&display=' + display + famParams;
 	var loader1 = new net.ContentLoader(pedjsonfile,FillChart,null,"POST",strParams);
}

function getNewChart(personID,newgens,newparentset) {
	setFirstPerson(personID);
	fetchData('&personID=' + personID + '&parentset=' + newparentset, newgens );
}

function getNewFamilies(famParams,newgens,gender) {
	//set first person
	var nextfamily = people[firstperson].famc;
	if( gender == "F" )
		setFirstPerson(families[nextfamily].wife);
	else
		setFirstPerson(families[nextfamily].husband);

	if( famParams )
		fetchData(famParams,newgens);
	else
		DisplayChart();
}

function goBack(backperson) {
	setFirstPerson( backperson );
	DisplayChart();
}

function FillChart() {
	var vars = eval('('+this.req.responseText+')');
	if(vars.people) {
		for(i=0; i < vars.people.length; i++) {
			//var p = new Person(vars.people[i]);
			var p = vars.people[i];
			var pID = vars.people[i].personID;
			people[pID] = p;
		}
	}
	if(vars.families) {
		for(i=0; i < vars.families.length; i++){
			var family = vars.families[i];
			var famID = vars.families[i].famID;
			families[famID] = family;
		}
	}
   	var loading = document.getElementById("loading");
	DisplayChart();
	loading.style.visibility = "hidden";
}

function DisplayChart() {
	toplinks = "";
	botlinks = "";
	endslotctr = 0;
	endslots = new Array();

	var slot = 1;
	FillSlot(slot,firstperson,0);

	var offpage;
	var leftarrow = $('leftarrow');
	if(people[firstperson].backperson) {
		leftarrow.innerHTML = '<a href="javascript:goBack(' + "'" + people[firstperson].backperson + "'" + ');">' + leftarrowimg + '</a>';
		leftarrow.style.visibility = "visible";
	}
	else {
		var gotkids = 0;
		var activeperson = people[firstperson];
		if( activeperson.spfams) {
			for( var i = 0; i < activeperson.spfams.length; i++ ) {
				if( activeperson.spfams[i].children && activeperson.spfams[i].children.length ) {
					gotkids = 1;
					break;
				}
			}
		}
		if( gotkids ) {
			leftarrow.innerHTML = '<a href="javascript:showBackPopup();">' + leftarrowimg + '</a>';
			leftarrow.style.visibility = "visible";
		}
		else {
			leftarrow.innerHTML = '';
			leftarrow.style.visibility = "hidden";
		}
	}

	topparams = getParams( toplinks );
	botparams = getParams( botlinks );

	for( var i = 0; i < endslots.length; i++ ) {
		offpage = document.getElementById('offpage'+endslots[i]);
		offpage.style.visibility = "visible";
	}
}

function FillSlot(slot,currperson,lastperson) {
	var currentBox = $('box'+slot);
	var content;
	var slotperson, husband, wife;

	if( people[currperson] )
		slotperson = people[currperson];
	else {
		slotperson = new Object;
		slotperson.famc = -1;
		slotperson.personID = 0;
	}
	slots[slot] = slotperson;
   	var dnarrow = $('downarrow'+slot);
   	var popup = $('popup'+slot);
	var popupcontent = "";
	var shadow, border;

	if( slotperson.personID ) {
		//save primary marriage
		if( lastperson )
			slotperson.famID = people[lastperson].famc;
		else
			slotperson.famID = "";
		if( hideempty ) {
			currentBox.style.visibility = 'visible';
			toggleLines(slot,slotperson.famc,'visible');
		}
		if( slotperson.photosrc && slotperson.photosrc != "-1" ) {
			if( slotperson.photolink )
				content = '<a href="' + slotperson.photolink + '"><img src="' + slotperson.photosrc + '" id="img' + slot + '" border="0"></a>';
			else
				content = '<img src="' + slotperson.photosrc + '" id="img' + slot + '" border="0">';
			content = '<td align="left">' + content + '</td>';
		}
		else
			content = "";
		content += '<td class="pboxname" id="td' + slot + '" colspan="2">' + namepad + '<a href="' + getperson_url + 'personID=' + slotperson.personID + '&amp;tree=' + slotperson.tree + '">' + slotperson.name + '</a>';

		//put small pedigree link in every box except for primary individual
		if( popupchartlinks && slotperson.famc != -1 && slotperson.personID != personID)
			content += ' <a href="' + pedigree_url + 'personID=' + slotperson.personID + '&amp;tree=' + tree + '&amp;display=' + display + '&amp;generations=' + generations + '">' + chartlink + '</a>';
		if( display == "box" ) {
			var bmd = doBMD(slot,slotperson);
			if( bmd ) content += '<table border="0" cellpadding="0" cellspacing="0">' + bmd + '</table>';
		}
		content += '</td>';
		currentBox.style.backgroundColor = currentBox.oldcolor;

		if( usepopups ) {
			if( slotperson.spfams || slotperson.bdate || slotperson.bplace || slotperson.ddate || slotperson.dplace || slotperson.parents ) {
				dnarrow.style.visibility = "visible";
				popup.innerHTML = popupcontent;
			}
			else
				dnarrow.style.visibility = "hidden";
		}
	}
	//no person
	else {
		if( hideempty ) {
			content = '';
			currentBox.style.visibility = "hidden";
			toggleLines(slot,0,'hidden');
		}
		else {
			if( allow_add && lastperson ) {
				if( people[lastperson].famc != -1 )
					content = '<td class="pboxname" id="td' + slot + '" align="' + pedboxalign + '">' + namepad + '<a href="' + cmstngpath + 'admin/editfamily.php?familyID=' + people[lastperson].famc + '&amp;tree=' + tree + '&amp;cw=1" target="_blank">' + txt_editfam + '</a></td>';
				else
					content = '<td class="pboxname" id="td' + slot + '" align="' + pedboxalign + '">' + namepad + '<a href="' + cmstngpath + 'admin/newfamily.php?child=' + lastperson + '&amp;tree=' + tree + '" target="_blank">' + txt_addfam + '</a></td>';
	 		}
			else
				content = '<td class="pboxname" id="td' + slot + '" align="' + pedboxalign + '">' + namepad + unknown + '</td>';
			currentBox.style.backgroundColor = emptycolor;
		}
		if( usepopups ) {
			dnarrow.style.visibility = "hidden";
			popup.innerHTML = "";
		}
	}
	currentBox.innerHTML = content ? '<table border="0" style="height:100%;" cellpadding="' + pedcellpad + '" cellspacing="0" align="' + pedboxalign + '"><tr>' + content + '</tr></table>' : "";

	var nextslot = slot * 2;
	if( slotperson.famc != -1 && families[slotperson.famc] ) {
		husband = families[slotperson.famc].husband;
		wife = families[slotperson.famc].wife;
	}
	else {
		husband = 0;
		wife = 0;
	}
	if( nextslot < slotceiling ) {
		FillSlot(nextslot,husband,slotperson.personID);
		nextslot++;
		FillSlot(nextslot,wife,slotperson.personID);
	}
	else if( slotperson.famc != "-1" ) {
		if( slot < (slotceiling_minus1 * 3 / 2) )
			toplinks = addToList(toplinks,slotperson.personID);
		else
			botlinks = addToList(botlinks,slotperson.personID);
		endslots[endslotctr] = slot;
		endslotctr++;
	}
	else {
		offpage = $('offpage'+slot);
		offpage.style.visibility = "hidden";
	}
}

function toggleLines(slot,nextperson,visibility) {
	var newvis;

	for( var i = 1; i <= 5; i++ ) {
		shadow = $('shadow'+slot+'_'+i);
		border = $('border'+slot+'_'+i);
		newvis = ( i == 3 && nextperson <= 0) ? "hidden" : visibility;
		if( shadow )
			shadow.style.visibility = newvis;
		if( border )
			border.style.visibility = newvis;
	}
}

function addToList(linklist,backperson) {
	if( linklist.indexOf(backperson) < 0 ) {
		if( linklist ) linklist += ",";
		linklist += backperson;
	}
	return linklist;
}

function getParams( personstr ) {
	var params = "", currperson, nextfamily;

	if( personstr ) {
		var pers = personstr.split(",")
		for( var i = 0; i < pers.length; i++ ) {
			currperson = pers[i];
			nextfamily = people[currperson].famc;
			if( !families[nextfamily] ) {
				ctr = i + 1;
				params += "&backpers" + ctr + "=" + currperson + "&famc" + ctr + "=" + people[currperson].famc;
			}
		}
	}
	return params;
}

var tdclasstxt = 'class="normal pboxpopup" valign="top"';
var divtxt = '<div class="pboxpopupdiv">\n<table cellspacing="0" cellpadding="1" border="0" width="100%">\n';
var tabletxt = '<table cellspacing="0" cellpadding="1" border="0" width="100%">\n';
function doRow(slot,slotabbr,slotevent1,slotevent2) {
	var rstr = "";
	slotabbr += ":";
	if( slotevent1 )
		rstr += '<tr><td ' + tdclasstxt + ' align="right" id="popabbr' + slot + '">' + slotabbr + '</td><td ' + tdclasstxt + ' colspan="3" id="pop' + slot + '">' + slotevent1 + '</td></tr>';
	if( slotevent2 ) {
		if( slotevent1 ) slotabbr = '&nbsp;';
		rstr += '<tr><td ' + tdclasstxt + ' align="right" id="popabbr' + slot + '">' + slotabbr + '</td><td ' + tdclasstxt + ' colspan="3" id="pop' + slot + '">' + slotevent2 + '</td></tr>';
	}
	return rstr;
}

function getBackPerson(nxtpersonID) {
	hidePopup('left');
	getNewChart(nxtpersonID, generations, 0);
}

function getBackPopup() {
	var popupcontent = "", spouselink, count, kidlink;

	var slotperson = slots[1];

	if( slotperson.spfams ) {
		popupcontent += divtxt;
		for( var i = 0; i < slotperson.spfams.length; i++ ) {
			var fam = slotperson.spfams[i];
			count = i + 1;

			//do each spouse
			if( fam.spID && fam.spID != -1)
				spouselink = fam.spname;
			else
				spouselink = unknown;

		    popupcontent += '<tr><td ' + tdclasstxt + ' id="popabbrleft"><b>' + count + '</b></td>';
			popupcontent += '<td ' + tdclasstxt + ' colspan="2" id="popleft">' + spouselink + '</td></tr>';

			if( popupkids && fam.children ) {
				//these might not need nowrap
   				popupcontent += '<tr><td ' + tdclasstxt + ' align="right" id="popabbrleft">&nbsp;</td><td ' + tdclasstxt + ' colspan="3" id="popleft"><b>' + txt_children + ':</b></td></tr>\n';
				for( var j = 0; j < fam.children.length; j++ ) {
					var spchild = fam.children[j];

					kidlink = '<a href="javascript:getBackPerson(' + "'" + spchild.childID + "'" + ')">';
				    	popupcontent += '<tr><td ' + tdclasstxt + ' id="popabbrleft">' + kidlink + '<img src="ArrowLeft.gif" width="10" height="16" border="0"></a></td>';
					popupcontent += '<td ' + tdclasstxt + ' id="popleft">' + kidlink + spchild.name + '</a></td></tr>';
				}
			}
		}
		popupcontent += "</table></div>\n";
	}
	if( popupcontent )
	 	popupcontent = '<div><div class="tngshadow popinner">' + popupcontent + '</div></div>\n';
	return popupcontent;
}

function doBMD(slot,slotperson) {
	var famID = slotperson.famID;
	var content = "";

	if(display == "standard")
		content += divtxt + '<tr><td ' + tdclasstxt + ' colspan="4"><b>'+slotperson.name+'</b></td></tr>\n';
	else
		content += tabletxt;
	content += doRow(slot,slotperson.babbr,slotperson.bdate,slotperson.bplace);
	if( famID )
		content += doRow(slot,families[famID].mabbr,families[famID].mdate,families[famID].mplace);
	content += doRow(slot,slotperson.dabbr,slotperson.ddate,slotperson.dplace);
	content += '</table>';
	if(display == "standard")
		content += '</div>';
	return content;
}

function getPopup(slot) {
	var popupcontent = "", spouselink, sppedlink, count, kidlink, kidpedlink, parpedlink, parentlink;

	var slotperson = slots[slot];

	if( display == "standard" )
		popupcontent += doBMD(slot,slotperson);

	if( slotperson.parents ) {
		if(popupcontent) popupcontent += '<div class="popdivider"></div>\n';
		popupcontent += divtxt;
   		popupcontent += '<tr><td class="normal pboxpopup" valign="top" colspan="4" id="pop' + slot + '"><b>' + txt_parents + ':</b></td></tr>\n';
		for( var i = 0; i < slotperson.parents.length; i++ ) {
			var par = slotperson.parents[i];
			count = i + 1;
			parentlink = '';

			if( par.fatherID )
				parentlink += '<a href="' + getperson_url + 'personID=' + par.fatherID + '&amp;tree=' + tree + '">' + par.fathername + '</a>';
			if( par.motherID ) {
				if( parentlink ) parentlink += ", ";
				parentlink += '<a href="' + getperson_url + 'personID=' + par.motherID + '&amp;tree=' + tree + '">' + par.mothername + '</a>';
			}
			if( par.famID != slotperson.famc )
				parpedlink = '<a href="' + pedigree_url + 'personID=' + slotperson.personID + '&amp;tree=' + tree + '&amp;parentset=' + count + '&amp;display=' + display + '&amp;generations=' + generations + '">' + chartlink + '</a>';
			else
				parpedlink = '';
		    popupcontent += '<tr><td ' + tdclasstxt + ' id="popabbr' + slot + '"><b>' + count + '</b></td>';
			popupcontent += '<td ' + tdclasstxt + ' colspan="2" id="pop' + slot + '">' + parentlink + '</td>';
			popupcontent += '<td ' + tdclasstxt + ' align="right">&nbsp;' + parpedlink + '</td></tr>';
		}
		popupcontent += '</table></div>\n';
	}

	if( popupspouses && slotperson.spfams ) {
		for( var i = 0; i < slotperson.spfams.length; i++ ) {
			var fam = slotperson.spfams[i];
			count = i + 1;

			//this one might not need "nowrap"
			if(popupcontent) popupcontent += '<div class="popdivider"></div>';
			popupcontent += divtxt;
			popupcontent += '<tr><td ' + tdclasstxt + ' colspan="4" id="pop' + slot + '"><B>' + txt_family + ':</B> [<a href=\"' + familygroup_url + 'familyID=' + fam.spFamID + '&amp;tree=' + tree + '">' + txt_groupsheet + '</a>]</td></tr>';
			//do each spouse
			sppedlink = '';
			if( fam.spID && fam.spID != -1) {
				spouselink = '<a href="' + getperson_url + 'personID=' + fam.spID + '&amp;tree=' + tree + '">' + fam.spname + '</a>';
				if( popupchartlinks )
					sppedlink = '<a href="' + pedigree_url + 'personID=' + fam.spID + '&amp;tree=' + tree + '&amp;display=' + display + '&amp;generations=' + generations + '">' + chartlink + '</a>';
			}
			else
				spouselink = unknown;

		    popupcontent += '<tr><td ' + tdclasstxt + ' id="popabbr' + slot + '"><b>' + count + '</b></td>';
			popupcontent += '<td ' + tdclasstxt + ' colspan="2" id="pop' + slot + '">' + spouselink + '</td>';
			popupcontent += '<td ' + tdclasstxt + ' align="right">' + sppedlink + '</td></tr>';

			if( popupkids && fam.children && fam.children.length ) {
   				popupcontent += '<tr><td class="normal pboxpopup" align="right" valign="top" id="popabbr' + slot + '">&nbsp;</td><td class="normal pboxpopup" valign="top" colspan="3" id="pop' + slot + '"><B>' + txt_children + ':</B></td></tr>\n';
				for( var j = 0; j < fam.children.length; j++ ) {
					var spchild = fam.children[j];

					kidlink = '<a href="' + getperson_url + 'personID=' + spchild.childID + '&amp;tree=' + tree + '">' + spchild.name + '</a>';
					if( popupchartlinks )
						kidpedlink = '<a href="' + pedigree_url + 'personID=' + spchild.childID + '&amp;tree=' + tree + '&amp;display=' + display + '&amp;generations=' + generations + '">' + chartlink + '</a>';
					else
						kidpedlink = '';
				    popupcontent += '<tr><td ' + tdclasstxt + ' id="popabbr' + slot + '">&nbsp;</td>';
					popupcontent += '<td ' + tdclasstxt + ' id="pop' + slot + '">' + pedbullet + '</td>';
					popupcontent += '<td ' + tdclasstxt + ' id="pop' + slot + '">' + kidlink + '</td>';
					popupcontent += '<td ' + tdclasstxt + ' align="right" id="pop' + slot + '">' + kidpedlink + '</td></tr>';
				}
			}
			popupcontent += '</table></div>\n';
		}
	}

	if( popupcontent )
	 	popupcontent = '<div><div class="tngshadow popinner">' + popupcontent + '</div></div>\n';
	return popupcontent;
}