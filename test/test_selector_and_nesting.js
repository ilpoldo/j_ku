module("makeTag");

test("tag selector", function() {
  var value = $.j_ku(function() {with(this){
    t('p#martin')
  }})
  equals( htmlof(value), '<p id="martin"></p>', "We expect to create a <p> tag with an id" );
});

test("tag and class", function() {
  var value = $.j_ku(function() {with(this){
    t('p.classy')
  }})
  equals( htmlof(value), '<p class="classy"></p>', "We expect to create a <p> tag with a class" );
  
  var value = $.j_ku(function() {with(this){
    t('p.classy.selected')
  }})
  equals( htmlof(value), '<p class="classy selected"></p>', "We expect to create a <p> tag with a class" );
});

test("tag, id and class", function() {
  var value = $.j_ku(function() {with(this){
    t('p#martin.classy')
  }})
  equals( htmlof(value), '<p id="martin" class="classy"></p>', "We expect to create a <p> tag with a class" );
  
  var value = $.j_ku(function() {with(this){
    t('p#martin.classy.selected')
  }})
  equals( htmlof(value), '<p id="martin" class="classy selected"></p>', "We expect to create a <p> tag with two classes" );
  
  var value = $.j_ku(function() {with(this){
    t('p.classy#martin.selected')
  }})
  equals( htmlof(value), '<p id="martin" class="classy selected"></p>', "We expect to create a <p> tag with two classes in a funky order" );
});

test("tag with attributes",function(){
  var value = $.j_ku(function() {with(this){
    t('p',{usefulness:'low'})
  }})
  equals( htmlof(value), '<p usefulness="low"></p>', "We expect to create a <p> tag with an attribute" );
  
  var value = $.j_ku(function() {with(this){
    t('p.classy',{usefulness:'low',coolness:'average'})
  }})
  equals( htmlof(value), '<p class="classy" usefulness="low" coolness="average"></p>', "We expect to create a <p> tag with an attributes and class" );
  
  var value = $.j_ku(function() {with(this){
    t('p#martin.classy',{usefulness:'low'})
  }})
  equals( htmlof(value), '<p id="martin" class="classy" usefulness="low"></p>', "We expect to create a <p> tag with an attribute, id and class" );
  
})

test("Default to a div if no tag is given", function() {
  var value = $.j_ku(function() {with(this){
    t('.classy')
  }})
  equals( htmlof(value), '<p class="classy"></p>', "We expect to create a <p> tag with a class" );
  
  var value = $.j_ku(function() {with(this){
    t('#home.classy.selected')
  }})
  equals( htmlof(value), '<p id="home" class="classy selected"></p>', "We expect to create a <p> tag with a class" );
});

module("Nesting");

test("the basic nest list test", function() {
  var value = $.j_ku(function() {with(this){
    t('ul')
    ._t('li','Content')
  }})
  equals( htmlof(value), "<ul><li>Content</li></ul>", "We expect the code to create a nested tag" );
  
  var value = $.j_ku(function() {with(this){
    t('ul')
    ._t('li','Content')
    ._t('li','More Content')
  }})
  equals( htmlof(value), "<ul><li>Content</li><li>More Content</li></ul>", "We expect the code to create a couple of nested tag" );
  
});

test("the deep nest list test", function() {
  var value = $.j_ku(function() {with(this){
    t('ul')
    ._t('li','Content ')
    .__t('em','that matters')
  }})
  equals( htmlof(value), "<ul><li>Content <em>that matters<em/></li></ul>", "We expect the code to create a nested tag inside a nested tag" );
  
  var value = $.j_ku(function() {with(this){
    t('ul')
    ._t('li','Content ')
    .__t('em','that matters')
     .t('li','And another item')
  }})
  equals( htmlof(value), "<ul><li>Content <em>that matters<em/></li><li>And another item</li></ul>", "We expect the code to create two nested tag one inside the other and then go up one level and add another tag" );
});

test("Improper chaining - t().t()", function() {
  expect(1)
  try {
    var value = $.j_ku(function() {with(this){
      t('ul')
      .t('li','Content ')
    }})
  } catch(e) {ok(true, "Chaining t().t() should throw an error")}
});