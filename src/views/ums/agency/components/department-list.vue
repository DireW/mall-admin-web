<template>
    <div class="department-list">
        <div class="top-buttons">
            <el-button type="primary" @click="addDept">新增门店</el-button>
            <el-button @click="fetchFromServer">刷新</el-button>
            <span class="search-condition">
              区域：
              <el-select v-model="selectedArea" placeholder="请选择区域" clearable>
                  <el-option v-for="area in areaList" :key="area.id" :value="area.id" :label="area.name"/>
              </el-select>
          </span>
        </div>

        <el-table ref="deptTableRef"
                  :data="deptList"
                  border
                  v-loading="loading">
            <el-table-column label="门店名称" prop="name" align="center"/>
            <el-table-column label="店长" prop="principalName" align="center"/>
            <el-table-column label="所属区域" prop="areaName" align="center"/>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="{row, index}">
                    <el-button type="text" @click="editDept(row)">编辑</el-button>
                    <el-button type="text" @click="deleteDept(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增、编辑门店信息 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" :before-close="closeDialog">
            <el-form ref="deptFormRef" :model="deptForm" :rules="deptFormRules" label-width="90px">
                <el-form-item label="门店名称" prop="name">
                    <el-input v-model="deptForm.name"/>
                </el-form-item>
                <el-form-item label="负责人">
                    <el-select v-model="deptForm.principalId" filterable clearable style="width:100%;">
                        <el-option v-for="(emp,index) in empList" :key="index" :value="emp.id" :label="`${emp.realName}(${emp.username})`"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属区域">
                    <el-select v-model="deptForm.areaId" filterable clearable style="width:100%;">
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
        this.fetchFromServer();
    },
    methods: {
        addDept() {
            this.dialogTitle = '新增门店';
            this.deptForm = {
                id: null,
                name: '',
                principalId: null,
                areaId: null,
            };
            this.$refs.deptFormRef && this.$refs.deptFormRef.clearValidate();
            this.dialogVisible = true;
        },
        editDept(dept) {
            this.dialogTitle = '编辑门店';
            this.deptForm = {
                ...dept
            };
            this.$refs.deptFormRef && this.$refs.deptFormRef.clearValidate();
            this.dialogVisible = true;
        },
        saveDept() {
            this.$refs.deptFormRef.validate(valid => {
                if (!valid) return;
                this.$axios.post('/admin/ums/agency/department/save-update', this.deptForm)
                    .then(res => {
                        this.fetchFromServer();
                        this.dialogVisible = false;
                    })
                    .catch(err => {
                        console.error("更新门店信息异常")
                    })
            });

        },
        deleteDept(id) {
            this.$confirm('确定删除门店信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                this.$axios.delete(`/admin/ums/agency/department/delete/${id}`)
                    .then(res => {
                        this.fetchFromServer();
                    })
                    .catch(err => {
                        console.error('删除门店失败', err);
                    })
            }).catch(_ => {

            })
        },
        fetchFromServer() {
            this.$axios.post('/admin/ums/agency/department/list', {areaId: this.selectedArea})
                .then(res => {
                    this.deptList = res.data;
                })
                .catch(_ => {})
        },
        closeDialog(done) {
            this.deptForm = {
                id: null,
                name: '',
                principalId: null,
                areaId: null
            };
            this.$refs.deptFormRef && this.$refs.deptFormRef.clearValidate();
            done();
        }
    }
}
</script>

<style lang="scss" scoped>
.department-list {
    .search-condition {
        font-size: 14px;
        color: #888888;
        margin-left: 30px;
    }
}
</style>
