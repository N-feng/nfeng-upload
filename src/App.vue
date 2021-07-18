<template>
  <h1>Hello {{ name }}</h1>
  <Upload />
</template>

<script>
import Upload from "./components/Upload.vue"

export default {
  components: { Upload },
  data() {
    return { name: 'World!' }
  }
}
</script>

<style scoped>
h1 {
  color: #cccccc;
}
</style>