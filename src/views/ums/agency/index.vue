<template>
    <div class="app-container">
        <area-list @choose-area="chooseArea"/>
    </div>
</template>

<script>
import AreaList from "./components/area-list";
export default {
    name: "index",
    components: {AreaList},
    data() {
        return {

        }
    },
    created() {
    },
    methods: {
        chooseArea(area) {
            console.info('choose area', area);
        }
    }
}
</script>

<style scoped>

</style>
