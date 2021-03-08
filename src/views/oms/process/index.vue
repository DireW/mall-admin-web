<template>
    <div class="process-list">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button type="primary" class="btn-add" @click="fetchFromServer()" style="margin-left: 20px">刷新列表</el-button>
            <el-button class="btn-add" @click="addProcess()" style="margin-left: 20px">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="processTableRef"
                      :data="processList"
                      style="width: 100%;"
                      v-loading="isLoading" border>
                <el-table-column label="排序" prop="sortNumber" width="80" align="center">
                </el-table-column>
                <el-table-column label="名称" prop="name" width="110" align="center">
                </el-table-column>
                <el-table-column label="流程内容" align="center">
                    <template slot-scope="scope">{{scope.row.contentJson}}</template>
                </el-table-column>
                <el-table-column label="更新时间" width="140" align="center">
                    <template slot-scope="scope">{{scope.row.updatedTime | formatDate}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   type="text"
                                   :disabled="scope.$index === 0"
                                   @click="sortProcess(scope.$index, 'up')">
                            向上
                        </el-button>
                        <el-button size="mini"
                                   type="text"
                                   :disabled="scope.$index === processList.length - 1"
                                   @click="sortProcess(scope.$index, 'down')">
                            向下
                        </el-button>
                        <el-button size="mini"
                                   type="text"
                                   @click="editProcess(scope.row)">
                            编辑
                        </el-button>
                        <el-button size="mini"
                                   type="text"
                                   @click="deleteProcess(scope.row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog
            :title="isEdit ? '编辑流程' : '添加流程'"
            :visible.sync="processFormDialogVisible"
            :close-on-click-modal="false"
            width="640px">
            <el-form ref="processFormRef"
                     :model="processForm"
                     :rules="processFormRules"
                     label-width="150px" size="small">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="processForm.name" style="width: 420px"></el-input>
                </el-form-item>
                <el-form-item label="流程内容：">
                    <el-input v-model="processForm.contentJson" type="textarea" style="width: 420px" :rows="8"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="processFormDialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="saveProcess()" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "index",
    data() {
        return {
            isEdit: false,
            isLoading: false,
            processList: [],
            processForm: {
                id: null,
                name: '',
                contentJson: ''
            },
            processFormRules: {
                name: [{required: true, message: '请填写流程名称', trigger: 'blur'}]
            },
            processFormDialogVisible: false,
        }
    },
    created() {
        this.fetchFromServer();
    },
    methods: {
        addProcess() {
            this.isEdit = false;
            this.processForm = {
                id: null,
                name: '',
                contentJson: ''
            };
            this.$refs.processFormRef && this.$refs.processFormRef.clearValidate();
            this.processFormDialogVisible = true;
        },
        editProcess(row) {
            this.isEdit = true;
            this.processForm = {
                ...row
            };
            this.$refs.processFormRef && this.$refs.processFormRef.clearValidate();
            this.processFormDialogVisible = true;
        },
        sortProcess(idx, direction) {
            let upperRow;
            let lowerRow;
            if (direction === 'up') {
                upperRow = this.processList[idx - 1];
                lowerRow = this.processList[idx];
            } else if (direction === 'down') {
                upperRow = this.processList[idx];
                lowerRow = this.processList[idx + 1];
            }
            const minNumber = upperRow.sortNumber;
            upperRow.sortNumber = lowerRow.sortNumber;
            lowerRow.sortNumber = minNumber;
            this.$axios.post('/oms/process/update-sort', [upperRow, lowerRow])
                .then(res => {
                    this.fetchFromServer();
                })
                .catch(_ => {})
        },
        deleteProcess(id) {
            this.$confirm('是否要进行删除操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                this.$axios.delete(`/oms/process/delete/${id}`)
                    .then(res => {
                        this.fetchFromServer();
                    })
                    .catch(err => {
                        console.error('删除流程失败', err);
                    })
            }).catch(_ => {});
        },
        saveProcess() {
            console.info('save');
            this.$refs.processFormRef.validate(valid => {
                if (!valid) {
                    return;
                }
                if (this.isEdit) {
                    this.$axios.post('/oms/process/update', this.processForm)
                        .then(res => {
                            this.fetchFromServer();
                            this.$refs.processFormRef && this.$refs.processFormRef.clearValidate();
                            this.processFormDialogVisible = true;
                        })
                        .catch(err => {
                            console.error('保存流程失败', err);
                        })
                } else {
                    this.$axios.post('/oms/process/save', this.processForm)
                        .then(res => {
                            this.fetchFromServer();
                            this.$refs.processFormRef && this.$refs.processFormRef.clearValidate();
                            this.processFormDialogVisible = true;
                        })
                        .catch(err => {
                            console.error('新增流程失败', err);
                        })
                }
            })
        },
        fetchFromServer() {
            this.isLoading = true;
            this.$axios.get('/oms/process/all')
                .then(res => {
                    this.isLoading = false;
                    this.processList = res.data;
                })
                .catch(err => {
                    this.isLoading = false;
                })
        }
    }
}
</script>

<style lang="scss" scoped>
    .process-list {
        padding: 20px;
    }
</style>
