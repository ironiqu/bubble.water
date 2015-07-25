
/*
 sirodorip water
 
 version:  3.0.05
 lvName :  chebon
 encode :  UTF-8
 date   :  2013/ / 
 made   :  in japan
 author :  goju//ironiqu
 license:  GPL
 web    :  water.sirodorip.jp
 
 Copyright (c) since 2011 goju//ironiqu
*/


(function(){
   /* variable */
   var inr,type,forin;
   var alnFunc,arrUnity,numUnity,strUnity,elmUnity;
   
   /* flags and shortcut begin */
   var flags={
         start:false,
         ie:(window.addEventListener)?false:true
   };
   var word={
         s:"WaterCssSelector",
         g:"WaterCssGetBy",
         pt:"prototype",
         el:"EventListenerResult"
   };
   var doc=window.document;
   var css=doc.styleSheets[0];
   /* flags and shortcut end */
   
   /* innerFunctions begin */
   type=function($literal){
      var ltrCst,typeOf;
      var result={
            Function:false,
            Array:false,
            Number:false,
            String:false,
            RegExp:false,
            Boolean:false,
            Element:false
      };
      typeOf=typeof $literal;
      if($literal===undefined) $literal=this;
      ltrCst=$literal.constructor;
      if(ltrCst===Array || $literal["splice"]) result.Array=true;
      else if(typeOf=="boolean")  result.Boolean=true;
      else if(typeOf=="function") result.Function=true;
      else if(ltrCst===Number)    result.Number=true;
      else if(ltrCst===String)    result.String=true;
      else if($literal.tagName)   result.Element=true;
      else if($literal.test)      result.RegExp=true;
      return result;
   };
   inr={
         type:type,
         event:function($target,$mSecond,$event,$function,$useCapture){
            var interval;
            var func;
            if($useCapture!=true){
               $useCapture=false;
            }
            if(inr.type($mSecond).Number){
               func=function(){
                  $function($target);
               };
               if($mSecond>=0){
                  setTimeout(func,$mSecond);
               }else{
                  interval=setInterval(func,-$mSecond);
                  return {
                     stop:function(){
                        clearInterval(interval);
                     },
                     limit:function($num){
                        setTimeout(this.stop,$num);
                     }
                  };
               }
            }else if(inr.type($event).String && $target){
               func=function($eventObj){
                  $function([word.el,$eventObj]);
               };
               if(flags.ie && $target.attachEvent){
                  target.attachEvent("on"+$event,func,$useCapture);
               }else if($target.addEventListener){
                  $target.addEventListener($event,func,$useCapture);
               }
            }
            return {
               
            };
         },
         eventReturn:function($source){
            var src=$source;
            return {
               target:(function(){
                  if(src.target) return src.target;
                  else if(window.event) return window.event.srcElement;
                  return false;
               })(),
               mousex:(function(){
                  if(src.pageX) return src.pageX;
                  else if(src.screenX) return src.screenX;
                  return false;
               })(),
               mousey:(function(){
                  if(src.pageY) return src.pageY;
                  else if(src.screenY) return src.screenY;
                  return false;
               })(),
               stopPropagation:function(){
                  src.stopPropagation();
               },
               preventDefault:function(){
                  src.preventDefault();
               }
            };
         },
         thisOwnProp:function($array,$idxName){
            return $array.hasOwnProperty($idxName);
         },
         popStyle:function($target,$n){
            if(!$target || !$n) return $target;
            $target=$target.length?$target[0]:$target;
            var r=$target.currentStyle || doc.defaultView.getComputedStyle($target,"");
            return r[$n];
         },
         pushStyle:function($target,$styleprop){
            var r=$target;
            var p="";
            if(inr.type($target).String || ($target[word.g] && $target[word.g]!="class")){
               forin($styleprop,function($n,$p){
                  p+=$n.replace(/([A-Z])/g,"-$1").toLowerCase()+":"+$p+" !important;";
               });
               if(flags.ie){
                  css.addRule($target[word.s],p);
               }else{
                  css.insertRule($target[word.s]+"{"+p+"}",css.cssRules?css.cssRules.length:0);
               }
            }else{
               forin($styleprop,function($n,$p){
                  $target.style[$n]=$p;
               });
            }
            return r;
         },
         PnS:function($styles){
            var retStyle={};
            if($styles && inr.type($styles).Array){
               forin($styles,function($name,$prop){
                  if(inr.NoS[$name]){
                     for(var j=0,k=inr.NoS[$name];j<k.length;j++){
                        retStyle[k[j]]=$prop;
                     }
                  }else retStyle[$name]=$prop;
               });
            }else if($styles){
               if(inr.NoS[$styles]) retStyle=inr.NoS[$styles][0];
               else retStyle=$styles;
            }
            return retStyle;
         },
         NoS:{
               boxShadow:["boxShadow","WebkitBoxShadow","MozBoxShadow","MsBoxShadow","OBoxShadow"],
               borderRadius:["borderRadius","WebkitBorderRadius","MozBorderRadius","MsBorderRadius","OBorderRadius"]
         },
         innerSize:function(){
            var w=0;
            var h=0;
            if(doc.body.clientWidth){
               doc.body.style.overflow="hidden";
               w=doc.body.clientWidth;
               doc.body.style.overflow="auto";
            }
            if(window.innerWidth)
               w=window.innerWidth;
            
            if(doc.body.clientHeight){
               doc.body.style.overflow="hidden";
               h=doc.body.clientHeight;
               doc.body.style.overflow="auto";
            }
            if(window.innerHeight)
               h=window.innerHeight;
            alnFunc.innerWidth=w;
            alnFunc.innerHeight=h;
         },
         Dynamic:function($target,$time,$fps,$before,$after){
            var flags,Calc,exe,list,time,style,that,callback;
            list=[];
            style={};
            that={};
            time={
                  bgn:0,          //begin
                  end:0,
                  cnt:0,          //time count
                  len:$time*1000, //time length
                  num:$time*$fps, //number of exe
                  spf:1000/$fps   //second per frame
            };
            flags={
                  stop:false
            };
            callback=function(){};
            Calc=function($styleName,$before,$after){
               var value,opacity,size,styleOf;
               value={
                     be:0,
                     af:0,
                     pow:1,
                     inc:0,  //include
                     cnt:0,  //count
                     unit:""
               };
               opacity=function(){
                  var that;
                  value.be=$before;
                  value.af=$after;
                  value.inc=(value.af-value.be)/time.num;
                  value.inc=Math.round(value.inc*100)/100;
                  value.pow=1;
                  that=function(){
                     value.cnt+=value.inc;
                     if(value.af>value.be && value.cnt>value.af){
                        value.cnt=value.af;
                     }else if(value.af<value.be && value.cnt<value.af){
                        value.cnt=value.af;
                     }
                     style[$styleName]=value.cnt;
                     style["filter"]="alpha(opacity="+value.cnt*100+")";
                  };
                  that["reset"]=function(){
                     value.cnt=value.be;
                  };
                  that.reset();
                  return that;
               };
               size=function(){
                  var that,tmp;
                  tmp=inr.numUnit($before);
                  value.be=tmp.number;
                  value.af=inr.numUnit($after).number;
                  value.inc=(value.af-value.be)/time.num;
                  value.inc=Math.round(value.inc*100)/100;
                  value.unit=tmp.unit;
                  value.pow=1;
                  that=function(){
                     value.cnt+=value.inc;
                     if(value.af>value.be && value.cnt>value.af){
                        value.cnt=value.af;
                     }else if(value.af<value.be && value.cnt<value.af){
                        value.cnt=value.af;
                     }
                     style[$styleName]=value.cnt+value.unit;
                  };
                  that["reset"]=function(){
                     value.cnt=value.be;
                  };
                  that.reset();
                  return that;
               };
               styleOf={
                     top:size,
                     left:size,
                     zIndex:size,
                     height:size,
                     width:size,
                     fontSize:size,
                     opacity:opacity
                     
               };
               if(!styleOf[$styleName]){
                  return false;
               }
               return styleOf[$styleName]();
            };
            exe=function(){
               if(!flags.stop){
                  if(time.cnt>=time.end){
                     flags.stop=true;
                     inr.pushStyle($target,$after);
                     callback();
                     callback=function(){};
                  }else{
                     for(var i=0;i<list.length;i++){
                        list[i]();
                     }
                     inr.pushStyle($target,style);
                     time.cnt+=time.spf;
                     if(time.cnt>time.end){
                        time.cnt=time.end;
                     }
                     setTimeout(exe,time.spf);
                  }
               }
               return;
            };
            exe["setTime"]=function(){
               time.bgn=new Date().getTime();
               time.cnt=time.bgn;
               time.end=time.bgn+time.len;
               flags.stop=false;
            };
            exe["setCalc"]=function(){
               var tmp;
               forin($after,function($name,$value){
                  if($before[$name]==undefined){
                     $before[$name]=inr.popStyle($target,$name);
                  }
                  if($before[$name]!=null && $before[$name]!=undefined
                                          && $before[$name]!=$value){
                     tmp=new Calc($name,$before[$name],$value);
                     if(tmp!=false){
                        list[list.length]=tmp;
                     }
                     tmp=null;
                  }else if(!$before[$name]){
                     //get now value
                  }
               });
            };
            that.again=function(){
               callback=function(){
                  inr.pushStyle($target,$before);
                  for(var i=0;i<list.length;i++){
                     list[i].reset();
                  }
                  exe.setTime();
                  exe();
               };
            };
            that.stop=function($value){
               var stop=function(){
                  flags.stop=true;
               };
               if(type($value).Number){
                  setTimeout($value,stop);
               }else if(type($value).Function){
                  if($value()===true){
                     stop();
                  }
               }else if(!$value){
                  stop();
               }
            };
            that.loop=function($max,$func){
               var cnt;
               cnt=$max;
            };
            that.callback=function($func){
               callback=$func;
            };
            exe.setCalc();
            exe.setTime();
            exe();
            return that;
         },
         numUnit:function($string){
            var pattern=/^([+\-]?\d+(?:\.\d+)?)([%\w]+)?$/i;
            var result=pattern.exec($string);
            if(!result[1]) result[1]=0;
            if(!result[2]) result[2]="";
            return {
               number:result[1]*1,
               unit:result[2]
            };
         }
   };

   forin=function($array,$function){
      for(var idxName in $array){
         if(idxName && inr.thisOwnProp($array,idxName))
            $function(idxName,$array[idxName]);
      }
      return true;
   };
   /* innerFunctions end */
   
   /* elementFunctions begin */
   var elmGet={
         tag:function($v,$w){
            return ($v && ($w=$v==="body"?doc.body:doc.getElementsByTagName($v)))?
                  elmUnity($w,$v,"tag"):false;
         },
         id:function($v,$w){
            return ($v && ($w=doc.getElementById($v)))?
                  elmUnity($w,"#"+$v,"id"):false;
         },
         cls:function($v,$w){
            return ($v && ($w=doc.getElementsByClassName($v)))?
                  elmUnity($w,"."+$v,"class"):false;
         }
   };
   var elmFunc=function($target){
      /* old->elem().EA */
      var tgt=$target;
      return {
         naked:function(){
            return tgt;
         },
         disable:function(){
            if(tgt.length) return this;
            tgt.disabled=true;
            return this;
         },
         enable:function(){
            if(tgt.length) return this;
            tgt.disabled=false;
            return this;
         },
         event:function($value,$function,$useCapture){
            var func=$function;
            if(inr.type($value).Number)
               return inr.event(tgt,$value,false,func,$useCapture);
            else if(inr.type($value).String)
               return inr.event(tgt,false,$value,func,$useCapture);
            return false;
         },
         addElement:function($tagOrElem,$property,$style){
            var obj=$tagOrElem;
            if(obj.naked)obj=$tagOrElem.naked();
            if(!obj)return false;
            return alnFunc.newElement(obj,$property,$style,tgt);
         },
         remove:function(){
            return tgt.parentNode.removeChild(tgt);
         },
         write:function($text){
            tgt.innerHTML=$text;
            return this;
         },
         writeOnce:function($text){
            tgt.innerHTML+=$text;
            return this;         
         }
      };
   };
   var elmStyle=function($target){
      var tgt=$target;
      return {
         style:function($style,$afterStyle){
            var pns=inr.PnS($style);
            var pnsAfter=inr.PnS($afterStyle);
            if(pns) inr.pushStyle($target,pns);
            
            return this.arrayUnion({
               time:function($time,$fps){
                  var dynamic=new inr.Dynamic(tgt,$time,$fps?$fps:35,pns,pnsAfter);
                  
                  return dynamic;
               }
            });
         },
         size:function($x,$y){
            inr.pushStyle(tgt,{
               width:$x=$x?$x:"50%",
               height:$y?$y:$x
            });
            return this;
         },
         boxShadow:function($p){
            var p=$p.join(" ");
            inr.pushStyle(tgt,{
               WebkitBoxShadow:p,
               MozBoxShadow:   p,
               MsBoxShadow:    p,
               OBoxShadow:     p,
               boxShadow:      p,
               filter: "progid:DXImageTransform.Microsoft.Shadow(color='"+$p[3]+"',Strength=20,Direction=135)"
            });
            return this;
         },
         radius:function($a,$b){
            var p;
            p=$a;
            if(inr.type($a).Array) p=$a.join(" ")+($b?"/"+$b.join(" "):"");
            inr.pushStyle(tgt,{
               WebkitBorderRadius:p,
               MozBorderRadius:   p,
               MsBorderRadius:    p,
               OBorderRadius:     p,
               borderRadius:      p
            });
            return this;
         },
         rotate:function($d,$x,$y,$t){
            var t=$t?$t:"%";
            var d="rotate("+($d?$d:90)+"deg)";
            var o=($x?$x:0)+t+" "+($y?$y:0)+t;
            inr.pushStyle(tgt,{
               WebkitTransform:      d,
               MozTransform:         d,
               MsTransform:          d,
               OTransform:           d,
               transform:            d,
               WebkitTransformOrigin:o,
               MozTransformOrigin:   o,
               MsTransformOrigin:    o,
               OTransformOrigin:     o,
               transformOrigin:      o
            });
            return this;
         },
         place:function($x,$y,$p,$z){
            inr.pushStyle(tgt,{
               left:$x=!$x?"50%":$x,
               top:!$y?$x:$y,
               position:!$p?"absolute":$p
            });
            if($z && $z.att().Num)tgt.style.zIndex=$z;
            return this;
         },
         opacity:function($n){/*0~1*/
            if(!inr.type($n).Number) return false;
            inr.pushStyle(tgt,{
               filter:"alpha(opacity="+$n*100+")",
               opacity:$n
            });
            return this;
         },
         show:function($boolean){
            var r=$boolean?"":"none";
            inr.pushStyle(tgt,{
               display:r
            });
            return this;
         }
      };
   };
   elmUnity=function($element,$selector,$getBy){
      /* old->elem()*/
      /* Assojoin->arrayUnion*/
      var tgt,funcUnion;
      tgt=$element;
      funcUnion={};
      if(!$selector || !$getBy){
         if(tgt.id){
            tgt[word.s]=tgt.id;
            tgt[word.g]="id";
         }
/*         else if(tgt.className){
            tgt[word.s]=tgt.className;
            tgt[word.g]="class";
         }else{
            tgt[word.s]=tgt.tagName;
            tgt[word.g]="tag";
         }*/
      }else{
         tgt[word.s]=$selector;
         tgt[word.g]=$getBy;
      }
      funcUnion.arrayUnion(elmFunc(tgt));
      funcUnion.arrayUnion(elmStyle(tgt));
      return funcUnion;
   };
   /* elementFunctions end */
   
   /* stringFunctions begin */
   strUnity=function($str){
      var tgt,funcUnion;
      tgt=$element;
      funcUnion={};
      funcUnion.arrayUnion(elmStyle(tgt));
      return funcUnion;
   };
   /* stringFunctions end */
   
   /* numberFunctions begin */
   numUnity=function($num,$num2){
      var funcUnion;
      funcUnion={
            abs  :Math.abs($num),
            ceil :Math.ceil($num),
            floor:Math.floor($num),
            round:Math.round($num),
            log  :Math.log($num),
            pow  :Math.pow($num,$num2)
         };
      return funcUnion;
   };
   /* numberFunctions end */
   
   /* arrayFunctions begin */
   arrUnity=function($arr){
      var funcUnion;
      funcUnion={
            forin:function($func){
               forin($arr,$func);
            }
      };
      return funcUnion;
   };
   /* arrayFunctions end */
   
   /* aloneFunctions begin*/
   alnFunc={
         newElement:function($tag,$property,$style,$target){
            var newElem;
            var tn=$tag?$tag:"DIV";
            newElem=tn.tagName?tn:doc.createElement(tn);
            if($property){
               forin($property,function($name,$content){
                  newElem[$name]=$content;
               });
            }
            newElem=elmUnity(newElem);
            if($style){
               newElem.style($style);
            }
               $target.appendChild(newElem.naked());
            return newElem;
         },
         event:function($value,$function,$useCapture){
            var target=flags.ie?window.document:window;
            if(inr.type($value).Number)
               return inr.event(target,$value,false,$function,$useCapture);
            else if(inr.type($value).String){
               return inr.event(target,false,$value,$function,$useCapture);
            }
            return false;
         },
         innerWidth:0,
         innerHeight:0,
         Ajax:(function(){
            var RES_FUNC = function($res){document.write($res);};
            var logs = [];
            
            var AjaxMethod = function($set, $logNum){
               var request = false;
               var response = false;
               var getString = "";
               var postString = null;
               var method = "POST";
               if($target && $target.appendChild!=undefined)
               var responseState = function(){
                  if(request.readyState == 4){
                     if(request.status == 200){
                        response = request.responseText;
                     }else{
                        response = false;
                     }
                     $set.response(response);
                     logs[$logNum] = response;
                  }
               };
         
               var format = function($getValue, $postValue){
                  var begin = true;
                  if($getValue){
                     getString = "?";
                     forin($getValue,
                        function($name, $value){
                           if(begin) begin = false;
                           else getString = getString + "&";
                           getString = getString + $name + "=" + $value;
                        });
                  }
                  begin = true;
                  if($postValue){
                     postString = "";
                     forin($postValue,
                        function($name, $value){
                           if(begin) begin = false;
                           else postString = postString + "&";
                           postString = postString + $name + "=" + $value;
                        });
                  }
               };
               
               format($set.getValue, $set.postValue);
               
               if(window.XMLHttpRequest){
                  request = new window.XMLHttpRequest;
               }else if(window.ActiveXObject){
                  request = new window.ActiveXObject("Msxml2.XMLHTTP");
                  if(!request){
                     request = window.ActiveXObject("Microsoft.XMLHTTP");
                  }
               }
               
               if(request){
                  if(!postString) method = "GET";
                  request.open(method, $set.url + getString, $set.async);
                  request.onreadystatechange = responseState;
                  request.setRequestHeader("content-type",
                                           "application/x-www-form-urlencoded");
                  request.send(postString);
               }else{
                  alert("! ajax(API) cannot be used !");
                  request = false;
                  response = "ajax(API) cannot be used";
                  $set.response(response);
               }
               
            };
            
            var connect = function($parameters){
               var clone = {};
               forin($parameters, function($name, $value){
                  clone[$name] = $value;
               });
               var logNum = logs.length;
               logs[logNum] = new AjaxMethod(clone, logNum);
            };
            
            return function(){
               this.url = "";
               this.async = true;
               this.getValue = {};
               this.postValue = {};
               this.response = RES_FUNC;
               this.connect = function(){
                  connect(this);
                  this.async = true;
                  this.getValue = {};
                  this.postValue = {};
                  this.response = RES_FUNC;
               };
               this.logs = logs;
            };
         })()
   };
   /* aloneFunctions end*/
   
   /* objectFunction begin */
   var objFunc={
         arrayUnion:function($array){
            var ret=this;
            forin($array,function($idxName,$value){
               ret[$idxName]=$value;
            });
            return ret;
         }
   };
   /* objectFunctions end */
   
   
   /* waterCore begin */
   var waterAll=function($value){
      var ret,type;
      ret=this;
      if($value){
         if(inr.type($value).String){
            if($value.search(":")!=-1){
               type=$value.split(":");
               ret=type[0]==="class"?elmGet.cls(type[1]):
                   type[0]==="tag"?  elmGet.tag(type[1]):
                   type[0]==="id"?   elmGet.id(type[1]) :ret;
            }else{
               ret=elmGet.id($value);
               if(!ret){
                  ret=elmGet.cls($value);
                  ret=ret.naked().length==0?elmGet.tag($value):ret;
                  ret=ret.naked().length==0?this:ret;
               }
            }
            if(ret===this){
               ret=strUnity($value);
            }
         }else if(inr.type($value).Array){
            if($value[0]===word.el){
               ret=inr.eventReturn($value[1]);
            }else{
               ret=arrUnity($value);
            }
         }else if(inr.type($value).Number){
            ret=numUnity($value);
         }
      }
      return ret;
/*      var element;
      if(!$value) return this;
      if($value.tagName) return elemUnity($value);
      if($value[0]===word.el) return inr.eventReturn($value[1]);
      if(inr.type($value).Number) return numUnity($value);
      if(inr.type($value).Array) return arrUnity($value);
      if($value.search(":")==-1){
         element=elmGet.id($value);
         element=!element?elmGet.cls($value):element;
         element=element.naked().length==0?elmGet.tag($value):element;
      }else{
         var type=$value.split(":");
         element=type[0]==="class"?elmGet.cls(type[1]):
                  type[0]==="tag"?elmGet.tag(type[1]):
                   type[0]==="id"?elmGet.id(type[1]):false;
      }
      return element;*/
   };
   /* waterCore end */
   
   /* Execution begin*/
   Object[word.pt].methodLoad=function($methods){
      var obj=this;
      forin($methods,function($idxName,$value){
         obj[word.pt][$idxName]=$value;
      });
      return obj;
   };
   if(!css || !css.length){
      if(flags.ie) css=document.createStyleSheet();
      else{
         var headTag=doc.getElementsByTagName('head')[0];
         if(!headTag) headTag=doc.createElement('head');
         var styleTag=doc.createElement('style');
         headTag.appendChild(styleTag);
         css=styleTag.sheet;
      }
   }
   if(!doc.getElementsByClassName){
      doc.getElementsByClassName=function($className){
         var tgtClass=[];
         var allElements=doc.all || doc.getElementsByTagName("*");
         if(allElements){
            for(var i=0;i<allElements.length;i++){
               if(allElements[i].className===$className)
                  tgtClass[tgtClass.length]=allElements[i];
            }
         }
         return tgtClass;
      };
   }
   forin(alnFunc,function($name,$value){
      waterAll[$name]=$value;
   });
   window.water_start=function(){
      if(!flags.start){
         Object.methodLoad(objFunc);
         flags.start=true;
      }
      return waterAll;
   };
   /* Excution end */
   
})();
