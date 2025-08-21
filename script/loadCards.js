const container = document.getElementById("image-container");
const cdn_info = document.getElementById("cdn_info");

let currentIndex = 0;            // 当前加载到的索引
let allCards = [];               // 存储所有卡片数据
let currentCards = [];
let j = null;
var andFilters = [];
var orFilters = [];
let isJsonLoading = true;           // 防止重复加载
let isLoading = false;           // 防止重复加载
const BATCH_SIZE = 20;           // 每次加载的图片数量

//const CDN_URL = "https://cdn.statically.io/gh/ohminecraftlauncher/ohminecraftlauncher.github.io/master";
const CDNs = [
	"jsd.vxo.im",
	"cdn.smartcis.cn",
	"cdn.bili33.top",
	"gcore.jsdelivr.net",
	"testingcf.jsdelivr.net",
	"cdn.jsdelivr.net",
	""
]
const CDN_PROT = "https://";
const CDN_BODY = "/gh/ohminecraftlauncher/ohminecraftlauncher.github.io@master";
let CDN_URL = "";
const contentLength = 3321822;

/**
 * 测量URL的实际下载速度
 * @param {string} url - 要测试的URL
 * @param {number} [timeout=5000] - 超时时间
 * @param {number} [testSize=100KB] - 测试文件大小(bytes)
 * @returns {Promise<{speed: number, latency: number}>} - 下载速度(KB/s)和延迟(ms)
 */
async function measureDownloadSpeed(url, timeout = 5000, testSize = 51200) {
    try {
        // 添加随机参数避免缓存
        const testUrl = `${url}?t=${Date.now()}`;
        const startTime = performance.now();
        
        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeout);
        
        // 发起范围请求获取部分数据
        const response = await fetch(testUrl, {
            headers: { 
				'Range': `bytes=0-${testSize}`,
			},
            signal: controller.signal
        });
        
        // 确保服务器支持范围请求
        if (!response.ok || response.status !== 206) {
            throw new Error('Server does not support range requests.');
        }
        
        // 读取数据但不处理，只为测量速度
        const reader = response.body.getReader();
        let received = 0;
        while(true) {
            const { done, value } = await reader.read();
            if (done) break;
            received += value.length;
        }
        
        const latency = performance.now() - startTime;
        const speed = (received / 1024) / (latency / 1000); // KB/s
        
		console.info(url,speed + "KB/s",latency + "ms");
        return { speed, latency };
    } catch (error) {
		console.info(url,"Error",error);
		if (error.message === "Server does not support range requests.") return undefined;
		if (error.message === "BodyStreamBuffer was aborted") return { undefined, undefined };
        return null;
    }
}

/**
 * 返回下载速度最快的可访问URL
 * @param {string[]} urls - URL数组
 * @param {number} [sampleSize=3] - 每个URL测试次数取平均值
 * @returns {Promise<{url: string, speed: number}|null>}
 */
async function findFastestDownloadUrl(urls, sampleSize = 3) {
	return null;
	/*
	if (window.innerWidth < 700)
	{
		return null;
	}
    const results = await Promise.all(
        urls.map(async url => {
			var test_url = "";
			if (url === "")
			{
				test_url = "Cards.json";
			}
			else
			{
				test_url = CDN_PROT + url + CDN_BODY + "/Cards.json";
			}
            let totalSpeed = 0;
            let successCount = 0;
            
            // 多次测试取平均值
            for (let i = 0; i < sampleSize; i++) {
                const { speed } = await measureDownloadSpeed(test_url);
                if (speed > 0) {
                    totalSpeed += speed;
                    successCount++;
                }
            }
            
            const avgSpeed = successCount > 0 ? totalSpeed / successCount : 0;
			console.info(url,"avgSpeed",avgSpeed, "KB/s");
            return { url, speed: avgSpeed };
        })
    );
    
    // 过滤并排序
    const validResults = results.filter(r => r.speed > 0)
                              .sort((a, b) => b.speed - a.speed);
    
    return validResults[0] || null;
	*/
}

document.addEventListener("DOMContentLoaded", function() {
    // 配置参数

	RefreshContainerTopMargin();
	window.addEventListener("resize",function() {
		RefreshContainerTopMargin();
	});
	findFastestDownloadUrl(CDNs)
	.then((result) => {
		if (result !== null) return result.url;
		else return null;
	})
	.then((g_url) =>
	{
		if (g_url === "") CDN_URL = "";
		else if (g_url === null) CDN_URL = CDN_PROT + CDNs[0] + CDN_BODY;
		else CDN_URL = CDN_PROT + g_url + CDN_BODY;
		
		getCDNInfo();
		// 1. 加载 JSON 数据
		fetchWithProgress(CDN_URL + "/Cards.json")
		/*
        .then(response => {
            if (!response.ok) throw new Error("网络请求失败");
            return response.json();
        })
		*/
        .then(data => {
            if (!data.cards || !Array.isArray(data.cards)) {
                throw new Error("JSON 格式错误：缺少 cards 数组");
            }
            j = data;
            allCards = data.cards;
            currentCards = data.cards;
            initIntersectionObserver(); // 初始化观察器
            loadNextBatch();          // 首次加载
			isJsonLoading = false;
			document.getElementById('loading-container').style.display = 'none';
			modal.style.zIndex = "995";
			modal.style.display = "none";
        })
        .catch(error => {
            console.error("加载失败:", error);
            container.innerHTML = `<p style="color:red">加载失败: ${error.message}</p>`;
        });
	});

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && currentIndex < currentCards.length) {
            loadNextBatch();
        }
    }, { threshold: 0.2 });

    // 直接观察已存在的哨兵元素（不再动态创建/删除）
    const sentinel = document.querySelector(".sentinel");
    observer.observe(sentinel);
}
});

function onCDNSelChanged(val)
{
	CDN_URL = CDN_PROT + CDNs[val] + CDN_BODY;
	refreshAll();
}

function refreshAll()
{
	getCDNInfo();
	var childs = container.childNodes;
	for(var i = childs.length - 1; i >= 0; i--) { 
	  container.removeChild(childs[i]); 
	}
	currentIndex = 0;
	isLoading = false;
	loadNextBatch();
	loadDeck();
}

function getCDNInfo()
{
	cdn_info.innerHTML = "正在检测...";
	measureDownloadSpeed(CDN_URL + "/Cards.json")
	.then((result) => {
		if (result === null)
		{
			cdn_info.innerHTML = "检测时发生错误";
		}
		else if (result === undefined)
		{
			cdn_info.innerHTML = "该CDN不支持检测";
		}
		else if (result.latency === undefined)
		{
			cdn_info.innerHTML = "检测超时";
		}
		else
		{
			cdn_info.innerHTML = result.speed.toFixed(2) + " KB/s | " + result.latency.toFixed(0) + " ms";
		}
	});
}

function RefreshContainerTopMargin()
{
	container.style.marginTop = document.getElementById("fixed-top").offsetHeight + 10 + "px";
}

function addOrFilter(group,path,value,contain = false,no = false,and = null)
{
	orFilters.push({"group":group,"path":path,"value":value,"contain":contain,"no":no,"and":and});
	loadFilters();
}

function addAndFilter(path,value,contain = false,no = false,remove = true)
{
	if (remove) removeAndFilter(path);
	andFilters.push({"path":path,"value":value,"contain":contain,"no":no});
	loadFilters();
}

function removeAndFilter(path,value = null)
{
	andFilters = andFilters.filter((item) => {
		if (value === null)
		{
			return item.path !== path;
		}
		else
		{
			return (!(item.path === path && item.value === value));
		}
	});
	loadFilters();
}

function removeOrFilterByFilter(group,path,value,contain = false,no = false,and = null)
{
	var IsAlreadyRemoved = false;
	orFilters = orFilters.filter((item) => 
	{
		if (IsAlreadyRemoved) return true;
		else
		{
			if (item.group === group && item.path === path && item.value === value && item.contain === contain && item.no === no && item.and === and)
			{
				IsAlreadyRemoved = true;
				return false;
			}
			else
			{
				return true;
			}
		}
	});
	loadFilters();
}

function removeOrFilterByGroup(group)
{
	orFilters = orFilters.filter((item) => {return item.group != group});
	loadFilters();
}

function loadFilters()
{
	currentCards = filterWithComplexConditions(allCards,orFilters,andFilters)
	var childs = container.childNodes;
	for(var i = childs.length - 1; i >= 0; i--) { 
	  container.removeChild(childs[i]); 
	}
	currentIndex = 0;
	isLoading = false;
	loadNextBatch();
}

function removeAllFilters()
{
	orFilters = [];
	andFilters = [];
	loadFilters();
}

/**
 * 根据复杂筛选器筛选数组
 * @param {Array} arr - 要筛选的原始数组
 * @param {Array} orFilters - 或筛选器数组，每个元素是 {group: 组号, path: 键路径, value: 匹配值}
 * @param {Array} andFilters - 与筛选器数组，每个元素是 {path: 键路径, value: 匹配值}
 * @returns {Array} 筛选后的数组
 */
function filterWithComplexConditions(arr, orFilters = [], andFilters = []) {
    if (!Array.isArray(arr)) return [];
    
    // 获取键路径对应的值
    const getValueByPath = (obj, path) => {
        const tokens = path.split(/\.|\[|\]/).filter(token => token !== '');
        let current = obj;
        
        for (const token of tokens) {
            if (current === null || current === undefined) return undefined;
            current = /^\d+$/.test(token) ? current[parseInt(token, 10)] : current[token];
        }
        return current;
    };
    
    // 处理或筛选器组
    const orGroups = {};
    orFilters.forEach(filter => {
        if (!orGroups[filter.group]) {
            orGroups[filter.group] = [];
        }
        orGroups[filter.group].push(filter);
    });
    
    // 初始结果为全集
    let result = [...arr];
    
    // 处理每个或筛选器组
    for (const groupId in orGroups) {
        const groupFilters = orGroups[groupId];
        let groupResults = [];
        
        // 计算组内每个筛选器的结果并合并（或关系）
        groupFilters.forEach(filter => {
            const filtered = arr.filter(item => {
                const pathValue = getValueByPath(item, filter.path);
				if (pathValue === undefined) return false;
				var filter_result = false;
				if (!filter.no)
				{
					if (!filter.contain) filter_result = (pathValue === filter.value);
					else
					{
						filter_result = pathValue.includes(filter.value);
						if (!filter_result && Array.isArray(pathValue))
						{
							try
							{
								pathValue.forEach((pathValue_item) => {
									if (pathValue_item.includes(filter.value))
									{
										filter_result = true;
										throw new Error("ELOP");
									}
								});
							}
							catch (e)
							{
								if (e.message !== "ELOP") throw e;
							}
						}
					}
				}
				else
				{
					if (!filter.contain) filter_result = (pathValue !== filter.value);
					else 
					{
						filter_result = (!pathValue.includes(filter.value));
						if (!filter_result && Array.isArray(pathValue))
						{
							try
							{
								pathValue.forEach((pathValue_item) => {
									if (!pathValue_item.includes(filter.value))
									{
										filter_result = true;
										throw new Error("ELOP");
									}
								});
							}
							catch (e)
							{
								if (e.message !== "ELOP") throw e;
							}
						}
					}
				}
				if (!filter_result)
				{
					return false;
				}
				else if (filter.and === undefined || filter.and === null)
				{
					return true;
				}
				else
				{
					const pathValue_and = getValueByPath(item, filter.and.path);
					if (pathValue_and === undefined) return false;
					if (!filter.and.no)
					{
						if (!filter.and.contain) return pathValue_and === filter.and.value;
						else 
						{
							var filter_and_result = pathValue_and.includes(filter.and.value);
							if (!filter_and_result && Array.isArray(pathValue))
							{
								try
								{
									pathValue.forEach((pathValue_item) => {
										if (pathValue_item.includes(filter.value))
										{
											filter_and_result = true;
											throw new Error("ELOP");
										}
									});
								}
								catch (e)
								{
									if (e.message !== "ELOP") throw e;
								}
							}
							return filter_and_result;
						}
					}
					else
					{
						if (!filter.and.contain) return pathValue_and !== filter.and.value;
						else 
						{
							var filter_and_result = !pathValue_and.includes(filter.and.value);
							if (!filter_and_result && Array.isArray(pathValue))
							{
								try
								{
									pathValue.forEach((pathValue_item) => {
										if (!pathValue_item.includes(filter.value))
										{
											filter_and_result = true;
											throw new Error("ELOP");
										}
									});
								}
								catch (e)
								{
									if (e.message !== "ELOP") throw e;
								}
							}
							return filter_and_result;
						}
					}
				}
            });
            groupResults = [...new Set([...groupResults, ...filtered])];
        });
        
        // 与当前结果取交集（组间是与关系）
        result = result.filter(item => groupResults.includes(item));
    }
    
    // 处理与筛选器（必须满足所有条件）
    if (andFilters.length > 0) {
        result = result.filter(item => {
            return andFilters.every(filter => {
                const pathValue = getValueByPath(item, filter.path);
				if (pathValue === undefined) return false;
				if (!filter.no)
				{
					if (!filter.contain) return pathValue === filter.value;
					else
					{
						var and_result = pathValue.includes(filter.value);
						if (!and_result && Array.isArray(pathValue))
						{
							try
							{
								pathValue.forEach((pathValue_item) => {
									if (pathValue_item.includes(filter.value))
									{
										and_result = true;
										throw new Error("ELOP");
									}
								});
							}
							catch (e)
							{
								if (e.message !== "ELOP") throw e;
							}
						}
						return and_result;
					}
				}
				else
				{
					if (!filter.contain) return pathValue !== filter.value;
					else
					{ 
						var and_result = !pathValue.includes(filter.value);
						if (!and_result && Array.isArray(pathValue))
						{
							try
							{
								pathValue.forEach((pathValue_item) => {
									if (!pathValue_item.includes(filter.value))
									{
										and_result = true;
										throw new Error("ELOP");
									}
								});
							}
							catch (e)
							{
								if (e.message !== "ELOP") throw e;
							}
						}
						return and_result;
					}
				}
            });
        });
    }
    
    return result;
}

// getValueByPath 函数实现（与之前相同）
function getValueByPath(obj, path) {
    const tokens = path.split(/\.|\[|\]/).filter(token => token !== '');
    let current = obj;
    
    for (const token of tokens) {
        if (current === null || current === undefined) {
            return undefined;
        }
        
        if (/^\d+$/.test(token)) {
            const index = parseInt(token, 10);
            current = current[index];
        } else {
            current = current[token];
        }
    }
    
    return current;
}

function loadNextBatch() {
    if (isLoading || currentIndex >= currentCards.length) return;
    isLoading = true;

    const batch = currentCards.slice(currentIndex, currentIndex + BATCH_SIZE);
    batch.forEach(card => {
        if (!card.imageUrl || !card.json?.title?.["zh-Hans"]) return;
		
		const div = document.createElement("div");
		div.className = "card-container";
		div.ondragover = function() {
			allowDrop(event);
		};
		div.ondrop = function() {
			onDrop(event);
		};
		
        const img = document.createElement("img");
        img.src = CDN_URL + card.imageUrl;
        img.alt = decodeUnicode(card.json.title["zh-Hans"]);
		img.name = JSON.stringify(card);
		img.className = "card-img"
		img.addEventListener("click",function () {onCardsBeClicked(this.name);});
        img.loading = "lazy";
		img.onload = function () {
			if (this.nextElementSibling !== undefined && this.nextElementSibling !== null)
			{
				this.nextElementSibling.style.display = "block";
			}
		};
		div.appendChild(img);
		
		if (card.json.reserved)
		{
			const reserved_board = document.createElement("div");
			reserved_board.className = "reserved-board";
			const reserved_img = document.createElement("img");
			reserved_img.className = "reserved-img";
			reserved_img.src = "images/icon/reserved.svg";
			reserved_img.alt = "预";
			reserved_board.appendChild(reserved_img);
			div.appendChild(reserved_board);
		}
		
        document.getElementById("image-container").appendChild(div);
    });

    currentIndex += BATCH_SIZE;
    isLoading = false;
}

    // 4. Unicode 解码（处理 \uXXXX 格式）
    function decodeUnicode(str) {
        return str.replace(/\\u[\dA-Fa-f]{4}/g, match => 
            String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
        );
    }