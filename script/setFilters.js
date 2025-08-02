let oldmain = "";
let oldally = "";

function onMainChanged(val)
{
	if (oldmain != "")
	{
		removeOrFilterByFilter("Country","json.faction",oldmain);
		removeOrFilterByFilter("Country","json.exile",oldmain);
	}
	switch(val)
	{
		case "0":
			oldmain = "";
			break;
		case "1":
			addOrFilter("Country","json.faction","Germany");
			addOrFilter("Country","json.exile","Germany");
			oldmain = "Germany";
			break;
		case "2":
			addOrFilter("Country","json.faction","Britain");
			addOrFilter("Country","json.exile","Britain");
			oldmain = "Britain";
			break;
		case "3":
			addOrFilter("Country","json.faction","Japan");
			addOrFilter("Country","json.exile","Japan");
			oldmain = "Japan";
			break;
		case "4":
			addOrFilter("Country","json.faction","Soviet");
			addOrFilter("Country","json.exile","Soviet");
			oldmain = "Soviet";
			break;
		case "5":
			addOrFilter("Country","json.faction","USA");
			addOrFilter("Country","json.exile","USA");
			oldmain = "USA";
			break;
	}
}

function onAllyChanged(val)
{
	if (oldally != "")
	{
		removeOrFilterByFilter("Country","json.faction",oldally);
		removeOrFilterByFilter("Country","json.exile",oldally);
	}
	switch(val)
	{
		case "0":
			oldally = "";
			break;
		case "1":
			addOrFilter("Country","json.faction","Germany");
			addOrFilter("Country","json.exile","Germany");
			oldally = "Germany";
			break;
		case "2":
			addOrFilter("Country","json.faction","Britain");
			addOrFilter("Country","json.exile","Britain");
			oldally = "Britain";
			break;
		case "3":
			addOrFilter("Country","json.faction","Japan");
			addOrFilter("Country","json.exile","Japan");
			oldally = "Japan";
			break;
		case "4":
			addOrFilter("Country","json.faction","Soviet");
			addOrFilter("Country","json.exile","Soviet");
			oldally = "Soviet";
			break;
		case "5":
			addOrFilter("Country","json.faction","USA");
			addOrFilter("Country","json.exile","USA");
			oldally = "USA";
			break;
		case "6":
			addOrFilter("Country","json.faction","France");
			addOrFilter("Country","json.exile","France");
			oldally = "France";
			break;
		case "7":
			addOrFilter("Country","json.faction","Italy");
			addOrFilter("Country","json.exile","Italy");
			oldally = "Italy";
			break;
		case "8":
			addOrFilter("Country","json.faction","Poland");
			addOrFilter("Country","json.exile","Poland");
			oldally = "Poland";
			break;
		case "9":
			addOrFilter("Country","json.faction","Finland");
			addOrFilter("Country","json.exile","Finland");
			oldally = "Finland";
			break;
	}
}

function onReditsChanged(val)
{
	if (val === "-1")
	{
		document.getElementById("ReditsInput").value = "";
		removeAndFilter("json.kredits");
		return;
	}
	if (val === "")
	{
		removeAndFilter("json.kredits");
		return;
	}
	addAndFilter("json.kredits",parseInt(val));
}

function onReservedChanged(val)
{
	removeOrFilterByGroup("Reserved");
	removeOrFilterByGroup("OnlySpawnable");
	switch (val)
	{
		case "0":
			break;
		case "1":
			addOrFilter("Reserved","json.reserved",false);
			addOrFilter("OnlySpawnable","json.set","OnlySpawnable",false,true);
			break;
		case "2":
			addOrFilter("Reserved","json.reserved",true);
			addOrFilter("OnlySpawnable","json.set","OnlySpawnable",false,true);
			break;
		case "3":
			addOrFilter("OnlySpawnable","json.set","OnlySpawnable");
			break;
	}
}

function onRarityChanged(val)
{
	if (val === "All")
	{
		removeAndFilter("json.rarity");
	}
	else
	{
		addAndFilter("json.rarity",val);
	}
}

function onTypeChanged(val)
{
	if (val === "All")
	{
		removeAndFilter("json.type");
	}
	else
	{
		addAndFilter("json.type",val);
	}
}

function onSearchChanged(val)
{
	removeOrFilterByGroup("Search");
	if (val != "")
	{
		addOrFilter("Search","json.title.zh-Hans",val,true);
		addOrFilter("Search","json.title.zh-Hant",val,true);
		addOrFilter("Search","json.title.en-EN",val,true);
		addOrFilter("Search","json.text.zh-Hans",val,true);
		addOrFilter("Search","json.text.zh-Hant",val,true);
		addOrFilter("Search","json.text.en-EN",val,true);
	}
}

function onSearchClick()
{
	document.getElementById("Search").value = "";
	onSearchChanged("");
}

function onRemoveAllFilterClick()
{
	document.getElementById("Main").value = "0";
	onMainChanged("0");
	document.getElementById("Ally").value = "0";
	onAllyChanged("0");
	document.getElementById("ReditsInput").value = "";
	onReditsChanged("");
	document.getElementById("Reserved").value = "0";
	onReservedChanged("0");
	document.getElementById("Rarity").value = "All";
	onRarityChanged("All");
	document.getElementById("Type").value = "All";
	onTypeChanged("All");
	onSearchClick();
}