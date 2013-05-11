var IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
var selects = new Array();
var selidx = 0;

LITBox = Class.create();
LITBox.prototype = {
   initialize: function(mes){
   this.mes = mes;
   this.options = Object.extend({
      width: 700,
      height: 500,
      type: 'window',
      func: null,
      onremove: null,
      draggable: true,
      resizable: true,
      overlay: true,
      opacity: 1,
      left: false,
      top: false
   }, arguments[1] || {});
   this.setup();
   },
   setup: function(){
      this.rn = ( Math.floor ( Math.random ( ) * 100000000 + 1 ) );
      this.getWindow();
      switch(this.options.type){
         case 'window' :

			if(IE6) {
				selects[selidx] = document.getElementsByTagName("select");
				for(i=0; i < selects[selidx].length; i++) {
					selects[selidx][i].style.visibility = 'hidden';
				}
				selidx += 1;
			}
		 	var tempvar = this.getAjax(this.mes);
			 this.d4.innerHTML = tempvar;
            break;
         case 'alert' : this.d4.innerHTML = this.mes;
            break;
         case 'confirm' : this.d4.innerHTML = '<p>' + this.mes + '</p>';
            this.button_y = document.createElement('input');
            this.button_y.type='button';
            this.button_y.value='Yes';
            this.d4.appendChild(this.button_y);
            this.button_y.d= this.d; this.button_y.d2 = this.d2;
            this.button_y.temp = this.options.func;
            this.button_y.onclick=this.remove;
            this.button_n = document.createElement('input');
            this.button_n.type='button';
            this.button_n.value='No';
            this.d4.appendChild(this.button_n);
            this.button_n.d= this.d; this.button_n.d2 = this.d2;
            this.button_n.onclick=this.remove;
      }
      this.display();
   },
   getWindow: function(){
      this.over = null;
      if(this.options.overlay == true) {
	      this.d = document.createElement('div');
	      document.body.appendChild(this.d);
	      this.d.className = 'LB_overlay';
		  this.d.id = 'LB_overlay';
	      this.d.style.display = 'block';
	      //this.d.onclick=this.remove;
      }
      this.d2 = document.createElement('div');
      document.body.appendChild(this.d2);
      this.d2.className = 'LB_window';
	  this.d2.id = 'LB_window';
      this.d2.style.height = parseInt(this.options.height) + 'px';
      //this.d2.style.position = 'absolute';
      this.d2.style.zIndex = '101';

      this.d3 = document.createElement('div');
      this.d2.appendChild(this.d3);
      this.d3.className='LB_closeAjaxWindow';
      this.d3.d2 = this.d2;
      this.d3.over = this.over;
      this.d3.options = this.options;
      this.d3.onmouseover=this.getDraggable;
      this.d3.onmouseout=this.dropDraggable;
      this.close = document.createElement('a');
      this.d3.appendChild(this.close);
      this.d3.style.width = parseInt(this.options.width) + 'px';
      this.close.d = this.d;
      this.close.d2 = this.d2;
      this.close.href='#';
      this.close.onclick=this.remove;
      this.close.innerHTML='<img src="' + closeimg + '" border="0">';
      this.close.id = 'LB_close';
      this.close.onremove = this.options.onremove;
      this.d4 = document.createElement('div');
      this.d4.className='LB_content';
      //this.d4.id = 'tlitbox';
      this.d4.style.height = parseInt(this.options.height) + 'px';
      this.d4.style.width = parseInt(this.options.width) + 'px';
      this.d2.appendChild(this.d4);
      this.clear = document.createElement('div');
      this.d2.appendChild(this.clear);
      this.clear.style.clear='both';
      if(this.options.overlay == true){
      this.d.d = this.d;
      this.d.d2 = this.d2;
      }
   },
   getDraggable: function(){
      if(this.options.draggable){
      if(this.resize)this.resize.destroy();
      if(!this.drag || (this.drag && !this.drag.dragging))
      this.drag = new Draggable(this.d2,{});
      }
   },
   dropDraggable: function(){
      if(this.options.draggable){
      if(!this.drag.dragging && this.drag){
      this.drag.destroy();
      }}
   },
   display: function(){
      Element.setOpacity(this.d2, 0);
      this.position();
      new Effect.Opacity(this.d2, {from:0,to:this.options.opacity,duration:.2});
   },
   position: function(){
      var de = document.documentElement;
   	var w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
   	var h = self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
   
     	if (window.innerHeight && window.scrollMaxY) {	
   		yScroll = window.innerHeight + window.scrollMaxY;
   	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
   		yScroll = document.body.scrollHeight;
   	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
   		yScroll = document.body.offsetHeight;
     	}
	this.d2.style.width = this.options.width + 'px';
	this.d2.style.display = 'block';
	if(!this.options.left || this.options.left < 0){
		this.d2.style.left = ((w - this.options.width)/2)+"px";
	}else{
		this.d2.style.left=parseInt(this.options.left)+'px';
	}
	
	var pagesize = this.getPageSize();
	var arrayPageScroll = this.getPageScrollTop();
/*	
	if(this.d2.offsetHeight > h - 100){
		if(!this.options.top || this.options.top < 0){
			this.d2.style.top = "45px";
		}else{
			this.d2.style.top=parseInt(this.options.top)+'px';
		}
		this.d2.style.height=h-100 + 'px';
		//this.d4.style.height=h-145 + 'px';
		this.d4.style.overflow ='auto';
	} else {   
*/
	if(!this.options.top || this.options.top < 0){
		var newtop = arrayPageScroll[1] + ((pagesize[1]-this.d2.offsetHeight)/2);
		this.d2.style.top = newtop > 0 ? newtop +"px" : "0px";
	}else{
		this.d2.style.top=parseInt(this.options.top)+'px';
	}
	/*}*/
	if(this.d){this.d.style.height =   yScroll +"px";}
   },
   remove: function(){
      if(this.temp) this.temp();
   	new Effect.Opacity(this.d2, {from:1,to:0,duration:.5});
   	if(this.d){new Effect.Opacity(this.d, {from:.6,to:0,duration:.5});
      if(this.onremove) this.onremove();
   	Element.remove(this.d);}
      Element.remove(this.d2);

	if(IE6) {
		selects[selidx] = document.getElementsByTagName("select");
		for(i=0; i < selects[selidx].length; i++) {
			selects[selidx][i].style.visibility = 'visible';
		}
		selidx -= 1;
	}
      return false;
   },
   parseQuery: function(query){
      var Params = new Object ();
      if ( ! query ) return Params; // return empty object
      var Pairs = query.split(/[;&]/);
      for ( var i = 0; i < Pairs.length; i++ ) {
         var KeyVal = Pairs[i].split('=');
         if ( ! KeyVal || KeyVal.length != 2 ) continue;
         var key = unescape( KeyVal[0] );
         var val = unescape( KeyVal[1] );
         val = val.replace(/\+/g, ' ');
         Params[key] = val;
      }
      return Params;
   },
   getPageScrollTop: function(){
      var yScrolltop;
      if (self.pageYOffset) {
         yScrolltop = self.pageYOffset;
      } else if (document.documentElement && document.documentElement.scrollTop){    // Explorer 6 Strict
         yScrolltop = document.documentElement.scrollTop;
      } else if (document.body) {// all other Explorers
         yScrolltop = document.body.scrollTop;
      }
      arrayPageScroll = new Array('',yScrolltop)
      return arrayPageScroll;
   },
   getPageSize: function(){
      var de = document.documentElement;
      var w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
      var h = self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
      
      arrayPageSize = new Array(w,h) 
      return arrayPageSize;
   },
   getAjax: function(url){
      var xmlhttp=false;
      /*@cc_on @*/
      /*@if (@_jscript_version >= 5)
      // JScript gives us Conditional compilation, we can cope with old IE versions.
      // and security blocked creation of the objects.
        try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
         try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
         } catch (E) {
          xmlhttp = false;
         }
        }
      @end @*/
      if (!xmlhttp && typeof XMLHttpRequest!='undefined') xmlhttp = new XMLHttpRequest();
      if(xmlhttp.overrideMimeType) xmlhttp.overrideMimeType('text/xml');
      if(url != ""){
         xmlhttp.open("GET", url, false);
         xmlhttp.send(null);
         return xmlhttp.responseText;
      }
   }
}

function openFind(form,findscript) {
	var params = Form.serialize(form);
	if($('findspin')) $('findspin').style.display = '';
	new Ajax.Request(findscript,{
		parameters:params,
		onSuccess:function(req){
			$('findresults').innerHTML = req.responseText;
			if($('findspin')) $('findspin').style.display = 'none';
			new Effect.toggle('finddiv','appear',{duration:.2,afterFinish:function(){new Effect.toggle('findresults','appear',{duration:.2});}});
		}
	});
	return false;
}

function reopenFindForm() {
	new Effect.toggle('findresults','appear',{duration:.2,afterFinish:function(){clearForm(document.findform1);new Effect.toggle('finddiv','appear',{duration:.2});}});
}

function clearForm(form) {
	Form.getElements(form).each(function(element) {
		if(element.type == 'text') element.value = '';
	});
}