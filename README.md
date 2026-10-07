# 校园自习室信息与数据展示平台（自主实践 practice-08）

> 软件开发综合实践 · 第八次课《前端技术整合、质量检查与成果验收》自主实践作业，
> 同时作为**期末大作业的直接原型**。本项目把前几次课的页面结构、Bootstrap 样式、
> 交互筛选、JSON 数据加载、ECharts / Chart.js 图表和 Three.js 三维场景，
> 通过统一导航整合成一个完整作品。

## 一、功能模块（六模块整合）

| 模块 | 说明 | 对应课堂作业 |
| --- | --- | --- |
| 页面结构 | 语义化 `nav / section / footer`，统一导航 + 滚动高亮（scrollspy） | 作业五 |
| 样式与响应式 | Bootstrap 栅格 + 自定义样式，适配桌面 / 平板 / 手机三档宽度 | 作业五 |
| 交互 | 自习室实时搜索、楼栋筛选、开放状态筛选，组合过滤、即时渲染 | 作业五 |
| 数据 | 异步 `fetch` 加载 `study_rooms.json`，含加载中 / 空数据 / 失败三状态 | 作业六 |
| 可视化 | ECharts 楼栋座位柱状图 + Chart.js 开放状态环形图（两类有效图表） | 作业六 |
| 三维进阶 | Three.js 校园三维导览，OrbitControls 旋转 / 缩放 / 平移，自动缓慢旋转 | 作业七 |

## 二、目录结构

```
practice-08/
├── index.html            # 统一入口：导航 + 首页 + 图表分析 + 自习室查询
├── css/
│   └── style.css         # 自定义样式（在 Bootstrap 之后引入）
├── js/
│   └── app.js            # 数据加载、统计卡片、两类图表、搜索与筛选
├── data/
│   ├── study_rooms.json  # 12 间自习室课程统一数据集
│   └── books.json        # 馆藏图书示例数据
├── three-d/
│   ├── scene.html        # 三维场景页面
│   └── scene.js          # Three.js 场景代码
├── libs/                 # 第三方库本地副本（不依赖外网 CDN）
└── README.md
```

## 三、运行方式（重要：不要直接双击打开）

因为页面用 `fetch` 加载本地 JSON，直接双击（`file://`）会被浏览器的同源策略拦截，
**必须通过本地服务器访问**：

1. 打开 PowerShell，进入本作业根目录（`第八次作业`），执行：

   ```
   python -m http.server 8080
   ```

2. 浏览器访问：

   - 首页：`http://localhost:8080/practice-08/`
   - 三维：`http://localhost:8080/practice-08/three-d/scene.html`

3. 停止服务器：在 PowerShell 窗口按 `Ctrl + C`。

## 四、数据与第三方资源来源

- **数据**：`data/study_rooms.json` 为课程提供的统一教学演示数据集，共 12 间自习室，
  字段含名称、楼栋、楼层、座位数、在馆人数、开放状态、开放时间；**数据为虚构教学数据，非真实统计**。
- **第三方库**（均放在 `libs/`，来自课程讲义提供的本地副本 / 官方发行版）：
  - Bootstrap 5（bootstrap.min.css、bootstrap.bundle.min.js）
  - jQuery 3.7.1
  - Apache ECharts 5（echarts.min.js）
  - Chart.js 4（chart.umd.js）
  - Three.js（three.min.js）及 OrbitControls 控制器
  - A-Frame（aframe.min.js，备用）

## 五、质量自查情况

- 三档宽度（1200 / 768 / 375）下布局正常、无横向滚动条；
- Console 控制台无红色报错；
- 数据文件缺失（改名模拟 404）时显示失败提示，页面不白屏；
- 数据为空时显示「暂无数据」空状态提示；
- 搜索无结果时显示友好的无结果提示。

## 六、说明

本项目为课程教学练习，页面数据均为虚构演示数据，不代表任何真实场所的实时情况。
