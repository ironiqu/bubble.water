/*
  bubble system // be able to move a box, over water
  water.bubble.js

  version: 3.0
  since  : 2011/09/15
  update : 2013/10/10
  web    : bbl.water.sirodorip.jp
  author : goju//ironiqu
  Copyright (c) since 2011 goju//ironiqu
*/
{

   //
   window.bubble = null;

   //variable

   //List class
   var List = function(){
      var list = [];
      this.add = function($item){
         var len = list.length;
         var bbl = $item.bubble;
         bbl.main.style({zIndex:len});
         bbl.zIndex = len;
         list[len] = $item;
      };
      this.getIndex = function($item){
         var length = list.length;

         for(var i = 0; i < length; i++){
            if(list[i] === $item){
               intTarget = i;
               break;
            }
         }
         return intTarget;
      };
      this.getList = function(){
         return list;
      };
      this.remove = function($index){
         var length = list.length;

         for(var i = $index+1; i < length; i++){
            list[i-1] = list[i];
         }
      };
      this.moveTo = function($before, $after){
         var length = list.length;
         var bTgt;
         var aTgt;
         if($before < length && $after < length){
            bTgt = list[$before];
            aTgt = list[$after];
            //
            bTgt.bubble.zIndex = $after;
            bTgt.bubble.main.style({zIndex:$after});
            aTgt.bubble.zIndex = $before;
            aTgt.bubble.main.style({zIndex:$before});
            //change
            list[$before] = aTgt;
            list[$after] = bTgt;
         }
      };
      this.getLength = function(){
         return list.length;
      };
   };
   //bubble property
   var bubbleProperty=new (function(){
      var property={};
      parse=function($v){
         var pt=[];
         if(!!$v && "split" in $v)
            pt=$v.split(",");
         return pt;
      };
      propFix=function($arr){
         var p=property;
         var regTmp;
         regTmp=(/^([0-9]+)$/i).exec($arr[0]);
         if(regTmp)
            p.width=regTmp[1];
         regTmp=(/^([0-9]+)$/i).exec($arr[1]);
         if(regTmp)
            p.height=regTmp[1];
         else
            p.height=p.width;
         for(var i=0,l=$arr.length,v;i<l;i++){
            v=$arr[i];
            if(v in p)
               p[v]=true;
         }
      };
      apply=function($tgt){
         var p=property;
         $tgt.setSize(p.width,p.height);
         $tgt.sizeFixed(p.fixed);
      };
      clear=function(){
         property={
               width:"",
               height:"",
               fixed:false
         };
      };
      return function($tgt, $v){
         clear();
         propFix(parse(new String($v)));
         apply($tgt);
      };
   })();
   //mousePosition
   var mousePosInc = new (function(){
      this.beginX = 0;
      this.beginY = 0;
      this.incX = 0;
      this.incY = 0;
      this.beginSet = function($x, $y){
         this.beginX = $x;
         this.beginY = $y;
      };
      this.nowInc = function($x, $y){
         this.incX = $x-this.beginX;
         this.incY = $y-this.beginY;
      };
   })();

   //variable
   var doc = document;
   var bblObjList = new List();
   var mainFrame = water.newElement("div").attribute({id:"mainBubbleFrameStyle"});
   var originBubble;
   var maskBubble;
   var shieldBubble;
   var maskBubbleW = water("#bubbleSizeMaskStyle");
   var shieldBubbleW = water("#bubbleShieldStyle");
   var sizingBubble = null;
   var movingBubble = null;
   var windowHeight;
   var windowWidth;

   //original element
   water.event("load",function(){
      var bblHead;
      var bblContent;
      var sizeSpot;
      var closeSpot;
      var bodyW = water(doc.body);
      var tgtPosSize = null;
      //style
      water("html, body").css({
         height:"100%"
      });
      water("#mainBubbleFrameStyle").css({
         position:"fixed",
         top:"50%",
         left:"50%",
         width:"0px",
         height:"0px",
         overflow:"visible",
         zIndex:0x7fffffff
      });
      water(".bubbleFrameStyle").css({
         border:"1px solid #000",
         background:"#6cf",
         position:"absolute",
         borderRadius:"5px"
      });
      water(".bubbleFrameContent").css({
         background:"#fff",
         width:"100%",
         zIndex:"10"
      });
      water(".bubbleFrameHead").css({
         width:"100%",
         height:"25px",
         background:"#6cf",
         zIndex:"20",
         cursor:"all-scroll",
         overflow:"hidden",
         fontSize:"12px",
         borderRadius:"5px 5px 0px 0px"
      });
      water(".bubbleFrameClose,.bubbleFrameCloseHover").css({
         position:"absolute",
         top:"0px",
         right:"0px",
         display:"block",
         background:"#a00",
         fontSize:"20px",
         color:"#ddd",
         fontWeight:"bold",
         paddingLeft:"0px",
         paddingRight:"0px",
         cursor:"pointer",
         zIndex:"100",
         height:"25px",
         overflow:"hidden",
         borderLeft:"1px solid #000",
         borderRadius:"0px 5px 0px 10px"
      });
      water(".bubbleFrameCloseHover").css({
         background:"#c00",
         color:"#fff"
      });
      water(".bubbleSizeSpot").css({
         position:"absolute",
         bottom:"-10px",
         right:"-10px",
         width:"15px",
         height:"15px",
         cursor:"nw-resize",
         zIndex:"40"
      });
      maskBubbleW.css({
         position:"absolute",
         background:"#aaf",
         opacity:"0.3",
         border:"1px solid #55a",
         zIndex:"2147483647",
         borderRadius:"5px"
      });
      shieldBubbleW.css({
         position:"fixed",
         top:"0px",
         left:"0px",
         width:"100%",
         height:"100%",
         zIndex:"2147483647"
      });

      //create original bubble
      originBubble = water.newElement("div");
      originBubble.attribute({className:"bubbleFrameStyle"});
      originBubble.style({top:"-100px",left:"-100px",width:"200px",height:"200px"});
      bblHead = originBubble.addElement("div");
      bblHead.attribute({className:"bubbleFrameHead"});
      bblContent = originBubble.addElement("div");
      bblContent.attribute({className:"bubbleFrameContent"});
      bblContent.style({height:"170px"});

      //spot
      sizeSpot = originBubble.addElement("div");
      sizeSpot.attribute({className:"bubbleSizeSpot"});
      closeSpot = originBubble.addElement("div");
      closeSpot.attribute({className:"bubbleFrameClose"});
      closeSpot.write("&#215;");

      //show
      bodyW.addElement(mainFrame);

      //mask
      maskBubble = mainFrame.addElement("div");
      maskBubble.attribute({id:"bubbleSizeMaskStyle"});
      maskBubble.style({display:"none"});
      shieldBubble = bodyW.addElement("div");
      shieldBubble.attribute({id:"bubbleShieldStyle"});
      shieldBubble.style({display:"none"});
      //delete
      //mainFrame.addElement(originBubble);

      windowWidth = water.width()/2;
      windowHeight = water.height()/2;
      
      water.event("mouseup",function(){
         if(sizingBubble != null){
            water.selectCancel(false);
            var size = maskBubble.getStyle({width:"0px",height:"0px"});
            sizingBubble.setSize(size.width, size.height, true);
            sizingBubble = null;
            tgtPosSize = null;
            maskBubble.style({display:"none",width:"0px",height:"0px"});
            shieldBubble.style({display:"none"});
         }
         if(movingBubble != null){
            water.selectCancel(false);
            movingBubble = null;
            shieldBubble.style({display:"none"});
         }
      });

      water.event("mousemove",function($e){
         if(sizingBubble != null){
            var bblMain = sizingBubble.bubble.main;
            var mouseX = $e.clientX;
            var mouseY = $e.clientY;
            if(tgtPosSize == null){
               tgtPosSize = bblMain.getStyle({top:"0px",left:"0px",width:"",height:""});
               tgtPosSize.width = water(tgtPosSize.width).parseNum();
               tgtPosSize.height = water(tgtPosSize.height).parseNum();
            }
            mousePosInc.nowInc(mouseX, mouseY);
            maskBubble.style({
               width:tgtPosSize.width+mousePosInc.incX+"px",
               height:tgtPosSize.height+mousePosInc.incY+"px",
               top:tgtPosSize.top,
               left:tgtPosSize.left
            });
         }else if(movingBubble != null){
            shieldBubble.style({display:""});
            mousePosInc.nowInc($e.clientX, $e.clientY);
            movingBubble.setPosition(mousePosInc.incX, mousePosInc.incY);
         }
      });
      water.event("resize",function(){
         windowWidth = water.width()/2;
         windowHeight = water.height()/2;
      });
      window.bubble.rexe();
   });


   //bubble frame object
   var BubbleFrameObject = function($add, $title){
      var e = originBubble.clone(true);
      var child = e.childs();
      var bbl;
      var close;
      var that;

      that = this;
      this.bubble = {
            main : e,
            title: water(child[0]),
            cont : water(child[1]),
            size : water(child[2]),
            zIndex : 0,
            minSize : false,
            maxHeight : "200px",
            maxWidth  : "200px"
      };
      bbl = this.bubble;

      bbl.title.write($title || "");
      bbl.cont.addElement($add);
      //event
      bbl.size.event("mousedown",function($e){
         shieldBubble.style({display:""});
         maskBubble.style({display:""});
         water.selectCancel(true);
         mousePosInc.beginSet($e.clientX, $e.clientY);
         sizingBubble = that;
      });
      close = water(child[3]);
      close.event("mouseover",function(){
         close.attribute({className:"bubbleFrameCloseHover"});
      });
      close.event("mouseout",function(){
         close.attribute({className:"bubbleFrameClose"});
      });
      close.event("click",function(){
         that.close();
      });
      bbl.main.event("dblclick",function(){
         if(!bbl.minSize)
            that.toMin();
         else
            that.toMax();
         bbl.minSize = !bbl.minSize;
      });
      bbl.title.event("mousedown",function($e){
         var bblStyle = that.bubble.main.naked().style;
         var self = that;
         water.selectCancel(true);
         mousePosInc.beginSet($e.clientX, $e.clientY);
         self.setPosition.x = water(bblStyle.left).parseNum();
         self.setPosition.y = water(bblStyle.top).parseNum();
         movingBubble = that;
      });
      bbl.main.event("mousedown",function(){
         that.toFront();
      });

      //show
      mainFrame.addElement(e);

      //list add & to front
      bblObjList.add(that);
   };
   {
      var bFObjP = BubbleFrameObject.prototype;
      bFObjP.hide = function(){
         this.bubble.main.style({display:"none"});
      };
      bFObjP.show = function(){
         this.bubble.main.style({display:""});
      };
      bFObjP.close = function(){
         var bbl = this.bubble;
         bblObjList.remove(bbl.zIndex);
         bbl.main.remove();
         this.closeEvent();
      };
      bFObjP.closeEvent=function(){};
      bFObjP.toMin = function(){
         var bbl = this.bubble;
         var bblMain = bbl.main;
         bbl.maxHeight = bblMain.naked().style.height;
         bbl.maxWidth = bblMain.naked().style.width;
         bblMain.style({height:"25px",width:"200px",overflow:"hidden"});
      };
      bFObjP.toMax = function(){
         var bbl = this.bubble;
         this.setSize(bbl.maxWidth,bbl.maxHeight,true);
         bbl.main.style({overflow:"visible"});
      };
      bFObjP.toFront = function(){
         var len = bblObjList.getLength();
         var bbl = this.bubble;
         var nowIndex = bbl.zIndex;
         //not front
         if(nowIndex < len-1){
            for(var i=nowIndex+1; i<len; i++){
               bblObjList.moveTo(i-1, i);
            }
         }
      };
      bFObjP.title = function($title){
         var ret;
         if(water.varIsNull($title))
            ret = this.bubble.title.write();
         else
            this.bubble.title.write((ret = $title));
         return ret;
      };
      bFObjP.sizeFixed=function($b){
         this.bubble.size.style({display:$b?"none":"block"});
      };
      bFObjP.setPosition = (function(){
         var that = function(){};
         that = function($x, $y){
            var x = that.x;
            var y = that.y;
            var wW = windowWidth;
            var wH = windowHeight;
            x = varIsNull($x)?x:x+$x;
            y = varIsNull($y)?y:y+$y;
            x = x< -wW?-wW:x;
            y = y< -wH?-wH:y;
            x = x> (wW-=200)?wW:x;
            y = y> (wH-=50)?wH:y;
            this.bubble.main.style({left:x+"px",top:y+"px"});
         };
         that.x = -100;
         that.y = -100;
         return that;
      })();
      bFObjP.setSize = function($x, $y, $posFlag){
         var _w = water;
         var type = _w.type;
         var bbl = this.bubble;
         var bblMain = bbl.main;
         var bblMainStyle = bblMain.getStyle({width:"",height:""});
         var x = _w(bblMainStyle.width).parseNum();
         var y = _w(bblMainStyle.height).parseNum();

         if(type($x).string)
            $x = _w($x).parseNum();
         else if(!type($x).number)
            $x = x;
         if(type($y).string)
            $y = _w($y).parseNum();
         else if(!type($y).number)
            $y = y;
         //under200 over1000
         $x<200?$x=200:$x>1000?$x=1000:null;
         $y<200?$y=200:$y>1000?$y=1000:null;

         if(!$posFlag){
            bblMain.style({top:(-$y/2)+"px",left:(-$x/2)+"px"});
         }

         bblMain.style({width:$x+"px",height:$y+"px"});
         bbl.cont.style({height:($y-30)+"px"});
      };
   }



   //bubble main
   var BubbleMain = function($this){
   };
   //
   {
      var bMainP = BubbleMain.prototype;
      //open url
      bMainP.openURL = function($strUrl, $strTitle){
         //iframe
         var e = water.newElement("iframe");
         e.naked().src = $strUrl;
         e.attribute({border:"0"});
         e.style({width:"100%",height:"100%",overflow:"auto",border:"0px solid #000"});
         return new BubbleFrameObject(e, $strTitle);
      };
      //open img url
      bMainP.openIMG = function($strUrl, $strTitle){
         var e = water.newElement("div");
         var img;
         
         img = e.addElement("img");
         img.naked().src = $strUrl;
         img.style({width:"100%"});
         e.style({width:"100%",height:"100%",overflow:"auto"});
         return new BubbleFrameObject(e, $strTitle);
      };
      //html text load
      bMainP.loadHTML = function($strUrl, $strTitle){
         //Ajax load
         var e = water.newElement("div");
         water.ajax.connect($strUrl, function($v){
            e.write($v);
         });
         e.style({width:"100%",height:"100%",overflow:"auto"});
         return new BubbleFrameObject(e, $strTitle);
      };
      //min size
      bMainP.allMin = function(){
      };
      //max size
      bMainP.allMax = function(){
      };
      bMainP.hide = function(){
         mainFrame.style({display:"none"});
      };
      bMainP.show = function(){
         mainFrame.style({display:""});
      };
      //re execute
      bMainP.rexe=function(){
         var aTags;
         var aTagsFn;
         aTags = water("a").isTag();
         aTagsFn=function($p){
            return function($e){
               var e = $e.target;
               var domain = e.href.match(/^[httpsfile]+:\/{2,3}([0-9a-z\.\-:]+?):?[0-9]*?\//i)[1];
               var bbl;
               if(domain != location.hostname)
                  bbl=window.bubble.openURL(e.href, e.title || e.href);
               else
                  bbl=window.bubble.loadHTML(e.href, e.title || e.href);
               bubbleProperty(bbl,$p);
               return false;
            };
         };
         for(var i=0,l=aTags.length,e,tgt,pat;i<l;i++){
            e=aTags[i];
            tgt=e.target;
            if(tgt=="")continue;
            pat=(/^(bubble)(\[([0-9a-z\,]*)\])?$/i).exec(tgt);
            if(pat && pat[1]=="bubble"){
               e.target = "";
               e.onclick = aTagsFn(pat[3]||"");
            }
         }
      };
   }

   //set
   window.bubble = new BubbleMain();
}