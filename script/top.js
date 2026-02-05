const fixed_top = document.getElementById("fixed-top");
const top_trigger = document.getElementById("top-trigger");

function onTopClick()
{
	if (fixed_top.style.top == "" || fixed_top.style.top == "0%")
	{
		fixed_top.style.top = "-" + fixed_top.offsetHeight + "px";
		container.style.marginTop =  "10px";
		top_trigger.innerHTML = "↓";
		top_trigger.style.lineHeight = "25px";
	}
	else
	{
		fixed_top.style.top = "0%";
		container.style.marginTop = fixed_top.offsetHeight + 10 + "px";
		top_trigger.innerHTML = "^";
		top_trigger.style.lineHeight = "40px";
	}
}