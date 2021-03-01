<template>
    <div class="area-list">
        <div class="top-buttons">
            <el-button size="small" type="primary" @click="addArea">新增区域</el-button>
            <el-button size="small" @click="refreshList">刷新</el-button>
        </div>
        <el-table ref="areaTableRef"
                  :data="areaList"
                  border
                  style="width: 201px;"
                  highlight-current-row
                  current-row-key="id"
                  v-loading="loading">
            <el-table-column label="名称" width="100">
                <template slot-scope="{row, index}">
                    <div class="text-td" @click="updateSelectedRow(row)">
                        <div class="main-title" :title="row.name">
                            {{row.name}}
                        </div>
                        <div class="sub-title" :title="row.principalName">
                            经理：{{row.principalName}}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="{row, index}">
                    <el-button @click="editArea(row.id)" type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增、编辑区域信息 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" :before-close="closeDialog">
            <el-form ref="areaFormRef" :model="areaForm" :rules="areaFormRules" label-width="90px">
                <el-form-item label="区域名称" prop="name">
                    <el-input v-model="areaForm.name"/>
                </el-form-item>
                <el-form-item label="负责人">
                    <el-select v-model="areaForm.principalId" filterable style="width:100%;">
                        <el-option v-for="(emp,index) in empList" :key="index" :value="emp.id" :label="emp.name"/>
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
            empList: [{id: 1, name: '员工1'}, {id: 2, name: '员工2'}]

        }
    },
    created() {
        this.refreshList();
    },
    methods: {
        updateSelectedRow(area) {
            if (this.currentAreaId === area.id) return;
            this.currentAreaId = area.id;
            this.$emit('choose-area', area);
        },
        addArea() {
            this.areaForm = {
                id: null,
                name: '',
                principalId: null
            };
            this.$refs.areaFormRef.clearValidate();
            this.dialogVisible = true;
        },
        editArea(area) {
            this.areaForm = {
                ...area
            };
            this.$refs.areaFormRef.clearValidate();
            this.dialogVisible = true;
        },
        saveArea() {
            this.dialogVisible = false;
        },
        refreshList() {
            setTimeout(_ => {
                this.areaList = [
                    {id: 1, name: '区域一', principalId: 1, principalName: '张三'},
                    {id: 2, name: '区域二', principalId: 2, principalName: '李四'},
                ];
                if (this.areaList.length === 0) {
                    this.$refs.areaTableRef.setCurrentRow();
                } else {
                    this.$refs.areaTableRef.setCurrentRow(this.areaList[0]);
                    this.updateSelectedRow(this.areaList[0]);
                }
            }, 5000);
        },
        closeDialog(done) {
            this.areaForm = {
                id: null,
                name: '',
                principalId: null
            };
            this.$refs.areaFormRef.clearValidate();
            done();
        }
    }
}
</script>

<style scoped>

</style>
