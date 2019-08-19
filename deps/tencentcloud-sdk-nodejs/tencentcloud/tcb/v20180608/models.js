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
const AbstractModel = require("../../common/abstract_model");

/**
 * CreateLoginConfig返回参数结构体
 * @class
 */
class CreateLoginConfigResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 函数用量限制
 * @class
 */
class FunctionLimit extends  AbstractModel {
    constructor(){
        super();

        /**
         * 函数个数限制
         * @type {number || null}
         */
        this.NumberLimit = null;

        /**
         * 执行次数限制，次数/每月
         * @type {LimitInfo || null}
         */
        this.CallLimit = null;

        /**
         * 资源使用量GBs限制，m是每月
         * @type {LimitInfo || null}
         */
        this.ResourceUsageLimit = null;

        /**
         * 并发数限制个数
         * @type {number || null}
         */
        this.ConcurrentLimit = null;

        /**
         * 外网出流量，GB/月
         * @type {LimitInfo || null}
         */
        this.OutboundTrafficLimit = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.NumberLimit = 'NumberLimit' in params ? params.NumberLimit : null;

        if (params.CallLimit) {
            let obj = new LimitInfo();
            obj.deserialize(params.CallLimit)
            this.CallLimit = obj;
        }

        if (params.ResourceUsageLimit) {
            let obj = new LimitInfo();
            obj.deserialize(params.ResourceUsageLimit)
            this.ResourceUsageLimit = obj;
        }
        this.ConcurrentLimit = 'ConcurrentLimit' in params ? params.ConcurrentLimit : null;

        if (params.OutboundTrafficLimit) {
            let obj = new LimitInfo();
            obj.deserialize(params.OutboundTrafficLimit)
            this.OutboundTrafficLimit = obj;
        }

    }
}

/**
 * CheckTcbService返回参数结构体
 * @class
 */
class CheckTcbServiceResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * true表示已开通
         * @type {boolean || null}
         */
        this.Initialized = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Initialized = 'Initialized' in params ? params.Initialized : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * GetUploadFileUrl-批量获取文件下载链接
 * @class
 */
class FileDownloadReqInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 文件id
         * @type {string || null}
         */
        this.FileId = null;

        /**
         * 链接有效期，单位秒（private需要）
         * @type {number || null}
         */
        this.TTL = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.FileId = 'FileId' in params ? params.FileId : null;
        this.TTL = 'TTL' in params ? params.TTL : null;

    }
}

/**
 * DescribeInvoiceAmount返回参数结构体
 * @class
 */
class DescribeInvoiceAmountResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 已开票金额（单位：元，人民币）
         * @type {number || null}
         */
        this.InvoicedAmount = null;

        /**
         * 可开票金额（单位：元，人民币）
         * @type {number || null}
         */
        this.AvailableAmount = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.InvoicedAmount = 'InvoicedAmount' in params ? params.InvoicedAmount : null;
        this.AvailableAmount = 'AvailableAmount' in params ? params.AvailableAmount : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 订单信息类型，包括订单费用，状态，时长等信息
 * @class
 */
class DealInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 订单号，tcb订单唯一标识
         * @type {string || null}
         */
        this.TranId = null;

        /**
         * 创建者的腾讯云账号id
         * @type {string || null}
         */
        this.DealOwner = null;

        /**
         * 订单创建时间，例如 "2019-01-01 00:00:00"
         * @type {string || null}
         */
        this.CreateTime = null;

        /**
         * tcb产品套餐ID，参考DescribePackages接口的返回值。
         * @type {string || null}
         */
        this.PackageId = null;

        /**
         * 订单状态。包含以下取值：
<li>1 ：未支付</li>
<li>2 ：支付中</li>
<li>3 ：发货中</li>
<li>4 ：发货成功</li>
<li>6 ：已退款</li>
<li>7 ：已取消</li>
         * @type {number || null}
         */
        this.DealStatus = null;

        /**
         * 订单实际支付费用（单位元）
         * @type {number || null}
         */
        this.DealCost = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 订单支付时间，例如 "2019-01-01 00:00:00"
         * @type {string || null}
         */
        this.PayTime = null;

        /**
         * 订单时长
         * @type {number || null}
         */
        this.TimeSpan = null;

        /**
         * 套餐单价（单位元）
         * @type {number || null}
         */
        this.Price = null;

        /**
         * 付费模式。包含以下取值：
<li>1 ：预付费</li>
<li>2 ：后付费</li>
         * @type {number || null}
         */
        this.PayMode = null;

        /**
         * 固定为tcp_ mp
         * @type {string || null}
         */
        this.ProductName = null;

        /**
         * 订单时长单位，目前只支持月：m
         * @type {string || null}
         */
        this.TimeUnit = null;

        /**
         * 订单退费金额，例如需要退费200元，则该值为200
         * @type {number || null}
         */
        this.RefundAmount = null;

        /**
         * DealStatus字段为7时，这里返回具体的状态原因。
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.DealStatusDes = null;

        /**
         * 订单支付时，代金券抵用的金额；如果是降配订单，该值为0；未支付订单，该参数无效，值为-1
注意：此字段可能返回 null，表示取不到有效值。
         * @type {number || null}
         */
        this.VoucherDecline = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TranId = 'TranId' in params ? params.TranId : null;
        this.DealOwner = 'DealOwner' in params ? params.DealOwner : null;
        this.CreateTime = 'CreateTime' in params ? params.CreateTime : null;
        this.PackageId = 'PackageId' in params ? params.PackageId : null;
        this.DealStatus = 'DealStatus' in params ? params.DealStatus : null;
        this.DealCost = 'DealCost' in params ? params.DealCost : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.PayTime = 'PayTime' in params ? params.PayTime : null;
        this.TimeSpan = 'TimeSpan' in params ? params.TimeSpan : null;
        this.Price = 'Price' in params ? params.Price : null;
        this.PayMode = 'PayMode' in params ? params.PayMode : null;
        this.ProductName = 'ProductName' in params ? params.ProductName : null;
        this.TimeUnit = 'TimeUnit' in params ? params.TimeUnit : null;
        this.RefundAmount = 'RefundAmount' in params ? params.RefundAmount : null;
        this.DealStatusDes = 'DealStatusDes' in params ? params.DealStatusDes : null;
        this.VoucherDecline = 'VoucherDecline' in params ? params.VoucherDecline : null;

    }
}

/**
 * DatabaseMigrateQueryInfo返回参数结构体
 * @class
 */
class DatabaseMigrateQueryInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 任务状态。包含以下取值：
<li> waiting：等待中</li>
<li> reading：读</li>
<li> writing ：写</li>
<li> migrating ：转移中</li>
<li> success：成功</li>
<li> fail：失败</li>
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 导入成功的数据条数
         * @type {number || null}
         */
        this.RecordSuccess = null;

        /**
         * 导入失败的数据条数
         * @type {number || null}
         */
        this.RecordFail = null;

        /**
         * 导入失败的原因
         * @type {string || null}
         */
        this.ErrorMsg = null;

        /**
         * 文件下载链接，仅在数据库导出中有效
         * @type {string || null}
         */
        this.FileUrl = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Status = 'Status' in params ? params.Status : null;
        this.RecordSuccess = 'RecordSuccess' in params ? params.RecordSuccess : null;
        this.RecordFail = 'RecordFail' in params ? params.RecordFail : null;
        this.ErrorMsg = 'ErrorMsg' in params ? params.ErrorMsg : null;
        this.FileUrl = 'FileUrl' in params ? params.FileUrl : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteFiles-文件删除信息
 * @class
 */
class FileDeleteInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 文件唯一id
         * @type {string || null}
         */
        this.FileId = null;

        /**
         * 删除操作结果
         * @type {string || null}
         */
        this.Code = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.FileId = 'FileId' in params ? params.FileId : null;
        this.Code = 'Code' in params ? params.Code : null;

    }
}

/**
 * DescribeUnbindInfo返回参数结构体
 * @class
 */
class DescribeUnbindInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 该帐号在小程序侧是否有未结算账单
         * @type {boolean || null}
         */
        this.HasDoingBilling = null;

        /**
         * 该帐号在小程序侧创建的环境是否为付费环境且资源未到期
         * @type {boolean || null}
         */
        this.HasUnFinishPaidResource = null;

        /**
         * 云开发所属环境中数据库的数据是否都被清空
         * @type {boolean || null}
         */
        this.NeedCleanDatabase = null;

        /**
         * 云开发所属环境中存储的数据是否都被清空
         * @type {boolean || null}
         */
        this.NeedCleanStorage = null;

        /**
         * 云开发所属环境中云函数的数据是否都被清空
         * @type {boolean || null}
         */
        this.NeedCleanFunction = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.HasDoingBilling = 'HasDoingBilling' in params ? params.HasDoingBilling : null;
        this.HasUnFinishPaidResource = 'HasUnFinishPaidResource' in params ? params.HasUnFinishPaidResource : null;
        this.NeedCleanDatabase = 'NeedCleanDatabase' in params ? params.NeedCleanDatabase : null;
        this.NeedCleanStorage = 'NeedCleanStorage' in params ? params.NeedCleanStorage : null;
        this.NeedCleanFunction = 'NeedCleanFunction' in params ? params.NeedCleanFunction : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 套餐详情
 * @class
 */
class PackageInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * tcb产品套餐ID
         * @type {string || null}
         */
        this.PackageId = null;

        /**
         * 套餐中文名称
         * @type {string || null}
         */
        this.Name = null;

        /**
         * 套餐描述
         * @type {string || null}
         */
        this.Desc = null;

        /**
         * 套餐详情，json字符串。包含以下取值：

云函数
<li> InvokeTimes：调用次数。单位：万次</li>
<li> MemoryUse：资源使用量GBs。单位：万GBS </li>
<li> Outflow：外网出流量。单位：GB </li>
<li> Concurrency：（单个云函数）并发数。单位：个</li>
<li> FunctionNum：函数数量。单位：个</li>

CDN
<li> FlowSize：CDN流量。单位：GB </li>

文件存储
<li> CapacityLimit：容量。单位：GB/月</li>
<li> CdnOriginFlowLimit：CDN回源流量。单位：GB/月</li>
<li> DownloadLimit：下载操作次数。单位：次</li>
<li> UploadLimit：上传操作次数。单位：次</li>

数据库
<li> DiskSize：容量。单位：GB </li>
<li> ConnNum：同时连接数。单位：个</li>
<li> ReadOperands：读操作次数。单位：次</li>
<li> WriteOperands：写操作次数。单位：次</li>
<li> CollectionLimits：集合限制。单位：个</li>
<li> SingleCollectionIndexLimits：单集合索引限制。单位：个</li>
         * @type {string || null}
         */
        this.Detail = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PackageId = 'PackageId' in params ? params.PackageId : null;
        this.Name = 'Name' in params ? params.Name : null;
        this.Desc = 'Desc' in params ? params.Desc : null;
        this.Detail = 'Detail' in params ? params.Detail : null;

    }
}

/**
 * DescribeStorageACL请求参数结构体
 * @class
 */
class DescribeStorageACLRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 桶名
         * @type {string || null}
         */
        this.Bucket = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Bucket = 'Bucket' in params ? params.Bucket : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeVouchersInfo返回参数结构体
 * @class
 */
class DescribeVouchersInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 代金券列表
         * @type {Array.<Volucher> || null}
         */
        this.Vouchers = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Vouchers) {
            this.Vouchers = new Array();
            for (let z in params.Vouchers) {
                let obj = new Volucher();
                obj.deserialize(params.Vouchers[z]);
                this.Vouchers.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeLoginConfigs请求参数结构体
 * @class
 */
class DescribeLoginConfigsRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 开发者的环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * ModifyMonitorCondition请求参数结构体
 * @class
 */
class ModifyMonitorConditionRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 条件ID
         * @type {number || null}
         */
        this.ConditionId = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 策略ID
         * @type {number || null}
         */
        this.PolicyId = null;

        /**
         * 指标名，如error(错误次数)
         * @type {string || null}
         */
        this.Metrics = null;

        /**
         * 比较关系：用户可选择>、>=、<、<=、=、！=等关系
         * @type {string || null}
         */
        this.Cmp = null;

        /**
         * 阈值
         * @type {number || null}
         */
        this.Threshold = null;

        /**
         * 统计周期
         * @type {number || null}
         */
        this.Period = null;

        /**
         * 持续周期
         * @type {number || null}
         */
        this.PeriodNum = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.ConditionId = 'ConditionId' in params ? params.ConditionId : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.PolicyId = 'PolicyId' in params ? params.PolicyId : null;
        this.Metrics = 'Metrics' in params ? params.Metrics : null;
        this.Cmp = 'Cmp' in params ? params.Cmp : null;
        this.Threshold = 'Threshold' in params ? params.Threshold : null;
        this.Period = 'Period' in params ? params.Period : null;
        this.PeriodNum = 'PeriodNum' in params ? params.PeriodNum : null;

    }
}

/**
 * DescribeNextExpireTime请求参数结构体
 * @class
 */
class DescribeNextExpireTimeRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 购买的月数
         * @type {number || null}
         */
        this.TimeSpan = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.TimeSpan = 'TimeSpan' in params ? params.TimeSpan : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * BindingPolicyObject请求参数结构体
 * @class
 */
class BindingPolicyObjectRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 资源类型
         * @type {string || null}
         */
        this.ResourceType = null;

        /**
         * 策略组ID
         * @type {number || null}
         */
        this.GroupId = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.ResourceType = 'ResourceType' in params ? params.ResourceType : null;
        this.GroupId = 'GroupId' in params ? params.GroupId : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * CreateLoginConfig请求参数结构体
 * @class
 */
class CreateLoginConfigRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 平台。“QQ" "WECHAT-OPEN" "WECHAT-PUBLIC"
         * @type {string || null}
         */
        this.Platform = null;

        /**
         * 第三方平台的 AppID
         * @type {string || null}
         */
        this.PlatformId = null;

        /**
         * 第三方平台的 AppSecret
         * @type {string || null}
         */
        this.PlatformSecret = null;

        /**
         * 可选参数，默认开启，”ENABLE”, “DISABLE”
         * @type {string || null}
         */
        this.Status = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Platform = 'Platform' in params ? params.Platform : null;
        this.PlatformId = 'PlatformId' in params ? params.PlatformId : null;
        this.PlatformSecret = 'PlatformSecret' in params ? params.PlatformSecret : null;
        this.Status = 'Status' in params ? params.Status : null;

    }
}

/**
 * QueryDeals请求参数结构体
 * @class
 */
class QueryDealsRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 用户客户端ip
         * @type {string || null}
         */
        this.UserClientIp = null;

        /**
         * 订单号，tcb订单唯一标识。如果传该参数，拉取单个订单信息；如果不传，拉取该用户下所有订单信息列表
         * @type {string || null}
         */
        this.TranId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 订单状态。包含以下取值：
<li>1 ：未支付</li>
<li>2 ：支付中</li>
<li>3 ：发货中</li>
<li>4 ：发货成功</li>
<li>6 ：已退款</li>
<li>7 ：已取消</li>
如果此参数不传，则拉取用户下所有订单
         * @type {number || null}
         */
        this.DealStatus = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.UserClientIp = 'UserClientIp' in params ? params.UserClientIp : null;
        this.TranId = 'TranId' in params ? params.TranId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.DealStatus = 'DealStatus' in params ? params.DealStatus : null;

    }
}

/**
 * ApplyVoucher请求参数结构体
 * @class
 */
class ApplyVoucherRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 小程序名称
         * @type {string || null}
         */
        this.AppName = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.AppName = 'AppName' in params ? params.AppName : null;

    }
}

/**
 * 发票邮寄地址
 * @class
 */
class InvoicePostInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 地址ID，邮寄地址的唯一标识；新增发票地址时不传；
         * @type {string || null}
         */
        this.PostId = null;

        /**
         * 联系人姓名
         * @type {string || null}
         */
        this.Contact = null;

        /**
         * 省份
         * @type {string || null}
         */
        this.Province = null;

        /**
         * 城市
         * @type {string || null}
         */
        this.City = null;

        /**
         * 详细地址
         * @type {string || null}
         */
        this.Address = null;

        /**
         * 邮政编码
         * @type {string || null}
         */
        this.PostalCode = null;

        /**
         * 手机号码或座机号码
         * @type {string || null}
         */
        this.Cellphone = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PostId = 'PostId' in params ? params.PostId : null;
        this.Contact = 'Contact' in params ? params.Contact : null;
        this.Province = 'Province' in params ? params.Province : null;
        this.City = 'City' in params ? params.City : null;
        this.Address = 'Address' in params ? params.Address : null;
        this.PostalCode = 'PostalCode' in params ? params.PostalCode : null;
        this.Cellphone = 'Cellphone' in params ? params.Cellphone : null;

    }
}

/**
 * 数据库资源用量限制
 * @class
 */
class DatabaseLimit extends  AbstractModel {
    constructor(){
        super();

        /**
         * 数据库存储容量 MB
         * @type {number || null}
         */
        this.CapacityLimit = null;

        /**
         * 连接数限制
         * @type {number || null}
         */
        this.ConnectionLimit = null;

        /**
         * 集合数限制
         * @type {number || null}
         */
        this.CollectionLimit = null;

        /**
         * 索引限制
         * @type {number || null}
         */
        this.IndexLimit = null;

        /**
         * 读次数限制，次数/每天
         * @type {LimitInfo || null}
         */
        this.ReadLimit = null;

        /**
         * 写次数限制，次数/每天
         * @type {LimitInfo || null}
         */
        this.WriteLimit = null;

        /**
         * qps 限制
         * @type {number || null}
         */
        this.QPSLimit = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.CapacityLimit = 'CapacityLimit' in params ? params.CapacityLimit : null;
        this.ConnectionLimit = 'ConnectionLimit' in params ? params.ConnectionLimit : null;
        this.CollectionLimit = 'CollectionLimit' in params ? params.CollectionLimit : null;
        this.IndexLimit = 'IndexLimit' in params ? params.IndexLimit : null;

        if (params.ReadLimit) {
            let obj = new LimitInfo();
            obj.deserialize(params.ReadLimit)
            this.ReadLimit = obj;
        }

        if (params.WriteLimit) {
            let obj = new LimitInfo();
            obj.deserialize(params.WriteLimit)
            this.WriteLimit = obj;
        }
        this.QPSLimit = 'QPSLimit' in params ? params.QPSLimit : null;

    }
}

/**
 * CreateMonitorPolicy请求参数结构体
 * @class
 */
class CreateMonitorPolicyRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信appID
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 策略名
         * @type {string || null}
         */
        this.Name = null;

        /**
         * 告警收敛周期
         * @type {number || null}
         */
        this.Convergence = null;

        /**
         * 备注
         * @type {string || null}
         */
        this.Note = null;

        /**
         * 资源类型，如Function
         * @type {string || null}
         */
        this.ResType = null;

        /**
         * 资源名，如Function的Namespace，CDN的域名
         * @type {string || null}
         */
        this.ResName = null;

        /**
         * 资源对象名，如Function为函数名，Database为collection名
         * @type {Array.<string> || null}
         */
        this.Objects = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Name = 'Name' in params ? params.Name : null;
        this.Convergence = 'Convergence' in params ? params.Convergence : null;
        this.Note = 'Note' in params ? params.Note : null;
        this.ResType = 'ResType' in params ? params.ResType : null;
        this.ResName = 'ResName' in params ? params.ResName : null;
        this.Objects = 'Objects' in params ? params.Objects : null;

    }
}

/**
 * 告警策略组信息
 * @class
 */
class AlarmPolicyInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 策略组名称
         * @type {string || null}
         */
        this.GroupName = null;

        /**
         * 策略组ID
         * @type {number || null}
         */
        this.GroupId = null;

        /**
         * 资源类型
         * @type {string || null}
         */
        this.ResourceType = null;

        /**
         * 备注
         * @type {string || null}
         */
        this.Remark = null;

        /**
         * 告警条件
         * @type {Array.<AlarmCondition> || null}
         */
        this.Conditions = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.GroupName = 'GroupName' in params ? params.GroupName : null;
        this.GroupId = 'GroupId' in params ? params.GroupId : null;
        this.ResourceType = 'ResourceType' in params ? params.ResourceType : null;
        this.Remark = 'Remark' in params ? params.Remark : null;

        if (params.Conditions) {
            this.Conditions = new Array();
            for (let z in params.Conditions) {
                let obj = new AlarmCondition();
                obj.deserialize(params.Conditions[z]);
                this.Conditions.push(obj);
            }
        }

    }
}

/**
 * CreateInvoice返回参数结构体
 * @class
 */
class CreateInvoiceResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ResourceRecover返回参数结构体
 * @class
 */
class ResourceRecoverResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 资源恢复结果
         * @type {Array.<RecoverResult> || null}
         */
        this.Results = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Results) {
            this.Results = new Array();
            for (let z in params.Results) {
                let obj = new RecoverResult();
                obj.deserialize(params.Results[z]);
                this.Results.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CheckEnvPackageModify返回参数结构体
 * @class
 */
class CheckEnvPackageModifyResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 是否允许修改套餐
         * @type {boolean || null}
         */
        this.AllowToModify = null;

        /**
         * 如果不允许修改, 列出超限指标的详情
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<QuotaOverlimit> || null}
         */
        this.QuotaOverlimitList = null;

        /**
         * 是否允许强制修改套餐。目前，如果仅有数据库读写次数指标超限, 依然允许用户进行强制降配
         * @type {boolean || null}
         */
        this.ForceToModify = null;

        /**
         * 是否发票金额超限导致无法退费（仅在套餐降级时有意义）
         * @type {InvoiceAmountOverlimit || null}
         */
        this.InvoiceOverlimit = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.AllowToModify = 'AllowToModify' in params ? params.AllowToModify : null;

        if (params.QuotaOverlimitList) {
            this.QuotaOverlimitList = new Array();
            for (let z in params.QuotaOverlimitList) {
                let obj = new QuotaOverlimit();
                obj.deserialize(params.QuotaOverlimitList[z]);
                this.QuotaOverlimitList.push(obj);
            }
        }
        this.ForceToModify = 'ForceToModify' in params ? params.ForceToModify : null;

        if (params.InvoiceOverlimit) {
            let obj = new InvoiceAmountOverlimit();
            obj.deserialize(params.InvoiceOverlimit)
            this.InvoiceOverlimit = obj;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateInvoicePostInfo请求参数结构体
 * @class
 */
class CreateInvoicePostInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 联系人姓名
         * @type {string || null}
         */
        this.Contact = null;

        /**
         * 省份
         * @type {string || null}
         */
        this.Province = null;

        /**
         * 城市
         * @type {string || null}
         */
        this.City = null;

        /**
         * 详细地址
         * @type {string || null}
         */
        this.Address = null;

        /**
         * 邮政编码
         * @type {string || null}
         */
        this.PostalCode = null;

        /**
         * 手机号码或座机号码
         * @type {string || null}
         */
        this.Cellphone = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Contact = 'Contact' in params ? params.Contact : null;
        this.Province = 'Province' in params ? params.Province : null;
        this.City = 'City' in params ? params.City : null;
        this.Address = 'Address' in params ? params.Address : null;
        this.PostalCode = 'PostalCode' in params ? params.PostalCode : null;
        this.Cellphone = 'Cellphone' in params ? params.Cellphone : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeInvoicePostInfo请求参数结构体
 * @class
 */
class DescribeInvoicePostInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * 代金券结构体
 * @class
 */
class Volucher extends  AbstractModel {
    constructor(){
        super();

        /**
         * 代金券编号
         * @type {string || null}
         */
        this.VoucherId = null;

        /**
         * 代金券拥有者
         * @type {string || null}
         */
        this.OwnerUin = null;

        /**
         * 代金券总额，单位：元
         * @type {number || null}
         */
        this.Amount = null;

        /**
         * 代金券余额，单位：元
         * @type {number || null}
         */
        this.LeftAmount = null;

        /**
         * 使用截止期，型如：2018-05-30 23:59:59
         * @type {string || null}
         */
        this.UseDeadLine = null;

        /**
         * 仅 DescribeVouchersInfo 接口返回该字段；
包含以下值：
<li>1：待使用</li>
<li>3：已使用</li>
<li>4：已过期</li>
<li>6：已作废</li>
注意：此字段可能返回 null，表示取不到有效值。
         * @type {number || null}
         */
        this.Status = null;

        /**
         * 代金券使用门槛，单位：元
         * @type {number || null}
         */
        this.BaseAmount = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.VoucherId = 'VoucherId' in params ? params.VoucherId : null;
        this.OwnerUin = 'OwnerUin' in params ? params.OwnerUin : null;
        this.Amount = 'Amount' in params ? params.Amount : null;
        this.LeftAmount = 'LeftAmount' in params ? params.LeftAmount : null;
        this.UseDeadLine = 'UseDeadLine' in params ? params.UseDeadLine : null;
        this.Status = 'Status' in params ? params.Status : null;
        this.BaseAmount = 'BaseAmount' in params ? params.BaseAmount : null;

    }
}

/**
 * 发票金额超限
 * @class
 */
class InvoiceAmountOverlimit extends  AbstractModel {
    constructor(){
        super();

        /**
         * 发票金额是否超限
         * @type {boolean || null}
         */
        this.IsAmountOverlimit = null;

        /**
         * 退款金额(仅在降级时有值，为实际退换的金额，单位：元。)
         * @type {number || null}
         */
        this.RefundAmount = null;

        /**
         * 可申请发票金额，单位：元
         * @type {number || null}
         */
        this.InvoiceAmount = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.IsAmountOverlimit = 'IsAmountOverlimit' in params ? params.IsAmountOverlimit : null;
        this.RefundAmount = 'RefundAmount' in params ? params.RefundAmount : null;
        this.InvoiceAmount = 'InvoiceAmount' in params ? params.InvoiceAmount : null;

    }
}

/**
 * DescribeStorageRecoverJob请求参数结构体
 * @class
 */
class DescribeStorageRecoverJobRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 任务ID
         * @type {string || null}
         */
        this.JobId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.JobId = 'JobId' in params ? params.JobId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeAccountInfo请求参数结构体
 * @class
 */
class DescribeAccountInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信AppId，必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeResourceLimit返回参数结构体
 * @class
 */
class DescribeResourceLimitResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 数据库用量限制
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<DatabaseLimit> || null}
         */
        this.Database = null;

        /**
         * 文件存储用量限制
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<StorageLimit> || null}
         */
        this.Storage = null;

        /**
         * 函数用量限制
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<FunctionLimit> || null}
         */
        this.Function = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Database) {
            this.Database = new Array();
            for (let z in params.Database) {
                let obj = new DatabaseLimit();
                obj.deserialize(params.Database[z]);
                this.Database.push(obj);
            }
        }

        if (params.Storage) {
            this.Storage = new Array();
            for (let z in params.Storage) {
                let obj = new StorageLimit();
                obj.deserialize(params.Storage[z]);
                this.Storage.push(obj);
            }
        }

        if (params.Function) {
            this.Function = new Array();
            for (let z in params.Function) {
                let obj = new FunctionLimit();
                obj.deserialize(params.Function[z]);
                this.Function.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ApplyVoucher返回参数结构体
 * @class
 */
class ApplyVoucherResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 云日志服务相关信息
 * @class
 */
class LogServiceInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * log名
         * @type {string || null}
         */
        this.LogsetName = null;

        /**
         * log-id
         * @type {string || null}
         */
        this.LogsetId = null;

        /**
         * topic名
         * @type {string || null}
         */
        this.TopicName = null;

        /**
         * topic-id
         * @type {string || null}
         */
        this.TopicId = null;

        /**
         * cls日志所属地域
         * @type {string || null}
         */
        this.Region = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.LogsetName = 'LogsetName' in params ? params.LogsetName : null;
        this.LogsetId = 'LogsetId' in params ? params.LogsetId : null;
        this.TopicName = 'TopicName' in params ? params.TopicName : null;
        this.TopicId = 'TopicId' in params ? params.TopicId : null;
        this.Region = 'Region' in params ? params.Region : null;

    }
}

/**
 * 增值税普通发票开票信息
 * @class
 */
class InvoiceVATGeneral extends  AbstractModel {
    constructor(){
        super();

        /**
         * 税务登记号类型：
CompanyCreditCode 社会统一信用代码：
TaxNumber 税务登记号
         * @type {string || null}
         */
        this.TaxPayerType = null;

        /**
         * 纳税人识别号号码
如果是 社会统一信用代码，则长度必须为 18位
如果是 税务登记号，则长度介于 15~20之间(含)
         * @type {string || null}
         */
        this.TaxPayerNumber = null;

        /**
         * 开户行
         * @type {string || null}
         */
        this.BankDeposit = null;

        /**
         * 银行账号
         * @type {string || null}
         */
        this.BankAccount = null;

        /**
         * 注册场所地址：请填写税务登记证上的地址或经营场所地址
         * @type {string || null}
         */
        this.RegisterAddress = null;

        /**
         * 注册固定电话
         * @type {string || null}
         */
        this.RegisterPhone = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TaxPayerType = 'TaxPayerType' in params ? params.TaxPayerType : null;
        this.TaxPayerNumber = 'TaxPayerNumber' in params ? params.TaxPayerNumber : null;
        this.BankDeposit = 'BankDeposit' in params ? params.BankDeposit : null;
        this.BankAccount = 'BankAccount' in params ? params.BankAccount : null;
        this.RegisterAddress = 'RegisterAddress' in params ? params.RegisterAddress : null;
        this.RegisterPhone = 'RegisterPhone' in params ? params.RegisterPhone : null;

    }
}

/**
 * GetDownloadUrls返回参数结构体
 * @class
 */
class GetDownloadUrlsResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 文件访问链接列表
         * @type {Array.<FileDownloadRespInfo> || null}
         */
        this.DownloadUrlSet = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.DownloadUrlSet) {
            this.DownloadUrlSet = new Array();
            for (let z in params.DownloadUrlSet) {
                let obj = new FileDownloadRespInfo();
                obj.deserialize(params.DownloadUrlSet[z]);
                this.DownloadUrlSet.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateMonitorCondition返回参数结构体
 * @class
 */
class CreateMonitorConditionResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 条件Id
         * @type {number || null}
         */
        this.Id = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Id = 'Id' in params ? params.Id : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeCurveData返回参数结构体
 * @class
 */
class DescribeCurveDataResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 开始时间, 会根据数据的统计周期进行取整.
         * @type {string || null}
         */
        this.StartTime = null;

        /**
         * 结束时间, 会根据数据的统计周期进行取整.
         * @type {string || null}
         */
        this.EndTime = null;

        /**
         * 指标名.
         * @type {string || null}
         */
        this.MetricName = null;

        /**
         * 统计周期(单位秒), 当时间区间为1天内, 统计周期为5分钟; 当时间区间选择为1天以上, 15天以下, 统计周期为1小时; 当时间区间选择为15天以上, 180天以下, 统计周期为1天.
         * @type {number || null}
         */
        this.Period = null;

        /**
         * 有效的监控数据, 每个有效监控数据的上报时间可以从时间数组中的对应位置上获取到.
         * @type {Array.<number> || null}
         */
        this.Values = null;

        /**
         * 时间数据, 标识监控数据Values中的点是哪个时间段上报的.
         * @type {Array.<number> || null}
         */
        this.Time = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.StartTime = 'StartTime' in params ? params.StartTime : null;
        this.EndTime = 'EndTime' in params ? params.EndTime : null;
        this.MetricName = 'MetricName' in params ? params.MetricName : null;
        this.Period = 'Period' in params ? params.Period : null;
        this.Values = 'Values' in params ? params.Values : null;
        this.Time = 'Time' in params ? params.Time : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 发票基本信息
 * @class
 */
class InvoiceBasicInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 发票ID
         * @type {string || null}
         */
        this.InvoiceId = null;

        /**
         * 发票类型：
Personal 个人-普通发票
CompanyVAT 公司-增值税普通发票
CompanyVATSpecial 公司-增值税专用发票
Organization 组织-增值税普通发票
         * @type {string || null}
         */
        this.UserType = null;

        /**
         * 发票金额（单位：元，人民币）
         * @type {number || null}
         */
        this.Amount = null;

        /**
         * 发票状态：
PROCESSING 处理中
INVOICED 已开票
MAILED 已邮寄
OBSOLETED 已作废
INVOICING 开票中
CANCELED 已取消
VIRTUAL 虚拟发票
OBSOLETING 作废中
MAIL_SIGNED 邮件已签收
REFUND_WAIT 退票待处理
REFUND_DENY 退票驳回
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 开票时间
         * @type {string || null}
         */
        this.InvoiceTime = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.InvoiceId = 'InvoiceId' in params ? params.InvoiceId : null;
        this.UserType = 'UserType' in params ? params.UserType : null;
        this.Amount = 'Amount' in params ? params.Amount : null;
        this.Status = 'Status' in params ? params.Status : null;
        this.InvoiceTime = 'InvoiceTime' in params ? params.InvoiceTime : null;

    }
}

/**
 * CheckEnvPackageModify请求参数结构体
 * @class
 */
class CheckEnvPackageModifyRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * tcb产品套餐ID，从DescribePackages接口的返回值中获取。
         * @type {string || null}
         */
        this.PackageId = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PackageId = 'PackageId' in params ? params.PackageId : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * DescribeAuthDomains返回参数结构体
 * @class
 */
class DescribeAuthDomainsResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * domain 列表
         * @type {Array.<AuthDomain> || null}
         */
        this.Domains = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Domains) {
            this.Domains = new Array();
            for (let z in params.Domains) {
                let obj = new AuthDomain();
                obj.deserialize(params.Domains[z]);
                this.Domains.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateCustomLoginKeys请求参数结构体
 * @class
 */
class CreateCustomLoginKeysRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境id
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * GetDownloadUrls请求参数结构体
 * @class
 */
class GetDownloadUrlsRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 文件id列表
         * @type {Array.<FileDownloadReqInfo> || null}
         */
        this.Files = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Files) {
            this.Files = new Array();
            for (let z in params.Files) {
                let obj = new FileDownloadReqInfo();
                obj.deserialize(params.Files[z]);
                this.Files.push(obj);
            }
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * InvokeAI返回参数结构体
 * @class
 */
class InvokeAIResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * AI服务结果透传，json字符串
         * @type {string || null}
         */
        this.Result = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Result = 'Result' in params ? params.Result : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 超过限额的配额指标
 * @class
 */
class QuotaOverlimit extends  AbstractModel {
    constructor(){
        super();

        /**
         * 所属资源。包含以下取值：
<li>SCF</li>
<li>CDN</li>
<li>COS</li>
<li>FLEXDB</li>
         * @type {string || null}
         */
        this.ResourceName = null;

        /**
         * 配额英文名称。包含以下取值：

CDN指标名：
<li> TrafficLimit：CDN流量。单位：字节 </li>
SCF指标名
<li> FunctionCallTimeLimit：调用次数 </li>
<li> ResourceAmountLimit：云资源使用量。单位：GBS </li>
<li> TrafficLimit：外网出流量。单位：字节 </li>
<li> FunctionNum：云函数个数 </li>
FLEXDB指标名
<li> StorageLimit：db存储容量。单位：MB </li>
<li> ReadOpLimit：读操作数 </li>
<li> WriteOpLimit：写操作数 </li>
<li> FunctionNum：表个数限制 </li>
COS指标名
<li> StorageLimit：存储的容量。单位：MB </li>
<li> ReadRequsetsLimit：下载操作次数 </li>
<li> WriteRequsetsLimit：上传操作次数 </li>
<li> InternetTrafficLimit：外网下行容量。单位：字节 </li>
<li> CdnTrafficLimit：CDN回源流量。单位：字节 </li>
         * @type {string || null}
         */
        this.QuotaName = null;

        /**
         * 配额中文名
         * @type {string || null}
         */
        this.QuotaChName = null;

        /**
         * 已使用配额量
         * @type {number || null}
         */
        this.QuotaUsaged = null;

        /**
         * 配额单位
         * @type {string || null}
         */
        this.Unit = null;

        /**
         * 其它信息. 目前仅在FLEXDB资源中有效, 会将数据库实例写到Comments字段.
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.Comments = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.ResourceName = 'ResourceName' in params ? params.ResourceName : null;
        this.QuotaName = 'QuotaName' in params ? params.QuotaName : null;
        this.QuotaChName = 'QuotaChName' in params ? params.QuotaChName : null;
        this.QuotaUsaged = 'QuotaUsaged' in params ? params.QuotaUsaged : null;
        this.Unit = 'Unit' in params ? params.Unit : null;
        this.Comments = 'Comments' in params ? params.Comments : null;

    }
}

/**
 * CreateCloudUser返回参数结构体
 * @class
 */
class CreateCloudUserResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 腾讯云的uin
         * @type {number || null}
         */
        this.Uin = null;

        /**
         * 腾讯云的appId
         * @type {number || null}
         */
        this.AppId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Uin = 'Uin' in params ? params.Uin : null;
        this.AppId = 'AppId' in params ? params.AppId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * UnBindingPolicyObject请求参数结构体
 * @class
 */
class UnBindingPolicyObjectRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 资源类型（Database,Function,Storage,CDN）
         * @type {string || null}
         */
        this.ResourceType = null;

        /**
         * 告警组ID
         * @type {number || null}
         */
        this.GroupId = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.ResourceType = 'ResourceType' in params ? params.ResourceType : null;
        this.GroupId = 'GroupId' in params ? params.GroupId : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * DescribeEnvsForWx请求参数结构体
 * @class
 */
class DescribeEnvsForWxRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信 AppId，必传
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 环境ID，如果传了这个参数则只返回该环境的相关信息
         * @type {Array.<string> || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * DescribeLoginConfigs返回参数结构体
 * @class
 */
class DescribeLoginConfigsResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * ConfigItem 列表
         * @type {Array.<LoginConfigItem> || null}
         */
        this.ConfigList = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.ConfigList) {
            this.ConfigList = new Array();
            for (let z in params.ConfigList) {
                let obj = new LoginConfigItem();
                obj.deserialize(params.ConfigList[z]);
                this.ConfigList.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * GetMonitorData请求参数结构体
 * @class
 */
class GetMonitorDataRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 资源所属的环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 资源类型（Database,Function,Storage,CDN）
         * @type {string || null}
         */
        this.ResourceType = null;

        /**
         * 指标名称，不同的资源类型支持不同的指标
         * @type {string || null}
         */
        this.MetricName = null;

        /**
         * 起始时间，如2018-08-24 10:50:00
         * @type {string || null}
         */
        this.StartTime = null;

        /**
         * 资源ID（资源ID在环境详情中获取）
         * @type {string || null}
         */
        this.ResourceID = null;

        /**
         * 子资源ID（子资源ID在环境详情中获取）
         * @type {string || null}
         */
        this.SubresouceID = null;

        /**
         * 监控统计周期。默认为取值为300，单位为s
         * @type {number || null}
         */
        this.Period = null;

        /**
         * 结束时间，默认为当前时间。 EndTime不能小于StartTime
         * @type {string || null}
         */
        this.EndTime = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.ResourceType = 'ResourceType' in params ? params.ResourceType : null;
        this.MetricName = 'MetricName' in params ? params.MetricName : null;
        this.StartTime = 'StartTime' in params ? params.StartTime : null;
        this.ResourceID = 'ResourceID' in params ? params.ResourceID : null;
        this.SubresouceID = 'SubresouceID' in params ? params.SubresouceID : null;
        this.Period = 'Period' in params ? params.Period : null;
        this.EndTime = 'EndTime' in params ? params.EndTime : null;

    }
}

/**
 * DescribeDbDistribution返回参数结构体
 * @class
 */
class DescribeDbDistributionResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 集合的文档布局列表
         * @type {Array.<CollectionDispension> || null}
         */
        this.Collections = null;

        /**
         * 数据库全部集合总数
         * @type {number || null}
         */
        this.Total = null;

        /**
         * 当前页集合总数
         * @type {number || null}
         */
        this.Count = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Collections) {
            this.Collections = new Array();
            for (let z in params.Collections) {
                let obj = new CollectionDispension();
                obj.deserialize(params.Collections[z]);
                this.Collections.push(obj);
            }
        }
        this.Total = 'Total' in params ? params.Total : null;
        this.Count = 'Count' in params ? params.Count : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ModifyDatabaseACL请求参数结构体
 * @class
 */
class ModifyDatabaseACLRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 权限标签。包含以下取值：
<li> READONLY：所有用户可读，仅创建者和管理员可写</li>
<li> PRIVATE：仅创建者及管理员可读写</li>
<li> ADMINWRITE：所有用户可读，仅管理员可写</li>
<li> ADMINONLY：仅管理员可读写</li>
         * @type {string || null}
         */
        this.AclTag = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.AclTag = 'AclTag' in params ? params.AclTag : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * ModifySafeRule请求参数结构体
 * @class
 */
class ModifySafeRuleRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 权限标签。包含以下取值：
<li> READONLY：所有用户可读，仅创建者和管理员可写</li>
<li> PRIVATE：仅创建者及管理员可读写</li>
<li> ADMINWRITE：所有用户可读，仅管理员可写</li>
<li> ADMINONLY：仅管理员可读写</li>
<li> CUSTOM：自定义安全规则</li>
         * @type {string || null}
         */
        this.AclTag = null;

        /**
         * 安全规则内容
         * @type {string || null}
         */
        this.Rule = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.AclTag = 'AclTag' in params ? params.AclTag : null;
        this.Rule = 'Rule' in params ? params.Rule : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * 终端用户信息
 * @class
 */
class EndUserInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 用户唯一ID
         * @type {string || null}
         */
        this.UUId = null;

        /**
         * 微信ID
         * @type {string || null}
         */
        this.WXOpenId = null;

        /**
         * qq ID
         * @type {string || null}
         */
        this.QQOpenId = null;

        /**
         * 手机号
         * @type {string || null}
         */
        this.Phone = null;

        /**
         * 邮箱
         * @type {string || null}
         */
        this.Email = null;

        /**
         * 昵称
         * @type {string || null}
         */
        this.NickName = null;

        /**
         * 性别
         * @type {string || null}
         */
        this.Gender = null;

        /**
         * 头像地址
         * @type {string || null}
         */
        this.AvatarUrl = null;

        /**
         * 更新时间
         * @type {string || null}
         */
        this.UpdateTime = null;

        /**
         * 创建时间
         * @type {string || null}
         */
        this.CreateTime = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.UUId = 'UUId' in params ? params.UUId : null;
        this.WXOpenId = 'WXOpenId' in params ? params.WXOpenId : null;
        this.QQOpenId = 'QQOpenId' in params ? params.QQOpenId : null;
        this.Phone = 'Phone' in params ? params.Phone : null;
        this.Email = 'Email' in params ? params.Email : null;
        this.NickName = 'NickName' in params ? params.NickName : null;
        this.Gender = 'Gender' in params ? params.Gender : null;
        this.AvatarUrl = 'AvatarUrl' in params ? params.AvatarUrl : null;
        this.UpdateTime = 'UpdateTime' in params ? params.UpdateTime : null;
        this.CreateTime = 'CreateTime' in params ? params.CreateTime : null;

    }
}

/**
 * 资源信息
 * @class
 */
class ResourcesInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 资源类型。包含以下取值：
<li> database </li>
<li> storage </li>
<li> functions</li>
         * @type {string || null}
         */
        this.ResourceType = null;

        /**
         * 资源标识，对应 db_name 或 fs_name，云函数不需要传。
         * @type {string || null}
         */
        this.ResourceName = null;

        /**
         * 资源用量状态。包含以下取值：
<li> 1：安全</li>
<li> 2：警告</li>
<li> 3：超额</li>
<li> 4：停服</li>
         * @type {number || null}
         */
        this.Status = null;

        /**
         * 资源额定容量。包含以下取值： 
<li> cos 单位：MB </li>
<li> db 单位：MB </li>
<li> scf 单位：函数个数</li>
         * @type {number || null}
         */
        this.MaxSize = null;

        /**
         * 当前用量
         * @type {number || null}
         */
        this.CurSize = null;

        /**
         * 单位，仅做参考&前台展示
         * @type {string || null}
         */
        this.Unit = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.ResourceType = 'ResourceType' in params ? params.ResourceType : null;
        this.ResourceName = 'ResourceName' in params ? params.ResourceName : null;
        this.Status = 'Status' in params ? params.Status : null;
        this.MaxSize = 'MaxSize' in params ? params.MaxSize : null;
        this.CurSize = 'CurSize' in params ? params.CurSize : null;
        this.Unit = 'Unit' in params ? params.Unit : null;

    }
}

/**
 * InitTcb返回参数结构体
 * @class
 */
class InitTcbResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 告警条件
 * @class
 */
class AlarmCondition extends  AbstractModel {
    constructor(){
        super();

        /**
         * 指标名称
         * @type {string || null}
         */
        this.MetricName = null;

        /**
         * 比较方式
         * @type {number || null}
         */
        this.CalcType = null;

        /**
         * 阈值
         * @type {number || null}
         */
        this.CalcValue = null;

        /**
         * 持续周期
         * @type {number || null}
         */
        this.ContinuePeriod = null;

        /**
         * 统计周期,目前支持60、300
         * @type {number || null}
         */
        this.CalcPeriod = null;

        /**
         * 重复通知策略类型，0-不重复，1，按AlarmNotifyPeriod指定的时间重复通知
         * @type {number || null}
         */
        this.AlarmNotifyType = null;

        /**
         * 重复通知时间间隔，单位是秒，最小300（5分钟），最大86400（一天）
         * @type {number || null}
         */
        this.AlarmNotifyPeriod = null;

        /**
         * 指标ID
         * @type {number || null}
         */
        this.MetricId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.MetricName = 'MetricName' in params ? params.MetricName : null;
        this.CalcType = 'CalcType' in params ? params.CalcType : null;
        this.CalcValue = 'CalcValue' in params ? params.CalcValue : null;
        this.ContinuePeriod = 'ContinuePeriod' in params ? params.ContinuePeriod : null;
        this.CalcPeriod = 'CalcPeriod' in params ? params.CalcPeriod : null;
        this.AlarmNotifyType = 'AlarmNotifyType' in params ? params.AlarmNotifyType : null;
        this.AlarmNotifyPeriod = 'AlarmNotifyPeriod' in params ? params.AlarmNotifyPeriod : null;
        this.MetricId = 'MetricId' in params ? params.MetricId : null;

    }
}

/**
 * ModifyStorageACL请求参数结构体
 * @class
 */
class ModifyStorageACLRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 权限标签。包含以下取值：
<li> READONLY：所有用户可读，仅创建者和管理员可写</li>
<li> PRIVATE：仅创建者及管理员可读写</li>
<li> ADMINWRITE：所有用户可读，仅管理员可写</li>
<li> ADMINONLY：仅管理员可读写</li>
         * @type {string || null}
         */
        this.AclTag = null;

        /**
         * 桶名
         * @type {string || null}
         */
        this.Bucket = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.AclTag = 'AclTag' in params ? params.AclTag : null;
        this.Bucket = 'Bucket' in params ? params.Bucket : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DeleteInvoicePostInfo返回参数结构体
 * @class
 */
class DeleteInvoicePostInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeMonitorPolicy返回参数结构体
 * @class
 */
class DescribeMonitorPolicyResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 策略列表
         * @type {Array.<MonitorPolicyInfo> || null}
         */
        this.Data = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Data) {
            this.Data = new Array();
            for (let z in params.Data) {
                let obj = new MonitorPolicyInfo();
                obj.deserialize(params.Data[z]);
                this.Data.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeSafeRule请求参数结构体
 * @class
 */
class DescribeSafeRuleRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeQuotaData返回参数结构体
 * @class
 */
class DescribeQuotaDataResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 指标名
         * @type {string || null}
         */
        this.MetricName = null;

        /**
         * 指标的值
         * @type {number || null}
         */
        this.Value = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.MetricName = 'MetricName' in params ? params.MetricName : null;
        this.Value = 'Value' in params ? params.Value : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 监控条件
 * @class
 */
class  MonitorConditionInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 策略ID
         * @type {number || null}
         */
        this.PolicyId = null;

        /**
         * 条件ID
         * @type {number || null}
         */
        this.ConditionId = null;

        /**
         * 指标名，如error(错误次数)
         * @type {string || null}
         */
        this.Metrics = null;

        /**
         * 比较关系。包含以下取值：
<li>></li>
<li>>=</li>
<li><</li>
<li><=</li>
<li>=</li>
<li>!=</li>
等关系
         * @type {string || null}
         */
        this.Cmp = null;

        /**
         * 阈值
         * @type {number || null}
         */
        this.Threshold = null;

        /**
         * 统计周期
         * @type {number || null}
         */
        this.Period = null;

        /**
         * 持续周期
         * @type {number || null}
         */
        this.PeriodNum = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.PolicyId = 'PolicyId' in params ? params.PolicyId : null;
        this.ConditionId = 'ConditionId' in params ? params.ConditionId : null;
        this.Metrics = 'Metrics' in params ? params.Metrics : null;
        this.Cmp = 'Cmp' in params ? params.Cmp : null;
        this.Threshold = 'Threshold' in params ? params.Threshold : null;
        this.Period = 'Period' in params ? params.Period : null;
        this.PeriodNum = 'PeriodNum' in params ? params.PeriodNum : null;

    }
}

/**
 * DescribeVouchersInfo请求参数结构体
 * @class
 */
class DescribeVouchersInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 页码
         * @type {number || null}
         */
        this.Page = null;

        /**
         * 每页大小
         * @type {number || null}
         */
        this.Size = null;

        /**
         * 请求来源
<li>miniapp</li>
<li>qcloud</li>
         * @type {string || null}
         */
        this.Source = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Page = 'Page' in params ? params.Page : null;
        this.Size = 'Size' in params ? params.Size : null;
        this.Source = 'Source' in params ? params.Source : null;

    }
}

/**
 * InvokeFunction返回参数结构体
 * @class
 */
class InvokeFunctionResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 云函数执行结果透传，json格式
         * @type {string || null}
         */
        this.Result = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Result = 'Result' in params ? params.Result : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateDocument返回参数结构体
 * @class
 */
class CreateDocumentResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 创建的文档_id
         * @type {string || null}
         */
        this.Id = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Id = 'Id' in params ? params.Id : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * AddLoginManner请求参数结构体
 * @class
 */
class AddLoginMannerRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境id
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信填1，QQ填2
         * @type {number || null}
         */
        this.Platform = null;

        /**
         * 账号的appid
         * @type {string || null}
         */
        this.Appid = null;

        /**
         * 账号的密钥
         * @type {string || null}
         */
        this.Secret = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Platform = 'Platform' in params ? params.Platform : null;
        this.Appid = 'Appid' in params ? params.Appid : null;
        this.Secret = 'Secret' in params ? params.Secret : null;

    }
}

/**
 * DescribeResourceRecoverJob请求参数结构体
 * @class
 */
class DescribeResourceRecoverJobRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 任务ID列表
         * @type {Array.<string> || null}
         */
        this.JobIds = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.JobIds = 'JobIds' in params ? params.JobIds : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateEnv返回参数结构体
 * @class
 */
class CreateEnvResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 环境别名，要以a-z开头，不能包含 a-zA-z0-9- 以外的字符
         * @type {string || null}
         */
        this.Alias = null;

        /**
         * 创建时间
         * @type {string || null}
         */
        this.CreateTime = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Alias = 'Alias' in params ? params.Alias : null;
        this.CreateTime = 'CreateTime' in params ? params.CreateTime : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DatabaseMigrateExport返回参数结构体
 * @class
 */
class DatabaseMigrateExportResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 任务ID
         * @type {number || null}
         */
        this.JobId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.JobId = 'JobId' in params ? params.JobId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 文件存储异常状态信息
 * @class
 */
class StorageException extends  AbstractModel {
    constructor(){
        super();

        /**
         * 桶名，存储资源的唯一标识
         * @type {string || null}
         */
        this.Bucket = null;

        /**
         * Normal:正常， BucketMissing:bucket被删， Recovering:正在恢复中
         * @type {string || null}
         */
        this.COSStatus = null;

        /**
         * 当 COSStatus=Recovering时有值，表示当前异步任务ID
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.COSRecoverJobId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Bucket = 'Bucket' in params ? params.Bucket : null;
        this.COSStatus = 'COSStatus' in params ? params.COSStatus : null;
        this.COSRecoverJobId = 'COSRecoverJobId' in params ? params.COSRecoverJobId : null;

    }
}

/**
 * SetInvoiceSubject返回参数结构体
 * @class
 */
class SetInvoiceSubjectResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeMonitorResource返回参数结构体
 * @class
 */
class DescribeMonitorResourceResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 配置信息
         * @type {Array.<MonitorResource> || null}
         */
        this.Data = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Data) {
            this.Data = new Array();
            for (let z in params.Data) {
                let obj = new MonitorResource();
                obj.deserialize(params.Data[z]);
                this.Data.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeEnvAccountCircle请求参数结构体
 * @class
 */
class DescribeEnvAccountCircleRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateDeal请求参数结构体
 * @class
 */
class CreateDealRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 订单类型。包含以下取值：
<li>1 ：购买询价</li>
<li>2 ：续费询价</li>
<li>3 ：变配询价</li>
         * @type {number || null}
         */
        this.DealType = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 用户客户端ip
         * @type {string || null}
         */
        this.UserClientIp = null;

        /**
         * tcb产品套餐ID，从DescribePackages接口的返回值中获取。
DealType传1、3时，此参数必传
         * @type {string || null}
         */
        this.PackageId = null;

        /**
         * 询价时长。DealType传1、2时，此参数必传
         * @type {number || null}
         */
        this.TimeSpan = null;

        /**
         * 时长单位，目前仅支持月：m。DealType传1、2时，此参数必传
         * @type {string || null}
         */
        this.TimeUnit = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 是否允许强制修改套餐。目前，如果仅有数据库读写次数指标超限, 依然允许用户进行强制降配
         * @type {boolean || null}
         */
        this.ForceToModify = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.DealType = 'DealType' in params ? params.DealType : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.UserClientIp = 'UserClientIp' in params ? params.UserClientIp : null;
        this.PackageId = 'PackageId' in params ? params.PackageId : null;
        this.TimeSpan = 'TimeSpan' in params ? params.TimeSpan : null;
        this.TimeUnit = 'TimeUnit' in params ? params.TimeUnit : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.ForceToModify = 'ForceToModify' in params ? params.ForceToModify : null;

    }
}

/**
 * DescribeStorageRecoverJob返回参数结构体
 * @class
 */
class DescribeStorageRecoverJobResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 任务状态：
Waiting:等待执行, Doing:执行中, Done:处理完成, Error:处理失败
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 错误信息（当Status=Error时有值）
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.ErrorMessage = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Status = 'Status' in params ? params.Status : null;
        this.ErrorMessage = 'ErrorMessage' in params ? params.ErrorMessage : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateCustomLoginKeys返回参数结构体
 * @class
 */
class CreateCustomLoginKeysResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 自定义签名私钥
         * @type {string || null}
         */
        this.PrivateKey = null;

        /**
         * 私钥id
         * @type {string || null}
         */
        this.KeyID = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PrivateKey = 'PrivateKey' in params ? params.PrivateKey : null;
        this.KeyID = 'KeyID' in params ? params.KeyID : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteMonitorPolicy返回参数结构体
 * @class
 */
class DeleteMonitorPolicyResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteMonitorCondition请求参数结构体
 * @class
 */
class DeleteMonitorConditionRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 策略ID
         * @type {number || null}
         */
        this.PolicyId = null;

        /**
         * 条件ID
         * @type {Array.<number> || null}
         */
        this.ConditionId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.PolicyId = 'PolicyId' in params ? params.PolicyId : null;
        this.ConditionId = 'ConditionId' in params ? params.ConditionId : null;

    }
}

/**
 * CreateAuthDomain返回参数结构体
 * @class
 */
class CreateAuthDomainResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * QueryDeals返回参数结构体
 * @class
 */
class QueryDealsResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 订单（账单）条目数
         * @type {number || null}
         */
        this.Total = null;

        /**
         * 数组类型，保存订单信息结构
         * @type {Array.<DealInfo> || null}
         */
        this.Deals = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Total = 'Total' in params ? params.Total : null;

        if (params.Deals) {
            this.Deals = new Array();
            for (let z in params.Deals) {
                let obj = new DealInfo();
                obj.deserialize(params.Deals[z]);
                this.Deals.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeEnvs请求参数结构体
 * @class
 */
class DescribeEnvsRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID，如果传了这个参数则只返回该环境的相关信息
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateStorageRecoverJob请求参数结构体
 * @class
 */
class CreateStorageRecoverJobRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateCollection请求参数结构体
 * @class
 */
class CreateCollectionRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * DatabaseMigrateImport返回参数结构体
 * @class
 */
class DatabaseMigrateImportResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 任务ID
         * @type {number || null}
         */
        this.JobId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.JobId = 'JobId' in params ? params.JobId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteMonitorCondition返回参数结构体
 * @class
 */
class DeleteMonitorConditionResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeStatData返回参数结构体
 * @class
 */
class DescribeStatDataResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境资源信息。包含以下取值：
<li> ResourceType：FileUploads(文件上传次数)  Unit：d(当天数据) </li>
<li> ResourceType：FileDownloads(文件下载次数)  Unit：d(当天数据) </li>
<li> ResourceType：FileFlux(CDN流量, 单位MB)  Unit：m(当月数据) </li>
<li> ResourceType：ActiveUsersDay(本日活跃用户数) </li>
<li> ResourceType：ActiveUsersWeek(本周活跃用户数) </li>
<li> ResourceType：ActiveUsersMonth(本月活跃用户数) </li>
<li> ResourceType： CloudFunctionUsage(云资源使用量, GB*S)  Unit：m(当月数据) </li>
<li> ResourceType：Flux(CDN回源流量, 单位MB)  Unit：m(当月数据) </li>
<li> ResourceType：DatabaseCapacity(数据库容量)  MB </li>
<li> ResourceType：StorageCapacity(存储容量)  MB</li>
<li> ResourceType：ApiCalls(API调用总数) Unit：d(当天数据) </li>
<li> ResourceType： DatabaseReads(数据库读次数)  Unit：d(当天数据) </li>
<li> ResourceType： DatabaseWrites(数据库写次数)  Unit： d(当天数据) </li>
<li> ResourceType： CloudApiCalls(云函数调用次数)  Unit： m(当月数据) </li>
         * @type {Array.<ResourcesInfo> || null}
         */
        this.Resources = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Resources) {
            this.Resources = new Array();
            for (let z in params.Resources) {
                let obj = new ResourcesInfo();
                obj.deserialize(params.Resources[z]);
                this.Resources.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * GetPolicyGroupInfo请求参数结构体
 * @class
 */
class GetPolicyGroupInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 策略组ID
         * @type {number || null}
         */
        this.GroupID = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.GroupID = 'GroupID' in params ? params.GroupID : null;

    }
}

/**
 * DeleteDocument返回参数结构体
 * @class
 */
class DeleteDocumentResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 删除的文档数量
         * @type {number || null}
         */
        this.DeletedCount = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.DeletedCount = 'DeletedCount' in params ? params.DeletedCount : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 资源恢复任务进度
 * @class
 */
class RecoverJobStatus extends  AbstractModel {
    constructor(){
        super();

        /**
         * 任务ID
         * @type {string || null}
         */
        this.JobId = null;

        /**
         * 任务状态：
Waiting:等待执行, Doing:执行中, Done:处理完成, Error:处理失败
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 错误信息（当Status=Error时有值）
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.ErrorMessage = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.JobId = 'JobId' in params ? params.JobId : null;
        this.Status = 'Status' in params ? params.Status : null;
        this.ErrorMessage = 'ErrorMessage' in params ? params.ErrorMessage : null;

    }
}

/**
 * 自定义策略
 * @class
 */
class MonitorPolicyInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 策略名称
         * @type {string || null}
         */
        this.Name = null;

        /**
         * 备注
         * @type {string || null}
         */
        this.Note = null;

        /**
         * 告警收敛周期
         * @type {number || null}
         */
        this.Convergence = null;

        /**
         * 策略ID
         * @type {number || null}
         */
        this.PolicyId = null;

        /**
         * 资源类型，如Function
         * @type {string || null}
         */
        this.ResType = null;

        /**
         * 资源名，如Function为AppId，CDN为域名
         * @type {string || null}
         */
        this.ResName = null;

        /**
         * 资源对象名，如Function为函数名，Database为collection名
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<string> || null}
         */
        this.Objects = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Name = 'Name' in params ? params.Name : null;
        this.Note = 'Note' in params ? params.Note : null;
        this.Convergence = 'Convergence' in params ? params.Convergence : null;
        this.PolicyId = 'PolicyId' in params ? params.PolicyId : null;
        this.ResType = 'ResType' in params ? params.ResType : null;
        this.ResName = 'ResName' in params ? params.ResName : null;
        this.Objects = 'Objects' in params ? params.Objects : null;

    }
}

/**
 * CreateCollection返回参数结构体
 * @class
 */
class CreateCollectionResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 操作结果
         * @type {string || null}
         */
        this.Result = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Result = 'Result' in params ? params.Result : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeEnvResourceException返回参数结构体
 * @class
 */
class DescribeEnvResourceExceptionResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 文件存储错误信息
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<StorageException> || null}
         */
        this.Storage = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Storage) {
            this.Storage = new Array();
            for (let z in params.Storage) {
                let obj = new StorageException();
                obj.deserialize(params.Storage[z]);
                this.Storage.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeWXMessageToken返回参数结构体
 * @class
 */
class DescribeWXMessageTokenResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * token
         * @type {string || null}
         */
        this.AccessToken = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.AccessToken = 'AccessToken' in params ? params.AccessToken : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ModifyMonitorPolicy请求参数结构体
 * @class
 */
class ModifyMonitorPolicyRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 策略ID
         * @type {number || null}
         */
        this.PolicyId = null;

        /**
         * 微信appID
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 策略名
         * @type {string || null}
         */
        this.Name = null;

        /**
         * 告警收敛周期
         * @type {number || null}
         */
        this.Convergence = null;

        /**
         * 备注
         * @type {string || null}
         */
        this.Note = null;

        /**
         * 资源类型，如Function
         * @type {string || null}
         */
        this.ResType = null;

        /**
         * 资源名，如Function的AppId，CDN的域名
         * @type {string || null}
         */
        this.ResName = null;

        /**
         * 资源对象名，如Function为函数名，Database为collection名
         * @type {Array.<string> || null}
         */
        this.Objects = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PolicyId = 'PolicyId' in params ? params.PolicyId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Name = 'Name' in params ? params.Name : null;
        this.Convergence = 'Convergence' in params ? params.Convergence : null;
        this.Note = 'Note' in params ? params.Note : null;
        this.ResType = 'ResType' in params ? params.ResType : null;
        this.ResName = 'ResName' in params ? params.ResName : null;
        this.Objects = 'Objects' in params ? params.Objects : null;

    }
}

/**
 * DescribeDocument返回参数结构体
 * @class
 */
class DescribeDocumentResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 偏移量
         * @type {number || null}
         */
        this.Offset = null;

        /**
         * 查询数量
         * @type {number || null}
         */
        this.Limit = null;

        /**
         * 数据总数
         * @type {number || null}
         */
        this.TotalCount = null;

        /**
         * 查询结果，json
         * @type {string || null}
         */
        this.DocumentList = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Offset = 'Offset' in params ? params.Offset : null;
        this.Limit = 'Limit' in params ? params.Limit : null;
        this.TotalCount = 'TotalCount' in params ? params.TotalCount : null;
        this.DocumentList = 'DocumentList' in params ? params.DocumentList : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeUsers返回参数结构体
 * @class
 */
class DescribeUsersResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境下的用户总数
         * @type {number || null}
         */
        this.Total = null;

        /**
         * 用户数据
         * @type {Array.<UserInfo> || null}
         */
        this.Users = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Total = 'Total' in params ? params.Total : null;

        if (params.Users) {
            this.Users = new Array();
            for (let z in params.Users) {
                let obj = new UserInfo();
                obj.deserialize(params.Users[z]);
                this.Users.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ModifyInvoicePostInfo返回参数结构体
 * @class
 */
class ModifyInvoicePostInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 代金券使用记录
 * @class
 */
class VoucherUseHistory extends  AbstractModel {
    constructor(){
        super();

        /**
         * 代金券编号
         * @type {string || null}
         */
        this.VoucherId = null;

        /**
         * 代金券本次使用金额
         * @type {number || null}
         */
        this.UsedAmount = null;

        /**
         * 代金券使用时间
         * @type {string || null}
         */
        this.UsedTime = null;

        /**
         * 代金券支付信息
         * @type {string || null}
         */
        this.PayInfo = null;

        /**
         * 代金券使用序列号
         * @type {string || null}
         */
        this.SeqId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.VoucherId = 'VoucherId' in params ? params.VoucherId : null;
        this.UsedAmount = 'UsedAmount' in params ? params.UsedAmount : null;
        this.UsedTime = 'UsedTime' in params ? params.UsedTime : null;
        this.PayInfo = 'PayInfo' in params ? params.PayInfo : null;
        this.SeqId = 'SeqId' in params ? params.SeqId : null;

    }
}

/**
 * 微信用户数据
 * @class
 */
class UserInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * openid
         * @type {string || null}
         */
        this.OpenId = null;

        /**
         * 是否授权
         * @type {boolean || null}
         */
        this.GrantUserInfo = null;

        /**
         * 昵称
         * @type {string || null}
         */
        this.NickName = null;

        /**
         * 国家
         * @type {string || null}
         */
        this.Country = null;

        /**
         * 省份
         * @type {string || null}
         */
        this.Province = null;

        /**
         * 城市
         * @type {string || null}
         */
        this.City = null;

        /**
         * 性别。包含以下取值：
<li> 1：男</li>
<li> 2：女</li>
<li> 0：未知</li>
         * @type {number || null}
         */
        this.Gender = null;

        /**
         * 语言
         * @type {string || null}
         */
        this.Language = null;

        /**
         * 头像
         * @type {string || null}
         */
        this.AvatarUrl = null;

        /**
         * 创建时间
         * @type {string || null}
         */
        this.CreateTime = null;

        /**
         * 修改时间
         * @type {string || null}
         */
        this.UpdateTime = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.OpenId = 'OpenId' in params ? params.OpenId : null;
        this.GrantUserInfo = 'GrantUserInfo' in params ? params.GrantUserInfo : null;
        this.NickName = 'NickName' in params ? params.NickName : null;
        this.Country = 'Country' in params ? params.Country : null;
        this.Province = 'Province' in params ? params.Province : null;
        this.City = 'City' in params ? params.City : null;
        this.Gender = 'Gender' in params ? params.Gender : null;
        this.Language = 'Language' in params ? params.Language : null;
        this.AvatarUrl = 'AvatarUrl' in params ? params.AvatarUrl : null;
        this.CreateTime = 'CreateTime' in params ? params.CreateTime : null;
        this.UpdateTime = 'UpdateTime' in params ? params.UpdateTime : null;

    }
}

/**
 * DescribeBillingInfo请求参数结构体
 * @class
 */
class DescribeBillingInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * UserGetInfo请求参数结构体
 * @class
 */
class UserGetInfoRequest extends  AbstractModel {
    constructor(){
        super();

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

    }
}

/**
 * DescribeEnvResourceException请求参数结构体
 * @class
 */
class DescribeEnvResourceExceptionRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * ModifyDatabaseACL返回参数结构体
 * @class
 */
class ModifyDatabaseACLResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateStorageRecoverJob返回参数结构体
 * @class
 */
class CreateStorageRecoverJobResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 任务ID
         * @type {string || null}
         */
        this.JobId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.JobId = 'JobId' in params ? params.JobId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ModifyDocument请求参数结构体
 * @class
 */
class ModifyDocumentRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 更新的文档数据（JSON）
         * @type {string || null}
         */
        this.Data = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 查询条件（JSON）
         * @type {string || null}
         */
        this.Query = null;

        /**
         * 是否批量操作. 默认为 false, 即只更新符合规则的第一条数据
         * @type {boolean || null}
         */
        this.IsMultiple = null;

        /**
         * 当数据不存在的时候是否创建数据. 默认为 false, 只在 multi 为 false 时生效
         * @type {boolean || null}
         */
        this.IsUpsert = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.Data = 'Data' in params ? params.Data : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Query = 'Query' in params ? params.Query : null;
        this.IsMultiple = 'IsMultiple' in params ? params.IsMultiple : null;
        this.IsUpsert = 'IsUpsert' in params ? params.IsUpsert : null;

    }
}

/**
 * InqueryPrice返回参数结构体
 * @class
 */
class InqueryPriceResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 套餐人民币价格，单位：元，退费时，返回为负值。
         * @type {number || null}
         */
        this.Price = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Price = 'Price' in params ? params.Price : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeUsers请求参数结构体
 * @class
 */
class DescribeUsersRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 搜索关键字，不传或为空则不搜索。支持 openId 和 微信昵称的模糊查询
         * @type {string || null}
         */
        this.Keyword = null;

        /**
         * 偏移量，默认为 0
         * @type {number || null}
         */
        this.Offset = null;

        /**
         * 每页限制条数，默认 20
         * @type {number || null}
         */
        this.Limit = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Keyword = 'Keyword' in params ? params.Keyword : null;
        this.Offset = 'Offset' in params ? params.Offset : null;
        this.Limit = 'Limit' in params ? params.Limit : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeVouchersUseHistory返回参数结构体
 * @class
 */
class DescribeVouchersUseHistoryResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 记录总条数
         * @type {number || null}
         */
        this.TotalCount = null;

        /**
         * 代金券使用记录列表
         * @type {Array.<VoucherUseHistory> || null}
         */
        this.VoucherUseHistoryList = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TotalCount = 'TotalCount' in params ? params.TotalCount : null;

        if (params.VoucherUseHistoryList) {
            this.VoucherUseHistoryList = new Array();
            for (let z in params.VoucherUseHistoryList) {
                let obj = new VoucherUseHistory();
                obj.deserialize(params.VoucherUseHistoryList[z]);
                this.VoucherUseHistoryList.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteAuthDomain返回参数结构体
 * @class
 */
class DeleteAuthDomainResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 删除的域名个数
         * @type {number || null}
         */
        this.Deleted = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Deleted = 'Deleted' in params ? params.Deleted : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * GetMonitorData返回参数结构体
 * @class
 */
class GetMonitorDataResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 起始时间
         * @type {string || null}
         */
        this.StartTime = null;

        /**
         * 结束时间
         * @type {string || null}
         */
        this.EndTime = null;

        /**
         * 指标名称
         * @type {string || null}
         */
        this.MetricName = null;

        /**
         * 监控统计周期
         * @type {number || null}
         */
        this.Period = null;

        /**
         * 监控数据
         * @type {DataPoints || null}
         */
        this.DataPoints = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.StartTime = 'StartTime' in params ? params.StartTime : null;
        this.EndTime = 'EndTime' in params ? params.EndTime : null;
        this.MetricName = 'MetricName' in params ? params.MetricName : null;
        this.Period = 'Period' in params ? params.Period : null;

        if (params.DataPoints) {
            let obj = new DataPoints();
            obj.deserialize(params.DataPoints)
            this.DataPoints = obj;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteDeal返回参数结构体
 * @class
 */
class DeleteDealResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * RevokeInvoice返回参数结构体
 * @class
 */
class RevokeInvoiceResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 环境信息
 * @class
 */
class EnvInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 账户下该环境唯一标识
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 环境来源。包含以下取值：
<li>miniapp：微信小程序</li>
<li>qcloud ：腾讯云</li>
         * @type {string || null}
         */
        this.Source = null;

        /**
         * 环境别名，要以a-z开头，不能包含 a-zA-z0-9- 以外的字符
         * @type {string || null}
         */
        this.Alias = null;

        /**
         * 创建时间
         * @type {string || null}
         */
        this.CreateTime = null;

        /**
         * 最后修改时间
         * @type {string || null}
         */
        this.UpdateTime = null;

        /**
         * 环境状态。包含以下取值：
<li>NORMAL：正常可用</li>
<li>UNAVAILABLE：服务不可用，可能是尚未初始化或者初始化过程中</li>
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 数据库列表
         * @type {Array.<DatabasesInfo> || null}
         */
        this.Databases = null;

        /**
         * 存储列表
         * @type {Array.<StorageInfo> || null}
         */
        this.Storages = null;

        /**
         * 函数列表
         * @type {Array.<FunctionInfo> || null}
         */
        this.Functions = null;

        /**
         * tcb产品套餐ID，参考DescribePackages接口的返回值。
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.PackageId = null;

        /**
         * 套餐中文名称，参考DescribePackages接口的返回值。
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.PackageName = null;

        /**
         * 云日志服务列表
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<LogServiceInfo> || null}
         */
        this.LogServices = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Source = 'Source' in params ? params.Source : null;
        this.Alias = 'Alias' in params ? params.Alias : null;
        this.CreateTime = 'CreateTime' in params ? params.CreateTime : null;
        this.UpdateTime = 'UpdateTime' in params ? params.UpdateTime : null;
        this.Status = 'Status' in params ? params.Status : null;

        if (params.Databases) {
            this.Databases = new Array();
            for (let z in params.Databases) {
                let obj = new DatabasesInfo();
                obj.deserialize(params.Databases[z]);
                this.Databases.push(obj);
            }
        }

        if (params.Storages) {
            this.Storages = new Array();
            for (let z in params.Storages) {
                let obj = new StorageInfo();
                obj.deserialize(params.Storages[z]);
                this.Storages.push(obj);
            }
        }

        if (params.Functions) {
            this.Functions = new Array();
            for (let z in params.Functions) {
                let obj = new FunctionInfo();
                obj.deserialize(params.Functions[z]);
                this.Functions.push(obj);
            }
        }
        this.PackageId = 'PackageId' in params ? params.PackageId : null;
        this.PackageName = 'PackageName' in params ? params.PackageName : null;

        if (params.LogServices) {
            this.LogServices = new Array();
            for (let z in params.LogServices) {
                let obj = new LogServiceInfo();
                obj.deserialize(params.LogServices[z]);
                this.LogServices.push(obj);
            }
        }

    }
}

/**
 * GetDownloadUrls-文件下载链接resp对象
 * @class
 */
class FileDownloadRespInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 文件id
         * @type {string || null}
         */
        this.FileId = null;

        /**
         * 访问链接
         * @type {string || null}
         */
        this.DownloadUrl = null;

        /**
         * 错误码，成功为SUCCESS
         * @type {string || null}
         */
        this.Code = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.FileId = 'FileId' in params ? params.FileId : null;
        this.DownloadUrl = 'DownloadUrl' in params ? params.DownloadUrl : null;
        this.Code = 'Code' in params ? params.Code : null;

    }
}

/**
 * DescribeAuthentification请求参数结构体
 * @class
 */
class DescribeAuthentificationRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeAuthentification返回参数结构体
 * @class
 */
class DescribeAuthentificationResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 实名认证类型：
PERSONAL : 个人认证
ENTERPRISE：企业认证
         * @type {string || null}
         */
        this.AuthentificationType = null;

        /**
         * 实名认证名称：
企业认证，则返回明文。
个人认证，则返回打码后的姓名。
         * @type {string || null}
         */
        this.AuthentificationName = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.AuthentificationType = 'AuthentificationType' in params ? params.AuthentificationType : null;
        this.AuthentificationName = 'AuthentificationName' in params ? params.AuthentificationName : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteFiles请求参数结构体
 * @class
 */
class DeleteFilesRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 文件唯一id列表
         * @type {Array.<string> || null}
         */
        this.FileIds = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.FileIds = 'FileIds' in params ? params.FileIds : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * 环境计费信息
 * @class
 */
class EnvBillingInfoItem extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * tcb产品套餐ID，参考DescribePackages接口的返回值。
         * @type {string || null}
         */
        this.PackageId = null;

        /**
         * 自动续费标记
         * @type {boolean || null}
         */
        this.IsAutoRenew = null;

        /**
         * 状态。包含以下取值：
<li> NORMAL：正常</li>
<li> ISOLATE：隔离</li>
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 支付方式。包含以下取值：
<li> PREPAYMENT：预付费</li>
<li> POSTPAID：后付费</li>
         * @type {string || null}
         */
        this.PayMode = null;

        /**
         * 隔离时间，最近一次隔离的时间
         * @type {string || null}
         */
        this.IsolatedTime = null;

        /**
         * 过期时间，套餐即将到期的时间
         * @type {string || null}
         */
        this.ExpireTime = null;

        /**
         * 创建时间，第一次接入计费方案的时间。
         * @type {string || null}
         */
        this.CreateTime = null;

        /**
         * 更新时间，计费信息最近一次更新的时间。
         * @type {string || null}
         */
        this.UpdateTime = null;

        /**
         * true表示从未升级过付费版。
         * @type {boolean || null}
         */
        this.IsAlwaysFree = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.PackageId = 'PackageId' in params ? params.PackageId : null;
        this.IsAutoRenew = 'IsAutoRenew' in params ? params.IsAutoRenew : null;
        this.Status = 'Status' in params ? params.Status : null;
        this.PayMode = 'PayMode' in params ? params.PayMode : null;
        this.IsolatedTime = 'IsolatedTime' in params ? params.IsolatedTime : null;
        this.ExpireTime = 'ExpireTime' in params ? params.ExpireTime : null;
        this.CreateTime = 'CreateTime' in params ? params.CreateTime : null;
        this.UpdateTime = 'UpdateTime' in params ? params.UpdateTime : null;
        this.IsAlwaysFree = 'IsAlwaysFree' in params ? params.IsAlwaysFree : null;

    }
}

/**
 * DescribeEnvs返回参数结构体
 * @class
 */
class DescribeEnvsResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境信息列表
         * @type {Array.<EnvInfo> || null}
         */
        this.EnvList = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.EnvList) {
            this.EnvList = new Array();
            for (let z in params.EnvList) {
                let obj = new EnvInfo();
                obj.deserialize(params.EnvList[z]);
                this.EnvList.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CancelDeal返回参数结构体
 * @class
 */
class CancelDealResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeDocument请求参数结构体
 * @class
 */
class DescribeDocumentRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 查询条件（json）
         * @type {string || null}
         */
        this.Query = null;

        /**
         * 偏移量
         * @type {number || null}
         */
        this.Offset = null;

        /**
         * 查询数量. 默认为 20
         * @type {number || null}
         */
        this.Limit = null;

        /**
         * 排序规则. 可包含多个排序字段, 优先级依次降低（json数组）
         * @type {Array.<string> || null}
         */
        this.Order = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Query = 'Query' in params ? params.Query : null;
        this.Offset = 'Offset' in params ? params.Offset : null;
        this.Limit = 'Limit' in params ? params.Limit : null;
        this.Order = 'Order' in params ? params.Order : null;

    }
}

/**
 * CreateAuthDomain请求参数结构体
 * @class
 */
class CreateAuthDomainRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 开发者的环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 域名数据
         * @type {Array.<string> || null}
         */
        this.Domains = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Domains = 'Domains' in params ? params.Domains : null;

    }
}

/**
 * DescribeMonitorResource请求参数结构体
 * @class
 */
class DescribeMonitorResourceRequest extends  AbstractModel {
    constructor(){
        super();

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

    }
}

/**
 * DescribeVouchersInfoByDeal返回参数结构体
 * @class
 */
class DescribeVouchersInfoByDealResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 代金券列表
         * @type {Array.<Volucher> || null}
         */
        this.Vouchers = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Vouchers) {
            this.Vouchers = new Array();
            for (let z in params.Vouchers) {
                let obj = new Volucher();
                obj.deserialize(params.Vouchers[z]);
                this.Vouchers.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 资源恢复结果
 * @class
 */
class RecoverResult extends  AbstractModel {
    constructor(){
        super();

        /**
         * 处理结果：
Success : 成功
Fail: 失败
Async: 异步处理
         * @type {string || null}
         */
        this.Result = null;

        /**
         * 当 Result=Fail 时有值，表示失败原因
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.ErrorMessage = null;

        /**
         * 当 Result=Async 是有值，表示异步任务ID
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.RecoverJobId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Result = 'Result' in params ? params.Result : null;
        this.ErrorMessage = 'ErrorMessage' in params ? params.ErrorMessage : null;
        this.RecoverJobId = 'RecoverJobId' in params ? params.RecoverJobId : null;

    }
}

/**
 * UpdateLoginConfig请求参数结构体
 * @class
 */
class UpdateLoginConfigRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 开发者的环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 配置的记录ID
         * @type {string || null}
         */
        this.ConfigId = null;

        /**
         * 第三方平台的 AppID
         * @type {string || null}
         */
        this.PlatformId = null;

        /**
         * 第三方平台的 AppSecret
         * @type {string || null}
         */
        this.PlatformSecret = null;

        /**
         * ”ENABLE”, “DISABLE”
         * @type {string || null}
         */
        this.Status = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.ConfigId = 'ConfigId' in params ? params.ConfigId : null;
        this.PlatformId = 'PlatformId' in params ? params.PlatformId : null;
        this.PlatformSecret = 'PlatformSecret' in params ? params.PlatformSecret : null;
        this.Status = 'Status' in params ? params.Status : null;

    }
}

/**
 * ModifyStorageACL返回参数结构体
 * @class
 */
class ModifyStorageACLResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateEnvAndResource请求参数结构体
 * @class
 */
class CreateEnvAndResourceRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID。1~32个字符，只能包含小写字母、数字和减号，不能以减号开头和结尾。
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 环境别名。要以a-z开头，不能包含 a-zA-z0-9- 以外的字符，最大32个字符。
         * @type {string || null}
         */
        this.Alias = null;

        /**
         * 微信AppId，微信必传。
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 来源，微信填写miniapp，腾讯云控制台填写qcloud
         * @type {string || null}
         */
        this.Source = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Alias = 'Alias' in params ? params.Alias : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.Source = 'Source' in params ? params.Source : null;

    }
}

/**
 * DescribeAccountInfo返回参数结构体
 * @class
 */
class DescribeAccountInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 云的uin
         * @type {string || null}
         */
        this.Uin = null;

        /**
         * 云的appId
         * @type {string || null}
         */
        this.AppId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Uin = 'Uin' in params ? params.Uin : null;
        this.AppId = 'AppId' in params ? params.AppId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DatabaseMigrateExport请求参数结构体
 * @class
 */
class DatabaseMigrateExportRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 导出到cos的文件路径，长度不超过512字节
         * @type {string || null}
         */
        this.FilePath = null;

        /**
         * 文件类型。包含以下取值：
<li> json </li>
<li> csv </li>
         * @type {string || null}
         */
        this.FileType = null;

        /**
         * JSON字符串，支持mongo指令。例如：'{ a: { $gte: 3 } }'
         * @type {string || null}
         */
        this.Query = null;

        /**
         * 字符串，字段以逗号分割。FileType=csv时必填
         * @type {string || null}
         */
        this.Fields = null;

        /**
         * 偏移量
         * @type {number || null}
         */
        this.Skip = null;

        /**
         * 限制数目
         * @type {number || null}
         */
        this.Limit = null;

        /**
         * JSON 字符串，如果有索引则不支持排序，数据集的长度必须少于32兆
         * @type {string || null}
         */
        this.Sort = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.FilePath = 'FilePath' in params ? params.FilePath : null;
        this.FileType = 'FileType' in params ? params.FileType : null;
        this.Query = 'Query' in params ? params.Query : null;
        this.Fields = 'Fields' in params ? params.Fields : null;
        this.Skip = 'Skip' in params ? params.Skip : null;
        this.Limit = 'Limit' in params ? params.Limit : null;
        this.Sort = 'Sort' in params ? params.Sort : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CheckEnvId返回参数结构体
 * @class
 */
class CheckEnvIdResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 该环境名称是否被占用，true被占用则不能用于创建环境
         * @type {boolean || null}
         */
        this.Exist = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Exist = 'Exist' in params ? params.Exist : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeInvoiceDetail请求参数结构体
 * @class
 */
class DescribeInvoiceDetailRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 发票ID
         * @type {string || null}
         */
        this.InvoiceId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.InvoiceId = 'InvoiceId' in params ? params.InvoiceId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateDocument请求参数结构体
 * @class
 */
class CreateDocumentRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 添加的文档（格式为JSON字符串）
         * @type {string || null}
         */
        this.Data = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.Data = 'Data' in params ? params.Data : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * DescribeMonitorData请求参数结构体
 * @class
 */
class DescribeMonitorDataRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 指标名。包含以下取值：
<li> ApiRequests：全部接口调用次数</li>
<li> ApiDbRead：读数据库接口调用次数</li>
<li> ApiDbWrite：写数据库接口调用次数</li>
<li> ApiStorageWrite：存储上传接口调用次数</li>
<li> ApiStorageRead：存储下载接口调用次数</li>
<li> ApiFunctionRequests：云函数接口调用次数</li>
<li> CdnTcbFlux：CDN流量。单位：字节</li>
<li> FunctionMemDuration：指定云函数资源使用情况。单位：MBms </li>
<li> FunctionInvocation：指定云函数的调用次数</li>
<li> FunctionDuration：指定函云数的运行时间。单位：ms </li>
<li> FunctionError：指定与函数错误次数</li>
<li> FunctionMemDurationOverall：云函数资源总体使用情况。单位：MBms </li>
         * @type {string || null}
         */
        this.MetricName = null;

        /**
         * 开始时间，如2018-08-24 10:50:00, 开始时间需要早于结束时间至少五分钟(原因是因为目前统计粒度最小是5分钟).
         * @type {string || null}
         */
        this.StartTime = null;

        /**
         * 结束时间，如2018-08-24 10:50:00, 结束时间需要晚于开始时间至少五分钟(原因是因为目前统计粒度最小是5分钟)..
         * @type {string || null}
         */
        this.EndTime = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 资源ID(资源ID在环境详情中获取)。包含以下取值：
<li> CdnTcbFlux：需传入域名</li>
<li> FunctionMemDuration：需传入namespace </li>
<li> FunctionInvocation：需传入namespace </li>
<li> FunctionDuration：需传入namespace </li>
<li> FunctionError：需传入namespace </li>
<li> FunctionMemDurationOverall：需传入namespace </li>
         * @type {string || null}
         */
        this.ResourceID = null;

        /**
         * 子资源ID(子资源ID在环境详情中获取)。包含以下取值：
<li> FunctionMemDuration：需传入函数名</li>
<li> FunctionInvocation：需传入函数名</li>
<li> FunctionDuration：需传入函数名</li>
<li> FunctionError：需传入函数名</li>
         * @type {string || null}
         */
        this.SubresourceID = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.MetricName = 'MetricName' in params ? params.MetricName : null;
        this.StartTime = 'StartTime' in params ? params.StartTime : null;
        this.EndTime = 'EndTime' in params ? params.EndTime : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.ResourceID = 'ResourceID' in params ? params.ResourceID : null;
        this.SubresourceID = 'SubresourceID' in params ? params.SubresourceID : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeEndUsers请求参数结构体
 * @class
 */
class DescribeEndUsersRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 开发者的环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 可选参数，偏移量，默认 0
         * @type {number || null}
         */
        this.Offset = null;

        /**
         * 可选参数，拉取数量，默认 20
         * @type {number || null}
         */
        this.Limit = null;

        /**
         * 可选参数，支持按照 uuid 列表过滤
         * @type {Array.<string> || null}
         */
        this.UUIds = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Offset = 'Offset' in params ? params.Offset : null;
        this.Limit = 'Limit' in params ? params.Limit : null;
        this.UUIds = 'UUIds' in params ? params.UUIds : null;

    }
}

/**
 * DescribeInvoiceAmount请求参数结构体
 * @class
 */
class DescribeInvoiceAmountRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * ModifyMonitorCondition返回参数结构体
 * @class
 */
class ModifyMonitorConditionResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeInvoiceList返回参数结构体
 * @class
 */
class DescribeInvoiceListResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 发票总数
         * @type {number || null}
         */
        this.Total = null;

        /**
         * 发票列表
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<InvoiceBasicInfo> || null}
         */
        this.InvoiceList = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Total = 'Total' in params ? params.Total : null;

        if (params.InvoiceList) {
            this.InvoiceList = new Array();
            for (let z in params.InvoiceList) {
                let obj = new InvoiceBasicInfo();
                obj.deserialize(params.InvoiceList[z]);
                this.InvoiceList.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeSafeRule返回参数结构体
 * @class
 */
class DescribeSafeRuleResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 规则内容
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.Rule = null;

        /**
         * 权限标签。包含以下取值：
<li> READONLY：所有用户可读，仅创建者和管理员可写</li>
<li> PRIVATE：仅创建者及管理员可读写</li>
<li> ADMINWRITE：所有用户可读，仅管理员可写</li>
<li> ADMINONLY：仅管理员可读写</li>
<li> CUSTOM：自定义安全规则</li>
         * @type {string || null}
         */
        this.AclTag = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Rule = 'Rule' in params ? params.Rule : null;
        this.AclTag = 'AclTag' in params ? params.AclTag : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeDowngradeInfo返回参数结构体
 * @class
 */
class DescribeDowngradeInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 最大降配次数限制
         * @type {number || null}
         */
        this.MaxLimit = null;

        /**
         * 已消耗的降配次数
         * @type {number || null}
         */
        this.Usage = null;

        /**
         * 当前是否有降配次数、是否允许降配
         * @type {boolean || null}
         */
        this.IsAllow = null;

        /**
         * 降配信息更新时间
         * @type {string || null}
         */
        this.UpdateTime = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.MaxLimit = 'MaxLimit' in params ? params.MaxLimit : null;
        this.Usage = 'Usage' in params ? params.Usage : null;
        this.IsAllow = 'IsAllow' in params ? params.IsAllow : null;
        this.UpdateTime = 'UpdateTime' in params ? params.UpdateTime : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CancelDeal请求参数结构体
 * @class
 */
class CancelDealRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 订单号，tcb订单唯一标识。只能取消未支付的订单
         * @type {string || null}
         */
        this.TranId = null;

        /**
         * 用户客户端ip
         * @type {string || null}
         */
        this.UserClientIp = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TranId = 'TranId' in params ? params.TranId : null;
        this.UserClientIp = 'UserClientIp' in params ? params.UserClientIp : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeMonitorData返回参数结构体
 * @class
 */
class DescribeMonitorDataResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 开始时间, 会根据数据的统计周期进行取整.
         * @type {string || null}
         */
        this.StartTime = null;

        /**
         * 结束时间, 会根据数据的统计周期进行取整.
         * @type {string || null}
         */
        this.EndTime = null;

        /**
         * 指标名
         * @type {string || null}
         */
        this.MetricName = null;

        /**
         * 统计周期(单位：秒)。包含以下取值：
<li>当时间区间为1天内, 统计周期为5分钟</li>
<li>当时间区间选择为1天以上, 15天以下, 统计周期为1小时</li>
<li>当时间区间选择为15天以上, 180天以下, 统计周期为1天</li>
         * @type {number || null}
         */
        this.Period = null;

        /**
         * 监控数据
         * @type {Array.<number> || null}
         */
        this.Values = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.StartTime = 'StartTime' in params ? params.StartTime : null;
        this.EndTime = 'EndTime' in params ? params.EndTime : null;
        this.MetricName = 'MetricName' in params ? params.MetricName : null;
        this.Period = 'Period' in params ? params.Period : null;
        this.Values = 'Values' in params ? params.Values : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 存储用量
 * @class
 */
class StorageLimit extends  AbstractModel {
    constructor(){
        super();

        /**
         * 存储的容量，单位 MB
         * @type {number || null}
         */
        this.CapacityLimit = null;

        /**
         * 下载次数，次数/每天，d是每天
         * @type {LimitInfo || null}
         */
        this.DownloadLimit = null;

        /**
         * 上传次数限制，次数/每天，d是每天
         * @type {LimitInfo || null}
         */
        this.UploadLimit = null;

        /**
         * cdn 回源流量限制，单位 MB，m是每月
         * @type {LimitInfo || null}
         */
        this.CdnOriginFlowLimit = null;

        /**
         * cdn 流量限制，单位 MB，m是每月
         * @type {LimitInfo || null}
         */
        this.CdnFlowLimit = null;

        /**
         * 上传次数限制，次数/每月，m是每月
         * @type {LimitInfo || null}
         */
        this.UploadLimitMonthly = null;

        /**
         * 下载次数，次数/每月，m是每月
         * @type {LimitInfo || null}
         */
        this.DownloadLimitMonthly = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.CapacityLimit = 'CapacityLimit' in params ? params.CapacityLimit : null;

        if (params.DownloadLimit) {
            let obj = new LimitInfo();
            obj.deserialize(params.DownloadLimit)
            this.DownloadLimit = obj;
        }

        if (params.UploadLimit) {
            let obj = new LimitInfo();
            obj.deserialize(params.UploadLimit)
            this.UploadLimit = obj;
        }

        if (params.CdnOriginFlowLimit) {
            let obj = new LimitInfo();
            obj.deserialize(params.CdnOriginFlowLimit)
            this.CdnOriginFlowLimit = obj;
        }

        if (params.CdnFlowLimit) {
            let obj = new LimitInfo();
            obj.deserialize(params.CdnFlowLimit)
            this.CdnFlowLimit = obj;
        }

        if (params.UploadLimitMonthly) {
            let obj = new LimitInfo();
            obj.deserialize(params.UploadLimitMonthly)
            this.UploadLimitMonthly = obj;
        }

        if (params.DownloadLimitMonthly) {
            let obj = new LimitInfo();
            obj.deserialize(params.DownloadLimitMonthly)
            this.DownloadLimitMonthly = obj;
        }

    }
}

/**
 * DescribeInvoiceDetail返回参数结构体
 * @class
 */
class DescribeInvoiceDetailResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 发票金额（单位：元，人民币）
         * @type {number || null}
         */
        this.Amount = null;

        /**
         * 发票物理号
         * @type {string || null}
         */
        this.InvoiceNumber = null;

        /**
         * 发票类型：
Personal 个人-普通发票
CompanyVAT 公司-增值税普通发票
CompanyVATSpecial 公司-增值税专用发票
Organization 组织-增值税普通发票
         * @type {string || null}
         */
        this.UserType = null;

        /**
         * 发票抬头
         * @type {string || null}
         */
        this.InvoiceHead = null;

        /**
         * 增值税普通发票信息（UserType=CompanyVAT时该字段有值）
注意：此字段可能返回 null，表示取不到有效值。
         * @type {InvoiceVATGeneral || null}
         */
        this.VATGeneral = null;

        /**
         * 增值税专用发票信息（UserType=CompanyVATSpecial时有值）
注意：此字段可能返回 null，表示取不到有效值。
         * @type {InvoiceVATSpecial || null}
         */
        this.VATSpecial = null;

        /**
         * 邮寄信息
         * @type {InvoicePostInfo || null}
         */
        this.PostInfo = null;

        /**
         * 发票状态：
PROCESSING 处理中
INVOICED      已开票
MAILED          已邮寄
OBSOLETED   已作废
INVOICING    开票中
CANCELED     已取消
VIRTUAL         虚拟发票
OBSOLETING  作废中
MAIL_SIGNED 邮件已签收
REFUND_WAIT 退票待处理
REFUND_DENY 退票驳回
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 快递公司
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.PostCompany = null;

        /**
         * 快递单号
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.PostNumber = null;

        /**
         * 开票时间
         * @type {string || null}
         */
        this.InvoiceTime = null;

        /**
         * 发票备注
         * @type {string || null}
         */
        this.Remark = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Amount = 'Amount' in params ? params.Amount : null;
        this.InvoiceNumber = 'InvoiceNumber' in params ? params.InvoiceNumber : null;
        this.UserType = 'UserType' in params ? params.UserType : null;
        this.InvoiceHead = 'InvoiceHead' in params ? params.InvoiceHead : null;

        if (params.VATGeneral) {
            let obj = new InvoiceVATGeneral();
            obj.deserialize(params.VATGeneral)
            this.VATGeneral = obj;
        }

        if (params.VATSpecial) {
            let obj = new InvoiceVATSpecial();
            obj.deserialize(params.VATSpecial)
            this.VATSpecial = obj;
        }

        if (params.PostInfo) {
            let obj = new InvoicePostInfo();
            obj.deserialize(params.PostInfo)
            this.PostInfo = obj;
        }
        this.Status = 'Status' in params ? params.Status : null;
        this.PostCompany = 'PostCompany' in params ? params.PostCompany : null;
        this.PostNumber = 'PostNumber' in params ? params.PostNumber : null;
        this.InvoiceTime = 'InvoiceTime' in params ? params.InvoiceTime : null;
        this.Remark = 'Remark' in params ? params.Remark : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateMonitorPolicy返回参数结构体
 * @class
 */
class CreateMonitorPolicyResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 策略ID
         * @type {number || null}
         */
        this.Id = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Id = 'Id' in params ? params.Id : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeEnvAccountCircle返回参数结构体
 * @class
 */
class DescribeEnvAccountCircleResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境计费周期开始时间
         * @type {string || null}
         */
        this.StartTime = null;

        /**
         * 环境计费周期结束时间
         * @type {string || null}
         */
        this.EndTime = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.StartTime = 'StartTime' in params ? params.StartTime : null;
        this.EndTime = 'EndTime' in params ? params.EndTime : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ModifyDocument返回参数结构体
 * @class
 */
class ModifyDocumentResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 成功更新的文档数量
         * @type {number || null}
         */
        this.UpdatedCount = null;

        /**
         * IsUpsert 为 true 时, 为添加的文档 _id，否则为空
         * @type {string || null}
         */
        this.UpsertedId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.UpdatedCount = 'UpdatedCount' in params ? params.UpdatedCount : null;
        this.UpsertedId = 'UpsertedId' in params ? params.UpsertedId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ModifyInvoicePostInfo请求参数结构体
 * @class
 */
class ModifyInvoicePostInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 邮寄地址ID
         * @type {string || null}
         */
        this.PostId = null;

        /**
         * 联系人
         * @type {string || null}
         */
        this.Contact = null;

        /**
         * 省份
         * @type {string || null}
         */
        this.Province = null;

        /**
         * 城市
         * @type {string || null}
         */
        this.City = null;

        /**
         * 详细地址
         * @type {string || null}
         */
        this.Address = null;

        /**
         * 邮政编码
         * @type {string || null}
         */
        this.PostalCode = null;

        /**
         * 手机号码或座机号码
         * @type {string || null}
         */
        this.Cellphone = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PostId = 'PostId' in params ? params.PostId : null;
        this.Contact = 'Contact' in params ? params.Contact : null;
        this.Province = 'Province' in params ? params.Province : null;
        this.City = 'City' in params ? params.City : null;
        this.Address = 'Address' in params ? params.Address : null;
        this.PostalCode = 'PostalCode' in params ? params.PostalCode : null;
        this.Cellphone = 'Cellphone' in params ? params.Cellphone : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateCloudUser请求参数结构体
 * @class
 */
class CreateCloudUserRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信AppId。wxd8xxxxxx
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 微信账号名称。gh_xxxxxxxx
         * @type {string || null}
         */
        this.WxUserName = null;

        /**
         * 微信账号昵称
         * @type {string || null}
         */
        this.WxNickName = null;

        /**
         * 邮箱地址
         * @type {string || null}
         */
        this.Email = null;

        /**
         * 手机号
         * @type {string || null}
         */
        this.Phone = null;

        /**
         * 国际电话区号，如 86
         * @type {string || null}
         */
        this.CountryCode = null;

        /**
         * 主体类型。包含以下取值：
<li> PERSONAL：个人</li>
<li> ENTERPRISE：企业</li>
         * @type {string || null}
         */
        this.SubjectType = null;

        /**
         * 主体证件号码。个人身份证，企业社会信用代码
         * @type {string || null}
         */
        this.SubjectId = null;

        /**
         * 主体名称。个人姓名，企业单位名称
         * @type {string || null}
         */
        this.SubjectName = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.WxUserName = 'WxUserName' in params ? params.WxUserName : null;
        this.WxNickName = 'WxNickName' in params ? params.WxNickName : null;
        this.Email = 'Email' in params ? params.Email : null;
        this.Phone = 'Phone' in params ? params.Phone : null;
        this.CountryCode = 'CountryCode' in params ? params.CountryCode : null;
        this.SubjectType = 'SubjectType' in params ? params.SubjectType : null;
        this.SubjectId = 'SubjectId' in params ? params.SubjectId : null;
        this.SubjectName = 'SubjectName' in params ? params.SubjectName : null;

    }
}

/**
 * GetUploadFileUrl返回参数结构体
 * @class
 */
class GetUploadFileUrlResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 文件上传的目标链接
         * @type {string || null}
         */
        this.UploadUrl = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.UploadUrl = 'UploadUrl' in params ? params.UploadUrl : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeDowngradeInfo请求参数结构体
 * @class
 */
class DescribeDowngradeInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateInvoice请求参数结构体
 * @class
 */
class CreateInvoiceRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 邮寄地址ID
         * @type {string || null}
         */
        this.PostId = null;

        /**
         * 开票金额（单位：元，人民币）
         * @type {number || null}
         */
        this.Amount = null;

        /**
         * 发票备注
         * @type {string || null}
         */
        this.Remark = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PostId = 'PostId' in params ? params.PostId : null;
        this.Amount = 'Amount' in params ? params.Amount : null;
        this.Remark = 'Remark' in params ? params.Remark : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeInvoiceList请求参数结构体
 * @class
 */
class DescribeInvoiceListRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 查询起始时间
         * @type {string || null}
         */
        this.StartTime = null;

        /**
         * 查询结束时间
         * @type {string || null}
         */
        this.EndTime = null;

        /**
         * 分页，每页条数，默认 20
         * @type {number || null}
         */
        this.Limit = null;

        /**
         * 分页，便宜值，默认0
         * @type {number || null}
         */
        this.Offset = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.StartTime = 'StartTime' in params ? params.StartTime : null;
        this.EndTime = 'EndTime' in params ? params.EndTime : null;
        this.Limit = 'Limit' in params ? params.Limit : null;
        this.Offset = 'Offset' in params ? params.Offset : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeStorageACL返回参数结构体
 * @class
 */
class DescribeStorageACLResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 权限标签。包含以下取值：
<li> READONLY：所有用户可读，仅创建者和管理员可写</li>
<li> PRIVATE：仅创建者及管理员可读写</li>
<li> ADMINWRITE：所有用户可读，仅管理员可写</li>
<li> ADMINONLY：仅管理员可读写</li>
         * @type {string || null}
         */
        this.AclTag = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.AclTag = 'AclTag' in params ? params.AclTag : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 数据库资源信息
 * @class
 */
class DatabasesInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 数据库唯一标识
         * @type {string || null}
         */
        this.InstanceId = null;

        /**
         * 状态。包含以下取值：
<li>INITIALIZING：资源初始化中</li>
<li>RUNNING：运行中，可正常使用的状态</li>
<li>UNUSABLE：禁用，不可用</li>
<li>OVERDUE：资源过期</li>
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 所属地域。
当前支持ap-shanghai
         * @type {string || null}
         */
        this.Region = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.InstanceId = 'InstanceId' in params ? params.InstanceId : null;
        this.Status = 'Status' in params ? params.Status : null;
        this.Region = 'Region' in params ? params.Region : null;

    }
}

/**
 * DescribeEnvsForWx返回参数结构体
 * @class
 */
class DescribeEnvsForWxResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境信息列表
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<EnvInfo> || null}
         */
        this.EnvList = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.EnvList) {
            this.EnvList = new Array();
            for (let z in params.EnvList) {
                let obj = new EnvInfo();
                obj.deserialize(params.EnvList[z]);
                this.EnvList.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteFiles返回参数结构体
 * @class
 */
class DeleteFilesResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 删除文件结果
         * @type {Array.<FileDeleteInfo> || null}
         */
        this.DeletedFileSet = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.DeletedFileSet) {
            this.DeletedFileSet = new Array();
            for (let z in params.DeletedFileSet) {
                let obj = new FileDeleteInfo();
                obj.deserialize(params.DeletedFileSet[z]);
                this.DeletedFileSet.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * UnBindingPolicyObject返回参数结构体
 * @class
 */
class UnBindingPolicyObjectResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeDatabaseACL请求参数结构体
 * @class
 */
class DescribeDatabaseACLRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * 公司增值税专用发票开票信息
 * @class
 */
class InvoiceVATSpecial extends  AbstractModel {
    constructor(){
        super();

        /**
         * 纳税人识别号（请填写15到20位有效税务登记证号或三证合一后的社会统一信用代码）
         * @type {string || null}
         */
        this.TaxPayerNumber = null;

        /**
         * 开户行
         * @type {string || null}
         */
        this.BankDeposit = null;

        /**
         * 银行账号
         * @type {string || null}
         */
        this.BankAccount = null;

        /**
         * 注册场所地址：请填写税务登记证上的地址或经营场所地址
         * @type {string || null}
         */
        this.RegisterAddress = null;

        /**
         * 注册固定电话
         * @type {string || null}
         */
        this.RegisterPhone = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TaxPayerNumber = 'TaxPayerNumber' in params ? params.TaxPayerNumber : null;
        this.BankDeposit = 'BankDeposit' in params ? params.BankDeposit : null;
        this.BankAccount = 'BankAccount' in params ? params.BankAccount : null;
        this.RegisterAddress = 'RegisterAddress' in params ? params.RegisterAddress : null;
        this.RegisterPhone = 'RegisterPhone' in params ? params.RegisterPhone : null;

    }
}

/**
 * CheckEnvId请求参数结构体
 * @class
 */
class CheckEnvIdRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * InvokeAI请求参数结构体
 * @class
 */
class InvokeAIRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 公共参数
         * @type {CommParam || null}
         */
        this.CommParam = null;

        /**
         * AI服务参数
         * @type {string || null}
         */
        this.Param = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.CommParam) {
            let obj = new CommParam();
            obj.deserialize(params.CommParam)
            this.CommParam = obj;
        }
        this.Param = 'Param' in params ? params.Param : null;

    }
}

/**
 * AddLoginManner返回参数结构体
 * @class
 */
class AddLoginMannerResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 函数的信息
 * @class
 */
class FunctionInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 命名空间
         * @type {string || null}
         */
        this.Namespace = null;

        /**
         * 所属地域。
当前支持ap-shanghai
         * @type {string || null}
         */
        this.Region = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Namespace = 'Namespace' in params ? params.Namespace : null;
        this.Region = 'Region' in params ? params.Region : null;

    }
}

/**
 * DescribeStatData请求参数结构体
 * @class
 */
class DescribeStatDataRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 通过mask字段支持仅查询部分指标的场景， 以此提高查询效率，如果不传则默认为0xffffffffffffffff(全部掩码)。每个指标对应的掩码如下：
<li> "ApiCalls"：0x1 </li>
<li> "DatabaseReads"：0x2 </li>
<li> "DatabaseWrites"：0x4 </li>
<li> "CloudApiCalls"：0x8</li>
<li> "FileFlux"：0x10</li>
<li> "CloudFunctionUsage"：0x20</li>
<li> "FileUploads"：0x40</li>
<li> "FileDownloads"：0x80</li>
<li> "Flux"：0x100</li>
<li> "DatabaseCapacity"：0x200</li>
<li> "StorageCapacity"：0x400</li>
<li> "FunctionsCapacity"：0x800</li>
<li> "ActiveUsersDay"：0x1000</li>
<li> "ActiveUsersWeek"：0x2000</li>
<li> "ActiveUsersMonth"：0x4000</li>
         * @type {number || null}
         */
        this.Mask = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.Mask = 'Mask' in params ? params.Mask : null;

    }
}

/**
 * DescribeDatabaseACL返回参数结构体
 * @class
 */
class DescribeDatabaseACLResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 权限标签。包含以下取值：
<li> READONLY：所有用户可读，仅创建者和管理员可写</li>
<li> PRIVATE：仅创建者及管理员可读写</li>
<li> ADMINWRITE：所有用户可读，仅管理员可写</li>
<li> ADMINONLY：仅管理员可读写</li>
         * @type {string || null}
         */
        this.AclTag = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.AclTag = 'AclTag' in params ? params.AclTag : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeMonitorCondition请求参数结构体
 * @class
 */
class DescribeMonitorConditionRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 条件ID
         * @type {number || null}
         */
        this.PolicyId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.PolicyId = 'PolicyId' in params ? params.PolicyId : null;

    }
}

/**
 * DescribeVouchersUseHistory请求参数结构体
 * @class
 */
class DescribeVouchersUseHistoryRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 代金券编号
         * @type {string || null}
         */
        this.VoucherId = null;

        /**
         * 请求来源
<li>miniapp</li>
<li>qcloud</li>
         * @type {string || null}
         */
        this.Source = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.VoucherId = 'VoucherId' in params ? params.VoucherId : null;
        this.Source = 'Source' in params ? params.Source : null;

    }
}

/**
 * DescribeAmountAfterDeduction请求参数结构体
 * @class
 */
class DescribeAmountAfterDeductionRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 代金券编号
         * @type {string || null}
         */
        this.VoucherId = null;

        /**
         * 订单号，不能为降配订单
         * @type {string || null}
         */
        this.TranId = null;

        /**
         * 请求来源
<li>miniapp</li>
<li>qcloud</li>
         * @type {string || null}
         */
        this.Source = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.VoucherId = 'VoucherId' in params ? params.VoucherId : null;
        this.TranId = 'TranId' in params ? params.TranId : null;
        this.Source = 'Source' in params ? params.Source : null;

    }
}

/**
 * 登录方式信息
 * @class
 */
class LoginConfigItem extends  AbstractModel {
    constructor(){
        super();

        /**
         * 第三方平台。包含以下取值：
<li>wechat</li>
<li>qq</li>
         * @type {string || null}
         */
        this.Platform = null;

        /**
         * 第三方平台的AppId
         * @type {string || null}
         */
        this.PlatformId = null;

        /**
         * 创建时间
         * @type {string || null}
         */
        this.CreateTime = null;

        /**
         * 更新时间
         * @type {string || null}
         */
        this.UpdateTime = null;

        /**
         * 状态
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 本条记录的ID
         * @type {string || null}
         */
        this.Id = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Platform = 'Platform' in params ? params.Platform : null;
        this.PlatformId = 'PlatformId' in params ? params.PlatformId : null;
        this.CreateTime = 'CreateTime' in params ? params.CreateTime : null;
        this.UpdateTime = 'UpdateTime' in params ? params.UpdateTime : null;
        this.Status = 'Status' in params ? params.Status : null;
        this.Id = 'Id' in params ? params.Id : null;

    }
}

/**
 * DescribeInvoiceSubject请求参数结构体
 * @class
 */
class DescribeInvoiceSubjectRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeInvoiceSubject返回参数结构体
 * @class
 */
class DescribeInvoiceSubjectResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 发票类型：
Personal 个人-普通发票
CompanyVAT 公司-增值税普通发票
CompanyVATSpecial 公司-增值税专用发票
Organization 组织-增值税普通发票
         * @type {string || null}
         */
        this.UserType = null;

        /**
         * 发票抬头
         * @type {string || null}
         */
        this.InvoiceHead = null;

        /**
         * 增值税普通发票信息（UserType=CompanyVAT时该字段有值）
注意：此字段可能返回 null，表示取不到有效值。
         * @type {InvoiceVATGeneral || null}
         */
        this.VATGeneral = null;

        /**
         * 增值税专用发票信息（UserType=CompanyVATSpecial时有值）
注意：此字段可能返回 null，表示取不到有效值。
         * @type {InvoiceVATSpecial || null}
         */
        this.VATSpecial = null;

        /**
         * 当前审核状态：
APPROVED 审核通过
VERIFYING  审核中（该状态下无法申请发票）
DENIED 审核拒绝（该状态下无法申请发票）
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 如果 Status=DENIED，该字段表示审核拒绝原因
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.StatusMessage = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.UserType = 'UserType' in params ? params.UserType : null;
        this.InvoiceHead = 'InvoiceHead' in params ? params.InvoiceHead : null;

        if (params.VATGeneral) {
            let obj = new InvoiceVATGeneral();
            obj.deserialize(params.VATGeneral)
            this.VATGeneral = obj;
        }

        if (params.VATSpecial) {
            let obj = new InvoiceVATSpecial();
            obj.deserialize(params.VATSpecial)
            this.VATSpecial = obj;
        }
        this.Status = 'Status' in params ? params.Status : null;
        this.StatusMessage = 'StatusMessage' in params ? params.StatusMessage : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * GetUploadFileUrl请求参数结构体
 * @class
 */
class GetUploadFileUrlRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 公共入参
         * @type {CommParam || null}
         */
        this.CommParam = null;

        /**
         * 上传后的文件绝对路径
         * @type {string || null}
         */
        this.Path = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.CommParam) {
            let obj = new CommParam();
            obj.deserialize(params.CommParam)
            this.CommParam = obj;
        }
        this.Path = 'Path' in params ? params.Path : null;

    }
}

/**
 * DescribeStorageACLTask请求参数结构体
 * @class
 */
class DescribeStorageACLTaskRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 桶名
         * @type {string || null}
         */
        this.Bucket = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Bucket = 'Bucket' in params ? params.Bucket : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeCurveData请求参数结构体
 * @class
 */
class DescribeCurveDataRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * <li> 指标名: </li>
<li> StorageRead: 存储读请求次数 </li>
<li> StorageWrite: 存储写请求次数 </li>
<li> StorageCdnOriginFlux: CDN回源流量, 单位字节 </li>
<li> CDNFlux: CDN回源流量, 单位字节 </li>
<li> FunctionInvocation: 云函数调用次数 </li>
<li> FunctionGBs: 云函数资源使用量, 单位Mb*Ms </li>
<li> FunctionFlux: 云函数流量, 单位千字节(KB) </li>
<li> FunctionError: 云函数调用错误次数 </li>
<li> FunctionDuration: 云函数运行时间, 单位毫秒 </li>
<li> DbRead: 数据库读请求数 </li>
<li> DbWrite: 数据库写请求数 </li>
         * @type {string || null}
         */
        this.MetricName = null;

        /**
         * 开始时间，如2018-08-24 10:50:00, 开始时间需要早于结束时间至少五分钟(原因是因为目前统计粒度最小是5分钟).
         * @type {string || null}
         */
        this.StartTime = null;

        /**
         * 结束时间，如2018-08-24 10:50:00, 结束时间需要晚于开始时间至少五分钟(原因是因为目前统计粒度最小是5分钟)..
         * @type {string || null}
         */
        this.EndTime = null;

        /**
         * 资源ID, 目前仅对云函数相关的指标(FunctionInvocation, FunctionGBs, FunctionFlux, FunctionError, FunctionDuration)有意义, 如果想查询某个云函数的指标则在ResourceId中传入函数名; 如果只想查询整个namespace的指标, 则留空或不传.
         * @type {string || null}
         */
        this.ResourceID = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.MetricName = 'MetricName' in params ? params.MetricName : null;
        this.StartTime = 'StartTime' in params ? params.StartTime : null;
        this.EndTime = 'EndTime' in params ? params.EndTime : null;
        this.ResourceID = 'ResourceID' in params ? params.ResourceID : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * GetPolicyGroupInfo返回参数结构体
 * @class
 */
class GetPolicyGroupInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 策略组名称
         * @type {string || null}
         */
        this.GroupName = null;

        /**
         * 资源类型（Database,Function,Storage,CDN）
         * @type {string || null}
         */
        this.ResourceType = null;

        /**
         * 备注
         * @type {string || null}
         */
        this.Remark = null;

        /**
         * 告警条件
         * @type {Array.<AlarmCondition> || null}
         */
        this.Conditions = null;

        /**
         * 策略组ID
         * @type {number || null}
         */
        this.GroupId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.GroupName = 'GroupName' in params ? params.GroupName : null;
        this.ResourceType = 'ResourceType' in params ? params.ResourceType : null;
        this.Remark = 'Remark' in params ? params.Remark : null;

        if (params.Conditions) {
            this.Conditions = new Array();
            for (let z in params.Conditions) {
                let obj = new AlarmCondition();
                obj.deserialize(params.Conditions[z]);
                this.Conditions.push(obj);
            }
        }
        this.GroupId = 'GroupId' in params ? params.GroupId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * InvokeFunction请求参数结构体
 * @class
 */
class InvokeFunctionRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 云函数名称
         * @type {string || null}
         */
        this.FunctionName = null;

        /**
         * 云函数参数
         * @type {string || null}
         */
        this.FunctionParam = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.FunctionName = 'FunctionName' in params ? params.FunctionName : null;
        this.FunctionParam = 'FunctionParam' in params ? params.FunctionParam : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * DescribeUnbindInfo请求参数结构体
 * @class
 */
class DescribeUnbindInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 需要查询的用户uin
         * @type {string || null}
         */
        this.UnbindUin = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.UnbindUin = 'UnbindUin' in params ? params.UnbindUin : null;

    }
}

/**
 * ModifyEnv返回参数结构体
 * @class
 */
class ModifyEnvResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteInvoicePostInfo请求参数结构体
 * @class
 */
class DeleteInvoicePostInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 邮寄地址ID
         * @type {string || null}
         */
        this.PostId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PostId = 'PostId' in params ? params.PostId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeQuotaData请求参数结构体
 * @class
 */
class DescribeQuotaDataRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * <li> 指标名: </li>
<li> StorageSizepkg: 当月存储空间容量, 单位MB </li>
<li> StorageReadpkg: 当月存储读请求次数 </li>
<li> StorageWritepkg: 当月存储写请求次数 </li>
<li> StorageCdnOriginFluxpkg: 当月CDN回源流量, 单位字节 </li>
<li> StorageReadpkgDay: 当日存储读请求次数 </li>
<li> StorageWritepkgDay: 当日写请求次数 </li>
<li> CDNFluxpkg: 当月CDN流量, 单位为字节 </li>
<li> FunctionInvocationpkg: 当月云函数调用次数 </li>
<li> FunctionGBspkg: 当月云函数资源使用量, 单位Mb*Ms </li>
<li> FunctionFluxpkg: 当月云函数流量, 单位千字节(KB) </li>
<li> DbSizepkg: 当月数据库容量大小, 单位MB </li>
<li> DbReadpkg: 当日数据库读请求数 </li>
<li> DbWritepkg: 当日数据库写请求数 </li>
         * @type {string || null}
         */
        this.MetricName = null;

        /**
         * 资源ID, 目前仅对云函数相关的指标(FunctionInvocationpkg, FunctionGBspkg, FunctionFluxpkg)有意义, 如果想查询某个云函数的指标则在ResourceId中传入函数名; 如果只想查询整个namespace的指标, 则留空或不传.
         * @type {string || null}
         */
        this.ResourceID = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.MetricName = 'MetricName' in params ? params.MetricName : null;
        this.ResourceID = 'ResourceID' in params ? params.ResourceID : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeMonitorPolicy请求参数结构体
 * @class
 */
class DescribeMonitorPolicyRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * DescribeDbDistribution请求参数结构体
 * @class
 */
class DescribeDbDistributionRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 该页返回最多记录数，为0则全部取出，目前最大值为500
         * @type {number || null}
         */
        this.Limit = null;

        /**
         * 分页偏移量，从0开始
         * @type {number || null}
         */
        this.Offset = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.Limit = 'Limit' in params ? params.Limit : null;
        this.Offset = 'Offset' in params ? params.Offset : null;

    }
}

/**
 * StorageInfo 资源信息
 * @class
 */
class StorageInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 资源所属地域。
当前支持ap-shanghai
         * @type {string || null}
         */
        this.Region = null;

        /**
         * 桶名，存储资源的唯一标识
         * @type {string || null}
         */
        this.Bucket = null;

        /**
         * cdn 域名
         * @type {string || null}
         */
        this.CdnDomain = null;

        /**
         * 资源所属用户的腾讯云appId
         * @type {string || null}
         */
        this.AppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Region = 'Region' in params ? params.Region : null;
        this.Bucket = 'Bucket' in params ? params.Bucket : null;
        this.CdnDomain = 'CdnDomain' in params ? params.CdnDomain : null;
        this.AppId = 'AppId' in params ? params.AppId : null;

    }
}

/**
 * InitTcb请求参数结构体
 * @class
 */
class InitTcbRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信生成的 temp code，微信必传
         * @type {string || null}
         */
        this.TempCode = null;

        /**
         * 用户端的IP，必须是有效的公网IP，微信必传
         * @type {string || null}
         */
        this.UserIP = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 临时密钥，云控制台必传
         * @type {string || null}
         */
        this.Skey = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TempCode = 'TempCode' in params ? params.TempCode : null;
        this.UserIP = 'UserIP' in params ? params.UserIP : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.Skey = 'Skey' in params ? params.Skey : null;

    }
}

/**
 * ModifySafeRule返回参数结构体
 * @class
 */
class ModifySafeRuleResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * GetPolicyGroupList请求参数结构体
 * @class
 */
class GetPolicyGroupListRequest extends  AbstractModel {
    constructor(){
        super();

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

    }
}

/**
 * DescribeAmountAfterDeduction返回参数结构体
 * @class
 */
class DescribeAmountAfterDeductionResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 代金券抵用后还需支付金额，单位：元；如果代金券可以完全抵扣订单金额，返回0.
         * @type {number || null}
         */
        this.AmountAfterDeduction = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.AmountAfterDeduction = 'AmountAfterDeduction' in params ? params.AmountAfterDeduction : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 入参通用参数，所有接口都需要，与业务逻辑无关
 * @class
 */
class CommParam extends  AbstractModel {
    constructor(){
        super();

        /**
         * tcb环境ID
         * @type {string || null}
         */
        this.EnvName = null;

        /**
         * 服务模块。包含以下取值：
<li>functions</li>
<li>storage</li>
<li>database</li>
         * @type {string || null}
         */
        this.Module = null;

        /**
         * 微信公众平台用户openid
         * @type {string || null}
         */
        this.OpenId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvName = 'EnvName' in params ? params.EnvName : null;
        this.Module = 'Module' in params ? params.Module : null;
        this.OpenId = 'OpenId' in params ? params.OpenId : null;

    }
}

/**
 * DeleteMonitorPolicy请求参数结构体
 * @class
 */
class DeleteMonitorPolicyRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 策略ID
         * @type {Array.<number> || null}
         */
        this.PolicyId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.PolicyId = 'PolicyId' in params ? params.PolicyId : null;

    }
}

/**
 * 资源指标的监控数据
 * @class
 */
class DataPoints extends  AbstractModel {
    constructor(){
        super();

        /**
         * 资源类型
         * @type {string || null}
         */
        this.ResourceType = null;

        /**
         * 资源ID
         * @type {string || null}
         */
        this.ResourceID = null;

        /**
         * 子资源ID
         * @type {string || null}
         */
        this.SubresourceID = null;

        /**
         * 数据时间集合
         * @type {Array.<number> || null}
         */
        this.Timestamps = null;

        /**
         * 数据值集合
         * @type {Array.<number> || null}
         */
        this.Values = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.ResourceType = 'ResourceType' in params ? params.ResourceType : null;
        this.ResourceID = 'ResourceID' in params ? params.ResourceID : null;
        this.SubresourceID = 'SubresourceID' in params ? params.SubresourceID : null;
        this.Timestamps = 'Timestamps' in params ? params.Timestamps : null;
        this.Values = 'Values' in params ? params.Values : null;

    }
}

/**
 * DeleteDocument请求参数结构体
 * @class
 */
class DeleteDocumentRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 查询条件（JSON格式）
         * @type {string || null}
         */
        this.Query = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 是否批量操作（默认false）
         * @type {boolean || null}
         */
        this.IsMultiple = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.Query = 'Query' in params ? params.Query : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.IsMultiple = 'IsMultiple' in params ? params.IsMultiple : null;

    }
}

/**
 * RevokeInvoice请求参数结构体
 * @class
 */
class RevokeInvoiceRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 发票ID
         * @type {string || null}
         */
        this.InvoiceId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.InvoiceId = 'InvoiceId' in params ? params.InvoiceId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateInvoicePostInfo返回参数结构体
 * @class
 */
class CreateInvoicePostInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 地址ID
         * @type {string || null}
         */
        this.PostId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PostId = 'PostId' in params ? params.PostId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 合法域名
 * @class
 */
class AuthDomain extends  AbstractModel {
    constructor(){
        super();

        /**
         * 域名ID
         * @type {string || null}
         */
        this.Id = null;

        /**
         * 域名
         * @type {string || null}
         */
        this.Domain = null;

        /**
         * 域名类型。包含以下取值：
<li>system</li>
<li>user</li>
         * @type {string || null}
         */
        this.Type = null;

        /**
         * 状态。包含以下取值：
<li>ENABLE</li>
<li>DISABLE</li>
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 创建时间
         * @type {string || null}
         */
        this.CreateTime = null;

        /**
         * 更新时间
         * @type {string || null}
         */
        this.UpdateTime = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Id = 'Id' in params ? params.Id : null;
        this.Domain = 'Domain' in params ? params.Domain : null;
        this.Type = 'Type' in params ? params.Type : null;
        this.Status = 'Status' in params ? params.Status : null;
        this.CreateTime = 'CreateTime' in params ? params.CreateTime : null;
        this.UpdateTime = 'UpdateTime' in params ? params.UpdateTime : null;

    }
}

/**
 * DescribeVouchersInfoByDeal请求参数结构体
 * @class
 */
class DescribeVouchersInfoByDealRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 订单号，tcb订单唯一标识
         * @type {string || null}
         */
        this.TranId = null;

        /**
         * 页码
         * @type {number || null}
         */
        this.Page = null;

        /**
         * 每页大小
         * @type {number || null}
         */
        this.Size = null;

        /**
         * 请求来源
<li>miniapp</li>
<li>qcloud</li>
         * @type {string || null}
         */
        this.Source = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TranId = 'TranId' in params ? params.TranId : null;
        this.Page = 'Page' in params ? params.Page : null;
        this.Size = 'Size' in params ? params.Size : null;
        this.Source = 'Source' in params ? params.Source : null;

    }
}

/**
 * DescribePayInfo请求参数结构体
 * @class
 */
class DescribePayInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 订单号，tcb订单唯一标识
         * @type {string || null}
         */
        this.TranId = null;

        /**
         * 用户客户端ip
         * @type {string || null}
         */
        this.UserClientIp = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 代金券编号，必须是有效代金券；使用代金券支付，传该参数；不使用代金券支付，不传该参数。
         * @type {string || null}
         */
        this.VoucherId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TranId = 'TranId' in params ? params.TranId : null;
        this.UserClientIp = 'UserClientIp' in params ? params.UserClientIp : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.VoucherId = 'VoucherId' in params ? params.VoucherId : null;

    }
}

/**
 * AddPolicyGroup请求参数结构体
 * @class
 */
class AddPolicyGroupRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 资源所属的环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 资源类型（Database,Function,Storage,CDN）
         * @type {string || null}
         */
        this.ResourceType = null;

        /**
         * 告警组名称
         * @type {string || null}
         */
        this.GroupName = null;

        /**
         * 告警条件列表
         * @type {Array.<AlarmCondition> || null}
         */
        this.Conditions = null;

        /**
         * 备注
         * @type {string || null}
         */
        this.Remark = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.ResourceType = 'ResourceType' in params ? params.ResourceType : null;
        this.GroupName = 'GroupName' in params ? params.GroupName : null;

        if (params.Conditions) {
            this.Conditions = new Array();
            for (let z in params.Conditions) {
                let obj = new AlarmCondition();
                obj.deserialize(params.Conditions[z]);
                this.Conditions.push(obj);
            }
        }
        this.Remark = 'Remark' in params ? params.Remark : null;

    }
}

/**
 * DescribeEndUsers返回参数结构体
 * @class
 */
class DescribeEndUsersResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 用户总数
         * @type {number || null}
         */
        this.Total = null;

        /**
         * 用户列表
         * @type {Array.<EndUserInfo> || null}
         */
        this.Users = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Total = 'Total' in params ? params.Total : null;

        if (params.Users) {
            this.Users = new Array();
            for (let z in params.Users) {
                let obj = new EndUserInfo();
                obj.deserialize(params.Users[z]);
                this.Users.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ModifyMonitorPolicy返回参数结构体
 * @class
 */
class ModifyMonitorPolicyResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteAuthDomain请求参数结构体
 * @class
 */
class DeleteAuthDomainRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 开发者的环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 域名ID列表，支持批量
         * @type {Array.<string> || null}
         */
        this.DomainIds = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.DomainIds = 'DomainIds' in params ? params.DomainIds : null;

    }
}

/**
 * DescribeWXMessageToken请求参数结构体
 * @class
 */
class DescribeWXMessageTokenRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 调用者描述
         * @type {string || null}
         */
        this.Caller = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Caller = 'Caller' in params ? params.Caller : null;

    }
}

/**
 * DescribeResourceRecoverJob返回参数结构体
 * @class
 */
class DescribeResourceRecoverJobResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 任务状态
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<RecoverJobStatus> || null}
         */
        this.JobStatusSet = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.JobStatusSet) {
            this.JobStatusSet = new Array();
            for (let z in params.JobStatusSet) {
                let obj = new RecoverJobStatus();
                obj.deserialize(params.JobStatusSet[z]);
                this.JobStatusSet.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateEnvAndResourceForWx返回参数结构体
 * @class
 */
class CreateEnvAndResourceForWxResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境当前状态：
- NORMAL：正常可用
- NOINITIALIZE：尚未初始化
- INITIALIZING：初始化过程中
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Status = 'Status' in params ? params.Status : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ResourceRecover请求参数结构体
 * @class
 */
class ResourceRecoverRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 资源类型：
可取值：CDN/COS/SCF/FlexDB/CLS
         * @type {Array.<string> || null}
         */
        this.ResourceTypes = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.ResourceTypes = 'ResourceTypes' in params ? params.ResourceTypes : null;

    }
}

/**
 * DescribePayInfo返回参数结构体
 * @class
 */
class DescribePayInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 支付串，米大师SDK唤起的支付URL
         * @type {string || null}
         */
        this.PayCode = null;

        /**
         * 米大师appid
         * @type {string || null}
         */
        this.AppId = null;

        /**
         * 0元或退费订单标志。包含以下取值：
<li>true：0元或退费订单或代金券可以涵盖订单金额，且已支付成功</li>
<li>false：通过PayCode、AppId支付。</li>
         * @type {boolean || null}
         */
        this.IsFreeOrRefundDeal = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PayCode = 'PayCode' in params ? params.PayCode : null;
        this.AppId = 'AppId' in params ? params.AppId : null;
        this.IsFreeOrRefundDeal = 'IsFreeOrRefundDeal' in params ? params.IsFreeOrRefundDeal : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CallWxApi返回参数结构体
 * @class
 */
class CallWxApiResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 微信OpenApi调用结果，JSON字符串
         * @type {Array.<string> || null}
         */
        this.Result = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Result = 'Result' in params ? params.Result : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CheckTcbService请求参数结构体
 * @class
 */
class CheckTcbServiceRequest extends  AbstractModel {
    constructor(){
        super();

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

    }
}

/**
 * AddPolicyGroup返回参数结构体
 * @class
 */
class AddPolicyGroupResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 策略组ID
         * @type {number || null}
         */
        this.GroupId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.GroupId = 'GroupId' in params ? params.GroupId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CreateEnv请求参数结构体
 * @class
 */
class CreateEnvRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 环境别名，要以a-z开头，不能包含 a-zA-z0-9- 以外的字符
         * @type {string || null}
         */
        this.Alias = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 套餐到期后，是否自动降级为免费版：
true= 自动降级
false=不自动降级（到期即隔离、停服）
         * @type {boolean || null}
         */
        this.AutoDegrade = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Alias = 'Alias' in params ? params.Alias : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.AutoDegrade = 'AutoDegrade' in params ? params.AutoDegrade : null;

    }
}

/**
 * CreateDeal返回参数结构体
 * @class
 */
class CreateDealResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 订单号，tcb订单唯一标识
         * @type {string || null}
         */
        this.TranId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TranId = 'TranId' in params ? params.TranId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DatabaseMigrateQueryInfo请求参数结构体
 * @class
 */
class DatabaseMigrateQueryInfoRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 任务ID
         * @type {number || null}
         */
        this.JobId = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.JobId = 'JobId' in params ? params.JobId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeAuthDomains请求参数结构体
 * @class
 */
class DescribeAuthDomainsRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * InqueryPrice请求参数结构体
 * @class
 */
class InqueryPriceRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 询价类型。包含以下取值：
<li>1 ：购买询价</li>
<li>2 ：续费询价</li>
<li>3 ：变配询价</li>
         * @type {number || null}
         */
        this.QueryType = null;

        /**
         * 用户客户端ip
         * @type {string || null}
         */
        this.UserClientIp = null;

        /**
         * tcb产品套餐ID，从DescribePackages接口的返回值中获取。
QueryType 传1，3时，此参数必传
         * @type {string || null}
         */
        this.PackageId = null;

        /**
         * 环境ID。QueryType 传2，3时，此参数必传
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 询价时长。QueryType 传1，2时，此参数必传
         * @type {number || null}
         */
        this.TimeSpan = null;

        /**
         * 时长单位，目前仅支持月：m。QueryType 传1，2时，此参数必传
         * @type {string || null}
         */
        this.TimeUnit = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.QueryType = 'QueryType' in params ? params.QueryType : null;
        this.UserClientIp = 'UserClientIp' in params ? params.UserClientIp : null;
        this.PackageId = 'PackageId' in params ? params.PackageId : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.TimeSpan = 'TimeSpan' in params ? params.TimeSpan : null;
        this.TimeUnit = 'TimeUnit' in params ? params.TimeUnit : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DatabaseMigrateImport请求参数结构体
 * @class
 */
class DatabaseMigrateImportRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 待导入的集合名称
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 文件类型。包含以下取值：
<li>json</li>
<li>csv</li>
         * @type {string || null}
         */
        this.FileType = null;

        /**
         * 上传的文件cos路径, 文件的大小需小于数据库当前的剩余容量, 否则导入会失败.
         * @type {string || null}
         */
        this.FilePath = null;

        /**
         * 遇到错误时是否停止导入。包含以下取值：
<li>true：停止</li>
<li>false：不停止</li>
         * @type {boolean || null}
         */
        this.StopOnError = null;

        /**
         * 冲突处理方式。包含以下取值：
<li>insert</li>
<li>upsert</li>
         * @type {string || null}
         */
        this.ConflictMode = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.FileType = 'FileType' in params ? params.FileType : null;
        this.FilePath = 'FilePath' in params ? params.FilePath : null;
        this.StopOnError = 'StopOnError' in params ? params.StopOnError : null;
        this.ConflictMode = 'ConflictMode' in params ? params.ConflictMode : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateEnvAndResource返回参数结构体
 * @class
 */
class CreateEnvAndResourceResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境当前状态：
<li>NORMAL：正常可用</li>
<li>NOINITIALIZE：尚未初始化</li>
<li>INITIALIZING：初始化过程中</li>
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Status = 'Status' in params ? params.Status : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 监控资源
 * @class
 */
class MonitorResource extends  AbstractModel {
    constructor(){
        super();

        /**
         * 资源名，如云函数
         * @type {string || null}
         */
        this.Name = null;

        /**
         * 支持的指标名称列表，如云函数运行时间
         * @type {Array.<string> || null}
         */
        this.Index = null;

        /**
         * 支持的统计的周期，如300秒、3600秒
         * @type {Array.<number> || null}
         */
        this.Period = null;

        /**
         * 指标英文名
         * @type {Array.<string> || null}
         */
        this.EnIndex = null;

        /**
         * 资源英文名，如Function
         * @type {string || null}
         */
        this.EnName = null;

        /**
         * 指标单位
         * @type {Array.<string> || null}
         */
        this.IndexUnit = null;

        /**
         * 收敛周期（秒）
         * @type {Array.<number> || null}
         */
        this.Convergence = null;

        /**
         * 收敛周期名，如1小时1次
         * @type {Array.<string> || null}
         */
        this.ConvergenceName = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Name = 'Name' in params ? params.Name : null;
        this.Index = 'Index' in params ? params.Index : null;
        this.Period = 'Period' in params ? params.Period : null;
        this.EnIndex = 'EnIndex' in params ? params.EnIndex : null;
        this.EnName = 'EnName' in params ? params.EnName : null;
        this.IndexUnit = 'IndexUnit' in params ? params.IndexUnit : null;
        this.Convergence = 'Convergence' in params ? params.Convergence : null;
        this.ConvergenceName = 'ConvergenceName' in params ? params.ConvergenceName : null;

    }
}

/**
 * DescribeStorageACLTask返回参数结构体
 * @class
 */
class DescribeStorageACLTaskResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 任务状态。包含以下取值：
<li> WAITING：等待中</li>
<li> PENDING ： 处理中</li>
<li> FINISHED：处理结束</li>
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Status = 'Status' in params ? params.Status : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * UpdateLoginConfig返回参数结构体
 * @class
 */
class UpdateLoginConfigResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * SetInvoiceSubject请求参数结构体
 * @class
 */
class SetInvoiceSubjectRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 发票类型：
Personal 个人-普通发票
CompanyVAT 公司-增值税普通发票
CompanyVATSpecial 公司-增值税专用发票
Organization 组织-增值税普通发票
         * @type {string || null}
         */
        this.UserType = null;

        /**
         * 发票抬头
         * @type {string || null}
         */
        this.InvoiceHead = null;

        /**
         * 增值税普通发票信息（UserType=CompanyVAT时必传）
         * @type {InvoiceVATGeneral || null}
         */
        this.VATGeneral = null;

        /**
         * 增值税专用发票信息（UserType=CompanyVATSpecial时必传）
         * @type {InvoiceVATSpecial || null}
         */
        this.VATSpecial = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.UserType = 'UserType' in params ? params.UserType : null;
        this.InvoiceHead = 'InvoiceHead' in params ? params.InvoiceHead : null;

        if (params.VATGeneral) {
            let obj = new InvoiceVATGeneral();
            obj.deserialize(params.VATGeneral)
            this.VATGeneral = obj;
        }

        if (params.VATSpecial) {
            let obj = new InvoiceVATSpecial();
            obj.deserialize(params.VATSpecial)
            this.VATSpecial = obj;
        }
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateMonitorCondition请求参数结构体
 * @class
 */
class CreateMonitorConditionRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 策略ID
         * @type {number || null}
         */
        this.PolicyId = null;

        /**
         * 指标名，如error(错误次数)
         * @type {string || null}
         */
        this.Metrics = null;

        /**
         * 比较关系：用户可选择>、>=、<、<=、=、！=等关系
         * @type {string || null}
         */
        this.Cmp = null;

        /**
         * 阈值
         * @type {number || null}
         */
        this.Threshold = null;

        /**
         * 统计周期
         * @type {number || null}
         */
        this.Period = null;

        /**
         * 持续周期
         * @type {number || null}
         */
        this.PeriodNum = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.PolicyId = 'PolicyId' in params ? params.PolicyId : null;
        this.Metrics = 'Metrics' in params ? params.Metrics : null;
        this.Cmp = 'Cmp' in params ? params.Cmp : null;
        this.Threshold = 'Threshold' in params ? params.Threshold : null;
        this.Period = 'Period' in params ? params.Period : null;
        this.PeriodNum = 'PeriodNum' in params ? params.PeriodNum : null;

    }
}

/**
 * DescribeResourceLimit请求参数结构体
 * @class
 */
class DescribeResourceLimitRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribePackages请求参数结构体
 * @class
 */
class DescribePackagesRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * tcb产品套餐ID，不填拉取全量package信息。
         * @type {string || null}
         */
        this.PackageId = null;

        /**
         * 环境ID，需要传入
         * @type {string || null}
         */
        this.EnvId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.PackageId = 'PackageId' in params ? params.PackageId : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;

    }
}

/**
 * UserGetInfo返回参数结构体
 * @class
 */
class UserGetInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeMonitorCondition返回参数结构体
 * @class
 */
class DescribeMonitorConditionResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 告警条件列表
         * @type {Array.< MonitorConditionInfo> || null}
         */
        this.Data = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Data) {
            this.Data = new Array();
            for (let z in params.Data) {
                let obj = new  MonitorConditionInfo();
                obj.deserialize(params.Data[z]);
                this.Data.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * 描述collection中的文档数量
 * @class
 */
class CollectionDispension extends  AbstractModel {
    constructor(){
        super();

        /**
         * 集合名
         * @type {string || null}
         */
        this.CollectionName = null;

        /**
         * 文档数量
         * @type {number || null}
         */
        this.DocCount = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.CollectionName = 'CollectionName' in params ? params.CollectionName : null;
        this.DocCount = 'DocCount' in params ? params.DocCount : null;

    }
}

/**
 * DescribeNextExpireTime返回参数结构体
 * @class
 */
class DescribeNextExpireTimeResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 预计到期时间
         * @type {string || null}
         */
        this.ExpireTime = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.ExpireTime = 'ExpireTime' in params ? params.ExpireTime : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribeStorageStatus请求参数结构体
 * @class
 */
class DescribeStorageStatusRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID。
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * DescribeInvoicePostInfo返回参数结构体
 * @class
 */
class DescribeInvoicePostInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 发票邮寄地址列表
注意：此字段可能返回 null，表示取不到有效值。
         * @type {Array.<InvoicePostInfo> || null}
         */
        this.PostInfoList = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.PostInfoList) {
            this.PostInfoList = new Array();
            for (let z in params.PostInfoList) {
                let obj = new InvoicePostInfo();
                obj.deserialize(params.PostInfoList[z]);
                this.PostInfoList.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * CallWxApi请求参数结构体
 * @class
 */
class CallWxApiRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * Api名称
         * @type {string || null}
         */
        this.ApiName = null;

        /**
         * 微信Api Token
         * @type {string || null}
         */
        this.WxCloudApiToken = null;

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * Api传参，JSON格式
         * @type {string || null}
         */
        this.ApiParam = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.ApiName = 'ApiName' in params ? params.ApiName : null;
        this.WxCloudApiToken = 'WxCloudApiToken' in params ? params.WxCloudApiToken : null;
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.ApiParam = 'ApiParam' in params ? params.ApiParam : null;

    }
}

/**
 * GetPolicyGroupList返回参数结构体
 * @class
 */
class GetPolicyGroupListResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 告警组列表
         * @type {Array.<AlarmPolicyInfo> || null}
         */
        this.GroupList = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.GroupList) {
            this.GroupList = new Array();
            for (let z in params.GroupList) {
                let obj = new AlarmPolicyInfo();
                obj.deserialize(params.GroupList[z]);
                this.GroupList.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DescribePackages返回参数结构体
 * @class
 */
class DescribePackagesResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 套餐列表
         * @type {Array.<PackageInfo> || null}
         */
        this.Packages = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.Packages) {
            this.Packages = new Array();
            for (let z in params.Packages) {
                let obj = new PackageInfo();
                obj.deserialize(params.Packages[z]);
                this.Packages.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * ModifyEnv请求参数结构体
 * @class
 */
class ModifyEnvRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 环境备注名，要以a-z开头，不能包含 a-zA-z0-9- 以外的字符
         * @type {string || null}
         */
        this.Alias = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.Alias = 'Alias' in params ? params.Alias : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * CreateEnvAndResourceForWx请求参数结构体
 * @class
 */
class CreateEnvAndResourceForWxRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境ID。1~32个字符，只能包含小写字母、数字和减号，不能以减号开头和结尾。
         * @type {string || null}
         */
        this.EnvId = null;

        /**
         * 微信AppId，必传。
         * @type {string || null}
         */
        this.WxAppId = null;

        /**
         * 环境别名。要以a-z开头，不能包含 a-zA-z0-9- 以外的字符，最大32个字符。
         * @type {string || null}
         */
        this.Alias = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.EnvId = 'EnvId' in params ? params.EnvId : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;
        this.Alias = 'Alias' in params ? params.Alias : null;

    }
}

/**
 * DescribeStorageStatus返回参数结构体
 * @class
 */
class DescribeStorageStatusResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 当前COS桶状态：
Normal:正常， BucketMissing:bucket被删， Recovering:正在恢复中
         * @type {string || null}
         */
        this.Status = null;

        /**
         * 当 Status=Recovering时有值，表示当前异步任务ID
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
        this.RecoverJobId = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.Status = 'Status' in params ? params.Status : null;
        this.RecoverJobId = 'RecoverJobId' in params ? params.RecoverJobId : null;
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * DeleteDeal请求参数结构体
 * @class
 */
class DeleteDealRequest extends  AbstractModel {
    constructor(){
        super();

        /**
         * 订单号，tcb订单唯一标识。只能删除已取消的订单
         * @type {string || null}
         */
        this.TranId = null;

        /**
         * 用户客户端ip
         * @type {string || null}
         */
        this.UserClientIp = null;

        /**
         * 微信 AppId，微信必传
         * @type {string || null}
         */
        this.WxAppId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.TranId = 'TranId' in params ? params.TranId : null;
        this.UserClientIp = 'UserClientIp' in params ? params.UserClientIp : null;
        this.WxAppId = 'WxAppId' in params ? params.WxAppId : null;

    }
}

/**
 * 用量信息
 * @class
 */
class LimitInfo extends  AbstractModel {
    constructor(){
        super();

        /**
         * 最大用量。包含以下取值：
<li>API次数</li>
<li>storage流量。单位：MB</li>
<li>function使用量。单位：GBs</li>
         * @type {number || null}
         */
        this.MaxSize = null;

        /**
         * 用量计算周期。包含以下取值：
<li>小时(h)</li>
<li>天(d)</li>
<li>年(y)</li>
         * @type {string || null}
         */
        this.TimeUnit = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.MaxSize = 'MaxSize' in params ? params.MaxSize : null;
        this.TimeUnit = 'TimeUnit' in params ? params.TimeUnit : null;

    }
}

/**
 * DescribeBillingInfo返回参数结构体
 * @class
 */
class DescribeBillingInfoResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 环境计费信息列表
         * @type {Array.<EnvBillingInfoItem> || null}
         */
        this.EnvBillingInfoList = null;

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }

        if (params.EnvBillingInfoList) {
            this.EnvBillingInfoList = new Array();
            for (let z in params.EnvBillingInfoList) {
                let obj = new EnvBillingInfoItem();
                obj.deserialize(params.EnvBillingInfoList[z]);
                this.EnvBillingInfoList.push(obj);
            }
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

/**
 * BindingPolicyObject返回参数结构体
 * @class
 */
class BindingPolicyObjectResponse extends  AbstractModel {
    constructor(){
        super();

        /**
         * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
         * @type {string || null}
         */
        this.RequestId = null;

    }

    /**
     * @private
     */
    deserialize(params) {
        if (!params) {
            return;
        }
        this.RequestId = 'RequestId' in params ? params.RequestId : null;

    }
}

module.exports = {
    CreateLoginConfigResponse: CreateLoginConfigResponse,
    FunctionLimit: FunctionLimit,
    CheckTcbServiceResponse: CheckTcbServiceResponse,
    FileDownloadReqInfo: FileDownloadReqInfo,
    DescribeInvoiceAmountResponse: DescribeInvoiceAmountResponse,
    DealInfo: DealInfo,
    DatabaseMigrateQueryInfoResponse: DatabaseMigrateQueryInfoResponse,
    FileDeleteInfo: FileDeleteInfo,
    DescribeUnbindInfoResponse: DescribeUnbindInfoResponse,
    PackageInfo: PackageInfo,
    DescribeStorageACLRequest: DescribeStorageACLRequest,
    DescribeVouchersInfoResponse: DescribeVouchersInfoResponse,
    DescribeLoginConfigsRequest: DescribeLoginConfigsRequest,
    ModifyMonitorConditionRequest: ModifyMonitorConditionRequest,
    DescribeNextExpireTimeRequest: DescribeNextExpireTimeRequest,
    BindingPolicyObjectRequest: BindingPolicyObjectRequest,
    CreateLoginConfigRequest: CreateLoginConfigRequest,
    QueryDealsRequest: QueryDealsRequest,
    ApplyVoucherRequest: ApplyVoucherRequest,
    InvoicePostInfo: InvoicePostInfo,
    DatabaseLimit: DatabaseLimit,
    CreateMonitorPolicyRequest: CreateMonitorPolicyRequest,
    AlarmPolicyInfo: AlarmPolicyInfo,
    CreateInvoiceResponse: CreateInvoiceResponse,
    ResourceRecoverResponse: ResourceRecoverResponse,
    CheckEnvPackageModifyResponse: CheckEnvPackageModifyResponse,
    CreateInvoicePostInfoRequest: CreateInvoicePostInfoRequest,
    DescribeInvoicePostInfoRequest: DescribeInvoicePostInfoRequest,
    Volucher: Volucher,
    InvoiceAmountOverlimit: InvoiceAmountOverlimit,
    DescribeStorageRecoverJobRequest: DescribeStorageRecoverJobRequest,
    DescribeAccountInfoRequest: DescribeAccountInfoRequest,
    DescribeResourceLimitResponse: DescribeResourceLimitResponse,
    ApplyVoucherResponse: ApplyVoucherResponse,
    LogServiceInfo: LogServiceInfo,
    InvoiceVATGeneral: InvoiceVATGeneral,
    GetDownloadUrlsResponse: GetDownloadUrlsResponse,
    CreateMonitorConditionResponse: CreateMonitorConditionResponse,
    DescribeCurveDataResponse: DescribeCurveDataResponse,
    InvoiceBasicInfo: InvoiceBasicInfo,
    CheckEnvPackageModifyRequest: CheckEnvPackageModifyRequest,
    DescribeAuthDomainsResponse: DescribeAuthDomainsResponse,
    CreateCustomLoginKeysRequest: CreateCustomLoginKeysRequest,
    GetDownloadUrlsRequest: GetDownloadUrlsRequest,
    InvokeAIResponse: InvokeAIResponse,
    QuotaOverlimit: QuotaOverlimit,
    CreateCloudUserResponse: CreateCloudUserResponse,
    UnBindingPolicyObjectRequest: UnBindingPolicyObjectRequest,
    DescribeEnvsForWxRequest: DescribeEnvsForWxRequest,
    DescribeLoginConfigsResponse: DescribeLoginConfigsResponse,
    GetMonitorDataRequest: GetMonitorDataRequest,
    DescribeDbDistributionResponse: DescribeDbDistributionResponse,
    ModifyDatabaseACLRequest: ModifyDatabaseACLRequest,
    ModifySafeRuleRequest: ModifySafeRuleRequest,
    EndUserInfo: EndUserInfo,
    ResourcesInfo: ResourcesInfo,
    InitTcbResponse: InitTcbResponse,
    AlarmCondition: AlarmCondition,
    ModifyStorageACLRequest: ModifyStorageACLRequest,
    DeleteInvoicePostInfoResponse: DeleteInvoicePostInfoResponse,
    DescribeMonitorPolicyResponse: DescribeMonitorPolicyResponse,
    DescribeSafeRuleRequest: DescribeSafeRuleRequest,
    DescribeQuotaDataResponse: DescribeQuotaDataResponse,
     MonitorConditionInfo:  MonitorConditionInfo,
    DescribeVouchersInfoRequest: DescribeVouchersInfoRequest,
    InvokeFunctionResponse: InvokeFunctionResponse,
    CreateDocumentResponse: CreateDocumentResponse,
    AddLoginMannerRequest: AddLoginMannerRequest,
    DescribeResourceRecoverJobRequest: DescribeResourceRecoverJobRequest,
    CreateEnvResponse: CreateEnvResponse,
    DatabaseMigrateExportResponse: DatabaseMigrateExportResponse,
    StorageException: StorageException,
    SetInvoiceSubjectResponse: SetInvoiceSubjectResponse,
    DescribeMonitorResourceResponse: DescribeMonitorResourceResponse,
    DescribeEnvAccountCircleRequest: DescribeEnvAccountCircleRequest,
    CreateDealRequest: CreateDealRequest,
    DescribeStorageRecoverJobResponse: DescribeStorageRecoverJobResponse,
    CreateCustomLoginKeysResponse: CreateCustomLoginKeysResponse,
    DeleteMonitorPolicyResponse: DeleteMonitorPolicyResponse,
    DeleteMonitorConditionRequest: DeleteMonitorConditionRequest,
    CreateAuthDomainResponse: CreateAuthDomainResponse,
    QueryDealsResponse: QueryDealsResponse,
    DescribeEnvsRequest: DescribeEnvsRequest,
    CreateStorageRecoverJobRequest: CreateStorageRecoverJobRequest,
    CreateCollectionRequest: CreateCollectionRequest,
    DatabaseMigrateImportResponse: DatabaseMigrateImportResponse,
    DeleteMonitorConditionResponse: DeleteMonitorConditionResponse,
    DescribeStatDataResponse: DescribeStatDataResponse,
    GetPolicyGroupInfoRequest: GetPolicyGroupInfoRequest,
    DeleteDocumentResponse: DeleteDocumentResponse,
    RecoverJobStatus: RecoverJobStatus,
    MonitorPolicyInfo: MonitorPolicyInfo,
    CreateCollectionResponse: CreateCollectionResponse,
    DescribeEnvResourceExceptionResponse: DescribeEnvResourceExceptionResponse,
    DescribeWXMessageTokenResponse: DescribeWXMessageTokenResponse,
    ModifyMonitorPolicyRequest: ModifyMonitorPolicyRequest,
    DescribeDocumentResponse: DescribeDocumentResponse,
    DescribeUsersResponse: DescribeUsersResponse,
    ModifyInvoicePostInfoResponse: ModifyInvoicePostInfoResponse,
    VoucherUseHistory: VoucherUseHistory,
    UserInfo: UserInfo,
    DescribeBillingInfoRequest: DescribeBillingInfoRequest,
    UserGetInfoRequest: UserGetInfoRequest,
    DescribeEnvResourceExceptionRequest: DescribeEnvResourceExceptionRequest,
    ModifyDatabaseACLResponse: ModifyDatabaseACLResponse,
    CreateStorageRecoverJobResponse: CreateStorageRecoverJobResponse,
    ModifyDocumentRequest: ModifyDocumentRequest,
    InqueryPriceResponse: InqueryPriceResponse,
    DescribeUsersRequest: DescribeUsersRequest,
    DescribeVouchersUseHistoryResponse: DescribeVouchersUseHistoryResponse,
    DeleteAuthDomainResponse: DeleteAuthDomainResponse,
    GetMonitorDataResponse: GetMonitorDataResponse,
    DeleteDealResponse: DeleteDealResponse,
    RevokeInvoiceResponse: RevokeInvoiceResponse,
    EnvInfo: EnvInfo,
    FileDownloadRespInfo: FileDownloadRespInfo,
    DescribeAuthentificationRequest: DescribeAuthentificationRequest,
    DescribeAuthentificationResponse: DescribeAuthentificationResponse,
    DeleteFilesRequest: DeleteFilesRequest,
    EnvBillingInfoItem: EnvBillingInfoItem,
    DescribeEnvsResponse: DescribeEnvsResponse,
    CancelDealResponse: CancelDealResponse,
    DescribeDocumentRequest: DescribeDocumentRequest,
    CreateAuthDomainRequest: CreateAuthDomainRequest,
    DescribeMonitorResourceRequest: DescribeMonitorResourceRequest,
    DescribeVouchersInfoByDealResponse: DescribeVouchersInfoByDealResponse,
    RecoverResult: RecoverResult,
    UpdateLoginConfigRequest: UpdateLoginConfigRequest,
    ModifyStorageACLResponse: ModifyStorageACLResponse,
    CreateEnvAndResourceRequest: CreateEnvAndResourceRequest,
    DescribeAccountInfoResponse: DescribeAccountInfoResponse,
    DatabaseMigrateExportRequest: DatabaseMigrateExportRequest,
    CheckEnvIdResponse: CheckEnvIdResponse,
    DescribeInvoiceDetailRequest: DescribeInvoiceDetailRequest,
    CreateDocumentRequest: CreateDocumentRequest,
    DescribeMonitorDataRequest: DescribeMonitorDataRequest,
    DescribeEndUsersRequest: DescribeEndUsersRequest,
    DescribeInvoiceAmountRequest: DescribeInvoiceAmountRequest,
    ModifyMonitorConditionResponse: ModifyMonitorConditionResponse,
    DescribeInvoiceListResponse: DescribeInvoiceListResponse,
    DescribeSafeRuleResponse: DescribeSafeRuleResponse,
    DescribeDowngradeInfoResponse: DescribeDowngradeInfoResponse,
    CancelDealRequest: CancelDealRequest,
    DescribeMonitorDataResponse: DescribeMonitorDataResponse,
    StorageLimit: StorageLimit,
    DescribeInvoiceDetailResponse: DescribeInvoiceDetailResponse,
    CreateMonitorPolicyResponse: CreateMonitorPolicyResponse,
    DescribeEnvAccountCircleResponse: DescribeEnvAccountCircleResponse,
    ModifyDocumentResponse: ModifyDocumentResponse,
    ModifyInvoicePostInfoRequest: ModifyInvoicePostInfoRequest,
    CreateCloudUserRequest: CreateCloudUserRequest,
    GetUploadFileUrlResponse: GetUploadFileUrlResponse,
    DescribeDowngradeInfoRequest: DescribeDowngradeInfoRequest,
    CreateInvoiceRequest: CreateInvoiceRequest,
    DescribeInvoiceListRequest: DescribeInvoiceListRequest,
    DescribeStorageACLResponse: DescribeStorageACLResponse,
    DatabasesInfo: DatabasesInfo,
    DescribeEnvsForWxResponse: DescribeEnvsForWxResponse,
    DeleteFilesResponse: DeleteFilesResponse,
    UnBindingPolicyObjectResponse: UnBindingPolicyObjectResponse,
    DescribeDatabaseACLRequest: DescribeDatabaseACLRequest,
    InvoiceVATSpecial: InvoiceVATSpecial,
    CheckEnvIdRequest: CheckEnvIdRequest,
    InvokeAIRequest: InvokeAIRequest,
    AddLoginMannerResponse: AddLoginMannerResponse,
    FunctionInfo: FunctionInfo,
    DescribeStatDataRequest: DescribeStatDataRequest,
    DescribeDatabaseACLResponse: DescribeDatabaseACLResponse,
    DescribeMonitorConditionRequest: DescribeMonitorConditionRequest,
    DescribeVouchersUseHistoryRequest: DescribeVouchersUseHistoryRequest,
    DescribeAmountAfterDeductionRequest: DescribeAmountAfterDeductionRequest,
    LoginConfigItem: LoginConfigItem,
    DescribeInvoiceSubjectRequest: DescribeInvoiceSubjectRequest,
    DescribeInvoiceSubjectResponse: DescribeInvoiceSubjectResponse,
    GetUploadFileUrlRequest: GetUploadFileUrlRequest,
    DescribeStorageACLTaskRequest: DescribeStorageACLTaskRequest,
    DescribeCurveDataRequest: DescribeCurveDataRequest,
    GetPolicyGroupInfoResponse: GetPolicyGroupInfoResponse,
    InvokeFunctionRequest: InvokeFunctionRequest,
    DescribeUnbindInfoRequest: DescribeUnbindInfoRequest,
    ModifyEnvResponse: ModifyEnvResponse,
    DeleteInvoicePostInfoRequest: DeleteInvoicePostInfoRequest,
    DescribeQuotaDataRequest: DescribeQuotaDataRequest,
    DescribeMonitorPolicyRequest: DescribeMonitorPolicyRequest,
    DescribeDbDistributionRequest: DescribeDbDistributionRequest,
    StorageInfo: StorageInfo,
    InitTcbRequest: InitTcbRequest,
    ModifySafeRuleResponse: ModifySafeRuleResponse,
    GetPolicyGroupListRequest: GetPolicyGroupListRequest,
    DescribeAmountAfterDeductionResponse: DescribeAmountAfterDeductionResponse,
    CommParam: CommParam,
    DeleteMonitorPolicyRequest: DeleteMonitorPolicyRequest,
    DataPoints: DataPoints,
    DeleteDocumentRequest: DeleteDocumentRequest,
    RevokeInvoiceRequest: RevokeInvoiceRequest,
    CreateInvoicePostInfoResponse: CreateInvoicePostInfoResponse,
    AuthDomain: AuthDomain,
    DescribeVouchersInfoByDealRequest: DescribeVouchersInfoByDealRequest,
    DescribePayInfoRequest: DescribePayInfoRequest,
    AddPolicyGroupRequest: AddPolicyGroupRequest,
    DescribeEndUsersResponse: DescribeEndUsersResponse,
    ModifyMonitorPolicyResponse: ModifyMonitorPolicyResponse,
    DeleteAuthDomainRequest: DeleteAuthDomainRequest,
    DescribeWXMessageTokenRequest: DescribeWXMessageTokenRequest,
    DescribeResourceRecoverJobResponse: DescribeResourceRecoverJobResponse,
    CreateEnvAndResourceForWxResponse: CreateEnvAndResourceForWxResponse,
    ResourceRecoverRequest: ResourceRecoverRequest,
    DescribePayInfoResponse: DescribePayInfoResponse,
    CallWxApiResponse: CallWxApiResponse,
    CheckTcbServiceRequest: CheckTcbServiceRequest,
    AddPolicyGroupResponse: AddPolicyGroupResponse,
    CreateEnvRequest: CreateEnvRequest,
    CreateDealResponse: CreateDealResponse,
    DatabaseMigrateQueryInfoRequest: DatabaseMigrateQueryInfoRequest,
    DescribeAuthDomainsRequest: DescribeAuthDomainsRequest,
    InqueryPriceRequest: InqueryPriceRequest,
    DatabaseMigrateImportRequest: DatabaseMigrateImportRequest,
    CreateEnvAndResourceResponse: CreateEnvAndResourceResponse,
    MonitorResource: MonitorResource,
    DescribeStorageACLTaskResponse: DescribeStorageACLTaskResponse,
    UpdateLoginConfigResponse: UpdateLoginConfigResponse,
    SetInvoiceSubjectRequest: SetInvoiceSubjectRequest,
    CreateMonitorConditionRequest: CreateMonitorConditionRequest,
    DescribeResourceLimitRequest: DescribeResourceLimitRequest,
    DescribePackagesRequest: DescribePackagesRequest,
    UserGetInfoResponse: UserGetInfoResponse,
    DescribeMonitorConditionResponse: DescribeMonitorConditionResponse,
    CollectionDispension: CollectionDispension,
    DescribeNextExpireTimeResponse: DescribeNextExpireTimeResponse,
    DescribeStorageStatusRequest: DescribeStorageStatusRequest,
    DescribeInvoicePostInfoResponse: DescribeInvoicePostInfoResponse,
    CallWxApiRequest: CallWxApiRequest,
    GetPolicyGroupListResponse: GetPolicyGroupListResponse,
    DescribePackagesResponse: DescribePackagesResponse,
    ModifyEnvRequest: ModifyEnvRequest,
    CreateEnvAndResourceForWxRequest: CreateEnvAndResourceForWxRequest,
    DescribeStorageStatusResponse: DescribeStorageStatusResponse,
    DeleteDealRequest: DeleteDealRequest,
    LimitInfo: LimitInfo,
    DescribeBillingInfoResponse: DescribeBillingInfoResponse,
    BindingPolicyObjectResponse: BindingPolicyObjectResponse,

}
