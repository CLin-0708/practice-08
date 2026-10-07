// scene.js - 校园三维导览（复用课堂七 Three.js 代码改造）

// 场景：天空色背景 + 雾效
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaee3f7);
scene.fog = new THREE.Fog(0xaee3f7, 14, 30);

// 相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(8, 5.5, 10);

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 轨道控制器：鼠标拖拽旋转、滚轮缩放、右键平移
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.8, 0);

// 灯光：环境光 + 方向光
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight.position.set(6, 10, 7);
scene.add(dirLight);

// 地面：校园草坪
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: 0x8bc34a, roughness: 0.9 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const campus = new THREE.Group();

// 建造一栋楼：楼体 + 屋顶
function makeBuilding(w, h, d, bodyColor, roofColor) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.7 })
  );
  body.position.y = h / 2;
  g.add(body);
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.18, 0.25, d + 0.18),
    new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.6 })
  );
  roof.position.y = h + 0.125;
  g.add(roof);
  return g;
}

// 五栋楼（对应自习室数据里的五栋建筑，图书馆最高）
const layout = [
  { x: 0, z: -3.4, w: 1.8, h: 2.4, d: 1.6, c: 0xeceff1, r: 0xb71c1c },  // 图书馆
  { x: -3.4, z: -1, w: 1.6, h: 1.7, d: 1.4, c: 0xf5f5f5, r: 0x455a64 }, // 楠苑
  { x: 3.4, z: -1, w: 1.6, h: 1.5, d: 1.4, c: 0xe3f2fd, r: 0x1565c0 },  // 梓苑
  { x: -2.5, z: 2.8, w: 1.5, h: 1.3, d: 1.3, c: 0xf1f8e9, r: 0x2e7d32 },// 理科楼
  { x: 2.5, z: 2.8, w: 1.5, h: 1.9, d: 1.3, c: 0xfff8e1, r: 0xef6c00 }  // 文科楼
];
layout.forEach(function (b) {
  const bld = makeBuilding(b.w, b.h, b.d, b.c, b.r);
  bld.position.set(b.x, 0, b.z);
  campus.add(bld);
});

// 中央旗杆 + 红旗
const pole = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 3.2, 12),
  new THREE.MeshStandardMaterial({ color: 0x9e9e9e })
);
pole.position.y = 1.6;
campus.add(pole);
const flag = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.5, 0.03),
  new THREE.MeshStandardMaterial({ color: 0xe53935, side: THREE.DoubleSide })
);
flag.position.set(0.42, 2.9, 0);
campus.add(flag);

scene.add(campus);

// 渲染循环：整个校园缓慢自转展示
let running = true;
function animate() {
  if (!running) return;
  requestAnimationFrame(animate);
  campus.rotation.y += 0.0025;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 页面隐藏（如返回首页）时暂停渲染循环，避免后台空转卡顿
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    running = false;
  } else if (!running) {
    running = true;
    requestAnimationFrame(animate);
  }
});

// 视口自适应
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
