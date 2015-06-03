$(document).ready(function(){
	var myClickedMovies = [];

	var rowString = $("#movie-row").html();
	var resultRow = _.template(rowString);
	var rowStringWithOpacity = $("#movie-row-with-opacity").html();
	var resultRowWithOpacity = _.template(rowStringWithOpacity);
	var movieString = $("#movie-list").html();
	var resultmovieString = _.template(movieString);

	var routeConfig = {
		routes: {
			"":"home",
			"home":"home",
			"search/:query": "search",
			"watchlist": "watchList"
		},

		home: function(){
			$(".page").hide();
			var $title = $("#title");
			$title.html("IMDB movie search");
			$("#movie-search").val("");
			$("#home").show();
		},

		search: function(query){
			$(".page").hide();
			$("#go-to-watch-list").show();
			$("#movie-search-from-search").val(query);
			$("#search").fadeIn(2000);
			$.get("http://www.omdbapi.com/", {s: query, type: "movie"},onReceivedMovies,"json");

		},

		watchList: function(){
			$(".page").hide();
			$("#watch-list").show();
			$("#back").show();
			fillList();
		}
	}

	var app = Backbone.Router.extend(routeConfig);

	var myRoutes = new app();

	Backbone.history.start();

	$form = $("#form");
	$formSearch = $("#form-from-search");
	$watchList = $("#go-to-watch-list");
	$back = $("#back");

	$form.on("submit", function(){
		var query = $("#movie-search").val();

		myRoutes.navigate("search/"+query, {trigger: true});
	});

	$formSearch.on("submit", function(){
		var query = $("#movie-search-from-search").val();

		myRoutes.navigate("search/"+query, {trigger: true});
	});

	$watchList.on("click", function(){
		myRoutes.navigate("watchlist",{trigger: true});
	});

	$back.on("click", function(){
		myRoutes.navigate("home",{trigger:true});
	});

	function onReceivedMovies(movies){
		var html = "";
		var $title = $("#title");
		$title.html("IMDB movie search");
		var checkArray = [];

		if(myClickedMovies.length !== 0){
			for(var j = 0; j < myClickedMovies.length; j++){
				checkArray.push(myClickedMovies[j].title);
			}
		}

		for(var i = 0; i < movies.Search.length; i++){
			if(checkArray.indexOf(movies.Search[i].Title) !== -1){
				html += resultRowWithOpacity(movies.Search[i]);
			} else {
				html += resultRow(movies.Search[i]);
			}
		}

		$("#show-results").fadeIn(2000).html(html);

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

	function fillList(){
		var html = "";
		var $title = $("#title");
		$title.html("My Favorites");
		var $list = $("#the-movie-list");
		for(var i = 0; i < myClickedMovies.length; i++){
			html += resultmovieString(myClickedMovies[i]);
		}

		$list.fadeIn(2000).html(html);
	}
});















