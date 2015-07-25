
/*
  sirodorip water

  version: 3.0.05
  since  : 2011//
  update : 2013/10/10
  license:  GPL
  web    : water.sirodorip.jp
  author : goju//ironiqu
  Copyright (c) since 2011 goju//ironiqu
*/

window.water = function(){};

{
   var water = window.water;

   //variable
   var doc = document;
   var css = doc.styleSheets[0];

   //functions
   var importM = function($tgt, $methods){
      for(var n in $methods){
         if($methods.hasOwnProperty(n)){
            $tgt[n] = $methods[n];
         }
      }
   };
   var forin = function($val, $fun){
      if(typeof $val == "object"){
         for(var n in $val){
            if($val.hasOwnProperty(n))
               $fun(n, $val[n]);
         }
      }
   };
   var varIsNull = function($value){
      var ret = false;
      if($value == undefined || $value ==null || $value == "")
         ret = true;
      return ret;
   };
   


   var Standard = function(){

   };
   importM(Standard, {
      newElement:function($tag, $notWater){
         var ret = doc.createElement($tag);
         if(!$notWater)
            ret = water(ret);
         return ret;
      },
      event:function($event, $func, $tgt, $capture){
         var func = function(e){
            $func(Standard.eventArgs(e));
         };
         if($tgt == undefined){
            $tgt = doc.body || window;
         }
         if(varIsNull($capture)){
            $capture = false;
         }
         if($tgt.attachEvent != undefined){
            $tgt.attachEvent("on"+$event,func,$capture);
         }else if($tgt.addEventListener != undefined){
            $tgt.addEventListener($event,func,$capture);
         }
      },
      type:function($v){
         $v = $v || new Object();
         var cons = $v.constructor;
         var type = typeof $v;
         return {
            number : cons == Number,
            string : cons == String,
            array  : cons == Array,
            bool   : cons == Boolean,
            func   : type == "function",
            element: type == "object" && "cloneNode" in $v && !$v.hasOwnProperty("cloneNode"),
            water  : type == "object" && "naked" in $v && !$v.hasOwnProperty("naked")
         };
      },
      eventArgs:function($e){
         if(!("target" in $e))
            $e.target = window.event.srcElement || null;
         if(!("clientX" in $e)){
            var eExist = "event" in window;
            $e.clientX = eExist?event.clientX || 0:0;
            $e.clientY = eExist?event.clientY || 0:0;
         }
         return $e;
      },
      selectCancel:(function(){
         var body = null;
         var stopRet = true;
         var ret = function(){
            return stopRet;
         };
         return function($bol){
            var css = "";
            var _doc = doc;
   
            if(!varIsNull($bol) && $bol){
               css = "none";
               stopRet = false;
            }else{
               stopRet = true;
            }
            if(!varIsNull(_doc.body)){
               if(varIsNull(body)){
                  body = _doc.body;
                  body.onselectstart = ret;
                  body.onmousedown = ret;
                  body = water(body);
               }
               body.style({
                  MozUserSelect:css,
                  KhtmlUserSelect:css,
                  userSelect:css
               });
            }
         };
      })(),
      styleFix:{
         borderRadius:[
                       "WebkitBorderRadius",
                       "MozBorderRadius",
                       "MsBorderRadius",
                       "OBorderRadius"
                       ]
      },
      ajax:(function(){
         var get = "";
         var post = "";
         var request = null;
         
         var format = function($v){
            var ret = "";
            var begin = true;
            if(!varIsNull($v)){
               $v.forEach(function($v, $i){
                  if(begin) begin = false;
                  else ret += "&";
                  ret += $i + $v;
               });
            }
            return ret;
         };
         var responseState = function($fn){
            return function(){
               if(request.readyState == 4){
                  if(request.status == 200)
                     $fn(request.responseText);
                  else
                     $fn("null");
               }
            };
         };
         var getRequestObj = function(){
            var ret = true;
            if(!request){
               if("XMLHttpRequest" in window)
                  request = new window.XMLHttpRequest();
               else if("ActiveXObject" in window){
                  request = new window.ActiveXObject("Msxml2.XMLHTTP");
                  if(!request){
                     request = new window.ActiveXObject("Microsoft.XMLHTTP");
                  }
               }
            }
            if(!request){
               ret = false;
               request = null;
               alert("ajax(API) cannot be used !");
            }
            
            return ret;
         };
         var setRequestObj = function($url, $fn, $sync){
            if(!water.type($fn).func)
               $fn = function($v){doc.write($v);};
            request.open(post!=""?"POST":"GET", $url + get, $sync);
            request.onreadystatechange = responseState($fn);
            request.setRequestHeader("content-type","application/x-www-form-urlencoded");
            request.send(post);
         };
         var clear = function(){
            get = "";
            post = "";
         };
         return{
            get:function($v){
               get = format($v);
               get = get!=""?"?"+get:"";
            },
            post:function($v){
               post = format($v);
            },
            connect:function($url, $fn, $sync){
               if(getRequestObj() && !varIsNull($url) && !varIsNull($fn)){
                  $sync = $sync || false;
                  setRequestObj($url, $fn, $sync);
               }
               clear();
            }
         };
      })(),
      oldAjax:(function(){
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
   });

   var HtmlObj = function(){};
   {
      var hOP = HtmlObj.prototype;
      hOP.attribute = function($val){
         var e = this.value;
         importM(e, $val);
         return this;
      };
      hOP.addElement = function($v, $notWater){
         var type = Standard.type;
         var add = null;
         if(type($v).element)
            add = water($v);
         else if(type($v).string)
            add = Standard.newElement($v);
         else if(type($v).water)
            add = $v;

         if(add != null){
            this.value.appendChild(add.naked());
            if($notWater)
               add = add.naked();
         }
         return add;
      };
      hOP.naked = function(){
         return this.value;
      };
      hOP.write = function($value){
         var ret = this;
         if($value===undefined)
            ret = this.value.innerHTML;
         else
            this.value.innerHTML = $value;
         return ret;
      };
      hOP.style = function($value){
         var style = this.value.style;
         for(var n in $value){
            style[n] = $value[n];
         }
         return this;
      };
      hOP.getStyle = function($value){
         var style = this.value.style;
         for(var n in $value){
            $value[n] = "" +(style[n] || $value[n]);
         }
         return $value;
      };
      hOP.event = function($event, $func, $capture){
         var stan = Standard;
         var type = stan.type;
         if(type($event).string && type($func).func){
            stan.event($event, $func, this.value, $capture);
         }
         return this;
      };
      hOP.clone = function($b){
         if(varIsNull($b)) $b = false;
         return water(this.value.cloneNode($b));
      };
      hOP.childs = function(){
         return this.value.childNodes;
      };
      hOP.remove = function(){
         var that = this.value;
         that.parentNode.removeChild(that);
      };
   }

   var NumberObj = function(){

   };

   var StringObj = function(){
   };
   {
      var sOP = StringObj.prototype;
      sOP.css = function($val){
         var tgt = this.value;
         var style="";
         var _css = css;
         var styleFix = Standard.styleFix;
         var fixRet = null;
         forin($val,function($n,$p){
            if(styleFix[$n]){
               fixRet = styleFix[$n];
               fixRet.forEach(function($v){
                  style += $v.replace(/([A-Z])/g,"-$1").toLowerCase()+":"+$p+" !important;";
               });
            }
            style += $n.replace(/([A-Z])/g,"-$1").toLowerCase()+":"+$p+" !important;";
         });
         if("addRule" in _css){
            _css.addRule(tgt,style);
         }else if("insertRule" in _css){
            _css.insertRule(tgt+"{"+style+"}", "cssRules" in _css?_css.cssRules.length:0);
         }
      };
      sOP.parseNum = function(){
         var ret = 0;
         var result=(/^([+\-]?\d+(?:\.\d+)?)([%\w]+)?$/i).exec(this.value);
         if(!varIsNull(result[1])) ret=1*result[1];
         return ret;
      };
      sOP.isTag = function(){
         return doc.getElementsByTagName(this.value);
      };
      sOP.isId=function(){
         return doc.getElementById(this.value);
      };
   }

   var Unity = function(){};

   var setUnity = function($value){
      var type = Standard.type;
      if(type($value).number)
         Unity.prototype = new NumberObj();
      else if(type($value).string)
         Unity.prototype = new StringObj();
      else if(type($value).element){
         Unity.prototype = new HtmlObj();
      }
      Unity.prototype.value = $value;
   };

   water = function($value, $set){
      if(!varIsNull($value)){
         setUnity($value);
         return new Unity($value);
      }
      return function(){};
   };

   importM(water, {
      event:function($event, $func){
         var stan = Standard;
         if(stan.type($event).number){
            //time sequence
         }else if(stan.type($event).string){
            stan.event($event, $func);
         }
      },
      newElement:function($tag, $notWater){
         return Standard.newElement($tag, $notWater);
      },
      varIsNull:varIsNull,
      selectCancel:Standard.selectCancel,
      type:Standard.type,
      ajax:Standard.ajax,
      width:function(){
         return document.all?doc.body.clientWidth:window.innerWidth;
      },
      height:function(){
         return document.all?document.body.clientHeight:window.innerHeight;
      }
   });

   //
   if(!css || !css.length){
      if("createStyleSheet" in doc){
         css=document.createStyleSheet();
      }else{
         var head = doc.getElementsByTagName('head')[0] || null;
         if(!head) head = doc.createElement('head');
         var style = doc.createElement('style');
         head.appendChild(style);
         css = style.sheet;
      }
   }
   
   if(!("forEach" in Object)){
      Object.prototype.forEach=function($fn){
         for(var n in this){
            $fn(this[n],n,this);
         }
      }
   }
}