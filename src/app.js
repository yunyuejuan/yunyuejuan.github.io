let intervalId = null;
let requestCount = 0;

function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function onModeChange() {
  const mode = document.getElementById("mode").value;
  const passwordInput = document.getElementById("password");

  if (mode === "2") {
    passwordInput.disabled = true;
    passwordInput.value = "打号模式中密码自动设置";
  } else {
    passwordInput.disabled = false;
    passwordInput.value = "";
  }
}

function sendRequest(username, password) {
  const data = new URLSearchParams();
  const passwordWithPrefix = "WISH_" + password;
  const passwordBase64 = base64Encode(passwordWithPrefix);

  data.append("j_username", username);
  data.append("j_password", passwordBase64);

  fetch("https://jl.yunyuejuan.net/SystemLogin", {
    method: "POST",
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    body: data.toString()
  }).then(() => {
    requestCount++;
    document.getElementById("status").innerText = `已发送请求次数：${requestCount}`;
  }).catch(error => {
    document.getElementById("status").innerText = `请求失败: ${error}`;
  });
}

function start() {
  const mode = document.getElementById("mode").value;
  const username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();
  let intervalSeconds = parseFloat(document.getElementById("interval").value);

  if (!username) {
    alert("请输入手机号");
    return;
  }

  if (isNaN(intervalSeconds) || intervalSeconds <= 0) {
    alert("请求间隔必须是大于 0 的数字");
    return;
  }

  if (mode === "2") {
    password = "1145141919810";
  } else if (!password) {
    alert("请输入密码");
    return;
  }

  if (intervalId !== null) {
    alert("请求已在进行中");
    return;
  }

  requestCount = 0;
  const intervalMs = intervalSeconds * 1000;

  intervalId = setInterval(() => {
    sendRequest(username, password);
  }, intervalMs);
}

function stop() {
  clearInterval(intervalId);
  intervalId = null;
  document.getElementById("status").innerText = "已停止发送请求";
}

// 初始化模式状态
onModeChange();
