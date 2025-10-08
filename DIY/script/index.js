const types =  ["步兵","坦克","炮兵","战斗机","轰炸机","指令","反制"];
const factions =  ["germany","britain","japan","soviet","usa","france","italy","poland","finland","neutral","china"];
const raritys =  ["普通","限定","特殊","精英"];
const sets =  ["基础","海战","血与铁","秘密行动","冬季战争","战友","战区","世纪大战","军团","突破","忠诚"];

var cur_type = 0;
var cur_rarity = 0;
var cur_set = 0;
var cur_faction = 0;

const rarity = document.getElementById("rarity");
const type = document.getElementById("type");
const faction = document.getElementById("faction");
const title_body = document.getElementById("title-body");
const type_board = document.getElementById("type-board");
const set = document.getElementById("set");
const body = document.getElementById("body");
const picture_input = document.getElementById("picture-input");
const picture = document.getElementById("picture");
const b_text = document.getElementById("b-text");
const boldBtn = document.getElementById("boldBtn");
const IFSBtn = document.getElementById("IFSBtn");
const DFSBtn = document.getElementById("DFSBtn");
const TIFSBtn = document.getElementById("TIFSBtn");
const TDFSBtn = document.getElementById("TDFSBtn");
const opredit = document.getElementById("opredit");
const kredit = document.getElementById("kredit");
const K = document.getElementById("K");
const title = document.getElementById("title");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const EditButton = document.getElementById("EditButton");

function onTypeClick()
{
	cur_type++;
	if (cur_type >= types.length) cur_type = 0;
	if (cur_type === 6 || cur_type === 5)
	{
		body.src = "images/body/底-指令反制.png";
		type_board.className = "type-board-order";
		picture.className = "picture-order";
		title.className = "title-order";
		title.style.color = "#4e4e47";
		TIFSBtn.className = "BTBtn TIFSBtn-order";
		TDFSBtn.className = "BTBtn TDFSBtn-order";
		title_body.style.display = "none";
		opredit.style.display = "none";
		attack.style.display = "none";
		defense.style.display = "none";
	}
	else
	{
		body.src = "images/body/底-单位.png";
		type_board.className = "type-board-unit";
		picture.className = "picture-unit";
		title.className = "title-unit";
		TIFSBtn.className = "BTBtn TIFSBtn-unit";
		TDFSBtn.className = "BTBtn TDFSBtn-unit";
		title_body.style.display = "block";
		opredit.style.display = "block";
		attack.style.display = "flex";
		defense.style.display = "flex";
		if (factions[cur_faction] === "finland")
		{
			title.style.color = "#393c3e";
		}
		else
		{
			title.style.color = "#bfc6b3";
		}
	}
	type.src = "images/type/" + types[cur_type] + ".png";
}

function onRarityClick()
{
	cur_rarity++;
	if (cur_rarity >= raritys.length) cur_rarity = 0;
	rarity.src = "images/rarity/" + raritys[cur_rarity] + ".png";
}

function onSetClick()
{
	cur_set++;
	if (cur_set >= sets.length) cur_set = 0;
	set.src = "images/set/" + sets[cur_set] + ".png";
}

function onFactionClick()
{
	cur_faction++;
	if (cur_faction >= factions.length) cur_faction = 0;
	var bodycolor = '#000000'
	switch (factions[cur_faction])
	{
		case "germany":
			bodycolor = "#5e6965";
			break;
		case "britain":
			bodycolor = "#968d6f";
			break;
		case "japan":
			bodycolor = "#9c7e3f";
			break;
		case "soviet":
			bodycolor = "#645441";
			break;
		case "usa":
			bodycolor = "#656d50";
			break;
		case "france":
			bodycolor = "#505b7b";
			break;
		case "italy":
			bodycolor = "#686867";
			break;
		case "poland":
			bodycolor = "#686251";
			break;
		case "finland":
			bodycolor = "#babaab";
			break;
		case "neutral":
			bodycolor = "#3b3c40";
			break;
		case "china":
			bodycolor = "#7a839f";
			break;
	}
	if (title.className === "title-unit")
	{
		if (factions[cur_faction] === "finland")
		{
			title.style.color = "#393c3e";
		}
		else
		{
			title.style.color = "#bfc6b3";
		}
	}
	title_body.style.backgroundColor = bodycolor;
	faction.src = "images/faction/" + factions[cur_faction] + ".png";
}

function onPictureClick()
{
	picture_input.click();
}

function onPictureInputChange(val)
{
	var reader = new FileReader();
    // 转换成功后的操作，img.src即为转换后的DataURL
    reader.onload = function(e) {
        if (reader.readyState === 2) { //加载完毕后赋值
            //picture_img.src = e.target.result;
			//picture.style.back
            picture.style.backgroundImage = `url(${e.target.result})`;
            picture.style.backgroundSize = 'contain';
            picture.style.backgroundRepeat = 'no-repeat';
            picture.style.backgroundPosition = 'center';
            picture.style.backgroundColor = '#ffffff';
			picture.style.display = "flex";
        }
    }
    reader.readAsDataURL(val);
}

b_text.addEventListener('keydown', function(e) {
	// Ctrl+B 快捷键
	if (e.ctrlKey && e.key === 'b') {
		e.preventDefault();
		document.execCommand('bold', false, null);
	}
});

/*
b_text.addEventListener('mouseout', function(e) {
	const ip = IFSBtn.getBoundingClientRect();
	const bp = boldBtn.getBoundingClientRect();
	if (e.x >= bp.left - 5 && e.x <= bp.right + 5 && e.y >= ip.top - 5 && e.y <= bp.bottom + 5)
	{
		boldBtn.style.display = "flex";
		IFSBtn.style.display = "flex";
		DFSBtn.style.display = "flex";
	}
	else
	{
		boldBtn.style.display = "none";
		IFSBtn.style.display = "none";
		DFSBtn.style.display = "none";
	}
});

function onBTextMouseIn()
{
	boldBtn.style.display = "flex";
	IFSBtn.style.display = "flex";
	DFSBtn.style.display = "flex";
}
*/

function onEditBClick()
{
	if (boldBtn.style.display === "none")
	{
		boldBtn.style.display = "flex";
		IFSBtn.style.display = "flex";
		DFSBtn.style.display = "flex";
		TIFSBtn.style.display = "flex";
		TDFSBtn.style.display = "flex";
		EditButton.innerText = "隐藏编辑按钮";
		
	}
	else
	{
		boldBtn.style.display = "none";
		IFSBtn.style.display = "none";
		DFSBtn.style.display = "none";
		TIFSBtn.style.display = "none";
		TDFSBtn.style.display = "none";
		EditButton.innerText = "显示编辑按钮";
	}
}

function BoldText()
{
	document.execCommand('bold', false, null);
}

function onKreditInput()
{
	if (/\D/.test(kredit.innerText))
	{
		if (kredit.innerText !== '\n' && kredit.innerText !== '') kredit.innerText = "";
	}
	else
	{
		if (parseInt(kredit.innerText) >= 100)
		{
			kredit.innerText = "99";
		}
		else if (parseInt(kredit.innerText) >= 10)
		{
			K.className = "K-2";
			opredit.className = "opredit-2";
			kredit.style.fontSize = "46px";
		}
		else
		{
			K.className = "K-1";
			opredit.className = "opredit-1";
			kredit.style.fontSize = "68px";
		}
	}
}

function onOpeditInput()
{
	if (/\D/.test(opredit.innerText))
	{
		if (opredit.innerText !== '\n' && opredit.innerText !== '') opredit.innerText = "";
	}
	else
	{
		if (parseInt(opredit.innerText) >= 10)
		{
			opredit.innerText = "9";
		}
	}
}

function onAttackInput()
{
	if (/\D/.test(attack.innerText))
	{
		if (attack.innerText !== '\n' && attack.innerText !== '') attack.innerText = "";
	}
	else
	{
		if (parseInt(attack.innerText) >= 100)
		{
			attack.innerText = "99";
		}
		else if (parseInt(attack.innerText) >= 10)
		{
			attack.className = "attack-2";
		}
		else
		{
			attack.className = "attack-1";
		}
	}
}

function onDefenseInput()
{
	if (/\D/.test(defense.innerText))
	{
		if (defense.innerText !== '\n' && defense.innerText !== '') defense.innerText = "";
	}
	else
	{
		if (parseInt(defense.innerText) >= 100)
		{
			defense.innerText = "99";
		}
		else if (parseInt(defense.innerText) >= 10)
		{
			defense.className = "defense-2";
		}
		else
		{
			defense.className = "defense-1";
		}
	}
}

b_text.style.fontSize = "32px";
title.style.fontSize = "50px";

function increaseBTextFontSize()
{
	b_text.style.fontSize = parseInt(b_text.style.fontSize.replace("px","")) + 1 + "px";
}

function decreaseBTextFontSize()
{
	if (parseInt(b_text.style.fontSize.replace("px","")) > 1) b_text.style.fontSize = parseInt(b_text.style.fontSize.replace("px","")) - 1 + "px";
}

function increaseTitleFontSize()
{
	title.style.fontSize = parseInt(title.style.fontSize.replace("px","")) + 1 + "px";
}

function decreaseTitleFontSize()
{
	if (parseInt(title.style.fontSize.replace("px","")) > 1) title.style.fontSize = parseInt(title.style.fontSize.replace("px","")) - 1 + "px";
}

function onSaveBClick()
{
	html2canvas(main,{useCORS:true}).then(canvas => {
		//capture.style.display = "none";
		StackBlur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, 1);
		var link = document.createElement("a");
		var imgData = canvas.toDataURL({format: 'png', quality:1});
		var blob = dataURLtoBlob(imgData);
		var objurl = URL.createObjectURL(blob);
		link.download = "卡图.png";
		link.href = objurl;
		link.click();
		//showTemporaryMessage("卡组图片导出完成！请查看浏览器下载");
	});
}

function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
	bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {type:mime});
}

function getImageSize(url, callback) {
	const img = new Image();
	img.src = url;

	// 如果图片已缓存，直接返回宽高
	if (img.complete) {
		callback(img.width, img.height);
	} else {
		img.onload = function () {
			callback(img.width, img.height);
		};
	}
}