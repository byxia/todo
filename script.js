window.onload = function(){
	var todoList = $('#todo-list');
	var hasStorage = false;
	var store;

	var emptyStore = {'items':[]}

	// used for checking if touch events exist
	var isEventSupported = (function(){
		var TAGNAMES = {
			'select':'input','change':'input',
			'submit':'form','reset':'form',
			'error':'img','load':'img','abort':'img'
		}
		function isEventSupported(eventName) {
			var el = document.createElement(TAGNAMES[eventName] || 'div');
			eventName = 'on' + eventName;
			var isSupported = (eventName in el);
			if (!isSupported) {
				el.setAttribute(eventName, 'return;');
				isSupported = typeof el[eventName] == 'function';
			}
			el = null;
			return isSupported;
		}
		return isEventSupported;
	})();

	//used for removing item from array by value
	function removeA(arr){
	    var what, a= arguments, L= a.length, ax;
	    while(L> 1 && arr.length){
	        what= a[--L];
	        while((ax= arr.indexOf(what))!= -1){
	            arr.splice(ax, 1);
	        }
	    }
	    return arr;
	}


	// read from store if possible
	if (typeof(localStorage)!=="undefined") {
		// localStorage.clear();
		hasStorage = true;
		store = localStorage["store"];

		// set empty store if none exist
		if (store == null){
			localStorage["store"]=JSON.stringify(emptyStore);
			store = localStorage["store"];
			// console.log(store);
			// console.log(JSON.parse(store));
		}
		store = JSON.parse(store);

		// read from store if store has items
		if (store.items.length>0){
			for (var i=0; i<store.items.length; i++){
				insertWithData(store.items[i]);
			}
			$('#todo-list .item').addClass('show');	
		}
    }
    else{
    	console.log("no local storage support");
    }


	// when pressing enter in textbox
	$("#todo-input").keyup(function(event){
	    if(event.keyCode == 13){
	    	insert();
	    }
	});


	// when press add button
	if (isEventSupported('touchend') === true){
		// console.log("touched");
		$("#add-btn").bind('touchend', function(){
			console.log("touch insert");
			insert();
		})
	}
	else{
		$("#add-btn").click(function(){
		    insert();
		});
	}

	function insert(){
		var input = $("#todo-input").val();		// save input
        $("#todo-input").val("");				// erase textbox display

        // save insert to localStorage if possible
        if (hasStorage === true){
        	store = JSON.parse(localStorage["store"]);
			store.items.push(input);
			localStorage["store"]=JSON.stringify(store);
        }

        //proceed only if input is valid
        if(input !== undefined && input.trim().length >0){
        	insertWithData(input);
        }
	}

	function insertWithData(input){
		// add item and animate
	    todoList.prepend("<div class='item'>"+input+"<div class='delete'>X</div></div>")
		setTimeout(function(){
			$('#todo-list .item').first().addClass('show');		
		}, 0);

		// bind delete event
		if (isEventSupported('touchend') === true){
			$('#todo-list .item').first().find('.delete').bind('touchend', function() {
        		// console.log("touch delete");
        		delItem($(this), input);
			});
		}
		else{
        	$('#todo-list .item').first().find('.delete').click(function() {
        		delItem($(this), input);
			});
		}
	}

	function delItem(item, value){
	    var item = item.parent();
		item.removeClass('show');
		setTimeout(function(){		// wait for animation before deleting
			item.remove();
    	}, 500);

		// remove item from localStorage
		if (hasStorage === true){
        	store = JSON.parse(localStorage["store"]);
			removeA(store.items, value);
			// console.log(store.items);
			localStorage["store"]=JSON.stringify(store);
        }
	}

	// console.log(isEventSupported);


}