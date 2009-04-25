j_ku
====
**j_ku** is a javascript DSL that allows you to create new DOM nodes as a [jQuery](http://jquery.com) object in a nice and readable way using **CSS selector** syntax.
Some the goal is trying to convey a sense of hierarchy and make it easy to write code in a way that represents the nested structure of the nodes it creates.

I just love so much writing html using [HAML](http://haml.hamptoncatlin.com/) that I had to work the same way with javascript and jQuery. 

Usage
-----
The function you pass to $.j_ku will be used as instructions to create the jquery objects for the DOM nodes you want to create in the structure you prefer. The $.j_ku function will return them as a jquery object, ready to be manipulated and eventually appended into the document.

	$.j_ku(function() {with(this){
		// Make your objects in here with the j_ku dsl
	}})

Tag Syntax
----------
How the DSL syntax work, then?
The **t** function creates a tag, the first argument you pass defines what kind of tag using CSS selector syntax, so it's pretty easy to add classes and id:

	t("p.description#intro")

You can add attributes to the tag passing an object literal containing the attributes name and value.
Pass a string at the end to place it as content for the tag.

	$.j_ku(function() {with(this){
		t("a",{href:"http://example.com"},"Link to example")
	}})
	
	//will create the same as: 
	jQuery('<a href="http://example.com">Link to example</a>')

Hierarchy Syntax
----------------
Okay: it doesn't look great if you want to create a hyperlink; but what about something with a bit more structure to it?

	$.j_ku(function() {with(this){
		t('h1',"Why do I want a DSL to create jQuery objects?")
		t('div.reasons')
		._t('p',"It's petty easy to nest one tag inside the other using chains.")
		._t('p',"Nesting is useful, but adding sibling nodes easily is great too; plus:")
		._t('ul')
		.__t('li',"You can nest tags into tags as much as you want")
		 ._t('li',"And you can always add more tags next to the previous")
		 .t('p',"You can also climb back up one level")
		t('h5',"Not convinced yet? There's more...")
	}})

Will create a jquery object with the following html:

	<h1>Why do I want a DSL to create jQuery objects?</h1>
	<div class="reasons">
	  <p>
	    It's petty easy to nest one tag inside the other using chains.
	  </p>
	  <p>
	    Nesting is useful, but adding sibling nodes easily is great too, plus:
	  </p>
	  <ul>
	    <li>You can nest tags into tags as much as you want</li>
	    <li>And you can always add more tags next to the previous</li>
	  </ul>
	  <p>
	    You can also climb back up one level
	  </p>
	</div>
	<h5>Not convinced yet? There's more...</h5>

How do you do it?

* **t** at the start of a chain always creates a node at the root level, you nest a tag inside it chaining **._t** after it.

* **._t** is used to start creating nodes inside one sitting at root level, after that it always creates sibling for the tag it is called on, so looking at the code it will look correctly indented

* **.__t** is used to create a node inside the non-root node just created. After a call to this function you should return to a new line and add a space if you continue the chain, that way the *t* in the code will line up and suggest the nesting structure at a glance

* **.t** is used to add a node after the parent of the tag it is called on, it basically lets you walk up one level and add your node there. To keep the indentation of *t* looking right you should backspace once after the new line.

Other Advantages
----------------
Other than being pretty readable it's very easy for your code to have the content for the tags generated on the fly: just pass a function call to **t**.

When called this will return the current time placed into the h2 tag, after a title within a div:

	$.j_ku(function() {with(this){
		t('div.time')
		._t("h1","The time now is:")
		._t("h2",Date())
	}})

What you write in the function you pass to j_ku is still javascript so you can do a lot more than creating a bunch of nested tags.

A simple example is iterating over an array to populate a list:

	$.j_ku(function() {with(this){
		var list = ["milk", "eggs", "ham"]
		var list_node = t('ul')
		for (i in list){
			list_node._t("li","get more "+list[i])
		}
	}})

Using it as a template
----------------------
You can use j_ku not only to create a jquery object formatted as you specify in your code, but you can have it return a function that uses the argument you pass to build a jquery object every time it is called.
Just refer to the object passed to your template as data() when you write it.

	var authorTemplate = $.j_ku(function() {with(this){
		t('div#author-profile')
		._t('div.picture')
			.__('img',{src:data.pictureUrl,alt:("a photo of " + data().name)})
		._t('div.details')
		.__t('h1.name',data().name)
		 ._t('h2.status',data().status)
		 ._t('p',data().blurb)
	}})

Now you can reuse the same template every object you pass to _authorTemplate_, and receive back your formatted content as a jquery object.

Here's how it would look if we had to present informations retrieved from the author section of the website:

	displayAuthor(id){
		$.getJSON("authors/"+id, function(json_data){
			$('div#author-profile').replaceWith(authorTemplate(json_data))
		})
	}

Tests
-----
The plugin comes with tests, I ran them on Safari(v4b) and Firefox(v3), but I could use some help on a couple of things:

* if someone can check them in IE I'd love to hear about it.

* j_ku fails a few tests. Most of the tests are about matching the resulting html of the jquery object that the function returns; but a few tests like that fail even though the html strings are the same. I'm really interested in finding a better way to test this.