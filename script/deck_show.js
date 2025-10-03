const deck_show_grid = document.getElementById("deck-show-grid");
const capture = document.getElementById("capture")

function onDeckShowClick()
{
	let showReCor;
	if(confirm("是否在预备卡牌左下角显示预备角标？")){  
		showReCor = true;
	}else{  
		showReCor = false; 
	}
	showTemporaryMessage("正在导出卡组，请稍候...");
	const exportcode = Export();
	if (exportcode !== "")
	{
		var childs = deck_show_grid.childNodes;
		for(var i = childs.length - 1; i >= 0; i--) { 
			deck_show_grid.removeChild(childs[i]); 
		}
		document.getElementById("deck-show-card-count").innerHTML = count + " / 39";
		document.getElementById("deck-show-importcode").innerHTML = exportcode + "（主国：" + FactionEnglishToChinese(oldmain) + " 盟国：" + FactionEnglishToChinese(oldally) + "）";
		Object.keys(cCards).forEach((key) => {
			const card = JSON.parse(key);
			for (var i = 1;i <= cCards[key];i++)
			{
				if (!card.imageUrl || !card.json?.title?.["zh-Hans"]) return;
				
				const div = document.createElement("div");
				div.className = "card-container";
				
				const img = document.createElement("img");
				img.src = CDN_URL + card.imageUrl;
				img.alt = decodeUnicode(card.json.title["zh-Hans"]);
				img.addEventListener("click",function () {onCardsBeClicked(this.name);});
				img.loading = "lazy";
				div.appendChild(img);
				
				if (card.json.reserved && showReCor)
				{
					const reserved_board = document.createElement("div");
					reserved_board.className = "reserved-board";
					reserved_board.style.display = "block";
					const reserved_img = document.createElement("img");
					reserved_img.className = "reserved-img";
					reserved_img.src = CDN_URL + "/images/icon/reserved.svg";
					reserved_img.alt = "预";
					reserved_board.appendChild(reserved_img);
					div.appendChild(reserved_board);
				}
				
				deck_show_grid.appendChild(div);
			}
		});
		
		//capture.style.display = "block";
		html2canvas(capture,{useCORS:true}).then(canvas => {
			//capture.style.display = "none";
			var link = document.createElement("a");
			var imgData = canvas.toDataURL({format: 'png', quality:1});
			var blob = dataURLtoBlob(imgData);
			var objurl = URL.createObjectURL(blob);
			link.download = "卡组.png";
			link.href = objurl;
			link.click();
			showTemporaryMessage("卡组图片导出完成！请查看浏览器下载");
		});
	}
}

function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
	bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {type:mime});
}

function FactionEnglishToChinese(faction)
{
	switch (faction)
	{
		case "Germany":
			return "德国";
		case "Britain":
			return "英国";
		case "Japan":
			return "日本";
		case "Soviet":
			return "苏联";
		case "USA":
			return "美国";
		case "France":
			return "法国";
		case "Italy":
			return "意大利";
		case "Poland":
			return "波兰";
		case "Finland":
			return "芬兰";
		default:
			return "";
	}
}