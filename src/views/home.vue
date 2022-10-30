<template>
  
</template>

<script lang="ts" setup>
import { reactive} from "vue";

const homeData = reactive({
  planlist: [],
  planedlist: [],
  unpublishedlist: [],
  workbenchList: [],
  workbenchedList: [],
});
// onMounted(async () => {
//   await getPlanlist();
//   await getPlanedlist();
//   await unpublishedlist();
//   await getWorkbenchlist();
//   await getWorkbenchedlist();
// });

// 筛选权限
const filterActive = (filterArray: any, filterTerm: string, activePath: any = []) => {
  filterArray.forEach((e: any) => {
    if (e.children && e.children.length) {
      filterActive(e.children, filterTerm, activePath);
    } else {
      if (e.path.includes(filterTerm)) {
        activePath.push(e);
      }
    }
  });
  return activePath;
};
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  height: auto;
  img {
    width: 100%;
    height: auto;
  }
}
.mainList {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 10px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.homeTitle {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: #333;
  p {
    font-size: 12px;
    color: #999;
    cursor: pointer;
  }
}
</style>
