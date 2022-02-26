<script>
export default {
  name: 'JSX',
  render: () => {
    return (
      <span>
        {this.$i18n.tExtend('efe4427e425172c1ba18974625600eed', [this.name])}
      </span>
    );
  },
};
</script>
