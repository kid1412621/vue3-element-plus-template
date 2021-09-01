<template>
  <!-- 筛选 -->
  <el-form :inline="true" :model="query">
    <el-form-item label="内容">
      <el-input v-model="query.content" clearable></el-input>
    </el-form-item>
    <el-form-item label="联系方式">
      <el-input v-model="query.contact" clearable></el-input>
    </el-form-item>

    <el-button @click="reset">重置</el-button>
    <el-button
      type="danger"
      @click="handleDelete(true)"
      :disabled="!selectedIds.length"
      >删除</el-button
    >
  </el-form>

  <!-- 表格 -->
  <el-table ref="table" :data="list" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column prop="id" label="ID" width="80"> </el-table-column>
    <el-table-column prop="content" label="内容" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="contact" label="联系方式" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"> </el-table-column>
    <el-table-column label="操作" fixed="right" width="150">
      <template #default="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(false, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    background
    class="page"
    :total="total"
    v-model:currentPage="query.pageNo"
    v-model:page-size="query.pageSize"
  >
  </el-pagination>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { getFeedbackList, deleteFeedback } from "@/api/settings";
import { ElNotification } from "element-plus";
import { IFeedback, PageQuery } from "@/types";

@Options({
  name: "feedback",
  watch: {
    query: {
      deep: true,
      handler() {
        this.loadList();
      },
    },
  },
})
export default class Feedback extends Vue {
  // data
  query = {
    pageNo: 1,
    pageSize: 8,
  } as Partial<IFeedback> & PageQuery;
  list = [] as IFeedback[];
  selectedIds = [] as number[];
  total = 0;

  // methods
  async loadList() {
    const res = await getFeedbackList(this.query);
    this.list = res.records;
    this.total = res.total;
  }
  reset(): void {
    this.query = {
      pageNo: 1,
      pageSize: 8,
    };
  }
  handleDelete(isBatch: boolean, row: IFeedback): void {
    if (isBatch && !this.selectedIds.length) return;
    const ids = isBatch ? this.selectedIds : [row.id];
    deleteFeedback(ids)
      .then(() => {
        ElNotification({ type: "success", message: "操作成功" });
        this.loadList();
      })
      .catch((err: string) =>
        ElNotification({ type: "error", message: err || "操作失败" })
      );
  }
  handleSelectionChange(val: IFeedback[]): void {
    this.selectedIds = val.map((i: IFeedback) => i.id);
  }

  // hooks
  created(): void {
    this.loadList();
  }
}
</script>

<style lang="scss" scoped>
.page {
  bottom: 30px;
  position: absolute;
  right: 50px;
}
</style>
