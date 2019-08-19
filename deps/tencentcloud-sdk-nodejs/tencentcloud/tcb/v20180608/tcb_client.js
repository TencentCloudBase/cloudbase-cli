/*
 * Copyright (c) 2018 THL A29 Limited, a Tencent company. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const models = require("./models");
const AbstractClient = require('../../common/abstract_client')
const CreateLoginConfigResponse = models.CreateLoginConfigResponse;
const FunctionLimit = models.FunctionLimit;
const CheckTcbServiceResponse = models.CheckTcbServiceResponse;
const FileDownloadReqInfo = models.FileDownloadReqInfo;
const DescribeInvoiceAmountResponse = models.DescribeInvoiceAmountResponse;
const DealInfo = models.DealInfo;
const DatabaseMigrateQueryInfoResponse = models.DatabaseMigrateQueryInfoResponse;
const FileDeleteInfo = models.FileDeleteInfo;
const DescribeUnbindInfoResponse = models.DescribeUnbindInfoResponse;
const PackageInfo = models.PackageInfo;
const DescribeStorageACLRequest = models.DescribeStorageACLRequest;
const DescribeVouchersInfoResponse = models.DescribeVouchersInfoResponse;
const DescribeLoginConfigsRequest = models.DescribeLoginConfigsRequest;
const ModifyMonitorConditionRequest = models.ModifyMonitorConditionRequest;
const DescribeNextExpireTimeRequest = models.DescribeNextExpireTimeRequest;
const BindingPolicyObjectRequest = models.BindingPolicyObjectRequest;
const CreateLoginConfigRequest = models.CreateLoginConfigRequest;
const QueryDealsRequest = models.QueryDealsRequest;
const ApplyVoucherRequest = models.ApplyVoucherRequest;
const InvoicePostInfo = models.InvoicePostInfo;
const DatabaseLimit = models.DatabaseLimit;
const CreateMonitorPolicyRequest = models.CreateMonitorPolicyRequest;
const AlarmPolicyInfo = models.AlarmPolicyInfo;
const CreateInvoiceResponse = models.CreateInvoiceResponse;
const ResourceRecoverResponse = models.ResourceRecoverResponse;
const CheckEnvPackageModifyResponse = models.CheckEnvPackageModifyResponse;
const CreateInvoicePostInfoRequest = models.CreateInvoicePostInfoRequest;
const DescribeInvoicePostInfoRequest = models.DescribeInvoicePostInfoRequest;
const Volucher = models.Volucher;
const InvoiceAmountOverlimit = models.InvoiceAmountOverlimit;
const DescribeStorageRecoverJobRequest = models.DescribeStorageRecoverJobRequest;
const DescribeAccountInfoRequest = models.DescribeAccountInfoRequest;
const DescribeResourceLimitResponse = models.DescribeResourceLimitResponse;
const ApplyVoucherResponse = models.ApplyVoucherResponse;
const LogServiceInfo = models.LogServiceInfo;
const InvoiceVATGeneral = models.InvoiceVATGeneral;
const GetDownloadUrlsResponse = models.GetDownloadUrlsResponse;
const CreateMonitorConditionResponse = models.CreateMonitorConditionResponse;
const DescribeCurveDataResponse = models.DescribeCurveDataResponse;
const InvoiceBasicInfo = models.InvoiceBasicInfo;
const CheckEnvPackageModifyRequest = models.CheckEnvPackageModifyRequest;
const DescribeAuthDomainsResponse = models.DescribeAuthDomainsResponse;
const CreateCustomLoginKeysRequest = models.CreateCustomLoginKeysRequest;
const GetDownloadUrlsRequest = models.GetDownloadUrlsRequest;
const InvokeAIResponse = models.InvokeAIResponse;
const QuotaOverlimit = models.QuotaOverlimit;
const CreateCloudUserResponse = models.CreateCloudUserResponse;
const UnBindingPolicyObjectRequest = models.UnBindingPolicyObjectRequest;
const DescribeEnvsForWxRequest = models.DescribeEnvsForWxRequest;
const DescribeLoginConfigsResponse = models.DescribeLoginConfigsResponse;
const GetMonitorDataRequest = models.GetMonitorDataRequest;
const DescribeDbDistributionResponse = models.DescribeDbDistributionResponse;
const ModifyDatabaseACLRequest = models.ModifyDatabaseACLRequest;
const ModifySafeRuleRequest = models.ModifySafeRuleRequest;
const EndUserInfo = models.EndUserInfo;
const ResourcesInfo = models.ResourcesInfo;
const InitTcbResponse = models.InitTcbResponse;
const AlarmCondition = models.AlarmCondition;
const ModifyStorageACLRequest = models.ModifyStorageACLRequest;
const DeleteInvoicePostInfoResponse = models.DeleteInvoicePostInfoResponse;
const DescribeMonitorPolicyResponse = models.DescribeMonitorPolicyResponse;
const DescribeSafeRuleRequest = models.DescribeSafeRuleRequest;
const DescribeQuotaDataResponse = models.DescribeQuotaDataResponse;
const  MonitorConditionInfo = models. MonitorConditionInfo;
const DescribeVouchersInfoRequest = models.DescribeVouchersInfoRequest;
const InvokeFunctionResponse = models.InvokeFunctionResponse;
const CreateDocumentResponse = models.CreateDocumentResponse;
const AddLoginMannerRequest = models.AddLoginMannerRequest;
const DescribeResourceRecoverJobRequest = models.DescribeResourceRecoverJobRequest;
const CreateEnvResponse = models.CreateEnvResponse;
const DatabaseMigrateExportResponse = models.DatabaseMigrateExportResponse;
const StorageException = models.StorageException;
const SetInvoiceSubjectResponse = models.SetInvoiceSubjectResponse;
const DescribeMonitorResourceResponse = models.DescribeMonitorResourceResponse;
const DescribeEnvAccountCircleRequest = models.DescribeEnvAccountCircleRequest;
const CreateDealRequest = models.CreateDealRequest;
const DescribeStorageRecoverJobResponse = models.DescribeStorageRecoverJobResponse;
const CreateCustomLoginKeysResponse = models.CreateCustomLoginKeysResponse;
const DeleteMonitorPolicyResponse = models.DeleteMonitorPolicyResponse;
const DeleteMonitorConditionRequest = models.DeleteMonitorConditionRequest;
const CreateAuthDomainResponse = models.CreateAuthDomainResponse;
const QueryDealsResponse = models.QueryDealsResponse;
const DescribeEnvsRequest = models.DescribeEnvsRequest;
const CreateStorageRecoverJobRequest = models.CreateStorageRecoverJobRequest;
const CreateCollectionRequest = models.CreateCollectionRequest;
const DatabaseMigrateImportResponse = models.DatabaseMigrateImportResponse;
const DeleteMonitorConditionResponse = models.DeleteMonitorConditionResponse;
const DescribeStatDataResponse = models.DescribeStatDataResponse;
const GetPolicyGroupInfoRequest = models.GetPolicyGroupInfoRequest;
const DeleteDocumentResponse = models.DeleteDocumentResponse;
const RecoverJobStatus = models.RecoverJobStatus;
const MonitorPolicyInfo = models.MonitorPolicyInfo;
const CreateCollectionResponse = models.CreateCollectionResponse;
const DescribeEnvResourceExceptionResponse = models.DescribeEnvResourceExceptionResponse;
const DescribeWXMessageTokenResponse = models.DescribeWXMessageTokenResponse;
const ModifyMonitorPolicyRequest = models.ModifyMonitorPolicyRequest;
const DescribeDocumentResponse = models.DescribeDocumentResponse;
const DescribeUsersResponse = models.DescribeUsersResponse;
const ModifyInvoicePostInfoResponse = models.ModifyInvoicePostInfoResponse;
const VoucherUseHistory = models.VoucherUseHistory;
const UserInfo = models.UserInfo;
const DescribeBillingInfoRequest = models.DescribeBillingInfoRequest;
const UserGetInfoRequest = models.UserGetInfoRequest;
const DescribeEnvResourceExceptionRequest = models.DescribeEnvResourceExceptionRequest;
const ModifyDatabaseACLResponse = models.ModifyDatabaseACLResponse;
const CreateStorageRecoverJobResponse = models.CreateStorageRecoverJobResponse;
const ModifyDocumentRequest = models.ModifyDocumentRequest;
const InqueryPriceResponse = models.InqueryPriceResponse;
const DescribeUsersRequest = models.DescribeUsersRequest;
const DescribeVouchersUseHistoryResponse = models.DescribeVouchersUseHistoryResponse;
const DeleteAuthDomainResponse = models.DeleteAuthDomainResponse;
const GetMonitorDataResponse = models.GetMonitorDataResponse;
const DeleteDealResponse = models.DeleteDealResponse;
const RevokeInvoiceResponse = models.RevokeInvoiceResponse;
const EnvInfo = models.EnvInfo;
const FileDownloadRespInfo = models.FileDownloadRespInfo;
const DescribeAuthentificationRequest = models.DescribeAuthentificationRequest;
const DescribeAuthentificationResponse = models.DescribeAuthentificationResponse;
const DeleteFilesRequest = models.DeleteFilesRequest;
const EnvBillingInfoItem = models.EnvBillingInfoItem;
const DescribeEnvsResponse = models.DescribeEnvsResponse;
const CancelDealResponse = models.CancelDealResponse;
const DescribeDocumentRequest = models.DescribeDocumentRequest;
const CreateAuthDomainRequest = models.CreateAuthDomainRequest;
const DescribeMonitorResourceRequest = models.DescribeMonitorResourceRequest;
const DescribeVouchersInfoByDealResponse = models.DescribeVouchersInfoByDealResponse;
const RecoverResult = models.RecoverResult;
const UpdateLoginConfigRequest = models.UpdateLoginConfigRequest;
const ModifyStorageACLResponse = models.ModifyStorageACLResponse;
const CreateEnvAndResourceRequest = models.CreateEnvAndResourceRequest;
const DescribeAccountInfoResponse = models.DescribeAccountInfoResponse;
const DatabaseMigrateExportRequest = models.DatabaseMigrateExportRequest;
const CheckEnvIdResponse = models.CheckEnvIdResponse;
const DescribeInvoiceDetailRequest = models.DescribeInvoiceDetailRequest;
const CreateDocumentRequest = models.CreateDocumentRequest;
const DescribeMonitorDataRequest = models.DescribeMonitorDataRequest;
const DescribeEndUsersRequest = models.DescribeEndUsersRequest;
const DescribeInvoiceAmountRequest = models.DescribeInvoiceAmountRequest;
const ModifyMonitorConditionResponse = models.ModifyMonitorConditionResponse;
const DescribeInvoiceListResponse = models.DescribeInvoiceListResponse;
const DescribeSafeRuleResponse = models.DescribeSafeRuleResponse;
const DescribeDowngradeInfoResponse = models.DescribeDowngradeInfoResponse;
const CancelDealRequest = models.CancelDealRequest;
const DescribeMonitorDataResponse = models.DescribeMonitorDataResponse;
const StorageLimit = models.StorageLimit;
const DescribeInvoiceDetailResponse = models.DescribeInvoiceDetailResponse;
const CreateMonitorPolicyResponse = models.CreateMonitorPolicyResponse;
const DescribeEnvAccountCircleResponse = models.DescribeEnvAccountCircleResponse;
const ModifyDocumentResponse = models.ModifyDocumentResponse;
const ModifyInvoicePostInfoRequest = models.ModifyInvoicePostInfoRequest;
const CreateCloudUserRequest = models.CreateCloudUserRequest;
const GetUploadFileUrlResponse = models.GetUploadFileUrlResponse;
const DescribeDowngradeInfoRequest = models.DescribeDowngradeInfoRequest;
const CreateInvoiceRequest = models.CreateInvoiceRequest;
const DescribeInvoiceListRequest = models.DescribeInvoiceListRequest;
const DescribeStorageACLResponse = models.DescribeStorageACLResponse;
const DatabasesInfo = models.DatabasesInfo;
const DescribeEnvsForWxResponse = models.DescribeEnvsForWxResponse;
const DeleteFilesResponse = models.DeleteFilesResponse;
const UnBindingPolicyObjectResponse = models.UnBindingPolicyObjectResponse;
const DescribeDatabaseACLRequest = models.DescribeDatabaseACLRequest;
const InvoiceVATSpecial = models.InvoiceVATSpecial;
const CheckEnvIdRequest = models.CheckEnvIdRequest;
const InvokeAIRequest = models.InvokeAIRequest;
const AddLoginMannerResponse = models.AddLoginMannerResponse;
const FunctionInfo = models.FunctionInfo;
const DescribeStatDataRequest = models.DescribeStatDataRequest;
const DescribeDatabaseACLResponse = models.DescribeDatabaseACLResponse;
const DescribeMonitorConditionRequest = models.DescribeMonitorConditionRequest;
const DescribeVouchersUseHistoryRequest = models.DescribeVouchersUseHistoryRequest;
const DescribeAmountAfterDeductionRequest = models.DescribeAmountAfterDeductionRequest;
const LoginConfigItem = models.LoginConfigItem;
const DescribeInvoiceSubjectRequest = models.DescribeInvoiceSubjectRequest;
const DescribeInvoiceSubjectResponse = models.DescribeInvoiceSubjectResponse;
const GetUploadFileUrlRequest = models.GetUploadFileUrlRequest;
const DescribeStorageACLTaskRequest = models.DescribeStorageACLTaskRequest;
const DescribeCurveDataRequest = models.DescribeCurveDataRequest;
const GetPolicyGroupInfoResponse = models.GetPolicyGroupInfoResponse;
const InvokeFunctionRequest = models.InvokeFunctionRequest;
const DescribeUnbindInfoRequest = models.DescribeUnbindInfoRequest;
const ModifyEnvResponse = models.ModifyEnvResponse;
const DeleteInvoicePostInfoRequest = models.DeleteInvoicePostInfoRequest;
const DescribeQuotaDataRequest = models.DescribeQuotaDataRequest;
const DescribeMonitorPolicyRequest = models.DescribeMonitorPolicyRequest;
const DescribeDbDistributionRequest = models.DescribeDbDistributionRequest;
const StorageInfo = models.StorageInfo;
const InitTcbRequest = models.InitTcbRequest;
const ModifySafeRuleResponse = models.ModifySafeRuleResponse;
const GetPolicyGroupListRequest = models.GetPolicyGroupListRequest;
const DescribeAmountAfterDeductionResponse = models.DescribeAmountAfterDeductionResponse;
const CommParam = models.CommParam;
const DeleteMonitorPolicyRequest = models.DeleteMonitorPolicyRequest;
const DataPoints = models.DataPoints;
const DeleteDocumentRequest = models.DeleteDocumentRequest;
const RevokeInvoiceRequest = models.RevokeInvoiceRequest;
const CreateInvoicePostInfoResponse = models.CreateInvoicePostInfoResponse;
const AuthDomain = models.AuthDomain;
const DescribeVouchersInfoByDealRequest = models.DescribeVouchersInfoByDealRequest;
const DescribePayInfoRequest = models.DescribePayInfoRequest;
const AddPolicyGroupRequest = models.AddPolicyGroupRequest;
const DescribeEndUsersResponse = models.DescribeEndUsersResponse;
const ModifyMonitorPolicyResponse = models.ModifyMonitorPolicyResponse;
const DeleteAuthDomainRequest = models.DeleteAuthDomainRequest;
const DescribeWXMessageTokenRequest = models.DescribeWXMessageTokenRequest;
const DescribeResourceRecoverJobResponse = models.DescribeResourceRecoverJobResponse;
const CreateEnvAndResourceForWxResponse = models.CreateEnvAndResourceForWxResponse;
const ResourceRecoverRequest = models.ResourceRecoverRequest;
const DescribePayInfoResponse = models.DescribePayInfoResponse;
const CallWxApiResponse = models.CallWxApiResponse;
const CheckTcbServiceRequest = models.CheckTcbServiceRequest;
const AddPolicyGroupResponse = models.AddPolicyGroupResponse;
const CreateEnvRequest = models.CreateEnvRequest;
const CreateDealResponse = models.CreateDealResponse;
const DatabaseMigrateQueryInfoRequest = models.DatabaseMigrateQueryInfoRequest;
const DescribeAuthDomainsRequest = models.DescribeAuthDomainsRequest;
const InqueryPriceRequest = models.InqueryPriceRequest;
const DatabaseMigrateImportRequest = models.DatabaseMigrateImportRequest;
const CreateEnvAndResourceResponse = models.CreateEnvAndResourceResponse;
const MonitorResource = models.MonitorResource;
const DescribeStorageACLTaskResponse = models.DescribeStorageACLTaskResponse;
const UpdateLoginConfigResponse = models.UpdateLoginConfigResponse;
const SetInvoiceSubjectRequest = models.SetInvoiceSubjectRequest;
const CreateMonitorConditionRequest = models.CreateMonitorConditionRequest;
const DescribeResourceLimitRequest = models.DescribeResourceLimitRequest;
const DescribePackagesRequest = models.DescribePackagesRequest;
const UserGetInfoResponse = models.UserGetInfoResponse;
const DescribeMonitorConditionResponse = models.DescribeMonitorConditionResponse;
const CollectionDispension = models.CollectionDispension;
const DescribeNextExpireTimeResponse = models.DescribeNextExpireTimeResponse;
const DescribeStorageStatusRequest = models.DescribeStorageStatusRequest;
const DescribeInvoicePostInfoResponse = models.DescribeInvoicePostInfoResponse;
const CallWxApiRequest = models.CallWxApiRequest;
const GetPolicyGroupListResponse = models.GetPolicyGroupListResponse;
const DescribePackagesResponse = models.DescribePackagesResponse;
const ModifyEnvRequest = models.ModifyEnvRequest;
const CreateEnvAndResourceForWxRequest = models.CreateEnvAndResourceForWxRequest;
const DescribeStorageStatusResponse = models.DescribeStorageStatusResponse;
const DeleteDealRequest = models.DeleteDealRequest;
const LimitInfo = models.LimitInfo;
const DescribeBillingInfoResponse = models.DescribeBillingInfoResponse;
const BindingPolicyObjectResponse = models.BindingPolicyObjectResponse;


/**
 * tcb client
 * @class
 */
class TcbClient extends AbstractClient {

    constructor(credential, region, profile) {
        super("tcb.tencentcloudapi.com", "2018-06-08", credential, region, profile);
    }
    
    /**
     * 获取文件存储的权限
     * @param {DescribeStorageACLRequest} req
     * @param {function(string, DescribeStorageACLResponse):void} cb
     * @public
     */
    DescribeStorageACL(req, cb) {
        let resp = new DescribeStorageACLResponse();
        this.request("DescribeStorageACL", req, resp, cb);
    }

    /**
     * 新购、续费、变配时提前计算订单完成后的预计到期时间
     * @param {DescribeNextExpireTimeRequest} req
     * @param {function(string, DescribeNextExpireTimeResponse):void} cb
     * @public
     */
    DescribeNextExpireTime(req, cb) {
        let resp = new DescribeNextExpireTimeResponse();
        this.request("DescribeNextExpireTime", req, resp, cb);
    }

    /**
     * 数据库导出数据
     * @param {DatabaseMigrateExportRequest} req
     * @param {function(string, DatabaseMigrateExportResponse):void} cb
     * @public
     */
    DatabaseMigrateExport(req, cb) {
        let resp = new DatabaseMigrateExportResponse();
        this.request("DatabaseMigrateExport", req, resp, cb);
    }

    /**
     * 添加登录方式，填写appid和secret
     * @param {AddLoginMannerRequest} req
     * @param {function(string, AddLoginMannerResponse):void} cb
     * @public
     */
    AddLoginManner(req, cb) {
        let resp = new AddLoginMannerResponse();
        this.request("AddLoginManner", req, resp, cb);
    }

    /**
     * 查询数据迁移进度
     * @param {DatabaseMigrateQueryInfoRequest} req
     * @param {function(string, DatabaseMigrateQueryInfoResponse):void} cb
     * @public
     */
    DatabaseMigrateQueryInfo(req, cb) {
        let resp = new DatabaseMigrateQueryInfoResponse();
        this.request("DatabaseMigrateQueryInfo", req, resp, cb);
    }

    /**
     * 绑定告警对象
     * @param {BindingPolicyObjectRequest} req
     * @param {function(string, BindingPolicyObjectResponse):void} cb
     * @public
     */
    BindingPolicyObject(req, cb) {
        let resp = new BindingPolicyObjectResponse();
        this.request("BindingPolicyObject", req, resp, cb);
    }

    /**
     * 添加文档数据
     * @param {CreateDocumentRequest} req
     * @param {function(string, CreateDocumentResponse):void} cb
     * @public
     */
    CreateDocument(req, cb) {
        let resp = new CreateDocumentResponse();
        this.request("CreateDocument", req, resp, cb);
    }

    /**
     * 删除某个告警策略
     * @param {DeleteMonitorPolicyRequest} req
     * @param {function(string, DeleteMonitorPolicyResponse):void} cb
     * @public
     */
    DeleteMonitorPolicy(req, cb) {
        let resp = new DeleteMonitorPolicyResponse();
        this.request("DeleteMonitorPolicy", req, resp, cb);
    }

    /**
     * 获取微信消息通知Token
     * @param {DescribeWXMessageTokenRequest} req
     * @param {function(string, DescribeWXMessageTokenResponse):void} cb
     * @public
     */
    DescribeWXMessageToken(req, cb) {
        let resp = new DescribeWXMessageTokenResponse();
        this.request("DescribeWXMessageToken", req, resp, cb);
    }

    /**
     * 取消发票申请
     * @param {RevokeInvoiceRequest} req
     * @param {function(string, RevokeInvoiceResponse):void} cb
     * @public
     */
    RevokeInvoice(req, cb) {
        let resp = new RevokeInvoiceResponse();
        this.request("RevokeInvoice", req, resp, cb);
    }

    /**
     * 查询订单可用代金券信息列表接口
     * @param {DescribeVouchersInfoByDealRequest} req
     * @param {function(string, DescribeVouchersInfoByDealResponse):void} cb
     * @public
     */
    DescribeVouchersInfoByDeal(req, cb) {
        let resp = new DescribeVouchersInfoByDealResponse();
        this.request("DescribeVouchersInfoByDeal", req, resp, cb);
    }

    /**
     * 更新登录方式
     * @param {UpdateLoginConfigRequest} req
     * @param {function(string, UpdateLoginConfigResponse):void} cb
     * @public
     */
    UpdateLoginConfig(req, cb) {
        let resp = new UpdateLoginConfigResponse();
        this.request("UpdateLoginConfig", req, resp, cb);
    }

    /**
     * 提供给用户查询代金券已使用历史记录的接口
     * @param {DescribeVouchersUseHistoryRequest} req
     * @param {function(string, DescribeVouchersUseHistoryResponse):void} cb
     * @public
     */
    DescribeVouchersUseHistory(req, cb) {
        let resp = new DescribeVouchersUseHistoryResponse();
        this.request("DescribeVouchersUseHistory", req, resp, cb);
    }

    /**
     * 检查是否开通Tcb服务
     * @param {CheckTcbServiceRequest} req
     * @param {function(string, CheckTcbServiceResponse):void} cb
     * @public
     */
    CheckTcbService(req, cb) {
        let resp = new CheckTcbServiceResponse();
        this.request("CheckTcbService", req, resp, cb);
    }

    /**
     * 获取上传链接
     * @param {GetUploadFileUrlRequest} req
     * @param {function(string, GetUploadFileUrlResponse):void} cb
     * @public
     */
    GetUploadFileUrl(req, cb) {
        let resp = new GetUploadFileUrlResponse();
        this.request("GetUploadFileUrl", req, resp, cb);
    }

    /**
     * 获取账户开票金额
     * @param {DescribeInvoiceAmountRequest} req
     * @param {function(string, DescribeInvoiceAmountResponse):void} cb
     * @public
     */
    DescribeInvoiceAmount(req, cb) {
        let resp = new DescribeInvoiceAmountResponse();
        this.request("DescribeInvoiceAmount", req, resp, cb);
    }

    /**
     * 下发Storage桶恢复任务
     * @param {CreateStorageRecoverJobRequest} req
     * @param {function(string, CreateStorageRecoverJobResponse):void} cb
     * @public
     */
    CreateStorageRecoverJob(req, cb) {
        let resp = new CreateStorageRecoverJobResponse();
        this.request("CreateStorageRecoverJob", req, resp, cb);
    }

    /**
     * 获取告警条件列表
     * @param {DescribeMonitorConditionRequest} req
     * @param {function(string, DescribeMonitorConditionResponse):void} cb
     * @public
     */
    DescribeMonitorCondition(req, cb) {
        let resp = new DescribeMonitorConditionResponse();
        this.request("DescribeMonitorCondition", req, resp, cb);
    }

    /**
     * 执行AI服务
     * @param {InvokeAIRequest} req
     * @param {function(string, InvokeAIResponse):void} cb
     * @public
     */
    InvokeAI(req, cb) {
        let resp = new InvokeAIResponse();
        this.request("InvokeAI", req, resp, cb);
    }

    /**
     * 根据传入Query删除文档数据
     * @param {DeleteDocumentRequest} req
     * @param {function(string, DeleteDocumentResponse):void} cb
     * @public
     */
    DeleteDocument(req, cb) {
        let resp = new DeleteDocumentResponse();
        this.request("DeleteDocument", req, resp, cb);
    }

    /**
     * 调用微信OpenApi
     * @param {CallWxApiRequest} req
     * @param {function(string, CallWxApiResponse):void} cb
     * @public
     */
    CallWxApi(req, cb) {
        let resp = new CallWxApiResponse();
        this.request("CallWxApi", req, resp, cb);
    }

    /**
     * 查询发票开票信息
     * @param {DescribeInvoiceSubjectRequest} req
     * @param {function(string, DescribeInvoiceSubjectResponse):void} cb
     * @public
     */
    DescribeInvoiceSubject(req, cb) {
        let resp = new DescribeInvoiceSubjectResponse();
        this.request("DescribeInvoiceSubject", req, resp, cb);
    }

    /**
     * 获取自定义告警资源的配置信息，如支持的关联对象和指标，以及各指标的监控周期
     * @param {DescribeMonitorResourceRequest} req
     * @param {function(string, DescribeMonitorResourceResponse):void} cb
     * @public
     */
    DescribeMonitorResource(req, cb) {
        let resp = new DescribeMonitorResourceResponse();
        this.request("DescribeMonitorResource", req, resp, cb);
    }

    /**
     * 解绑定告警对象
     * @param {UnBindingPolicyObjectRequest} req
     * @param {function(string, UnBindingPolicyObjectResponse):void} cb
     * @public
     */
    UnBindingPolicyObject(req, cb) {
        let resp = new UnBindingPolicyObjectResponse();
        this.request("UnBindingPolicyObject", req, resp, cb);
    }

    /**
     * 查询资源恢复任务进度
     * @param {DescribeResourceRecoverJobRequest} req
     * @param {function(string, DescribeResourceRecoverJobResponse):void} cb
     * @public
     */
    DescribeResourceRecoverJob(req, cb) {
        let resp = new DescribeResourceRecoverJobResponse();
        this.request("DescribeResourceRecoverJob", req, resp, cb);
    }

    /**
     * 创建自定义登录密钥
     * @param {CreateCustomLoginKeysRequest} req
     * @param {function(string, CreateCustomLoginKeysResponse):void} cb
     * @public
     */
    CreateCustomLoginKeys(req, cb) {
        let resp = new CreateCustomLoginKeysResponse();
        this.request("CreateCustomLoginKeys", req, resp, cb);
    }

    /**
     * 创建环境
     * @param {CreateEnvRequest} req
     * @param {function(string, CreateEnvResponse):void} cb
     * @public
     */
    CreateEnv(req, cb) {
        let resp = new CreateEnvResponse();
        this.request("CreateEnv", req, resp, cb);
    }

    /**
     * 创建环境并初始化资源（微信大账号专用）
     * @param {CreateEnvAndResourceForWxRequest} req
     * @param {function(string, CreateEnvAndResourceForWxResponse):void} cb
     * @public
     */
    CreateEnvAndResourceForWx(req, cb) {
        let resp = new CreateEnvAndResourceForWxResponse();
        this.request("CreateEnvAndResourceForWx", req, resp, cb);
    }

    /**
     * 增加合法域名
     * @param {CreateAuthDomainRequest} req
     * @param {function(string, CreateAuthDomainResponse):void} cb
     * @public
     */
    CreateAuthDomain(req, cb) {
        let resp = new CreateAuthDomainResponse();
        this.request("CreateAuthDomain", req, resp, cb);
    }

    /**
     *  创建环境之前，先检查环境id是否存在。
     * @param {CheckEnvIdRequest} req
     * @param {function(string, CheckEnvIdResponse):void} cb
     * @public
     */
    CheckEnvId(req, cb) {
        let resp = new CheckEnvIdResponse();
        this.request("CheckEnvId", req, resp, cb);
    }

    /**
     * 获取环境列表，含环境下的各个资源信息。尤其是各资源的唯一标识，是请求各资源的关键参数
     * @param {DescribeEnvsRequest} req
     * @param {function(string, DescribeEnvsResponse):void} cb
     * @public
     */
    DescribeEnvs(req, cb) {
        let resp = new DescribeEnvsResponse();
        this.request("DescribeEnvs", req, resp, cb);
    }

    /**
     * 获取发票开票详情
     * @param {DescribeInvoiceDetailRequest} req
     * @param {function(string, DescribeInvoiceDetailResponse):void} cb
     * @public
     */
    DescribeInvoiceDetail(req, cb) {
        let resp = new DescribeInvoiceDetailResponse();
        this.request("DescribeInvoiceDetail", req, resp, cb);
    }

    /**
     * 删除合法域名
     * @param {DeleteAuthDomainRequest} req
     * @param {function(string, DeleteAuthDomainResponse):void} cb
     * @public
     */
    DeleteAuthDomain(req, cb) {
        let resp = new DeleteAuthDomainResponse();
        this.request("DeleteAuthDomain", req, resp, cb);
    }

    /**
     * 查询环境周期统计数据
     * @param {DescribeMonitorDataRequest} req
     * @param {function(string, DescribeMonitorDataResponse):void} cb
     * @public
     */
    DescribeMonitorData(req, cb) {
        let resp = new DescribeMonitorDataResponse();
        this.request("DescribeMonitorData", req, resp, cb);
    }

    /**
     * 更新告警策略
     * @param {ModifyMonitorPolicyRequest} req
     * @param {function(string, ModifyMonitorPolicyResponse):void} cb
     * @public
     */
    ModifyMonitorPolicy(req, cb) {
        let resp = new ModifyMonitorPolicyResponse();
        this.request("ModifyMonitorPolicy", req, resp, cb);
    }

    /**
     * 获取告警策略信息
     * @param {GetPolicyGroupInfoRequest} req
     * @param {function(string, GetPolicyGroupInfoResponse):void} cb
     * @public
     */
    GetPolicyGroupInfo(req, cb) {
        let resp = new GetPolicyGroupInfoResponse();
        this.request("GetPolicyGroupInfo", req, resp, cb);
    }

    /**
     * DescribeStorageRecoverJob
     * @param {DescribeStorageRecoverJobRequest} req
     * @param {function(string, DescribeStorageRecoverJobResponse):void} cb
     * @public
     */
    DescribeStorageRecoverJob(req, cb) {
        let resp = new DescribeStorageRecoverJobResponse();
        this.request("DescribeStorageRecoverJob", req, resp, cb);
    }

    /**
     * 订单信息查询，支持批量
     * @param {QueryDealsRequest} req
     * @param {function(string, QueryDealsResponse):void} cb
     * @public
     */
    QueryDeals(req, cb) {
        let resp = new QueryDealsResponse();
        this.request("QueryDeals", req, resp, cb);
    }

    /**
     * 异常资源恢复
     * @param {ResourceRecoverRequest} req
     * @param {function(string, ResourceRecoverResponse):void} cb
     * @public
     */
    ResourceRecover(req, cb) {
        let resp = new ResourceRecoverResponse();
        this.request("ResourceRecover", req, resp, cb);
    }

    /**
     * 查询用户信息
     * @param {UserGetInfoRequest} req
     * @param {function(string, UserGetInfoResponse):void} cb
     * @public
     */
    UserGetInfo(req, cb) {
        let resp = new UserGetInfoResponse();
        this.request("UserGetInfo", req, resp, cb);
    }

    /**
     * 删除某告警策略下的条件
     * @param {DeleteMonitorConditionRequest} req
     * @param {function(string, DeleteMonitorConditionResponse):void} cb
     * @public
     */
    DeleteMonitorCondition(req, cb) {
        let resp = new DeleteMonitorConditionResponse();
        this.request("DeleteMonitorCondition", req, resp, cb);
    }

    /**
     * 提供给用户查询代金券信息列表接口
     * @param {DescribeVouchersInfoRequest} req
     * @param {function(string, DescribeVouchersInfoResponse):void} cb
     * @public
     */
    DescribeVouchersInfo(req, cb) {
        let resp = new DescribeVouchersInfoResponse();
        this.request("DescribeVouchersInfo", req, resp, cb);
    }

    /**
     * 只能删除已取消的订单
     * @param {DeleteDealRequest} req
     * @param {function(string, DeleteDealResponse):void} cb
     * @public
     */
    DeleteDeal(req, cb) {
        let resp = new DeleteDealResponse();
        this.request("DeleteDeal", req, resp, cb);
    }

    /**
     * 1检测该帐号在小程序侧是否有未结算账单
2检测该帐号在小程序侧创建的环境是否为付费环境且资源未到期
3检测云开发所属环境中数据库、存储、云函数的数据是否都被清空
     * @param {DescribeUnbindInfoRequest} req
     * @param {function(string, DescribeUnbindInfoResponse):void} cb
     * @public
     */
    DescribeUnbindInfo(req, cb) {
        let resp = new DescribeUnbindInfoResponse();
        this.request("DescribeUnbindInfo", req, resp, cb);
    }

    /**
     * 查询安全规则
     * @param {DescribeSafeRuleRequest} req
     * @param {function(string, DescribeSafeRuleResponse):void} cb
     * @public
     */
    DescribeSafeRule(req, cb) {
        let resp = new DescribeSafeRuleResponse();
        this.request("DescribeSafeRule", req, resp, cb);
    }

    /**
     * 获取tcb支付串信息，如果是0元订单，直接支付。
     * @param {DescribePayInfoRequest} req
     * @param {function(string, DescribePayInfoResponse):void} cb
     * @public
     */
    DescribePayInfo(req, cb) {
        let resp = new DescribePayInfoResponse();
        this.request("DescribePayInfo", req, resp, cb);
    }

    /**
     * 查询环境统计信息
     * @param {DescribeStatDataRequest} req
     * @param {function(string, DescribeStatDataResponse):void} cb
     * @public
     */
    DescribeStatData(req, cb) {
        let resp = new DescribeStatDataResponse();
        this.request("DescribeStatData", req, resp, cb);
    }

    /**
     * 获取告警策略组列表
     * @param {GetPolicyGroupListRequest} req
     * @param {function(string, GetPolicyGroupListResponse):void} cb
     * @public
     */
    GetPolicyGroupList(req, cb) {
        let resp = new GetPolicyGroupListResponse();
        this.request("GetPolicyGroupList", req, resp, cb);
    }

    /**
     * 根据用户传入的指标, 拉取一段时间内的监控数据。
     * @param {DescribeCurveDataRequest} req
     * @param {function(string, DescribeCurveDataResponse):void} cb
     * @public
     */
    DescribeCurveData(req, cb) {
        let resp = new DescribeCurveDataResponse();
        this.request("DescribeCurveData", req, resp, cb);
    }

    /**
     * 查询tcb套餐价格接口，包括新购询价、续费询价、变配询价
     * @param {InqueryPriceRequest} req
     * @param {function(string, InqueryPriceResponse):void} cb
     * @public
     */
    InqueryPrice(req, cb) {
        let resp = new InqueryPriceResponse();
        this.request("InqueryPrice", req, resp, cb);
    }

    /**
     * 创建登录方式
     * @param {CreateLoginConfigRequest} req
     * @param {function(string, CreateLoginConfigResponse):void} cb
     * @public
     */
    CreateLoginConfig(req, cb) {
        let resp = new CreateLoginConfigResponse();
        this.request("CreateLoginConfig", req, resp, cb);
    }

    /**
     * 查询当前COS桶状态
     * @param {DescribeStorageStatusRequest} req
     * @param {function(string, DescribeStorageStatusResponse):void} cb
     * @public
     */
    DescribeStorageStatus(req, cb) {
        let resp = new DescribeStorageStatusResponse();
        this.request("DescribeStorageStatus", req, resp, cb);
    }

    /**
     * 获取套餐列表，含详情，如果传了PackageId，则只获取指定套餐详情
     * @param {DescribePackagesRequest} req
     * @param {function(string, DescribePackagesResponse):void} cb
     * @public
     */
    DescribePackages(req, cb) {
        let resp = new DescribePackagesResponse();
        this.request("DescribePackages", req, resp, cb);
    }

    /**
     * 查询DB的数据存储分布
     * @param {DescribeDbDistributionRequest} req
     * @param {function(string, DescribeDbDistributionResponse):void} cb
     * @public
     */
    DescribeDbDistribution(req, cb) {
        let resp = new DescribeDbDistributionResponse();
        this.request("DescribeDbDistribution", req, resp, cb);
    }

    /**
     * 修改存储访问权限级别.
此接口为异步修改, 仅仅触发了一次存储访问权限的修改请求, 但是并不一定保证权限修改成功, 是否修改成功需要使用DescribeStorageACLTask接口进行查询.
     * @param {ModifyStorageACLRequest} req
     * @param {function(string, ModifyStorageACLResponse):void} cb
     * @public
     */
    ModifyStorageACL(req, cb) {
        let resp = new ModifyStorageACLResponse();
        this.request("ModifyStorageACL", req, resp, cb);
    }

    /**
     * 创建集合
     * @param {CreateCollectionRequest} req
     * @param {function(string, CreateCollectionResponse):void} cb
     * @public
     */
    CreateCollection(req, cb) {
        let resp = new CreateCollectionResponse();
        this.request("CreateCollection", req, resp, cb);
    }

    /**
     * 获取终端用户列表，支持分页和过滤
     * @param {DescribeEndUsersRequest} req
     * @param {function(string, DescribeEndUsersResponse):void} cb
     * @public
     */
    DescribeEndUsers(req, cb) {
        let resp = new DescribeEndUsersResponse();
        this.request("DescribeEndUsers", req, resp, cb);
    }

    /**
     * 设置发票开票信息
     * @param {SetInvoiceSubjectRequest} req
     * @param {function(string, SetInvoiceSubjectResponse):void} cb
     * @public
     */
    SetInvoiceSubject(req, cb) {
        let resp = new SetInvoiceSubjectResponse();
        this.request("SetInvoiceSubject", req, resp, cb);
    }

    /**
     * 批量删除文件
     * @param {DeleteFilesRequest} req
     * @param {function(string, DeleteFilesResponse):void} cb
     * @public
     */
    DeleteFiles(req, cb) {
        let resp = new DeleteFilesResponse();
        this.request("DeleteFiles", req, resp, cb);
    }

    /**
     * 设置安全规则
     * @param {ModifySafeRuleRequest} req
     * @param {function(string, ModifySafeRuleResponse):void} cb
     * @public
     */
    ModifySafeRule(req, cb) {
        let resp = new ModifySafeRuleResponse();
        this.request("ModifySafeRule", req, resp, cb);
    }

    /**
     * 创建tcb套餐订单，包括新购订单、续费订单、变配订单
     * @param {CreateDealRequest} req
     * @param {function(string, CreateDealResponse):void} cb
     * @public
     */
    CreateDeal(req, cb) {
        let resp = new CreateDealResponse();
        this.request("CreateDeal", req, resp, cb);
    }

    /**
     * 更新告警策略下的某个条件
     * @param {ModifyMonitorConditionRequest} req
     * @param {function(string, ModifyMonitorConditionResponse):void} cb
     * @public
     */
    ModifyMonitorCondition(req, cb) {
        let resp = new ModifyMonitorConditionResponse();
        this.request("ModifyMonitorCondition", req, resp, cb);
    }

    /**
     * 修改发票邮寄地址信息
     * @param {ModifyInvoicePostInfoRequest} req
     * @param {function(string, ModifyInvoicePostInfoResponse):void} cb
     * @public
     */
    ModifyInvoicePostInfo(req, cb) {
        let resp = new ModifyInvoicePostInfoResponse();
        this.request("ModifyInvoicePostInfo", req, resp, cb);
    }

    /**
     * 获取资源的限制上限
     * @param {DescribeResourceLimitRequest} req
     * @param {function(string, DescribeResourceLimitResponse):void} cb
     * @public
     */
    DescribeResourceLimit(req, cb) {
        let resp = new DescribeResourceLimitResponse();
        this.request("DescribeResourceLimit", req, resp, cb);
    }

    /**
     * 初始化tcb，在同意tcb服务条款后执行。
微信请传TempCode，UserIP、WxAppId，腾讯云控制台请传临时密钥。
     * @param {InitTcbRequest} req
     * @param {function(string, InitTcbResponse):void} cb
     * @public
     */
    InitTcb(req, cb) {
        let resp = new InitTcbResponse();
        this.request("InitTcb", req, resp, cb);
    }

    /**
     * 添加告警策略
     * @param {CreateMonitorPolicyRequest} req
     * @param {function(string, CreateMonitorPolicyResponse):void} cb
     * @public
     */
    CreateMonitorPolicy(req, cb) {
        let resp = new CreateMonitorPolicyResponse();
        this.request("CreateMonitorPolicy", req, resp, cb);
    }

    /**
     * 文件存储权限修改为异步修改，该接口可以查询当前处理进度。
     * @param {DescribeStorageACLTaskRequest} req
     * @param {function(string, DescribeStorageACLTaskResponse):void} cb
     * @public
     */
    DescribeStorageACLTask(req, cb) {
        let resp = new DescribeStorageACLTaskResponse();
        this.request("DescribeStorageACLTask", req, resp, cb);
    }

    /**
     * 在变更环境套餐前, 查看下是否允许环境变更为当前套餐, 如果不允许, 列出超限指标的使用量.
     * @param {CheckEnvPackageModifyRequest} req
     * @param {function(string, CheckEnvPackageModifyResponse):void} cb
     * @public
     */
    CheckEnvPackageModify(req, cb) {
        let resp = new CheckEnvPackageModifyResponse();
        this.request("CheckEnvPackageModify", req, resp, cb);
    }

    /**
     * 查询文档数据
     * @param {DescribeDocumentRequest} req
     * @param {function(string, DescribeDocumentResponse):void} cb
     * @public
     */
    DescribeDocument(req, cb) {
        let resp = new DescribeDocumentResponse();
        this.request("DescribeDocument", req, resp, cb);
    }

    /**
     * 查询环境下资源异常状态
     * @param {DescribeEnvResourceExceptionRequest} req
     * @param {function(string, DescribeEnvResourceExceptionResponse):void} cb
     * @public
     */
    DescribeEnvResourceException(req, cb) {
        let resp = new DescribeEnvResourceExceptionResponse();
        this.request("DescribeEnvResourceException", req, resp, cb);
    }

    /**
     * 查询用户实名认证相关信息
     * @param {DescribeAuthentificationRequest} req
     * @param {function(string, DescribeAuthentificationResponse):void} cb
     * @public
     */
    DescribeAuthentification(req, cb) {
        let resp = new DescribeAuthentificationResponse();
        this.request("DescribeAuthentification", req, resp, cb);
    }

    /**
     * 查询环境计费周期
     * @param {DescribeEnvAccountCircleRequest} req
     * @param {function(string, DescribeEnvAccountCircleResponse):void} cb
     * @public
     */
    DescribeEnvAccountCircle(req, cb) {
        let resp = new DescribeEnvAccountCircleResponse();
        this.request("DescribeEnvAccountCircle", req, resp, cb);
    }

    /**
     * 更新文档数据
     * @param {ModifyDocumentRequest} req
     * @param {function(string, ModifyDocumentResponse):void} cb
     * @public
     */
    ModifyDocument(req, cb) {
        let resp = new ModifyDocumentResponse();
        this.request("ModifyDocument", req, resp, cb);
    }

    /**
     * 执行云函数
     * @param {InvokeFunctionRequest} req
     * @param {function(string, InvokeFunctionResponse):void} cb
     * @public
     */
    InvokeFunction(req, cb) {
        let resp = new InvokeFunctionResponse();
        this.request("InvokeFunction", req, resp, cb);
    }

    /**
     * 数据库导入数据
     * @param {DatabaseMigrateImportRequest} req
     * @param {function(string, DatabaseMigrateImportResponse):void} cb
     * @public
     */
    DatabaseMigrateImport(req, cb) {
        let resp = new DatabaseMigrateImportResponse();
        this.request("DatabaseMigrateImport", req, resp, cb);
    }

    /**
     * 获取用户列表
     * @param {DescribeUsersRequest} req
     * @param {function(string, DescribeUsersResponse):void} cb
     * @public
     */
    DescribeUsers(req, cb) {
        let resp = new DescribeUsersResponse();
        this.request("DescribeUsers", req, resp, cb);
    }

    /**
     * 拉取TCB资源监控信息 
     * @param {GetMonitorDataRequest} req
     * @param {function(string, GetMonitorDataResponse):void} cb
     * @public
     */
    GetMonitorData(req, cb) {
        let resp = new GetMonitorDataResponse();
        this.request("GetMonitorData", req, resp, cb);
    }

    /**
     * 提供给用户查询代金券抵扣后实际支付金额接口
     * @param {DescribeAmountAfterDeductionRequest} req
     * @param {function(string, DescribeAmountAfterDeductionResponse):void} cb
     * @public
     */
    DescribeAmountAfterDeduction(req, cb) {
        let resp = new DescribeAmountAfterDeductionResponse();
        this.request("DescribeAmountAfterDeduction", req, resp, cb);
    }

    /**
     * 删除发票邮寄地址
     * @param {DeleteInvoicePostInfoRequest} req
     * @param {function(string, DeleteInvoicePostInfoResponse):void} cb
     * @public
     */
    DeleteInvoicePostInfo(req, cb) {
        let resp = new DeleteInvoicePostInfoResponse();
        this.request("DeleteInvoicePostInfo", req, resp, cb);
    }

    /**
     * 获取登录方式列表
     * @param {DescribeLoginConfigsRequest} req
     * @param {function(string, DescribeLoginConfigsResponse):void} cb
     * @public
     */
    DescribeLoginConfigs(req, cb) {
        let resp = new DescribeLoginConfigsResponse();
        this.request("DescribeLoginConfigs", req, resp, cb);
    }

    /**
     * 获取合法域名列表
     * @param {DescribeAuthDomainsRequest} req
     * @param {function(string, DescribeAuthDomainsResponse):void} cb
     * @public
     */
    DescribeAuthDomains(req, cb) {
        let resp = new DescribeAuthDomainsResponse();
        this.request("DescribeAuthDomains", req, resp, cb);
    }

    /**
     * 用户提交代金券申请接口
     * @param {ApplyVoucherRequest} req
     * @param {function(string, ApplyVoucherResponse):void} cb
     * @public
     */
    ApplyVoucher(req, cb) {
        let resp = new ApplyVoucherResponse();
        this.request("ApplyVoucher", req, resp, cb);
    }

    /**
     * 修改数据库权限
     * @param {ModifyDatabaseACLRequest} req
     * @param {function(string, ModifyDatabaseACLResponse):void} cb
     * @public
     */
    ModifyDatabaseACL(req, cb) {
        let resp = new ModifyDatabaseACLResponse();
        this.request("ModifyDatabaseACL", req, resp, cb);
    }

    /**
     * 获取计费相关信息
     * @param {DescribeBillingInfoRequest} req
     * @param {function(string, DescribeBillingInfoResponse):void} cb
     * @public
     */
    DescribeBillingInfo(req, cb) {
        let resp = new DescribeBillingInfoResponse();
        this.request("DescribeBillingInfo", req, resp, cb);
    }

    /**
     * 给某个告警策略增加一条告警条件
     * @param {CreateMonitorConditionRequest} req
     * @param {function(string, CreateMonitorConditionResponse):void} cb
     * @public
     */
    CreateMonitorCondition(req, cb) {
        let resp = new CreateMonitorConditionResponse();
        this.request("CreateMonitorCondition", req, resp, cb);
    }

    /**
     * 新增发票邮寄地址
     * @param {CreateInvoicePostInfoRequest} req
     * @param {function(string, CreateInvoicePostInfoResponse):void} cb
     * @public
     */
    CreateInvoicePostInfo(req, cb) {
        let resp = new CreateInvoicePostInfoResponse();
        this.request("CreateInvoicePostInfo", req, resp, cb);
    }

    /**
     * 申请开票
     * @param {CreateInvoiceRequest} req
     * @param {function(string, CreateInvoiceResponse):void} cb
     * @public
     */
    CreateInvoice(req, cb) {
        let resp = new CreateInvoiceResponse();
        this.request("CreateInvoice", req, resp, cb);
    }

    /**
     * 获取数据库权限
     * @param {DescribeDatabaseACLRequest} req
     * @param {function(string, DescribeDatabaseACLResponse):void} cb
     * @public
     */
    DescribeDatabaseACL(req, cb) {
        let resp = new DescribeDatabaseACLResponse();
        this.request("DescribeDatabaseACL", req, resp, cb);
    }

    /**
     * 注册腾讯云用户
     * @param {CreateCloudUserRequest} req
     * @param {function(string, CreateCloudUserResponse):void} cb
     * @public
     */
    CreateCloudUser(req, cb) {
        let resp = new CreateCloudUserResponse();
        this.request("CreateCloudUser", req, resp, cb);
    }

    /**
     * 只能取消未支付的订单
     * @param {CancelDealRequest} req
     * @param {function(string, CancelDealResponse):void} cb
     * @public
     */
    CancelDeal(req, cb) {
        let resp = new CancelDealResponse();
        this.request("CancelDeal", req, resp, cb);
    }

    /**
     * 查询告警策略列表
     * @param {DescribeMonitorPolicyRequest} req
     * @param {function(string, DescribeMonitorPolicyResponse):void} cb
     * @public
     */
    DescribeMonitorPolicy(req, cb) {
        let resp = new DescribeMonitorPolicyResponse();
        this.request("DescribeMonitorPolicy", req, resp, cb);
    }

    /**
     * 获取环境降配信息
     * @param {DescribeDowngradeInfoRequest} req
     * @param {function(string, DescribeDowngradeInfoResponse):void} cb
     * @public
     */
    DescribeDowngradeInfo(req, cb) {
        let resp = new DescribeDowngradeInfoResponse();
        this.request("DescribeDowngradeInfo", req, resp, cb);
    }

    /**
     * 新增告警组
     * @param {AddPolicyGroupRequest} req
     * @param {function(string, AddPolicyGroupResponse):void} cb
     * @public
     */
    AddPolicyGroup(req, cb) {
        let resp = new AddPolicyGroupResponse();
        this.request("AddPolicyGroup", req, resp, cb);
    }

    /**
     * 获取当前wxAppId对应的云账号信息，需要使用指定的账号请求，有白名单策略。
     * @param {DescribeAccountInfoRequest} req
     * @param {function(string, DescribeAccountInfoResponse):void} cb
     * @public
     */
    DescribeAccountInfo(req, cb) {
        let resp = new DescribeAccountInfoResponse();
        this.request("DescribeAccountInfo", req, resp, cb);
    }

    /**
     * 通过用户传入的指标,，查询该指标的配额使用量。
     * @param {DescribeQuotaDataRequest} req
     * @param {function(string, DescribeQuotaDataResponse):void} cb
     * @public
     */
    DescribeQuotaData(req, cb) {
        let resp = new DescribeQuotaDataResponse();
        this.request("DescribeQuotaData", req, resp, cb);
    }

    /**
     * 获取发票开票记录列表
     * @param {DescribeInvoiceListRequest} req
     * @param {function(string, DescribeInvoiceListResponse):void} cb
     * @public
     */
    DescribeInvoiceList(req, cb) {
        let resp = new DescribeInvoiceListResponse();
        this.request("DescribeInvoiceList", req, resp, cb);
    }

    /**
     * 获取环境列表，含环境下的各个资源信息。尤其是各资源的唯一标识，是请求各资源的关键参数
     * @param {DescribeEnvsForWxRequest} req
     * @param {function(string, DescribeEnvsForWxResponse):void} cb
     * @public
     */
    DescribeEnvsForWx(req, cb) {
        let resp = new DescribeEnvsForWxResponse();
        this.request("DescribeEnvsForWx", req, resp, cb);
    }

    /**
     * 批量获取文件访问链接
     * @param {GetDownloadUrlsRequest} req
     * @param {function(string, GetDownloadUrlsResponse):void} cb
     * @public
     */
    GetDownloadUrls(req, cb) {
        let resp = new GetDownloadUrlsResponse();
        this.request("GetDownloadUrls", req, resp, cb);
    }

    /**
     * 更新环境信息
     * @param {ModifyEnvRequest} req
     * @param {function(string, ModifyEnvResponse):void} cb
     * @public
     */
    ModifyEnv(req, cb) {
        let resp = new ModifyEnvResponse();
        this.request("ModifyEnv", req, resp, cb);
    }

    /**
     * 查询发票邮寄地址
     * @param {DescribeInvoicePostInfoRequest} req
     * @param {function(string, DescribeInvoicePostInfoResponse):void} cb
     * @public
     */
    DescribeInvoicePostInfo(req, cb) {
        let resp = new DescribeInvoicePostInfoResponse();
        this.request("DescribeInvoicePostInfo", req, resp, cb);
    }

    /**
     * 创建环境和资源
     * @param {CreateEnvAndResourceRequest} req
     * @param {function(string, CreateEnvAndResourceResponse):void} cb
     * @public
     */
    CreateEnvAndResource(req, cb) {
        let resp = new CreateEnvAndResourceResponse();
        this.request("CreateEnvAndResource", req, resp, cb);
    }


}
module.exports = TcbClient;
