const fixed_top = document.getElementById("fixed-top");
const top_trigger = document.getElementById("top-trigger");
const app_main = document.querySelector(".app-main");

function syncAppMainOffset(collapsed = fixed_top.style.transform === "translateY(calc(-100% - 20px))")
{
	if (!app_main) return;

	if (collapsed)
	{
		app_main.style.paddingTop = "28px";
		return;
	}

	const toolbarBottom = fixed_top.offsetTop + fixed_top.offsetHeight;
	app_main.style.paddingTop = Math.ceil(toolbarBottom + 22) + "px";
}

window.addEventListener("load", function() {
	syncAppMainOffset();
});

window.addEventListener("resize", function() {
	syncAppMainOffset();
});

function onTopClick()
{
	if (fixed_top.style.transform === "translateY(calc(-100% - 20px))")
	{
		fixed_top.style.transform = "";
		container.style.marginTop = "0px";
		top_trigger.innerHTML = "⌃";
		top_trigger.style.lineHeight = "";
		requestAnimationFrame(function() { syncAppMainOffset(false); });
	}
	else
	{
		fixed_top.style.transform = "translateY(calc(-100% - 20px))";
		container.style.marginTop = "10px";
		top_trigger.innerHTML = "⌄";
		top_trigger.style.lineHeight = "";
		syncAppMainOffset(true);
	}
}