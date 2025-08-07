const zoom = document.getElementById("zoom");
var opened_Data = [];

function drag(ev)
{
	ev.dataTransfer.setData("Text",ev.target.id);
}
function allowDrop(ev)
{
	ev.preventDefault();
}
function onDrop(ev)
{
	if (ev.dataTransfer.getData("Text") === "zoom")
	{
		try
		{
			openZoomModal(ev.target.name);
		}
		catch
		{
			openZoomModal(ev.currentTarget.name);
		}
	}
}
function onZoomTouchEnd(ev)
{
	var childs = container.children;
	if (ZoomModal.style.display === "block")
	{
		childs = zoom_main_img.children;
	}
	else if (sidebar.style.display === "block")
	{
		childs = deck.children;
	}
	for (var i = 0;i < childs.length;i++)
	{
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
}

const ZoomModal = document.getElementById("ZoomModal");
const closeBtn5 = document.getElementById("closeBtn5");
const zoom_main_img = document.getElementById("zoom-main-img");
const zoom_main_text = document.getElementById("zoom-main-text");
const zoom_json_code = document.getElementById("zoom-json-code");

function openZoomModal(data)
{
	var IsInOpenDataArr = false;
	opened_Data.forEach((item) => {
		if (item === data) IsInOpenDataArr = true;
	});
	if (!IsInOpenDataArr) opened_Data.push(data);
	var j = JSON.parse(data);
	var img = document.createElement("img");
	img.src = CDN_URL + j.imageUrl;
    img.alt = decodeUnicode(j.json.title["zh-Hans"]);
	img.name = data;
	img.ondragover = function() {
		allowDrop(event);
	};
	img.ondrop = function() {
		onDrop(event);
	};
	var childs = zoom_main_img.childNodes;
	for(var i = childs.length - 1; i >= 0; i--) { 
	  zoom_main_img.removeChild(childs[i]); 
	}
	zoom_main_img.appendChild(img);
	zoom_main_text.innerHTML = 
	"<strong>标题：</strong>" + decodeUnicode(j.json.title["zh-Hans"]) + "<br>" +
	"<strong>内容：</strong>" + decodeUnicode(j.json.text["zh-Hans"] === undefined ? "无" : j.json.text["zh-Hans"]) + "<br>" + 
	"<strong>国家：</strong>" + FactionEnglishToChinese(j.json.faction) + "<br>" + 
	"<strong>稀有度：</strong>" + RarityEngToZh(j.json.rarity) + "<br>" + 
	"<strong>类型：</strong>" + TypeEngToZh(j.json.type) + "<br>" +
	"<strong>导入代码：</strong>" + (j.importId === "" ? "无" : j.importId) + "<br>" + 
	"<strong>花费：</strong>" + j.json.kredits + "<br>" +
	(j.json.operationCost === undefined ? "" : "<strong>行动花费：</strong>" + j.json.operationCost + "<br>") + 
	(j.json.attack === undefined ? "" : "<strong>攻击力：</strong>" + j.json.attack + "<br>") + 
	(j.json.defense === undefined ? "" : "<strong>防御力：</strong>" + j.json.defense + "<br>");
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
						cre_img.ondrop = function() {
							onDrop(event);
						};
						zoom_main_img.appendChild(cre_img);
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
	zoom_json_code.innerHTML = formatJson(data);
	zoom_json_code.removeAttribute("data-highlighted");
	hljs.highlightAll();
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