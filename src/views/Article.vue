<template>
  <Info :kind="kind"></Info>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Info from "@/components/Info.vue";
import { INFO_KIND } from "@/types/const";

export default defineComponent({
  name: "Article",
  components: { Info },
  data() {
    return {
      kind: INFO_KIND.ARTICLE,
    };
  },
});
</script>
