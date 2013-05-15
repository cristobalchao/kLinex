/**
* klinex v0.9
*
*
* Copyright (c) 2013 Cristobal Chao
* MIT License
**/
(function( window, $, undefined ){

	function checkingLines(){
		var _currentPosition = $(this).scrollTop();

		for(var i = 0; i < $klinex.lines.length; i++){
			if (_currentPosition > $klinex.lines[i][0].startingOffsetTop - $klinex.offsetScroll){
				uploadLines($klinex.lines[i]);
			}
		}
	}

	$(window).on('scroll',function() {
		checkingLines();
	});

	function setupklinex(lines){

		//Styling new container
		$("<style type='text/css'> .klinex-container{ position: absolute;width: 100%;height: 100%;top: 0;} </style>").appendTo("head");
		$("<style type='text/css'> .klinex-point{ position:absolute;width:"+$klinex.size+"px;height:"+$klinex.size+"px;z-index:9990;background:"+$klinex.color+"} </style>").appendTo("head");

		var branches = [];
		
		for(var i = 0; i < lines.length; i++){

			var line = lines[i],
				idContainer = "klinex" + i,
				container = $('<div id=' + idContainer + ' class="klinex-container"></div>');

			container.appendTo($klinex.container);

			for(var j = 0; j < line.length-1; j++){

				var idPoint = idContainer+"_point" + j,
					newPoint = $('<div id=' + idPoint + ' class="klinex-point"></div>');

				newPoint.appendTo('#' + idContainer);  //Change Container

				var branch = {

					startingOffsetTop : 0,

					startingPoint : {
						x : line[j].x,
						y : line[j].y
					},

					endPoint : {
						x : line[j+1].x,
						y : line[j+1].y
					},

					dynamicPoint : {
						x : 0,
						y : 0
					},

					object : null

				}

				branch.object = $('#'+idPoint);

				if ( branch.startingPoint.x > branch.endPoint.x ){

					branch.object.css({'right' : parseFloat($klinex.container.width()) - branch.startingPoint.x - branch.object.width(), 'top' : branch.startingPoint.y});

				}else{

					branch.object.css({'left' : branch.startingPoint.x, 'top' : branch.startingPoint.y});

				}

				branch.startingOffsetTop = parseFloat(branch.object.offset().top);

				branches.push(branch);

			}

			$klinex.lines.push(branches);

		}

	}

	function uploadLines(branches){

		if (!!branches[$klinex.currentBranch]){

			var branch = branches[$klinex.currentBranch],
			controlXAxis = branch.startingPoint.x !== branch.endPoint.x,
			controlYAxis = branch.startingPoint.y !== branch.endPoint.y;

			branch.dynamicPoint.y = $(window).scrollTop() - branch.startingOffsetTop + $klinex.offsetScroll;

			if ( branch.dynamicPoint.y >= branch.endPoint.y - branch.startingPoint.y ){

				branch.dynamicPoint.y = branch.endPoint.y - branch.startingPoint.y;

				branch.dynamicPoint.x = branch.endPoint.x - branch.startingPoint.x > 0 ? branch.endPoint.x - branch.startingPoint.x : branch.startingPoint.x - branch.endPoint.x

				$klinex.currentBranch++;

				uploadLines(branches);

			}

			if (controlXAxis){

				branch.object.css({'width':branch.dynamicPoint.x});

			}else if (controlYAxis){

				branch.object.css({'height':branch.dynamicPoint.y});

			}

		}

	}

	// *** klinex START ***
	$.fn.klinex = function(args) {
		var $this = this,
			_lines = args.lines,
			_size = (!!args.size) && args.size || "1",
			_color = (!!args.color) && args.color || "#FFF",
			_offsetScroll = args.offsetScroll;

		$klinex = {
			container: $this,
			lines : [],
			color : _color,
			size : _size,
			offsetScroll : args.offsetScroll,
			currentBranch : 0
		}

		setupklinex(_lines);

		return true;

	}

})( window, jQuery );