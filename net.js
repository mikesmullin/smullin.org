/*
url-loading object and a request queue built on top of it
*/

/* namespacing object */
var net=new Object();

net.READY_STATE_UNINITIALIZED=0;
net.READY_STATE_LOADING=1;
net.READY_STATE_LOADED=2;
net.READY_STATE_INTERACTIVE=3;
net.READY_STATE_COMPLETE=4;


/*--- content loader object for cross-browser requests ---*/
net.ContentLoader=function(url,onload,onerror,method,params,contentType){
  this.req=null;
  this.onload=onload;
  this.onerror=(onerror) ? onerror : this.defaultError;
  this.loadXMLDoc(url,method,params,contentType);
}

net.ContentLoader.prototype.loadXMLDoc=function(url,method,params,contentType){
  if (!method){
    method="GET";
  }
  if (!contentType && method=="POST"){
    contentType='application/x-www-form-urlencoded';
  }
  if (window.XMLHttpRequest){
    this.req=new XMLHttpRequest();
  } else if (window.ActiveXObject){
    this.req=new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (this.req){
    try{
      var loader=this;
      this.req.onreadystatechange=function(){
        net.ContentLoader.onReadyState.call(loader);
      }
      this.req.open(method,url,true);
      if (contentType){
        this.req.setRequestHeader('Content-Type', contentType);
      }
      this.req.send(params);
    }catch (err){
      this.onerror.call(this);
    }
  }
}


net.ContentLoader.onReadyState=function(){
  var req=this.req;
  var ready=req.readyState;
  if (ready==net.READY_STATE_COMPLETE){
    var httpStatus=req.status;
    if (httpStatus==200 || httpStatus==0){
      this.onload.call(this);
    }else{
      this.onerror.call(this);
    }
  }
}

net.ContentLoader.prototype.defaultError=function(){
  alert("There was a problem returning data from the server. This may be temporary, so please try again later. Here is some information about the status of this request:"
    +"\n\nreadyState:"+this.req.readyState
    +"\nstatus: "+this.req.status
    +"\nheaders: "+this.req.getAllResponseHeaders());
}

function showPreview(mediaID,path,entityID) {
	var entitystr = entityID ? mediaID+'_'+entityID : mediaID;
	if(!$('prev'+entitystr).innerHTML)
		$('prev'+entitystr).innerHTML = '<div id="ld'+entitystr+'"><img src="' + cmstngpath + 'spinner.gif" style="border:0px"> '+loadingmsg+'</div><img src="' + smallimage_url + 'mediaID=' + mediaID + '&path=' + encodeURIComponent(path) + '" style="display:none" onload="$(\'ld\'+\'' + entitystr + '\').style.display=\'none\'; this.style.display=\'\';"/>';
	new Effect.Appear('prev'+entitystr,{duration:.01});
}

function closePreview(mediaID,entityID) {
	var entitystr = entityID ? mediaID+'_'+entityID : mediaID;
	new Effect.Fade('prev'+entitystr,{duration:.01});
}
