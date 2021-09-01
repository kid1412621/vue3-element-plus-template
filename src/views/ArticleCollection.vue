<template>
  <Collection :kind="kind"></Collection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Collection from "@/components/Collection.vue";
import { INFO_KIND } from "@/types/const";

export default defineComponent({
  name: "ArticleCollection",
  components: { Collection },
  data() {
    return {
      kind: INFO_KIND.ARTICLE,
    };
  },
});
</script>
