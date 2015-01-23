var scup = {
	// function for get parameter
	// @name: qual é o parametro da url
	// @success: callback success
	// @error: callback error
	getParameterByName : function ( name ) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	// function for ordenation
	// @valJson: parameter need to compare
	// @reverse: type ordenation
	// @callBack: function
	checkResponse : function( valJson, reverse, callBack ){

		var funcCheck = callBack ?
		function(x) {return callBack(x[valJson])} :
		function(x) {return x[valJson]};

		reverse = [-1, 1][+!!reverse];

		return function (a, b) {
			return a = funcCheck(a), b = funcCheck(b), reverse * ((a > b) - (b > a));
		}

	},
	// call json
	callInfo : function ( ) {
		// Do verification if call URL success or error
		var paramiter = scup.getParameterByName('resultCall');
		var urlCall;

		if( paramiter === "success"){
			urlCall = "/js/json/success.json";
		} else {
			urlCall = "js/json/error.json";
		}

		$.ajax({
			dataType: "json",
			url: urlCall,
			success: function(result) {
				if(result.ok == true){
					// increases origianl position
					var position = $.map( result.data.table ,function(val, i){
						return valor = {
							"name" : val.name,
							"email" : val.email,
							"position" : i
						}
					});
					// check position
					var checkName = position.sort(scup.checkResponse('name', true, function(a){
						return a.toUpperCase();
					}));

					scup.listNames(checkName, result);
				} else {
					$('span.waiting').html(result.error);
				}
			},
			error: function(result) {
				$('span.waiting').html('Error loading list, try again.');

			}

		});
	},
	// Riding the expected list
	listNames : function ( list , result ) {
		// vars to append
		var contactList = $('div#list');
		var title = $('<h1 />');

		title.text(result.data.title);
		contactList.append(title);

		var dl = $('<dl />');
		// creates the ordered list
		$.map( list ,function(val, i){
			var dt = $('<dt />');
			var dd = $('<dd />');

			dt.html('Original position: ' + val.position);
			dl.append(dt)

			dd.html('<a href="mailto:' + val.email + '">' + val.name + '<a/>');
			dl.append(dd);

			contactList.append(dl);

			$('div#list span').addClass("hide");
		});
	}

}

scup.init = function () {
	scup.getParameterByName('resultCall');
	scup.callInfo('div#list');
}();