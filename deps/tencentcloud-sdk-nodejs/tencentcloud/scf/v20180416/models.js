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
 * ListHelpDoc请求参数结构体
 * @class
 */
class ListHelpDocRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 文档名称
     * @type {string || null}
     */
    this.Name = null;

    /**
     * 文档链接地址
     * @type {string || null}
     */
    this.Url = null;

    /**
     * 文档类型
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 文档展示状态
     * @type {string || null}
     */
    this.Status = null;

    /**
     * 文档描述
     * @type {string || null}
     */
    this.Describe = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Name = "Name" in params ? params.Name : null;
    this.Url = "Url" in params ? params.Url : null;
    this.Type = "Type" in params ? params.Type : null;
    this.Status = "Status" in params ? params.Status : null;
    this.Describe = "Describe" in params ? params.Describe : null;
  }
}

/**
 * GetUserMonthUsage请求参数结构体
 * @class
 */
class GetUserMonthUsageRequest extends AbstractModel {
  constructor() {
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
 * CreateFunctionTestModel请求参数结构体
 * @class
 */
class CreateFunctionTestModelRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数测试模板名称
     * @type {string || null}
     */
    this.TestModelName = null;

    /**
     * 函数测试模板值
     * @type {string || null}
     */
    this.TestModelValue = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.TestModelName =
      "TestModelName" in params ? params.TestModelName : null;
    this.TestModelValue =
      "TestModelValue" in params ? params.TestModelValue : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * DescribeDeviceFunctions请求参数结构体
 * @class
 */
class DescribeDeviceFunctionsRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;

    /**
     * 函数名称，支持模糊匹配
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 数据偏移量，默认值为 0
     * @type {number || null}
     */
    this.Offset = null;

    /**
     * 返回数据长度，默认值为 20
     * @type {number || null}
     */
    this.Limit = null;

    /**
     * 以升序还是降序的方式返回结果，可选值 ASC 和 DESC
     * @type {string || null}
     */
    this.Order = null;

    /**
     * 根据哪个字段进行返回结果排序,支持以下字段：AddTime, ModTime, FunctionName
     * @type {string || null}
     */
    this.Orderby = null;

    /**
     * 函数id
     * @type {string || null}
     */
    this.FunctionId = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Offset = "Offset" in params ? params.Offset : null;
    this.Limit = "Limit" in params ? params.Limit : null;
    this.Order = "Order" in params ? params.Order : null;
    this.Orderby = "Orderby" in params ? params.Orderby : null;
    this.FunctionId = "FunctionId" in params ? params.FunctionId : null;
  }
}

/**
 * 触发器类型
 * @class
 */
class Trigger extends AbstractModel {
  constructor() {
    super();

    /**
     * 触发器最后修改时间
     * @type {string || null}
     */
    this.ModTime = null;

    /**
     * 触发器类型
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 触发器详细配置
     * @type {string || null}
     */
    this.TriggerDesc = null;

    /**
     * 触发器名称
     * @type {string || null}
     */
    this.TriggerName = null;

    /**
     * 触发器创建时间
     * @type {string || null}
     */
    this.AddTime = null;

    /**
     * 使能开关
     * @type {number || null}
     */
    this.Enable = null;

    /**
     * 客户自定义参数
     * @type {string || null}
     */
    this.CustomArgument = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.ModTime = "ModTime" in params ? params.ModTime : null;
    this.Type = "Type" in params ? params.Type : null;
    this.TriggerDesc = "TriggerDesc" in params ? params.TriggerDesc : null;
    this.TriggerName = "TriggerName" in params ? params.TriggerName : null;
    this.AddTime = "AddTime" in params ? params.AddTime : null;
    this.Enable = "Enable" in params ? params.Enable : null;
    this.CustomArgument =
      "CustomArgument" in params ? params.CustomArgument : null;
  }
}

/**
 * DescribeNamespaces返回参数结构体
 * @class
 */
class DescribeNamespacesResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 命名空间列表
     * @type {Array.<string> || null}
     */
    this.Namespaces = null;

    /**
     * 总数
     * @type {number || null}
     */
    this.TotalCount = null;

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
    this.Namespaces = "Namespaces" in params ? params.Namespaces : null;
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * BindFunctionOnDevice返回参数结构体
 * @class
 */
class BindFunctionOnDeviceResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * InnerModifyInvokeRouting返回参数结构体
 * @class
 */
class InnerModifyInvokeRoutingResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * CreateSubscriptionDefinition请求参数结构体
 * @class
 */
class CreateSubscriptionDefinitionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;

    /**
     * 消息源，CLOUD：云端MQTT，LOCAL：本地设备，或者直接填写FunctionId
     * @type {string || null}
     */
    this.Source = null;

    /**
     * 消息目标，CLOUD：云端MQTT，LOCAL：本地设备，或者直接填写FunctionId
     * @type {string || null}
     */
    this.Target = null;

    /**
     * 消息主体
     * @type {string || null}
     */
    this.Topic = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
    this.Source = "Source" in params ? params.Source : null;
    this.Target = "Target" in params ? params.Target : null;
    this.Topic = "Topic" in params ? params.Topic : null;
  }
}

/**
 * GetTempCosInfo请求参数结构体
 * @class
 */
class GetTempCosInfoRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * cos的object路径 格式为appid/namespace/functionname.zip
     * @type {string || null}
     */
    this.ObjectPath = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.ObjectPath = "ObjectPath" in params ? params.ObjectPath : null;
  }
}

/**
 * DescribeDevices返回参数结构体
 * @class
 */
class DescribeDevicesResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备列表
     * @type {Array.<Device> || null}
     */
    this.Devices = null;

    /**
     * 总数
     * @type {number || null}
     */
    this.TotalCount = null;

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

    if (params.Devices) {
      this.Devices = new Array();
      for (let z in params.Devices) {
        let obj = new Device();
        obj.deserialize(params.Devices[z]);
        this.Devices.push(obj);
      }
    }
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * GetFunctionTotalNum返回参数结构体
 * @class
 */
class GetFunctionTotalNumResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数总量
     * @type {number || null}
     */
    this.FunctionTotalNum = null;

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
    this.FunctionTotalNum =
      "FunctionTotalNum" in params ? params.FunctionTotalNum : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * GetTempCosInfo返回参数结构体
 * @class
 */
class GetTempCosInfoResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 上传文件时的签名
     * @type {string || null}
     */
    this.Sign = null;

    /**
     * 服务器日期
     * @type {string || null}
     */
    this.Date = null;

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
    this.Sign = "Sign" in params ? params.Sign : null;
    this.Date = "Date" in params ? params.Date : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * InnerCreateInvokeRouting返回参数结构体
 * @class
 */
class InnerCreateInvokeRoutingResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * BindFunctionOnDevice请求参数结构体
 * @class
 */
class BindFunctionOnDeviceRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;

    /**
     * 函数Id
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 使用内存
     * @type {number || null}
     */
    this.Memory = null;

    /**
     * 超时时长，触发运行模式需要填写此参数
     * @type {number || null}
     */
    this.Timeout = null;

    /**
     * TRIGGER 触发运行，PERSISTENCE 持久运行
     * @type {string || null}
     */
    this.RunMode = null;

    /**
     * 函数版本，不能绑定$LATEST版本的
     * @type {string || null}
     */
    this.FunctionVersion = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Memory = "Memory" in params ? params.Memory : null;
    this.Timeout = "Timeout" in params ? params.Timeout : null;
    this.RunMode = "RunMode" in params ? params.RunMode : null;
    this.FunctionVersion =
      "FunctionVersion" in params ? params.FunctionVersion : null;
  }
}

/**
 * GetUserMonthUsage返回参数结构体
 * @class
 */
class GetUserMonthUsageResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 内存持续时间
     * @type {number || null}
     */
    this.Gbs = null;

    /**
     * 流量
     * @type {number || null}
     */
    this.Outflow = null;

    /**
     * 触发次数
     * @type {number || null}
     */
    this.InvokeCount = null;

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
    this.Gbs = "Gbs" in params ? params.Gbs : null;
    this.Outflow = "Outflow" in params ? params.Outflow : null;
    this.InvokeCount = "InvokeCount" in params ? params.InvokeCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * 已使用的信息
 * @class
 */
class UsageInfo extends AbstractModel {
  constructor() {
    super();

    /**
     * 命名空间个数
     * @type {number || null}
     */
    this.NamespacesCount = null;

    /**
     * 命名空间详情
     * @type {Array.<NamespaceUsage> || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.NamespacesCount =
      "NamespacesCount" in params ? params.NamespacesCount : null;

    if (params.Namespace) {
      this.Namespace = new Array();
      for (let z in params.Namespace) {
        let obj = new NamespaceUsage();
        obj.deserialize(params.Namespace[z]);
        this.Namespace.push(obj);
      }
    }
  }
}

/**
 * 变量参数
 * @class
 */
class Variable extends AbstractModel {
  constructor() {
    super();

    /**
     * 变量的名称
     * @type {string || null}
     */
    this.Key = null;

    /**
     * 变量的值
     * @type {string || null}
     */
    this.Value = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Key = "Key" in params ? params.Key : null;
    this.Value = "Value" in params ? params.Value : null;
  }
}

/**
 * InnerCreateInvokeRouting请求参数结构体
 * @class
 */
class InnerCreateInvokeRoutingRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 路由类型, appid|stamp, 优先appid其次stamp,  stamp的值只支持MINI_QCBASE
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 路由类型对应的值
     * @type {string || null}
     */
    this.Value = null;

    /**
     * 路由到后端的L5 modId
     * @type {number || null}
     */
    this.L5ModId = null;

    /**
     * 路由到后端的L5 cmdId
     * @type {number || null}
     */
    this.L5CmdId = null;

    /**
     * 路由到后端的ip或域名， 目前仅支持L5, 此参数设置无效
     * @type {string || null}
     */
    this.Domain = null;

    /**
     * 路由到后端的端口
     * @type {number || null}
     */
    this.Port = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Type = "Type" in params ? params.Type : null;
    this.Value = "Value" in params ? params.Value : null;
    this.L5ModId = "L5ModId" in params ? params.L5ModId : null;
    this.L5CmdId = "L5CmdId" in params ? params.L5CmdId : null;
    this.Domain = "Domain" in params ? params.Domain : null;
    this.Port = "Port" in params ? params.Port : null;
  }
}

/**
 * UpdateFunctionTestModel请求参数结构体
 * @class
 */
class UpdateFunctionTestModelRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 测试模板的名称
     * @type {string || null}
     */
    this.TestModelName = null;

    /**
     * 测试模板的值
     * @type {string || null}
     */
    this.TestModelValue = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.TestModelName =
      "TestModelName" in params ? params.TestModelName : null;
    this.TestModelValue =
      "TestModelValue" in params ? params.TestModelValue : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * InnerDeleteInvokeRouting返回参数结构体
 * @class
 */
class InnerDeleteInvokeRoutingResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * InnerModifyInvokeRouting请求参数结构体
 * @class
 */
class InnerModifyInvokeRoutingRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 路由类型, appid|stamp, 优先appid其次stamp,  stamp的值只支持MINI_QCBASE
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 路由类型对应的值
     * @type {string || null}
     */
    this.Value = null;

    /**
     * 路由到后端的L5 modId
     * @type {number || null}
     */
    this.L5ModId = null;

    /**
     * 路由到后端的L5 cmdId
     * @type {number || null}
     */
    this.L5CmdId = null;

    /**
     * 路由到后端的ip或域名， 目前仅支持L5, 此参数设置无效
     * @type {string || null}
     */
    this.Domain = null;

    /**
     * 路由到后端的端口
     * @type {number || null}
     */
    this.Port = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Type = "Type" in params ? params.Type : null;
    this.Value = "Value" in params ? params.Value : null;
    this.L5ModId = "L5ModId" in params ? params.L5ModId : null;
    this.L5CmdId = "L5CmdId" in params ? params.L5CmdId : null;
    this.Domain = "Domain" in params ? params.Domain : null;
    this.Port = "Port" in params ? params.Port : null;
  }
}

/**
 * GetFunctionTestModel请求参数结构体
 * @class
 */
class GetFunctionTestModelRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 测试模板的名称
     * @type {string || null}
     */
    this.TestModelName = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.TestModelName =
      "TestModelName" in params ? params.TestModelName : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * GetFunctionLogs请求参数结构体
 * @class
 */
class GetFunctionLogsRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 数据的偏移量，Offset+Limit不能大于10000
     * @type {number || null}
     */
    this.Offset = null;

    /**
     * 返回数据的长度，Offset+Limit不能大于10000
     * @type {number || null}
     */
    this.Limit = null;

    /**
     * 以升序还是降序的方式对日志进行排序，可选值 desc和 acs
     * @type {string || null}
     */
    this.Order = null;

    /**
     * 根据某个字段排序日志,支持以下字段：function_name, duration, mem_usage, start_time
     * @type {string || null}
     */
    this.OrderBy = null;

    /**
     * 日志过滤条件。可用来区分正确和错误日志，filter.retCode=not0 表示只返回错误日志，filter.retCode=is0 表示只返回正确日志，不传，则返回所有日志
     * @type {LogFilter || null}
     */
    this.Filter = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 函数的版本
     * @type {string || null}
     */
    this.Qualifier = null;

    /**
     * 执行该函数对应的requestId
     * @type {string || null}
     */
    this.FunctionRequestId = null;

    /**
     * 查询的具体日期，例如：2017-05-16 20:00:00，只能与endtime相差一天之内
     * @type {string || null}
     */
    this.StartTime = null;

    /**
     * 查询的具体日期，例如：2017-05-16 20:59:59，只能与startTime相差一天之内
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
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Offset = "Offset" in params ? params.Offset : null;
    this.Limit = "Limit" in params ? params.Limit : null;
    this.Order = "Order" in params ? params.Order : null;
    this.OrderBy = "OrderBy" in params ? params.OrderBy : null;

    if (params.Filter) {
      let obj = new LogFilter();
      obj.deserialize(params.Filter);
      this.Filter = obj;
    }
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.Qualifier = "Qualifier" in params ? params.Qualifier : null;
    this.FunctionRequestId =
      "FunctionRequestId" in params ? params.FunctionRequestId : null;
    this.StartTime = "StartTime" in params ? params.StartTime : null;
    this.EndTime = "EndTime" in params ? params.EndTime : null;
  }
}

/**
 * 命名空间
 * @class
 */
class Namespaces extends AbstractModel {
  constructor() {
    super();

    /**
     * 命名空间创建时间
     * @type {string || null}
     */
    this.ModTime = null;

    /**
     * 命名空间修改时间
     * @type {string || null}
     */
    this.AddTime = null;

    /**
     * 命名空间描述
     * @type {string || null}
     */
    this.Description = null;

    /**
     * 命名空间名称
     * @type {string || null}
     */
    this.Name = null;

    /**
     * 是否为小程序的命名空间
     * @type {string || null}
     */
    this.Type = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.ModTime = "ModTime" in params ? params.ModTime : null;
    this.AddTime = "AddTime" in params ? params.AddTime : null;
    this.Description = "Description" in params ? params.Description : null;
    this.Name = "Name" in params ? params.Name : null;
    this.Type = "Type" in params ? params.Type : null;
  }
}

/**
 * InnerStopService返回参数结构体
 * @class
 */
class InnerStopServiceResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * ListFunctionsForTrade请求参数结构体
 * @class
 */
class ListFunctionsForTradeRequest extends AbstractModel {
  constructor() {
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
 * 函数标签
 * @class
 */
class Tag extends AbstractModel {
  constructor() {
    super();

    /**
     * 标签的key
     * @type {string || null}
     */
    this.Key = null;

    /**
     * 标签的value
     * @type {string || null}
     */
    this.Value = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Key = "Key" in params ? params.Key : null;
    this.Value = "Value" in params ? params.Value : null;
  }
}

/**
 * GetFunctionUsageTriggerCount返回参数结构体
 * @class
 */
class GetFunctionUsageTriggerCountResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * Cos触发器数量
     * @type {number || null}
     */
    this.Cos = null;

    /**
     * Cmq触发器数量
     * @type {number || null}
     */
    this.Cmq = null;

    /**
     * Timer触发器数量
     * @type {number || null}
     */
    this.Timer = null;

    /**
     * 总触发数量
     * @type {number || null}
     */
    this.Total = null;

    /**
     * Ckafka触发器数量
     * @type {number || null}
     */
    this.Ckafka = null;

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
    this.Cos = "Cos" in params ? params.Cos : null;
    this.Cmq = "Cmq" in params ? params.Cmq : null;
    this.Timer = "Timer" in params ? params.Timer : null;
    this.Total = "Total" in params ? params.Total : null;
    this.Ckafka = "Ckafka" in params ? params.Ckafka : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * Subscription
 * @class
 */
class Subscription extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;

    /**
     * 规则ID
     * @type {string || null}
     */
    this.SubscriptionDefinitionId = null;

    /**
     * 消息源，CLOUD：云端MQTT，LOCAL：本地设备，或者直接填写FunctionId
     * @type {string || null}
     */
    this.Source = null;

    /**
     * 消息目标，CLOUD：云端MQTT，LOCAL：本地设备，或者直接填写FunctionId
     * @type {string || null}
     */
    this.Target = null;

    /**
     * 创建时间
     * @type {string || null}
     */
    this.AddTime = null;

    /**
     * 更新时间
     * @type {string || null}
     */
    this.ModTime = null;

    /**
     * 消息主体
     * @type {string || null}
     */
    this.Topic = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
    this.SubscriptionDefinitionId =
      "SubscriptionDefinitionId" in params
        ? params.SubscriptionDefinitionId
        : null;
    this.Source = "Source" in params ? params.Source : null;
    this.Target = "Target" in params ? params.Target : null;
    this.AddTime = "AddTime" in params ? params.AddTime : null;
    this.ModTime = "ModTime" in params ? params.ModTime : null;
    this.Topic = "Topic" in params ? params.Topic : null;
  }
}

/**
 * 日志过滤条件，用于区分正确与错误日志
 * @class
 */
class LogFilter extends AbstractModel {
  constructor() {
    super();

    /**
     * filter.RetCode=not0 表示只返回错误日志，filter.RetCode=is0 表示只返回正确日志，无输入则返回所有日志。
     * @type {string || null}
     */
    this.RetCode = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.RetCode = "RetCode" in params ? params.RetCode : null;
  }
}

/**
 * DeviceFunction
 * @class
 */
class DeviceFunction extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;

    /**
     * 函数ID
     * @type {string || null}
     */
    this.FunctionId = null;

    /**
     * 函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 绑定时间
     * @type {string || null}
     */
    this.AddTime = null;

    /**
     * 修改时间
     * @type {string || null}
     */
    this.ModTime = null;

    /**
     * 运行环境
     * @type {string || null}
     */
    this.Runtime = null;

    /**
     * 函数版本
     * @type {string || null}
     */
    this.FunctionVersion = null;

    /**
     * SYNC已同步，UNSYNC未同步
     * @type {string || null}
     */
    this.Status = null;

    /**
     * TRIGGER 触发运行，PERSISTENCE 持久运行
     * @type {string || null}
     */
    this.RunMode = null;

    /**
     * 超时时长，触发运行模式需要填写此参数，秒
     * @type {number || null}
     */
    this.Timeout = null;

    /**
     * 内存
     * @type {number || null}
     */
    this.Memory = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
    this.FunctionId = "FunctionId" in params ? params.FunctionId : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.AddTime = "AddTime" in params ? params.AddTime : null;
    this.ModTime = "ModTime" in params ? params.ModTime : null;
    this.Runtime = "Runtime" in params ? params.Runtime : null;
    this.FunctionVersion =
      "FunctionVersion" in params ? params.FunctionVersion : null;
    this.Status = "Status" in params ? params.Status : null;
    this.RunMode = "RunMode" in params ? params.RunMode : null;
    this.Timeout = "Timeout" in params ? params.Timeout : null;
    this.Memory = "Memory" in params ? params.Memory : null;
  }
}

/**
 * 账户目前使用量
 * @class
 */
class AccountUsage extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的数量
     * @type {number || null}
     */
    this.FunctionCount = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionCount =
      "FunctionCount" in params ? params.FunctionCount : null;
  }
}

/**
 * GetDemoDetail请求参数结构体
 * @class
 */
class GetDemoDetailRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * demo的ID
     * @type {string || null}
     */
    this.DemoId = null;

    /**
     * demo的描述语言
     * @type {string || null}
     */
    this.InternationalLanguage = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DemoId = "DemoId" in params ? params.DemoId : null;
    this.InternationalLanguage =
      "InternationalLanguage" in params ? params.InternationalLanguage : null;
  }
}

/**
 * DeleteFunction请求参数结构体
 * @class
 */
class DeleteFunctionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 要删除的函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数所属命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * CopyFunction返回参数结构体
 * @class
 */
class CopyFunctionResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * InnerDeleteInvokeRouting请求参数结构体
 * @class
 */
class InnerDeleteInvokeRoutingRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 路由类型, appid|stamp, 优先appid其次stamp,  stamp的值只支持MINI_QCBASE
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 路由类型对应的值
     * @type {string || null}
     */
    this.Value = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Type = "Type" in params ? params.Type : null;
    this.Value = "Value" in params ? params.Value : null;
  }
}

/**
 * DeployFunctionAndSubscriptionDefinition请求参数结构体
 * @class
 */
class DeployFunctionAndSubscriptionDefinitionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
  }
}

/**
 * UpdateFunctionTestModel返回参数结构体
 * @class
 */
class UpdateFunctionTestModelResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DescribeFunctionQuota请求参数结构体
 * @class
 */
class DescribeFunctionQuotaRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 用户的AppId
     * @type {number || null}
     */
    this.UserAppId = null;

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 用户的Uin
     * @type {number || null}
     */
    this.UserUin = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.UserAppId = "UserAppId" in params ? params.UserAppId : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.UserUin = "UserUin" in params ? params.UserUin : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * ListNamespaces请求参数结构体
 * @class
 */
class ListNamespacesRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 返回数据长度，默认值为 20
     * @type {number || null}
     */
    this.Limit = null;

    /**
     * 数据的偏移量，默认值为 0
     * @type {number || null}
     */
    this.Offset = null;

    /**
     * 根据哪个字段进行返回结果排序,支持以下字段：Name,Updatetime
     * @type {string || null}
     */
    this.Orderby = null;

    /**
     * 以升序还是降序的方式返回结果，可选值 ASC 和 DESC
     * @type {string || null}
     */
    this.Order = null;

    /**
     * 支持Namespace，Description的模糊匹配，Key的取值为[['Namespace', 'Description']，如一个Key需要同时满足多个条件，则需要用“|”隔开  如：SearchKey.0.Key=Description&SearchKey.0.Value=blankfunc|helloworld
     * @type {Array.<SearchKey> || null}
     */
    this.SearchKey = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Limit = "Limit" in params ? params.Limit : null;
    this.Offset = "Offset" in params ? params.Offset : null;
    this.Orderby = "Orderby" in params ? params.Orderby : null;
    this.Order = "Order" in params ? params.Order : null;

    if (params.SearchKey) {
      this.SearchKey = new Array();
      for (let z in params.SearchKey) {
        let obj = new SearchKey();
        obj.deserialize(params.SearchKey[z]);
        this.SearchKey.push(obj);
      }
    }
  }
}

/**
 * PublishVersion请求参数结构体
 * @class
 */
class PublishVersionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 发布函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数的描述
     * @type {string || null}
     */
    this.Description = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Description = "Description" in params ? params.Description : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * ListVersionByFunction返回参数结构体
 * @class
 */
class ListVersionByFunctionResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数版本。
     * @type {Array.<string> || null}
     */
    this.FunctionVersion = null;

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
    this.FunctionVersion =
      "FunctionVersion" in params ? params.FunctionVersion : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * UpdateFunctionQuota返回参数结构体
 * @class
 */
class UpdateFunctionQuotaResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * CreateSubscriptionDefinition返回参数结构体
 * @class
 */
class CreateSubscriptionDefinitionResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * SubscriptionDefinitionId
     * @type {string || null}
     */
    this.SubscriptionDefinitionId = null;

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
    this.SubscriptionDefinitionId =
      "SubscriptionDefinitionId" in params
        ? params.SubscriptionDefinitionId
        : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * InnerStopService请求参数结构体
 * @class
 */
class InnerStopServiceRequest extends AbstractModel {
  constructor() {
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
 * CreateNamespace返回参数结构体
 * @class
 */
class CreateNamespaceResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DeleteDevice请求参数结构体
 * @class
 */
class DeleteDeviceRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * IOThub来的设备需要传递此参数
     * @type {IotHubDeviceDel || null}
     */
    this.IotHub = null;

    /**
     * IOTMq来的设备需要传递此参数
     * @type {IotMqDeviceDel || null}
     */
    this.IotMq = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }

    if (params.IotHub) {
      let obj = new IotHubDeviceDel();
      obj.deserialize(params.IotHub);
      this.IotHub = obj;
    }

    if (params.IotMq) {
      let obj = new IotMqDeviceDel();
      obj.deserialize(params.IotMq);
      this.IotMq = obj;
    }
  }
}

/**
 * ListFunctionsForTrade返回参数结构体
 * @class
 */
class ListFunctionsForTradeResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 计费函数信息
     * @type {Array.<TradeFunction> || null}
     */
    this.DeviceList = null;

    /**
     * 计费函数总数
     * @type {number || null}
     */
    this.TotalCount = null;

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

    if (params.DeviceList) {
      this.DeviceList = new Array();
      for (let z in params.DeviceList) {
        let obj = new TradeFunction();
        obj.deserialize(params.DeviceList[z]);
        this.DeviceList.push(obj);
      }
    }
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * UpdateFunctionCode请求参数结构体
 * @class
 */
class UpdateFunctionCodeRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数处理方法名称。名称格式支持“文件名称.函数名称”形式，文件名称和函数名称之间以"."隔开，文件名称和函数名称要求以字母开始和结尾，中间允许插入字母、数字、下划线和连接符，文件名称和函数名字的长度要求 2-60 个字符
     * @type {string || null}
     */
    this.Handler = null;

    /**
     * 要修改的函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 对象存储桶名称
     * @type {string || null}
     */
    this.CosBucketName = null;

    /**
     * 对象存储对象路径
     * @type {string || null}
     */
    this.CosObjectName = null;

    /**
     * 包含函数代码文件及其依赖项的 zip 格式文件，使用该接口时要求将 zip 文件的内容转成 base64 编码，最大支持20M
     * @type {string || null}
     */
    this.ZipFile = null;

    /**
     * 函数所属命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 对象存储的地域，注：北京分为ap-beijing和ap-beijing-1
     * @type {string || null}
     */
    this.CosBucketRegion = null;

    /**
     * 函数入口文件的zip格式，如果只需要更新入口文件，可以使用次参数，使用该接口时要求将 zip 文件的内容转成 base64 编码，最大支持20M
     * @type {string || null}
     */
    this.InlineZipFile = null;

    /**
     * TempCos中的对象名称
     * @type {string || null}
     */
    this.TempCosObjectName = null;

    /**
     * 是否自动安装依赖
     * @type {string || null}
     */
    this.InstallDependency = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Handler = "Handler" in params ? params.Handler : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.CosBucketName =
      "CosBucketName" in params ? params.CosBucketName : null;
    this.CosObjectName =
      "CosObjectName" in params ? params.CosObjectName : null;
    this.ZipFile = "ZipFile" in params ? params.ZipFile : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.CosBucketRegion =
      "CosBucketRegion" in params ? params.CosBucketRegion : null;
    this.InlineZipFile =
      "InlineZipFile" in params ? params.InlineZipFile : null;
    this.TempCosObjectName =
      "TempCosObjectName" in params ? params.TempCosObjectName : null;
    this.InstallDependency =
      "InstallDependency" in params ? params.InstallDependency : null;
  }
}

/**
 * DeleteSubscriptionDefinition返回参数结构体
 * @class
 */
class DeleteSubscriptionDefinitionResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DeleteFunctionTestModel请求参数结构体
 * @class
 */
class DeleteFunctionTestModelRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 测试模板的名称
     * @type {string || null}
     */
    this.TestModelName = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.TestModelName =
      "TestModelName" in params ? params.TestModelName : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * GetAccountSettings返回参数结构体
 * @class
 */
class GetAccountSettingsResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 账户最大限制
     * @type {AccountLimit || null}
     */
    this.AccountLimit = null;

    /**
     * 账户使用量
     * @type {AccountUsage || null}
     */
    this.AccountUsage = null;

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

    if (params.AccountLimit) {
      let obj = new AccountLimit();
      obj.deserialize(params.AccountLimit);
      this.AccountLimit = obj;
    }

    if (params.AccountUsage) {
      let obj = new AccountUsage();
      obj.deserialize(params.AccountUsage);
      this.AccountUsage = obj;
    }
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DeleteFunctionTestModel返回参数结构体
 * @class
 */
class DeleteFunctionTestModelResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * CreateFunctionTestModel返回参数结构体
 * @class
 */
class CreateFunctionTestModelResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * CopyFunction请求参数结构体
 * @class
 */
class CopyFunctionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数名
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 新函数的名称
     * @type {string || null}
     */
    this.NewFunctionName = null;

    /**
     * 命名空间，默认为default
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 将函数复制到的命名空间，默认为default
     * @type {string || null}
     */
    this.TargetNamespace = null;

    /**
     * 函数描述
     * @type {string || null}
     */
    this.Description = null;

    /**
     * 要将函数复制到的地域，不填则默认为当前地域
     * @type {string || null}
     */
    this.TargetRegion = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.NewFunctionName =
      "NewFunctionName" in params ? params.NewFunctionName : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.TargetNamespace =
      "TargetNamespace" in params ? params.TargetNamespace : null;
    this.Description = "Description" in params ? params.Description : null;
    this.TargetRegion = "TargetRegion" in params ? params.TargetRegion : null;
  }
}

/**
 * DeleteNamespace返回参数结构体
 * @class
 */
class DeleteNamespaceResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * InnerRestoreService返回参数结构体
 * @class
 */
class InnerRestoreServiceResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * TriggerCount描述不同类型触发器的数量
 * @class
 */
class TriggerCount extends AbstractModel {
  constructor() {
    super();

    /**
     * Cos触发器数量
     * @type {number || null}
     */
    this.Cos = null;

    /**
     * Timer触发器数量
     * @type {number || null}
     */
    this.Timer = null;

    /**
     * Cmq触发器数量
     * @type {number || null}
     */
    this.Cmq = null;

    /**
     * 触发器总数
     * @type {number || null}
     */
    this.Total = null;

    /**
     * Ckafka触发器数量
     * @type {number || null}
     */
    this.Ckafka = null;

    /**
     * Apigw触发器数量
     * @type {number || null}
     */
    this.Apigw = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Cos = "Cos" in params ? params.Cos : null;
    this.Timer = "Timer" in params ? params.Timer : null;
    this.Cmq = "Cmq" in params ? params.Cmq : null;
    this.Total = "Total" in params ? params.Total : null;
    this.Ckafka = "Ckafka" in params ? params.Ckafka : null;
    this.Apigw = "Apigw" in params ? params.Apigw : null;
  }
}

/**
 * 命名空间限制
 * @class
 */
class NamespaceLimit extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数总数
     * @type {number || null}
     */
    this.FunctionsCount = null;

    /**
     * Trigger信息
     * @type {TriggerCount || null}
     */
    this.Trigger = null;

    /**
     * Namespace名称
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 并发量
     * @type {number || null}
     */
    this.ConcurrentExecutions = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionsCount =
      "FunctionsCount" in params ? params.FunctionsCount : null;

    if (params.Trigger) {
      let obj = new TriggerCount();
      obj.deserialize(params.Trigger);
      this.Trigger = obj;
    }
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.ConcurrentExecutions =
      "ConcurrentExecutions" in params ? params.ConcurrentExecutions : null;
  }
}

/**
 * UpdateFunctionConfiguration请求参数结构体
 * @class
 */
class UpdateFunctionConfigurationRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 要修改的函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数描述。最大支持 1000 个英文字母、数字、空格、逗号和英文句号，支持中文
     * @type {string || null}
     */
    this.Description = null;

    /**
     * 函数运行时内存大小，默认为 128 M，可选范 128 M-1536 M
     * @type {number || null}
     */
    this.MemorySize = null;

    /**
     * 函数最长执行时间，单位为秒，可选值范 1-300 秒，默认为 3 秒
     * @type {number || null}
     */
    this.Timeout = null;

    /**
     * 函数运行环境，目前仅支持 Python2.7，Python3.6，Nodejs6.10，PHP5， PHP7，Golang1 和 Java8
     * @type {string || null}
     */
    this.Runtime = null;

    /**
     * 函数的环境变量
     * @type {Environment || null}
     */
    this.Environment = null;

    /**
     * 是否使用GPU进行计算
     * @type {string || null}
     */
    this.UseGpu = null;

    /**
     * 函数所属命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 函数的私有网络配置
     * @type {VpcConfig || null}
     */
    this.VpcConfig = null;

    /**
     * 函数绑定的角色
     * @type {string || null}
     */
    this.Role = null;

    /**
     * 是否自动安装依赖
     * @type {string || null}
     */
    this.InstallDependency = null;

    /**
     * 日志投递到的cls日志集ID
     * @type {string || null}
     */
    this.ClsLogsetId = null;

    /**
     * 日志投递到的cls Topic ID
     * @type {string || null}
     */
    this.ClsTopicId = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Description = "Description" in params ? params.Description : null;
    this.MemorySize = "MemorySize" in params ? params.MemorySize : null;
    this.Timeout = "Timeout" in params ? params.Timeout : null;
    this.Runtime = "Runtime" in params ? params.Runtime : null;

    if (params.Environment) {
      let obj = new Environment();
      obj.deserialize(params.Environment);
      this.Environment = obj;
    }
    this.UseGpu = "UseGpu" in params ? params.UseGpu : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;

    if (params.VpcConfig) {
      let obj = new VpcConfig();
      obj.deserialize(params.VpcConfig);
      this.VpcConfig = obj;
    }
    this.Role = "Role" in params ? params.Role : null;
    this.InstallDependency =
      "InstallDependency" in params ? params.InstallDependency : null;
    this.ClsLogsetId = "ClsLogsetId" in params ? params.ClsLogsetId : null;
    this.ClsTopicId = "ClsTopicId" in params ? params.ClsTopicId : null;
  }
}

/**
 * DeleteNamespace请求参数结构体
 * @class
 */
class DeleteNamespaceRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 命名空间名称
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * ListFunctions请求参数结构体
 * @class
 */
class ListFunctionsRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 以升序还是降序的方式返回结果，可选值 ASC 和 DESC
     * @type {string || null}
     */
    this.Order = null;

    /**
     * 根据哪个字段进行返回结果排序,支持以下字段：AddTime, ModTime, FunctionName
     * @type {string || null}
     */
    this.Orderby = null;

    /**
     * 数据偏移量，默认值为 0
     * @type {number || null}
     */
    this.Offset = null;

    /**
     * 返回数据长度，默认值为 20
     * @type {number || null}
     */
    this.Limit = null;

    /**
     * 支持FunctionName模糊匹配
     * @type {string || null}
     */
    this.SearchKey = null;

    /**
     * 命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 函数描述，支持模糊搜索
     * @type {string || null}
     */
    this.Description = null;

    /**
         * 过滤条件。
- tag:tag-key - String - 是否必填：否 - （过滤条件）按照标签键值对进行过滤。 tag-key使用具体的标签键进行替换。

每次请求的Filters的上限为10，Filter.Values的上限为5。
         * @type {Array.<Filter> || null}
         */
    this.Filters = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Order = "Order" in params ? params.Order : null;
    this.Orderby = "Orderby" in params ? params.Orderby : null;
    this.Offset = "Offset" in params ? params.Offset : null;
    this.Limit = "Limit" in params ? params.Limit : null;
    this.SearchKey = "SearchKey" in params ? params.SearchKey : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.Description = "Description" in params ? params.Description : null;

    if (params.Filters) {
      this.Filters = new Array();
      for (let z in params.Filters) {
        let obj = new Filter();
        obj.deserialize(params.Filters[z]);
        this.Filters.push(obj);
      }
    }
  }
}

/**
 * CreateDevice返回参数结构体
 * @class
 */
class CreateDeviceResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;

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
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * CreateDevice请求参数结构体
 * @class
 */
class CreateDeviceRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * IOThub来的设备需要传递此参数
     * @type {IotHub || null}
     */
    this.IotHub = null;

    /**
     * IOTMq来的设备需要传递此参数
     * @type {IotMq || null}
     */
    this.IotMq = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }

    if (params.IotHub) {
      let obj = new IotHub();
      obj.deserialize(params.IotHub);
      this.IotHub = obj;
    }

    if (params.IotMq) {
      let obj = new IotMq();
      obj.deserialize(params.IotMq);
      this.IotMq = obj;
    }
  }
}

/**
 * UpdateFunctionQuota请求参数结构体
 * @class
 */
class UpdateFunctionQuotaRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数可使用最小配额
     * @type {number || null}
     */
    this.ContainerMinNum = null;

    /**
     * 函数可使用最大配额
     * @type {number || null}
     */
    this.ContainerMaxNum = null;

    /**
     * 待修改用户的AppId
     * @type {number || null}
     */
    this.UserAppId = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 待修改用户的Uin
     * @type {number || null}
     */
    this.UserUin = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.ContainerMinNum =
      "ContainerMinNum" in params ? params.ContainerMinNum : null;
    this.ContainerMaxNum =
      "ContainerMaxNum" in params ? params.ContainerMaxNum : null;
    this.UserAppId = "UserAppId" in params ? params.UserAppId : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.UserUin = "UserUin" in params ? params.UserUin : null;
  }
}

/**
 * CreateTrigger请求参数结构体
 * @class
 */
class CreateTriggerRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 新建触发器绑定的函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 新建触发器名称。如果是定时触发器，名称支持英文字母、数字、连接符和下划线，最长100个字符；如果是其他触发器，见具体触发器绑定参数的说明
     * @type {string || null}
     */
    this.TriggerName = null;

    /**
     * 触发器类型，目前支持 cos 、cmq、 timer、 ckafka类型
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 触发器对应的参数，如果是 timer 类型的触发器其内容是 Linux cron 表达式，如果是其他触发器，见具体触发器说明
     * @type {string || null}
     */
    this.TriggerDesc = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 函数的版本
     * @type {string || null}
     */
    this.Qualifier = null;

    /**
     * 触发器的初始是能状态 OPEN表示开启 CLOSE表示关闭
     * @type {string || null}
     */
    this.Enable = null;

    /**
     * 客户的自定义参数
     * @type {string || null}
     */
    this.CustomArgument = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.TriggerName = "TriggerName" in params ? params.TriggerName : null;
    this.Type = "Type" in params ? params.Type : null;
    this.TriggerDesc = "TriggerDesc" in params ? params.TriggerDesc : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.Qualifier = "Qualifier" in params ? params.Qualifier : null;
    this.Enable = "Enable" in params ? params.Enable : null;
    this.CustomArgument =
      "CustomArgument" in params ? params.CustomArgument : null;
  }
}

/**
 * ListFunctionTestModels返回参数结构体
 * @class
 */
class ListFunctionTestModelsResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 测试模板总数量
     * @type {number || null}
     */
    this.TotalCount = null;

    /**
     * 测试模板名称数组
     * @type {Array.<string> || null}
     */
    this.TestModels = null;

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
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;
    this.TestModels = "TestModels" in params ? params.TestModels : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DeleteFunction返回参数结构体
 * @class
 */
class DeleteFunctionResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * UpdateNamespace返回参数结构体
 * @class
 */
class UpdateNamespaceResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DeployFunctionAndSubscriptionDefinition返回参数结构体
 * @class
 */
class DeployFunctionAndSubscriptionDefinitionResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * 运行函数的返回
 * @class
 */
class Result extends AbstractModel {
  constructor() {
    super();

    /**
     * 表示执行过程中的日志输出，异步调用返回为空
     * @type {string || null}
     */
    this.Log = null;

    /**
     * 表示执行函数的返回，异步调用返回为空
     * @type {string || null}
     */
    this.RetMsg = null;

    /**
     * 表示执行函数的错误返回信息，异步调用返回为空
     * @type {string || null}
     */
    this.ErrMsg = null;

    /**
     * 执行函数时的内存大小，单位为Byte，异步调用返回为空
     * @type {number || null}
     */
    this.MemUsage = null;

    /**
     * 表示执行函数的耗时，单位是毫秒，异步调用返回为空
     * @type {number || null}
     */
    this.Duration = null;

    /**
     * 表示函数的计费耗时，单位是毫秒，异步调用返回为空
     * @type {number || null}
     */
    this.BillDuration = null;

    /**
     * 此次函数执行的Id
     * @type {string || null}
     */
    this.FunctionRequestId = null;

    /**
     * 0为正确，异步调用返回为空
     * @type {number || null}
     */
    this.InvokeResult = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Log = "Log" in params ? params.Log : null;
    this.RetMsg = "RetMsg" in params ? params.RetMsg : null;
    this.ErrMsg = "ErrMsg" in params ? params.ErrMsg : null;
    this.MemUsage = "MemUsage" in params ? params.MemUsage : null;
    this.Duration = "Duration" in params ? params.Duration : null;
    this.BillDuration = "BillDuration" in params ? params.BillDuration : null;
    this.FunctionRequestId =
      "FunctionRequestId" in params ? params.FunctionRequestId : null;
    this.InvokeResult = "InvokeResult" in params ? params.InvokeResult : null;
  }
}

/**
 * 后端invoke地址信息
 * @class
 */
class InvokeRouting extends AbstractModel {
  constructor() {
    super();

    /**
     * 类型, 需为appid|stamp
     * @type {string || null}
     */
    this.Type = null;

    /**
     * Type对应的值
     * @type {string || null}
     */
    this.Value = null;

    /**
     * 后端invoke地址的L5 modId
     * @type {number || null}
     */
    this.L5ModId = null;

    /**
     * 后端invoke地址的L5 cmdId
     * @type {number || null}
     */
    this.L5CmdId = null;

    /**
         * 后端invoke地址实际域名或ip, 默认null, 注意次字段配置了也未生效, 后端地址以CL5的配置为准
注意：此字段可能返回 null，表示取不到有效值。
         * @type {string || null}
         */
    this.Domain = null;

    /**
     * 后端invoke地址的端口, 默认80
     * @type {number || null}
     */
    this.Port = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Type = "Type" in params ? params.Type : null;
    this.Value = "Value" in params ? params.Value : null;
    this.L5ModId = "L5ModId" in params ? params.L5ModId : null;
    this.L5CmdId = "L5CmdId" in params ? params.L5CmdId : null;
    this.Domain = "Domain" in params ? params.Domain : null;
    this.Port = "Port" in params ? params.Port : null;
  }
}

/**
 * CreateFunction请求参数结构体
 * @class
 */
class CreateFunctionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 创建的函数名称，函数名称支持26个英文字母大小写、数字、连接符和下划线，第一个字符只能以字母开头，最后一个字符不能为连接符或者下划线，名称长度2-60
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数的代码. 注意：不能同时指定Cos与ZipFile
     * @type {Code || null}
     */
    this.Code = null;

    /**
     * 函数处理方法名称，名称格式支持 "文件名称.方法名称" 形式，文件名称和函数名称之间以"."隔开，文件名称和函数名称要求以字母开始和结尾，中间允许插入字母、数字、下划线和连接符，文件名称和函数名字的长度要求是 2-60 个字符
     * @type {string || null}
     */
    this.Handler = null;

    /**
     * 函数描述,最大支持 1000 个英文字母、数字、空格、逗号、换行符和英文句号，支持中文
     * @type {string || null}
     */
    this.Description = null;

    /**
     * 函数运行时内存大小，默认为 128M，可选范围 128MB-1536MB，并且以 128MB 为阶梯
     * @type {number || null}
     */
    this.MemorySize = null;

    /**
     * 函数最长执行时间，单位为秒，可选值范围 1-300 秒，默认为 3 秒
     * @type {number || null}
     */
    this.Timeout = null;

    /**
     * 函数的环境变量
     * @type {Environment || null}
     */
    this.Environment = null;

    /**
     * 函数运行环境，目前仅支持 Python2.7，Python3.6，Nodejs6.10， PHP5， PHP7，Golang1 和 Java8，默认Python2.7
     * @type {string || null}
     */
    this.Runtime = null;

    /**
     * 函数的私有网络配置
     * @type {VpcConfig || null}
     */
    this.VpcConfig = null;

    /**
     * 函数所属命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 是否使用GPU进行计算
     * @type {string || null}
     */
    this.UseGpu = null;

    /**
     * 用于小程序，GPU集群， 不对外
     * @type {string || null}
     */
    this.Stamp = null;

    /**
     * 函数绑定的角色
     * @type {string || null}
     */
    this.Role = null;

    /**
     * 是否自动安装依赖
     * @type {string || null}
     */
    this.InstallDependency = null;

    /**
     * 函数日志投递到的CLS LogsetID
     * @type {string || null}
     */
    this.ClsLogsetId = null;

    /**
     * 函数日志投递到的CLS TopicID
     * @type {string || null}
     */
    this.ClsTopicId = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;

    if (params.Code) {
      let obj = new Code();
      obj.deserialize(params.Code);
      this.Code = obj;
    }
    this.Handler = "Handler" in params ? params.Handler : null;
    this.Description = "Description" in params ? params.Description : null;
    this.MemorySize = "MemorySize" in params ? params.MemorySize : null;
    this.Timeout = "Timeout" in params ? params.Timeout : null;

    if (params.Environment) {
      let obj = new Environment();
      obj.deserialize(params.Environment);
      this.Environment = obj;
    }
    this.Runtime = "Runtime" in params ? params.Runtime : null;

    if (params.VpcConfig) {
      let obj = new VpcConfig();
      obj.deserialize(params.VpcConfig);
      this.VpcConfig = obj;
    }
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.UseGpu = "UseGpu" in params ? params.UseGpu : null;
    this.Stamp = "Stamp" in params ? params.Stamp : null;
    this.Role = "Role" in params ? params.Role : null;
    // 因为node sdk 默认是支持填intallDependency字段，php传该字段会报错， 这里加判断
    if (this.Runtime === "Nodejs8.9") {
      this.InstallDependency =
        "InstallDependency" in params ? params.InstallDependency : null;
    }
    this.ClsLogsetId = "ClsLogsetId" in params ? params.ClsLogsetId : null;
    this.ClsTopicId = "ClsTopicId" in params ? params.ClsTopicId : null;
  }
}

/**
 * IotMq入参
 * @class
 */
class IotMq extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备名称
     * @type {string || null}
     */
    this.DeviceName = null;

    /**
     * 设备的Mqtt地址
     * @type {string || null}
     */
    this.Mqtt = null;

    /**
     * IotMQ的实例id
     * @type {string || null}
     */
    this.InstanceId = null;

    /**
     * 访问改MQTT实例的账号
     * @type {string || null}
     */
    this.UserName = null;

    /**
     * 访问改MQTT实例的密码
     * @type {string || null}
     */
    this.Password = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceName = "DeviceName" in params ? params.DeviceName : null;
    this.Mqtt = "Mqtt" in params ? params.Mqtt : null;
    this.InstanceId = "InstanceId" in params ? params.InstanceId : null;
    this.UserName = "UserName" in params ? params.UserName : null;
    this.Password = "Password" in params ? params.Password : null;
  }
}

/**
 * GetAccount请求参数结构体
 * @class
 */
class GetAccountRequest extends AbstractModel {
  constructor() {
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
 * UnBindFunctionOnDevice返回参数结构体
 * @class
 */
class UnBindFunctionOnDeviceResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * IotHub入参
 * @class
 */
class IotHub extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备的Mqtt地址
     * @type {string || null}
     */
    this.Mqtt = null;

    /**
     * 设备在IotHub的productId
     * @type {string || null}
     */
    this.ProductId = null;

    /**
     * 加密类型，ASYMMETRIC_ENCRYTION表示非对称加密，SYMMETRIC_ENCRYTION表示对称加密
     * @type {string || null}
     */
    this.EncryptionType = null;

    /**
     * 设备在IotHub的名称
     * @type {string || null}
     */
    this.DeviceName = null;

    /**
     * 设备证书，用于 TLS 建立链接时校验客户端身份。采用非对称加密时传入
     * @type {string || null}
     */
    this.DeviceCert = null;

    /**
     * 设备私钥，用于 TLS 建立链接时校验客户端身份，采用非对称加密时传入
     * @type {string || null}
     */
    this.DevicePrivateKey = null;

    /**
     * 对称加密密钥，base64编码。采用对称加密时传入
     * @type {string || null}
     */
    this.DevicePsk = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Mqtt = "Mqtt" in params ? params.Mqtt : null;
    this.ProductId = "ProductId" in params ? params.ProductId : null;
    this.EncryptionType =
      "EncryptionType" in params ? params.EncryptionType : null;
    this.DeviceName = "DeviceName" in params ? params.DeviceName : null;
    this.DeviceCert = "DeviceCert" in params ? params.DeviceCert : null;
    this.DevicePrivateKey =
      "DevicePrivateKey" in params ? params.DevicePrivateKey : null;
    this.DevicePsk = "DevicePsk" in params ? params.DevicePsk : null;
  }
}

/**
 * PublishVersion返回参数结构体
 * @class
 */
class PublishVersionResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的版本
     * @type {string || null}
     */
    this.FunctionVersion = null;

    /**
     * 代码大小
     * @type {number || null}
     */
    this.CodeSize = null;

    /**
     * 最大可用内存
     * @type {number || null}
     */
    this.MemorySize = null;

    /**
     * 函数的描述
     * @type {string || null}
     */
    this.Description = null;

    /**
     * 函数的入口
     * @type {string || null}
     */
    this.Handler = null;

    /**
     * 函数的超时时间
     * @type {number || null}
     */
    this.Timeout = null;

    /**
     * 函数的运行环境
     * @type {string || null}
     */
    this.Runtime = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;

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
    this.FunctionVersion =
      "FunctionVersion" in params ? params.FunctionVersion : null;
    this.CodeSize = "CodeSize" in params ? params.CodeSize : null;
    this.MemorySize = "MemorySize" in params ? params.MemorySize : null;
    this.Description = "Description" in params ? params.Description : null;
    this.Handler = "Handler" in params ? params.Handler : null;
    this.Timeout = "Timeout" in params ? params.Timeout : null;
    this.Runtime = "Runtime" in params ? params.Runtime : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * BatchCreateTrigger返回参数结构体
 * @class
 */
class BatchCreateTriggerResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * 函数的环境变量参数
 * @class
 */
class Environment extends AbstractModel {
  constructor() {
    super();

    /**
     * 环境变量数组
     * @type {Array.<Variable> || null}
     */
    this.Variables = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }

    if (params.Variables) {
      this.Variables = new Array();
      for (let z in params.Variables) {
        let obj = new Variable();
        obj.deserialize(params.Variables[z]);
        this.Variables.push(obj);
      }
    }
  }
}

/**
 * IotMq注册过来的设备，删除需要传递此参数
 * @class
 */
class IotMqDeviceDel extends AbstractModel {
  constructor() {
    super();

    /**
     * scf的设备ID
     * @type {Array.<string> || null}
     */
    this.DeviceId = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
  }
}

/**
 * GetFunctionAddress请求参数结构体
 * @class
 */
class GetFunctionAddressRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数的版本
     * @type {string || null}
     */
    this.Qualifier = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Qualifier = "Qualifier" in params ? params.Qualifier : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * Invoke返回参数结构体
 * @class
 */
class InvokeResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数执行结果
     * @type {Result || null}
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

    if (params.Result) {
      let obj = new Result();
      obj.deserialize(params.Result);
      this.Result = obj;
    }
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * UnBindFunctionOnDevice请求参数结构体
 * @class
 */
class UnBindFunctionOnDeviceRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备Id
     * @type {string || null}
     */
    this.DeviceId = null;

    /**
     * 函数ID
     * @type {string || null}
     */
    this.FunctionName = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
  }
}

/**
 * Invoke请求参数结构体
 * @class
 */
class InvokeRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * RequestResponse(同步) 和 Event(异步)，默认为同步
     * @type {string || null}
     */
    this.InvocationType = null;

    /**
     * 触发函数的版本号
     * @type {string || null}
     */
    this.Qualifier = null;

    /**
     * 运行函数时的参数，以json格式传入，最大支持的参数长度是 1M
     * @type {string || null}
     */
    this.ClientContext = null;

    /**
     * 同步调用时指定该字段，返回值会包含4K的日志，可选值为None和Tail，默认值为None。当该值为Tail时，返回参数中的logMsg字段会包含对应的函数执行日志
     * @type {string || null}
     */
    this.LogType = null;

    /**
     * 命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.InvocationType =
      "InvocationType" in params ? params.InvocationType : null;
    this.Qualifier = "Qualifier" in params ? params.Qualifier : null;
    this.ClientContext =
      "ClientContext" in params ? params.ClientContext : null;
    this.LogType = "LogType" in params ? params.LogType : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * IotHub注册过来的设备，删除需要传递此参数
 * @class
 */
class IotHubDeviceDel extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备在IotHub的productId
     * @type {string || null}
     */
    this.ProductId = null;

    /**
     * 设备在IotHub的名称
     * @type {string || null}
     */
    this.DeviceName = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.ProductId = "ProductId" in params ? params.ProductId : null;
    this.DeviceName = "DeviceName" in params ? params.DeviceName : null;
  }
}

/**
 * DescribeFunctionQuota返回参数结构体
 * @class
 */
class DescribeFunctionQuotaResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 用户可用容器最小配额
     * @type {number || null}
     */
    this.ContainerMinNum = null;

    /**
     * 用户可用容器最大配额
     * @type {number || null}
     */
    this.ContainerMaxNum = null;

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
    this.ContainerMinNum =
      "ContainerMinNum" in params ? params.ContainerMinNum : null;
    this.ContainerMaxNum =
      "ContainerMaxNum" in params ? params.ContainerMaxNum : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DescribeSubscriptionDefinition请求参数结构体
 * @class
 */
class DescribeSubscriptionDefinitionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;

    /**
     * 规则ID
     * @type {Array.<string> || null}
     */
    this.SubscriptionDefinitionIds = null;

    /**
     * 返回数据长度，默认值为 20
     * @type {number || null}
     */
    this.Limit = null;

    /**
     * 数据偏移量，默认值为 0
     * @type {number || null}
     */
    this.Offset = null;

    /**
     * 以升序还是降序的方式返回结果，可选值 ASC 和 DESC
     * @type {string || null}
     */
    this.Order = null;

    /**
     * 根据哪个字段进行返回结果排序,支持以下字段：AddTime
     * @type {string || null}
     */
    this.Orderby = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
    this.SubscriptionDefinitionIds =
      "SubscriptionDefinitionIds" in params
        ? params.SubscriptionDefinitionIds
        : null;
    this.Limit = "Limit" in params ? params.Limit : null;
    this.Offset = "Offset" in params ? params.Offset : null;
    this.Order = "Order" in params ? params.Order : null;
    this.Orderby = "Orderby" in params ? params.Orderby : null;
  }
}

/**
 * BatchCreateTrigger请求参数结构体
 * @class
 */
class BatchCreateTriggerRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 输入的触发器数组
     * @type {string || null}
     */
    this.Triggers = null;

    /**
     * 触发器个数
     * @type {number || null}
     */
    this.Count = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Triggers = "Triggers" in params ? params.Triggers : null;
    this.Count = "Count" in params ? params.Count : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * ListFunctionTestModels请求参数结构体
 * @class
 */
class ListFunctionTestModelsRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * CreateTrigger返回参数结构体
 * @class
 */
class CreateTriggerResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 触发器信息
     * @type {Trigger || null}
     */
    this.TriggerInfo = null;

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

    if (params.TriggerInfo) {
      let obj = new Trigger();
      obj.deserialize(params.TriggerInfo);
      this.TriggerInfo = obj;
    }
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * CreateNamespace请求参数结构体
 * @class
 */
class CreateNamespaceRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 命名空间名称
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 命名空间描述
     * @type {string || null}
     */
    this.Description = null;

    /**
     * 如果为小程序对应的namespace 请填入TCB，公有云对应的namespace不需要填写
     * @type {string || null}
     */
    this.Type = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.Description = "Description" in params ? params.Description : null;
    this.Type = "Type" in params ? params.Type : null;
  }
}

/**
 * ListDemo请求参数结构体
 * @class
 */
class ListDemoRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 以升序还是降序的方式返回结果，可选值 ASC 和 DESC
     * @type {string || null}
     */
    this.Order = null;

    /**
     * 根据哪个字段进行返回结果排序,支持以下字段：Name,Updatetime
     * @type {string || null}
     */
    this.Orderby = null;

    /**
     * 数据的偏移量，默认值为 0
     * @type {number || null}
     */
    this.Offset = null;

    /**
     * 返回数据长度，默认值为 20
     * @type {number || null}
     */
    this.Limit = null;

    /**
     * 支持demo描述、TAG、和runtime的模糊匹配，Key的取值为['Keyword', 'Tag', 'Runtime']，如一个Key需要同时满足多个条件，则需要用“|”隔开  如：SearchKey.0.Key=Tag&SearchKey.0.Value=blankfunc|helloworld
     * @type {Array.<SearchKey> || null}
     */
    this.SearchKey = null;

    /**
     * Demo描述语言，现阶段支持中文和英文
     * @type {string || null}
     */
    this.InternationalLanguage = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Order = "Order" in params ? params.Order : null;
    this.Orderby = "Orderby" in params ? params.Orderby : null;
    this.Offset = "Offset" in params ? params.Offset : null;
    this.Limit = "Limit" in params ? params.Limit : null;

    if (params.SearchKey) {
      this.SearchKey = new Array();
      for (let z in params.SearchKey) {
        let obj = new SearchKey();
        obj.deserialize(params.SearchKey[z]);
        this.SearchKey.push(obj);
      }
    }
    this.InternationalLanguage =
      "InternationalLanguage" in params ? params.InternationalLanguage : null;
  }
}

/**
 * InnerModifyUserRestriction返回参数结构体
 * @class
 */
class InnerModifyUserRestrictionResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * UpdateTriggerStatus返回参数结构体
 * @class
 */
class UpdateTriggerStatusResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * GetAccountSettings请求参数结构体
 * @class
 */
class GetAccountSettingsRequest extends AbstractModel {
  constructor() {
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
 * GetFunction请求参数结构体
 * @class
 */
class GetFunctionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 需要获取详情的函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数的版本号
     * @type {string || null}
     */
    this.Qualifier = null;

    /**
     * 函数所属命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 是否显示代码, TRUE表示显示代码，FALSE表示不显示代码,大于1M的入口文件不会显示
     * @type {string || null}
     */
    this.ShowCode = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Qualifier = "Qualifier" in params ? params.Qualifier : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.ShowCode = "ShowCode" in params ? params.ShowCode : null;
  }
}

/**
 * 描述键值对过滤器，用于条件过滤查询。例如过滤ID、名称、状态等
若存在多个Filter时，Filter间的关系为逻辑与（AND）关系。
若同一个Filter存在多个Values，同一Filter下Values间的关系为逻辑或（OR）关系。
 * @class
 */
class Filter extends AbstractModel {
  constructor() {
    super();

    /**
     * 需要过滤的字段。
     * @type {string || null}
     */
    this.Name = null;

    /**
     * 字段的过滤值。
     * @type {Array.<string> || null}
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
    this.Name = "Name" in params ? params.Name : null;
    this.Values = "Values" in params ? params.Values : null;
  }
}

/**
 * Device
 * @class
 */
class Device extends AbstractModel {
  constructor() {
    super();

    /**
     * 修改时间
     * @type {string || null}
     */
    this.ModTime = null;

    /**
     * 设备名称
     * @type {string || null}
     */
    this.DeviceName = null;

    /**
     * 设备来源
     * @type {string || null}
     */
    this.DeviceSource = null;

    /**
     * 创建时间
     * @type {string || null}
     */
    this.AddTime = null;

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;

    /**
     * 设备详情
     * @type {DeviceInfo || null}
     */
    this.DeviceInfo = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.ModTime = "ModTime" in params ? params.ModTime : null;
    this.DeviceName = "DeviceName" in params ? params.DeviceName : null;
    this.DeviceSource = "DeviceSource" in params ? params.DeviceSource : null;
    this.AddTime = "AddTime" in params ? params.AddTime : null;
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;

    if (params.DeviceInfo) {
      let obj = new DeviceInfo();
      obj.deserialize(params.DeviceInfo);
      this.DeviceInfo = obj;
    }
  }
}

/**
 * GetFunction返回参数结构体
 * @class
 */
class GetFunctionResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的最后修改时间
     * @type {string || null}
     */
    this.ModTime = null;

    /**
     * 函数的代码
     * @type {string || null}
     */
    this.CodeInfo = null;

    /**
     * 函数的描述信息
     * @type {string || null}
     */
    this.Description = null;

    /**
     * 函数的触发器列表
     * @type {Array.<Trigger> || null}
     */
    this.Triggers = null;

    /**
     * 函数的入口
     * @type {string || null}
     */
    this.Handler = null;

    /**
     * 函数代码大小
     * @type {number || null}
     */
    this.CodeSize = null;

    /**
     * 函数的超时时间
     * @type {number || null}
     */
    this.Timeout = null;

    /**
     * 函数的版本
     * @type {string || null}
     */
    this.FunctionVersion = null;

    /**
     * 函数的最大可用内存
     * @type {number || null}
     */
    this.MemorySize = null;

    /**
     * 函数的运行环境
     * @type {string || null}
     */
    this.Runtime = null;

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数的私有网络
     * @type {VpcConfig || null}
     */
    this.VpcConfig = null;

    /**
     * 是否使用GPU
     * @type {string || null}
     */
    this.UseGpu = null;

    /**
     * 函数的环境变量
     * @type {Environment || null}
     */
    this.Environment = null;

    /**
     * 代码是否正确
     * @type {string || null}
     */
    this.CodeResult = null;

    /**
     * 代码错误信息
     * @type {string || null}
     */
    this.CodeError = null;

    /**
     * 代码错误码
     * @type {number || null}
     */
    this.ErrNo = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 函数绑定的角色
     * @type {string || null}
     */
    this.Role = null;

    /**
     * 是否自动安装依赖
     * @type {string || null}
     */
    this.InstallDependency = null;

    /**
     * 函数状态
     * @type {string || null}
     */
    this.Status = null;

    /**
     * 状态描述
     * @type {string || null}
     */
    this.StatusDesc = null;

    /**
     * 日志投递到的Cls日志集
     * @type {string || null}
     */
    this.ClsLogsetId = null;

    /**
     * 日志投递到的Cls Topic
     * @type {string || null}
     */
    this.ClsTopicId = null;

    /**
     * 函数ID
     * @type {string || null}
     */
    this.FunctionId = null;

    /**
     * 函数的标签列表
     * @type {Array.<Tag> || null}
     */
    this.Tags = null;

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
    this.ModTime = "ModTime" in params ? params.ModTime : null;
    this.CodeInfo = "CodeInfo" in params ? params.CodeInfo : null;
    this.Description = "Description" in params ? params.Description : null;

    if (params.Triggers) {
      this.Triggers = new Array();
      for (let z in params.Triggers) {
        let obj = new Trigger();
        obj.deserialize(params.Triggers[z]);
        this.Triggers.push(obj);
      }
    }
    this.Handler = "Handler" in params ? params.Handler : null;
    this.CodeSize = "CodeSize" in params ? params.CodeSize : null;
    this.Timeout = "Timeout" in params ? params.Timeout : null;
    this.FunctionVersion =
      "FunctionVersion" in params ? params.FunctionVersion : null;
    this.MemorySize = "MemorySize" in params ? params.MemorySize : null;
    this.Runtime = "Runtime" in params ? params.Runtime : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;

    if (params.VpcConfig) {
      let obj = new VpcConfig();
      obj.deserialize(params.VpcConfig);
      this.VpcConfig = obj;
    }
    this.UseGpu = "UseGpu" in params ? params.UseGpu : null;

    if (params.Environment) {
      let obj = new Environment();
      obj.deserialize(params.Environment);
      this.Environment = obj;
    }
    this.CodeResult = "CodeResult" in params ? params.CodeResult : null;
    this.CodeError = "CodeError" in params ? params.CodeError : null;
    this.ErrNo = "ErrNo" in params ? params.ErrNo : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.Role = "Role" in params ? params.Role : null;
    this.InstallDependency =
      "InstallDependency" in params ? params.InstallDependency : null;
    this.Status = "Status" in params ? params.Status : null;
    this.StatusDesc = "StatusDesc" in params ? params.StatusDesc : null;
    this.ClsLogsetId = "ClsLogsetId" in params ? params.ClsLogsetId : null;
    this.ClsTopicId = "ClsTopicId" in params ? params.ClsTopicId : null;
    this.FunctionId = "FunctionId" in params ? params.FunctionId : null;

    if (params.Tags) {
      this.Tags = new Array();
      for (let z in params.Tags) {
        let obj = new Tag();
        obj.deserialize(params.Tags[z]);
        this.Tags.push(obj);
      }
    }
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * 文档描述
 * @class
 */
class DocDetail extends AbstractModel {
  constructor() {
    super();

    /**
     * 文档类型
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 文档名称
     * @type {string || null}
     */
    this.Name = null;

    /**
     * 文档链接
     * @type {string || null}
     */
    this.Url = null;

    /**
     * 文档展示状态
     * @type {string || null}
     */
    this.Status = null;

    /**
     * 文档描述
     * @type {string || null}
     */
    this.Describe = null;

    /**
     * 创建时间
     * @type {string || null}
     */
    this.Addtime = null;

    /**
     * 修改时间
     * @type {string || null}
     */
    this.Modtime = null;

    /**
     * 文档的ID
     * @type {string || null}
     */
    this.DocId = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Type = "Type" in params ? params.Type : null;
    this.Name = "Name" in params ? params.Name : null;
    this.Url = "Url" in params ? params.Url : null;
    this.Status = "Status" in params ? params.Status : null;
    this.Describe = "Describe" in params ? params.Describe : null;
    this.Addtime = "Addtime" in params ? params.Addtime : null;
    this.Modtime = "Modtime" in params ? params.Modtime : null;
    this.DocId = "DocId" in params ? params.DocId : null;
  }
}

/**
 * InnerRestoreService请求参数结构体
 * @class
 */
class InnerRestoreServiceRequest extends AbstractModel {
  constructor() {
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
 * GetDemoDetail返回参数结构体
 * @class
 */
class GetDemoDetailResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * demo名称
     * @type {string || null}
     */
    this.DemoName = null;

    /**
     * demo的入口代码
     * @type {string || null}
     */
    this.DemoCode = null;

    /**
     * demo的配置信息
     * @type {string || null}
     */
    this.DemoConfig = null;

    /**
     * demo的运行环境
     * @type {string || null}
     */
    this.DemoRuntime = null;

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
    this.DemoName = "DemoName" in params ? params.DemoName : null;
    this.DemoCode = "DemoCode" in params ? params.DemoCode : null;
    this.DemoConfig = "DemoConfig" in params ? params.DemoConfig : null;
    this.DemoRuntime = "DemoRuntime" in params ? params.DemoRuntime : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * 函数代码
 * @class
 */
class Code extends AbstractModel {
  constructor() {
    super();

    /**
     * 对象存储桶名称
     * @type {string || null}
     */
    this.CosBucketName = null;

    /**
     * 对象存储对象路径
     * @type {string || null}
     */
    this.CosObjectName = null;

    /**
     * 包含函数代码文件及其依赖项的 zip 格式文件，使用该接口时要求将 zip 文件的内容转成 base64 编码，最大支持20M
     * @type {string || null}
     */
    this.ZipFile = null;

    /**
     * 对象存储的地域，地域为北京时需要传入ap-beijing,北京一区时需要传递ap-beijing-1，其他的地域不需要传递。
     * @type {string || null}
     */
    this.CosBucketRegion = null;

    /**
     * 如果是通过Demo创建的话，需要传入DemoId
     * @type {string || null}
     */
    this.DemoId = null;

    /**
     * 如果是从TempCos创建的话，需要传入TempCosObjectName
     * @type {string || null}
     */
    this.TempCosObjectName = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.CosBucketName =
      "CosBucketName" in params ? params.CosBucketName : null;
    this.CosObjectName =
      "CosObjectName" in params ? params.CosObjectName : null;
    this.ZipFile = "ZipFile" in params ? params.ZipFile : null;
    this.CosBucketRegion =
      "CosBucketRegion" in params ? params.CosBucketRegion : null;
    this.DemoId = "DemoId" in params ? params.DemoId : null;
    this.TempCosObjectName =
      "TempCosObjectName" in params ? params.TempCosObjectName : null;
  }
}

/**
 * GetDemoAddress请求参数结构体
 * @class
 */
class GetDemoAddressRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * demo的ID
     * @type {string || null}
     */
    this.DemoId = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DemoId = "DemoId" in params ? params.DemoId : null;
  }
}

/**
 * UpdateNamespace请求参数结构体
 * @class
 */
class UpdateNamespaceRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 命名空间名称
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 命名空间描述
     * @type {string || null}
     */
    this.Description = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.Description = "Description" in params ? params.Description : null;
  }
}

/**
 * DeleteSubscriptionDefinition请求参数结构体
 * @class
 */
class DeleteSubscriptionDefinitionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {string || null}
     */
    this.DeviceId = null;

    /**
     * 消息规则id
     * @type {Array.<string> || null}
     */
    this.SubscriptionDefinitionIds = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceId = "DeviceId" in params ? params.DeviceId : null;
    this.SubscriptionDefinitionIds =
      "SubscriptionDefinitionIds" in params
        ? params.SubscriptionDefinitionIds
        : null;
  }
}

/**
 * 日志信息
 * @class
 */
class FunctionLog extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数执行完成后的返回值
     * @type {string || null}
     */
    this.RetMsg = null;

    /**
     * 执行该函数对应的requestId
     * @type {string || null}
     */
    this.RequestId = null;

    /**
     * 函数开始执行时的时间点
     * @type {string || null}
     */
    this.StartTime = null;

    /**
     * 函数执行结果，如果是 0 表示执行成功，其他值表示失败
     * @type {number || null}
     */
    this.RetCode = null;

    /**
     * 函数调用是否结束，如果是 1 表示执行结束，其他值表示调用异常
     * @type {number || null}
     */
    this.InvokeFinished = null;

    /**
     * 函数执行耗时，单位为 ms
     * @type {number || null}
     */
    this.Duration = null;

    /**
     * 函数计费时间，根据 duration 向上取最近的 100ms，单位为ms
     * @type {number || null}
     */
    this.BillDuration = null;

    /**
     * 函数执行时消耗实际内存大小，单位为 Byte
     * @type {number || null}
     */
    this.MemUsage = null;

    /**
     * 函数执行过程中的日志输出
     * @type {string || null}
     */
    this.Log = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.RetMsg = "RetMsg" in params ? params.RetMsg : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
    this.StartTime = "StartTime" in params ? params.StartTime : null;
    this.RetCode = "RetCode" in params ? params.RetCode : null;
    this.InvokeFinished =
      "InvokeFinished" in params ? params.InvokeFinished : null;
    this.Duration = "Duration" in params ? params.Duration : null;
    this.BillDuration = "BillDuration" in params ? params.BillDuration : null;
    this.MemUsage = "MemUsage" in params ? params.MemUsage : null;
    this.Log = "Log" in params ? params.Log : null;
  }
}

/**
 * GetFunctionTestModel返回参数结构体
 * @class
 */
class GetFunctionTestModelResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数测试模板的名称
     * @type {string || null}
     */
    this.TestModelName = null;

    /**
     * 函数测试模板的值
     * @type {string || null}
     */
    this.TestModelValue = null;

    /**
     * 测试模板创建时间
     * @type {string || null}
     */
    this.CreatedTime = null;

    /**
     * 测试模板最后修改时间
     * @type {string || null}
     */
    this.ModifiedTime = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;

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
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.TestModelName =
      "TestModelName" in params ? params.TestModelName : null;
    this.TestModelValue =
      "TestModelValue" in params ? params.TestModelValue : null;
    this.CreatedTime = "CreatedTime" in params ? params.CreatedTime : null;
    this.ModifiedTime = "ModifiedTime" in params ? params.ModifiedTime : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DescribeNamespaces请求参数结构体
 * @class
 */
class DescribeNamespacesRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 以升序还是降序的方式返回结果，可选值 ASC 和 DESC
     * @type {string || null}
     */
    this.Order = null;

    /**
     * 根据哪个字段进行返回结果排序,支持以下字段：AddTime, ModTime, Namespace
     * @type {string || null}
     */
    this.Orderby = null;

    /**
     * 数据偏移量，默认值为 0
     * @type {number || null}
     */
    this.Offset = null;

    /**
     * 返回数据长度，默认值为 20
     * @type {number || null}
     */
    this.Limit = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Order = "Order" in params ? params.Order : null;
    this.Orderby = "Orderby" in params ? params.Orderby : null;
    this.Offset = "Offset" in params ? params.Offset : null;
    this.Limit = "Limit" in params ? params.Limit : null;
  }
}

/**
 * UpdateTriggerStatus请求参数结构体
 * @class
 */
class UpdateTriggerStatusRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 触发器的初始是能状态OPEN表示开启 CLOSE表示关闭
     * @type {string || null}
     */
    this.Enable = null;

    /**
     * 函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 触发器名称
     * @type {string || null}
     */
    this.TriggerName = null;

    /**
     * 触发器类型
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 版本
     * @type {string || null}
     */
    this.Qualifier = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 如果更新的触发器类型为 COS 触发器，该字段为必填值，存放 JSON 格式的数据 {"event":"cos:ObjectCreated:*"}，数据内容和 SetTrigger 接口中该字段的格式相同；如果更新的触发器类型为定时触发器或 CMQ 触发器，可以不指定该字段
     * @type {string || null}
     */
    this.TriggerDesc = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Enable = "Enable" in params ? params.Enable : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.TriggerName = "TriggerName" in params ? params.TriggerName : null;
    this.Type = "Type" in params ? params.Type : null;
    this.Qualifier = "Qualifier" in params ? params.Qualifier : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.TriggerDesc = "TriggerDesc" in params ? params.TriggerDesc : null;
  }
}

/**
 * InnerListInvokeRouting请求参数结构体
 * @class
 */
class InnerListInvokeRoutingRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 路由类型, appid|stamp, 优先appid其次stamp,  stamp的值只支持MINI_QCBASE
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 路由类型对应的值
     * @type {string || null}
     */
    this.Value = null;

    /**
     * 数据的偏移量，默认值为 0
     * @type {number || null}
     */
    this.Offset = null;

    /**
     * 返回数据长度，默认值为 20
     * @type {number || null}
     */
    this.Limit = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Type = "Type" in params ? params.Type : null;
    this.Value = "Value" in params ? params.Value : null;
    this.Offset = "Offset" in params ? params.Offset : null;
    this.Limit = "Limit" in params ? params.Limit : null;
  }
}

/**
 * 限制信息
 * @class
 */
class LimitsInfo extends AbstractModel {
  constructor() {
    super();

    /**
     * 命名空间个数限制
     * @type {number || null}
     */
    this.NamespacesCount = null;

    /**
     * 命名空间限制信息
     * @type {Array.<NamespaceLimit> || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.NamespacesCount =
      "NamespacesCount" in params ? params.NamespacesCount : null;

    if (params.Namespace) {
      this.Namespace = new Array();
      for (let z in params.Namespace) {
        let obj = new NamespaceLimit();
        obj.deserialize(params.Namespace[z]);
        this.Namespace.push(obj);
      }
    }
  }
}

/**
 * 用户使用限制
 * @class
 */
class AccountLimit extends AbstractModel {
  constructor() {
    super();

    /**
     * 用户能创建的最大函数数量
     * @type {number || null}
     */
    this.FunctionCount = null;

    /**
     * 用户能创建的最大触发器数量
     * @type {TriggerCount || null}
     */
    this.TriggerCount = null;

    /**
     * 最大容器并发数
     * @type {number || null}
     */
    this.ConcurrentExecutions = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionCount =
      "FunctionCount" in params ? params.FunctionCount : null;

    if (params.TriggerCount) {
      let obj = new TriggerCount();
      obj.deserialize(params.TriggerCount);
      this.TriggerCount = obj;
    }
    this.ConcurrentExecutions =
      "ConcurrentExecutions" in params ? params.ConcurrentExecutions : null;
  }
}

/**
 * ListDemo返回参数结构体
 * @class
 */
class ListDemoResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 总数
     * @type {number || null}
     */
    this.TotalCount = null;

    /**
     * demo列表
     * @type {Array.<DemoInfo> || null}
     */
    this.Demos = null;

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
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;

    if (params.Demos) {
      this.Demos = new Array();
      for (let z in params.Demos) {
        let obj = new DemoInfo();
        obj.deserialize(params.Demos[z]);
        this.Demos.push(obj);
      }
    }
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DescribeDeviceFunctions返回参数结构体
 * @class
 */
class DescribeDeviceFunctionsResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备的函数列表。
     * @type {Array.<DeviceFunction> || null}
     */
    this.DeviceFunctions = null;

    /**
     * 总数。
     * @type {number || null}
     */
    this.TotalCount = null;

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

    if (params.DeviceFunctions) {
      this.DeviceFunctions = new Array();
      for (let z in params.DeviceFunctions) {
        let obj = new DeviceFunction();
        obj.deserialize(params.DeviceFunctions[z]);
        this.DeviceFunctions.push(obj);
      }
    }
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * GetUserYesterdayUsage请求参数结构体
 * @class
 */
class GetUserYesterdayUsageRequest extends AbstractModel {
  constructor() {
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
 * UpdateFunctionConfiguration返回参数结构体
 * @class
 */
class UpdateFunctionConfigurationResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * 函数列表
 * @class
 */
class Function extends AbstractModel {
  constructor() {
    super();

    /**
     * 修改时间
     * @type {string || null}
     */
    this.ModTime = null;

    /**
     * 创建时间
     * @type {string || null}
     */
    this.AddTime = null;

    /**
     * 运行时
     * @type {string || null}
     */
    this.Runtime = null;

    /**
     * 函数名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数ID
     * @type {string || null}
     */
    this.FunctionId = null;

    /**
     * 命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 函数状态
     * @type {string || null}
     */
    this.Status = null;

    /**
     * 函数状态详情
     * @type {string || null}
     */
    this.StatusDesc = null;

    /**
     * 函数描述
     * @type {string || null}
     */
    this.Description = null;

    /**
     * 函数标签
     * @type {Array.<Tag> || null}
     */
    this.Tags = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.ModTime = "ModTime" in params ? params.ModTime : null;
    this.AddTime = "AddTime" in params ? params.AddTime : null;
    this.Runtime = "Runtime" in params ? params.Runtime : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.FunctionId = "FunctionId" in params ? params.FunctionId : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.Status = "Status" in params ? params.Status : null;
    this.StatusDesc = "StatusDesc" in params ? params.StatusDesc : null;
    this.Description = "Description" in params ? params.Description : null;

    if (params.Tags) {
      this.Tags = new Array();
      for (let z in params.Tags) {
        let obj = new Tag();
        obj.deserialize(params.Tags[z]);
        this.Tags.push(obj);
      }
    }
  }
}

/**
 * ListVersionByFunction请求参数结构体
 * @class
 */
class ListVersionByFunctionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数ID
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 用于监控接入，不做实际意义
     * @type {string || null}
     */
    this.SearchKey = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.SearchKey = "SearchKey" in params ? params.SearchKey : null;
  }
}

/**
 * InnerModifyUserRestriction请求参数结构体
 * @class
 */
class InnerModifyUserRestrictionRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 待修改用户的AppId
     * @type {number || null}
     */
    this.UserAppId = null;

    /**
     * 待修改用户的Uin
     * @type {number || null}
     */
    this.UserUin = null;

    /**
     * 配额限制名
     * @type {string || null}
     */
    this.RestrictionName = null;

    /**
     * 配额限制数
     * @type {string || null}
     */
    this.RestrictionValue = null;

    /**
     * 命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.UserAppId = "UserAppId" in params ? params.UserAppId : null;
    this.UserUin = "UserUin" in params ? params.UserUin : null;
    this.RestrictionName =
      "RestrictionName" in params ? params.RestrictionName : null;
    this.RestrictionValue =
      "RestrictionValue" in params ? params.RestrictionValue : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * ListFunctions返回参数结构体
 * @class
 */
class ListFunctionsResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数列表
     * @type {Array.<Function> || null}
     */
    this.Functions = null;

    /**
     * 总数
     * @type {number || null}
     */
    this.TotalCount = null;

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

    if (params.Functions) {
      this.Functions = new Array();
      for (let z in params.Functions) {
        let obj = new Function();
        obj.deserialize(params.Functions[z]);
        this.Functions.push(obj);
      }
    }
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * CreateFunction返回参数结构体
 * @class
 */
class CreateFunctionResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DescribeSubscriptionDefinition返回参数结构体
 * @class
 */
class DescribeSubscriptionDefinitionResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 规则
     * @type {Array.<Subscription> || null}
     */
    this.SubscriptionDefinitions = null;

    /**
     * 总数
     * @type {number || null}
     */
    this.TotalCount = null;

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

    if (params.SubscriptionDefinitions) {
      this.SubscriptionDefinitions = new Array();
      for (let z in params.SubscriptionDefinitions) {
        let obj = new Subscription();
        obj.deserialize(params.SubscriptionDefinitions[z]);
        this.SubscriptionDefinitions.push(obj);
      }
    }
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * 名称空间已使用信息
 * @class
 */
class NamespaceUsage extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数数组
     * @type {Array.<string> || null}
     */
    this.Functions = null;

    /**
     * 命名空间名称
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 命名空间函数个数
     * @type {number || null}
     */
    this.FunctionsCount = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Functions = "Functions" in params ? params.Functions : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.FunctionsCount =
      "FunctionsCount" in params ? params.FunctionsCount : null;
  }
}

/**
 * GetFunctionTotalNum请求参数结构体
 * @class
 */
class GetFunctionTotalNumRequest extends AbstractModel {
  constructor() {
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
 * GetFunctionUsageTriggerCount请求参数结构体
 * @class
 */
class GetFunctionUsageTriggerCountRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 函数的命名空间
     * @type {string || null}
     */
    this.Namespace = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
  }
}

/**
 * DescribeDevices请求参数结构体
 * @class
 */
class DescribeDevicesRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 设备ID
     * @type {Array.<string> || null}
     */
    this.DeviceIds = null;

    /**
     * 设备名称，支持模糊查询
     * @type {string || null}
     */
    this.DeviceName = null;

    /**
     * 数据偏移量，默认值为 0
     * @type {number || null}
     */
    this.Offset = null;

    /**
     * 返回数据长度，默认值为 20
     * @type {number || null}
     */
    this.Limit = null;

    /**
     * 以升序还是降序的方式返回结果，可选值 ASC 和 DESC
     * @type {string || null}
     */
    this.Order = null;

    /**
     * 根据哪个字段进行返回结果排序,支持以下字段：AddTime, ModTime, DeviceName
     * @type {string || null}
     */
    this.Orderby = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DeviceIds = "DeviceIds" in params ? params.DeviceIds : null;
    this.DeviceName = "DeviceName" in params ? params.DeviceName : null;
    this.Offset = "Offset" in params ? params.Offset : null;
    this.Limit = "Limit" in params ? params.Limit : null;
    this.Order = "Order" in params ? params.Order : null;
    this.Orderby = "Orderby" in params ? params.Orderby : null;
  }
}

/**
 * GetAccount返回参数结构体
 * @class
 */
class GetAccountResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 命名空间已使用的信息
     * @type {UsageInfo || null}
     */
    this.AccountUsage = null;

    /**
     * 命名空间限制的信息
     * @type {LimitsInfo || null}
     */
    this.AccountLimit = null;

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

    if (params.AccountUsage) {
      let obj = new UsageInfo();
      obj.deserialize(params.AccountUsage);
      this.AccountUsage = obj;
    }

    if (params.AccountLimit) {
      let obj = new LimitsInfo();
      obj.deserialize(params.AccountLimit);
      this.AccountLimit = obj;
    }
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * GetFunctionLogs返回参数结构体
 * @class
 */
class GetFunctionLogsResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数日志的总数
     * @type {number || null}
     */
    this.TotalCount = null;

    /**
     * 函数日志信息
     * @type {Array.<FunctionLog> || null}
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
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;

    if (params.Data) {
      this.Data = new Array();
      for (let z in params.Data) {
        let obj = new FunctionLog();
        obj.deserialize(params.Data[z]);
        this.Data.push(obj);
      }
    }
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * 包含有Demo的ID和Demo的配置信息
 * @class
 */
class DemoInfo extends AbstractModel {
  constructor() {
    super();

    /**
     * 返回Demo的ID
     * @type {string || null}
     */
    this.DemoId = null;

    /**
     * 返回Demo的名字
     * @type {string || null}
     */
    this.Name = null;

    /**
     * 返回Demo的描述
     * @type {string || null}
     */
    this.Describe = null;

    /**
     * 返回Demo的运行环境
     * @type {string || null}
     */
    this.Runtime = null;

    /**
     * 返回Demo的标签
     * @type {string || null}
     */
    this.Tags = null;

    /**
     * 下载数
     * @type {number || null}
     */
    this.Stars = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.DemoId = "DemoId" in params ? params.DemoId : null;
    this.Name = "Name" in params ? params.Name : null;
    this.Describe = "Describe" in params ? params.Describe : null;
    this.Runtime = "Runtime" in params ? params.Runtime : null;
    this.Tags = "Tags" in params ? params.Tags : null;
    this.Stars = "Stars" in params ? params.Stars : null;
  }
}

/**
 * 用于计费
 * @class
 */
class TradeFunction extends AbstractModel {
  constructor() {
    super();

    /**
     * 地区
     * @type {string || null}
     */
    this.Region = null;

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Region = "Region" in params ? params.Region : null;
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
  }
}

/**
 * DeleteTrigger返回参数结构体
 * @class
 */
class DeleteTriggerResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * 包含搜索关键字和对应的内容
 * @class
 */
class SearchKey extends AbstractModel {
  constructor() {
    super();

    /**
     * 搜索关键字
     * @type {string || null}
     */
    this.Key = null;

    /**
     * 搜索内容
     * @type {string || null}
     */
    this.Value = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.Key = "Key" in params ? params.Key : null;
    this.Value = "Value" in params ? params.Value : null;
  }
}

/**
 * DeleteTrigger请求参数结构体
 * @class
 */
class DeleteTriggerRequest extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的名称
     * @type {string || null}
     */
    this.FunctionName = null;

    /**
     * 要删除的触发器名称
     * @type {string || null}
     */
    this.TriggerName = null;

    /**
     * 要删除的触发器类型，目前支持 cos 、cmq、 timer、ckafka 类型
     * @type {string || null}
     */
    this.Type = null;

    /**
     * 函数所属命名空间
     * @type {string || null}
     */
    this.Namespace = null;

    /**
     * 如果删除的触发器类型为 COS 触发器，该字段为必填值，存放 JSON 格式的数据 {"event":"cos:ObjectCreated:*"}，数据内容和 SetTrigger 接口中该字段的格式相同；如果删除的触发器类型为定时触发器或 CMQ 触发器，可以不指定该字段
     * @type {string || null}
     */
    this.TriggerDesc = null;

    /**
     * 函数的版本信息
     * @type {string || null}
     */
    this.Qualifier = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.FunctionName = "FunctionName" in params ? params.FunctionName : null;
    this.TriggerName = "TriggerName" in params ? params.TriggerName : null;
    this.Type = "Type" in params ? params.Type : null;
    this.Namespace = "Namespace" in params ? params.Namespace : null;
    this.TriggerDesc = "TriggerDesc" in params ? params.TriggerDesc : null;
    this.Qualifier = "Qualifier" in params ? params.Qualifier : null;
  }
}

/**
 * 私有网络参数配置
 * @class
 */
class VpcConfig extends AbstractModel {
  constructor() {
    super();

    /**
     * 私有网络 的 id
     * @type {string || null}
     */
    this.VpcId = null;

    /**
     * 子网的 id
     * @type {string || null}
     */
    this.SubnetId = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.VpcId = "VpcId" in params ? params.VpcId : null;
    this.SubnetId = "SubnetId" in params ? params.SubnetId : null;
  }
}

/**
 * GetUserYesterdayUsage返回参数结构体
 * @class
 */
class GetUserYesterdayUsageResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 内存持续时间
     * @type {number || null}
     */
    this.Gbs = null;

    /**
     * 流量
     * @type {number || null}
     */
    this.Outflow = null;

    /**
     * 触发数量
     * @type {number || null}
     */
    this.InvokeCount = null;

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
    this.Gbs = "Gbs" in params ? params.Gbs : null;
    this.Outflow = "Outflow" in params ? params.Outflow : null;
    this.InvokeCount = "InvokeCount" in params ? params.InvokeCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DeleteDevice返回参数结构体
 * @class
 */
class DeleteDeviceResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * GetFunctionAddress返回参数结构体
 * @class
 */
class GetFunctionAddressResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 函数的Cos地址
     * @type {string || null}
     */
    this.Url = null;

    /**
     * 函数的SHA256编码
     * @type {string || null}
     */
    this.CodeSha256 = null;

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
    this.Url = "Url" in params ? params.Url : null;
    this.CodeSha256 = "CodeSha256" in params ? params.CodeSha256 : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * DeviceInfo
 * @class
 */
class DeviceInfo extends AbstractModel {
  constructor() {
    super();

    /**
     * 访问mqtt账号，来源为IOTMQ时才会存在
     * @type {string || null}
     */
    this.UserName = null;

    /**
     * mqtt地址，来源为IOTMQ时才会存在
     * @type {string || null}
     */
    this.Mqtt = null;

    /**
     * 访问mqtt密码，来源为IOTMQ时才会存在
     * @type {string || null}
     */
    this.Password = null;

    /**
     * 加密类型，ASYMMETRIC_ENCRYTION表示非对称加密，SYMMETRIC_ENCRYTION表示对称加密，来源为IOTHUB时才会存在
     * @type {string || null}
     */
    this.EncryptionType = null;

    /**
     * 设备证书，用于 TLS 建立链接时校验客户端身份。采用非对称加密时传入，来源为IOTHUB时才会存在
     * @type {string || null}
     */
    this.DeviceCert = null;

    /**
     * 设备私钥，用于 TLS 建立链接时校验客户端身份，采用非对称加密时传入，来源为IOTHUB时才会存在
     * @type {string || null}
     */
    this.DevicePrivateKey = null;

    /**
     * 对称加密密钥，base64编码。采用对称加密时传入，来源为IOTHUB时才会存在
     * @type {string || null}
     */
    this.DevicePsk = null;
  }

  /**
   * @private
   */
  deserialize(params) {
    if (!params) {
      return;
    }
    this.UserName = "UserName" in params ? params.UserName : null;
    this.Mqtt = "Mqtt" in params ? params.Mqtt : null;
    this.Password = "Password" in params ? params.Password : null;
    this.EncryptionType =
      "EncryptionType" in params ? params.EncryptionType : null;
    this.DeviceCert = "DeviceCert" in params ? params.DeviceCert : null;
    this.DevicePrivateKey =
      "DevicePrivateKey" in params ? params.DevicePrivateKey : null;
    this.DevicePsk = "DevicePsk" in params ? params.DevicePsk : null;
  }
}

/**
 * ListNamespaces返回参数结构体
 * @class
 */
class ListNamespacesResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * namespace详情
     * @type {Array.<Namespaces> || null}
     */
    this.Namespaces = null;

    /**
     * 返回的namespace数量
     * @type {number || null}
     */
    this.TotalCount = null;

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

    if (params.Namespaces) {
      this.Namespaces = new Array();
      for (let z in params.Namespaces) {
        let obj = new Namespaces();
        obj.deserialize(params.Namespaces[z]);
        this.Namespaces.push(obj);
      }
    }
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * GetDemoAddress返回参数结构体
 * @class
 */
class GetDemoAddressResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * Demo下载地址
     * @type {string || null}
     */
    this.DownloadAddress = null;

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
    this.DownloadAddress =
      "DownloadAddress" in params ? params.DownloadAddress : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * InnerListInvokeRouting返回参数结构体
 * @class
 */
class InnerListInvokeRoutingResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 后端Invoke路由信息列表
     * @type {Array.<InvokeRouting> || null}
     */
    this.InvokeRoutings = null;

    /**
     * 总数
     * @type {number || null}
     */
    this.TotalCount = null;

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

    if (params.InvokeRoutings) {
      this.InvokeRoutings = new Array();
      for (let z in params.InvokeRoutings) {
        let obj = new InvokeRouting();
        obj.deserialize(params.InvokeRoutings[z]);
        this.InvokeRoutings.push(obj);
      }
    }
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * ListHelpDoc返回参数结构体
 * @class
 */
class ListHelpDocResponse extends AbstractModel {
  constructor() {
    super();

    /**
     * 文档总数
     * @type {number || null}
     */
    this.TotalCount = null;

    /**
     * 文档详情
     * @type {Array.<DocDetail> || null}
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
    this.TotalCount = "TotalCount" in params ? params.TotalCount : null;

    if (params.Data) {
      this.Data = new Array();
      for (let z in params.Data) {
        let obj = new DocDetail();
        obj.deserialize(params.Data[z]);
        this.Data.push(obj);
      }
    }
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

/**
 * UpdateFunctionCode返回参数结构体
 * @class
 */
class UpdateFunctionCodeResponse extends AbstractModel {
  constructor() {
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
    this.RequestId = "RequestId" in params ? params.RequestId : null;
  }
}

module.exports = {
  ListHelpDocRequest: ListHelpDocRequest,
  GetUserMonthUsageRequest: GetUserMonthUsageRequest,
  CreateFunctionTestModelRequest: CreateFunctionTestModelRequest,
  DescribeDeviceFunctionsRequest: DescribeDeviceFunctionsRequest,
  Trigger: Trigger,
  DescribeNamespacesResponse: DescribeNamespacesResponse,
  BindFunctionOnDeviceResponse: BindFunctionOnDeviceResponse,
  InnerModifyInvokeRoutingResponse: InnerModifyInvokeRoutingResponse,
  CreateSubscriptionDefinitionRequest: CreateSubscriptionDefinitionRequest,
  GetTempCosInfoRequest: GetTempCosInfoRequest,
  DescribeDevicesResponse: DescribeDevicesResponse,
  GetFunctionTotalNumResponse: GetFunctionTotalNumResponse,
  GetTempCosInfoResponse: GetTempCosInfoResponse,
  InnerCreateInvokeRoutingResponse: InnerCreateInvokeRoutingResponse,
  BindFunctionOnDeviceRequest: BindFunctionOnDeviceRequest,
  GetUserMonthUsageResponse: GetUserMonthUsageResponse,
  UsageInfo: UsageInfo,
  Variable: Variable,
  InnerCreateInvokeRoutingRequest: InnerCreateInvokeRoutingRequest,
  UpdateFunctionTestModelRequest: UpdateFunctionTestModelRequest,
  InnerDeleteInvokeRoutingResponse: InnerDeleteInvokeRoutingResponse,
  InnerModifyInvokeRoutingRequest: InnerModifyInvokeRoutingRequest,
  GetFunctionTestModelRequest: GetFunctionTestModelRequest,
  GetFunctionLogsRequest: GetFunctionLogsRequest,
  Namespaces: Namespaces,
  InnerStopServiceResponse: InnerStopServiceResponse,
  ListFunctionsForTradeRequest: ListFunctionsForTradeRequest,
  Tag: Tag,
  GetFunctionUsageTriggerCountResponse: GetFunctionUsageTriggerCountResponse,
  Subscription: Subscription,
  LogFilter: LogFilter,
  DeviceFunction: DeviceFunction,
  AccountUsage: AccountUsage,
  GetDemoDetailRequest: GetDemoDetailRequest,
  DeleteFunctionRequest: DeleteFunctionRequest,
  CopyFunctionResponse: CopyFunctionResponse,
  InnerDeleteInvokeRoutingRequest: InnerDeleteInvokeRoutingRequest,
  DeployFunctionAndSubscriptionDefinitionRequest: DeployFunctionAndSubscriptionDefinitionRequest,
  UpdateFunctionTestModelResponse: UpdateFunctionTestModelResponse,
  DescribeFunctionQuotaRequest: DescribeFunctionQuotaRequest,
  ListNamespacesRequest: ListNamespacesRequest,
  PublishVersionRequest: PublishVersionRequest,
  ListVersionByFunctionResponse: ListVersionByFunctionResponse,
  UpdateFunctionQuotaResponse: UpdateFunctionQuotaResponse,
  CreateSubscriptionDefinitionResponse: CreateSubscriptionDefinitionResponse,
  InnerStopServiceRequest: InnerStopServiceRequest,
  CreateNamespaceResponse: CreateNamespaceResponse,
  DeleteDeviceRequest: DeleteDeviceRequest,
  ListFunctionsForTradeResponse: ListFunctionsForTradeResponse,
  UpdateFunctionCodeRequest: UpdateFunctionCodeRequest,
  DeleteSubscriptionDefinitionResponse: DeleteSubscriptionDefinitionResponse,
  DeleteFunctionTestModelRequest: DeleteFunctionTestModelRequest,
  GetAccountSettingsResponse: GetAccountSettingsResponse,
  DeleteFunctionTestModelResponse: DeleteFunctionTestModelResponse,
  CreateFunctionTestModelResponse: CreateFunctionTestModelResponse,
  CopyFunctionRequest: CopyFunctionRequest,
  DeleteNamespaceResponse: DeleteNamespaceResponse,
  InnerRestoreServiceResponse: InnerRestoreServiceResponse,
  TriggerCount: TriggerCount,
  NamespaceLimit: NamespaceLimit,
  UpdateFunctionConfigurationRequest: UpdateFunctionConfigurationRequest,
  DeleteNamespaceRequest: DeleteNamespaceRequest,
  ListFunctionsRequest: ListFunctionsRequest,
  CreateDeviceResponse: CreateDeviceResponse,
  CreateDeviceRequest: CreateDeviceRequest,
  UpdateFunctionQuotaRequest: UpdateFunctionQuotaRequest,
  CreateTriggerRequest: CreateTriggerRequest,
  ListFunctionTestModelsResponse: ListFunctionTestModelsResponse,
  DeleteFunctionResponse: DeleteFunctionResponse,
  UpdateNamespaceResponse: UpdateNamespaceResponse,
  DeployFunctionAndSubscriptionDefinitionResponse: DeployFunctionAndSubscriptionDefinitionResponse,
  Result: Result,
  InvokeRouting: InvokeRouting,
  CreateFunctionRequest: CreateFunctionRequest,
  IotMq: IotMq,
  GetAccountRequest: GetAccountRequest,
  UnBindFunctionOnDeviceResponse: UnBindFunctionOnDeviceResponse,
  IotHub: IotHub,
  PublishVersionResponse: PublishVersionResponse,
  BatchCreateTriggerResponse: BatchCreateTriggerResponse,
  Environment: Environment,
  IotMqDeviceDel: IotMqDeviceDel,
  GetFunctionAddressRequest: GetFunctionAddressRequest,
  InvokeResponse: InvokeResponse,
  UnBindFunctionOnDeviceRequest: UnBindFunctionOnDeviceRequest,
  InvokeRequest: InvokeRequest,
  IotHubDeviceDel: IotHubDeviceDel,
  DescribeFunctionQuotaResponse: DescribeFunctionQuotaResponse,
  DescribeSubscriptionDefinitionRequest: DescribeSubscriptionDefinitionRequest,
  BatchCreateTriggerRequest: BatchCreateTriggerRequest,
  ListFunctionTestModelsRequest: ListFunctionTestModelsRequest,
  CreateTriggerResponse: CreateTriggerResponse,
  CreateNamespaceRequest: CreateNamespaceRequest,
  ListDemoRequest: ListDemoRequest,
  InnerModifyUserRestrictionResponse: InnerModifyUserRestrictionResponse,
  UpdateTriggerStatusResponse: UpdateTriggerStatusResponse,
  GetAccountSettingsRequest: GetAccountSettingsRequest,
  GetFunctionRequest: GetFunctionRequest,
  Filter: Filter,
  Device: Device,
  GetFunctionResponse: GetFunctionResponse,
  DocDetail: DocDetail,
  InnerRestoreServiceRequest: InnerRestoreServiceRequest,
  GetDemoDetailResponse: GetDemoDetailResponse,
  Code: Code,
  GetDemoAddressRequest: GetDemoAddressRequest,
  UpdateNamespaceRequest: UpdateNamespaceRequest,
  DeleteSubscriptionDefinitionRequest: DeleteSubscriptionDefinitionRequest,
  FunctionLog: FunctionLog,
  GetFunctionTestModelResponse: GetFunctionTestModelResponse,
  DescribeNamespacesRequest: DescribeNamespacesRequest,
  UpdateTriggerStatusRequest: UpdateTriggerStatusRequest,
  InnerListInvokeRoutingRequest: InnerListInvokeRoutingRequest,
  LimitsInfo: LimitsInfo,
  AccountLimit: AccountLimit,
  ListDemoResponse: ListDemoResponse,
  DescribeDeviceFunctionsResponse: DescribeDeviceFunctionsResponse,
  GetUserYesterdayUsageRequest: GetUserYesterdayUsageRequest,
  UpdateFunctionConfigurationResponse: UpdateFunctionConfigurationResponse,
  Function: Function,
  ListVersionByFunctionRequest: ListVersionByFunctionRequest,
  InnerModifyUserRestrictionRequest: InnerModifyUserRestrictionRequest,
  ListFunctionsResponse: ListFunctionsResponse,
  CreateFunctionResponse: CreateFunctionResponse,
  DescribeSubscriptionDefinitionResponse: DescribeSubscriptionDefinitionResponse,
  NamespaceUsage: NamespaceUsage,
  GetFunctionTotalNumRequest: GetFunctionTotalNumRequest,
  GetFunctionUsageTriggerCountRequest: GetFunctionUsageTriggerCountRequest,
  DescribeDevicesRequest: DescribeDevicesRequest,
  GetAccountResponse: GetAccountResponse,
  GetFunctionLogsResponse: GetFunctionLogsResponse,
  DemoInfo: DemoInfo,
  TradeFunction: TradeFunction,
  DeleteTriggerResponse: DeleteTriggerResponse,
  SearchKey: SearchKey,
  DeleteTriggerRequest: DeleteTriggerRequest,
  VpcConfig: VpcConfig,
  GetUserYesterdayUsageResponse: GetUserYesterdayUsageResponse,
  DeleteDeviceResponse: DeleteDeviceResponse,
  GetFunctionAddressResponse: GetFunctionAddressResponse,
  DeviceInfo: DeviceInfo,
  ListNamespacesResponse: ListNamespacesResponse,
  GetDemoAddressResponse: GetDemoAddressResponse,
  InnerListInvokeRoutingResponse: InnerListInvokeRoutingResponse,
  ListHelpDocResponse: ListHelpDocResponse,
  UpdateFunctionCodeResponse: UpdateFunctionCodeResponse
};
