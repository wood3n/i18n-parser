<template>
  <div>
    普通文本
    <HelloWorld
      test1="属性文本"
      :test2="`内联字符串`"
      :test3="`模板字符串${dffff}测试`"
    />
    <p>
      {{ `子元素内插模板字符串${efdf}` }}
    </p>
  </div>
</template>
<script>
export default {};
</script>
<style></style>
