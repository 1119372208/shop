<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  .el-breadcrumb {
     margin-bottom: 10px;
     border-bottom: 1px solid #ccc;
     height: 40px;
     line-height: 40px;
  }
}
</style>
