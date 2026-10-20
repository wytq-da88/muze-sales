'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 载入 data.js（其中使用 window.MUZE_DATA）
const sandbox = { window: {} };
vm.createContext(sandbox);
const code = fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8');
vm.runInContext(code, sandbox);
const MUZE_DATA = sandbox.window.MUZE_DATA;

// ---- 与 app.js 保持一致的纯匹配逻辑 ----
const PROVINCE_CITIES = {
  '陕西': ['西安','铜川','宝鸡','咸阳','渭南','延安','汉中','榆林','安康','商洛'],
  '安徽': ['合肥','芜湖','蚌埠','淮南','马鞍山','淮北','铜陵','安庆','黄山','滁州','阜阳','宿州','六安','亳州','池州','宣城'],
  '吉林': ['长春','吉林','四平','辽源','通化','白山','松原','白城','延边'],
  '西藏': ['拉萨','日喀则','昌都','林芝','山南','那曲','阿里'],
  '新疆': ['乌鲁木齐','克拉玛依','吐鲁番','哈密','昌吉','博尔塔拉','巴音郭楞','阿克苏','克孜勒苏','喀什','和田','伊犁','塔城','阿勒泰'],
  '黑龙江': ['哈尔滨','齐齐哈尔','鸡西','鹤岗','双鸭山','大庆','伊春','佳木斯','七台河','牡丹江','黑河','绥化','大兴安岭'],
  '湖北': ['武汉','黄石','十堰','宜昌','襄阳','鄂州','荆门','孝感','荆州','黄冈','咸宁','随州','恩施','仙桃','潜江','天门','神农架'],
  '四川': ['成都','自贡','攀枝花','泸州','德阳','绵阳','广元','遂宁','内江','乐山','南充','眉山','宜宾','广安','达州','雅安','巴中','资阳','阿坝','甘孜','凉山'],
  '江苏': ['南京','无锡','徐州','常州','苏州','南通','连云港','淮安','盐城','扬州','镇江','泰州','宿迁'],
  '辽宁': ['沈阳','大连','鞍山','抚顺','本溪','丹东','锦州','营口','阜新','辽阳','盘锦','铁岭','朝阳','葫芦岛'],
  '山西': ['太原','大同','阳泉','长治','晋城','朔州','晋中','运城','忻州','临汾','吕梁'],
  '甘肃': ['兰州','嘉峪关','金昌','白银','天水','武威','张掖','平凉','酒泉','庆阳','定西','陇南','临夏','甘南'],
  '宁夏': ['银川','石嘴山','吴忠','固原','中卫'],
  '青海': ['西宁','海东','海北','黄南','海南','果洛','玉树','海西'],
  '内蒙古': ['呼和浩特','包头','乌海','赤峰','通辽','鄂尔多斯','呼伦贝尔','巴彦淖尔','乌兰察布','兴安盟','锡林郭勒盟','锡林郭勒','阿拉善盟','鄂托克前旗','乌审旗'],
  '山东': ['济南','青岛','淄博','枣庄','东营','烟台','潍坊','济宁','泰安','威海','日照','临沂','德州','聊城','滨州','菏泽'],
  '河南': ['郑州','开封','洛阳','平顶山','安阳','鹤壁','新乡','焦作','濮阳','许昌','漯河','三门峡','南阳','商丘','信阳','周口','驻马店','济源'],
  '河北': ['石家庄','唐山','秦皇岛','邯郸','邢台','保定','张家口','承德','沧州','廊坊','衡水','定州','辛集'],
  '北京': ['北京'], '天津': ['天津']
};
const ALIASES = { '巴盟': '巴彦淖尔', '阿拉善': '阿拉善盟', '内蒙': '内蒙古', '内蒙东部': '内蒙东', '内蒙西部': '内蒙西', '内蒙古东部': '内蒙东', '内蒙古西部': '内蒙西' };
const CITY_PROVINCE = {};
Object.keys(PROVINCE_CITIES).forEach((p) => PROVINCE_CITIES[p].forEach((c) => { if (!CITY_PROVINCE[c]) CITY_PROVINCE[c] = p; }));

function norm(s) {
  let t = String(s == null ? '' : s).replace(/\s+/g, '');
  t = t.replace(/(省|市|县|自治区|回族自治区|维吾尔自治区|壮族自治区|自治州|地区|区)$/, '');
  if (ALIASES[t]) t = ALIASES[t];
  return t;
}
function parseExclude(label) {
  const m = String(label || '').match(/（除([^）]+)）/);
  if (!m) return [];
  return m[1].split(/[、，,]/).map((x) => norm(x)).filter(Boolean);
}
function coverageOf(m) {
  if (m.__cov) return m.__cov;
  const leaves = new Set(); const excludes = new Set(); const meta = [];
  (m.regions || []).forEach((r) => {
    let names = [];
    if (r.type === 'province') names = [r.name].concat(PROVINCE_CITIES[r.name] || []);
    else if (r.type === 'city' || r.type === 'county') { names = [r.name]; const p = CITY_PROVINCE[r.name]; if (p) names.push(p); }
    else if (r.type === 'abroad') names = [r.name];
    else names = [r.name];
    const ex = (r.excluded ? r.excluded.map(norm) : parseExclude(r.label || r.name));
    meta.push({ names: names.slice(), type: r.type, label: r.label || r.name, excluded: ex });
    names.forEach((n) => leaves.add(norm(n)));
    ex.forEach((n) => excludes.add(norm(n)));
  });
  return (m.__cov = { leaves, excludes, meta });
}
function localLookup(rawQ) {
  const Q = norm(rawQ);
  if (Q.length < 2) return { ok: false };
  const matches = [];
  (MUZE_DATA.managers || []).forEach((m) => {
    const cov = coverageOf(m);
    if (cov.excludes.has(Q)) return;
    if (!cov.leaves.has(Q)) return;
    matches.push(m.name);
  });
  return { ok: matches.length > 0, matches };
}

// ---- 断言 ----
const tests = [
  ['河北', ['张贺凯', '管业']],  // 河北：两人都覆盖（城市自动连带省份，固有重叠）
  ['河南', ['孟运周', '贾伟松']],
  ['山东', ['孟运周']],
  ['山西', ['陈日']],
  ['陕西', ['黎孟']],
  ['新疆', ['毕红向']],
  ['江苏', ['孟运周']],
  ['黑龙江', ['管业']],
  ['吉林', ['贾伟松']],
  ['湖北', ['贾伟松']],
  ['安徽', ['贾伟松']],
  ['辽宁', []],                // 张贺凯 已不再负责辽宁（本次调整）
  ['四川', ['毕红向']],
  ['宁夏', ['黎孟']],
  ['国外', ['刘业峰']],
  ['乌海', ['黎孟']],          // 陈日明确排除
  ['巴彦淖尔', ['黎孟']],       // 陈日明确排除
  ['阿拉善', ['黎孟']],         // 别名 -> 阿拉善盟，陈日排除
  ['巴盟', ['黎孟']],           // 别名 -> 巴彦淖尔
  ['开封', ['孟运周', '贾伟松']],
  ['商丘', ['孟运周', '贾伟松']],
  ['天津', []],                // 张贺凯 已不再负责天津（本次调整）
  ['内蒙古', ['陈日', '张贺凯', '黎孟']],
  // 张贺凯 新片区（河北 5 市 + 内蒙东）
  ['张家口', ['张贺凯']],
  ['承德', ['张贺凯']],
  ['秦皇岛', ['张贺凯']],
  ['沧州', ['张贺凯']],
  ['衡水', ['张贺凯']],
  ['赤峰', ['陈日', '张贺凯']],  // 内蒙东/西交界，两人都覆盖（已知重叠，待确认）
  ['呼和浩特', ['陈日', '张贺凯']], // 呼市本身：东/西交界处，两人都覆盖（已知重叠，待确认）
  // 管业 新增城市
  ['保定', ['管业']],
  ['邢台', ['管业']],
  ['邯郸', ['管业']],
  // 内蒙西（呼市以西）归属：鄂尔多斯 归 陈日
  ['鄂尔多斯', ['陈日']],
  // 内蒙东/内蒙西 关键词检索（本次新增可检索区域）
  ['内蒙东', ['张贺凯']],
  ['内蒙西', ['陈日', '黎孟']],
  ['内蒙', ['陈日', '张贺凯', '黎孟']],   // 口语"内蒙" -> 内蒙古（全部三人）
  ['内蒙古东部', ['张贺凯']],
  ['内蒙古西部', ['陈日', '黎孟']],
  ['内蒙东部', ['张贺凯']],
  ['内蒙西部', ['陈日', '黎孟']],
];

let fail = 0;
console.log('命中测试：');
tests.forEach(([q, expect]) => {
  const r = localLookup(q);
  const got = r.ok ? r.matches.slice().sort() : [];
  const exp = expect.slice().sort();
  const ok = JSON.stringify(got) === JSON.stringify(exp);
  if (!ok) fail++;
  console.log(`  ${ok ? '✅' : '❌'} "${q}" => [${got.join(', ')}]${ok ? '' : '  期望 [' + exp.join(', ') + ']'}`);
});

// 关键排除断言：陈日不得出现在乌海/巴彦淖尔/阿拉善
['乌海', '巴彦淖尔', '阿拉善'].forEach((q) => {
  const r = localLookup(q);
  const bad = r.matches.includes('陈日');
  if (bad) { fail++; console.log(`  ❌ "${q}" 错误地命中了陈日（应被排除）`); }
  else console.log(`  ✅ "${q}" 正确排除陈日`);
});

console.log(fail ? `\n有 ${fail} 项未通过 ❌` : '\n全部通过 ✅');
process.exit(fail ? 1 : 0);
