<template>
  <article-detail :is-edit='true' :detailId="this.$route.params.id"></article-detail>
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'productEdit',
  components: { ArticleDetail }
}
</script>

