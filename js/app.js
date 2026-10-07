// app.js - 自主实践第二步：JSON 数据加载、统计卡片、两类图表

const state = { data: null };

const dataStatusEl = document.getElementById('dataStatus');
const statCardsEl = document.getElementById('statCards');

// 状态提示：加载 / 空 / 失败
function showStatus(type, html) {
  dataStatusEl.style.display = 'block';
  dataStatusEl.className = 'alert alert-' + type + ' py-2 px-3 show';
  dataStatusEl.innerHTML = html;
}
function hideStatus() {
  dataStatusEl.style.display = 'none';
}

// 异步加载自习室数据
async function loadData() {
  showStatus('warning', '⏳ 正在加载校园自习室数据 data/study_rooms.json ...');
  try {
    const response = await fetch('data/study_rooms.json');
    if (!response.ok) {
      throw new Error('HTTP 网络错误：' + response.status);
    }
    const data = await response.json();
    if (!data.rooms || data.rooms.length === 0) {
      showStatus('secondary', '📭 暂无自习室数据（数据源为空），请检查 study_rooms.json');
      return;
    }
    state.data = data;
    hideStatus();
    renderStatCards(data);
    renderBarChart(data);
    renderStatusChart(data);
  } catch (error) {
    showStatus('danger', '⚠️ 数据加载失败：' + error.message +
      '（直接双击打开会被浏览器拦截，请用本地服务器 http://localhost:8080/practice-08/ 访问）');
  }
}

// 宏观统计卡片
function renderStatCards(data) {
  const rooms = data.rooms;
  const totalRooms = rooms.length;
  const totalSeats = rooms.reduce((s, r) => s + r.seats, 0);
  const totalOccupied = rooms.reduce((s, r) => s + r.occupied, 0);
  const rate = (totalOccupied / totalSeats * 100).toFixed(1);

  const cards = [
    { label: '自习室总数', value: totalRooms, unit: '间', color: 'primary', note: '涵盖全校 5 大楼栋区域' },
    { label: '总座位容量', value: totalSeats, unit: '席', color: 'success', note: '已统计开放楼层自习位' },
    { label: '当前在馆人数', value: totalOccupied, unit: '人', color: 'warning', note: '自习室实时已入座统计' },
    { label: '全校在座率', value: rate, unit: '%', color: 'danger', note: '全校自习资源负荷比例' }
  ];

  statCardsEl.innerHTML = cards.map(c =>
    '<div class="col-md-6 col-lg-3">' +
      '<div class="card card-stat bg-white p-3 h-100">' +
        '<div class="text-muted small">' + c.label + '</div>' +
        '<div class="fs-3 fw-bold text-' + c.color + ' mt-1">' + c.value +
          '<span class="fs-6 text-muted fw-normal"> ' + c.unit + '</span></div>' +
        '<div class="small text-muted mt-2">' + c.note + '</div>' +
      '</div>' +
    '</div>').join('');
}

// ECharts 各楼栋座位与在座人数柱状图
let barChart = null;
function renderBarChart(data) {
  if (!barChart) {
    barChart = echarts.init(document.getElementById('barChart'));
  }
  const buildings = ['楠苑', '梓苑', '图书馆', '理科楼', '文科楼'];
  const stats = buildings.map(b => {
    const rs = data.rooms.filter(r => r.building === b);
    return {
      building: b,
      seats: rs.reduce((s, r) => s + r.seats, 0),
      occupied: rs.reduce((s, r) => s + r.occupied, 0)
    };
  });

  barChart.setOption({
    title: { text: '各楼栋自习资源分布对比', left: 'center', textStyle: { fontSize: 15, fontWeight: 'bold' } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0, data: ['座位容量', '当前在馆人数'] },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: stats.map(s => s.building), axisTick: { alignWithLabel: true } },
    yAxis: { type: 'value', name: '数量（席 / 人）' },
    series: [
      { name: '座位容量', type: 'bar', data: stats.map(s => s.seats),
        itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] } },
      { name: '当前在馆人数', type: 'bar', data: stats.map(s => s.occupied),
        itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] } }
    ]
  });
}

// Chart.js 自习室开放状态环形图
let statusChart = null;
function renderStatusChart(data) {
  const counts = {
    '开放': data.rooms.filter(r => r.status === '开放').length,
    '维修': data.rooms.filter(r => r.status === '维修').length,
    '闭馆': data.rooms.filter(r => r.status === '闭馆').length
  };
  const ctx = document.getElementById('statusChart');
  if (statusChart) statusChart.destroy();

  statusChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['正常开放', '暂停维修', '闭馆中'],
      datasets: [{
        data: [counts['开放'], counts['维修'], counts['闭馆']],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 14, font: { size: 12 } } },
        title: { display: true, text: '自习室开放状态占比（共 12 间）', font: { size: 14, weight: 'bold' } }
      }
    }
  });
}

// 图表自适应
window.addEventListener('resize', function () {
  if (barChart) barChart.resize();
});

loadData();
console.log('自习室数据平台第二步：JSON 数据、统计卡片与两类图表已加载 ✅');
