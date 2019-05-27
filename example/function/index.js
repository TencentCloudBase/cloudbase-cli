// 云函数入口函数
const _ = require("lodash");
exports.main = (event, context) => {
  console.log(event);
  console.log(context);
  const foo = {
    bar: 123
  };
  const a = { ...foo };
  return {
    sum: event.a + event.b,
    lodash: _.add(1, 4)
  };
};
