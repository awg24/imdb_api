$(document).ready(function(){
	var myClickedMovies = [];

	var routeConfig = {
		routes: {
			"":"home",
			"search/:query": "search"
		},

		home: function(){
			$(".page").hide();
			$("#home").show();
		},

		search: function(query){
			$(".page").hide();
			$("#search").show();
			$.get("http://www.omdbapi.com/", {s: query, type: "movie"},onReceivedMovies,"json");

		}
	}

	var app = Backbone.Router.extend(routeConfig);

	var myRoutes = new app();

	Backbone.history.start();

	$form = $("#form");
	$formSearch = $("#form-from-search");

	$form.on("submit", function(){
		var query = $("#movie-search").val();

		myRoutes.navigate("search/"+query, {trigger: true});
	});

	$formSearch.on("submit", function(){
		var query = $("#movie-search-from-search").val();

		myRoutes.navigate("search/"+query, {trigger: true});
	});

	function onReceivedMovies(movies){
		var html = "";
		var flag = false;
		var checkArray = [];

		if(myClickedMovies.length !== 0){
			for(var j = 0; j < myClickedMovies.length; j++){
				checkArray.push(myClickedMovies[j].title);
			}
		}

		for(var i = 0; i < movies.Search.length; i++){
			if(checkArray.indexOf(movies.Search[i].Title) !== -1){
				html += "<div class='movies set-opacity' id="+i+">"+movies.Search[i].Title+"</div><br>"
			} else {
				html += "<div class='movies' id="+i+">"+movies.Search[i].Title+"</div><br>"
			}
		}

		$("#show-results").html(html);
		
		var $movies = $(".movies").filter(":not(.set-opacity)");

		$movies.one("click", function(){
			var movieObject = {};
			movieObject.id = $(this).attr("id");
			movieObject.title = $(this).html();
			$(this).off("click", $(this).attr("id"));
			$(this).addClass("set-opacity");
			myClickedMovies.push(movieObject);
			console.log(myClickedMovies);
		});
	}
});