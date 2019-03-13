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
const ListHelpDocRequest = models.ListHelpDocRequest;
const GetUserMonthUsageRequest = models.GetUserMonthUsageRequest;
const CreateFunctionTestModelRequest = models.CreateFunctionTestModelRequest;
const DescribeDeviceFunctionsRequest = models.DescribeDeviceFunctionsRequest;
const Trigger = models.Trigger;
const DescribeNamespacesResponse = models.DescribeNamespacesResponse;
const BindFunctionOnDeviceResponse = models.BindFunctionOnDeviceResponse;
const InnerModifyInvokeRoutingResponse = models.InnerModifyInvokeRoutingResponse;
const CreateSubscriptionDefinitionRequest = models.CreateSubscriptionDefinitionRequest;
const GetTempCosInfoRequest = models.GetTempCosInfoRequest;
const DescribeDevicesResponse = models.DescribeDevicesResponse;
const GetFunctionTotalNumResponse = models.GetFunctionTotalNumResponse;
const GetTempCosInfoResponse = models.GetTempCosInfoResponse;
const InnerCreateInvokeRoutingResponse = models.InnerCreateInvokeRoutingResponse;
const BindFunctionOnDeviceRequest = models.BindFunctionOnDeviceRequest;
const GetUserMonthUsageResponse = models.GetUserMonthUsageResponse;
const UsageInfo = models.UsageInfo;
const Variable = models.Variable;
const InnerCreateInvokeRoutingRequest = models.InnerCreateInvokeRoutingRequest;
const UpdateFunctionTestModelRequest = models.UpdateFunctionTestModelRequest;
const InnerDeleteInvokeRoutingResponse = models.InnerDeleteInvokeRoutingResponse;
const InnerModifyInvokeRoutingRequest = models.InnerModifyInvokeRoutingRequest;
const GetFunctionTestModelRequest = models.GetFunctionTestModelRequest;
const GetFunctionLogsRequest = models.GetFunctionLogsRequest;
const Namespaces = models.Namespaces;
const InnerStopServiceResponse = models.InnerStopServiceResponse;
const ListFunctionsForTradeRequest = models.ListFunctionsForTradeRequest;
const Tag = models.Tag;
const GetFunctionUsageTriggerCountResponse = models.GetFunctionUsageTriggerCountResponse;
const Subscription = models.Subscription;
const LogFilter = models.LogFilter;
const DeviceFunction = models.DeviceFunction;
const AccountUsage = models.AccountUsage;
const GetDemoDetailRequest = models.GetDemoDetailRequest;
const DeleteFunctionRequest = models.DeleteFunctionRequest;
const CopyFunctionResponse = models.CopyFunctionResponse;
const InnerDeleteInvokeRoutingRequest = models.InnerDeleteInvokeRoutingRequest;
const DeployFunctionAndSubscriptionDefinitionRequest = models.DeployFunctionAndSubscriptionDefinitionRequest;
const UpdateFunctionTestModelResponse = models.UpdateFunctionTestModelResponse;
const DescribeFunctionQuotaRequest = models.DescribeFunctionQuotaRequest;
const ListNamespacesRequest = models.ListNamespacesRequest;
const PublishVersionRequest = models.PublishVersionRequest;
const ListVersionByFunctionResponse = models.ListVersionByFunctionResponse;
const UpdateFunctionQuotaResponse = models.UpdateFunctionQuotaResponse;
const CreateSubscriptionDefinitionResponse = models.CreateSubscriptionDefinitionResponse;
const InnerStopServiceRequest = models.InnerStopServiceRequest;
const CreateNamespaceResponse = models.CreateNamespaceResponse;
const DeleteDeviceRequest = models.DeleteDeviceRequest;
const ListFunctionsForTradeResponse = models.ListFunctionsForTradeResponse;
const UpdateFunctionCodeRequest = models.UpdateFunctionCodeRequest;
const DeleteSubscriptionDefinitionResponse = models.DeleteSubscriptionDefinitionResponse;
const DeleteFunctionTestModelRequest = models.DeleteFunctionTestModelRequest;
const GetAccountSettingsResponse = models.GetAccountSettingsResponse;
const DeleteFunctionTestModelResponse = models.DeleteFunctionTestModelResponse;
const CreateFunctionTestModelResponse = models.CreateFunctionTestModelResponse;
const CopyFunctionRequest = models.CopyFunctionRequest;
const DeleteNamespaceResponse = models.DeleteNamespaceResponse;
const InnerRestoreServiceResponse = models.InnerRestoreServiceResponse;
const TriggerCount = models.TriggerCount;
const NamespaceLimit = models.NamespaceLimit;
const UpdateFunctionConfigurationRequest = models.UpdateFunctionConfigurationRequest;
const DeleteNamespaceRequest = models.DeleteNamespaceRequest;
const ListFunctionsRequest = models.ListFunctionsRequest;
const CreateDeviceResponse = models.CreateDeviceResponse;
const CreateDeviceRequest = models.CreateDeviceRequest;
const UpdateFunctionQuotaRequest = models.UpdateFunctionQuotaRequest;
const CreateTriggerRequest = models.CreateTriggerRequest;
const ListFunctionTestModelsResponse = models.ListFunctionTestModelsResponse;
const DeleteFunctionResponse = models.DeleteFunctionResponse;
const UpdateNamespaceResponse = models.UpdateNamespaceResponse;
const DeployFunctionAndSubscriptionDefinitionResponse = models.DeployFunctionAndSubscriptionDefinitionResponse;
const Result = models.Result;
const InvokeRouting = models.InvokeRouting;
const CreateFunctionRequest = models.CreateFunctionRequest;
const IotMq = models.IotMq;
const GetAccountRequest = models.GetAccountRequest;
const UnBindFunctionOnDeviceResponse = models.UnBindFunctionOnDeviceResponse;
const IotHub = models.IotHub;
const PublishVersionResponse = models.PublishVersionResponse;
const BatchCreateTriggerResponse = models.BatchCreateTriggerResponse;
const Environment = models.Environment;
const IotMqDeviceDel = models.IotMqDeviceDel;
const GetFunctionAddressRequest = models.GetFunctionAddressRequest;
const InvokeResponse = models.InvokeResponse;
const UnBindFunctionOnDeviceRequest = models.UnBindFunctionOnDeviceRequest;
const InvokeRequest = models.InvokeRequest;
const IotHubDeviceDel = models.IotHubDeviceDel;
const DescribeFunctionQuotaResponse = models.DescribeFunctionQuotaResponse;
const DescribeSubscriptionDefinitionRequest = models.DescribeSubscriptionDefinitionRequest;
const BatchCreateTriggerRequest = models.BatchCreateTriggerRequest;
const ListFunctionTestModelsRequest = models.ListFunctionTestModelsRequest;
const CreateTriggerResponse = models.CreateTriggerResponse;
const CreateNamespaceRequest = models.CreateNamespaceRequest;
const ListDemoRequest = models.ListDemoRequest;
const InnerModifyUserRestrictionResponse = models.InnerModifyUserRestrictionResponse;
const UpdateTriggerStatusResponse = models.UpdateTriggerStatusResponse;
const GetAccountSettingsRequest = models.GetAccountSettingsRequest;
const GetFunctionRequest = models.GetFunctionRequest;
const Filter = models.Filter;
const Device = models.Device;
const GetFunctionResponse = models.GetFunctionResponse;
const DocDetail = models.DocDetail;
const InnerRestoreServiceRequest = models.InnerRestoreServiceRequest;
const GetDemoDetailResponse = models.GetDemoDetailResponse;
const Code = models.Code;
const GetDemoAddressRequest = models.GetDemoAddressRequest;
const UpdateNamespaceRequest = models.UpdateNamespaceRequest;
const DeleteSubscriptionDefinitionRequest = models.DeleteSubscriptionDefinitionRequest;
const FunctionLog = models.FunctionLog;
const GetFunctionTestModelResponse = models.GetFunctionTestModelResponse;
const DescribeNamespacesRequest = models.DescribeNamespacesRequest;
const UpdateTriggerStatusRequest = models.UpdateTriggerStatusRequest;
const InnerListInvokeRoutingRequest = models.InnerListInvokeRoutingRequest;
const LimitsInfo = models.LimitsInfo;
const AccountLimit = models.AccountLimit;
const ListDemoResponse = models.ListDemoResponse;
const DescribeDeviceFunctionsResponse = models.DescribeDeviceFunctionsResponse;
const GetUserYesterdayUsageRequest = models.GetUserYesterdayUsageRequest;
const UpdateFunctionConfigurationResponse = models.UpdateFunctionConfigurationResponse;
const Function = models.Function;
const ListVersionByFunctionRequest = models.ListVersionByFunctionRequest;
const InnerModifyUserRestrictionRequest = models.InnerModifyUserRestrictionRequest;
const ListFunctionsResponse = models.ListFunctionsResponse;
const CreateFunctionResponse = models.CreateFunctionResponse;
const DescribeSubscriptionDefinitionResponse = models.DescribeSubscriptionDefinitionResponse;
const NamespaceUsage = models.NamespaceUsage;
const GetFunctionTotalNumRequest = models.GetFunctionTotalNumRequest;
const GetFunctionUsageTriggerCountRequest = models.GetFunctionUsageTriggerCountRequest;
const DescribeDevicesRequest = models.DescribeDevicesRequest;
const GetAccountResponse = models.GetAccountResponse;
const GetFunctionLogsResponse = models.GetFunctionLogsResponse;
const DemoInfo = models.DemoInfo;
const TradeFunction = models.TradeFunction;
const DeleteTriggerResponse = models.DeleteTriggerResponse;
const SearchKey = models.SearchKey;
const DeleteTriggerRequest = models.DeleteTriggerRequest;
const VpcConfig = models.VpcConfig;
const GetUserYesterdayUsageResponse = models.GetUserYesterdayUsageResponse;
const DeleteDeviceResponse = models.DeleteDeviceResponse;
const GetFunctionAddressResponse = models.GetFunctionAddressResponse;
const DeviceInfo = models.DeviceInfo;
const ListNamespacesResponse = models.ListNamespacesResponse;
const GetDemoAddressResponse = models.GetDemoAddressResponse;
const InnerListInvokeRoutingResponse = models.InnerListInvokeRoutingResponse;
const ListHelpDocResponse = models.ListHelpDocResponse;
const UpdateFunctionCodeResponse = models.UpdateFunctionCodeResponse;


/**
 * scf client
 * @class
 */
class ScfClient extends AbstractClient {

    constructor(credential, region, profile) {
        super("scf.tencentcloudapi.com", "2018-04-16", credential, region, profile);
    }
    
    /**
     * 该接口用于获取函数的触发总量。
     * @param {GetFunctionUsageTriggerCountRequest} req
     * @param {function(string, GetFunctionUsageTriggerCountResponse):void} cb
     * @public
     */
    GetFunctionUsageTriggerCount(req, cb) {
        let resp = new GetFunctionUsageTriggerCountResponse();
        this.request("GetFunctionUsageTriggerCount", req, resp, cb);
    }

    /**
     * 该接口根据传入参数删除函数。
     * @param {DeleteFunctionRequest} req
     * @param {function(string, DeleteFunctionResponse):void} cb
     * @public
     */
    DeleteFunction(req, cb) {
        let resp = new DeleteFunctionResponse();
        this.request("DeleteFunction", req, resp, cb);
    }

    /**
     * 通过Demo详情，包含有cos地址，入口代码
     * @param {GetDemoDetailRequest} req
     * @param {function(string, GetDemoDetailResponse):void} cb
     * @public
     */
    GetDemoDetail(req, cb) {
        let resp = new GetDemoDetailResponse();
        this.request("GetDemoDetail", req, resp, cb);
    }

    /**
     * 该接口根据传入的查询参数返回相关函数信息。
     * @param {ListFunctionsRequest} req
     * @param {function(string, ListFunctionsResponse):void} cb
     * @public
     */
    ListFunctions(req, cb) {
        let resp = new ListFunctionsResponse();
        this.request("ListFunctions", req, resp, cb);
    }

    /**
     * 该接口根据传入参数更新函数配置。
     * @param {UpdateFunctionConfigurationRequest} req
     * @param {function(string, UpdateFunctionConfigurationResponse):void} cb
     * @public
     */
    UpdateFunctionConfiguration(req, cb) {
        let resp = new UpdateFunctionConfigurationResponse();
        this.request("UpdateFunctionConfiguration", req, resp, cb);
    }

    /**
     * 该接口根据参数输入设置新的触发方式。
     * @param {CreateTriggerRequest} req
     * @param {function(string, CreateTriggerResponse):void} cb
     * @public
     */
    CreateTrigger(req, cb) {
        let resp = new CreateTriggerResponse();
        this.request("CreateTrigger", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数创建命名空间。
     * @param {CreateNamespaceRequest} req
     * @param {function(string, CreateNamespaceResponse):void} cb
     * @public
     */
    CreateNamespace(req, cb) {
        let resp = new CreateNamespaceResponse();
        this.request("CreateNamespace", req, resp, cb);
    }

    /**
     * 复制一个函数，可以选择将复制出的新函数放置在同一个namespace或另一个namespace。
注：本接口**不会**复制函数的以下对象或属性：
1. 函数的触发器
2. 除了$LATEST以外的其它版本
3. 函数配置的日志投递到的CLS目标

如有需要，您可以在复制后手动修改新函数。
     * @param {CopyFunctionRequest} req
     * @param {function(string, CopyFunctionResponse):void} cb
     * @public
     */
    CopyFunction(req, cb) {
        let resp = new CopyFunctionResponse();
        this.request("CopyFunction", req, resp, cb);
    }

    /**
     * 该接口根据参数传入删除已有的触发方式。
     * @param {DeleteTriggerRequest} req
     * @param {function(string, DeleteTriggerResponse):void} cb
     * @public
     */
    DeleteTrigger(req, cb) {
        let resp = new DeleteTriggerResponse();
        this.request("DeleteTrigger", req, resp, cb);
    }

    /**
     * 该接口用于获取用户每月的使用量。
     * @param {GetUserMonthUsageRequest} req
     * @param {function(string, GetUserMonthUsageResponse):void} cb
     * @public
     */
    GetUserMonthUsage(req, cb) {
        let resp = new GetUserMonthUsageResponse();
        this.request("GetUserMonthUsage", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数创建命名空间。
     * @param {DeleteNamespaceRequest} req
     * @param {function(string, DeleteNamespaceResponse):void} cb
     * @public
     */
    DeleteNamespace(req, cb) {
        let resp = new DeleteNamespaceResponse();
        this.request("DeleteNamespace", req, resp, cb);
    }

    /**
     * 该接口用于恢复服务。
     * @param {InnerRestoreServiceRequest} req
     * @param {function(string, InnerRestoreServiceResponse):void} cb
     * @public
     */
    InnerRestoreService(req, cb) {
        let resp = new InnerRestoreServiceResponse();
        this.request("InnerRestoreService", req, resp, cb);
    }

    /**
     * 获取TempCos信息，现阶段包括签名和日期
     * @param {GetTempCosInfoRequest} req
     * @param {function(string, GetTempCosInfoResponse):void} cb
     * @public
     */
    GetTempCosInfo(req, cb) {
        let resp = new GetTempCosInfoResponse();
        this.request("GetTempCosInfo", req, resp, cb);
    }

    /**
     * 该接口用于查询用于计费的函数列表。
     * @param {ListFunctionsForTradeRequest} req
     * @param {function(string, ListFunctionsForTradeResponse):void} cb
     * @public
     */
    ListFunctionsForTrade(req, cb) {
        let resp = new ListFunctionsForTradeResponse();
        this.request("ListFunctionsForTrade", req, resp, cb);
    }

    /**
     * 该接口用于运行函数。
     * @param {InvokeRequest} req
     * @param {function(string, InvokeResponse):void} cb
     * @public
     */
    Invoke(req, cb) {
        let resp = new InvokeResponse();
        this.request("Invoke", req, resp, cb);
    }

    /**
     * 该接口用于停止scf服务。
     * @param {InnerStopServiceRequest} req
     * @param {function(string, InnerStopServiceResponse):void} cb
     * @public
     */
    InnerStopService(req, cb) {
        let resp = new InnerStopServiceResponse();
        this.request("InnerStopService", req, resp, cb);
    }

    /**
     * 列出命名空间列表
     * @param {ListNamespacesRequest} req
     * @param {function(string, ListNamespacesResponse):void} cb
     * @public
     */
    ListNamespaces(req, cb) {
        let resp = new ListNamespacesResponse();
        this.request("ListNamespaces", req, resp, cb);
    }

    /**
     * 该接口获取某个函数的详细信息，包括名称、代码、处理方法、关联触发器和超时时间等字段。
     * @param {GetFunctionRequest} req
     * @param {function(string, GetFunctionResponse):void} cb
     * @public
     */
    GetFunction(req, cb) {
        let resp = new GetFunctionResponse();
        this.request("GetFunction", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数查询消息规则。
     * @param {DescribeSubscriptionDefinitionRequest} req
     * @param {function(string, DescribeSubscriptionDefinitionResponse):void} cb
     * @public
     */
    DescribeSubscriptionDefinition(req, cb) {
        let resp = new DescribeSubscriptionDefinitionResponse();
        this.request("DescribeSubscriptionDefinition", req, resp, cb);
    }

    /**
     * 批量创建触发器。
     * @param {BatchCreateTriggerRequest} req
     * @param {function(string, BatchCreateTriggerResponse):void} cb
     * @public
     */
    BatchCreateTrigger(req, cb) {
        let resp = new BatchCreateTriggerResponse();
        this.request("BatchCreateTrigger", req, resp, cb);
    }

    /**
     * 该接口根据传入参数更新函数代码。
     * @param {UpdateFunctionCodeRequest} req
     * @param {function(string, UpdateFunctionCodeResponse):void} cb
     * @public
     */
    UpdateFunctionCode(req, cb) {
        let resp = new UpdateFunctionCodeResponse();
        this.request("UpdateFunctionCode", req, resp, cb);
    }

    /**
     * 创建invoke后端路由, 目前仅支持L5
     * @param {InnerCreateInvokeRoutingRequest} req
     * @param {function(string, InnerCreateInvokeRoutingResponse):void} cb
     * @public
     */
    InnerCreateInvokeRouting(req, cb) {
        let resp = new InnerCreateInvokeRoutingResponse();
        this.request("InnerCreateInvokeRouting", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数删除指定设备。
     * @param {DeleteDeviceRequest} req
     * @param {function(string, DeleteDeviceResponse):void} cb
     * @public
     */
    DeleteDevice(req, cb) {
        let resp = new DeleteDeviceResponse();
        this.request("DeleteDevice", req, resp, cb);
    }

    /**
     * 该接口根据设置的日志查询条件返回函数日志。
     * @param {GetFunctionLogsRequest} req
     * @param {function(string, GetFunctionLogsResponse):void} cb
     * @public
     */
    GetFunctionLogs(req, cb) {
        let resp = new GetFunctionLogsResponse();
        this.request("GetFunctionLogs", req, resp, cb);
    }

    /**
     * 后端Invoke路由列表
     * @param {InnerListInvokeRoutingRequest} req
     * @param {function(string, InnerListInvokeRoutingResponse):void} cb
     * @public
     */
    InnerListInvokeRouting(req, cb) {
        let resp = new InnerListInvokeRoutingResponse();
        this.request("InnerListInvokeRouting", req, resp, cb);
    }

    /**
     * 该接口用于更新用户可使用容器最大或最小限制。
     * @param {UpdateFunctionQuotaRequest} req
     * @param {function(string, UpdateFunctionQuotaResponse):void} cb
     * @public
     */
    UpdateFunctionQuota(req, cb) {
        let resp = new UpdateFunctionQuotaResponse();
        this.request("UpdateFunctionQuota", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数查询函数的版本。
     * @param {ListVersionByFunctionRequest} req
     * @param {function(string, ListVersionByFunctionResponse):void} cb
     * @public
     */
    ListVersionByFunction(req, cb) {
        let resp = new ListVersionByFunctionResponse();
        this.request("ListVersionByFunction", req, resp, cb);
    }

    /**
     * 该接口用于删除测试函数模板。
     * @param {DeleteFunctionTestModelRequest} req
     * @param {function(string, DeleteFunctionTestModelResponse):void} cb
     * @public
     */
    DeleteFunctionTestModel(req, cb) {
        let resp = new DeleteFunctionTestModelResponse();
        this.request("DeleteFunctionTestModel", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数创建设备。
     * @param {CreateDeviceRequest} req
     * @param {function(string, CreateDeviceResponse):void} cb
     * @public
     */
    CreateDevice(req, cb) {
        let resp = new CreateDeviceResponse();
        this.request("CreateDevice", req, resp, cb);
    }

    /**
     * 更新触发器状态的值
     * @param {UpdateTriggerStatusRequest} req
     * @param {function(string, UpdateTriggerStatusResponse):void} cb
     * @public
     */
    UpdateTriggerStatus(req, cb) {
        let resp = new UpdateTriggerStatusResponse();
        this.request("UpdateTriggerStatus", req, resp, cb);
    }

    /**
     * 删除后端Invoke路由
     * @param {InnerDeleteInvokeRoutingRequest} req
     * @param {function(string, InnerDeleteInvokeRoutingResponse):void} cb
     * @public
     */
    InnerDeleteInvokeRouting(req, cb) {
        let resp = new InnerDeleteInvokeRoutingResponse();
        this.request("InnerDeleteInvokeRouting", req, resp, cb);
    }

    /**
     * 该接口根据传入的查询参数返回相关demo信息。
     * @param {ListDemoRequest} req
     * @param {function(string, ListDemoResponse):void} cb
     * @public
     */
    ListDemo(req, cb) {
        let resp = new ListDemoResponse();
        this.request("ListDemo", req, resp, cb);
    }

    /**
     * 该接口用于更新函数测试模板。
     * @param {UpdateFunctionTestModelRequest} req
     * @param {function(string, UpdateFunctionTestModelResponse):void} cb
     * @public
     */
    UpdateFunctionTestModel(req, cb) {
        let resp = new UpdateFunctionTestModelResponse();
        this.request("UpdateFunctionTestModel", req, resp, cb);
    }

    /**
     * 更新命名空间
     * @param {UpdateNamespaceRequest} req
     * @param {function(string, UpdateNamespaceResponse):void} cb
     * @public
     */
    UpdateNamespace(req, cb) {
        let resp = new UpdateNamespaceResponse();
        this.request("UpdateNamespace", req, resp, cb);
    }

    /**
     * 该接口用于描述用户可使用容器最大或最小限制。
     * @param {DescribeFunctionQuotaRequest} req
     * @param {function(string, DescribeFunctionQuotaResponse):void} cb
     * @public
     */
    DescribeFunctionQuota(req, cb) {
        let resp = new DescribeFunctionQuotaResponse();
        this.request("DescribeFunctionQuota", req, resp, cb);
    }

    /**
     * 该接口返回用户昨日使用量数据。
     * @param {GetUserYesterdayUsageRequest} req
     * @param {function(string, GetUserYesterdayUsageResponse):void} cb
     * @public
     */
    GetUserYesterdayUsage(req, cb) {
        let resp = new GetUserYesterdayUsageResponse();
        this.request("GetUserYesterdayUsage", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数为设备绑定函数。
     * @param {BindFunctionOnDeviceRequest} req
     * @param {function(string, BindFunctionOnDeviceResponse):void} cb
     * @public
     */
    BindFunctionOnDevice(req, cb) {
        let resp = new BindFunctionOnDeviceResponse();
        this.request("BindFunctionOnDevice", req, resp, cb);
    }

    /**
     * 该接口用于修改用户配额。
     * @param {InnerModifyUserRestrictionRequest} req
     * @param {function(string, InnerModifyUserRestrictionResponse):void} cb
     * @public
     */
    InnerModifyUserRestriction(req, cb) {
        let resp = new InnerModifyUserRestrictionResponse();
        this.request("InnerModifyUserRestriction", req, resp, cb);
    }

    /**
     * 获取账户信息
     * @param {GetAccountRequest} req
     * @param {function(string, GetAccountResponse):void} cb
     * @public
     */
    GetAccount(req, cb) {
        let resp = new GetAccountResponse();
        this.request("GetAccount", req, resp, cb);
    }

    /**
     * 该接口根据传入的查询参数返回相关命名空间信息。
     * @param {DescribeNamespacesRequest} req
     * @param {function(string, DescribeNamespacesResponse):void} cb
     * @public
     */
    DescribeNamespaces(req, cb) {
        let resp = new DescribeNamespacesResponse();
        this.request("DescribeNamespaces", req, resp, cb);
    }

    /**
     * 该接口用于创建函数测试模板。
     * @param {CreateFunctionTestModelRequest} req
     * @param {function(string, CreateFunctionTestModelResponse):void} cb
     * @public
     */
    CreateFunctionTestModel(req, cb) {
        let resp = new CreateFunctionTestModelResponse();
        this.request("CreateFunctionTestModel", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数删除消息订阅规则。
     * @param {DeleteSubscriptionDefinitionRequest} req
     * @param {function(string, DeleteSubscriptionDefinitionResponse):void} cb
     * @public
     */
    DeleteSubscriptionDefinition(req, cb) {
        let resp = new DeleteSubscriptionDefinitionResponse();
        this.request("DeleteSubscriptionDefinition", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数查询设备绑定的函数
     * @param {DescribeDeviceFunctionsRequest} req
     * @param {function(string, DescribeDeviceFunctionsResponse):void} cb
     * @public
     */
    DescribeDeviceFunctions(req, cb) {
        let resp = new DescribeDeviceFunctionsResponse();
        this.request("DescribeDeviceFunctions", req, resp, cb);
    }

    /**
     * 该接口获取函数的测试模板。
     * @param {ListFunctionTestModelsRequest} req
     * @param {function(string, ListFunctionTestModelsResponse):void} cb
     * @public
     */
    ListFunctionTestModels(req, cb) {
        let resp = new ListFunctionTestModelsResponse();
        this.request("ListFunctionTestModels", req, resp, cb);
    }

    /**
     * 修改后端Invoke路由
     * @param {InnerModifyInvokeRoutingRequest} req
     * @param {function(string, InnerModifyInvokeRoutingResponse):void} cb
     * @public
     */
    InnerModifyInvokeRouting(req, cb) {
        let resp = new InnerModifyInvokeRoutingResponse();
        this.request("InnerModifyInvokeRouting", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数查询设备列表。
     * @param {DescribeDevicesRequest} req
     * @param {function(string, DescribeDevicesResponse):void} cb
     * @public
     */
    DescribeDevices(req, cb) {
        let resp = new DescribeDevicesResponse();
        this.request("DescribeDevices", req, resp, cb);
    }

    /**
     * 该接口用于获取函数代码包的下载地址。
     * @param {GetFunctionAddressRequest} req
     * @param {function(string, GetFunctionAddressResponse):void} cb
     * @public
     */
    GetFunctionAddress(req, cb) {
        let resp = new GetFunctionAddressResponse();
        this.request("GetFunctionAddress", req, resp, cb);
    }

    /**
     * 该接口用于下发设备绑定的函数与消息规则
     * @param {DeployFunctionAndSubscriptionDefinitionRequest} req
     * @param {function(string, DeployFunctionAndSubscriptionDefinitionResponse):void} cb
     * @public
     */
    DeployFunctionAndSubscriptionDefinition(req, cb) {
        let resp = new DeployFunctionAndSubscriptionDefinitionResponse();
        this.request("DeployFunctionAndSubscriptionDefinition", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数创建消息规则。
     * @param {CreateSubscriptionDefinitionRequest} req
     * @param {function(string, CreateSubscriptionDefinitionResponse):void} cb
     * @public
     */
    CreateSubscriptionDefinition(req, cb) {
        let resp = new CreateSubscriptionDefinitionResponse();
        this.request("CreateSubscriptionDefinition", req, resp, cb);
    }

    /**
     * 获取Demo下载地址
     * @param {GetDemoAddressRequest} req
     * @param {function(string, GetDemoAddressResponse):void} cb
     * @public
     */
    GetDemoAddress(req, cb) {
        let resp = new GetDemoAddressResponse();
        this.request("GetDemoAddress", req, resp, cb);
    }

    /**
     * 该接口用于用户发布新版本函数。
     * @param {PublishVersionRequest} req
     * @param {function(string, PublishVersionResponse):void} cb
     * @public
     */
    PublishVersion(req, cb) {
        let resp = new PublishVersionResponse();
        this.request("PublishVersion", req, resp, cb);
    }

    /**
     * 该接口用于获取账户信息。
     * @param {GetAccountSettingsRequest} req
     * @param {function(string, GetAccountSettingsResponse):void} cb
     * @public
     */
    GetAccountSettings(req, cb) {
        let resp = new GetAccountSettingsResponse();
        this.request("GetAccountSettings", req, resp, cb);
    }

    /**
     * 该接口用于内部调用获取函数的总量。
     * @param {GetFunctionTotalNumRequest} req
     * @param {function(string, GetFunctionTotalNumResponse):void} cb
     * @public
     */
    GetFunctionTotalNum(req, cb) {
        let resp = new GetFunctionTotalNumResponse();
        this.request("GetFunctionTotalNum", req, resp, cb);
    }

    /**
     * 该接口根据传入参数创建新的函数。
     * @param {CreateFunctionRequest} req
     * @param {function(string, CreateFunctionResponse):void} cb
     * @public
     */
    CreateFunction(req, cb) {
        let resp = new CreateFunctionResponse();
        this.request("CreateFunction", req, resp, cb);
    }

    /**
     * 该接口用于获取函数测试模板。
     * @param {GetFunctionTestModelRequest} req
     * @param {function(string, GetFunctionTestModelResponse):void} cb
     * @public
     */
    GetFunctionTestModel(req, cb) {
        let resp = new GetFunctionTestModelResponse();
        this.request("GetFunctionTestModel", req, resp, cb);
    }

    /**
     * 获取文档列表
     * @param {ListHelpDocRequest} req
     * @param {function(string, ListHelpDocResponse):void} cb
     * @public
     */
    ListHelpDoc(req, cb) {
        let resp = new ListHelpDocResponse();
        this.request("ListHelpDoc", req, resp, cb);
    }

    /**
     * 该接口根据传入的参数为设备解绑函数。
     * @param {UnBindFunctionOnDeviceRequest} req
     * @param {function(string, UnBindFunctionOnDeviceResponse):void} cb
     * @public
     */
    UnBindFunctionOnDevice(req, cb) {
        let resp = new UnBindFunctionOnDeviceResponse();
        this.request("UnBindFunctionOnDevice", req, resp, cb);
    }


}
module.exports = ScfClient;
