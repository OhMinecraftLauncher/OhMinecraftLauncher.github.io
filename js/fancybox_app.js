$(document).ready(function() {
	$('.fancybox').fancybox();
	$(".various").fancybox({
		maxWidth	: 360,
		maxHeight	: 485,
		fitToView	: false,
		width		: '100%',
		height		: '100%',
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none',
		title:  null,
		padding:0
	});
	$(".various2").fancybox({
		maxWidth	: 360,
		maxHeight	: 560,
		fitToView	: false,
		width		: '100%',
		height		: '100%',
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none',
		title:  null,
		padding:0
	});
});