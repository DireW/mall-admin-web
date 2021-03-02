<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="8">
                <area-list :emp-list="empList" @update-area="updateAreaList"/>
            </el-col>
            <el-col :span="16">
                <department-list :emp-list="empList" :area-list="areaList" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import AreaList from "./components/area-list";
import DepartmentList from "./components/department-list";
export default {
    name: "index",
    components: {DepartmentList, AreaList},
    data() {
        return {
            // 右侧门店查询条件使用的区域信息
            areaList: [],
            empList: [],
        }
    },
    created() {
        this.fetchEmployeeList();
    },
    methods: {
        fetchEmployeeList() {
            this.$axios.get("/admin/employee/all")
                .then(res => {
                    this.empList = res.data;
                })
                .catch(_ => {});
        },
        updateAreaList(areaList) {
            this.areaList = areaList;
        }
    }
}
</script>

<style scoped>

</style>
