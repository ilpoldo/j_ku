
module("Metafactory");

test("Metafactory calls the data() function", function() {
expect(1)

var j_kuFactory = $.j_ku(function() {with(this){
  t('ul', data().errorOut())
}})
try {
  j_kuFactory({errorOut:function(){throw "yay"}})
} catch(e) {
  ok(true, "calling data() errors out "+e)
}
})

test("Using the template", function() {
  
  var j_kuTemplate = $.j_ku(function() {with(this){
    t('p', data())
  }})
  
  var my_catchphrase = "oi"
  var result = j_kuTemplate(my_catchphrase)
  
  equals(htmlof(result),"<p>oi</p>","Should return a jquery object when the template is fired")
})


test("Fetching external data with the template", function() {
  var j_kuTemplate = $.j_ku(function() {with(this){
    t('p', data())
  }})
  
  var source = "a"
  var result = j_kuTemplate(source)
  equals(htmlof(result),"<p>a</p>","The data should be fetched dynamically by the template")
  
  var source = "b"
  result = j_kuTemplate(source)
  equals(htmlof(result),"<p>b</p>","The data should be fetched dynamically by the template")
  
  var source = "c"
  result = j_kuTemplate(source)
  equals(htmlof(result),"<p>c</p>","The data should be fetched dynamically by the template")
  
  var source = "d"
  result = j_kuTemplate(source)
  equals(htmlof(result),"<p>d</p>","The data should be fetched dynamically by the template")
})

test("Calling an object in the template", function() {
  var j_kuTemplate = $.j_ku(function() {with(this){
    t('p', data().count())
  }})
  
  //Singleton counter
  var counter = {
    counter:0,
    count: function() {this.counter +=1; return ""+this.counter}
  }

  equals(htmlof(j_kuTemplate(counter)),"<p>1</p>","The data should be fetched dynamically by the template")
  equals(htmlof(j_kuTemplate(counter)),"<p>2</p>","The data should be fetched dynamically by the template")
  equals(htmlof(j_kuTemplate(counter)),"<p>3</p>","The data should be fetched dynamically by the template")
})