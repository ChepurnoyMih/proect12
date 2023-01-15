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
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/popover.js. */
+function($){'use strict';var Popover=function(element,options){this.init('popover',element,options)}
if(!$.fn.tooltip)throw new Error('Popover requires tooltip.js')
Popover.VERSION='3.3.6'
Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:'right',trigger:'click',content:'',template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'})
Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype)
Popover.prototype.constructor=Popover
Popover.prototype.getDefaults=function(){return Popover.DEFAULTS}
Popover.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
var content=this.getContent()
$tip.find('.popover-title')[this.options.html?'html':'text'](title)
$tip.find('.popover-content').children().detach().end()[this.options.html?(typeof content=='string'?'html':'append'):'text'](content)
$tip.removeClass('fade top bottom left right in')
if(!$tip.find('.popover-title').html())$tip.find('.popover-title').hide()}
Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent()}
Popover.prototype.getContent=function(){var $e=this.$element
var o=this.options
return $e.attr('data-content')||(typeof o.content=='function'?o.content.call($e[0]):o.content)}
Popover.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.arrow'))}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.popover')
var options=typeof option=='object'&&option
if(!data&&/destroy|hide/.test(option))return
if(!data)$this.data('bs.popover',(data=new Popover(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.popover
$.fn.popover=Plugin
$.fn.popover.Constructor=Popover
$.fn.popover.noConflict=function(){$.fn.popover=old
return this}}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/popover.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/scrollspy.js. */
+function($){'use strict';function ScrollSpy(element,options){this.$body=$(document.body)
this.$scrollElement=$(element).is(document.body)?$(window):$(element)
this.options=$.extend({},ScrollSpy.DEFAULTS,options)
this.selector=(this.options.target||'')+' .nav li > a'
this.offsets=[]
this.targets=[]
this.activeTarget=null
this.scrollHeight=0
this.$scrollElement.on('scroll.bs.scrollspy',$.proxy(this.process,this))
this.refresh()
this.process()}
ScrollSpy.VERSION='3.3.6'
ScrollSpy.DEFAULTS={offset:10}
ScrollSpy.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)}
ScrollSpy.prototype.refresh=function(){var that=this
var offsetMethod='offset'
var offsetBase=0
this.offsets=[]
this.targets=[]
this.scrollHeight=this.getScrollHeight()
if(!$.isWindow(this.$scrollElement[0])){offsetMethod='position'
offsetBase=this.$scrollElement.scrollTop()}
this.$body.find(this.selector).map(function(){var $el=$(this)
var href=$el.data('target')||$el.attr('href')
var $href=/^#./.test(href)&&$(href)
return($href&&$href.length&&$href.is(':visible')&&[[$href[offsetMethod]().top+offsetBase,href]])||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){that.offsets.push(this[0])
that.targets.push(this[1])})}
ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset
var scrollHeight=this.getScrollHeight()
var maxScroll=this.options.offset+scrollHeight-this.$scrollElement.height()
var offsets=this.offsets
var targets=this.targets
var activeTarget=this.activeTarget
var i
if(this.scrollHeight!=scrollHeight){this.refresh()}
if(scrollTop>=maxScroll){return activeTarget!=(i=targets[targets.length-1])&&this.activate(i)}
if(activeTarget&&scrollTop<offsets[0]){this.activeTarget=null
return this.clear()}
for(i=offsets.length;i--;){activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(offsets[i+1]===undefined||scrollTop<offsets[i+1])&&this.activate(targets[i])}}
ScrollSpy.prototype.activate=function(target){this.activeTarget=target
this.clear()
var selector=this.selector+'[data-target="'+target+'"],'+
this.selector+'[href="'+target+'"]'
var active=$(selector).parents('li').addClass('active')
if(active.parent('.dropdown-menu').length){active=active.closest('li.dropdown').addClass('active')}
active.trigger('activate.bs.scrollspy')}
ScrollSpy.prototype.clear=function(){$(this.selector).parentsUntil(this.options.target,'.active').removeClass('active')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.scrollspy')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.scrollspy',(data=new ScrollSpy(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.scrollspy
$.fn.scrollspy=Plugin
$.fn.scrollspy.Constructor=ScrollSpy
$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old
return this}
$(window).on('load.bs.scrollspy.data-api',function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this)
Plugin.call($spy,$spy.data())})})}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/scrollspy.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/tab.js. */
+function($){'use strict';var Tab=function(element){this.element=$(element)}
Tab.VERSION='3.3.6'
Tab.TRANSITION_DURATION=150
Tab.prototype.show=function(){var $this=this.element
var $ul=$this.closest('ul:not(.dropdown-menu)')
var selector=$this.data('target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
if($this.parent('li').hasClass('active'))return
var $previous=$ul.find('.active:last a')
var hideEvent=$.Event('hide.bs.tab',{relatedTarget:$this[0]})
var showEvent=$.Event('show.bs.tab',{relatedTarget:$previous[0]})
$previous.trigger(hideEvent)
$this.trigger(showEvent)
if(showEvent.isDefaultPrevented()||hideEvent.isDefaultPrevented())return
var $target=$(selector)
this.activate($this.closest('li'),$ul)
this.activate($target,$target.parent(),function(){$previous.trigger({type:'hidden.bs.tab',relatedTarget:$this[0]})
$this.trigger({type:'shown.bs.tab',relatedTarget:$previous[0]})})}
Tab.prototype.activate=function(element,container,callback){var $active=container.find('> .active')
var transition=callback&&$.support.transition&&($active.length&&$active.hasClass('fade')||!!container.find('> .fade').length)
function next(){$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',false)
element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded',true)
if(transition){element[0].offsetWidth
element.addClass('in')}else{element.removeClass('fade')}
if(element.parent('.dropdown-menu').length){element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',true)}
callback&&callback()}
$active.length&&transition?$active.one('bsTransitionEnd',next).emulateTransitionEnd(Tab.TRANSITION_DURATION):next()
$active.removeClass('in')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tab')
if(!data)$this.data('bs.tab',(data=new Tab(this)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tab
$.fn.tab=Plugin
$.fn.tab.Constructor=Tab
$.fn.tab.noConflict=function(){$.fn.tab=old
return this}
var clickHandler=function(e){e.preventDefault()
Plugin.call($(this),'show')}
$(document).on('click.bs.tab.data-api','[data-toggle="tab"]',clickHandler).on('click.bs.tab.data-api','[data-toggle="pill"]',clickHandler)}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/tab.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/transition.js. */
+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
$.fn.emulateTransitionEnd=function(duration){var called=false
var $el=this
$(this).one('bsTransitionEnd',function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()
if(!$.support.transition)return
$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}})}(jQuery);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/bootstrap/js/transition.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/js/dc.js. */
(function($,Drupal,window){"use strict";$(function(){if(document.body.clientWidth>=768){if($('.block-main-background').is(':empty')){$(".block-main-background").html('<video playsinline autoplay="autoplay" loop="" class="fillWidth" preload="auto" muted>'+'<source src="/themes/custom/bootstrap_dc/video/code/MP4/code.mp4" type="video/mp4">'+'Your browser does not support the video tag. I suggest you upgrade your browser.'+'</video>');}
$('video').attr('autoplay',true).attr('preload','auto');}
$(window).resize(function(){if(document.body.clientWidth>=768){$('video').attr('autoplay',true).attr('preload','auto');}});});if($(".navbar-toggle").css("display")!=='none'){$("li.dropdown > a").click(function(e){$(this).next(".dropdown-menu-wrapper").toggleClass("show");return false;});}
$('a[href*="#"].anchor:not([href="#"])').click(function(){if(location.pathname.replace(/^\//,'')==this.pathname.replace(/^\//,'')&&location.hostname==this.hostname){var target=$(this.hash);target=target.length?target:$('[name='+this.hash.slice(1)+']');if(target.length){$('html, body').animate({scrollTop:target.offset().top},1000);return false;}}});$(document).ready(function(){if(document.body.clientWidth>=768){$('.menu.navbar-nav .dropdown-toggle').on('click',function(){var link=$(this).attr('href');if(link!=''){return location.href=this.href;}});}
$('article.keys-1').on('click',function(){var link=$(this).attr('about');return location.href=link;});$('article.keys-2').on('click',function(){var link=$(this).attr('about');return location.href=link;});if($("div").is('.page-node-type-blog .field--name-field-blog-img')){$('.page-node-type-blog .page-header-big').css('background-image','url('+$('.page-node-type-blog .field--name-field-blog-img').html()+')').addClass('with-img');}
$('.flowing-scroll').on('click',function(){console.log('.flowing-scroll');var el=$(this);var dest=el.attr('href');if(dest!==undefined&&dest!==''){$('html').animate({scrollTop:$(dest).offset().top},500);}
return false;});});$(document).ready(function(){var device=Snap.select('.service-icon-device');var mic=Snap.select('.service-icon-mic');var screen=Snap.select('.service-icon-screen');var header=Snap.select('.service-icon-header');var search=Snap.select('.service-icon-search');var windowBtn=Snap.select('.service-icon-window-btn');var col1=Snap.select('.service-icon-col-1 > path');var col2=Snap.select('.service-icon-col-2 > path');var col3=Snap.select('.service-icon-col-3 > path');var text1=Snap.select('.service-icon-col-1-text');var text2=Snap.select('.service-icon-col-2-text');var text3=Snap.select('.service-icon-col-3-text');var icon1=Snap.select('.service-icon-col-1-icon');var icon2=Snap.select('.service-icon-col-2-icon');var icon3=Snap.select('.service-icon-col-3-icon');var logo1=Snap.select('.service-icon-logo > path');var logo2=Snap.select('.service-icon-logo-2');var menu1=Snap.select('.service-icon-menu-1');var menu2=Snap.select('.service-icon-menu-2');var menu3=Snap.select('.service-icon-menu-3');var slogan1=Snap.select('.service-icon-slogan-1');var slogan2=Snap.select('.service-icon-slogan-2');var compBtn=Snap.select('.service-icon-comp-btn');var keyboard=Snap.select('.service-icon-keyboard');var shadow=Snap.select('.service-icon-shadow');var timeoutID;var durTime=500;if($('body').hasClass('path-frontpage')){tablet();};function tablet(){device.animate({d:"m 193.36,156.027 c -12.174,0 -16.133,3.96 -16.133,16.133 v 163.672 c 0,12.173 3.96,16.133 16.132,16.133 h 122.52 c 12.17,0 16.13,-3.96 16.13,-16.133 V 172.16 c 0,-12.174 -3.96,-16.133 -16.132,-16.133 z"},durTime,mina.linear);slogan1.animate({d:"m 221.87,225.518 h 32.308 v 2.678 H 221.87 Z"},durTime,mina.linear);slogan2.animate({d:"m 254.178,225.518 h 33.258 v 2.678 h -33.258 z m -31.434,18.793 v 2.677 h 59.3 v -2.675 h -59.3 z m -19.254,-8.416 v 2.677 h 100.79 v -2.677 z"},durTime,mina.linear);mic.animate({d:"m 238.597,160.975 h 34.033 c 0.484,0 0.876,0.392 0.876,0.876 v 0.005 c 0,0.4838 -0.3922,0.876 -0.876,0.876 h -34.033 c -0.48341,0 -0.87545,-0.39159 -0.876,-0.875 v -0.003 c 0,-0.482 0.394,-0.875 0.878,-0.875 z"},durTime,mina.linear);screen.animate({d:"m 188.256,339.376 h 132.73 V 176.16 c 0,-3.876 -3.228,-7.103 -7.104,-7.103 h -118.52 c -3.876,0 -7.103,3.227 -7.103,7.103 v 163.216 z"},durTime,mina.linear);header.animate({d:"m 320.986,182.83 h -132.73 v -6.67 c 0,-3.876 3.227,-7.103 7.103,-7.103 h 118.52 c 3.874,0 6.49564,3.27441 7.1,7.103 v 6.67 h 0.005 z"},durTime,mina.linear);search.animate({d:"m 232.44,174.13369 h 79.08 c 1.45484,0.001 2.63325,0.618 2.636,1.37855 v 2.55636 c -0.003,0.76055 -1.18116,1.37682 -2.636,1.37856 h -79.08 c -1.45406,-0.001 -2.6317,-0.61789 -2.635,-1.37804 v -2.55635 c 0.003,-0.76044 1.18138,-1.37655 2.636,-1.37856 z"},durTime,mina.linear);windowBtn.animate({d:"m 196.56041,174.04633 c -1.66075,0.0277 -2.99114,1.26371 -2.99114,2.77884 0,1.51512 1.33039,2.75108 2.99114,2.77883 1.6825,0 3.04643,-1.24413 3.04643,-2.77883 0,-1.53471 -1.36393,-2.77884 -3.04643,-2.77884 z m 12.02681,0 c -1.66075,0.0277 -2.99114,1.26371 -2.99114,2.77884 0,1.51512 1.33039,2.75108 2.99114,2.77883 1.68194,0 3.04541,-1.24371 3.04541,-2.7779 0.001,-1.53492 -1.36267,-2.77977 -3.04541,-2.77977 z m 12.02835,0 c -1.66075,0.0277 -2.99114,1.26371 -2.99114,2.77884 0,1.51512 1.33039,2.75108 2.99114,2.77883 1.6825,0 3.04643,-1.24413 3.04643,-2.77883 0,-1.53471 -1.36393,-2.77884 -3.04643,-2.77884 z"},durTime,mina.linear);col1.animate({d:"m 188.26,283.62 h 42.24 v 55.756 h -42.24 z"},durTime,mina.linear);col2.animate({d:"m 230.502,283.62 h 48.243 v 55.756 h -48.243 z"},durTime,mina.linear);col3.animate({d:"m 278.742,283.62 h 42.243 v 55.756 h -42.243 z"},durTime,mina.linear);text1.animate({d:"m 192.467,313.229 h 32.79 v 2.676 h -32.79 z m 0,16.83 h 25.698 v 2.676 h -25.698 z m 0,-8.414 h 32.79 v 2.676 h -32.79 z"},durTime,mina.linear);text2.animate({d:"m 235.347,321.644 h 36.623 v 2.676 h -36.62 z m 0,8.415 h 36.284 v 2.677 h -36.28 z m 0,-16.83 h 36.623 v 2.677 h -36.62 z"},durTime,mina.linear);text3.animate({d:"m 284.136,321.645 h 32.624 v 2.676 h -32.625 z m 0,8.415 h 32.283 v 2.677 h -32.285 z m 0,-16.83 h 32.624 v 2.677 h -32.625 z"},durTime,mina.linear);icon1.animate({d:"m 220.52952,298.0698 c 0,6.20559 -5.08415,11.23621 -11.35575,11.23621 -6.27161,0 -11.35575,-5.03062 -11.35575,-11.23621 0,-6.20559 5.08414,-11.23622 11.35575,-11.23622 6.27161,0 11.35575,5.03063 11.35575,11.23622 z"},durTime,mina.linear);icon2.animate({d:"m 264.68428,298.20284 c 0,6.20573 -5.08426,11.23646 -11.356,11.23646 -6.27175,0 -11.356,-5.03073 -11.356,-11.23646 0,-6.20573 5.08425,-11.23647 11.356,-11.23647 6.27175,0 11.356,5.03074 11.356,11.23647 z"},durTime,mina.linear);icon3.animate({d:"m 311.90103,297.29335 c 0,6.20573 -5.08426,11.23646 -11.356,11.23646 -6.27175,0 -11.356,-5.03073 -11.356,-11.23646 0,-6.20573 5.08425,-11.23647 11.356,-11.23647 6.27175,0 11.356,5.03074 11.356,11.23647 z"},durTime,mina.linear);logo1.animate({d:"m 191.3,186.9 h 22.31 v 2.677 H 191.3 Z"},durTime,mina.linear);logo2.animate({d:"m 213.61,186.9 h 23.257 v 2.677 H 213.61 Z"},durTime,mina.linear);menu1.animate({d:"M 252.27145,186.9 H 273.1 v 2.677 h -20.82486 z"},durTime,mina.linear);menu2.animate({d:"M 280.18358,186.9 H 297.44 v 2.677 h -17.25828 z"},durTime,mina.linear);menu3.animate({d:"m 301.844,186.9 h 13.392 v 2.677 h -13.392 z"},durTime,mina.linear);compBtn.animate({d:"m 245.2,343.077 h 18.84 l 0.268,4.463 h -19.38 l 0.27,-4.463 z"},durTime,mina.linear);shadow.animate({fill:"#34a7c6"},durTime,mina.linear);keyboard.animate({d:"m 177.082,338.406 h 155.076 v 6.782 c 0,7.03 -5.753,8.782 -12.782,8.782 H 189.86 c -7.028,0 -12.78,-1.753 -12.78,-8.782 v -6.782 z",fill:"#666"},durTime,mina.linear,delay1);}
function delay1(){timeoutID=setTimeout(function(){phone();},1000);}
function phone(){device.animate({d:"m 231.36,192.027 c -12.174,0 -12.133,-0.04 -12.133,12.133 v 101.672 c 0,12.173 -0.04,12.133 12.132,12.133 h 46.52 c 12.17,0 12.13,0.04 12.13,-12.133 V 204.16 c 0,-12.174 0.04,-12.133 -12.132,-12.133 z"},durTime,mina.linear);slogan1.animate({d:"m 237.20335,232.16333 h 17.67184 v 1.84911 h -17.67184 z"},durTime,mina.linear);slogan2.animate({d:"m 254.87519,232.16333 h 18.19147 v 1.84911 h -18.19147 z m -17.19378,12.97625 v 1.84842 h 32.43594 v -1.84704 h -32.43594 z m -10.53156,-5.81111 v 1.84843 H 282.28 v -1.84843 z"},durTime,mina.linear);mic.animate({d:"m 246.597,194.975 h 18.033 c 0.484,0 0.876,0.392 0.876,0.876 v 0.005 c 0,0.4838 -0.3922,0.876 -0.876,0.876 h -18.033 c -0.48341,0 -0.87545,-0.39159 -0.876,-0.875 v -0.003 c 0,-0.482 0.394,-0.875 0.878,-0.875 z"},durTime,mina.linear);screen.animate({d:"m 222.256,307.376 h 64.73 V 208.16 c 0,-3.876 -3.228,-7.103 -7.104,-7.103 h -50.52 c -3.876,0 -7.103,3.227 -7.103,7.103 v 99.216 z"},durTime,mina.linear);header.animate({d:"M 286.87881,214.93718 222.14882,214.83 v -6.67 c 0,-7.83929 3.2757,-7.11102 7.21018,-7.103 l 52.55647,0.10718 c 2.7055,0.006 4.95845,-0.95204 4.95845,7.103 v 6.67 h 0.003 z"},durTime,mina.linear);search.animate({d:"m 238.44,205.59778 h 41.08 c 1.45484,0.001 2.63325,0.85815 2.636,1.91425 v 1.91347 c -0.003,0.81969 -1.18116,1.48387 -2.636,1.48575 h -41.08 c -1.45406,-0.001 -2.6317,-0.66593 -2.635,-1.48519 v -1.91329 c 0.003,-1.05595 1.18138,-1.91148 2.636,-1.91427 z"},durTime,mina.linear);windowBtn.animate({d:"m 228.56057,204.02925 c -0.61797,0.0103 -1.11301,0.46805 -1.11301,1.02923 0,0.56118 0.49504,1.01895 1.11301,1.02923 0.62607,0 1.1336,-0.4608 1.1336,-1.02923 0,-0.56842 -0.50753,-1.02923 -1.1336,-1.02923 z m -0.0536,2.75815 c -0.57628,0.0103 -1.03791,0.46805 -1.03791,1.02923 0,0.56117 0.46163,1.01895 1.03791,1.02923 0.58362,0 1.05674,-0.46065 1.05674,-1.02889 3.4e-4,-0.56851 -0.47285,-1.02957 -1.05674,-1.02957 z m -0.0168,2.75814 c -0.63881,0.0113 -1.15056,0.51113 -1.15056,1.12397 0,0.61282 0.51175,1.11274 1.15056,1.12396 0.64719,0 1.17184,-0.50321 1.17184,-1.12396 0,-0.62074 -0.52465,-1.12397 -1.17184,-1.12397 z"},durTime,mina.linear);col1.animate({d:"m 222.26,255.62423 h 64.725 V 307.376 H 222.26 Z"},durTime,mina.linear);col2.animate({d:"m 230.502,307.62 h 48.243 v -0.244 h -48.243 z"},durTime,mina.linear);col3.animate({d:"m 278.742,307.376 h 8.243 v 0 z"},durTime,mina.linear);text1.animate({d:"m 228.70645,283.71481 h 50.24462 v 2.19585 h -50.24462 z m 0,13.81022 h 39.37744 v 2.19585 h -39.37744 z m 0,-6.90429 h 50.24462 v 2.19585 h -50.24462 z"},durTime,mina.linear);text2.animate({d:"M 236.25648,303.02114 H 271.97 v -0.0688 h -35.7106 z m 0,-0.21632 h 35.38294 v -0.0688 h -35.37904 z m 0,0.43265 H 271.97 v -0.0688 h -35.7106 z"},durTime,mina.linear);text3.animate({d:"m 280.136,304.16024 h 8.624 v 0.13915 h -8.625 z m 0,0.43756 h 8.283 v 0.1392 h -8.285 z m 0,-0.87512 h 8.624 v 0.13919 h -8.625 z"},durTime,mina.linear);icon1.animate({d:"m 266.52952,270.0698 c 0,6.20559 -5.08415,11.23621 -11.35575,11.23621 -6.27161,0 -11.35575,-5.03062 -11.35575,-11.23621 0,-6.20559 5.08414,-11.23622 11.35575,-11.23622 6.27161,0 11.35575,5.03063 11.35575,11.23622 z"},durTime,mina.linear);icon2.animate({d:"m 264.68428,287.89544 c 0,0.51311 -0.40161,0.92907 -0.89703,0.92907 -0.49541,0 -0.89703,-0.41596 -0.89703,-0.92907 0,-0.51311 0.40162,-0.92907 0.89703,-0.92907 0.49542,0 0.89703,0.41596 0.89703,0.92907 z"},durTime,mina.linear);icon3.animate({d:"m 289.46729,286.83437 c 0,0.4294 -0.0623,0.7775 -0.13913,0.7775 -0.0768,0 -0.13913,-0.3481 -0.13913,-0.7775 0,-0.42939 0.0623,-0.77749 0.13913,-0.77749 0.0768,0 0.13913,0.3481 0.13913,0.77749 z"},durTime,mina.linear);logo1.animate({d:"m 225.3,218.9 h 22.31 v 2.677 H 225.3 Z"},durTime,mina.linear);logo2.animate({d:"m 247.61,218.9 h 23.257 v 2.677 H 247.61 Z"},durTime,mina.linear);menu1.animate({d:"m 276.271,216.9 h 8.829 v 1.17644 h -8.82486 z"},durTime,mina.linear);menu2.animate({d:"m 276.271,218.9 h 8.829 v 1.17644 h -8.829 z"},durTime,mina.linear);menu3.animate({d:"m 276.271,220.9 h 8.829 v 1.17644 h -8.829 z"},durTime,mina.linear);compBtn.animate({d:"m 249.2,309.077 h 10.84 l 0.268,4.463 h -11.38 l 0.27,-4.463 z"},durTime,mina.linear);keyboard.animate({d:"m 219.082,306.406 h 71.076 v 2.782 c 0,7.03 -5.753,8.782 -12.782,8.782 H 231.86 c -7.028,0 -12.78,-1.753 -12.78,-8.782 v -2.782 z",fill:"#666"},durTime,mina.linear,delay2);}
function delay2(){timeoutID=setTimeout(function(){laptop();},1000);}
function laptop(){device.animate({d:"m 69.36,118.027 c -12.174,0 -22.133,9.96 -22.133,22.133 v 229.672 c 0,12.173 9.96,22.133 22.132,22.133 h 370.52 c 12.17,0 22.13,-9.96 22.13,-22.133 V 140.16 c 0,-12.174 -9.96,-22.133 -22.132,-22.133 z"},durTime,mina.linear);slogan1.animate({d:"m 221.87,211.518 h 32.308 v 2.678 H 221.87 Z"},durTime,mina.linear);slogan2.animate({d:"m 254.178,211.518 h 33.258 v 2.678 h -33.258 z m -31.434,18.793 v 2.677 h 59.3 v -2.675 h -59.3 z m -19.254,-8.416 v 2.677 h 100.79 v -2.677 z"},durTime,mina.linear);mic.animate({d:"m 244.597,124.975 h 34.033 c 0.484,0 0.876,0.392 0.876,0.876 v 0.005 a 0.876,0.876 0 0 1 -0.876,0.876 h -34.033 a 0.876,0.876 0 0 1 -0.876,-0.875 v -0.003 c 0,-0.482 0.394,-0.875 0.878,-0.875 z"},durTime,mina.linear);screen.animate({d:"m 62.256,353.376 h 384.73 V 140.16 c 0,-3.876 -3.228,-7.103 -7.104,-7.103 H 69.362 c -3.876,0 -7.103,3.227 -7.103,7.103 v 213.216 z"},durTime,mina.linear);header.animate({d:"M 446.986,156.83 H 62.256 v -16.67 c 0,-3.876 3.227,-7.103 7.103,-7.103 h 370.52 c 3.874,0 7.1,3.227 7.1,7.103 v 16.67 h 0.005 z"},durTime,mina.linear);search.animate({d:"m 226.44,139.86 h 197.08 a 2.642,2.642 0 0 1 2.636,2.637 v 4.89 a 2.642,2.642 0 0 1 -2.636,2.637 H 226.44 a 2.642,2.642 0 0 1 -2.635,-2.636 v -4.89 a 2.643,2.643 0 0 1 2.636,-2.637 z"},durTime,mina.linear);windowBtn.animate({d:"m 78.623,139.68 a 5.963,5.963 0 0 0 0,11.924 5.962,5.962 0 0 0 0,-11.924 z m 23.537,0 a 5.963,5.963 0 0 0 0,11.924 5.96,5.96 0 0 0 5.96,-5.96 5.96,5.96 0 0 0 -5.96,-5.964 z m 23.54,0 a 5.963,5.963 0 0 0 0,11.924 5.962,5.962 0 0 0 0,-11.924 z"},durTime,mina.linear);col1.animate({d:"M 62.26,269.62 H 190.5 v 83.756 H 62.26 Z"},durTime,mina.linear);col2.animate({d:"m 190.502,269.62 h 128.243 v 83.756 H 190.502 Z"},durTime,mina.linear);col3.animate({d:"m 318.742,269.62 h 128.243 v 83.756 H 318.742 Z"},durTime,mina.linear);text1.animate({d:"m 74.467,321.229 h 100.79 v 2.676 H 74.467 Z m 0,16.83 h 67.698 v 2.676 H 74.467 Z m 0,-8.414 h 100.79 v 2.676 H 74.467 Z"},durTime,mina.linear);text2.animate({d:"M 203.347,327.644 H 307.97 v 2.676 H 203.35 Z m 0,8.415 h 70.284 v 2.677 h -70.28 z m 0,-16.83 H 307.97 v 2.677 H 203.35 Z"},durTime,mina.linear);text3.animate({d:"M 330.136,327.645 H 434.76 v 2.676 H 330.135 Z m 0,8.415 h 70.283 v 2.677 h -70.285 z m 0,-16.83 H 434.76 v 2.677 H 330.135 Z"},durTime,mina.linear);icon1.animate({d:"m 139.58617,296.32744 c 0,10.18161 -8.34164,18.43543 -18.63156,18.43543 -10.28992,0 -18.63155,-8.25382 -18.63155,-18.43543 0,-10.18161 8.34163,-18.43544 18.63155,-18.43544 10.28993,0 18.63156,8.25383 18.63156,18.43544 z"},durTime,mina.linear);icon2.animate({d:"m 272.86906,294.33861 c 0,10.18161 -8.34164,18.43543 -18.63156,18.43543 -10.28992,0 -18.63155,-8.25382 -18.63155,-18.43543 0,-10.18161 8.34163,-18.43544 18.63155,-18.43544 10.28993,0 18.63156,8.25383 18.63156,18.43544 z"},durTime,mina.linear);icon3.animate({d:"m 404.06075,294.3386 c 0,10.18161 -8.34164,18.43543 -18.63156,18.43543 -10.28992,0 -18.63155,-8.25382 -18.63155,-18.43543 0,-10.18161 8.34163,-18.43544 18.63155,-18.43544 10.28993,0 18.63156,8.25383 18.63156,18.43544 z"},durTime,mina.linear);logo1.animate({d:"m 77.3,160.9 h 32.31 v 2.677 H 77.3 Z"},durTime,mina.linear);logo2.animate({d:"m 109.61,160.9 h 33.257 v 2.677 H 109.61 Z"},durTime,mina.linear);menu1.animate({d:"M 262.27145,160.9 H 309.1 v 2.677 h -46.82486 z"},durTime,mina.linear);menu2.animate({d:"M 326.18358,160.9 H 373.44 v 2.677 h -47.25828 z"},durTime,mina.linear);menu3.animate({d:"m 387.844,160.9 h 25.392 v 2.677 h -25.392 z"},durTime,mina.linear);compBtn.animate({d:"M209.2 373.077h90.84l-9.732 6.463h-71.38l-9.73-6.463z"},durTime,mina.linear);shadow.animate({fill:"#1199bd"},durTime,mina.linear);keyboard.animate({d:"M27.082 368.406h455.076v12.782c0 7.03-5.753 12.782-12.782 12.782H39.86c-7.028 0-12.78-5.753-12.78-12.782v-12.782z",fill:"#b6b6b8"},durTime,mina.linear,delay3);}
function delay3(){$('.service.support').addClass("animate");setTimeout(function(){$('.service.seo').addClass("animate");$('.service.support').removeClass("animate");setTimeout(function(){$('.service.seo').removeClass("animate");tablet();},4200);},2100);}});$(document).ready(function(){function faqAccordion(e){e.preventDefault();var parent=$(this).parent().parent().parent('.panel-faq .panel');var parentOpen=$('.panel-faq .panel.panel_open');var that=this;$(this).off('click',faqAccordion);console.log($(this).attr('aria-expanded'));if($(this).attr('aria-expanded')==='false'){parent.removeClass('panel_close');parent.addClass('panel_open');console.log('open');}
else{parent.removeClass('panel_open');parent.addClass('panel_close');console.log('close');}
parentOpen.find('.panel-faq .panel .panel-collapse').collapse('hide');parentOpen.removeClass('panel_open');parentOpen.addClass('panel_close');setTimeout(function(){$(that).on('click',faqAccordion);},400);}
$('.panel-faq .panel .panel-btn').on('click',faqAccordion);if($('*').is('.react-logo.custom')){animateReactLogo();}
function animateReactLogo(){var atom1=Snap.select('.react-logo.custom .react-logo-atom-1');var orbit1=Snap.select('.react-logo.custom .react-logo-orbit-1');var atom2=Snap.select('.react-logo.custom .react-logo-atom-2');var orbit2=Snap.select('.react-logo.custom .react-logo-orbit-2');var atom3=Snap.select('.react-logo.custom .react-logo-atom-3');var orbit3=Snap.select('.react-logo.custom .react-logo-orbit-3');var animationLink1;var animationLink2;var animationLink3;animationStart();function animationStart(){var pathLength=orbit1.getTotalLength();var duration=18000;animationLink1=Snap.animate(300,10*pathLength+300,function(value){var movePoint=Snap.path.getPointAtLength(orbit1,value%pathLength);atom1.transform(`t${movePoint.x},${movePoint.y},s1`);},duration,mina.linear);pathLength=orbit2.getTotalLength();animationLink2=Snap.animate(120,10*pathLength+120,function(value){var movePoint=Snap.path.getPointAtLength(orbit2,value%pathLength);atom2.transform(`t${movePoint.x},${movePoint.y},s1`);},duration,mina.linear);pathLength=orbit3.getTotalLength();animationLink3=Snap.animate(50,10*pathLength+50,function(value){var movePoint=Snap.path.getPointAtLength(orbit3,value%pathLength);atom3.transform(`t${movePoint.x},${movePoint.y},s1`);},duration,mina.linear,animationStart);}}});Drupal.behaviors.testimonials={attach:function(context,settings){$('.view-testimonials .slick').on('init reInit afterChange',function(event,slick,currentSlide,nextSlide){var i=(currentSlide?currentSlide:0)+1;var i=i>10?i:'0'+i;var count=slick.slideCount>10?slick.slideCount:'0'+slick.slideCount;$(this).find('.slick-slide-num').html('<span class="slick-slide-num-current">'+i+'</span> / '+count);});}};})(jQuery,Drupal,window);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/js/dc.js. */;
/* Source and licensing information for the line(s) below can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/js/service-worker-load.js. */
(function(Drupal,drupalSettings,navigator,window){'use strict';if('serviceWorker'in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register("/service-worker.js").then(registration=>{console.log(`Service Worker registered!Scope:${registration.scope}`);}).catch(err=>{console.log(`Service Worker registration failed:${err}`);});});}})(Drupal,drupalSettings,navigator,window);
/* Source and licensing information for the above line(s) can be found at https://drupal-coding.com/themes/custom/bootstrap_dc/js/service-worker-load.js. */;
