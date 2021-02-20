const inquirer = require("inquirer");
const execShPromise = require("exec-sh").promise;
const ghpages = require("gh-pages");

// test 测试环境 pre 预发布环境 prod 正式环境 source 源码
const types = ["test", "pre", "prod", "source"];
const names = {
  test: "测试环境",
  pre: "预发布环境",
  prod: "正式环境",
  source: "源码",
};

function flog(...res) {
  res = ["\n\n", "---->", ...res];
  console.log(...res);
}

// 时间转化
const timeFormat = (type, time) => {
  const addNum = (value) => value.toString().padStart(2, "0");
  let date = time ? new Date(time) : new Date();
  let formateArr = ["YY", "MM", "DD", "hh", "mm", "ss"];
  let list = [];

  list.push(date.getFullYear());
  list.push(addNum(date.getMonth() + 1));
  list.push(addNum(date.getDate()));
  list.push(addNum(date.getHours()));
  list.push(addNum(date.getMinutes()));
  list.push(addNum(date.getSeconds()));

  for (let i in formateArr) {
    type = type.replace(formateArr[i], list[i]);
  }

  return type;
};

// 获取版本号
const getTag = {
  async prod(name) {
    const { tag } = await inquirer.prompt([
      {
        type: "input",
        message: `${name}Tag name(提示：必须包含项目名缩写以及版本号，如v1.0.0)`,
        name: "tag",
        validate: (value) => {
          if (!/^v\d+\.\d+\.\d+$/.test(value)) {
            return false;
          }
          return true;
        },
      },
    ]);
    return tag;
  },
  async pre(name) {
    const { tag } = await inquirer.prompt([
      {
        type: "input",
        message: `${name}Tag name(提示：必须包含项目名缩写以及版本号，如v1.0.0.p1)`,
        name: "tag",
        validate: (value) => {
          if (!/^v\d+\.\d+\.\d+(\.p\d+)$/.test(value)) {
            return false;
          }
          return true;
        },
      },
    ]);
    return tag;
  },
  async source(name) {
    const { tag } = await inquirer.prompt([
      {
        type: "input",
        message: `${name}Tag name(提示：必须包含项目名缩写以及版本号，如v1.0.0)`,
        name: "tag",
        validate: (value) => {
          if (!/^v\d+\.\d+\.\d+$/.test(value)) {
            return false;
          }
          return true;
        },
      },
    ]);
    return tag;
  },
  test() {
    return Promise.resolve("");
  },
};

// git提交
const publish = (options) => {
  return new Promise((resolve, reject) => {
    ghpages.publish(
      "dist",
      {
        ...options,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

async function deploy() {
  let buildFlag = false;
  
  const { type } = await inquirer.prompt([
    {
      type: "list",
      message: "部署什么环境？",
      name: "type",
      choices: types,
    },
  ]);

  if (!type.includes("source")) {
    const { build } = await inquirer.prompt([
      {
        type: "confirm",
        message: `是否需要重新build 运行npm run build命令?`,
        name: "build",
      },
    ]);
    buildFlag = build;
  }

  const { branch } = await inquirer.prompt([
    {
      type: "input",
      message: `请输入${names[type]}git branch(默认为:master)`,
      name: "branch",
      default: "master",
      validate: (value) => {
        if (!type.includes("prod") && value === "master") {
          // return "master是正式环境分支，输入正确分支名";
        }
        return true;
      },
    },
  ]);

  const { commit } = await inquirer.prompt([
    {
      type: "input",
      message: `请输入commit message(默认为:版本更新)`,
      name: "commit",
      default: "版本更新",
    },
  ]);

  const tag = await getTag[type](names[type]);

  if (!type.includes("source") && buildFlag) {
    try {
      await execShPromise(`npm run build`);
      flog("打包完成");
    } catch (err) {
      flog(`build 出错,`, err);
      return;
    }
  }

  const params = {
    // repo: "/ad_front_dist.git",
    message: commit,
    branch,
  };

  tag && (params.tag = tag);

  console.log(params);

  if (type.includes("source")) {
    ghpages.publish(
      "./",
      {
        dotfiles: true,
        message: commit,
        branch,
        tag
      },
      async (err) => {
        if (err) {
          flog("推送失败", err);
        } else {
          await execShPromise("git fetch");
          flog("推送成功");
          flog("tag：", tag);
        }
      }
    );
    return;
  }

  await publish(params)
    .then(async (res) => {
      await execShPromise("git fetch");
      flog("推送成功");
      flog("tag：", tag);
    })
    .catch((err) => {
      flog("推送失败", err);
      return;
    });
}

deploy();