<template>
    <div class="department-list">
        <div class="top-buttons">
            <el-button size="small" type="primary" @click="addDept">新增门店</el-button>
            <el-button size="small" @click="fetchFromServer">刷新</el-button>
            <span>
              区域：
              <el-select v-model="selectedArea" placeholder="请选择区域">
                  <el-option v-for="area in areaList" :key="area.id" :value="area.id" :label="area.name"/>
              </el-select>
          </span>
        </div>

        <el-table ref="areaTableRef"
                  :data="deptList"
                  border
                  v-loading="loading">
            <el-table-column label="名称" prop="name" align="center"/>
            <el-table-column label="店长" prop="principalName" align="center"/>
            <el-table-column label="所属区域" prop="areaName" align="center"/>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="{row, index}">
                    <el-button type="text" size="small" @click="editDept(row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteDept(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增、编辑门店信息 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" :before-close="closeDialog">
            <el-form ref="deptFormRef" :model="deptForm" :rules="deptFormRules" label-width="90px">
                <el-form-item label="区域名称" prop="name">
                    <el-input v-model="deptForm.name"/>
                </el-form-item>
                <el-form-item label="负责人">
                    <el-select v-model="deptForm.principalId" filterable style="width:100%;">
                        <el-option v-for="(emp,index) in empList" :key="index" :value="emp.id" :label="emp.name"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属区域">
                    <el-select v-model="deptForm.areaId" filterable style="width:100%;">
                        <el-option v-for="(area,index) in areaList" :key="index" :value="area.id" :label="area.name"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDept">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: "department-list",
    props: {
        areaList: {
            type: Array,
            default() {
                return [];
            }
        },
        empList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            loading: false,
            selectedArea: null,
            deptList: [],
            dialogTitle: '',
            dialogVisible: false,
            deptForm: {
                id: null,
                name: '',
                principalId: null,
                areaId: null,
            },
            deptFormRules: {
                name: [{required: true, message: '请填写门店名称', trigger: 'blur'}]
            }
        }
    },
    created() {

    },
    methods: {
        addDept() {

        },
        editDept(dept) {

        },
        saveDept() {

        },
        deleteDept(id) {

        },
        fetchFromServer() {

        },
        closeDialog(done) {

        }
    }
}
</script>

<style scoped>

</style>
