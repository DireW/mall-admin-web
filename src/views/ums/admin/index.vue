<template> 
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button
                    style="float:right"
                    type="primary"
                    @click="handleSearchList()"
                >
                    查询搜索
                </el-button>
                <el-button
                    style="float:right;margin-right: 15px"
                    @click="handleResetSearch()"
                >
                    重置
                </el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
                    <el-form-item label="员工名字：">
                        <el-input v-model="listQuery.realName" class="input-width" placeholder="姓名"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="门店：">
                        <el-select v-model="listQuery.departmentId">
                            <el-option
                                v-for="dept in deptList"
                                :key="dept.id"
                                :value="dept.id"
                                :label="dept.name"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable"
                      :data="list"
                      style="width: 100%;"
                      v-loading="listLoading" border>
                <el-table-column label="编号" width="60" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="帐号" width="110" align="center">
                    <template slot-scope="scope">{{scope.row.username}}</template>
                </el-table-column>
                <el-table-column label="姓名" align="center">
                    <template slot-scope="scope">{{scope.row.realName}}</template>
                </el-table-column>
                <el-table-column label="所属门店" prop="departmentName" align="center" width="120"/>
                <el-table-column label="所属区域" prop="areaName" align="center" width="120"/>
                <el-table-column label="手机号码" prop="phoneNumber" align="center" width="120"/>
                <el-table-column label="身份证号" width="170" align="center">
                    <template slot-scope="scope">{{scope.row.idCard}}</template>
                </el-table-column>
                <el-table-column label="微信昵称" width="160" align="center">
                    <template slot-scope="{row}">
                        {{row.wechatUser ? base64decode(row.wechatUser.nickName) : '未绑定'}}
                    </template>
                </el-table-column>
                <el-table-column label="微信头像" width="80" align="center">
                    <template slot-scope="{row}">
                        <div class="td-cell-with-img">
                            <img v-if="!!row.wechatUser" class="table-td-img" :src="row.wechatUser.avatarUrl"/>
                            <div v-else class="table-td-img-text">
                                {{row.realName | lastTwoChars}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="是否启用" width="140" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            @change="handleStatusChange(scope.$index, scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                            v-model="scope.row.status">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   type="text"
                                   @click="handleSelectRole(scope.$index, scope.row)">分配角色
                        </el-button>
                        <el-button size="mini"
                                   type="text"
                                   @click="handleUpdate(scope.$index, scope.row)">
                            编辑
                        </el-button>
                        <el-button size="mini"
                                   type="text"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes,prev, pager, next,jumper"
                :current-page.sync="listQuery.pageNum"
                :page-size="listQuery.pageSize"
                :page-sizes="[10,15,20]"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog
            :title="isEdit?'编辑用户':'添加用户'"
            :visible.sync="dialogVisible"
            width="40%">
            <el-form :model="admin"
                     :rules="adminFormRules"
                     ref="adminForm"
                     label-width="150px" size="small">
                <el-form-item label="帐号：" prop="username">
                    <el-input v-model="admin.username" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="密码：" :prop="isEdit?'':'password'">
                    <el-input v-model="admin.password" type="password" style="width: 250px" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="realName">
                    <el-input v-model="admin.realName" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" prop="phoneNumber">
                    <el-input v-model="admin.phoneNumber" :maxlength="11" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="身份证号：">
                    <el-input v-model="admin.idCard" :maxlength="18" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="性别：">
                    <el-select v-model="admin.gender">
                        <el-option :value="0" label="未知"/>
                        <el-option :value="1" label="男"/>
                        <el-option :value="2" label="女"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属门店：">
                    <el-select v-model="admin.departmentId">
                        <el-option v-for="dept in deptList" :key="dept.id" :value="dept.id" :label="dept.name"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input v-model="admin.email" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="admin.note"
                              type="textarea"
                              :rows="5"
                              style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-radio-group v-model="admin.status">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
            </span>
            </el-dialog>
            <el-dialog
                title="分配角色"
                :visible.sync="allocDialogVisible"
                width="30%">
                    <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
                        <el-option
                            v-for="item in allRoleList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id" />
                    </el-select>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="allocDialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleAllocDialogConfirm()" size="small">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>
<script>
import {fetchList, createAdmin, updateAdmin, updateStatus, deleteAdmin, getRoleByAdmin, allocRole} from '@/api/login';
import {fetchAllRoleList} from '@/api/role';
import {formatDate} from '@/utils/date';
import {base64decode} from "@/utils/base64";

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    departmentId: null,
    realName: ''
};
const defaultAdmin = {
    id: null,
    username: null,
    password: null,
    realName: null,
    phoneNumber: null,
    idCard: null,
    gender: 1,
    email: null,
    note: null,
    status: 1
};
export default {
    name: 'adminList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            deptList: [],
            list: null,
            total: null,
            listLoading: false,
            dialogVisible: false,
            admin: Object.assign({}, defaultAdmin),
            adminFormRules: {
                username: [{required: true, message: '请填写用户名', trigger: 'blur'}],
                password: [{required: true, message: '请填写密码', trigger: 'blur'}],
                realName: [{required: true, message: '请填写员工姓名', trigger: 'blur'}],
                phoneNumber: [{required: true, message: '请填写手机号码', trigger: 'blur'}],
            },
            isEdit: false,
            allocDialogVisible: false,
            allocRoleIds: [],
            allRoleList: [],
            allocAdminId: null
        }
    },
    created() {
        this.getList();
        this.getAllRoleList();
        this.getDepartmentList();
    },
    filters: {
        formatDateTime(time) {
            if (time == null || time === '') {
                return '-';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        }
    },
    methods: {
        base64decode(value) {
            return base64decode(value);
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        handleAdd() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.admin = Object.assign({}, defaultAdmin);
        },
        handleStatusChange(index, row) {
            this.$confirm('是否要修改该状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateStatus(row.id, {status: row.status}).then(response => {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消修改'
                });
                this.getList();
            });
        },
        handleDelete(index, row) {
            this.$confirm('是否要删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteAdmin(row.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.admin = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('确认提交?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    updateAdmin(this.admin.id, this.admin).then(response => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    })
                } else {
                    createAdmin(this.admin).then(response => {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    })
                }
            })
        },
        handleAllocDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                params.append("adminId", this.allocAdminId);
                params.append("roleIds", this.allocRoleIds);
                allocRole(params).then(response => {
                    this.$message({
                        message: '分配成功！',
                        type: 'success'
                    });
                    this.allocDialogVisible = false;
                })
            })
        },
        handleSelectRole(index, row) {
            this.allocAdminId = row.id;
            this.allocDialogVisible = true;
            this.getRoleListByAdmin(row.id);
        },
        getList() {
            this.listLoading = true;
            const {pageNum, pageSize} = this.listQuery;
            this.$axios.post(`/admin/page/${pageNum}/${pageSize}`, this.listQuery)
                .then(res => {
                    this.listLoading = false;
                    this.list = res.data.list;
                    this.total = res.data.total;
                })
                .catch(err => {
                    this.listLoading = false;
                });
        },
        getAllRoleList() {
            fetchAllRoleList().then(response => {
                this.allRoleList = response.data;
            });
        },
        getRoleListByAdmin(adminId) {
            getRoleByAdmin(adminId).then(response => {
                let allocRoleList = response.data;
                this.allocRoleIds = [];
                if (allocRoleList != null && allocRoleList.length > 0) {
                    for (let i = 0; i < allocRoleList.length; i++) {
                        this.allocRoleIds.push(allocRoleList[i].id);
                    }
                }
            });
        },
        getDepartmentList() {
            this.$axios.post('/admin/ums/agency/department/list', {})
                .then(res => {
                    this.deptList = res.data;
                })
                .catch(err => {

                })
        }
    }
}
</script>
<style></style>


