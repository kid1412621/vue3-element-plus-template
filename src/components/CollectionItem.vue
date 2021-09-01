<template>
  <el-form :inline="true" :model="itemQuery">
    <el-form-item label="标题">
      <el-input v-model="itemQuery.title" clearable></el-input>
    </el-form-item>
    <el-button @click="resetItemQuery">重置</el-button>
    <el-button @click="addCollectionItem" type="primary">加入合集</el-button>
    <el-button @click="removeCollectionItem" type="warning">移出合集</el-button>
  </el-form>

  <div class="list">
    <!-- 左：待加的文章/课程 -->
    <span class="panel">
      <el-table
        :data="itemList"
        @selection-change="
          (items) => (selectedInfoIds = items.map((i) => i.id))
        "
        ref="itemTable"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="typeText" label="类别"> </el-table-column>
        <el-table-column label="状态">
          <template #default="scope"
            >{{ scope.row.isValid ? "显示" : "隐藏" }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :total="itemTotal"
        v-model:currentPage="itemQuery.pageNo"
        v-model:page-size="itemQuery.pageSize"
      >
      </el-pagination>
    </span>

    <!-- 右：已加的文章/课程 -->
    <span class="panel">
      <el-table
        :data="collectionItems"
        @selection-change="
          (items) => (selectedItemIds = items.map((i) => i.id))
        "
        ref="itemTable"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="typeText" label="类别"> </el-table-column>
        <el-table-column label="状态">
          <template #default="scope"
            >{{ scope.row.isValid ? "显示" : "隐藏" }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :total="collItemTotal"
        v-model:currentPage="collItemQuery.pageNo"
        v-model:page-size="collItemQuery.pageSize"
      >
      </el-pagination
    ></span>
  </div>
</template>

<script lang="ts">
import { ElNotification } from "element-plus";
import { defineComponent, PropType } from "vue";
import { getList as getInfoList } from "@/api/info";
import {
  getItemList as getCollectionItemList,
  addItems,
  removeItems,
} from "@/api/collection";
import { INFO_KIND } from "@/types/const";

export default defineComponent({
  name: "CollectionItem",
  props: {
    id: Number,
    kind: { type: Number as PropType<INFO_KIND>, required: true },
  },
  data() {
    return {
      // 文章/课程内容
      itemList: [],
      itemTotal: 0,
      itemQuery: {
        kind: this.kind,
        pageNo: 1,
        pageSize: 6,
        title: null,
      },
      selectedInfoIds: [],
      // 合集的内容
      collectionItems: [],
      selectedItemIds: [],
      collItemTotal: 0,
      collItemQuery: {
        collectionId: this.id,
        kind: this.kind,
        pageNo: 1,
        pageSize: 6,
      },
    };
  },
  watch: {
    itemQuery: {
      deep: true,
      handler(val) {
        this.loadItemList();
      },
    },
    collItemQuery: {
      deep: true,
      handler(val) {
        this.loadCollectionItemList();
      },
    },
  },
  methods: {
    loadItemList() {
      getInfoList(this.itemQuery).then((res: any) => {
        this.itemList = res.records;
        this.itemTotal = res.total;
      });
    },
    resetItemQuery() {
      this.itemQuery = {
        kind: this.kind,
        pageNo: 1,
        pageSize: 6,
        title: null,
      };
      (this.$refs as any).itemTable.clearSelection();
    },
    addCollectionItem() {
      if (!this.selectedInfoIds.length) {
        (ElNotification as any).warning("请选择要加入的课程");
        return;
      }
      addItems(this.id, this.selectedInfoIds)
        .then(() => {
          (ElNotification as any).success("添加成功");
          this.loadCollectionItemList();
        })
        .catch(() => {
          (ElNotification as any).warning("已添加该课程");
        });
    },
    removeCollectionItem() {
      if (!this.selectedItemIds.length) {
        (ElNotification as any).warning("请选择要移除的课程");
        return;
      }
      removeItems({ id: this.id, itemIds: this.selectedItemIds.join() }).then(
        () => {
          (ElNotification as any).success("添加成功");
          this.loadCollectionItemList();
        }
      );
    },
    loadCollectionItemList() {
      getCollectionItemList(this.collItemQuery).then((res: any) => {
        this.collectionItems = res.records;
        this.collItemTotal = res.total;
      });
    },
  },
  created() {
    this.loadCollectionItemList();
  },
});
</script>

<style scoped lang="scss">
.list {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  .panel {
    width: 47%;
  }
}
</style>
