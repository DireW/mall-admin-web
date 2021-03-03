<template>
    <div class="area-list">
        <div class="top-buttons">
            <el-button type="primary" @click="addArea">新增区域</el-button>
            <el-button @click="refreshList">刷新</el-button>
        </div>

        <el-table ref="areaTableRef"
                  :data="areaList"
                  border
                  v-loading="loading">
            <el-table-column label="区域名称" prop="name" align="center"/>
            <el-table-column label="区域经理" prop="principalName" align="center"/>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="{row, index}">
                    <el-button type="text" @click="editArea(row)">编辑</el-button>
                    <el-button type="text" @click="deleteArea(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增、编辑区域信息 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :before-close="closeDialog">
            <el-form ref="areaFormRef" :model="areaForm" :rules="areaFormRules" label-width="90px">
                <el-form-item label="区域名称" prop="name">
                    <el-input v-model="areaForm.name"/>
                </el-form-item>
                <el-form-item label="负责人">
                    <el-select v-model="areaForm.principalId" filterable style="width:100%;" clearable>
                        <el-option v-for="(emp,index) in empList" :key="index" :value="emp.id" :label="`${emp.realName}(${emp.username})`"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveArea">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "area-list",
    props: {
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
            currentAreaId: null,
            areaList: [],
            dialogTitle: '',
            dialogVisible: false,
            areaForm: {
                id: null,
                name: '',
                principalId: null,
            },
            areaFormRules: {
                name: [{required: true, message: '请填写区域名称', trigger: 'blur'}]
            },

        }
    },
    created() {
        this.refreshList();
    },
    methods: {
        addArea() {
            this.dialogTitle = '新增区域';
            this.areaForm = {
                id: null,
                name: '',
                principalId: null
            };
            this.$refs.areaFormRef && this.$refs.areaFormRef.clearValidate();
            this.dialogVisible = true;
        },
        editArea(area) {
            this.dialogTitle = '编辑区域';
            this.areaForm = {
                ...area
            };
            this.$refs.areaFormRef && this.$refs.areaFormRef.clearValidate();
            this.dialogVisible = true;
        },
        saveArea() {
            this.$refs.areaFormRef.validate(valid => {
                if (!valid) return;
                this.$axios.post('/admin/ums/agency/area/save-update', this.areaForm)
                    .then(res => {
                        this.refreshList();
                        this.dialogVisible = false;
                    })
                    .catch(err => {
                        console.error("更新区域信息异常")
                    })
            });
        },
        deleteArea(id) {
            this.$confirm('确定删除区域信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                this.$axios.delete(`/admin/ums/agency/area/delete/${id}`)
                    .then(res => {
                        this.refreshList();
                    })
                    .catch(err => {
                        console.error('删除区域失败', err);
                    })
            }).catch(_ => {

            })
        },
        refreshList() {
            this.loading = true;
            this.$axios.get('/admin/ums/agency/area/list')
                .then(res => {
                    this.loading = false;
                    this.areaList = res.data;
                    this.$emit('update-area', res.data);
                })
                .catch(err => {
                    this.loading = false;
                    console.info('区域列表异常', err);
                });
        },
        closeDialog(done) {
            this.areaForm = {
                id: null,
                name: '',
                principalId: null
            };
            this.$refs.areaFormRef && this.$refs.areaFormRef.clearValidate();
            done();
        }
    }
}
</script>

<style scoped>

</style>
