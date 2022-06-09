# exam-ui

### 前序准备

前端技术栈基于ES6、vue、vuex、vue-router、vue-cli、axios、element-ui，可以提前了解和学习这些知识会对使用本项目有很大的帮助。

### 功能

```
- 登录 / 注销

- 权限验证
  - 页面权限
  - 路由权限
  - 权限配置

- 多环境发布
 - dev
 - stage
 - prod
 
- 题库功能
 - 单选题编辑
 - 多选题编辑
 - 填空题编辑
 - 判断题编辑
 - 简答题编辑
 - 错题集
 
- 卷库管理
 - 时段试卷
 - 任务试卷
 - 班级试卷
 - 在线阅卷
 - 在线考试
 - 考试记录
 - 成绩分析
 
- 系统管理
 - 性能监控
 - 日志管理
 - 角色管理
 - 资源管理
```

### 开发

```shell
# 克隆项目
git clone https://github.com/CNPolaris/exam-ui.git

# 进入项目目录
cd exam-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

### 发布

```shell
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```