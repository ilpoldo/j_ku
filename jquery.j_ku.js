/*

* j_ku - a DSL for making straight jQuery DOM elements or factories/templates that make them.
* 
* http://leandropedroni.com/projects/j_ku
*
* Copyright (c) 2009 Leandro Pedroni
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.

Syntax:

$.j_ku(function() {with(this){
  t('h1.catchy-title',"Here comes a DSL to create jQuery objects")
  t('ul')
  ._t('li',"Content 1")
  ._t('li', "Some more content ")
  t('div.meat',"And a box")
  ._t('p',"That has a paragraph")
  .__t('strong', "with a strong statement inside")
   ._t('em', "and the emphasis it needs")
   .t('ul')
  ._t('li', ["And a list", "of things", "after", "the paragraph"])
  // an easy rule to remember this mess is that "._t" is the only one tht doesn't change indentation
}})

*/

jQuery.j_ku = function(rules) {
    var poem = jQuery.j_ku.Poem()
    try {
      rules.apply(poem);
      return poem.verses()
    } catch(e) {
      if (e!="This poem is a template") {throw e}
      factory_of_verses = function(data_input){
        poem = jQuery.j_ku.Poem()
        poem.data = function(){return data_input}
        rules.apply(poem)
        return poem.verses()
      }
      return factory_of_verses
    }
};

jQuery.j_ku.Poem = function() {
  instanceStore = {
    data:function(){throw "This poem is a template"},
    verses:function(){return this.store.contents()},
    html:function(){return this.store.html()},
  }
  instanceStore.store=jQuery('<div/>')
  function F(){}
  F.prototype = instanceStore

  var result = new F()
  result.uber = instanceStore
  
  for(attr in jQuery.j_ku.Methods) {
    result[attr] = jQuery.j_ku.Methods[attr]
  }
  return result
}

jQuery.j_ku.Methods = {
    makeTag: function(tag,attrs,content){
      if (content == undefined && typeof(attrs) == "string") { content = attrs; attrs = undefined}
      var tag_name = /^([\w-]+)/.exec(tag)
      tag_name = tag_name || ["","div"]
      var result = jQuery("<"+tag_name[1]+"/>")
      var tag_id = /(?:#([\w-]+)?)/.exec(tag)
      if (tag_id) {result.attr('id',tag_id[1])}
      var tag_classes = tag.replace(/^([\w-]+)/,"").replace(/[#][\w-]*/,"").replace(/\./g," ")
      if (tag_classes) {
        result.addClass(tag_classes)
      }
      if (content != undefined) {result.html(""+content)}
      if (attr != undefined) { for (attribute in attrs) {
        result.attr(attribute,attrs[attribute])
      }}
      return result
    },
    t: function(tag,attr,content) {
        node = this.makeTag(tag,attr,content)
        this.store.append(node)
        result = new this.verse(node)
        result.t = function(){throw ".t goes up one node, but you are already at the topmost level. don't chain like this \"t().t()\""}
        return result
    },
    verse: function(upper, sibling){
      result = {}
      result.upper = upper
      result.sibling = sibling
      for(attr in jQuery.j_ku.Methods) {
        result[attr] = jQuery.j_ku.Methods[attr]
      }
      result._t=function(tag,attr,content) {
        node = this.makeTag(tag,attr,content)
        upper.append(node)
        return new this.verse(upper, node)
      },
      result.__t=function(tag,attr,content) {
        node = this.makeTag(tag,attr,content)
        sibling.append(node)
        return new this.verse(sibling, node)
      }
      result.t=function(tag,attr,content) {
        node = this.makeTag(tag,attr,content)
        upper.after(node)
        return new this.verse(upper.parent(), node)
      }
      return result
    }
};