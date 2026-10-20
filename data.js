// 牧泽销售通讯录数据
// 仅保留 8 名销售人员（总经理、销售经理已移除）
// 字段：mobile = 手机，landline = 销售热线/座机，regions = 负责区域（用于本地检索）
window.MUZE_DATA = {
  "brand": "河北牧泽农牧机械有限公司",
  "title": "买 青贮机 花生播种机 铺膜播种机",
  "subtitle": "牧泽销售服务通讯录 · 8 名业务员，按区域为您对接",
  "updatedAt": "2026-10-20",
  "hotRegions": ["河北", "河南", "山东", "山西", "陕西", "新疆", "江苏", "黑龙江", "吉林", "湖北", "安徽", "辽宁", "四川", "宁夏", "国外"],
  "managers": [
    {
      "id": 1,
      "name": "张贺凯",
      "mobile": "13932113939",
      "landline": "0311-89229961",
      "regionText": "张家口、承德、秦皇岛、沧州、衡水、内蒙东（呼和浩特以东）",
      "regions": [
        { "type": "city", "name": "张家口" },
        { "type": "city", "name": "承德" },
        { "type": "city", "name": "秦皇岛" },
        { "type": "city", "name": "沧州" },
        { "type": "city", "name": "衡水" },
        { "type": "province", "name": "内蒙古", "label": "内蒙古（东部·呼和浩特以东）", "excluded": ["乌海", "巴彦淖尔", "阿拉善盟", "鄂尔多斯"] }
      ]
    },
    {
      "id": 2,
      "name": "毕红向",
      "mobile": "15830972720",
      "landline": "0311-89229961",
      "regionText": "新疆、甘肃、西藏、青海、四川",
      "regions": [
        { "type": "province", "name": "新疆" },
        { "type": "province", "name": "甘肃" },
        { "type": "province", "name": "西藏" },
        { "type": "province", "name": "青海" },
        { "type": "province", "name": "四川" }
      ]
    },
    {
      "id": 3,
      "name": "管业",
      "mobile": "13653218595",
      "landline": "0311-89229961",
      "regionText": "河北西部、南部、黑龙江、保定、邢台、邯郸",
      "regions": [
        { "type": "province", "name": "河北", "label": "河北（西部、南部）", "excluded": ["张家口", "承德", "秦皇岛", "沧州", "衡水"] },
        { "type": "province", "name": "黑龙江" }
      ]
    },
    {
      "id": 4,
      "name": "陈日",
      "mobile": "15003212112",
      "landline": "0311-89229961",
      "regionText": "山西、内蒙西（呼和浩特以西，乌海、巴盟、阿拉善除外）",
      "regions": [
        { "type": "province", "name": "山西" },
        { "type": "province", "name": "内蒙古", "label": "内蒙古（西部）", "excluded": ["乌海", "巴彦淖尔", "阿拉善盟"] }
      ]
    },
    {
      "id": 5,
      "name": "孟运周",
      "mobile": "13582039682",
      "landline": "0311-89229961",
      "regionText": "山东、江苏、开封、商丘（河南）",
      "regions": [
        { "type": "province", "name": "山东" },
        { "type": "province", "name": "江苏" },
        { "type": "city", "name": "开封" },
        { "type": "city", "name": "商丘" }
      ]
    },
    {
      "id": 6,
      "name": "黎孟",
      "mobile": "15233627393",
      "landline": "0311-89229961",
      "regionText": "陕西、宁夏、内蒙西部（乌海、巴盟、阿拉善）",
      "regions": [
        { "type": "province", "name": "陕西" },
        { "type": "province", "name": "宁夏" },
        { "type": "city", "name": "乌海" },
        { "type": "city", "name": "巴彦淖尔" },
        { "type": "city", "name": "阿拉善盟" }
      ]
    },
    {
      "id": 7,
      "name": "贾伟松",
      "mobile": "13001884612",
      "landline": "0311-89229961",
      "regionText": "河南、安徽、湖北、吉林",
      "regions": [
        { "type": "province", "name": "河南" },
        { "type": "province", "name": "安徽" },
        { "type": "province", "name": "湖北" },
        { "type": "province", "name": "吉林" }
      ]
    },
    {
      "id": 8,
      "name": "刘业峰",
      "mobile": "13603210373",
      "landline": "",
      "regionText": "国外市场",
      "regions": [
        { "type": "abroad", "name": "国外", "label": "国外市场" },
        { "type": "abroad", "name": "海外", "label": "国外市场" },
        { "type": "abroad", "name": "国际", "label": "国外市场" }
      ]
    }
  ]
};
