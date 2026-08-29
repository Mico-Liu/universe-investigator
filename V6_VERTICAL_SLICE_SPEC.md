# V6_VERTICAL_SLICE_SPEC.md
# 《宇宙科学调查局》V6.1
## Vertical Slice 产品与内容实施规格 V1.0

**上位文档：** `V6_MASTER_BLUEPRINT_FINAL.md`  
**状态：** FROZEN FOR IMPLEMENTATION  
**目的：** 定义第一个真正可玩的产品必须包含什么，以及明确不包含什么。

---

# 1. Vertical Slice唯一目标

Vertical Slice不是：

- 完整游戏试玩版
- 第一章完整版
- 技术Demo
- 美术Demo
- AI聊天Demo

它只回答一个问题：

# 一个9–12岁的玩家，在利用NOVA、科学工具、证据和模拟破解宇宙谜案以后，会不会主动想继续调查下一个案件？

如果答案不是明显的：

# YES

则不得进入30案规模化生产。

---

# 2. 产品验证公式

Vertical Slice必须同时证明：

# FUN
好玩。

# CURIOSITY
让玩家想知道为什么。

# AGENCY
结论是玩家自己做出的。

# SCIENCE
科学关系正确。

四项缺一不可。

---

# 3. Vertical Slice总体构成

首个Vertical Slice只包含：

## 一个最小基地

# NEXUS

## 一个AI伙伴

# NOVA · 星穹智核

## 一个玩家身份

# ORIGIN见习调查员

## 三个正式案件

### CASE 01
《来自宇宙的石头》

### CASE 05
《消失的火星探测器》

### CASE 19
《看不见的怪兽》

## 36个首批Knowledge Graph节点

## 三大类核心模拟系统

### Matter Investigation
物质调查。

### Planet Investigation
行星调查。

### Compact Object Investigation
致密天体调查。

---

# 4. 为什么选择这三个案件

三个案件必须验证完全不同的科学侦探能力。

| 案件 | 主要调查方式 | 核心验证 |
|---|---|---|
| CASE01 | 实验室、材料、成分 | 多证据判断未知物体 |
| CASE05 | 地形、运动、时间、空间 | 多因素空间调查 |
| CASE19 | 间接观测、模型、引力 | 高级证据推理 |

如果三个案件需要三套完全不同的案件系统：

# 架构失败。

如果能够共享同一个Investigation Runtime：

# 核心架构成立。

---

# 5. Vertical Slice体验结构

玩家第一次进入游戏：

```text
建立调查员身份
↓
进入NEXUS
↓
激活NOVA
↓
收到第一个异常案件
↓
CASE01
↓
返回NEXUS
↓
研究舱出现第一件调查成果
↓
CASE05
↓
NEXUS能力升级
↓
CASE19
↓
完成Vertical Slice
```

这不是三张关卡菜单。

必须让玩家感觉：

# 我正在一个不断成长的科学调查基地里工作。

---

# 6. NEXUS最小范围

Vertical Slice只制作三个主要空间。

## 6.1 Command Deck｜深空指挥中心

负责：

- 玩家首次进入
- 案件入口
- ORIGIN TRACE初步提示
- 当前调查状态
- 基地成长反馈

核心视觉物体：

# HOLO-COSMOS

一个大型全息宇宙/任务空间。

## 6.2 NOVA Core｜星穹智核舱

负责：

- NOVA正式出现
- 高级Evidence查看
- Model Board
- Investigation Replay
- Challenge NOVA

不需要制作完整巨大基地。

## 6.3 Personal Research Bay｜个人研究舱

首版只需要支持：

- X-001样本收藏
- CASE05调查成果
- CASE19发现档案
- 三份DSI调查报告

目标：

# 案件结果真正进入玩家空间。

---

# 7. Vertical Slice不制作的基地空间

暂不正式制作：

- 完整Observatory
- Creation Bay
- 完整Simulation Deck
- 大型走廊系统
- NPC生活区
- 完整Material Lab永久基地结构

CASE01的Material Lab作为：

# 案件专用Hero Scene

制作。

---

# 8. 玩家身份最小实现

支持：

- Investigator Nickname
- 自动生成Investigator ID
- 3–5种基础Avatar选项
- 基础调查服
- 玩家档案

不做：

- 高精度捏脸
- 照片生成Avatar
- 服装商城
- 大量装备
- 社交主页

---

# 9. NOVA Vertical Slice范围

必须支持以下核心行为：

## SCAN
分析当前对象。

## COMPARE
比较证据或数据。

## SIMULATE
调用当前案件允许的科学模拟。

## EXPLAIN
解释当前已经允许知道的内容。

## HINT
分级提示。

## CHALLENGE NOVA
让玩家查看：

- 依据
- 来源
- 确定程度
- 替代解释
- 重新验证

---

# 10. NOVA第一版不是生成式AI

Vertical Slice默认：

# Offline NOVA

使用：

- Case State
- Evidence State
- Knowledge Graph
- NOVA Policy
- Reviewed Templates

必须在：

# 完全没有在线大模型

的情况下完整通关三个案件。

---

# 11. NOVA帮助等级

## Level 0
不主动提示。

## Level 1
提醒玩家遗漏了什么观察。

## Level 2
建议一种方法。

## Level 3
帮助执行机械性操作或计算。

不存在：

# Level 4：告诉答案。

---

# 12. Universal Investigation Loop

三个案件必须共享：

```text
DETECT
↓
SCAN
↓
EVIDENCE
↓
HYPOTHESIS
↓
SIMULATE
↓
DECIDE
↓
VERIFY
↓
DEBRIEF
```

---

# 13. Case Runtime正式状态

第一版建议支持：

```text
BRIEFING
DETECTING
INVESTIGATING
HYPOTHESIZING
SIMULATING
CLAIMING
VERIFYING
DEBRIEFING
COMPLETED
```

不同案件不要求每次严格线性经过所有状态。

CASE19允许：

# Investigation ↔ Hypothesis ↔ Simulation

多次循环。

---

# 14. CASE01｜《来自宇宙的石头》

建议游戏时长：

# 15–18分钟

主要目标：

> 判断Sample X-001到底是什么。

核心体验：

# “一个很普通的石头，里面藏着宇宙历史。”

---

# 15. CASE01前30秒

进入Material Lab。

样本已经悬浮在Sample Chamber中。

它：

- 灰黑
- 普通
- 不发光
- 没有神秘特效

NOVA只说必要信息。

玩家首先获得：

# 自由观察时间。

必须先让玩家产生：

> “这东西有什么特别？”

---

# 16. CASE01核心工具

按调查进度逐步出现：

### LOOK
观察。

### DENSITY MAP
密度分析。

### MAG-SCAN
磁性扫描。

### ELEMENTAL SPECTROMETER
元素分析。

### MATTER LENS
内部结构。

不要一次把所有工具扔给玩家。

---

# 17. CASE01核心Evidence

至少包括：

### E01
表面异常结构。

### E02
密度数据。

### E03
磁性响应。

### E04
Fe/Ni元素特征。

### E05
金属相与硅酸盐相共存。

### E06
缺少明显人工加工特征。

---

# 18. CASE01竞争假设

至少包括：

### H01
普通地球岩石。

### H02
金属含量很高的陨石。

### H03
石铁混合型陨石候选。

### H04
人工材料。

---

# 19. CASE01关键规则

单独：

# 磁性

绝不能证明：

# “这是陨石。”

Strong Claim必须：

- 至少3条证据
- 至少2种Evidence Category
- 包含能够区分主要竞争模型的证据

---

# 20. CASE01核心WOW

# Spectrum Hall

启动元素分析时：

Material Lab逐渐暗下。

光谱空间扩展成大型数据环境。

玩家进入：

# “由光谱构成的空间”。

它必须成为Vertical Slice第一个真正的视觉记忆点。

---

# 21. CASE01 CERU

案件最终不是：

四选一。

玩家需要完成：

### Claim
它最可能是什么？

### Evidence
哪些证据最关键？

### Reasoning
为什么组合起来支持这个判断？

### Uncertainty
仍有什么无法完全确定？

儿童端不能显示CERU术语。

---

# 22. CASE01 Investigation Replay

结束后快速播放：

玩家最初猜测
→ 使用什么工具
→ 哪一条证据改变判断
→ 最终Claim

目标：

让玩家看到：

# “我是怎么查出来的。”

---

# 23. CASE05｜《消失的火星探测器》

建议游戏时长：

# 18–25分钟

核心问题：

> M-07到底去了哪里？

不是：

> 火星知识问答。

---

# 24. CASE05开场

最后一次已知位置和通讯突然中断。

玩家看到：

- 最后位置
- 时间
- 预计路线
- 剩余电量
- 环境情况

第一任务：

# 缩小搜索范围。

---

# 25. CASE05核心能力

玩家逐渐使用：

- 时间
- 速度
- 距离
- 航向
- 坡度
- 高程
- 沙尘
- 日照
- 能量
- 通讯视线

最终发现：

# 不是单一原因。

---

# 26. CASE05数字孪生

同一火星3D世界具有：

## Reality View
自然火星视觉。

## NOVA Twin View
叠加：

- 高程
- 坡度
- 路线
- 通讯
- 时间
- 搜索区域

二者平滑切换。

不能变成：

> 另外打开一张2D教学地图。

---

# 27. CASE05核心AHA

玩家不是：

> 搜遍整个火星找到探测器。

而是：

# 让“不可能的位置”越来越多。

最后：

只剩下很小区域。

---

# 28. CASE05科学结论

最终事件由多个因素共同造成，例如：

- 避开危险坡度
- 路线重新规划
- 沙尘降低太阳能输入
- 进入节能状态
- 峡谷遮挡通讯

核心能力：

# 多因素因果。

---

# 29. CASE19｜《看不见的怪兽》

建议游戏时长：

# 28–40分钟

Vertical Slice最高峰。

核心问题：

# “中心什么都看不到，为什么恒星都在绕着它运动？”

---

# 30. CASE19最重要规则

案件前约80%：

# 禁止直接展示漂亮黑洞。

玩家只能看到：

- 恒星
- 轨迹
- 光
- X-Ray
- 质量
- 透镜

最后：

推理成功以后才显示重建。

---

# 31. CASE19调查顺序

比前两个案件更开放。

玩家可以优先调查：

### MOTION
运动。

### LIGHT
光。

### HIGH ENERGY
高能信号。

### GRAVITY
引力影响。

目标：

# Agency显著升级。

---

# 32. CASE19竞争模型

初期至少包括：

- 暗弱普通星团
- 致密天体
- 中子星相关解释
- 未知大质量致密目标
- 观测误差

“黑洞”不应第一分钟直接被系统列成明显答案。

---

# 33. CASE19核心证据链

逐步包含：

- 恒星围绕共同不可见中心运动
- 推断出巨大中心质量
- 对应位置缺乏足够可见光
- 高能辐射信息
- 引力透镜/光路变化
- 竞争致密天体模型不匹配

---

# 34. CASE19 Model Fit

必须真实表现：

> 模型能解释多少证据。

不表现：

> 87%正确率。

默认：

- Weak
- Possible
- Strong
- Conflict

---

# 35. CASE19 Challenge NOVA高光

至少设计一次：

NOVA给出：

> 当前最符合数据的模型。

但玩家可以发现：

> 仍存在没有解释的一条证据。

要求进一步调查。

目标：

# AI很强，但最终科学判断仍需要人。

---

# 36. CASE19最终Claim

措辞：

# “R-193中心存在黑洞候选体。”

避免：

> “我们百分之百证明那里就是黑洞。”

---

# 37. CASE19最终Reveal

验证成功以后：

玩家主动选择：

# RECONSTRUCT MODEL

随后：

- 背景星光变形
- 中央暗区建立
- 光学透镜出现
- 在有物理依据时才出现吸积结构

目标：

# “终于看到刚刚被自己证明存在的东西。”

---

# 38. Vertical Slice 36个Knowledge Nodes

首批范围围绕三个案件。

建议分为：

### 物质与元素
约10。

### 空间、运动、地形
约8。

### 引力、轨道、光
约8。

### 数据、证据、模型
约10。

总计：

# 36。

---

# 39. Knowledge前台表现

不出现：

> “你学会了物理知识MAT-01。”

而显示：

> “你已经在两个案件中使用过密度分析。”

或者：

> “你已经能用运动反推看不见的质量。”

---

# 40. Vertical Slice科学透镜

后台支持七大Lens。

但三个案件只使用真正需要的。

CASE01：

- Pattern
- Structure & Function

CASE05：

- Cause & Effect
- Systems

CASE19：

- Systems & Models
- Cause & Effect
- Scale

儿童端通过科技模式表现。

---

# 41. Vertical Slice不制作的教育增强

暂缓：

- 6–8个完整Engineering Challenge
- 责任伦理支线
- 异步Peer Review
- 家长正式报告
- 完整Capability Profile

避免首版变重。

---

# 42. 视觉必须证明的五个WOW

Vertical Slice至少应有：

## WOW 1
NOVA第一次启动。

## WOW 2
Spectrum Hall。

## WOW 3
进入火星数字孪生。

## WOW 4
看到恒星绕着“什么都没有”的地方运动。

## WOW 5
黑洞重建Reveal。

---

# 43. Vertical Slice科学真实性要求

所有内容必须标识属于：

- OBSERVED
- RECONSTRUCTED
- SIMULATED
- ENHANCED
- HYPOTHESIS
- FICTION

玩家不一定时时看到文字，但系统数据必须有状态。

---

# 44. Fact Check要求

Vertical Slice上线测试前必须重点核验：

CASE01：

- 陨石分类
- 密度
- Fe/Ni
- 磁性
- 光谱分析
- 材料结构

CASE05：

- 火星环境
- 沙尘
- 太阳能
- 地形
- 通讯遮挡
- Rover运动

CASE19：

- 轨道质量反演
- 黑洞候选判断
- X-Ray作用
- 引力透镜
- 中子星竞争模型
- 黑洞重建画面

---

# 45. 性能目标

第一主目标：

# 桌面Chrome / Edge。

STANDARD模式：

目标：

# 60 FPS

低性能机器：

稳定：

# ≥30 FPS

科学结果不得随画质等级改变。

---

# 46. Save最小范围

支持：

- Investigator Profile
- 当前案件
- Evidence
- Hypothesis状态
- Claim
- Knowledge应用状态
- Discoveries
- Settings

必须有：

# schemaVersion

---

# 47. Vertical Slice明确不做

不制作：

- 完整30案
- 完整六章
- 168节点
- 小程序
- 云同步
- 账号体系
- 实时多人
- 大型社区
- 家长正式后台
- 完整真实观星
- Creation完整系统
- 玩家创建案件
- 完整TTS
- 语音识别
- 在线生成式NOVA

---

# 48. 用户测试

至少进行：

# 5–8名目标年龄真实玩家

测试。

优先观察真实行为。

不直接问：

> “你学到了什么？”

---

# 49. 核心行为指标

观察：

- 是否主动观察
- 是否自己选工具
- 是否提出猜测
- 是否改变Hypothesis
- 是否反复运行Simulation
- 是否只向NOVA索要答案
- 是否理解Evidence组合
- 是否主动继续深入
- 是否主动复述
- 是否想下一案

---

# 50. Gate A

CASE01完成后先进行：

# 第一体验闸门。

如果CASE01不好玩：

# 不开发正式CASE05资产。

---

# 51. GO

出现明显：

- 主动探索
- 自主推断
- 修改判断
- NOVA被当工具
- 想继续

进入下一阶段。

---

# 52. REWORK

如果：

> 画面漂亮但一直跟箭头操作。

重做：

# Investigation Design。

---

# 53. NO-GO

如果：

> 最大乐趣只是向NOVA问答案。

产品机制需要重大调整。

---

# 54. Vertical Slice最终验收

真正成功的结果：

玩家完成CASE19后：

不是说：

> “我学了黑洞知识。”

而是说：

# “我根本没看到那个黑洞，是从旁边那些星星怎么动推出来的。”

然后：

# “还有别的案子吗？”
