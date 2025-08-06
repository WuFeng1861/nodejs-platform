// 全局状态
const state = {
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('language') || 'zh',
  password: '',
  codes: [],
  packages: [],
  currentAction: null,
  currentActionData: null,
  apiBaseUrl: 'https://nodeplatform.wufeng98.cn/api',
  authToken: '', // 使用特殊密码获取完整代码内容
  currentParameters: {} // 存储当前执行参数
};

// DOM 元素
const elements = {
  themeToggle: document.getElementById('themeToggle'),
  languageToggle: document.getElementById('languageToggle'),
  passwordModal: document.getElementById('passwordModal'),
  passwordInput: document.getElementById('passwordInput'),
  passwordError: document.getElementById('passwordError'),
  cancelPasswordBtn: document.getElementById('cancelPasswordBtn'),
  confirmPasswordBtn: document.getElementById('confirmPasswordBtn'),
  contentSections: document.querySelectorAll('.content-section'),
  navItems: document.querySelectorAll('.nav-item'),
  codeList: document.getElementById('codeList'),
  packageList: document.getElementById('packageList'),
  codeSelect: document.getElementById('codeSelect'),
  selectedCodePreview: document.getElementById('selectedCodePreview'),
  executeOutput: document.getElementById('executeOutput'),
  executeCodeBtn: document.getElementById('executeCodeBtn'),
  addCodeBtn: document.getElementById('addCodeBtn'),
  installPackageBtn: document.getElementById('installPackageBtn'),
  refreshCodeListBtn: document.getElementById('refreshCodeListBtn'),
  refreshPackageListBtn: document.getElementById('refreshPackageListBtn'),
  addCodeModal: document.getElementById('addCodeModal'),
  cancelAddCodeBtn: document.getElementById('cancelAddCodeBtn'),
  submitAddCodeBtn: document.getElementById('submitAddCodeBtn'),
  installPackageModal: document.getElementById('installPackageModal'),
  cancelInstallPackageBtn: document.getElementById('cancelInstallPackageBtn'),
  submitInstallPackageBtn: document.getElementById('submitInstallPackageBtn'),
  packageSearch: document.getElementById('packageSearch'),
  parametersFormContainer: document.getElementById('parametersFormContainer'),
  parametersForm: document.getElementById('parametersForm'),
  addParameterBtn: document.getElementById('addParameterBtn'),
  codeParameters: document.getElementById('codeParameters') // 参数配置输入框
};

// 初始化应用
function initApp() {
  // 设置主题
  setTheme(state.theme);

  // 设置语言
  setLanguage(state.language);

  // 事件监听器
  setupEventListeners();

  // 加载数据
  loadCodeList();
  loadPackageList();
}

// 设置主题
function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('theme', theme);
  document.body.className = theme === 'dark' ? 'dark-mode' : '';

  // 更新主题切换按钮图标
  const icon = elements.themeToggle.querySelector('i');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// 设置语言
function setLanguage(lang) {
  state.language = lang;
  localStorage.setItem('language', lang);
  // 实际项目中这里会有完整的国际化实现
  // 这里简化为切换标题文本
  if (lang === 'en') {
    document.querySelector('.logo span').textContent = 'Node.js Code Execution Platform';
    document.querySelector('[data-target="code-management"] span').textContent = 'Code Management';
    document.querySelector('[data-target="package-management"] span').textContent = 'Package Management';
    document.querySelector('[data-target="execute-code"] span').textContent = 'Execute Code';
    document.querySelector('.content-title').textContent = 'Code Management';
    document.querySelector('#addCodeBtn').innerHTML = '<i class="fas fa-plus"></i> Add New Code';
    document.querySelector('#refreshCodeListBtn').innerHTML = '<i class="fas fa-sync"></i> Refresh';
    document.querySelector('#installPackageBtn').innerHTML = '<i class="fas fa-download"></i> Install Package';
    document.querySelector('#refreshPackageListBtn').innerHTML = '<i class="fas fa-sync"></i> Refresh';
    document.querySelector('#codeSelect option[value=""]').textContent = '-- Select Code --';
    document.querySelector('#selectedCodePreview').textContent = '// Code preview will appear here after selection';
    document.querySelector('#executeOutput').textContent = '// Execution results will appear here';

    // 更新参数表单标签
    if (elements.parametersFormContainer) {
      document.querySelector('#parametersFormContainer h4').textContent = 'Execution Parameters';
      document.querySelector('#addParameterBtn').innerHTML = '<i class="fas fa-plus"></i> Add Parameter';
    }

    // 更新参数配置输入框标签
    if (elements.codeParameters) {
      document.querySelector('label[for="codeParameters"]').textContent = 'Parameters (JSON)';
      elements.codeParameters.placeholder = 'e.g. {"name": {"type": "string", "description": "User name", "required": true}}';
    }
  } else {
    document.querySelector('.logo span').textContent = 'Node.js 代码执行平台';
    document.querySelector('[data-target="code-management"] span').textContent = '代码管理';
    document.querySelector('[data-target="package-management"] span').textContent = '包管理';
    document.querySelector('[data-target="execute-code"] span').textContent = '执行代码';
    document.querySelector('.content-title').textContent = '代码管理';
    document.querySelector('#addCodeBtn').innerHTML = '<i class="fas fa-plus"></i> 添加新代码';
    document.querySelector('#refreshCodeListBtn').innerHTML = '<i class="fas fa-sync"></i> 刷新';
    document.querySelector('#installPackageBtn').innerHTML = '<i class="fas fa-download"></i> 安装新包';
    document.querySelector('#refreshPackageListBtn').innerHTML = '<i class="fas fa-sync"></i> 刷新';
    document.querySelector('#codeSelect option[value=""]').textContent = '-- 选择代码 --';
    document.querySelector('#selectedCodePreview').textContent = '// 选择代码后预览将显示在这里';
    document.querySelector('#executeOutput').textContent = '// 执行结果将显示在这里';

    // 更新参数表单标签
    if (elements.parametersFormContainer) {
      document.querySelector('#parametersFormContainer h4').textContent = '执行参数';
      document.querySelector('#addParameterBtn').innerHTML = '<i class="fas fa-plus"></i> 添加参数';
    }

    // 更新参数配置输入框标签
    if (elements.codeParameters) {
      document.querySelector('label[for="codeParameters"]').textContent = '参数配置 (JSON格式)';
      elements.codeParameters.placeholder = '例如：{"name": {"type": "string", "description": "用户名", "required": true}}';
    }
  }
}

// 设置事件监听器
function setupEventListeners() {
  // 主题切换
  elements.themeToggle.addEventListener('click', () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });

  // 语言切换
  elements.languageToggle.addEventListener('click', () => {
    const newLang = state.language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
  });

  // 导航切换
  elements.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');

      // 更新活动状态
      elements.navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // 显示目标内容区域
      elements.contentSections.forEach(section => {
        section.style.display = 'none';
      });
      document.getElementById(target).style.display = 'block';

      // 更新标题
      const title = document.querySelector('.content-title');
      if (target === 'code-management') {
        title.textContent = state.language === 'zh' ? '代码管理' : 'Code Management';
      } else if (target === 'package-management') {
        title.textContent = state.language === 'zh' ? '包管理' : 'Package Management';
      } else if (target === 'execute-code') {
        title.textContent = state.language === 'zh' ? '执行代码' : 'Execute Code';
      }
    });
  });

  // 密码模态框按钮
  elements.cancelPasswordBtn.addEventListener('click', closePasswordModal);
  elements.confirmPasswordBtn.addEventListener('click', confirmPassword);

  // 添加代码按钮
  elements.addCodeBtn.addEventListener('click', () => {
    showPasswordModal('addCode');
  });

  // 安装包按钮
  elements.installPackageBtn.addEventListener('click', () => {
    showPasswordModal('installPackage');
  });

  // 刷新代码列表
  elements.refreshCodeListBtn.addEventListener('click', loadCodeList);

  // 刷新包列表
  elements.refreshPackageListBtn.addEventListener('click', loadPackageList);

  // 添加代码模态框
  elements.cancelAddCodeBtn.addEventListener('click', () => {
    elements.addCodeModal.classList.remove('active');
  });
  elements.submitAddCodeBtn.addEventListener('click', submitAddCodeForm);

  // 安装包模态框
  elements.cancelInstallPackageBtn.addEventListener('click', () => {
    elements.installPackageModal.classList.remove('active');
  });
  elements.submitInstallPackageBtn.addEventListener('click', submitInstallPackageForm);

  // 代码选择
  elements.codeSelect.addEventListener('change', updateCodePreview);

  // 执行代码
  elements.executeCodeBtn.addEventListener('click', executeCode);

  // 包搜索
  elements.packageSearch.addEventListener('input', filterPackages);

  // 添加参数按钮
  elements.addParameterBtn.addEventListener('click', addParameterRow);
}

// 显示密码模态框
function showPasswordModal(action, data = null) {
  state.currentAction = action;
  state.currentActionData = data;
  elements.passwordInput.value = '';
  elements.passwordError.style.display = 'none';
  elements.passwordModal.classList.add('active');
}

// 关闭密码模态框
function closePasswordModal() {
  elements.passwordModal.classList.remove('active');
  state.currentAction = null;
  state.currentActionData = null;
}

// 确认密码
function confirmPassword() {
  const enteredPassword = elements.passwordInput.value;
  state.password = enteredPassword;
  state.authToken = state.password;
  if (enteredPassword === state.password) {
    // 密码正确
    elements.passwordError.style.display = 'none';
    // 执行对应的操作
    if (state.currentAction === 'addCode') {
      // 显示添加代码模态框
      showAddCodeModal();
    } else if (state.currentAction === 'deleteCode') {
      deleteCode(state.currentActionData);
    } else if (state.currentAction === 'installPackage') {
      // 显示安装包模态框
      showInstallPackageModal();
    } else if (state.currentAction === 'uninstallPackage') {
      uninstallPackage(state.currentActionData);
    }
    closePasswordModal();
  } else {
    // 密码错误
    elements.passwordError.style.display = 'block';
  }
}

// 显示添加代码模态框
function showAddCodeModal() {
  // 重置表单
  document.getElementById('codeTitle').value = '';
  document.getElementById('codeDescription').value = '';
  document.getElementById('codeContent').value = '';
  document.getElementById('codeParameters').value = '';

  // 显示模态框
  elements.addCodeModal.classList.add('active');
}

// 显示安装包模态框
function showInstallPackageModal() {
  // 重置表单
  document.getElementById('packageName').value = '';
  document.getElementById('packageVersion').value = '';

  // 显示模态框
  elements.installPackageModal.classList.add('active');
}

// 提交添加代码表单
function submitAddCodeForm() {
  const title = document.getElementById('codeTitle').value;
  const description = document.getElementById('codeDescription').value;
  const content = document.getElementById('codeContent').value;
  const parameters = document.getElementById('codeParameters').value; // 获取参数配置

  if (!title || !description || !content) {
    alert(state.language === 'zh' ? '请填写所有字段！' : 'Please fill all fields!');
    return;
  }

  // 如果有参数配置，验证JSON格式
  if (parameters) {
    try {
      JSON.parse(parameters);
    } catch (e) {
      showAlert(state.language === 'zh' ? '参数配置格式错误，请输入有效的JSON' : 'Invalid JSON format for parameters', 'error');
      return;
    }
  }

  // 创建代码对象
  const newCode = {
    title,
    description,
    content,
    language: 'javascript',
    parameters: parameters || null // 添加参数配置
  };

  // 调用API添加代码
  axios.post(`${state.apiBaseUrl}/codes`, newCode, {
    headers: {
      'Authorization': `Bearer ${state.authToken}`
    }
  })
    .then(response => {
      if (response.data.code === 200) {
        // 添加成功
        elements.addCodeModal.classList.remove('active');
        showAlert(state.language === 'zh' ? '代码添加成功！' : 'Code added successfully!', 'success');

        // 刷新代码列表
        loadCodeList();
      } else {
        showAlert(response.data.message || (state.language === 'zh' ? '添加代码失败' : 'Failed to add code'), 'error');
      }
    })
    .catch(error => {
      console.error('添加代码失败:', error);
      showAlert(state.language === 'zh' ? '添加代码失败：' + (error.response?.data?.message || error.message) :
        'Failed to add code: ' + (error.response?.data?.message || error.message), 'error');
    });
}

// 提交安装包表单
function submitInstallPackageForm() {
  const packageName = document.getElementById('packageName').value;

  if (!packageName) {
    alert(state.language === 'zh' ? '请输入包名称！' : 'Please enter package name!');
    return;
  }

  const version = document.getElementById('packageVersion').value;
  const packageData = { packageName };

  if (version) {
    packageData.version = version;
  }

  // 调用API安装包
  axios.post(`${state.apiBaseUrl}/packages/install`, packageData, {
    headers: {
      'Authorization': `Bearer ${state.authToken}`
    }
  })
    .then(response => {
      if (response.data.code === 200 && response.data.data.success) {
        // 安装成功
        elements.installPackageModal.classList.remove('active');
        showAlert(state.language === 'zh' ? '包安装成功！' : 'Package installed successfully!', 'success');

        // 刷新包列表
        loadPackageList();
      } else {
        showAlert(response.data.data?.message || (state.language === 'zh' ? '安装包失败' : 'Failed to install package'), 'error');
      }
    })
    .catch(error => {
      console.error('安装包失败:', error);
      showAlert(state.language === 'zh' ? '安装包失败：' + (error.response?.data?.message || error.message) :
        'Failed to install package: ' + (error.response?.data?.message || error.message), 'error');
    });
}

// 加载代码列表
function loadCodeList() {
  elements.codeList.innerHTML = `
    <div class="empty-state" style="text-align: center; padding: 20px;">
      <i class="fas fa-spinner fa-spin"></i>
      <p>${state.language === 'zh' ? '加载中...' : 'Loading...'}</p>
    </div>
  `;

  axios.get(`${state.apiBaseUrl}/codes`, {
    headers: {
      'Authorization': `Bearer admin123`
    }
  })
    .then(response => {
      if (response.data.code === 200) {
        state.codes = response.data.data;
        renderCodeList();
      } else {
        showAlert(response.data.message || (state.language === 'zh' ? '获取代码列表失败' : 'Failed to load code list'), 'error');
      }
    })
    .catch(error => {
      console.error('获取代码列表失败:', error);
      showAlert(state.language === 'zh' ? '获取代码列表失败：' + (error.response?.data?.message || error.message) :
        'Failed to load code list: ' + (error.response?.data?.message || error.message), 'error');
    });
}

// 加载包列表
function loadPackageList() {
  elements.packageList.innerHTML = `
    <div class="empty-state" style="text-align: center; padding: 20px; grid-column: 1 / -1;">
      <i class="fas fa-spinner fa-spin"></i>
      <p>${state.language === 'zh' ? '加载中...' : 'Loading...'}</p>
    </div>
  `;

  axios.get(`${state.apiBaseUrl}/packages`)
    .then(response => {
      if (response.data.code === 200) {
        state.packages = response.data.data;
        renderPackageList();
      } else {
        showAlert(response.data.message || (state.language === 'zh' ? '获取包列表失败' : 'Failed to load package list'), 'error');
      }
    })
    .catch(error => {
      console.error('获取包列表失败:', error);
      showAlert(state.language === 'zh' ? '获取包列表失败：' + (error.response?.data?.message || error.message) :
        'Failed to load package list: ' + (error.response?.data?.message || error.message), 'error');
    });
}

// 删除代码
function deleteCode(codeId) {
  axios.delete(`${state.apiBaseUrl}/codes/${codeId}`, {
    headers: {
      'Authorization': `Bearer ${state.authToken}`
    }
  })
    .then(response => {
      if (response.data.code === 200) {
        showAlert(state.language === 'zh' ? '代码删除成功！' : 'Code deleted successfully!', 'success');
        loadCodeList();
      } else {
        showAlert(response.data.message || (state.language === 'zh' ? '删除代码失败' : 'Failed to delete code'), 'error');
      }
    })
    .catch(error => {
      console.error('删除代码失败:', error);
      showAlert(state.language === 'zh' ? '删除代码失败：' + (error.response?.data?.message || error.message) :
        'Failed to delete code: ' + (error.response?.data?.message || error.message), 'error');
    });
}

// 卸载包
function uninstallPackage(packageName) {
  axios.delete(`${state.apiBaseUrl}/packages/${packageName}`, {
    headers: {
      'Authorization': `Bearer ${state.authToken}`
    }
  })
    .then(response => {
      if (response.data.code === 200 && response.data.data.success) {
        showAlert(state.language === 'zh' ? '包卸载成功！' : 'Package uninstalled successfully!', 'success');
        loadPackageList();
      } else {
        showAlert(response.data.data?.message || (state.language === 'zh' ? '卸载包失败' : 'Failed to uninstall package'), 'error');
      }
    })
    .catch(error => {
      console.error('卸载包失败:', error);
      showAlert(state.language === 'zh' ? '卸载包失败：' + (error.response?.data?.message || error.message) :
        'Failed to uninstall package: ' + (error.response?.data?.message || error.message), 'error');
    });
}

// 渲染代码列表
function renderCodeList() {
  if (state.codes.length === 0) {
    elements.codeList.innerHTML = `
      <div class="empty-state">
        <p>${state.language === 'zh' ? '暂无代码，请添加新代码' : 'No codes available, add new code'}</p>
      </div>
    `;
    return;
  }

  let html = '';
  state.codes.forEach(code => {
    html += `
      <div class="code-card">
        <div class="card-header">
          <h3 class="card-title">${code.title}</h3>
          <span class="badge">${code.language || 'javascript'}</span>
        </div>
        <p>${code.description}</p>
        <div class="code-content">${escapeHtml(code.content || '// 无内容')}</div>
        <div class="code-info">
          <span><i class="fas fa-play"></i> ${state.language === 'zh' ? '执行次数' : 'Executions'}: ${code.executeCount || 0}</span>
          <span><i class="fas fa-calendar"></i> ${formatDate(code.createdAt)}</span>
        </div>
        <div class="actions">
          <button class="btn btn-success execute-btn" data-id="${code.id}">
            <i class="fas fa-play"></i> ${state.language === 'zh' ? '执行' : 'Execute'}
          </button>
          <button class="btn btn-danger delete-btn" data-id="${code.id}">
            <i class="fas fa-trash"></i> ${state.language === 'zh' ? '删除' : 'Delete'}
          </button>
        </div>
      </div>
    `;
  });

  elements.codeList.innerHTML = html;

  // 添加事件监听器
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const codeId = parseInt(e.target.closest('.delete-btn').getAttribute('data-id'));
      showPasswordModal('deleteCode', codeId);
    });
  });

  document.querySelectorAll('.execute-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const codeId = parseInt(e.target.closest('.execute-btn').getAttribute('data-id'));
      // 设置选择框的值
      elements.codeSelect.value = codeId;
      // 更新预览
      updateCodePreview();
      // 切换到执行代码标签页
      document.querySelector('[data-target="execute-code"]').click();
    });
  });

  // 更新代码选择下拉框
  updateCodeSelect();
}

// 渲染包列表
function renderPackageList() {
  if (state.packages.length === 0) {
    elements.packageList.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>${state.language === 'zh' ? '没有安装任何包' : 'No packages installed'}</p>
      </div>
    `;
    return;
  }

  let html = '';
  state.packages.forEach(pkg => {
    html += `
      <div class="package-card">
        <div class="package-header">
          <div class="package-name">${pkg.name}</div>
          <div class="package-version">${pkg.version}</div>
        </div>
        <div class="package-description">${pkg.description || (state.language === 'zh' ? '无描述' : 'No description')}</div>
        <div class="package-status ${pkg.installed ? 'installed' : 'not-installed'}">
          <i class="fas ${pkg.installed ? 'fa-check-circle' : 'fa-times-circle'}"></i>
          ${pkg.installed ?
      (state.language === 'zh' ? '已安装' : 'Installed') :
      (state.language === 'zh' ? '未安装' : 'Not Installed')}
        </div>
        <div class="actions" style="margin-top: 10px;">
          ${pkg.installed ?
      `<button class="btn btn-danger uninstall-btn" data-package="${pkg.name}">
              <i class="fas fa-trash"></i> ${state.language === 'zh' ? '卸载' : 'Uninstall'}
            </button>` :
      `<button class="btn btn-success install-btn" data-package="${pkg.name}">
              <i class="fas fa-download"></i> ${state.language === 'zh' ? '安装' : 'Install'}
            </button>`}
        </div>
      </div>
    `;
  });

  elements.packageList.innerHTML = html;

  // 添加事件监听器
  document.querySelectorAll('.install-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const packageName = e.target.closest('.install-btn').getAttribute('data-package');
      showPasswordModal('installPackage', packageName);
    });
  });

  document.querySelectorAll('.uninstall-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const packageName = e.target.closest('.uninstall-btn').getAttribute('data-package');
      showPasswordModal('uninstallPackage', packageName);
    });
  });
}

// 更新代码选择下拉框
function updateCodeSelect() {
  let html = '<option value="">-- ' + (state.language === 'zh' ? '选择代码' : 'Select Code') + ' --</option>';

  state.codes.forEach(code => {
    html += `<option value="${code.id}">${code.title}</option>`;
  });

  elements.codeSelect.innerHTML = html;

  // 如果没有选择任何代码，清空预览
  if (!elements.codeSelect.value) {
    elements.selectedCodePreview.textContent = state.language === 'zh' ?
      '// 选择代码后预览将显示在这里' :
      '// Code preview will appear here after selection';
    elements.parametersFormContainer.style.display = 'none';
  }
}

// 更新代码预览
function updateCodePreview() {
  const codeId = elements.codeSelect.value;
  if (!codeId) {
    elements.selectedCodePreview.textContent = state.language === 'zh' ?
      '// 选择代码后预览将显示在这里' :
      '// Code preview will appear here after selection';
    elements.parametersFormContainer.style.display = 'none';
    return;
  }

  const code = state.codes.find(c => c.id == codeId);
  if (code) {
    elements.selectedCodePreview.textContent = code.content;
    renderParametersForm(code.parameters);
  } else {
    // 如果代码不在缓存中，从API获取
    axios.get(`${state.apiBaseUrl}/codes/${codeId}`, {
      headers: {
        'Authorization': `Bearer admin123`
      }
    })
      .then(response => {
        if (response.data.code === 200) {
          elements.selectedCodePreview.textContent = response.data.data.content;
          renderParametersForm(response.data.data.parameters);
        } else {
          elements.selectedCodePreview.textContent = state.language === 'zh' ?
            '// 获取代码内容失败' :
            '// Failed to load code content';
          elements.parametersFormContainer.style.display = 'none';
        }
      })
      .catch(error => {
        console.error('获取代码详情失败:', error);
        elements.selectedCodePreview.textContent = state.language === 'zh' ?
          '// 获取代码内容失败' :
          '// Failed to load code content';
        elements.parametersFormContainer.style.display = 'none';
      });
  }
}

// 渲染参数表单
function renderParametersForm(parametersJson) {
  // 清空现有参数
  elements.parametersForm.innerHTML = '';
  state.currentParameters = {};

  // 如果没有参数配置，隐藏表单
  if (!parametersJson) {
    elements.parametersFormContainer.style.display = 'none';
    return;
  }

  try {
    const parameters = JSON.parse(parametersJson);
    const paramNames = Object.keys(parameters);

    if (paramNames.length === 0) {
      elements.parametersFormContainer.style.display = 'none';
      return;
    }

    // 显示参数表单
    elements.parametersFormContainer.style.display = 'block';

    // 为每个参数添加输入行
    paramNames.forEach(paramName => {
      const paramConfig = parameters[paramName];
      addParameterRow(paramName, paramConfig);
    });
  } catch (e) {
    console.error('解析参数配置失败:', e);
    elements.parametersFormContainer.style.display = 'none';
  }
}

// 添加参数行
function addParameterRow(name = '', config = {}) {
  const rowId = `param-row-${Date.now()}`;
  const rowHtml = `
    <div class="parameter-row" id="${rowId}">
      <div class="parameter-key form-group" style="flex: 1;">
        <input type="text" class="form-control param-name" placeholder="${state.language === 'zh' ? '参数名' : 'Parameter name'}" value="${name}" ${name ? 'readonly' : ''}>
      </div>
      <div class="parameter-value form-group" style="flex: 1;">
        <input type="text" class="form-control param-value" placeholder="${state.language === 'zh' ? '参数值' : 'Parameter value'}">
      </div>
      <div class="parameter-actions">
        <button class="btn btn-danger remove-param-btn">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  elements.parametersForm.insertAdjacentHTML('beforeend', rowHtml);

  // 添加删除按钮事件
  const rowElement = document.getElementById(rowId);
  rowElement.querySelector('.remove-param-btn').addEventListener('click', () => {
    rowElement.remove();
    updateParametersState();
  });

  // 添加输入变化事件
  rowElement.querySelector('.param-name').addEventListener('input', updateParametersState);
  rowElement.querySelector('.param-value').addEventListener('input', updateParametersState);
}

// 更新参数状态
function updateParametersState() {
  state.currentParameters = {};

  document.querySelectorAll('.parameter-row').forEach(row => {
    const nameInput = row.querySelector('.param-name');
    const valueInput = row.querySelector('.param-value');

    if (nameInput.value && valueInput.value) {
      state.currentParameters[nameInput.value] = valueInput.value;
    }
  });
}

// 执行代码
function executeCode() {
  const codeId = elements.codeSelect.value;
  if (!codeId) {
    showAlert(state.language === 'zh' ? '请先选择要执行的代码' : 'Please select a code to execute', 'warning');
    return;
  }

  // 收集参数
  updateParametersState();
  const params = Object.keys(state.currentParameters).length > 0 ?
    { params: state.currentParameters } : {};

  // 显示加载状态
  elements.executeOutput.textContent = state.language === 'zh' ?
    '执行中...' :
    'Executing...';
  elements.executeOutput.className = 'output-content';

  // 发送请求，带上参数
  axios.post(`${state.apiBaseUrl}/codes/${codeId}/execute`, params)
    .then(response => {
      if (response.data.code === 200) {
        const result = response.data.data;
        if (result.success) {
          elements.executeOutput.textContent = result.output || (state.language === 'zh' ? '执行成功，无输出' : 'Execution successful, no output');
          elements.executeOutput.className = 'output-content success-output';
        } else {
          elements.executeOutput.textContent = result.error || (state.language === 'zh' ? '执行失败' : 'Execution failed');
          elements.executeOutput.className = 'output-content error-output';
        }

        // 更新执行次数
        const codeIndex = state.codes.findIndex(c => c.id == codeId);
        if (codeIndex !== -1) {
          state.codes[codeIndex].executeCount = (state.codes[codeIndex].executeCount || 0) + 1;

          // 更新UI中的执行次数
          const executeCountElement = document.querySelector(`.code-card .execute-btn[data-id="${codeId}"]`)
            ?.closest('.code-card')
            ?.querySelector('.code-info span:first-child');

          if (executeCountElement) {
            executeCountElement.innerHTML = `<i class="fas fa-play"></i> ${state.language === 'zh' ? '执行次数' : 'Executions'}: ${state.codes[codeIndex].executeCount}`;
          }
        }
      } else {
        elements.executeOutput.textContent = response.data.message || (state.language === 'zh' ? '执行失败' : 'Execution failed');
        elements.executeOutput.className = 'output-content error-output';
      }
    })
    .catch(error => {
      console.error('执行代码失败:', error);
      elements.executeOutput.textContent = state.language === 'zh' ?
        `执行失败: ${error.response?.data?.message || error.message}` :
        `Execution failed: ${error.response?.data?.message || error.message}`;
      elements.executeOutput.className = 'output-content error-output';
    });
}

// 过滤包列表
function filterPackages() {
  const searchTerm = elements.packageSearch.value.toLowerCase();
  if (!searchTerm) {
    renderPackageList();
    return;
  }

  const filteredPackages = state.packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm) ||
    (pkg.description && pkg.description.toLowerCase().includes(searchTerm)));

  if (filteredPackages.length === 0) {
    elements.packageList.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>${state.language === 'zh' ? '没有找到匹配的包' : 'No matching packages found'}</p>
      </div>
    `;
    return;
  }

  let html = '';
  filteredPackages.forEach(pkg => {
    html += `
      <div class="package-card">
        <div class="package-header">
          <div class="package-name">${pkg.name}</div>
          <div class="package-version">${pkg.version}</div>
        </div>
        <div class="package-description">${pkg.description || (state.language === 'zh' ? '无描述' : 'No description')}</div>
        <div class="package-status ${pkg.installed ? 'installed' : 'not-installed'}">
          <i class="fas ${pkg.installed ? 'fa-check-circle' : 'fa-times-circle'}"></i>
          ${pkg.installed ?
      (state.language === 'zh' ? '已安装' : 'Installed') :
      (state.language === 'zh' ? '未安装' : 'Not Installed')}
        </div>
        <div class="actions" style="margin-top: 10px;">
          ${pkg.installed ?
      `<button class="btn btn-danger uninstall-btn" data-package="${pkg.name}">
              <i class="fas fa-trash"></i> ${state.language === 'zh' ? '卸载' : 'Uninstall'}
            </button>` :
      `<button class="btn btn-success install-btn" data-package="${pkg.name}">
              <i class="fas fa-download"></i> ${state.language === 'zh' ? '安装' : 'Install'}
            </button>`}
        </div>
      </div>
    `;
  });

  elements.packageList.innerHTML = html;

  // 重新绑定事件监听器
  document.querySelectorAll('.install-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const packageName = e.target.closest('.install-btn').getAttribute('data-package');
      showPasswordModal('installPackage', packageName);
    });
  });

  document.querySelectorAll('.uninstall-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const packageName = e.target.closest('.uninstall-btn').getAttribute('data-package');
      showPasswordModal('uninstallPackage', packageName);
    });
  });
}

// 显示提示消息
function showAlert(message, type) {
  // 在实际项目中，这里会使用更优雅的通知系统
  alert(`[${type === 'success' ? '✓' : '✗'}] ${message}`);
}

// 辅助函数：转义HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 辅助函数：格式化日期
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(state.language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);
