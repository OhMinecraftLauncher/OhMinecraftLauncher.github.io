const deck = document.getElementById("deck");
const Deck_Card_Count = document.getElementById("Deck_Card_Count");
const RemoveDeck = document.getElementById("RemoveDeck");
const ShowDeck = document.getElementById("ShowDeck");
const Main = document.getElementById('Main');
const Ally = document.getElementById('Ally');

var cCards = {};
var old_cCards = {};
var allowE = false;

function onAllowErrorClicked(val)
{
	allowE = !allowE;
	loadDeck();
}

function onCardsBeClicked(jsonText)
{
	if (cCards[jsonText] === undefined)
	{
		cCards[jsonText] = 1;
	}
	else
	{
		cCards[jsonText] = cCards[jsonText] + 1;
	}
	count++;
	if (checkDeck())
	{
		old_cCards = JSON.parse(JSON.stringify(cCards));
		loadDeck();
	}
	else
	{
		cCards = JSON.parse(JSON.stringify(old_cCards));
		count--;
	}
}

function checkDeck()
{
	if (!allowE)
	{
		var keys = Object.keys(cCards);
		if (count > 39)
		{
			showTemporaryMessage("卡组已满或过大","warning");
			return false;
		}
		try
		{
			var factions = [];
			var elite_factions = [];
			var AllyCardCount = 0;
			keys.forEach((key) => {
				if (cCards[key] <= 0)
				{
					return;
				}
				var k = JSON.parse(key);
				if (k.json.set === "OnlySpawnable")
				{
					throw new Error("HaveSpab");
				}
				var IsMainCard = false;
				var IsAllyCard = false;
				if (oldmain !== "")
				{
					if (oldmain === k.json.faction)
					{
						IsMainCard = true;
					}
					if (oldmain === k.json.exile)
					{
						IsMainCard = true;
					}
				}
				if (oldally !== "")
				{
					if (oldally === k.json.faction)
					{
						IsAllyCard = true;
					}
					if (oldally === k.json.exile)
					{
						IsAllyCard = true;
					}
				}
				if (oldmain === "" && oldally === "") IsMainCard = true;
				if (!IsMainCard && !IsAllyCard)
				{
					throw new Error("NotMACard");
				}
				else
				{
					if (!IsMainCard && IsAllyCard)
					{
						AllyCardCount += cCards[key];
					}
				}
				if (AllyCardCount > 12)
				{
					throw new Error("MuchAlly");
				}
				switch (k.json.rarity)
				{
					case "Standard":
						if (cCards[key] >= 5)
						{
							throw new Error("MuchACard");
						}
						break;
					case "Limited":
						if (cCards[key] >= 4)
						{
							throw new Error("MuchACard");
						}
						break;
					case "Special":
						if (cCards[key] >= 3)
						{
							throw new Error("MuchACard");
						}
						break;
					case "Elite":
						if (cCards[key] >= 2)
						{
							throw new Error("MuchACard");
						}
						if ((oldmain !== "") && (k.json.faction !== oldmain))
						{
							throw new Error("NotMEli");
						}
						var IsinElFacArr = false;
						elite_factions.forEach((el_fac) => {
							if (el_fac === k.json.faction)
							{
								IsinElFacArr = true;
							}
							if (el_fac === k.json.exile)
							{
								IsinElFacArr = true;
							}
						})
						if (!IsinElFacArr)
						{
							elite_factions.push(k.json.faction);
						}
						break;
				}
				var IsinFacArr = false;
				factions.forEach((fac) => {
					if (fac === k.json.faction)
					{
						IsinFacArr = true;
					}
					if (fac === k.json.exile)
					{
						IsinFacArr = true;
					}
				});
				if (!IsinFacArr)
				{
					factions.push(k.json.faction);
				}
				if (factions.length >= 3)
				{
					throw new Error("MuchFac");
				}
				if (elite_factions.length >= 2)
				{
					throw new Error("MuchEliFac");
				}
			});
		}
		catch (e)
		{
			if (e.message === "HaveSpab")
			{
				showTemporaryMessage("这张卡不能被放入卡组","warning");
			}
			else if (e.message === "MuchACard")
			{
				showTemporaryMessage("没有更多这张卡了","warning");
			}
			else if (e.message === "MuchFac")
			{
				showTemporaryMessage("一套卡组中不能同时包含超过两个国家的卡牌","warning");
			}
			else if (e.message === "MuchEliFac")
			{
				showTemporaryMessage("一套卡组中不能同时包含超过一个国家的精英卡牌","warning");
			}
			else if (e.message === "NotMACard")
			{
				showTemporaryMessage("卡组中的某些卡牌或所点击的卡牌不是所选的主国或盟国的卡牌","warning");
			}
			else if (e.message === "NotMEli")
			{
				showTemporaryMessage("卡组中的某些卡牌或所点击的卡牌不是所选主国的精英卡牌（卡组中不能有盟国的精英卡）","warning");
			}
			else if (e.message === "MuchAlly")
			{
				showTemporaryMessage("盟国卡太多（超过了12张）","warning");
			}
			else
			{
				throw e;
			}
			return false;
		}
		return true;
	}
	else
	{
		return true;
	}
}

function onDeckCardsBeClicked(jsonText)
{
	cCards[jsonText] = cCards[jsonText] - 1;
	old_cCards = JSON.parse(JSON.stringify(cCards));
	count--;
	loadDeck();
}

function loadDeck()
{
	Deck_Card_Count.innerHTML = ( count + 1 ).toString() + " / 40";
	updateBadge(count);
	if (count > 0)
	{
		RemoveDeck.style.display = "";
		ShowDeck.style.display = "";
	}
	else
	{
		RemoveDeck.style.display = "none";
		ShowDeck.style.display = "none";
	}
	var childs = deck.childNodes;
	for(var i = childs.length - 1; i >= 0; i--) { 
	  deck.removeChild(childs[i]); 
	}
	Object.keys(cCards).sort((a,b) =>
	{
		return JSON.parse(a).json.kredits - JSON.parse(b).json.kredits;
	}).forEach((item) => 
	{
		if (cCards[item] <= 0)
		{
			return;
		}
		const deck_card_board = document.createElement("div");
		deck_card_board.className = "deck-card-board";
		deck_card_board.name = item;
		deck_card_board.onclick = function () {
			onDeckCardsBeClicked(this.name);
		};
		j = JSON.parse(item);
		var bodycolor = "#232323";
		switch (j.json.faction)
		{
			case "Germany":
				bodycolor = "#5e6965";
				break;
			case "Britain":
				bodycolor = "#988d70";
				break;
			case "Japan":
				bodycolor = "#9c7e3f";
				break;
			case "Soviet":
				bodycolor = "#645441";
				break;
			case "USA":
				bodycolor = "#656d50";
				break;
			case "France":
				bodycolor = "#505b7b";
				break;
			case "Italy":
				bodycolor = "#686867";
				break;
			case "Poland":
				bodycolor = "#686251";
				break;
			case "Finland":
				bodycolor = "#babaab";
				break;
		}
		var countcolor = "#3d3d3a";
		switch (j.json.rarity)
		{
			case "Standard":
				countcolor = "#707170";
				break;
			case "Limited":
				countcolor = "#9c754f";
				break;
			case "Special":
				countcolor = "#919291";
				break;
			case "Elite":
				countcolor = "#b57834";
				break;
		}
			deck_card_board.innerHTML = 
				"<div class=\"deck-card-kredits-board\"><span class=\"deck-card-kredits-text\">" + 
				j.json.kredits +
				(
					j.json.operationCost === undefined ? 
					"<sup><span class=\"K-text\">K</span></sup>"
					: 
					("<span class=\"deck-card-kredits-subp\"><sup><span class=\"K-text\">K</span></sup><sub><span class=\"op-text\">" + 
					j.json.operationCost + 
					"</span> </sub></span>")
				) + 
				"</span></div><div class=\"deck-card-body-board\" style=\"background-color: " + bodycolor + "\"><span class=\"deck-card-body-text\" style=\"width: " + (j.json.reserved ? "120" : "143") + "px\">" + 
				j.json.title["zh-Hans"] + 
				"</span>" + (j.json.reserved ? "<img src=\"images/icon/reserved.svg\">" : "") + "<img src=\"" + 
				"images/icon/" + j.json.faction.toLowerCase() + ".svg" + 
				"\"></div><div class=\"deck-card-thumb\"><img src=\"" + 
				CDN_URL + j.thumbUrl + 
				"\" alt=\"" + 
				j.json.title["zh-Hans"] + 
				"\"></div><div class=\"deck-card-count-board\" style=\"background-color: " + countcolor + "\">" + 
				"x" + cCards[item] + 
				"</div>";
		deck.appendChild(deck_card_board);
	});
}

function onDeckRemoveClick()
{
	cCards = {};
	old_cCards = {};
	count = 0;
	loadDeck();
}

function Export()
{
	if (oldmain === "" || oldally === "")
	{
		showTemporaryMessage("请先选择主国和盟国","warning");
		return "";
	}
	if (checkDeck())
	{
		var one = "";
		var two = "";
		var three = "";
		var four = "";
		Object.keys(cCards).forEach((key) => {
			if (cCards[key] <= 0)
			{
				return;
			}
			var key_Card_count = cCards[key];
			var k = JSON.parse(key);
			while (key_Card_count > 0)
			{
				key_Card_count -= 4;
				if (key_Card_count === -3)
				{
					one = one + k.importId;
				}
				else if (key_Card_count === -2)
				{
					two = two + k.importId;
				}
				else if (key_Card_count === -1)
				{
					three = three + k.importId;
				}
				else if (key_Card_count >= 0)
				{
					four = four + k.importId;
				}
			}
		});
		return "%%" + Main.value + Ally.value + "|" + one + ";" + two + ";" + three + ";" + four;
	}
	return "";
}

function onExportClick()
{
	const exportcode = Export();
	if (exportcode !== "")
	{
		copyText.value = exportcode;
		showTemporaryMessage("卡组导出成功");
		exim_modal.style.display = 'block';
		import_modal.style.display = 'none';
		export_modal.style.display = 'block';
	}
}

loadDeck();