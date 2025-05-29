// 页面切换逻辑
function initNavigation() {
    // 获取所有导航项和页面
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    // 为每个导航项添加点击事件
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // 获取目标页面ID
            const targetPageId = item.getAttribute('data-page');
            console.log('Switching to page:', targetPageId); // 调试日志
            
            // 更新导航项状态
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // 更新页面显示状态
            pages.forEach(page => {
                if (page.id === targetPageId) {
                    page.style.display = 'block';
                    page.classList.add('active');
                    // 如果切换到活动页面，初始化活动列表
                    if (targetPageId === 'activities') {
                        updateActivityList('hosted');
                        updateActivityList('joined');
                    }
                    // 如果切换到学习日常页面，初始化学习记录
                    if (targetPageId === 'learning') {
                        initLearningPage();
                    }
                } else {
                    page.style.display = 'none';
                    page.classList.remove('active');
                }
            });
        });
    });
}

// 初始化活动页面
function initActivitiesPage() {
    // 切换标签页
    const tabButtons = document.querySelectorAll('.activities-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.activities-content');

    // 更新标签名称
    const hostedTab = document.querySelector('.activities-tabs .tab-btn[data-tab="hosted"]');
    const joinedTab = document.querySelector('.activities-tabs .tab-btn[data-tab="joined"]');
    if (hostedTab) hostedTab.textContent = '举办活动';
    if (joinedTab) joinedTab.textContent = '已报名';

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新内容显示
            const tabId = btn.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.style.display = 'block';
                    content.classList.add('active');
                } else {
                    content.style.display = 'none';
                    content.classList.remove('active');
                }
            });
            
            // 更新活动列表
            updateActivityList(tabId);
        });
    });

    // 创建活动按钮
    const createBtn = document.querySelector('.create-activity-btn');
    if (createBtn) {
        // 移除现有的事件监听器
        const newCreateBtn = createBtn.cloneNode(true);
        createBtn.parentNode.replaceChild(newCreateBtn, createBtn);
        
        newCreateBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止默认行为
            const modal = document.getElementById('createActivityModal');
            if (modal) {
                // 更新模态框内容
                modal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>创建新活动</h3>
                            <button class="close-btn">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form id="createActivityForm">
                                <div class="form-group">
                                    <label>活动标题</label>
                                    <input type="text" name="title" required>
                                </div>
                                <div class="form-group">
                                    <label>活动时间</label>
                                    <input type="datetime-local" name="time" required>
                                </div>
                                <div class="form-group">
                                    <label>活动地点</label>
                                    <input type="text" name="location" required>
                                </div>
                                <div class="form-group">
                                    <label>最大参与人数</label>
                                    <input type="number" name="maxParticipants" min="1" required>
                                </div>
                                <div class="form-group">
                                    <label>活动描述</label>
                                    <textarea name="description" rows="3" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label>活动封面</label>
                                    <input type="file" name="image" accept="image/*" required>
                                </div>
                                <button type="submit" class="submit-btn">创建活动</button>
                            </form>
                        </div>
                    </div>
                `;
                
                // 添加关闭按钮事件监听
                const closeBtn = modal.querySelector('.close-btn');
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
                
                // 添加表单提交事件监听
                const form = modal.querySelector('#createActivityForm');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    
                    // 创建新活动对象
                    const newActivity = {
                        id: 'hosted' + (hostedActivities.length + 1),
                        title: formData.get('title'),
                        time: formData.get('time'),
                        location: formData.get('location'),
                        maxParticipants: parseInt(formData.get('maxParticipants')),
                        currentParticipants: 0,
                        status: 'pending',
                        description: formData.get('description'),
                        image: URL.createObjectURL(formData.get('image'))
                    };
                    
                    // 添加到举办活动列表
                    hostedActivities.push(newActivity);
                    
                    // 关闭模态框
                    modal.classList.remove('active');
                    
                    // 更新活动列表显示
                    updateActivityList('hosted');
                    
                    // 显示成功提示
                    alert('活动已提交审核！');
                    
                    // 重置表单
                    e.target.reset();
                });
                
                modal.classList.add('active');
            }
        });
    }

    // 初始化活动列表
    updateActivityList('hosted');
    updateActivityList('joined');
}

// 初始化学习日常页面
function initLearningPage() {
    // 初始化学习记录
    updateLearningRecords();
    // 初始化AI助手
    initAIAssistant();
}

// 更新学习记录
function updateLearningRecords() {
    const records = [
        {
            type: 'youth',
            title: '党的二十大精神专题学习',
            date: '2024-03-15',
            duration: '45分钟',
            score: '95分',
            status: 'completed'
        },
        {
            type: 'youth',
            title: '习近平新时代中国特色社会主义思想学习',
            date: '2024-03-10',
            duration: '40分钟',
            score: '92分',
            status: 'completed'
        },
        {
            type: 'course',
            title: '思想道德与法治',
            date: '2024-03-14',
            attendance: '出勤',
            performance: '优秀',
            homework: '已完成'
        },
        {
            type: 'course',
            title: '中国近现代史纲要',
            date: '2024-03-12',
            attendance: '出勤',
            performance: '良好',
            homework: '已完成'
        },
        {
            type: 'activity',
            title: '红色文化传承行',
            date: '2024-03-10',
            role: '参与者',
            status: '已完成'
        },
        {
            type: 'activity',
            title: '乡村振兴调研实践',
            date: '2024-03-08',
            role: '组织者',
            status: '已完成'
        },
        {
            type: 'project',
            title: '新时代青年责任担当研究',
            date: '2024-03-01',
            progress: '进行中',
            status: '80%'
        },
        {
            type: 'project',
            title: '高校思政教育创新研究',
            date: '2024-02-25',
            progress: '已完成',
            status: '100%'
        },
        {
            type: 'other',
            title: '志愿服务培训',
            date: '2024-03-05',
            description: '参与社区志愿服务培训，提升服务能力'
        },
        {
            type: 'other',
            title: '创新创业讲座',
            date: '2024-03-03',
            description: '参加创新创业专题讲座，学习创业知识'
        }
    ];

    const container = document.querySelector('#learning .learning-records');
    if (!container) return;

    // 获取类型对应的显示文本
    function getTypeText(type) {
        const typeMap = {
            'youth': '青年大学习',
            'course': '思政课程',
            'activity': '活动参与',
            'project': '研究项目',
            'other': '其他'
        };
        return typeMap[type] || type;
    }

    // 生成记录卡片内容
    function generateRecordContent(record) {
        switch(record.type) {
            case 'youth':
                return `
                    <p>学习时长：${record.duration}</p>
                    <p>测试成绩：${record.score}</p>
                `;
            case 'course':
                return `
                    <p>考勤：${record.attendance}</p>
                    <p>课堂表现：${record.performance}</p>
                    <p>作业：${record.homework}</p>
                `;
            case 'activity':
                return `
                    <p>角色：${record.role}</p>
                    <p>状态：${record.status}</p>
                `;
            case 'project':
                return `
                    <p>进度：${record.progress}</p>
                    <p>完成度：${record.status}</p>
                `;
            default:
                return `<p>${record.description || '暂无描述'}</p>`;
        }
    }

    container.innerHTML = `
        <div class="learning-container">
            <!-- 上部分：学习历史 -->
            <div class="learning-history">
                <div class="history-header">
                    <h2>学习历史</h2>
                    <button class="upload-btn" onclick="showUploadModal()">
                        <i class="anticon anticon-upload"></i>
                        上传学习活动
                    </button>
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">全部</button>
                    <button class="filter-btn" data-filter="youth">青年大学习</button>
                    <button class="filter-btn" data-filter="course">思政课程</button>
                    <button class="filter-btn" data-filter="activity">活动参与</button>
                    <button class="filter-btn" data-filter="project">研究项目</button>
                    <button class="filter-btn" data-filter="other">其他</button>
                </div>
                <div class="records-list">
                    ${records.map(record => `
                        <div class="record-card" data-type="${record.type}">
                            <div class="record-header">
                                <span class="record-type">${getTypeText(record.type)}</span>
                                <span class="record-date">${record.date}</span>
                            </div>
                            <div class="record-content">
                                <h4>${record.title}</h4>
                                ${generateRecordContent(record)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 下部分：AI助手 -->
            <div class="ai-assistant-section">
                <button class="ai-assistant-btn" onclick="showAIAssistant()">
                    <div class="ai-assistant-content">
                        <i class="anticon anticon-robot"></i>
                        <div class="ai-assistant-text">
                            <span>AI学习助手</span>
                            <p>解答疑惑 · 定制计划</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- 上传学习活动模态框 -->
        <div class="modal" id="uploadModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>上传学习活动</h3>
                    <button class="close-btn" onclick="closeUploadModal()">
                        <i class="anticon anticon-close"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="uploadForm" class="upload-form">
                        <div class="form-group">
                            <label>活动类型</label>
                            <div class="type-tags">
                                <label class="type-tag">
                                    <input type="radio" name="type" value="youth" required>
                                    <span>青年大学习</span>
                                </label>
                                <label class="type-tag">
                                    <input type="radio" name="type" value="course">
                                    <span>思政课程</span>
                                </label>
                                <label class="type-tag">
                                    <input type="radio" name="type" value="activity">
                                    <span>活动参与</span>
                                </label>
                                <label class="type-tag">
                                    <input type="radio" name="type" value="project">
                                    <span>研究项目</span>
                                </label>
                                <label class="type-tag">
                                    <input type="radio" name="type" value="other">
                                    <span>其他</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>活动标题</label>
                            <input type="text" name="title" required>
                        </div>
                        <div class="form-group">
                            <label>活动日期</label>
                            <input type="date" name="date" required>
                        </div>
                        <div class="form-group">
                            <label>活动描述</label>
                            <textarea name="description" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label>上传证明</label>
                            <input type="file" name="proof" accept="image/*,.pdf">
                        </div>
                        <button type="submit" class="submit-btn">提交</button>
                    </form>
                </div>
            </div>
        </div>

        <!-- AI助手对话框 -->
        <div class="modal" id="aiAssistantModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>AI学习助手</h3>
                    <button class="close-btn" onclick="closeAIAssistant()">
                        <i class="anticon anticon-close"></i>
                    </button>
                </div>
                <div class="chat-container">
                    <div class="chat-messages" id="chatMessages">
                        <div class="message assistant">
                            <div class="message-content">
                                你好！我是你的AI学习助手，我可以：
                                <ul>
                                    <li>解答思政学习中的疑惑</li>
                                    <li>提供通俗易懂的知识讲解</li>
                                    <li>帮你制定个性化学习计划</li>
                                </ul>
                                有什么我可以帮你的吗？
                            </div>
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="userInput" placeholder="输入你的问题...">
                        <button id="sendMessage">发送</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .learning-container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: #f8f9fa;
        }

        .learning-history {
            flex: 2;
            padding: 15px;
            overflow-y: auto;
            background: white;
            border-radius: 12px;
            margin: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .history-header h2 {
            margin: 0;
            color: #333;
        }

        .upload-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #2D5C9E;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .upload-btn:hover {
            background: #1a3c6e;
            transform: translateY(-1px);
        }

        .upload-btn i {
            font-size: 16px;
        }

        .filter-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            overflow-x: auto;
            padding-bottom: 10px;
        }

        .filter-btn {
            padding: 8px 16px;
            background: white;
            border: 1px solid #eee;
            border-radius: 20px;
            color: #666;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s;
        }

        .filter-btn.active {
            background: #2D5C9E;
            color: white;
            border-color: #2D5C9E;
        }

        .records-list {
            display: grid;
            gap: 15px;
        }

        .record-card {
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .record-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .record-type {
            color: #2D5C9E;
            font-weight: 500;
        }

        .record-date {
            color: #666;
        }

        .record-content h4 {
            margin: 0 0 10px 0;
            color: #333;
        }

        .record-content p {
            margin: 5px 0;
            color: #666;
        }

        .ai-assistant-section {
            flex: 1;
            padding: 15px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            min-height: 60px;
        }

        .ai-assistant-btn {
            width: 90%;
            max-width: 400px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #2D5C9E 0%, #1a3c6e 100%);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(45, 92, 158, 0.2);
            position: relative;
            overflow: hidden;
        }

        .ai-assistant-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            transition: 0.5s;
        }

        .ai-assistant-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(45, 92, 158, 0.3);
        }

        .ai-assistant-btn:hover::before {
            left: 100%;
        }

        .ai-assistant-content {
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            z-index: 1;
        }

        .ai-assistant-content i {
            font-size: 22px;
            color: #ffffff;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .ai-assistant-btn:hover .ai-assistant-content i {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .ai-assistant-text {
            text-align: left;
        }

        .ai-assistant-text span {
            display: block;
            font-size: 15px;
            color: #ffffff;
            font-weight: 600;
            margin-bottom: 2px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .ai-assistant-text p {
            margin: 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            width: 90%;
            max-width: 360px;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
        }

        .modal-body {
            flex: 1;
            overflow-y: auto;
            padding-bottom: 30px; /* 增加底部留白 */
            scrollbar-width: thin;
            scrollbar-color: #2D5C9E #f0f0f0;
        }

        .modal-body::-webkit-scrollbar {
            width: 6px;
        }

        .modal-body::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 3px;
        }

        .modal-body::-webkit-scrollbar-thumb {
            background: #2D5C9E;
            border-radius: 3px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
            background: #1a3c6e;
        }

        .upload-form {
            padding: 20px;
            padding-bottom: 40px; /* 增加表单底部留白 */
        }

        .modal-header {
            padding: 12px 16px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            position: relative;
        }

        .modal-header h3 {
            margin: 0;
            color: #333;
            font-size: 16px;
            font-weight: 500;
        }

        .close-btn {
            background: none;
            border: none;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            color: #666;
            transition: all 0.3s ease;
            position: absolute;
            top: 8px;
            right: 8px;
            margin: 0;
        }

        .close-btn::before,
        .close-btn::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 2px;
            background-color: currentColor;
            border-radius: 1px;
            transition: all 0.3s ease;
        }

        .close-btn::before {
            transform: rotate(45deg);
        }

        .close-btn::after {
            transform: rotate(-45deg);
        }

        .close-btn:hover {
            background: #f5f5f5;
            color: #2D5C9E;
            transform: rotate(90deg);
        }

        .close-btn:hover::before,
        .close-btn:hover::after {
            background-color: #2D5C9E;
        }

        .close-btn:active {
            transform: scale(0.95) rotate(90deg);
        }

        .type-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 8px;
        }

        .type-tag {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .type-tag input[type="radio"] {
            display: none;
        }

        .type-tag input[type="radio"]:checked + span {
            color: #2D5C9E;
            font-weight: 500;
        }

        .type-tag:hover {
            background: #f0f0f0;
        }

        .submit-btn {
            width: 100%;
            padding: 12px;
            background: #2D5C9E;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .submit-btn:hover {
            background: #1a3c6e;
        }

        .chat-container {
            height: 400px;
            display: flex;
            flex-direction: column;
            background: #f8f9fa;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .message {
            margin-bottom: 12px;
            max-width: 85%;
        }

        .message.user {
            margin-left: auto;
        }

        .message-content {
            display: inline-block;
            padding: 10px 14px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.4;
        }

        .message.assistant .message-content {
            background: white;
            color: #333;
            border: 1px solid #eee;
        }

        .message.user .message-content {
            background: #2D5C9E;
            color: white;
        }

        .message-content ul {
            margin: 8px 0;
            padding-left: 20px;
        }

        .message-content li {
            margin: 4px 0;
        }

        .chat-input {
            padding: 12px 16px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 8px;
            background: white;
        }

        .chat-input input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 20px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s;
        }

        .chat-input input:focus {
            border-color: #2D5C9E;
        }

        .chat-input button {
            padding: 8px 16px;
            background: #2D5C9E;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: opacity 0.3s;
        }

        .chat-input button:hover {
            opacity: 0.9;
        }
    `;

    document.head.appendChild(style);

    // 添加事件监听器
    const filterButtons = container.querySelectorAll('.filter-btn');
    const recordCards = container.querySelectorAll('.record-card');

    // 筛选记录
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 筛选记录
            recordCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-type') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 初始化上传表单
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(uploadForm);
            const type = formData.get('type');
            const title = formData.get('title');
            const date = formData.get('date');
            const description = formData.get('description');
            
            // 这里可以添加表单提交逻辑
            console.log('Form submitted:', { type, title, date, description });
            
            // 关闭模态框
            closeUploadModal();
        });
    }
}

// 显示上传模态框
function showUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// 关闭上传模态框
function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 显示AI助手对话框
function showAIAssistant() {
    const modal = document.getElementById('aiAssistantModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// 关闭AI助手对话框
function closeAIAssistant() {
    const modal = document.getElementById('aiAssistantModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 显示学习历史详情
function showHistoryDetail() {
    // 这里可以添加查看历史详情的逻辑
    alert('查看历史详情功能开发中...');
}

// 初始化AI助手
function initAIAssistant() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    if (!userInput || !sendButton || !chatMessages) return;

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${content}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';

        // 模拟AI回复
        setTimeout(() => {
            const responses = [
                '我理解你的问题，让我来为你解答...',
                '这是一个很好的问题，我们可以从以下几个方面来理解...',
                '根据你的情况，我建议你可以这样学习...',
                '这个问题涉及到几个重要的概念，让我们一步步来分析...'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse);
        }, 1000);
    }

    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化导航
    initNavigation();
    
    // 初始化活动页面
    initActivitiesPage();
    
    // 初始化设置页面
    initSettingsPage();
    
    // 初始化其他功能
    initCharts();
    updateTimeline();
    initHotActivitiesScroll();
});

// 添加记录按钮
const addRecordBtn = document.querySelector('.add-record-btn');
const addRecordModal = document.getElementById('addRecordModal');
const addRecordForm = document.getElementById('addRecordForm');

addRecordBtn.addEventListener('click', () => {
    addRecordModal.classList.add('active');
});

// 关闭模态框
addRecordModal.addEventListener('click', (e) => {
    if (e.target === addRecordModal) {
        addRecordModal.classList.remove('active');
    }
});

// 表单提交
addRecordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 显示区块链加载动画
    showBlockchainLoading();
    
    // 模拟提交延迟
    setTimeout(() => {
        // 保存到 localStorage
        const formData = new FormData(addRecordForm);
        const record = {
            title: formData.get('title'),
            date: formData.get('date'),
            content: formData.get('content'),
            timestamp: new Date().toISOString()
        };
        
        saveRecord(record);
        
        // 关闭模态框
        addRecordModal.classList.remove('active');
        addRecordForm.reset();
        
        // 更新时间轴
        updateTimeline();
    }, 2000);
});

// 保存记录到 localStorage
function saveRecord(record) {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));
}

// 更新时间轴显示
function updateTimeline() {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const timeline = document.querySelector('.timeline');
    
    // 清空现有内容
    timeline.innerHTML = '';
    
    // 添加记录
    records.forEach(record => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-date">${new Date(record.date).toLocaleDateString()}</div>
            <div class="timeline-content">
                <h3>${record.title}</h3>
                <p>${record.content}</p>
            </div>
        `;
        timeline.appendChild(item);
    });
}

// 显示区块链加载动画
function showBlockchainLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'blockchain-loading';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-icon"></div>
            <div class="loading-text">正在上链...</div>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    
    setTimeout(() => {
        loadingOverlay.remove();
    }, 2000);
}

// 初始化图表
function initCharts() {
    // 热力地图
    const heatMapCtx = document.getElementById('heatMapChart').getContext('2d');
    new Chart(heatMapCtx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: '高校思政活跃度',
                data: [
                    { x: 1, y: 1, r: 20 },
                    { x: 2, y: 2, r: 15 },
                    { x: 3, y: 1, r: 25 },
                    { x: 4, y: 3, r: 18 },
                    { x: 5, y: 2, r: 22 }
                ],
                backgroundColor: 'rgba(45, 92, 158, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        }
    });

    // 趋势图
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['2020', '2021', '2022', '2023'],
            datasets: [{
                label: '学习成果增长趋势',
                data: [65, 75, 85, 95],
                borderColor: '#2D5C9E',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(45, 92, 158, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// 登录/注册相关
const authContainer = document.querySelector('.auth-container');
const appContainer = document.querySelector('.app-container');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginTabs = document.querySelectorAll('.tab-btn');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');

// 检查登录状态
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
    } else {
        authContainer.style.display = 'flex';
        appContainer.style.display = 'none';
    }
}

// 登录/注册表单切换
showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
});

// 登录表单切换
loginTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        loginTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabId = tab.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    });
});

// 发送验证码
function startCountdown(button) {
    let countdown = 60;
    button.disabled = true;
    button.textContent = `${countdown}秒后重试`;
    
    const timer = setInterval(() => {
        countdown--;
        button.textContent = `${countdown}秒后重试`;
        
        if (countdown <= 0) {
            clearInterval(timer);
            button.disabled = false;
            button.textContent = '获取验证码';
        }
    }, 1000);
}

// 为所有验证码按钮添加事件监听
document.querySelectorAll('.sms-btn').forEach(button => {
    button.addEventListener('click', () => {
        const form = button.closest('form');
        const phoneInput = form.querySelector('input[name="phone"]');
        const phone = phoneInput.value;

        if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
            alert('请输入正确的手机号码');
            return;
        }
        
        // 模拟发送验证码
        alert('验证码已发送！');
        startCountdown(button);
    });
});

// 登录表单提交
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const phone = formData.get('phone');
    const password = formData.get('password');
    const code = formData.get('code');
    
    // 密码登录
    if (document.getElementById('passwordLogin').classList.contains('active')) {
        // 立即显示登录成功
        alert('登录成功！');
        showLoading(loginForm.querySelector('button[type="submit"]'));
        // 延迟2秒后跳转
        setTimeout(() => {
            hideLoading(loginForm.querySelector('button[type="submit"]'));
            localStorage.setItem('token', 'demo-token');
            checkAuth();
        }, 2000);
    }
    // 验证码登录
    else {
        // 立即显示登录成功
        alert('登录成功！');
        showLoading(loginForm.querySelector('button[type="submit"]'));
        // 延迟2秒后跳转
        setTimeout(() => {
            hideLoading(loginForm.querySelector('button[type="submit"]'));
            localStorage.setItem('token', 'demo-token');
            checkAuth();
        }, 2000);
    }
});

// 注册表单提交
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const phone = formData.get('phone');
    const idCard = formData.get('idCard');
    const xuexin = formData.get('xuexin');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // 验证身份证
    if (!idCard || !/^\d{17}[\dX]$/.test(idCard)) {
        showError('idCard', '请输入正确的身份证号码');
        return;
    }
    
    // 验证学信网账号
    if (!xuexin) {
        showError('xuexin', '请输入学信网账号');
        return;
    }
    
    // 验证密码
    if (!password || password.length < 6) {
        showError('password', '密码长度不能少于6位');
        return;
    }
    
    // 验证确认密码
    if (password !== confirmPassword) {
        showError('confirmPassword', '两次输入的密码不一致');
        return;
    }
    
    // 立即显示注册成功
    alert('注册成功！');
    showLoading(registerForm.querySelector('button[type="submit"]'));
    // 延迟2秒后跳转
    setTimeout(() => {
        hideLoading(registerForm.querySelector('button[type="submit"]'));
        localStorage.setItem('token', 'demo-token');
        checkAuth();
    }, 2000);
});

// 显示错误信息
function showError(field, message) {
    const errorElement = document.querySelector(`[data-error="${field}"]`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// 显示加载动画
function showLoading(button) {
    button.classList.add('loading');
    button.disabled = true;
}

// 隐藏加载动画
function hideLoading(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

// 初始化检查登录状态
checkAuth();

// 初始化应用状态
document.addEventListener('DOMContentLoaded', () => {
    // 默认显示登录界面，隐藏主应用内容
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';

    // 登录表单提交处理
    document.querySelectorAll('.auth-form form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // 模拟登录成功
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
        });
    });

    // 切换登录/注册表单
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('loginForm').classList.add('active');
    });

    // 切换密码登录/验证码登录
    document.querySelectorAll('.form-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            document.querySelectorAll('.form-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新表单显示
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    initCharts();
    updateTimeline();
    initHotActivitiesScroll();
});

// 活动卡片点击处理
document.querySelectorAll('.hot-activity-card, .activity-grid-item').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        const desc = card.querySelector('p').textContent;
        const date = card.querySelector('.activity-info span:first-child').textContent;
        const location = card.querySelector('.activity-info span:last-child').textContent;
        const image = card.querySelector('img').src;
        
        // 创建活动详情模态框
        const modal = document.createElement('div');
        modal.className = 'modal activity-detail-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="activity-detail-image">
                    <img src="${image}" alt="${title}">
                </div>
                <div class="activity-detail-content">
                    <h2>${title}</h2>
                    <p class="activity-detail-desc">${desc}</p>
                    <div class="activity-detail-info">
                        <div class="info-item">
                            <i class="anticon anticon-calendar"></i>
                            <span>${date}</span>
                        </div>
                        <div class="info-item">
                            <i class="anticon anticon-environment"></i>
                            <span>${location}</span>
                        </div>
                    </div>
                    <div class="activity-detail-actions">
                        <button class="join-btn">立即报名</button>
                        <button class="share-btn">分享活动</button>
                    </div>
                </div>
                <button class="close-btn">&times;</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
        
        // 关闭模态框
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'close-btn') {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        // 报名按钮点击
        modal.querySelector('.join-btn').addEventListener('click', () => {
            alert('报名成功！');
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
        
        // 分享按钮点击
        modal.querySelector('.share-btn').addEventListener('click', () => {
            alert('分享功能开发中...');
        });
    });
});

// 初始化热门活动滚动
function initHotActivitiesScroll() {
    const scrollContainer = document.querySelector('.hot-activities-scroll');
    const cards = document.querySelectorAll('.hot-activity-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    // 显示指定索引的卡片
    function showCard(index) {
        cards.forEach(card => card.style.display = 'none');
        cards[index].style.display = 'block';
        
        // 更新点指示器状态
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentIndex = index;
    }

    // 点击点指示器切换卡片
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showCard(index);
        });
    });

    // 自动滚动
    let autoScrollInterval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % cards.length;
        showCard(nextIndex);
    }, 3000);

    // 触摸事件处理
    let touchStartX = 0;
    let touchEndX = 0;

    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(autoScrollInterval);
    });

    scrollContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) { // 滑动距离超过50px才触发
            if (diff > 0) {
                // 向左滑动，显示下一张
                let nextIndex = (currentIndex + 1) % cards.length;
                showCard(nextIndex);
            } else {
                // 向右滑动，显示上一张
                let prevIndex = (currentIndex - 1 + cards.length) % cards.length;
                showCard(prevIndex);
            }
        }

        // 重新开始自动滚动
        autoScrollInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % cards.length;
            showCard(nextIndex);
        }, 3000);
    });
}

// 活动详情相关
function showActivityDetail(activityId) {
    // 如果已经存在模态框，先移除它
    const existingModal = document.getElementById('activityDetailModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 更新活动详情内容
    updateActivityDetail(activityId);
}

function closeActivityDetail() {
    const modal = document.getElementById('activityDetailModal');
    if (!modal) return;
    
    // 移除模态框
    modal.classList.remove('active');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

function updateActivityDetail(activityId) {
    const activityDetails = {
        'hot1': {
            title: '红色文化传承行',
            time: '2024-03-15 14:00-17:00',
            location: '革命纪念馆',
            participants: '60人',
            type: '思政实践',
            description: '本次活动将带领同学们参观革命纪念馆，深入了解革命历史，传承红色基因。通过实地参观、讲解互动等形式，加深对党史的理解，培养爱国主义情怀。',
            schedule: [
                '14:00-14:30 集合签到',
                '14:30-16:00 参观纪念馆',
                '16:00-16:30 互动交流',
                '16:30-17:00 总结分享'
            ],
            bgClass: 'bg-red'
        },
        'hot2': {
            title: '乡村振兴调研实践',
            time: '2024-03-20 09:00-17:00',
            location: '农村实践基地',
            participants: '40人',
            type: '社会实践',
            description: '组织学生深入农村基层，开展乡村振兴调研，了解农村发展现状，为乡村振兴建言献策。通过实地走访、座谈交流等形式，加深对乡村振兴战略的理解。',
            schedule: [
                '09:00-09:30 集合出发',
                '10:00-12:00 实地调研',
                '12:00-14:00 午餐休息',
                '14:00-16:00 座谈交流',
                '16:00-17:00 返程总结'
            ],
            bgClass: 'bg-green'
        },
        'hot3': {
            title: '"青春志愿行"服务活动',
            time: '2024-03-25 09:00-12:00',
            location: '社区服务中心',
            participants: '35人',
            type: '志愿服务',
            description: '组织学生深入社区，开展志愿服务活动，包括环境清洁、老人关爱、文化宣传等，培养社会责任感，践行社会主义核心价值观。',
            schedule: [
                '09:00-09:30 集合签到',
                '09:30-11:30 分组开展服务',
                '11:30-12:00 总结分享'
            ],
            bgClass: 'bg-blue'
        },
        'hot4': {
            title: '党史学习专题讲座',
            time: '2024-03-28 19:00-21:00',
            location: '学术报告厅',
            participants: '120人',
            type: '理论学习',
            description: '邀请党史专家进行专题讲座，深入解读党的百年奋斗历程，帮助青年学生更好地理解党的历史，增强党性修养。',
            schedule: [
                '19:00-19:10 开场介绍',
                '19:10-20:30 主题讲座',
                '20:30-21:00 互动交流'
            ],
            bgClass: 'bg-purple'
        },
        'hot5': {
            title: '青年发展论坛',
            time: '2024-04-01 14:00-17:00',
            location: '会议中心',
            participants: '80人',
            type: '学术交流',
            description: '邀请优秀青年代表和专家学者，共同探讨新时代青年的责任与担当，分享成长经验，激发青年学生的奋斗精神。',
            schedule: [
                '14:00-14:30 开场致辞',
                '14:30-15:30 主题分享',
                '15:30-16:00 茶歇交流',
                '16:00-17:00 圆桌讨论'
            ],
            bgClass: 'bg-orange'
        },
        'activity1': {
            title: '红色文化传承行',
            time: '2024-03-15 14:00-17:00',
            location: '校史馆',
            participants: '50人',
            type: '思政实践',
            description: '本次活动将带领同学们参观校史馆，了解学校发展历程中的红色故事，传承红色基因。通过实地参观、讲解互动等形式，加深对党史、校史的理解，培养爱国主义情怀。',
            schedule: [
                '14:00-14:30 集合签到',
                '14:30-16:00 参观校史馆',
                '16:00-16:30 互动交流',
                '16:30-17:00 总结分享'
            ],
            bgClass: 'bg-cyan'
        },
        'activity2': {
            title: '社区志愿服务日',
            time: '2024-03-20 09:00-12:00',
            location: '社区服务中心',
            participants: '30人',
            type: '志愿服务',
            description: '组织学生深入社区，开展志愿服务活动，包括环境清洁、老人关爱、文化宣传等，培养社会责任感。',
            schedule: [
                '09:00-09:30 集合签到',
                '09:30-11:30 分组开展服务',
                '11:30-12:00 总结分享'
            ],
            bgClass: 'bg-teal'
        },
        'activity3': {
            title: '青年理论学习会',
            time: '2024-03-25 19:00-21:00',
            location: '图书馆报告厅',
            participants: '100人',
            type: '理论学习',
            description: '邀请专家学者进行理论讲座，深入解读党的创新理论，提升青年学生的理论素养。',
            schedule: [
                '19:00-19:10 开场介绍',
                '19:10-20:30 主题讲座',
                '20:30-21:00 互动交流'
            ],
            bgClass: 'bg-indigo'
        },
        'activity4': {
            title: '乡村振兴调研',
            time: '2024-04-01 08:00-17:00',
            location: '周边乡村',
            participants: '40人',
            type: '社会实践',
            description: '组织学生深入农村，开展乡村振兴调研，了解农村发展现状，为乡村振兴建言献策。',
            schedule: [
                '08:00-08:30 集合出发',
                '09:00-12:00 实地调研',
                '12:00-14:00 午餐休息',
                '14:00-16:00 座谈交流',
                '16:00-17:00 返程总结'
            ],
            bgClass: 'bg-pink'
        },
        'activity5': {
            title: '党史知识竞赛',
            time: '2024-04-05 14:00-17:00',
            location: '学生活动中心',
            participants: '80人',
            type: '思政实践',
            description: '通过知识竞赛的形式，检验和巩固同学们的党史学习成果，激发学习热情，增强党性修养。',
            schedule: [
                '14:00-14:30 签到入场',
                '14:30-15:30 初赛环节',
                '15:30-16:00 中场休息',
                '16:00-17:00 决赛环节'
            ],
            bgClass: 'bg-red'
        },
        'activity6': {
            title: '校园环保行动',
            time: '2024-04-10 09:00-12:00',
            location: '校园各处',
            participants: '60人',
            type: '志愿服务',
            description: '组织学生开展校园环境清洁、垃圾分类宣传等环保活动，提升环保意识，共建绿色校园。',
            schedule: [
                '09:00-09:30 集合分组',
                '09:30-11:30 环保行动',
                '11:30-12:00 总结分享'
            ],
            bgClass: 'bg-green'
        },
        'activity7': {
            title: '青年创新创业赛',
            time: '2024-04-18 13:00-17:00',
            location: '创新创业中心',
            participants: '70人',
            type: '创新创业',
            description: '本次大赛旨在激发大学生创新创业热情，提升实践能力，邀请多位创业导师现场点评。',
            schedule: [
                '13:00-13:30 签到',
                '13:30-15:30 创业项目路演',
                '15:30-16:30 导师点评',
                '16:30-17:00 颁奖总结'
            ],
            bgClass: 'bg-blue'
        },
        'activity8': {
            title: '高校文化艺术节',
            time: '2024-04-25 18:00-21:00',
            location: '大学生活动广场',
            participants: '200人',
            type: '文体活动',
            description: '丰富多彩的文艺演出和艺术展览，展现高校学子的青春风采和艺术才华。',
            schedule: [
                '18:00-18:30 开幕式',
                '18:30-20:30 文艺演出',
                '20:30-21:00 闭幕总结'
            ],
            bgClass: 'bg-purple'
        }
    };

    const detail = activityDetails[activityId];
    if (!detail) return;

    // 创建新的模态框
    const modal = document.createElement('div');
    modal.id = 'activityDetailModal';
    modal.className = 'modal activity-detail-modal';

    // 构建新的模态框内容结构
    modal.innerHTML = `
        <div class="modal-content">
            <div class="activity-header-bg ${detail.bgClass}">
                <button class="close-btn">&times;</button>
                <h2>${detail.title}</h2>
            </div>
            <div class="activity-body-content">
                <div class="activity-detail-info">
                    <div class="info-item">
                        <i class="anticon anticon-calendar"></i>
                        <span>活动时间：${detail.time}</span>
                    </div>
                    <div class="info-item">
                        <i class="anticon anticon-environment"></i>
                        <span>活动地点：${detail.location}</span>
                    </div>
                    <div class="info-item">
                        <i class="anticon anticon-user"></i>
                        <span>参与人数：${detail.participants}</span>
                    </div>
                    <div class="info-item">
                        <i class="anticon anticon-tag"></i>
                        <span>活动类型：${detail.type}</span>
                    </div>
                </div>
                <div class="activity-detail-desc">
                    <h3>活动介绍</h3>
                    <p>${detail.description}</p>
                    <h3>活动安排</h3>
                    ${detail.schedule.map(item => `<p>${item}</p>`).join('')}
                </div>
                <div class="activity-detail-actions">
                    <button class="join-btn" data-action="join">立即报名</button>
                    <button class="join-redirect-btn" data-action="join-redirect">报名并查看</button>
                    <button class="share-btn" data-action="share">分享活动</button>
                </div>
            </div>
        </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .activity-detail-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .activity-detail-modal.active {
            opacity: 1;
        }

        .modal-content {
            position: relative;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transform: translateY(20px);
            transition: transform 0.3s;
        }

        .activity-detail-modal.active .modal-content {
            transform: translateY(0);
        }

        .activity-header-bg {
            position: relative;
            width: 100%;
            height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 20px;
            color: white;
            box-sizing: border-box;
            z-index: 1;
        }

        .activity-header-bg h2 {
            margin: 0;
            font-size: 24px;
        }

        .activity-body-content {
            flex-grow: 1;
            padding: 20px;
            background: white;
            position: relative;
            z-index: 2;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #2D5C9E #f0f0f0;
        }

        .activity-detail-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .join-btn, .join-redirect-btn, .share-btn {
            flex: 1;
            min-width: 120px;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: opacity 0.3s;
        }

        .join-btn {
            background: #2D5C9E;
            color: white;
        }

        .join-redirect-btn {
            background: #4CAF50;
            color: white;
        }

        .share-btn {
            background: #f5f5f5;
            color: #333;
        }

        .join-btn:hover, .join-redirect-btn:hover, .share-btn:hover {
            opacity: 0.9;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // 添加事件监听器
    const closeBtn = modal.querySelector('.close-btn');
    const actionButtons = modal.querySelectorAll('.activity-detail-actions button');

    // 关闭按钮点击事件
    if (closeBtn) {
        closeBtn.addEventListener('click', closeActivityDetail);
    }

    // 按钮点击事件处理
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            switch (action) {
                case 'join':
                    // 立即报名
                    const isAlreadyJoined = joinedActivities.some(a => a.title === detail.title);
                    if (isAlreadyJoined) {
                        alert('您已经报名过此活动！');
                        return;
                    }
                    
                    const newJoinedActivity = {
                        id: 'joined' + (joinedActivities.length + 1),
                        title: detail.title,
                        time: detail.time,
                        location: detail.location,
                        status: 'upcoming',
                        qrCode: null
                    };
                    
                    joinedActivities.push(newJoinedActivity);
                    closeActivityDetail();
                    alert('报名成功！');
                    break;

                case 'join-redirect':
                    // 报名并查看
                    const isAlreadyJoined2 = joinedActivities.some(a => a.title === detail.title);
                    if (isAlreadyJoined2) {
                        alert('您已经报名过此活动！');
                        return;
                    }
                    
                    const newJoinedActivity2 = {
                        id: 'joined' + (joinedActivities.length + 1),
                        title: detail.title,
                        time: detail.time,
                        location: detail.location,
                        status: 'upcoming',
                        qrCode: null
                    };
                    
                    joinedActivities.push(newJoinedActivity2);
                    closeActivityDetail();
                    
                    // 切换到活动页面
                    const pages = document.querySelectorAll('.page');
                    const navItems = document.querySelectorAll('.nav-item');
                    
                    // 隐藏所有页面
                    pages.forEach(page => {
                        page.style.display = 'none';
                        page.classList.remove('active');
                    });
                    
                    // 显示活动页面
                    const activitiesPage = document.getElementById('activities');
                    if (activitiesPage) {
                        activitiesPage.style.display = 'block';
                        activitiesPage.classList.add('active');
                    }
                    
                    // 更新导航栏状态
                    navItems.forEach(item => item.classList.remove('active'));
                    const activitiesNav = document.querySelector('.nav-item[data-page="activities"]');
                    if (activitiesNav) {
                        activitiesNav.classList.add('active');
                    }
                    
                    // 切换到"我报名的"标签
                    const tabButtons = document.querySelectorAll('.activities-tabs .tab-btn');
                    const tabContents = document.querySelectorAll('.activities-content');
                    
                    // 更新标签按钮状态
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    const joinedTab = document.querySelector('.activities-tabs .tab-btn[data-tab="joined"]');
                    if (joinedTab) {
                        joinedTab.classList.add('active');
                    }
                    
                    // 更新内容显示
                    tabContents.forEach(content => {
                        content.style.display = 'none';
                        content.classList.remove('active');
                    });
                    const joinedContent = document.getElementById('joined');
                    if (joinedContent) {
                        joinedContent.style.display = 'block';
                        joinedContent.classList.add('active');
                    }
                    
                    // 更新活动列表
                    updateActivityList('joined');
                    alert('报名成功！');
                    break;

                case 'share':
                    // 分享活动
                    alert('链接已复制到剪切板！');
                    break;
            }
        });
    });

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeActivityDetail();
        }
    });

    // 显示模态框
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// 活动管理相关
let hostedActivities = [
    {
        id: 'hosted1',
        title: '青年创新创业讲座',
        time: '2024-04-20 14:00',
        location: '创新创业中心',
        maxParticipants: 100,
        currentParticipants: 45,
        status: 'pending', // pending, approved, rejected
        description: '邀请知名企业家分享创业经验',
        image: 'path/to/image1.jpg'
    },
    {
        id: 'hosted2',
        title: '校园环保行动',
        time: '2024-04-25 09:00',
        location: '校园各处',
        maxParticipants: 50,
        currentParticipants: 30,
        status: 'approved',
        description: '组织学生开展校园环境清洁活动',
        image: 'path/to/image2.jpg'
    }
];

let joinedActivities = [
    {
        id: 'joined1',
        title: '红色文化传承行',
        time: '2024-04-15 14:00',
        location: '革命纪念馆',
        status: 'upcoming', // upcoming, completed, cancelled
        qrCode: null
    },
    {
        id: 'joined2',
        title: '乡村振兴调研',
        time: '2024-04-18 09:00',
        location: '农村实践基地',
        status: 'upcoming',
        qrCode: null
    }
];

// 更新活动列表
function updateActivityList(type) {
    const container = document.querySelector(`#${type} .activity-list`);
    if (!container) return;
    
    const activities = type === 'hosted' ? hostedActivities : joinedActivities;
    
    container.innerHTML = activities.map(activity => {
        if (type === 'hosted') {
            return `
                <div class="activity-card">
                    <h3>${activity.title}</h3>
                    <div class="activity-info">
                        <p><i class="anticon anticon-calendar"></i> ${activity.time}</p>
                        <p><i class="anticon anticon-environment"></i> ${activity.location}</p>
                        <p><i class="anticon anticon-user"></i> ${activity.currentParticipants}/${activity.maxParticipants}人</p>
                        <p>状态：${getStatusText(activity.status)}</p>
                    </div>
                    <div class="activity-actions">
                        ${activity.status === 'approved' ? `
                            <button onclick="showScanQRCode('${activity.id}')" class="checkin-btn">扫码签到</button>
                            <button onclick="cancelActivity('${activity.id}')" class="cancel-btn">取消活动</button>
                        ` : ''}
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="activity-card">
                    <h3>${activity.title}</h3>
                    <div class="activity-info">
                        <p><i class="anticon anticon-calendar"></i> ${activity.time}</p>
                        <p><i class="anticon anticon-environment"></i> ${activity.location}</p>
                        <p>状态：${getStatusText(activity.status)}</p>
                    </div>
                    <div class="activity-actions">
                        ${activity.status === 'upcoming' ? `
                            <button onclick="showQRCode('${activity.id}')" class="checkin-btn">签到二维码</button>
                            <button onclick="cancelJoin('${activity.id}')" class="cancel-btn">取消报名</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }).join('');

    // 为所有按钮添加事件监听器
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
        const action = button.textContent.trim();
        if (action === '签到二维码') {
            button.addEventListener('click', () => {
                const activityId = button.closest('.activity-card').querySelector('h3').textContent;
                showQRCode(activityId);
            });
        }
    });
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已拒绝',
        'upcoming': '即将开始',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

// 显示签到二维码
function showQRCode(activityId) {
    // 如果已经存在模态框，先移除它
    const existingModal = document.getElementById('qrCodeModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'qrCodeModal';
    modal.className = 'modal qr-code-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>签到二维码</h3>
                <button class="close-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="qr-code-container">
                    <div style="width: 200px; height: 200px; background: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                        签到二维码
                    </div>
                </div>
                <div class="validity-notice">
                    <i class="anticon anticon-clock-circle"></i>
                    <span>二维码5分钟内有效</span>
                </div>
            </div>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .qr-code-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .qr-code-modal.active {
            opacity: 1;
        }

        .qr-code-modal .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            overflow: hidden;
            transform: translateY(20px);
            transition: transform 0.3s;
        }

        .qr-code-modal.active .modal-content {
            transform: translateY(0);
        }

        .qr-code-modal .modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .qr-code-modal .modal-header h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }

        .qr-code-modal .close-btn {
            background: none;
            border: none;
            padding: 4px;
            cursor: pointer;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .qr-code-modal .close-btn:hover {
            background: #f5f5f5;
            color: #333;
        }

        .qr-code-modal .close-btn svg {
            width: 24px;
            height: 24px;
        }

        .qr-code-modal .modal-body {
            padding: 20px;
            text-align: center;
        }

        .qr-code-modal .qr-code-container {
            margin: 20px 0;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 添加事件监听器
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });

    // 显示模态框
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// 关闭二维码模态框
function closeQRCodeModal() {
    document.getElementById('qrCodeModal').classList.remove('active');
}

// 关闭创建活动模态框
function closeCreateActivityModal() {
    const modal = document.getElementById('createActivityModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 取消活动
function cancelActivity(activityId) {
    if (confirm('确定要取消此活动吗？')) {
        const activity = hostedActivities.find(a => a.id === activityId);
        if (activity) {
            activity.status = 'cancelled';
            updateActivityList('hosted');
        }
    }
}

// 取消报名
function cancelJoin(activityId) {
    if (confirm('确定要取消报名吗？')) {
        const activity = joinedActivities.find(a => a.id === activityId);
        if (activity) {
            activity.status = 'cancelled';
            updateActivityList('joined');
        }
    }
}

// 显示扫码签到界面
function showScanQRCode(activityId) {
    // 如果已经存在模态框，先移除它
    const existingModal = document.getElementById('scanQRCodeModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'scanQRCodeModal';
    modal.className = 'modal qr-code-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>扫码签到</h3>
                <button class="close-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="qr-code-container">
                    <div style="width: 200px; height: 200px; background: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                        请出示签到二维码
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .qr-code-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .qr-code-modal.active {
            opacity: 1;
        }

        .qr-code-modal .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            overflow: hidden;
            transform: translateY(20px);
            transition: transform 0.3s;
        }

        .qr-code-modal.active .modal-content {
            transform: translateY(0);
        }

        .qr-code-modal .modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .qr-code-modal .modal-header h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }

        .qr-code-modal .close-btn {
            background: none;
            border: none;
            padding: 4px;
            cursor: pointer;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .qr-code-modal .close-btn:hover {
            background: #f5f5f5;
            color: #333;
        }

        .qr-code-modal .close-btn svg {
            width: 24px;
            height: 24px;
        }

        .qr-code-modal .modal-body {
            padding: 20px;
            text-align: center;
        }

        .qr-code-modal .qr-code-container {
            margin: 20px 0;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 添加事件监听器
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });

    // 显示模态框
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// 初始化设置页面
function initSettingsPage() {
    // 移除所有现有的事件监听器
    const avatarEdit = document.querySelector('.avatar-edit');
    if (avatarEdit) {
        const newAvatarEdit = avatarEdit.cloneNode(true);
        avatarEdit.parentNode.replaceChild(newAvatarEdit, avatarEdit);
        
        newAvatarEdit.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.querySelector('.avatar').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // 用户名点击事件
    const usernameElement = document.querySelector('.user-id');
    if (usernameElement) {
        const newUsernameElement = usernameElement.cloneNode(true);
        usernameElement.parentNode.replaceChild(newUsernameElement, usernameElement);
        
        newUsernameElement.addEventListener('click', () => {
            const newUsername = prompt('请输入新的用户名称：');
            if (newUsername && newUsername.trim()) {
                document.querySelector('.username').textContent = newUsername.trim();
                // 这里可以添加保存到服务器的代码
            }
        });
    }

    // 设置项点击事件
    const settingsItems = document.querySelectorAll('.settings-item');
    settingsItems.forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', () => {
            const settingName = newItem.querySelector('span').textContent;
            switch(settingName) {
                case '修改密码':
                    showChangePasswordModal();
                    break;
                case '更换绑定手机号':
                    showChangePhoneModal();
                    break;
                case '更换实名认证':
                    showChangeRealNameModal();
                    break;
                case '消息通知':
                    showNotificationSettings();
                    break;
                case '隐私设置':
                    showPrivacySettings();
                    break;
                case '清除缓存':
                    clearCache();
                    break;
                case '用户协议':
                    showUserAgreement();
                    break;
                case '隐私政策':
                    showPrivacyPolicy();
                    break;
                case '关于我们':
                    showAboutUs();
                    break;
            }
        });
    });

    // 退出登录
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        
        newLogoutBtn.addEventListener('click', () => {
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('token');
                window.location.reload();
            }
        });
    }
}

// 显示更换手机号模态框
function showChangePhoneModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>更换绑定手机号</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="changePhoneForm">
                    <div class="form-group">
                        <input type="tel" name="oldPhone" placeholder="请输入当前手机号" required pattern="[0-9]{11}">
                    </div>
                    <div class="form-group">
                        <input type="tel" name="newPhone" placeholder="请输入新手机号" required pattern="[0-9]{11}">
                    </div>
                    <div class="form-group sms-group">
                        <input type="text" name="code" placeholder="请输入验证码" required pattern="[0-9]{6}">
                        <button type="button" class="sms-btn">获取验证码</button>
                    </div>
                    <button type="submit" class="submit-btn">确认更换</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    // 表单提交处理
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // 这里添加更换手机号的逻辑
        alert('手机号更换成功！');
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    // 验证码按钮点击事件
    const smsBtn = modal.querySelector('.sms-btn');
    smsBtn.addEventListener('click', () => {
        const newPhone = modal.querySelector('input[name="newPhone"]').value;
        if (!/^[0-9]{11}$/.test(newPhone)) {
            alert('请输入正确的手机号');
            return;
        }
        // 这里添加发送验证码的逻辑
        let countdown = 60;
        smsBtn.disabled = true;
        const timer = setInterval(() => {
            smsBtn.textContent = `${countdown}秒后重试`;
            countdown--;
            if (countdown < 0) {
                clearInterval(timer);
                smsBtn.disabled = false;
                smsBtn.textContent = '获取验证码';
            }
        }, 1000);
    });
}

// 显示更换实名认证模态框
function showChangeRealNameModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>更换实名认证</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="changeRealNameForm">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="请输入真实姓名" required>
                    </div>
                    <div class="form-group">
                        <input type="text" name="idCard" placeholder="请输入身份证号" required pattern="[0-9Xx]{18}">
                    </div>
                    <div class="form-group">
                        <input type="file" name="idCardFront" accept="image/*" required>
                        <label>身份证正面照片</label>
                    </div>
                    <div class="form-group">
                        <input type="file" name="idCardBack" accept="image/*" required>
                        <label>身份证反面照片</label>
                    </div>
                    <button type="submit" class="submit-btn">提交认证</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    // 表单提交处理
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // 这里添加实名认证的逻辑
        alert('实名认证信息已提交，请等待审核！');
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// 关闭模态框
function closeModal(element) {
    const modal = element.closest('.modal');
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

// 显示修改密码模态框
function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>修改密码</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="changePasswordForm">
                    <div class="form-group">
                        <input type="password" name="oldPassword" placeholder="原密码" required>
                    </div>
                    <div class="form-group">
                        <input type="password" name="newPassword" placeholder="新密码" required>
                    </div>
                    <div class="form-group">
                        <input type="password" name="confirmPassword" placeholder="确认新密码" required>
                    </div>
                    <button type="submit" class="submit-btn">确认修改</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    // 表单提交
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        // 这里添加修改密码的逻辑
        alert('密码修改成功！');
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// 显示消息通知设置
function showNotificationSettings() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>消息通知</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="settings-item">
                    <span>活动提醒</span>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="settings-item">
                    <span>学习提醒</span>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="settings-item">
                    <span>系统通知</span>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// 显示隐私设置
function showPrivacySettings() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>隐私设置</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="settings-item">
                    <span>允许查看我的活动记录</span>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="settings-item">
                    <span>允许查看我的学习记录</span>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="settings-item">
                    <span>允许推送个性化内容</span>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// 清除缓存
function clearCache() {
    if (confirm('确定要清除缓存吗？')) {
        // 这里添加清除缓存的逻辑
        alert('缓存已清除！');
    }
}

// 显示用户协议
function showUserAgreement() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>用户协议</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="agreement-content">
                    <h4>思链未来用户协议</h4>
                    <p>欢迎使用思链未来！</p>
                    <p>本协议是您与思链未来之间关于使用本平台服务所订立的协议。</p>
                    <!-- 这里添加更多协议内容 -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// 显示隐私政策
function showPrivacyPolicy() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>隐私政策</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="privacy-content">
                    <h4>思链未来隐私政策</h4>
                    <p>我们重视您的隐私保护</p>
                    <p>本政策描述了思链未来如何收集、使用和保护您的个人信息。</p>
                    <!-- 这里添加更多隐私政策内容 -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// 显示关于我们
function showAboutUs() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>关于我们</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="about-content">
                    <img src="logo.png" alt="思链未来" class="about-logo">
                    <h4>思链未来</h4>
                    <p>版本：v1.0.0</p>
                    <p>思链未来是一款基于区块链技术的教育管理平台，致力于为学生提供安全、可信的学习记录管理服务。</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化导航
    initNavigation();
    
    // 初始化活动页面
    initActivitiesPage();
    
    // 初始化设置页面
    initSettingsPage();
    
    // 初始化其他功能
    initCharts();
    updateTimeline();
    initHotActivitiesScroll();
});

// ... existing code ...