let oldmain = "";
let oldally = "";
const allyandfilter = {"path":"json.rarity","value":"Elite","contain":false,"no":true};
const onlyspwanableandfilter = {"path":"json.set","value":"Special","contain":false,"no":true};

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
		removeOrFilterByFilter("Country","json.faction",oldally,false,false,allyandfilter);
		removeOrFilterByFilter("Country","json.exile",oldally,false,false,allyandfilter);
	}
	switch(val)
	{
		case "0":
			oldally = "";
			break;
		case "1":
			addOrFilter("Country","json.faction","Germany",false,false,allyandfilter);
			addOrFilter("Country","json.exile","Germany",false,false,allyandfilter);
			oldally = "Germany";
			break;
		case "2":
			addOrFilter("Country","json.faction","Britain",false,false,allyandfilter);
			addOrFilter("Country","json.exile","Britain",false,false,allyandfilter);
			oldally = "Britain";
			break;
		case "3":
			addOrFilter("Country","json.faction","Japan",false,false,allyandfilter);
			addOrFilter("Country","json.exile","Japan",false,false,allyandfilter);
			oldally = "Japan";
			break;
		case "4":
			addOrFilter("Country","json.faction","Soviet",false,false,allyandfilter);
			addOrFilter("Country","json.exile","Soviet",false,false,allyandfilter);
			oldally = "Soviet";
			break;
		case "5":
			addOrFilter("Country","json.faction","USA",false,false,allyandfilter);
			addOrFilter("Country","json.exile","USA",false,false,allyandfilter);
			oldally = "USA";
			break;
		case "6":
			addOrFilter("Country","json.faction","France",false,false,allyandfilter);
			addOrFilter("Country","json.exile","France",false,false,allyandfilter);
			oldally = "France";
			break;
		case "7":
			addOrFilter("Country","json.faction","Italy",false,false,allyandfilter);
			addOrFilter("Country","json.exile","Italy",false,false,allyandfilter);
			oldally = "Italy";
			break;
		case "8":
			addOrFilter("Country","json.faction","Poland",false,false,allyandfilter);
			addOrFilter("Country","json.exile","Poland",false,false,allyandfilter);
			oldally = "Poland";
			break;
		case "9":
			addOrFilter("Country","json.faction","Finland",false,false,allyandfilter);
			addOrFilter("Country","json.exile","Finland",false,false,allyandfilter);
			oldally = "Finland";
			break;
	}
}

function onFacChanged(val)
{
	removeOrFilterByGroup("Fac");
	switch(val)
	{
		case "0":
			break;
		case "1":
			addOrFilter("Fac","json.faction","Germany");
			addOrFilter("Fac","json.exile","Germany");
			break;
		case "2":
			addOrFilter("Fac","json.faction","Britain");
			addOrFilter("Fac","json.exile","Britain");
			break;
		case "3":
			addOrFilter("Fac","json.faction","Japan");
			addOrFilter("Fac","json.exile","Japan");
			break;
		case "4":
			addOrFilter("Fac","json.faction","Soviet");
			addOrFilter("Fac","json.exile","Soviet");
			break;
		case "5":
			addOrFilter("Fac","json.faction","USA");
			addOrFilter("Fac","json.exile","USA");
			break;
		case "6":
			addOrFilter("Fac","json.faction","France");
			addOrFilter("Fac","json.exile","France");
			break;
		case "7":
			addOrFilter("Fac","json.faction","Italy");
			addOrFilter("Fac","json.exile","Italy");
			break;
		case "8":
			addOrFilter("Fac","json.faction","Poland");
			addOrFilter("Fac","json.exile","Poland");
			break;
		case "9":
			addOrFilter("Fac","json.faction","Finland");
			addOrFilter("Fac","json.exile","Finland");
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
			addOrFilter("OnlySpawnable","json.set","OnlySpawnable",false,true,onlyspwanableandfilter);
			break;
		case "2":
			addOrFilter("Reserved","json.reserved",true);
			addOrFilter("OnlySpawnable","json.set","OnlySpawnable",false,true,onlyspwanableandfilter);
			break;
		case "3":
			addOrFilter("OnlySpawnable","json.set","OnlySpawnable");
			addOrFilter("OnlySpawnable","json.set","Special");
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

function onSSetChanged(val)
{
	if (val === "All")
	{
		removeAndFilter("json.set");
	}
	else
	{
		addAndFilter("json.set",val);
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
		addOrFilter("Search","importId",val,true);
		addOrFilter("Search","json.id",val,true);
	}
}

function onSearchClick()
{
	document.getElementById("Search").value = "";
	onSearchChanged("");
}

function onRemoveAllFilterClick()
{
	/*
	 = "0";
	onMainChanged("0");
	document.getElementById("Ally").value = "0";
	onAllyChanged("0");
	*/
	document.getElementById("Fac").value = "0";
	onFacChanged("0");
	document.getElementById("ReditsInput").value = "";
	onReditsChanged("");
	document.getElementById("Reserved").value = "0";
	onReservedChanged("0");
	document.getElementById("Rarity").value = "All";
	onRarityChanged("All");
	document.getElementById("Type").value = "All";
	onTypeChanged("All");
	document.getElementById("SSet").value = "All";
	onSSetChanged("All");
	const attr_Inputs =  document.querySelectorAll(".attr_Input");
	attr_Inputs.forEach((attr_Input) => {
		attr_Input.checked = false;
	});
	orFilters = [];
	andFilters = [];
	onSearchClick();
	onMainChanged(document.getElementById("Main").value);
	onAllyChanged(document.getElementById("Ally").value);
}

function onAttributesClicked(val)
{
	if (val.checked)
	{
		if (val.name.startsWith("intel"))
		{
			addOrFilter("attr_intel","json.attributes",val.name,true);
		}
		else if (val.name.startsWith("heavyArmor"))
		{
			addOrFilter("attr_heavyArmor","json.attributes",val.name,true);
		}
		else if (val.name.includes("Veteran"))
		{
			addOrFilter("attr_Veteran","json.attributes",val.name,true);
		}
		else
		{
			addAndFilter("json.attributes",val.name,true,false,false);
		}
	}
	else
	{
		if (val.name.startsWith("intel"))
		{
			removeOrFilterByFilter("attr_intel","json.attributes",val.name,true);
		}
		else if (val.name.startsWith("heavyArmor"))
		{
			removeOrFilterByFilter("attr_heavyArmor","json.attributes",val.name,true);
		}
		else if (val.name.includes("Veteran"))
		{
			removeOrFilterByFilter("attr_Veteran","json.attributes",val.name,true);
		}
		else
		{
			removeAndFilter("json.attributes",val.name);
		}
	}
}


const AttributeChooseModal = document.getElementById("AttributeChooseModal");
const closeBtn3 = document.getElementById("closeBtn3");

function onSetAttrButtonClicked()
{
	AttributeChooseModal.style.display = "block";
}

function closeAttrModal()
{
	AttributeChooseModal.style.display = "none";
}

closeBtn3.addEventListener("click",function() {
	closeAttrModal();
});

window.addEventListener('click', function(event) {
    if (event.target === AttributeChooseModal) {
		closeAttrModal();
    }
});