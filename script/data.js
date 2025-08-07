const DataModal = document.getElementById("DataModal");
const closeBtn4 = document.getElementById("closeBtn4");
const datachart = document.getElementById("datachart");

var chart = null;
var data_show_type = "type";
const chart_legend_data = {
	"type": ['步兵', '坦克', '炮兵', '战斗机', '轰炸机', '指令', '反制'],
	"rarity": ['普通', '限定', '特殊', '精英']
}

function onDataShowClick()
{
	var data = {};
	Object.keys(cCards).forEach((key) => {
		if (cCards[key] <= 0)
		{
			return;
		}
		const k = JSON.parse(key);
		if (data[k.json[data_show_type]] === undefined)
		{
			data[k.json[data_show_type]] = [];
		}
		if (data[k.json[data_show_type]][(k.json.kredits <= 7 ? k.json.kredits : 7)] === undefined)
		{
			data[k.json[data_show_type]][(k.json.kredits <= 7 ? k.json.kredits : 7)] = cCards[key];
		}
		else
		{
			data[k.json[data_show_type]][(k.json.kredits <= 7 ? k.json.kredits : 7)] += cCards[key];
		}
	});
	var chart_series = {
		"type": [
		{
		  name: '步兵',
		  type: 'bar',
		  stack: 'Unit',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["infantry"]
		},
		{
		  name: '坦克',
		  type: 'bar',
		  stack: 'Unit',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["tank"]
		},
		{
		  name: '炮兵',
		  type: 'bar',
		  stack: 'Unit',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["artillery"]
		},
		{
		  name: '战斗机',
		  type: 'bar',
		  stack: 'Unit',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["fighter"]
		},
		{
		  name: '轰炸机',
		  type: 'bar',
		  stack: 'Unit',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["bomber"]
		},
		{
		  name: '指令',
		  type: 'bar',
		  stack: 'Order',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["order"]
		},
		{
		  name: '反制',
		  type: 'bar',
		  stack: 'Countermeasure',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["countermeasure"]
		},
	  ],
		"rarity": [
		{
		  name: '普通',
		  type: 'bar',
		  stack: 'Rarity',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["Standard"]
		},
		{
		  name: '限定',
		  type: 'bar',
		  stack: 'Rarity',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["Limited"]
		},
		{
		  name: '特殊',
		  type: 'bar',
		  stack: 'Rarity',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["Special"]
		},
		{
		  name: '精英',
		  type: 'bar',
		  stack: 'Rarity',
		  barWidth: 10,
		  areaStyle: {},
		  emphasis: {
			focus: 'series'
		  },
		  data: data["Elite"]
		},
	  ],
	};
	var chart_option = {
	  title: {
		text: '卡组' + (data_show_type === "type" ? "卡牌类型" : "卡牌稀有度") + '数据图'
	  },
	  tooltip: {
		trigger: 'axis',
		axisPointer: {
		  type: 'shadow'
		}
	  },
	  legend: {
		data: chart_legend_data[data_show_type]
	  },
	  toolbox: {
		feature: {
		  saveAsImage: {}
		}
	  },
	  xAxis: [
		{
		  type: 'category',
		  name: 'K',
		  boundaryGap: false,
		  data: ['0', '1', '2', '3', '4', '5', '6', '7+']
		}
	  ],
	  yAxis: [
		{
		  type: 'value',
		  name: '数量'
		}
	  ],
	  series: chart_series[data_show_type]
	};
	if (chart !== null)
	{
		chart.dispose();
	}
	chart = echarts.init(datachart);
	chart.setOption(chart_option);
	DataModal.style.display = "block";
}

function closeDataModal()
{
	DataModal.style.display = "none";
}

closeBtn4.addEventListener("click",function() {
	closeDataModal();
});

window.addEventListener('click', function(event) {
    if (event.target === DataModal) {
		closeDataModal();
    }
});

// 获取所有导航项
        const navItems = document.querySelectorAll('.data-nav-item');
        
        // 为每个导航项添加点击事件
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有导航项的active类
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // 为当前点击的导航项添加active类
                this.classList.add('active');
				
				data_show_type = this.getAttribute('data-nav');
				onDataShowClick();
            });
        });