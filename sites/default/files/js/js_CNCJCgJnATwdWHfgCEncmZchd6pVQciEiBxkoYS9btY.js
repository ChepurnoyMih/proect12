/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/contrib/bootstrap/js/drupal.bootstrap.js. */
(function(_,$,Drupal,drupalSettings){'use strict';var Bootstrap={processedOnce:{},settings:drupalSettings.bootstrap||{}};Bootstrap.checkPlain=function(str){return str&&Drupal.checkPlain(str)||'';};Bootstrap.createPlugin=function(id,plugin,noConflict){if($.fn[id]!==void 0){return this.fatal('Specified jQuery plugin identifier already exists: @id. Use Drupal.bootstrap.replacePlugin() instead.',{'@id':id});}
if(typeof plugin!=='function'){return this.fatal('You must provide a constructor function to create a jQuery plugin "@id": @plugin',{'@id':id,'@plugin':plugin});}
this.pluginNoConflict(id,plugin,noConflict);$.fn[id]=plugin;};Bootstrap.diffObjects=function(objects){var args=Array.prototype.slice.call(arguments);return _.pick(args[0],_.difference.apply(_,_.map(args,function(obj){return Object.keys(obj);})));};Bootstrap.eventMap={Event:/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,MouseEvent:/^(?:click|dblclick|mouse(?:down|enter|leave|up|over|move|out))$/,KeyboardEvent:/^(?:key(?:down|press|up))$/,TouchEvent:/^(?:touch(?:start|end|move|cancel))$/};Bootstrap.extendPlugin=function(id,callback){if(typeof $.fn[id]!=='function'){return this.fatal('Specified jQuery plugin identifier does not exist: @id',{'@id':id});}
if(typeof callback!=='function'){return this.fatal('You must provide a callback function to extend the jQuery plugin "@id": @callback',{'@id':id,'@callback':callback});}
var constructor=$.fn[id]&&$.fn[id].Constructor||$.fn[id];var plugin=callback.apply(constructor,[this.settings]);if(!$.isPlainObject(plugin)){return this.fatal('Returned value from callback is not a plain object that can be used to extend the jQuery plugin "@id": @obj',{'@obj':plugin});}
this.wrapPluginConstructor(constructor,plugin,true);return $.fn[id];};Bootstrap.superWrapper=function(parent,fn){return function(){var previousSuper=this.super;this.super=parent;var ret=fn.apply(this,arguments);if(previousSuper){this.super=previousSuper;}
else{delete this.super;}
return ret;};};Bootstrap.fatal=function(message,args){if(this.settings.dev&&console.warn){for(var name in args){if(args.hasOwnProperty(name)&&typeof args[name]==='object'){args[name]=JSON.stringify(args[name]);}}
Drupal.throwError(new Error(Drupal.formatString(message,args)));}
return false;};Bootstrap.intersectObjects=function(objects){var args=Array.prototype.slice.call(arguments);return _.pick(args[0],_.intersection.apply(_,_.map(args,function(obj){return Object.keys(obj);})));};Bootstrap.normalizeObject=function(obj){if(!$.isPlainObject(obj)){return obj;}
for(var k in obj){if(typeof obj[k]==='string'){if(obj[k]==='true'){obj[k]=true;}
else if(obj[k]==='false'){obj[k]=false;}
else if(obj[k].match(/^[\d-.]$/)){obj[k]=parseFloat(obj[k]);}}
else if($.isPlainObject(obj[k])){obj[k]=Bootstrap.normalizeObject(obj[k]);}}
return obj;};Bootstrap.once=function(id,callback){if(this.processedOnce[id]){return this;}
callback.call(this,this.settings);this.processedOnce[id]=true;return this;};Bootstrap.option=function(key,value){var options=$.isPlainObject(key)?$.extend({},key):{};if(arguments.length===0){return $.extend({},this.options);}
if(typeof key==="string"){var parts=key.split('.');key=parts.shift();var obj=options;if(parts.length){for(var i=0;i<parts.length-1;i++){obj[parts[i]]=obj[parts[i]]||{};obj=obj[parts[i]];}
key=parts.pop();}
if(arguments.length===1){return obj[key]===void 0?null:obj[key];}
obj[key]=value;}
$.extend(true,this.options,options);};Bootstrap.pluginNoConflict=function(id,plugin,noConflict){if(plugin.noConflict===void 0&&(noConflict===void 0||noConflict)){var old=$.fn[id];plugin.noConflict=function(){$.fn[id]=old;return this;};}};Bootstrap.relayEvent=function(target,name,stopPropagation){return function(e){if(stopPropagation===void 0||stopPropagation){e.stopPropagation();}
var $target=$(target);var parts=name.split('.').filter(Boolean);var type=parts.shift();e.target=$target[0];e.currentTarget=$target[0];e.namespace=parts.join('.');e.type=type;$target.trigger(e);};};Bootstrap.replacePlugin=function(id,callback,noConflict){if(typeof $.fn[id]!=='function'){return this.fatal('Specified jQuery plugin identifier does not exist: @id',{'@id':id});}
if(typeof callback!=='function'){return this.fatal('You must provide a valid callback function to replace a jQuery plugin: @callback',{'@callback':callback});}
var constructor=$.fn[id]&&$.fn[id].Constructor||$.fn[id];var plugin=callback.apply(constructor,[this.settings]);if(typeof plugin!=='function'){return this.fatal('Returned value from callback is not a usable function to replace a jQuery plugin "@id": @plugin',{'@id':id,'@plugin':plugin});}
this.wrapPluginConstructor(constructor,plugin);this.pluginNoConflict(id,plugin,noConflict);$.fn[id]=plugin;};Bootstrap.simulate=function(element,type,options){var ret=true;if(element instanceof $){element.each(function(){if(!Bootstrap.simulate(this,type,options)){ret=false;}});return ret;}
if(!(element instanceof HTMLElement)){this.fatal('Passed element must be an instance of HTMLElement, got "@type" instead.',{'@type':typeof element,});}
if(typeof $.simulate==='function'){new $.simulate(element,type,options);return true;}
var event;var ctor;var types=[].concat(type);for(var i=0,l=types.length;i<l;i++){type=types[i];for(var name in this.eventMap){if(this.eventMap[name].test(type)){ctor=name;break;}}
if(!ctor){throw new SyntaxError('Only rudimentary HTMLEvents, KeyboardEvents and MouseEvents are supported: '+type);}
var opts={bubbles:true,cancelable:true};if(ctor==='KeyboardEvent'||ctor==='MouseEvent'){$.extend(opts,{ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1});}
if(ctor==='MouseEvent'){$.extend(opts,{button:0,pointerX:0,pointerY:0,view:window});}
if(options){$.extend(opts,options);}
if(typeof window[ctor]==='function'){event=new window[ctor](type,opts);if(!element.dispatchEvent(event)){ret=false;}}
else if(document.createEvent){event=document.createEvent(ctor);event.initEvent(type,opts.bubbles,opts.cancelable);if(!element.dispatchEvent(event)){ret=false;}}
else if(typeof element.fireEvent==='function'){event=$.extend(document.createEventObject(),opts);if(!element.fireEvent('on'+type,event)){ret=false;}}
else if(typeof element[type]){element[type]();}}
return ret;};Bootstrap.stripHtml=function(html){if(html instanceof $){html=html.html();}
else if(html instanceof Element){html=html.innerHTML;}
var tmp=document.createElement('DIV');tmp.innerHTML=html;return(tmp.textContent||tmp.innerText||'').replace(/^[\s\n\t]*|[\s\n\t]*$/,'');};Bootstrap.unsupported=function(type,name,value){Bootstrap.warn('Unsupported by Drupal Bootstrap: (@type) @name -> @value',{'@type':type,'@name':name,'@value':typeof value==='object'?JSON.stringify(value):value});};Bootstrap.warn=function(message,args){if(this.settings.dev&&console.warn){console.warn(Drupal.formatString(message,args));}};Bootstrap.wrapPluginConstructor=function(constructor,plugin,extend){var proto=constructor.prototype;var option=this.option;if(proto.option===void(0)){proto.option=function(){return option.apply(this,arguments);};}
if(extend){if(plugin.prototype!==void 0){for(var key in plugin.prototype){if(!plugin.prototype.hasOwnProperty(key))continue;var value=plugin.prototype[key];if(typeof value==='function'){proto[key]=this.superWrapper(proto[key]||function(){},value);}
else{proto[key]=$.isPlainObject(value)?$.extend(true,{},proto[key],value):value;}}}
delete plugin.prototype;for(key in plugin){if(!plugin.hasOwnProperty(key))continue;value=plugin[key];if(typeof value==='function'){constructor[key]=this.superWrapper(constructor[key]||function(){},value);}
else{constructor[key]=$.isPlainObject(value)?$.extend(true,{},constructor[key],value):value;}}}};Drupal.bootstrap=Drupal.bootstrap||Bootstrap;})(window._,window.jQuery,window.Drupal,window.drupalSettings);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/contrib/bootstrap/js/drupal.bootstrap.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/contrib/bootstrap/js/attributes.js. */
(function($,_){var Attributes=function(attributes){this.data={};this.data['class']=[];this.merge(attributes);};Attributes.prototype.toString=function(){var output='';var name,value;var checkPlain=function(str){return str&&str.toString().replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')||'';};var data=this.getData();for(name in data){if(!data.hasOwnProperty(name))continue;value=data[name];if(_.isFunction(value))value=value();if(_.isObject(value))value=_.values(value);if(_.isArray(value))value=value.join(' ');output+=' '+checkPlain(name)+'="'+checkPlain(value)+'"';}
return output;};Attributes.prototype.toPlainObject=function(){var object={};var name,value;var data=this.getData();for(name in data){if(!data.hasOwnProperty(name))continue;value=data[name];if(_.isFunction(value))value=value();if(_.isObject(value))value=_.values(value);if(_.isArray(value))value=value.join(' ');object[name]=value;}
return object;};Attributes.prototype.addClass=function(value){var args=Array.prototype.slice.call(arguments);this.data['class']=this.sanitizeClasses(this.data['class'].concat(args));return this;};Attributes.prototype.exists=function(name){return this.data[name]!==void(0)&&this.data[name]!==null;};Attributes.prototype.get=function(name,defaultValue){if(!this.exists(name))this.data[name]=defaultValue;return this.data[name];};Attributes.prototype.getData=function(){return _.extend({},this.data);};Attributes.prototype.getClasses=function(){return this.get('class',[]);};Attributes.prototype.hasClass=function(className){className=this.sanitizeClasses(Array.prototype.slice.call(arguments));var classes=this.getClasses();for(var i=0,l=className.length;i<l;i++){if(_.indexOf(classes,className[i])===-1){return false;}}
return true;};Attributes.prototype.merge=function(object,recursive){if(!object){return this;}
if(object instanceof $){object=object[0];}
if(object instanceof Node){object=Array.prototype.slice.call(object.attributes).reduce(function(attributes,attribute){attributes[attribute.name]=attribute.value;return attributes;},{});}
else if(object instanceof Attributes){object=object.getData();}
else{object=_.extend({},object);}
if(!$.isPlainObject(object)){setTimeout(function(){throw new Error('Passed object is not supported: '+object);});return this;}
if(object&&object['class']!==void 0){this.addClass(object['class']);delete object['class'];}
if(recursive===void 0||recursive){this.data=$.extend(true,{},this.data,object);}
else{this.data=$.extend({},this.data,object);}
return this;};Attributes.prototype.remove=function(name){if(this.exists(name))delete this.data[name];return this;};Attributes.prototype.removeClass=function(className){var remove=this.sanitizeClasses(Array.prototype.slice.apply(arguments));this.data['class']=_.without(this.getClasses(),remove);return this;};Attributes.prototype.replaceClass=function(oldValue,newValue){var classes=this.getClasses();var i=_.indexOf(this.sanitizeClasses(oldValue),classes);if(i>=0){classes[i]=newValue;this.set('class',classes);}
return this;};Attributes.prototype.sanitizeClasses=function(classes){return _.chain(Array.prototype.slice.call(arguments)).flatten().map(function(string){return string.split(' ');}).flatten().filter().map(function(value){return Attributes.cleanClass(value);}).uniq().value();};Attributes.prototype.set=function(name,value){var obj=$.isPlainObject(name)?name:{};if(typeof name==='string'){obj[name]=value;}
return this.merge(obj);};Attributes.cleanClass=function(identifier,filter){filter=filter||{' ':'-','_':'-','/':'-','[':'-',']':''};identifier=identifier.toLowerCase();if(filter['__']===void 0){identifier=identifier.replace('__','#DOUBLE_UNDERSCORE#');}
identifier=identifier.replace(Object.keys(filter),Object.keys(filter).map(function(key){return filter[key];}));if(filter['__']===void 0){identifier=identifier.replace('#DOUBLE_UNDERSCORE#','__');}
identifier=identifier.replace(/[^\u002D\u0030-\u0039\u0041-\u005A\u005F\u0061-\u007A\u00A1-\uFFFF]/g,'');identifier=identifier.replace(['/^[0-9]/','/^(-[0-9])|^(--)/'],['_','__']);return identifier;};Attributes.create=function(attributes){return new Attributes(attributes);};window.Attributes=Attributes;})(window.jQuery,window._);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/contrib/bootstrap/js/attributes.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/contrib/bootstrap/js/theme.js. */
(function($,Drupal,Bootstrap,Attributes){if(!Drupal.icon)Drupal.icon={bundles:{}};if(!Drupal.theme.icon||Drupal.theme.prototype.icon){$.extend(Drupal.theme,{icon:function(bundle,icon,attributes){if(!Drupal.icon.bundles[bundle])return'';attributes=Attributes.create(attributes).addClass('icon').set('aria-hidden','true');icon=Drupal.icon.bundles[bundle](icon,attributes);return'<span'+attributes+'></span>';}});}
Drupal.icon.bundles.bootstrap=function(icon,attributes){attributes.addClass(['glyphicon','glyphicon-'+icon]);};$.extend(Drupal.theme,{ajaxThrobber:function(){return Drupal.theme('bootstrapIcon','refresh',{'class':['ajax-throbber','glyphicon-spin']});},button:function(attributes){attributes=Attributes.create(attributes).addClass('btn');var context=attributes.get('context','default');var label=attributes.get('value','');attributes.remove('context').remove('value');if(!attributes.hasClass(['btn-default','btn-primary','btn-success','btn-info','btn-warning','btn-danger','btn-link'])){attributes.addClass('btn-'+Bootstrap.checkPlain(context));}
if(!attributes.exists('type')){attributes.set('type',attributes.hasClass('form-submit')?'submit':'button');}
return'<button'+attributes+'>'+label+'</button>';},btn:function(attributes){return Drupal.theme('button',attributes);},'btn-block':function(attributes){return Drupal.theme('button',Attributes.create(attributes).addClass('btn-block'));},'btn-lg':function(attributes){return Drupal.theme('button',Attributes.create(attributes).addClass('btn-lg'));},'btn-sm':function(attributes){return Drupal.theme('button',Attributes.create(attributes).addClass('btn-sm'));},'btn-xs':function(attributes){return Drupal.theme('button',Attributes.create(attributes).addClass('btn-xs'));},bootstrapIcon:function(name,attributes){return Drupal.theme('icon','bootstrap',name,attributes);}});})(window.jQuery,window.Drupal,window.Drupal.bootstrap,window.Attributes);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/contrib/bootstrap/js/theme.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/js/global.js. */
(function($,Drupal,window){Drupal.behaviors.goalScripts={data:{scriptsAppended:false,},attach:function(context,settings){var $window=$(window);$window.svgLogosMap=["js","jQuery","cucumber","webpack","lodash","amazon","git","react","yandex","cordova","php","html5","debian","backbone","docker","analytics","css3","memcached","nodejs","webgl","bash","apache","varnish","mysql","adwords","centos","nginx","mariadb","ansible","ubuntu","drupal","python","less","apc",];var that=this;$(document,context).once('global_scroll').each(function(){$window.scroll(function(){if(!that.scriptsAppended){that.scriptsAppended=true;setTimeout(function(){var snap=document.createElement("script");snap.setAttribute("src","/themes/custom/bootstrap_dc/js/svglogos/snap.svg-min.js");document.body.appendChild(snap);var svgScript=document.createElement("script");svgScript.setAttribute("src","/themes/custom/bootstrap_dc/js/svglogos/svg.logos-min.js");document.body.appendChild(svgScript);},1000);}});});}};})(jQuery,Drupal,window);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/js/global.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/affix.js. */
+function($){'use strict';var Affix=function(element,options){this.options=$.extend({},Affix.DEFAULTS,options)
this.$target=$(this.options.target).on('scroll.bs.affix.data-api',$.proxy(this.checkPosition,this)).on('click.bs.affix.data-api',$.proxy(this.checkPositionWithEventLoop,this))
this.$element=$(element)
this.affixed=null
this.unpin=null
this.pinnedOffset=null
this.checkPosition()}
Affix.VERSION='3.3.6'
Affix.RESET='affix affix-top affix-bottom'
Affix.DEFAULTS={offset:0,target:window}
Affix.prototype.getState=function(scrollHeight,height,offsetTop,offsetBottom){var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
var targetHeight=this.$target.height()
if(offsetTop!=null&&this.affixed=='top')return scrollTop<offsetTop?'top':false
if(this.affixed=='bottom'){if(offsetTop!=null)return(scrollTop+this.unpin<=position.top)?false:'bottom'
return(scrollTop+targetHeight<=scrollHeight-offsetBottom)?false:'bottom'}
var initializing=this.affixed==null
var colliderTop=initializing?scrollTop:position.top
var colliderHeight=initializing?targetHeight:height
if(offsetTop!=null&&scrollTop<=offsetTop)return'top'
if(offsetBottom!=null&&(colliderTop+colliderHeight>=scrollHeight-offsetBottom))return'bottom'
return false}
Affix.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset
this.$element.removeClass(Affix.RESET).addClass('affix')
var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
return(this.pinnedOffset=position.top-scrollTop)}
Affix.prototype.checkPositionWithEventLoop=function(){setTimeout($.proxy(this.checkPosition,this),1)}
Affix.prototype.checkPosition=function(){if(!this.$element.is(':visible'))return
var height=this.$element.height()
var offset=this.options.offset
var offsetTop=offset.top
var offsetBottom=offset.bottom
var scrollHeight=Math.max($(document).height(),$(document.body).height())
if(typeof offset!='object')offsetBottom=offsetTop=offset
if(typeof offsetTop=='function')offsetTop=offset.top(this.$element)
if(typeof offsetBottom=='function')offsetBottom=offset.bottom(this.$element)
var affix=this.getState(scrollHeight,height,offsetTop,offsetBottom)
if(this.affixed!=affix){if(this.unpin!=null)this.$element.css('top','')
var affixType='affix'+(affix?'-'+affix:'')
var e=$.Event(affixType+'.bs.affix')
this.$element.trigger(e)
if(e.isDefaultPrevented())return
this.affixed=affix
this.unpin=affix=='bottom'?this.getPinnedOffset():null
this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix','affixed')+'.bs.affix')}
if(affix=='bottom'){this.$element.offset({top:scrollHeight-height-offsetBottom})}}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.affix')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.affix',(data=new Affix(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.affix
$.fn.affix=Plugin
$.fn.affix.Constructor=Affix
$.fn.affix.noConflict=function(){$.fn.affix=old
return this}
$(window).on('load',function(){$('[data-spy="affix"]').each(function(){var $spy=$(this)
var data=$spy.data()
data.offset=data.offset||{}
if(data.offsetBottom!=null)data.offset.bottom=data.offsetBottom
if(data.offsetTop!=null)data.offset.top=data.offsetTop
Plugin.call($spy,data)})})}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/affix.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/alert.js. */
+function($){'use strict';var dismiss='[data-dismiss="alert"]'
var Alert=function(el){$(el).on('click',dismiss,this.close)}
Alert.VERSION='3.3.6'
Alert.TRANSITION_DURATION=150
Alert.prototype.close=function(e){var $this=$(this)
var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=$(selector)
if(e)e.preventDefault()
if(!$parent.length){$parent=$this.closest('.alert')}
$parent.trigger(e=$.Event('close.bs.alert'))
if(e.isDefaultPrevented())return
$parent.removeClass('in')
function removeElement(){$parent.detach().trigger('closed.bs.alert').remove()}
$.support.transition&&$parent.hasClass('fade')?$parent.one('bsTransitionEnd',removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION):removeElement()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.alert')
if(!data)$this.data('bs.alert',(data=new Alert(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.alert
$.fn.alert=Plugin
$.fn.alert.Constructor=Alert
$.fn.alert.noConflict=function(){$.fn.alert=old
return this}
$(document).on('click.bs.alert.data-api',dismiss,Alert.prototype.close)}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/alert.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/button.js. */
+function($){'use strict';var Button=function(element,options){this.$element=$(element)
this.options=$.extend({},Button.DEFAULTS,options)
this.isLoading=false}
Button.VERSION='3.3.6'
Button.DEFAULTS={loadingText:'loading...'}
Button.prototype.setState=function(state){var d='disabled'
var $el=this.$element
var val=$el.is('input')?'val':'html'
var data=$el.data()
state+='Text'
if(data.resetText==null)$el.data('resetText',$el[val]())
setTimeout($.proxy(function(){$el[val](data[state]==null?this.options[state]:data[state])
if(state=='loadingText'){this.isLoading=true
$el.addClass(d).attr(d,d)}else if(this.isLoading){this.isLoading=false
$el.removeClass(d).removeAttr(d)}},this),0)}
Button.prototype.toggle=function(){var changed=true
var $parent=this.$element.closest('[data-toggle="buttons"]')
if($parent.length){var $input=this.$element.find('input')
if($input.prop('type')=='radio'){if($input.prop('checked'))changed=false
$parent.find('.active').removeClass('active')
this.$element.addClass('active')}else if($input.prop('type')=='checkbox'){if(($input.prop('checked'))!==this.$element.hasClass('active'))changed=false
this.$element.toggleClass('active')}
$input.prop('checked',this.$element.hasClass('active'))
if(changed)$input.trigger('change')}else{this.$element.attr('aria-pressed',!this.$element.hasClass('active'))
this.$element.toggleClass('active')}}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.button')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.button',(data=new Button(this,options)))
if(option=='toggle')data.toggle()
else if(option)data.setState(option)})}
var old=$.fn.button
$.fn.button=Plugin
$.fn.button.Constructor=Button
$.fn.button.noConflict=function(){$.fn.button=old
return this}
$(document).on('click.bs.button.data-api','[data-toggle^="button"]',function(e){var $btn=$(e.target)
if(!$btn.hasClass('btn'))$btn=$btn.closest('.btn')
Plugin.call($btn,'toggle')
if(!($(e.target).is('input[type="radio"]')||$(e.target).is('input[type="checkbox"]')))e.preventDefault()}).on('focus.bs.button.data-api blur.bs.button.data-api','[data-toggle^="button"]',function(e){$(e.target).closest('.btn').toggleClass('focus',/^focus(in)?$/.test(e.type))})}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/button.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/carousel.js. */
+function($){'use strict';var Carousel=function(element,options){this.$element=$(element)
this.$indicators=this.$element.find('.carousel-indicators')
this.options=options
this.paused=null
this.sliding=null
this.interval=null
this.$active=null
this.$items=null
this.options.keyboard&&this.$element.on('keydown.bs.carousel',$.proxy(this.keydown,this))
this.options.pause=='hover'&&!('ontouchstart'in document.documentElement)&&this.$element.on('mouseenter.bs.carousel',$.proxy(this.pause,this)).on('mouseleave.bs.carousel',$.proxy(this.cycle,this))}
Carousel.VERSION='3.3.6'
Carousel.TRANSITION_DURATION=600
Carousel.DEFAULTS={interval:5000,pause:'hover',wrap:true,keyboard:true}
Carousel.prototype.keydown=function(e){if(/input|textarea/i.test(e.target.tagName))return
switch(e.which){case 37:this.prev();break
case 39:this.next();break
default:return}
e.preventDefault()}
Carousel.prototype.cycle=function(e){e||(this.paused=false)
this.interval&&clearInterval(this.interval)
this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval))
return this}
Carousel.prototype.getItemIndex=function(item){this.$items=item.parent().children('.item')
return this.$items.index(item||this.$active)}
Carousel.prototype.getItemForDirection=function(direction,active){var activeIndex=this.getItemIndex(active)
var willWrap=(direction=='prev'&&activeIndex===0)||(direction=='next'&&activeIndex==(this.$items.length-1))
if(willWrap&&!this.options.wrap)return active
var delta=direction=='prev'?-1:1
var itemIndex=(activeIndex+delta)%this.$items.length
return this.$items.eq(itemIndex)}
Carousel.prototype.to=function(pos){var that=this
var activeIndex=this.getItemIndex(this.$active=this.$element.find('.item.active'))
if(pos>(this.$items.length-1)||pos<0)return
if(this.sliding)return this.$element.one('slid.bs.carousel',function(){that.to(pos)})
if(activeIndex==pos)return this.pause().cycle()
return this.slide(pos>activeIndex?'next':'prev',this.$items.eq(pos))}
Carousel.prototype.pause=function(e){e||(this.paused=true)
if(this.$element.find('.next, .prev').length&&$.support.transition){this.$element.trigger($.support.transition.end)
this.cycle(true)}
this.interval=clearInterval(this.interval)
return this}
Carousel.prototype.next=function(){if(this.sliding)return
return this.slide('next')}
Carousel.prototype.prev=function(){if(this.sliding)return
return this.slide('prev')}
Carousel.prototype.slide=function(type,next){var $active=this.$element.find('.item.active')
var $next=next||this.getItemForDirection(type,$active)
var isCycling=this.interval
var direction=type=='next'?'left':'right'
var that=this
if($next.hasClass('active'))return(this.sliding=false)
var relatedTarget=$next[0]
var slideEvent=$.Event('slide.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
this.$element.trigger(slideEvent)
if(slideEvent.isDefaultPrevented())return
this.sliding=true
isCycling&&this.pause()
if(this.$indicators.length){this.$indicators.find('.active').removeClass('active')
var $nextIndicator=$(this.$indicators.children()[this.getItemIndex($next)])
$nextIndicator&&$nextIndicator.addClass('active')}
var slidEvent=$.Event('slid.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
if($.support.transition&&this.$element.hasClass('slide')){$next.addClass(type)
$next[0].offsetWidth
$active.addClass(direction)
$next.addClass(direction)
$active.one('bsTransitionEnd',function(){$next.removeClass([type,direction].join(' ')).addClass('active')
$active.removeClass(['active',direction].join(' '))
that.sliding=false
setTimeout(function(){that.$element.trigger(slidEvent)},0)}).emulateTransitionEnd(Carousel.TRANSITION_DURATION)}else{$active.removeClass('active')
$next.addClass('active')
this.sliding=false
this.$element.trigger(slidEvent)}
isCycling&&this.cycle()
return this}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.carousel')
var options=$.extend({},Carousel.DEFAULTS,$this.data(),typeof option=='object'&&option)
var action=typeof option=='string'?option:options.slide
if(!data)$this.data('bs.carousel',(data=new Carousel(this,options)))
if(typeof option=='number')data.to(option)
else if(action)data[action]()
else if(options.interval)data.pause().cycle()})}
var old=$.fn.carousel
$.fn.carousel=Plugin
$.fn.carousel.Constructor=Carousel
$.fn.carousel.noConflict=function(){$.fn.carousel=old
return this}
var clickHandler=function(e){var href
var $this=$(this)
var $target=$($this.attr('data-target')||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,''))
if(!$target.hasClass('carousel'))return
var options=$.extend({},$target.data(),$this.data())
var slideIndex=$this.attr('data-slide-to')
if(slideIndex)options.interval=false
Plugin.call($target,options)
if(slideIndex){$target.data('bs.carousel').to(slideIndex)}
e.preventDefault()}
$(document).on('click.bs.carousel.data-api','[data-slide]',clickHandler).on('click.bs.carousel.data-api','[data-slide-to]',clickHandler)
$(window).on('load',function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this)
Plugin.call($carousel,$carousel.data())})})}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/carousel.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/collapse.js. */
+function($){'use strict';var Collapse=function(element,options){this.$element=$(element)
this.options=$.extend({},Collapse.DEFAULTS,options)
this.$trigger=$('[data-toggle="collapse"][href="#'+element.id+'"],'+'[data-toggle="collapse"][data-target="#'+element.id+'"]')
this.transitioning=null
if(this.options.parent){this.$parent=this.getParent()}else{this.addAriaAndCollapsedClass(this.$element,this.$trigger)}
if(this.options.toggle)this.toggle()}
Collapse.VERSION='3.3.6'
Collapse.TRANSITION_DURATION=350
Collapse.DEFAULTS={toggle:true}
Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width')
return hasWidth?'width':'height'}
Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return
var activesData
var actives=this.$parent&&this.$parent.children('.panel').children('.in, .collapsing')
if(actives&&actives.length){activesData=actives.data('bs.collapse')
if(activesData&&activesData.transitioning)return}
var startEvent=$.Event('show.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
if(actives&&actives.length){Plugin.call(actives,'hide')
activesData||actives.data('bs.collapse',null)}
var dimension=this.dimension()
this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded',true)
this.$trigger.removeClass('collapsed').attr('aria-expanded',true)
this.transitioning=1
var complete=function(){this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('')
this.transitioning=0
this.$element.trigger('shown.bs.collapse')}
if(!$.support.transition)return complete.call(this)
var scrollSize=$.camelCase(['scroll',dimension].join('-'))
this.$element.one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])}
Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return
var startEvent=$.Event('hide.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var dimension=this.dimension()
this.$element[dimension](this.$element[dimension]())[0].offsetHeight
this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded',false)
this.$trigger.addClass('collapsed').attr('aria-expanded',false)
this.transitioning=1
var complete=function(){this.transitioning=0
this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse')}
if(!$.support.transition)return complete.call(this)
this.$element
[dimension](0).one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)}
Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']()}
Collapse.prototype.getParent=function(){return $(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each($.proxy(function(i,element){var $element=$(element)
this.addAriaAndCollapsedClass(getTargetFromTrigger($element),$element)},this)).end()}
Collapse.prototype.addAriaAndCollapsedClass=function($element,$trigger){var isOpen=$element.hasClass('in')
$element.attr('aria-expanded',isOpen)
$trigger.toggleClass('collapsed',!isOpen).attr('aria-expanded',isOpen)}
function getTargetFromTrigger($trigger){var href
var target=$trigger.attr('data-target')||(href=$trigger.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
return $(target)}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.collapse')
var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data&&options.toggle&&/show|hide/.test(option))options.toggle=false
if(!data)$this.data('bs.collapse',(data=new Collapse(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.collapse
$.fn.collapse=Plugin
$.fn.collapse.Constructor=Collapse
$.fn.collapse.noConflict=function(){$.fn.collapse=old
return this}
$(document).on('click.bs.collapse.data-api','[data-toggle="collapse"]',function(e){var $this=$(this)
if(!$this.attr('data-target'))e.preventDefault()
var $target=getTargetFromTrigger($this)
var data=$target.data('bs.collapse')
var option=data?'toggle':$this.data()
Plugin.call($target,option)})}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/collapse.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/dropdown.js. */
+function($){'use strict';var backdrop='.dropdown-backdrop'
var toggle='[data-toggle="dropdown"]'
var Dropdown=function(element){$(element).on('click.bs.dropdown',this.toggle)}
Dropdown.VERSION='3.3.6'
function getParent($this){var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&/#[A-Za-z]/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=selector&&$(selector)
return $parent&&$parent.length?$parent:$this.parent()}
function clearMenus(e){if(e&&e.which===3)return
$(backdrop).remove()
$(toggle).each(function(){var $this=$(this)
var $parent=getParent($this)
var relatedTarget={relatedTarget:this}
if(!$parent.hasClass('open'))return
if(e&&e.type=='click'&&/input|textarea/i.test(e.target.tagName)&&$.contains($parent[0],e.target))return
$parent.trigger(e=$.Event('hide.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.attr('aria-expanded','false')
$parent.removeClass('open').trigger($.Event('hidden.bs.dropdown',relatedTarget))})}
Dropdown.prototype.toggle=function(e){var $this=$(this)
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
clearMenus()
if(!isActive){if('ontouchstart'in document.documentElement&&!$parent.closest('.navbar-nav').length){$(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click',clearMenus)}
var relatedTarget={relatedTarget:this}
$parent.trigger(e=$.Event('show.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.trigger('focus').attr('aria-expanded','true')
$parent.toggleClass('open').trigger($.Event('shown.bs.dropdown',relatedTarget))}
return false}
Dropdown.prototype.keydown=function(e){if(!/(38|40|27|32)/.test(e.which)||/input|textarea/i.test(e.target.tagName))return
var $this=$(this)
e.preventDefault()
e.stopPropagation()
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
if(!isActive&&e.which!=27||isActive&&e.which==27){if(e.which==27)$parent.find(toggle).trigger('focus')
return $this.trigger('click')}
var desc=' li:not(.disabled):visible a'
var $items=$parent.find('.dropdown-menu'+desc)
if(!$items.length)return
var index=$items.index(e.target)
if(e.which==38&&index>0)index--
if(e.which==40&&index<$items.length-1)index++
if(!~index)index=0
$items.eq(index).trigger('focus')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.dropdown')
if(!data)$this.data('bs.dropdown',(data=new Dropdown(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.dropdown
$.fn.dropdown=Plugin
$.fn.dropdown.Constructor=Dropdown
$.fn.dropdown.noConflict=function(){$.fn.dropdown=old
return this}
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation()}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle,Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api','.dropdown-menu',Dropdown.prototype.keydown)}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/dropdown.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/modal.js. */
+function($){'use strict';var Modal=function(element,options){this.options=options
this.$body=$(document.body)
this.$element=$(element)
this.$dialog=this.$element.find('.modal-dialog')
this.$backdrop=null
this.isShown=null
this.originalBodyPad=null
this.scrollbarWidth=0
this.ignoreBackdropClick=false
if(this.options.remote){this.$element.find('.modal-content').load(this.options.remote,$.proxy(function(){this.$element.trigger('loaded.bs.modal')},this))}}
Modal.VERSION='3.3.6'
Modal.TRANSITION_DURATION=300
Modal.BACKDROP_TRANSITION_DURATION=150
Modal.DEFAULTS={backdrop:true,keyboard:true,show:true}
Modal.prototype.toggle=function(_relatedTarget){return this.isShown?this.hide():this.show(_relatedTarget)}
Modal.prototype.show=function(_relatedTarget){var that=this
var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget})
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
this.isShown=true
this.checkScrollbar()
this.setScrollbar()
this.$body.addClass('modal-open')
this.escape()
this.resize()
this.$element.on('click.dismiss.bs.modal','[data-dismiss="modal"]',$.proxy(this.hide,this))
this.$dialog.on('mousedown.dismiss.bs.modal',function(){that.$element.one('mouseup.dismiss.bs.modal',function(e){if($(e.target).is(that.$element))that.ignoreBackdropClick=true})})
this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(that.$body)}
that.$element.show().scrollTop(0)
that.adjustDialog()
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in')
that.enforceFocus()
var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget})
transition?that.$dialog.one('bsTransitionEnd',function(){that.$element.trigger('focus').trigger(e)}).emulateTransitionEnd(Modal.TRANSITION_DURATION):that.$element.trigger('focus').trigger(e)})}
Modal.prototype.hide=function(e){if(e)e.preventDefault()
e=$.Event('hide.bs.modal')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=false
this.escape()
this.resize()
$(document).off('focusin.bs.modal')
this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal')
this.$dialog.off('mousedown.dismiss.bs.modal')
$.support.transition&&this.$element.hasClass('fade')?this.$element.one('bsTransitionEnd',$.proxy(this.hideModal,this)).emulateTransitionEnd(Modal.TRANSITION_DURATION):this.hideModal()}
Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal').on('focusin.bs.modal',$.proxy(function(e){if(this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.trigger('focus')}},this))}
Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keydown.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide()},this))}else if(!this.isShown){this.$element.off('keydown.dismiss.bs.modal')}}
Modal.prototype.resize=function(){if(this.isShown){$(window).on('resize.bs.modal',$.proxy(this.handleUpdate,this))}else{$(window).off('resize.bs.modal')}}
Modal.prototype.hideModal=function(){var that=this
this.$element.hide()
this.backdrop(function(){that.$body.removeClass('modal-open')
that.resetAdjustments()
that.resetScrollbar()
that.$element.trigger('hidden.bs.modal')})}
Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove()
this.$backdrop=null}
Modal.prototype.backdrop=function(callback){var that=this
var animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$(document.createElement('div')).addClass('modal-backdrop '+animate).appendTo(this.$body)
this.$element.on('click.dismiss.bs.modal',$.proxy(function(e){if(this.ignoreBackdropClick){this.ignoreBackdropClick=false
return}
if(e.target!==e.currentTarget)return
this.options.backdrop=='static'?this.$element[0].focus():this.hide()},this))
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
if(!callback)return
doAnimate?this.$backdrop.one('bsTransitionEnd',callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
var callbackRemove=function(){that.removeBackdrop()
callback&&callback()}
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one('bsTransitionEnd',callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callbackRemove()}else if(callback){callback()}}
Modal.prototype.handleUpdate=function(){this.adjustDialog()}
Modal.prototype.adjustDialog=function(){var modalIsOverflowing=this.$element[0].scrollHeight>document.documentElement.clientHeight
this.$element.css({paddingLeft:!this.bodyIsOverflowing&&modalIsOverflowing?this.scrollbarWidth:'',paddingRight:this.bodyIsOverflowing&&!modalIsOverflowing?this.scrollbarWidth:''})}
Modal.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:'',paddingRight:''})}
Modal.prototype.checkScrollbar=function(){var fullWindowWidth=window.innerWidth
if(!fullWindowWidth){var documentElementRect=document.documentElement.getBoundingClientRect()
fullWindowWidth=documentElementRect.right-Math.abs(documentElementRect.left)}
this.bodyIsOverflowing=document.body.clientWidth<fullWindowWidth
this.scrollbarWidth=this.measureScrollbar()}
Modal.prototype.setScrollbar=function(){var bodyPad=parseInt((this.$body.css('padding-right')||0),10)
this.originalBodyPad=document.body.style.paddingRight||''
if(this.bodyIsOverflowing)this.$body.css('padding-right',bodyPad+this.scrollbarWidth)}
Modal.prototype.resetScrollbar=function(){this.$body.css('padding-right',this.originalBodyPad)}
Modal.prototype.measureScrollbar=function(){var scrollDiv=document.createElement('div')
scrollDiv.className='modal-scrollbar-measure'
this.$body.append(scrollDiv)
var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth
this.$body[0].removeChild(scrollDiv)
return scrollbarWidth}
function Plugin(option,_relatedTarget){return this.each(function(){var $this=$(this)
var data=$this.data('bs.modal')
var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option](_relatedTarget)
else if(options.show)data.show(_relatedTarget)})}
var old=$.fn.modal
$.fn.modal=Plugin
$.fn.modal.Constructor=Modal
$.fn.modal.noConflict=function(){$.fn.modal=old
return this}
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this)
var href=$this.attr('href')
var $target=$($this.attr('data-target')||(href&&href.replace(/.*(?=#[^\s]+$)/,'')))
var option=$target.data('bs.modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data())
if($this.is('a'))e.preventDefault()
$target.one('show.bs.modal',function(showEvent){if(showEvent.isDefaultPrevented())return
$target.one('hidden.bs.modal',function(){$this.is(':visible')&&$this.trigger('focus')})})
Plugin.call($target,option,this)})}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/modal.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/tooltip.js. */
+function($){'use strict';var Tooltip=function(element,options){this.type=null
this.options=null
this.enabled=null
this.timeout=null
this.hoverState=null
this.$element=null
this.inState=null
this.init('tooltip',element,options)}
Tooltip.VERSION='3.3.6'
Tooltip.TRANSITION_DURATION=150
Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false,viewport:{selector:'body',padding:0}}
Tooltip.prototype.init=function(type,element,options){this.enabled=true
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
this.$viewport=this.options.viewport&&$($.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):(this.options.viewport.selector||this.options.viewport))
this.inState={click:false,hover:false,focus:false}
if(this.$element[0]instanceof document.constructor&&!this.options.selector){throw new Error('`selector` option must be specified when initializing '+this.type+' on the window.document object!')}
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin'
var eventOut=trigger=='hover'?'mouseleave':'focusout'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){options=$.extend({},this.getDefaults(),this.$element.data(),options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
if(obj instanceof $.Event){self.inState[obj.type=='focusin'?'focus':'hover']=true}
if(self.tip().hasClass('in')||self.hoverState=='in'){self.hoverState='in'
return}
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.isInStateTrue=function(){for(var key in this.inState){if(this.inState[key])return true}
return false}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
if(obj instanceof $.Event){self.inState[obj.type=='focusout'?'focus':'hover']=false}
if(self.isInStateTrue())return
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
var inDom=$.contains(this.$element[0].ownerDocument.documentElement,this.$element[0])
if(e.isDefaultPrevented()||!inDom)return
var that=this
var $tip=this.tip()
var tipId=this.getUID(this.type)
this.setContent()
$tip.attr('id',tipId)
this.$element.attr('aria-describedby',tipId)
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement).data('bs.'+this.type,this)
this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element)
this.$element.trigger('inserted.bs.'+this.type)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var orgPlacement=placement
var viewportDim=this.getPosition(this.$viewport)
placement=placement=='bottom'&&pos.bottom+actualHeight>viewportDim.bottom?'top':placement=='top'&&pos.top-actualHeight<viewportDim.top?'bottom':placement=='right'&&pos.right+actualWidth>viewportDim.width?'left':placement=='left'&&pos.left-actualWidth<viewportDim.left?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
var complete=function(){var prevHoverState=that.hoverState
that.$element.trigger('shown.bs.'+that.type)
that.hoverState=null
if(prevHoverState=='out')that.leave(that)}
$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()}}
Tooltip.prototype.applyPlacement=function(offset,placement){var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top+=marginTop
offset.left+=marginLeft
$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0)
$tip.addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){offset.top=offset.top+height-actualHeight}
var delta=this.getViewportAdjustedDelta(placement,offset,actualWidth,actualHeight)
if(delta.left)offset.left+=delta.left
else offset.top+=delta.top
var isVertical=/top|bottom/.test(placement)
var arrowDelta=isVertical?delta.left*2-width+actualWidth:delta.top*2-height+actualHeight
var arrowOffsetPosition=isVertical?'offsetWidth':'offsetHeight'
$tip.offset(offset)
this.replaceArrow(arrowDelta,$tip[0][arrowOffsetPosition],isVertical)}
Tooltip.prototype.replaceArrow=function(delta,dimension,isVertical){this.arrow().css(isVertical?'left':'top',50*(1-delta / dimension)+'%').css(isVertical?'top':'left','')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
$tip.find('.tooltip-inner')[this.options.html?'html':'text'](title)
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(callback){var that=this
var $tip=$(this.$tip)
var e=$.Event('hide.bs.'+this.type)
function complete(){if(that.hoverState!='in')$tip.detach()
that.$element.removeAttr('aria-describedby').trigger('hidden.bs.'+that.type)
callback&&callback()}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()
this.hoverState=null
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof $e.attr('data-original-title')!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function($element){$element=$element||this.$element
var el=$element[0]
var isBody=el.tagName=='BODY'
var elRect=el.getBoundingClientRect()
if(elRect.width==null){elRect=$.extend({},elRect,{width:elRect.right-elRect.left,height:elRect.bottom-elRect.top})}
var elOffset=isBody?{top:0,left:0}:$element.offset()
var scroll={scroll:isBody?document.documentElement.scrollTop||document.body.scrollTop:$element.scrollTop()}
var outerDims=isBody?{width:$(window).width(),height:$(window).height()}:null
return $.extend({},elRect,scroll,outerDims,elOffset)}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width / 2-actualWidth / 2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width / 2-actualWidth / 2}:placement=='left'?{top:pos.top+pos.height / 2-actualHeight / 2,left:pos.left-actualWidth}:{top:pos.top+pos.height / 2-actualHeight / 2,left:pos.left+pos.width}}
Tooltip.prototype.getViewportAdjustedDelta=function(placement,pos,actualWidth,actualHeight){var delta={top:0,left:0}
if(!this.$viewport)return delta
var viewportPadding=this.options.viewport&&this.options.viewport.padding||0
var viewportDimensions=this.getPosition(this.$viewport)
if(/right|left/.test(placement)){var topEdgeOffset=pos.top-viewportPadding-viewportDimensions.scroll
var bottomEdgeOffset=pos.top+viewportPadding-viewportDimensions.scroll+actualHeight
if(topEdgeOffset<viewportDimensions.top){delta.top=viewportDimensions.top-topEdgeOffset}else if(bottomEdgeOffset>viewportDimensions.top+viewportDimensions.height){delta.top=viewportDimensions.top+viewportDimensions.height-bottomEdgeOffset}}else{var leftEdgeOffset=pos.left-viewportPadding
var rightEdgeOffset=pos.left+viewportPadding+actualWidth
if(leftEdgeOffset<viewportDimensions.left){delta.left=viewportDimensions.left-leftEdgeOffset}else if(rightEdgeOffset>viewportDimensions.right){delta.left=viewportDimensions.left+viewportDimensions.width-rightEdgeOffset}}
return delta}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.getUID=function(prefix){do prefix+=~~(Math.random()*1000000)
while(document.getElementById(prefix))
return prefix}
Tooltip.prototype.tip=function(){if(!this.$tip){this.$tip=$(this.options.template)
if(this.$tip.length!=1){throw new Error(this.type+' `template` option must consist of exactly 1 top-level element!')}}
return this.$tip}
Tooltip.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow'))}
Tooltip.prototype.enable=function(){this.enabled=true}
Tooltip.prototype.disable=function(){this.enabled=false}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=this
if(e){self=$(e.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(e.currentTarget,this.getDelegateOptions())
$(e.currentTarget).data('bs.'+this.type,self)}}
if(e){self.inState.click=!self.inState.click
if(self.isInStateTrue())self.enter(self)
else self.leave(self)}else{self.tip().hasClass('in')?self.leave(self):self.enter(self)}}
Tooltip.prototype.destroy=function(){var that=this
clearTimeout(this.timeout)
this.hide(function(){that.$element.off('.'+that.type).removeData('bs.'+that.type)
if(that.$tip){that.$tip.detach()}
that.$tip=null
that.$arrow=null
that.$viewport=null})}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data&&/destroy|hide/.test(option))return
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tooltip
$.fn.tooltip=Plugin
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/tooltip.js. */;
