import * as archiver from "archiver";
import * as fs from "fs";
import * as readline from "readline";
import * as tencentcloud from "tencentcloud-sdk-nodejs";
import * as ini from "ini";
import * as path from "path";
import * as os from "os";
import * as node_ssh from "node-ssh";
import * as ora from "ora";

export async function zipDir(dirPath, outputPath) {
  console.log(dirPath, outputPath);
  return new Promise((resolve, reject) => {
    var output = fs.createWriteStream(outputPath);
    var archive = archiver("zip");

    output.on("close", function() {
      // console.log(archive.pointer() + ' total bytes');
      // console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve({
        zipPath: outputPath,
        size: Math.ceil(archive.pointer() / 1024)
      });
    });

    archive.on("error", function(err) {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(dirPath, "");
    archive.finalize();
  });
}

const TCBRC = path.resolve(os.homedir(), ".tcbrc.json");
export async function login() {
  const secretId = await askForInput("请输入腾讯云SecretID：");
  const secretKey = await askForInput("请输入腾讯云SecretKey：");
  const cloudSpinner = ora("正在验证腾讯云密钥...").start();
  try {
    await callCloudApi(secretId, secretKey);
    cloudSpinner.succeed("腾讯云密钥验证成功");
  } catch (e) {
    cloudSpinner.fail(
      "腾讯云密钥验证失败，请检查密钥是否正确或本机网络代理有问题"
    );
    return;
  }

  const sshInfo = {
    host: await askForInput("请输入主机IP："),
    password: await askForInput("请输入主机密码："),
    username: (await askForInput("请输入用户名：(root)")) || "root",
    port: (await askForInput("请输入ssh端口号：(22)")) || 22
  };
  const sshSpinner = ora("正在进行腾讯云主机登录验证...").start();
  try {
    const ssh = new node_ssh();
    await ssh.connect(sshInfo);
    await ssh.dispose();
    sshSpinner.succeed("腾讯云主机登录验证成功");
  } catch (error) {
    sshSpinner.fail(
      "腾讯云主机登录验证失败，请检查密钥是否正确或本机网络代理有问题"
    );
    return;
  }

  fs.writeFileSync(TCBRC, ini.stringify({ secretId, secretKey, ...sshInfo }));
  return { secretId, secretKey, ...sshInfo };
}

export async function logout() {
  await fs.unlinkSync(TCBRC);
}

export async function getMetadata() {
  if (fs.existsSync(TCBRC)) {
    const tcbrc = ini.parse(fs.readFileSync(TCBRC, "utf-8"));
    if (
      !tcbrc.secretId ||
      !tcbrc.secretKey ||
      !tcbrc.host ||
      !tcbrc.password ||
      !tcbrc.username ||
      !tcbrc.port
    ) {
      // 缺少信息，重新登录
      return await login();
    }
    return tcbrc;
  } else {
    // 没有登录过
    return await login();
  }
}

export function askForInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
      rl.close();
    });
  });
}

export function callCloudApi(secretId, secretKey) {
  const CvmClient = tencentcloud.cvm.v20170312.Client;
  const models = tencentcloud.cvm.v20170312.Models;
  const Credential = tencentcloud.common.Credential;
  let cred = new Credential(secretId, secretKey);
  let client = new CvmClient(cred, "ap-shanghai");
  let req = new models.DescribeZonesRequest();

  return new Promise((resolve, reject) => {
    client.DescribeZones(req, function(err, response) {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}
