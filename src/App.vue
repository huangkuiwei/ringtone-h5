<script>
import { mapActions } from 'vuex';

export default {
  name: 'app',

  data() {
    return {};
  },

  onLaunch() {
    this._getUserInfo();
  },

  methods: {
    ...mapActions('app', ['_getUserInfo']),
  },
};
</script>

<style lang="scss">
@import './common/styles/reset.scss';
@import './common/styles/global.scss';
</style>
