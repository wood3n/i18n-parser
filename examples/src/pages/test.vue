<template>
  <div>
    {{ $t('7f3aa4b8a69b5bbd465c0857e5106fcf')
    }}<HelloWorld
      :test1="$t('e254640a37afe91979b3aa6ddf5f1e16')"
      :test2="$t('7cd67abaa5c3bb04cd48ef3f497f7f40')"
      :test3="$i18n.tExtend('a97a7d8dc02f16212eee0538e09f077f', [dffff])"
    />
    <p>
      {{ $i18n.tExtend('6157a7b0e5ea6cd18733493f39354944', [efdf]) }}
    </p>
  </div>
</template>
<script>
export default {};
</script>
