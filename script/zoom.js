const zoom = document.getElementById("zoom");
var isZoom = false;
let opened_Data = [];

function drag(ev)
{
	ev.dataTransfer.setData("Text",ev.target.id);
	isZoom = true;
}
function allowDrop(ev)
{
	if (isZoom)
	{
		ev.preventDefault();
		try
		{
			ev.currentTarget.style.transform = "scale(1.05)";
		}
		catch
		{
			ev.target.style.transform = "scale(1.05)";
		}
	}
}
function dragLeave(ev)
{
	if (isZoom)
	{
		ev.preventDefault();
		try
		{
			ev.currentTarget.style.transform = "scale(1)";
		}
		catch
		{
			ev.target.style.transform = "scale(1)";
		}
	}
}
function onDrop(ev)
{
	ev.preventDefault();
	isZoom = false;
	if (ev.dataTransfer.getData("Text") === "zoom")
	{
		try
		{
			openZoomModal(ev.target.name);
			ev.target.style.transform = "scale(1)";
			ev.currentTarget.style.transform = "scale(1)";
		}
		catch
		{
			openZoomModal(ev.currentTarget.name);
			ev.currentTarget.style.transform = "scale(1)";
		}
	}
}
document.addEventListener("dragend",function() {isZoom = false});
function onZoomTouchEnd(ev)
{
	var childs = container.children;
	var childs2 = null;
	var childs3 = null;
	if (ZoomModal.style.display === "block")
	{
		childs = zoom_main_img.children;
		childs2 = zoom_main_cre_img.children;
		childs3 = zoom_main_becre_img.children;
	}
	else if (sidebar.style.display === "block")
	{
		childs = deck.children;
	}
	for (var i = 0;i < childs.length;i++)
	{
		childs[i].style.transform = "scale(1)";
		const rect = childs[i].getBoundingClientRect();
		const x = ev.changedTouches[0].clientX;
		const y = ev.changedTouches[0].clientY;
		if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom)
		{
			if (sidebar.style.display === "block" || ZoomModal.style.display === "block")
			{
				openZoomModal(childs[i].name);
			}
			else
			{
				openZoomModal(childs[i].children[0].name);
			}
			return;
		}
	}
	if (childs2 !== null)
	{
		for (var i = 0;i < childs2.length;i++)
		{
			childs2[i].style.transform = "scale(1)";
			const rect = childs2[i].getBoundingClientRect();
			const x = ev.changedTouches[0].clientX;
			const y = ev.changedTouches[0].clientY;
			if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom)
			{
				openZoomModal(childs2[i].name);
				return;
			}
		}
	}
	if (childs3 !== null)
	{
		for (var i = 0;i < childs3.length;i++)
		{
			childs3[i].style.transform = "scale(1)";
			const rect = childs3[i].getBoundingClientRect();
			const x = ev.changedTouches[0].clientX;
			const y = ev.changedTouches[0].clientY;
			if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom)
			{
				openZoomModal(childs3[i].name);
			}
		}
	}
}
function onZoomTouchMove(ev)
{
	var childs = container.children;
	var childs2 = null;
	var childs3 = null;
	if (ZoomModal.style.display === "block")
	{
		childs = zoom_main_img.children;
		childs2 = zoom_main_cre_img.children;
		childs3 = zoom_main_becre_img.children;
	}
	else if (sidebar.style.display === "block")
	{
		childs = deck.children;
	}
	for (var i = 0;i < childs.length;i++)
	{
		childs[i].style.transform = "scale(1)";
		const rect = childs[i].getBoundingClientRect();
		const x = ev.touches[0].clientX;
		const y = ev.touches[0].clientY;
		if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom)
		{
			childs[i].style.transform = "scale(1.05)";
		}
	}
	if (childs2 !== null)
	{
		for (var i = 0;i < childs2.length;i++)
		{
			childs2[i].style.transform = "scale(1)";
			const rect = childs2[i].getBoundingClientRect();
			const x = ev.touches[0].clientX;
			const y = ev.touches[0].clientY;
			if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom)
			{
				childs2[i].style.transform = "scale(1.05)";
			}
		}
	}
	if (childs3 !== null)
	{
		for (var i = 0;i < childs3.length;i++)
		{
			childs3[i].style.transform = "scale(1)";
			const rect = childs3[i].getBoundingClientRect();
			const x = ev.touches[0].clientX;
			const y = ev.touches[0].clientY;
			if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom)
			{
				childs3[i].style.transform = "scale(1.05)";
			}
		}
	}
}

const ZoomModal = document.getElementById("ZoomModal");
const closeBtn5 = document.getElementById("closeBtn5");
const zoom_main_img = document.getElementById("zoom-main-img");
const zoom_main_cre_img = document.getElementById("zoom-main-cre-img");
const zoom_main_becre_img = document.getElementById("zoom-main-becre-img");
const zoom_main_text = document.getElementById("zoom-main-text");
const zoom_json_code = document.getElementById("zoom-json-code");

function openZoomModal(data)
{
	var j = JSON.parse(data);
	var img = document.createElement("img");
	img.src = CDN_URL + j.imageUrl;
    img.alt = decodeUnicode(j.json.title["zh-Hans"]);
	img.name = data;
	img.ondragover = function() {
		allowDrop(event);
	};
	img.ondragleave = function() {
		dragLeave(event);
	};
	img.ondrop = function() {
		onDrop(event);
	};
	var childs = zoom_main_img.childNodes;
	for(var i = childs.length - 1; i >= 0; i--) { 
	  zoom_main_img.removeChild(childs[i]); 
	}
	var cre_childs = zoom_main_cre_img.childNodes;
	for(var i = cre_childs.length - 1; i >= 0; i--) { 
	  zoom_main_cre_img.removeChild(cre_childs[i]); 
	}
	var becre_childs = zoom_main_becre_img.childNodes;
	for(var i = becre_childs.length - 1; i >= 0; i--) { 
	  zoom_main_becre_img.removeChild(becre_childs[i]); 
	}
	zoom_main_img.appendChild(img);
	zoom_main_text.innerHTML = 
	"<strong>标题：</strong>" + decodeUnicode(j.json.title["zh-Hans"]) + "<br>" +
	"<strong>内容：</strong>" + decodeUnicode(j.json.text["zh-Hans"] === undefined ? "无" : j.json.text["zh-Hans"]) + "<br>" + 
	"<strong>国家：</strong>" + FactionEnglishToChinese(j.json.faction) + "<br>" + 
	(j.json.exile === undefined ? "" : "<strong>流亡：</strong>" + FactionEnglishToChinese(j.json.exile) + "<br>") + 
	"<strong>稀有度：</strong>" + RarityEngToZh(j.json.rarity) + "<br>" + 
	"<strong>类型：</strong>" + TypeEngToZh(j.json.type) + "<br>" +
	"<strong>导入代码：</strong>" + (j.importId === "" ? "无" : j.importId) + "<br>" + 
	"<strong>花费：</strong>" + j.json.kredits + "<br>" +
	(j.json.operationCost === undefined ? "" : "<strong>行动花费：</strong>" + j.json.operationCost + "<br>") + 
	(j.json.attack === undefined ? "" : "<strong>攻击力：</strong>" + j.json.attack + "<br>") + 
	(j.json.defense === undefined ? "" : "<strong>防御力：</strong>" + j.json.defense + "<br>");
	if (j.json.attributes !== undefined)
	{
		j.json.attributes.forEach((item) => {
			if (item.includes("Veteran"))
			{
				var cre_id = item.split(':')[1];
				try
				{
					allCards.forEach((card) => {
						if (card.cardId === cre_id)
						{
							var cre_img = document.createElement("img");
							cre_img.src = CDN_URL + card.imageUrl;
							cre_img.alt = decodeUnicode(card.json.title["zh-Hans"]);
							cre_img.name = JSON.stringify(card);
							cre_img.ondragover = function() {
								allowDrop(event);
							};
							cre_img.ondragleave = function() {
								dragLeave(event);
							};
							cre_img.ondrop = function() {
								onDrop(event);
							};
							zoom_main_cre_img.appendChild(cre_img);
							throw new Error("ELOP");
						}
					});
				}
				catch (e)
				{
					if (e.message !== "ELOP")
					{
						throw e;	
					}
				}
			}
		});
	}
	if (j.json.can_create !== undefined)
	{
		j.json.can_create.forEach((item) =>
		{
			try
			{
				allCards.forEach((card) => {
					if (card.cardId === item)
					{
						var cre_img = document.createElement("img");
						cre_img.src = CDN_URL + card.imageUrl;
						cre_img.alt = decodeUnicode(card.json.title["zh-Hans"]);
						cre_img.name = JSON.stringify(card);
						cre_img.ondragover = function() {
							allowDrop(event);
						};
						cre_img.ondragleave = function() {
							dragLeave(event);
						};
						cre_img.ondrop = function() {
							onDrop(event);
						};
						zoom_main_cre_img.appendChild(cre_img);
						throw new Error("ELOP");
					}
				});
			}
			catch (e)
			{
				if (e.message !== "ELOP")
				{
					throw e;
				}
			}
		});
	}
	allCards.forEach((card) =>
	{
		if (card.json.can_create !== undefined)
		{
			card.json.can_create.forEach((item) => {
				if (item === j.json.id)
				{
					var becre_img = document.createElement("img");
					becre_img.src = CDN_URL + card.imageUrl;
					becre_img.alt = decodeUnicode(card.json.title["zh-Hans"]);
					becre_img.name = JSON.stringify(card);
					becre_img.ondragover = function() {
						allowDrop(event);
					};
					becre_img.ondragleave = function() {
						dragLeave(event);
					};
					becre_img.ondrop = function() {
						onDrop(event);
					};
					zoom_main_becre_img.appendChild(becre_img);
				}
			});
		}
	});
	zoom_json_code.innerHTML = formatJson(data);
	zoom_json_code.removeAttribute("data-highlighted");
	hljs.highlightAll();
	var IsInOpenDataArr = false;
	opened_Data.forEach((item) => {
		if (item === data) IsInOpenDataArr = true;
	});
	if (!IsInOpenDataArr) opened_Data.push(data);
	ZoomModal.style.display = "block";
}

showTooltip(document.getElementById("zoom-container"),"将此放大镜图标拖动到卡图或卡组卡牌上，可以显示该卡牌的详细信息",{
	position: 'top',
    duration: 0,
    backgroundColor: '#1890ff',
    textColor: '#fff',
	closeButtonColor: '#fff'
});

zoom.addEventListener("touchend",function() {
	onZoomTouchEnd(event);
});
zoom.addEventListener("touchmove",function() {
	onZoomTouchMove(event);
});

function RarityEngToZh(rarity)
{
	switch (rarity)
	{
		case "Standard":
			return "普通";
		case "Limited":
			return "限定";
		case "Special":
			return "特殊";
		case "Elite":
			return "精英";
		default:
			return "";
	}
}

function TypeEngToZh(type)
{
	switch (type)
	{
		case "infantry":
			return "步兵";
		case "tank":
			return "坦克";
		case "artillery":
			return "炮兵";
		case "fighter":
			return "战斗机";
		case "bomber":
			return "轰炸机";
		case "order":
			return "指令";
		case "countermeasure":
			return "反制";
		default:
			return "";
	}
}

function formatJson(j)
{
	var pre_format = j.replaceAll('{','{\n').replaceAll('}','\n}').replaceAll(',',',\n');
	var splited = pre_format.split('\n');
	var level = 0;
	var result = "";
	splited.forEach((item) => {
		if (item.includes('}'))
		{
			level--;
		}
		for (var i = 0;i < level;i++)
		{
			result += '    ';
		}
		result += item + '\n';
		if (item.includes('{'))
		{
			level++;
		}
	});
	return result;
}

function closeZoomModal()
{
	opened_Data.pop();
	if (opened_Data.length > 0)
	{
		openZoomModal(opened_Data[opened_Data.length - 1]);
	}
	else
	{
		ZoomModal.style.display = "none";
	}
}

closeBtn5.addEventListener("click",function() {
	closeZoomModal();
});

window.addEventListener('click', function(event) {
    if (event.target === ZoomModal) {
		closeZoomModal();
    }
});

const zoomNavItems = document.querySelectorAll('.zoom-nav-item');
        
        // 为每个导航项添加点击事件
        zoomNavItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有导航项的active类
                zoomNavItems.forEach(nav => nav.classList.remove('active'));
                
                // 为当前点击的导航项添加active类
                this.classList.add('active');
				
				const pageId = this.getAttribute('data-page');
				
				document.querySelectorAll('.zoom-page').forEach(page => {
                    page.classList.remove('active');
                });
                
                // 显示当前页面
                document.getElementById(pageId).classList.add('active');
            });
        });