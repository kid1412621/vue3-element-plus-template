<template>
  <el-button @click="add" type="primary" size="mini">新增</el-button>
  <el-button @click="deleteChecked" type="danger" size="mini"
    >批量删除</el-button
  >

  <el-tree
    ref="tree"
    :props="props"
    :data="categories"
    show-checkbox
    default-expand-all
  >
    <template #default="{ node }">
      <span>{{ node.label }}</span>
      <span class="btns">
        <el-button
          @click.stop="add(node)"
          type="primary"
          size="mini"
          v-if="node.level < 2"
          >新增子类</el-button
        >
        <el-button @click.stop="edit(node)" type="warning" plain size="mini"
          >修改</el-button
        >
        <el-popconfirm title="确定删除？" @confirm="deleteOne(node)">
          <template #reference>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-popconfirm>
      </span>
    </template>
  </el-tree>
</template>

<script>
import { add, edit, batchDelete, getAllByCode } from "@/api/category";
import { INFO_KIND } from "@/types/const";

export default {
  props: {
    kind: { type: Number, required: true },
  },
  data() {
    return {
      props: {
        label: "title",
        isLeaf: "leaf",
      },
      categories: [],
    };
  },
  methods: {
    add(node) {
      this.$prompt("请输入分类名称")
        .then(({ value }) => {
          if (!value) return Promise.reject();

          return add({
            pcode: node.data ? null : INFO_KIND[this.kind],
            pid: node.data?.key,
            name: value,
          });
        })
        .then(() => {
          this.loadCategory();
          this.$notify.success("添加成功");
        })
        .catch((err) => {
          this.$notify.error("添加失败");
        });
    },
    edit(node) {
      this.$prompt("请输入分类名称", { inputValue: node.data.title })
        .then(({ value }) => {
          if (!value || value === node.data.title)
            return Promise.reject("请输入修改内容");

          return edit({ id: node.data.key, name: value });
        })
        .then(() => {
          this.loadCategory();
          this.$notify.success("修改成功");
        })
        .catch((err) => {
          this.$notify.error(err || "修改失败");
        });
    },
    deleteOne(node) {
      batchDelete([node.data.key])
        .then((res) => {
          this.loadCategory();
          this.$notify.success("删除成功");
        })
        .catch((err) => {
          this.$notify.error("删除失败");
        });
    },
    deleteChecked() {
      const ids = this.$refs.tree.getCheckedNodes().map((i) => i.key);
      batchDelete(ids)
        .then((res) => {
          this.loadCategory();
          this.$notify.success("删除成功");
        })
        .catch((err) => {
          console.debug(err);
          this.$notify.error("删除失败");
        });
    },
    loadCategory() {
      getAllByCode({ pcode: INFO_KIND[this.kind] }).then((res) => {
        this.categories = res;
      });
    },
  },
  created() {
    this.loadCategory();
  },
};
</script>

<style lang="scss" scoped>
/* stylelint-disable */
:deep(.el-tree-node__content) {
  /* stylelint-enable */
  margin: 3px 0;
}
.btns {
  position: absolute;
  right: 0;
}
</style>
