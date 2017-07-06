$(document).ready(function()
{
	// Переменные для рендеринга.
	var x_TileRes = 256, y_TileRes = 256, zoom = 1,	rendInterval;
	
	// Переменные для перемещения полотна.
	var mouseIsDown = false, x_mouseDowned = -1, y_mouseDowned = -1, div_top, div_left;
	
	// Переменные для зума.
	var zooming = false, mouseX_withinMainbox, mouseY_withinMainbox,pinch_old_dist = 0;
	
	// Функции.
		
	function render(changeCanvas = false, left, top, scale)
	{
		if( $("#map[z='"+ parseInt(zoom) +"']").length == 0)
			$("#mainbox").append('<div id="map" z="'+ parseInt(zoom) +'" style="'+ (changeCanvas ? "display: none;" : "") +'" ></div>');
			
		if(changeCanvas)
		{
			$("#map[z='" + parseInt(zoom) + "']").css({left: left + "px", top: top + "px"});
			$("#map[z='" + parseInt(zoom) + "']").animate({scale: scale}, 0);
		}
		
		var x_StartTile = Math.ceil( (( ($("#map[z='" + parseInt(zoom) + "']").position().left * parseInt(zoom)) / x_TileRes ) +  zoom) / zoom * -1), 
			y_StartTile = Math.ceil( (( ($("#map[z='" + parseInt(zoom) + "']").position().top * parseInt(zoom)) / y_TileRes ) +  zoom) / zoom * -1),
			x_needTiles = Math.ceil(($("#mainbox").width() * parseInt(zoom)) / x_TileRes) + zoom, 
			y_needTiles = Math.ceil(($("#mainbox").height() * parseInt(zoom)) / y_TileRes) + zoom;
		
		x_StartTile = x_StartTile < 0 ? 0 : x_StartTile;
		y_StartTile = y_StartTile < 0 ? 0 : y_StartTile;
		

			
		$("#map[z='" + parseInt(zoom) + "'] img").each(function(i, element)
		{
			var x = parseInt($(this).attr("x")), y = parseInt($(this).attr("y"));
			if(y < y_StartTile || x < x_StartTile || y > (y_needTiles + y_StartTile) || x > (x_needTiles + x_StartTile))
				$(this).remove();
		});
		
		for(var x = x_StartTile; x < x_needTiles + x_StartTile; x++)
			for(var y = y_StartTile; y < y_needTiles + y_StartTile; y++)
				if( $("#map[z='" + parseInt(zoom) + "'] img[x='" + (x) + "'][y='" + (y) + "']").length == 0 )
					//$("#map[z='" + parseInt(zoom) + "']").append('<img class="tiles"  x="' + (x) + '" y="' + (y) + '" src="tiles/'+ parseInt(zoom) +'/tile' + (x) + '_' + (y) + '.png" style="left: '+ (x * x_TileRes) / parseInt(zoom) +'px; top: '+ (y * y_TileRes) / parseInt(zoom) +'px; width: '+ x_TileRes / parseInt(zoom) +'px; height: '+ y_TileRes / parseInt(zoom) +'px;" />');
					$("#map[z='" + parseInt(zoom) + "']").append('<img class="tiles"  x="' + (x) + '" y="' + (y) + '" src="tiles/'+ parseInt(zoom) +'/tile' + (x) + '_' + (y) + '.png" style="left: '+ (x * x_TileRes) / parseInt(zoom) +'px; top: '+ (y * y_TileRes) / parseInt(zoom) +'px; " />');
		$(".tiles").fadeIn(250);
				
	}
		
	render();

	// События.
	
	$(document).mouseup(function()
	{
      mouseIsDown = false;
	  clearInterval(rendInterval);
	  render();
	  x_mouseDowned = -1; 
	  y_mouseDowned = -1;
	}).on({ 'touchend' : function(){ 
      mouseIsDown = false;
	  clearInterval(rendInterval);
	  render();
	  x_mouseDowned = -1; 
	  y_mouseDowned = -1;
	 } 
	}).mousemove(function(e)
	{
		var mainboxOffset = $("#mainbox").offset();
		mouseX_withinMainbox = e.clientX - mainboxOffset.left;
		mouseY_withinMainbox = e.clientY - mainboxOffset.top;
			
		if(mouseIsDown)
		{
			if(x_mouseDowned == -1 || y_mouseDowned == -1)
			{
				x_mouseDowned = e.clientX;
				y_mouseDowned = e.clientY;
			}
			if(x_mouseDowned != -1 && y_mouseDowned != -1)
			{
				$("#map[z='" + parseInt(zoom) + "']").css("top", div_top - (y_mouseDowned - e.clientY));
				$("#map[z='" + parseInt(zoom) + "']").css("left", div_left - (x_mouseDowned - e.clientX));
			}				
		}
    }).bind('touchmove',function(e)
	{
		if(e.originalEvent.touches.length<=1){
		var mainboxOffset = $("#mainbox").offset();
		mouseX_withinMainbox = e.originalEvent.touches[0].clientX - mainboxOffset.left;
		mouseY_withinMainbox = e.originalEvent.touches[0].clientY - mainboxOffset.top;
			
		if(mouseIsDown)
		{
			if(x_mouseDowned == -1 || y_mouseDowned == -1)
			{
				x_mouseDowned = e.originalEvent.touches[0].clientX;
				y_mouseDowned = e.originalEvent.touches[0].clientY;
			}
			if(x_mouseDowned != -1 && y_mouseDowned != -1)
			{
				$("#map[z='" + parseInt(zoom) + "']").css("top", div_top - (y_mouseDowned - e.originalEvent.touches[0].clientY));
				$("#map[z='" + parseInt(zoom) + "']").css("left", div_left - (x_mouseDowned - e.originalEvent.touches[0].clientX));
			}				
		}
	}else{

		pinch_distance=sqrt((e.originalEvent.touches[0].clientX-e.originalEvent.touches[1].clientX)*(e.originalEvent.touches[0].clientX-e.originalEvent.touches[1].clientX)+(e.originalEvent.touches[0].clientY-e.originalEvent.touches[1].clientY)*(e.originalEvent.touches[0].clientY-e.originalEvent.touches[1].clientY));
		if (pinch_distance<pinch_old_dist){
			if (zoom > 1)
				{
					zooming = true;
					zoom-=0.5;				
					isZoomedFlag = true;
				}

		}else if (pinch_distance>old_dist) {
			if (zoom < 2.5)
				{
					zooming = true;
					zoom+=0.5;
					isZoomedFlag = true;
				}

		}
		pinch_old_dist=pinch_distance;
		if(isZoomedFlag)
			{
			
				var changeCanvas = (parseInt(zoom) != parseInt(old_zoom)) ? true : false,
					x_buffer = mouseX_withinMainbox,
					y_buffer = mouseY_withinMainbox,
					left_new = (((($("#map[z='" + (changeCanvas ? parseInt(old_zoom) : parseInt(zoom)) + "']").position().left * -1) + x_buffer) / old_zoom) * zoom - x_buffer) * -1,
					top_new = (((($("#map[z='" + (changeCanvas ? parseInt(old_zoom) : parseInt(zoom)) + "']").position().top * -1) + y_buffer) / old_zoom) * zoom - y_buffer) * -1;
				
				
				if(changeCanvas && parseInt(zoom) < parseInt(old_zoom))
				{
					
					render(true, $("#map[z='" + parseInt(old_zoom) + "']").position().left, $("#map[z='" + parseInt(old_zoom) + "']").position().top, old_zoom);
					$("#map[z='" + parseInt(zoom) + "']").fadeIn(400);
					$("#map[z='" + parseInt(old_zoom) + "']").fadeOut(400);
				}
				
				$("#map[z='" + (changeCanvas && parseInt(zoom) > parseInt(old_zoom) ? parseInt(old_zoom) : parseInt(zoom)) + "']")
				.animate({left: left_new + "px", top: top_new + "px", scale: zoom}, 300, 'easeOutCubic', function()
				{
					if(changeCanvas)
					{
						if(parseInt(zoom) > parseInt(old_zoom))
						{
							render(true, left_new, top_new, zoom);
							setTimeout(function()
							{
								$("#map[z='" + parseInt(zoom) + "']").fadeIn(400);
								$("#map[z='" + parseInt(old_zoom) + "']").fadeOut(400);
							}, 50);
							
						}
					}
					render();
					zooming = false;
				});
				
			}

	}
});
	
	$("#mainbox").mousedown(function(e)
	{
      mouseIsDown = true;
	  rendInterval = setInterval(render, 250);
	  div_top = $("#map[z='" + parseInt(zoom) + "']").position().top;
	  div_left = $("#map[z='" + parseInt(zoom) + "']").position().left;
	  return false;
	}).on({ 'touchstart' : function(){ 
	  mouseIsDown = true;
	  rendInterval = setInterval(render, 250);
	  div_top = $("#map[z='" + parseInt(zoom) + "']").position().top;
	  div_left = $("#map[z='" + parseInt(zoom) + "']").position().left;
	  return false;
	 } 
	}).mousewheel(function(event, delta, deltaX, deltaY)
	{
		if(!mouseIsDown && !zooming)
		{
			var isZoomedFlag = false, old_zoom = zoom;
			if(delta > 0)
			{
				if (zoom < 2.5)
				{
					zooming = true;
					zoom+=0.5;
					isZoomedFlag = true;
				}
			}
			else if(delta < 0)
			{
				if (zoom > 1)
				{
					zooming = true;
					zoom-=0.5;				
					isZoomedFlag = true;
				}
			}
			
			if(isZoomedFlag)
			{
			
				var changeCanvas = (parseInt(zoom) != parseInt(old_zoom)) ? true : false,
					x_buffer = mouseX_withinMainbox,
					y_buffer = mouseY_withinMainbox,
					left_new = (((($("#map[z='" + (changeCanvas ? parseInt(old_zoom) : parseInt(zoom)) + "']").position().left * -1) + x_buffer) / old_zoom) * zoom - x_buffer) * -1,
					top_new = (((($("#map[z='" + (changeCanvas ? parseInt(old_zoom) : parseInt(zoom)) + "']").position().top * -1) + y_buffer) / old_zoom) * zoom - y_buffer) * -1;
				
				
				if(changeCanvas && parseInt(zoom) < parseInt(old_zoom))
				{
					
					render(true, $("#map[z='" + parseInt(old_zoom) + "']").position().left, $("#map[z='" + parseInt(old_zoom) + "']").position().top, old_zoom);
					$("#map[z='" + parseInt(zoom) + "']").fadeIn(400);
					$("#map[z='" + parseInt(old_zoom) + "']").fadeOut(400);
				}
				
				$("#map[z='" + (changeCanvas && parseInt(zoom) > parseInt(old_zoom) ? parseInt(old_zoom) : parseInt(zoom)) + "']")
				.animate({left: left_new + "px", top: top_new + "px", scale: zoom}, 300, 'easeOutCubic', function()
				{
					if(changeCanvas)
					{
						if(parseInt(zoom) > parseInt(old_zoom))
						{
							render(true, left_new, top_new, zoom);
							setTimeout(function()
							{
								$("#map[z='" + parseInt(zoom) + "']").fadeIn(400);
								$("#map[z='" + parseInt(old_zoom) + "']").fadeOut(400);
							}, 50);
							
						}
					}
					render();
					zooming = false;
				});
				
			}
			
		}
		return false;
	});
		
});